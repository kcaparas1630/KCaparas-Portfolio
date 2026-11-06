import 'server-only';
import { TRPCError } from '@trpc/server';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { SubmissionSchema } from '@/entities/note/model/schema';
import type { ModerationResult, Note } from '@/entities/note/model/types';
import { env } from '@/server/lib/env';
import { moderate, statusForVerdict } from '@/server/lib/moderation/moderate';
import { audit } from '@/server/lib/notes/audit';
import { checkRateLimit } from '@/server/lib/rate-limit';
import { notifySlack } from '@/server/lib/notes/slack';
import {
  createNote,
  getApprovedNotes,
  getDailyModerations,
  incrementDailyModerations,
} from '@/server/lib/notes/storage';
import { normalizeWhitespace, screen } from '@/server/lib/notes/validate';
import { publicProcedure, router } from '@/server/lib/trpc';

export const wallRouter = router({
  // Public read side: approved notes only.
  list: publicProcedure
    .input(z.object({ limit: z.number().int().positive().max(100).default(100) }).default({ limit: 100 }))
    .query(async ({ input }) => {
      try {
        return await getApprovedNotes({ limit: input.limit });
      } catch (err) {
        // storage being down is not a crash, the wall just renders empty
        console.error('[wall] failed to load approved notes:', err);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Wall unavailable.' });
      }
    }),

  submit: publicProcedure.input(SubmissionSchema).mutation(async ({ ctx, input }) => {
    // 1. Reject HTML and obvious injection before spending anything.
    const screened = screen({ name: input.name, body: input.body });
    if (!screened.ok) {
      throw new TRPCError({ code: 'UNPROCESSABLE_CONTENT', message: screened.reason });
    }

    // 2. Rate-limit by IP (before moderation — don't pay for spam).
    const rate = await checkRateLimit(ctx.ip);
    if (!rate.success) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: 'Slow down — you have hit the hourly limit. Try again later.',
      });
    }

    // 3. Sanitize (normalize whitespace; HTML already rejected above).
    const submission = {
      name: normalizeWhitespace(input.name),
      topic: input.topic,
      body: normalizeWhitespace(input.body),
    };

    // 4. Moderate — unless the daily cost cap is hit, in which case skip the call
    //    and route to pending (a failed/absent moderation never auto-approves).
    let result: ModerationResult;
    let moderated: boolean;
    const used = await getDailyModerations();
    if (used >= env.WALL_DAILY_MAX_MODERATIONS) {
      result = { verdict: 'flag', confidence: 0, reason: 'daily_cap_reached' };
      moderated = false;
    } else {
      await incrementDailyModerations();
      const outcome = await moderate(submission);
      result = outcome.result;
      moderated = outcome.ok;
    }

    // 5. Decide bucket and persist.
    const status = statusForVerdict(result, env.WALL_PUBLIC_RESULTS);
    const note: Note = {
      id: nanoid(12),
      name: submission.name,
      topic: submission.topic,
      body: submission.body,
      createdAt: new Date().toISOString(),
      status,
      verdict: JSON.stringify(result),
      confidence: result.confidence,
      reason: result.reason,
    };
    await createNote(note);

    // 6. Audit, then the Slack hook (fire-and-forget no-op for now).
    await audit({
      actor: 'system',
      action: 'submit',
      noteId: note.id,
      after: { status, verdict: result.verdict, confidence: result.confidence, moderated },
    });
    void notifySlack(note, result).catch(() => {});

    // 7. Never reveal an auto-rejection to the submitter — report it as pending so
    //    bad actors can't iterate against the moderator.
    const clientStatus = status === 'approved' ? 'approved' : 'pending';
    return { status: clientStatus, noteId: note.id } as const;
  }),
});
