import 'server-only';
import type { ModerationResult, Note } from '@/entities/note/model/types';

// Placeholder for the Slack notification (interactive approve/reject buttons
// posted to a private channel). A deliberate no-op so the submit procedure can
// already call it fire-and-forget.
export async function notifySlack(_note: Note, _verdict: ModerationResult): Promise<void> {
  return;
}
