// zod/v4 to match the module instance the SDK's zodOutputFormat helper uses.
import { z } from 'zod/v4';

// Claude's moderation response must match this exactly, or we default to pending.
export const ModerationResultSchema = z.object({
  verdict: z.enum(['approve', 'flag']),
  confidence: z.number().min(0).max(1),
  reason: z.string().min(1).max(400),
});
