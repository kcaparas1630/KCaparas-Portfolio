import 'server-only';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { MODERATION_QUEUES } from '@/entities/note/model/types';
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_MAX_AGE,
  makeAdminCookieValue,
  tokenMatches,
} from '@/server/lib/admin-cookie';
import { isProd } from '@/server/lib/env';
import { audit } from '@/server/lib/notes/audit';
import { checkLoginRateLimit } from '@/server/lib/rate-limit';
import {
  getApprovedNotesFull,
  getPendingNotes,
  getRejectedNotes,
  softDeleteNote,
  updateNoteStatus,
} from '@/server/lib/notes/storage';
import { adminProcedure, publicProcedure, router } from '@/server/lib/trpc';

const LIMIT = 200;

export const adminRouter = router({
  // The one public procedure here: it is what creates the session adminProcedure
  // checks for. The token is the gate, the rate limit stops brute forcing it.
  login: publicProcedure.input(z.object({ token: z.string().min(1) })).mutation(async ({ ctx, input }) => {
    const rate = await checkLoginRateLimit(ctx.ip);
    if (!rate.success) {
      throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Too many attempts. Try again later.' });
    }
    if (!tokenMatches(input.token)) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid token.' });
    }
    ctx.cookies.set(ADMIN_COOKIE, makeAdminCookieValue(), {
      httpOnly: true,
      sameSite: 'strict',
      secure: isProd,
      path: '/',
      maxAge: ADMIN_COOKIE_MAX_AGE,
    });
    return { ok: true } as const;
  }),

  logout: adminProcedure.mutation(async ({ ctx }) => {
    ctx.cookies.delete({ name: ADMIN_COOKIE, path: '/' });
    return { ok: true } as const;
  }),

  list: adminProcedure.input(z.object({ queue: z.enum(MODERATION_QUEUES) })).query(async ({ input }) => {
    switch (input.queue) {
      case 'pending':
        return getPendingNotes({ limit: LIMIT });
      case 'approved':
        return getApprovedNotesFull({ limit: LIMIT });
      case 'rejected':
        return getRejectedNotes({ limit: LIMIT });
    }
  }),

  setStatus: adminProcedure
    .input(z.object({ id: z.string().min(1), status: z.enum(['approved', 'rejected']) }))
    .mutation(async ({ input }) => {
      const updated = await updateNoteStatus(input.id, input.status);
      if (!updated) throw new TRPCError({ code: 'NOT_FOUND', message: 'Note not found.' });
      const action = input.status === 'approved' ? 'approve' : 'reject';
      await audit({ actor: 'admin', action, noteId: input.id, after: { status: input.status } });
      return updated;
    }),

  delete: adminProcedure.input(z.object({ id: z.string().min(1) })).mutation(async ({ input }) => {
    const deleted = await softDeleteNote(input.id);
    if (!deleted) throw new TRPCError({ code: 'NOT_FOUND', message: 'Note not found.' });
    await audit({ actor: 'admin', action: 'delete', noteId: input.id, after: { status: 'deleted' } });
    return deleted;
  }),
});
