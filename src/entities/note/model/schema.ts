import { z } from 'zod';
import { TOPICS } from './types';

export const NOTE_BODY_MAX = 280;
export const NOTE_NAME_MAX = 40;

export const SubmissionSchema = z.object({
  name: z.string().trim().max(NOTE_NAME_MAX, 'Name must be 40 characters or fewer.').default(''),
  topic: z.enum(TOPICS),
  body: z
    .string()
    .trim()
    .min(1, 'Say something.')
    .max(NOTE_BODY_MAX, 'Notes are limited to 280 characters.'),
});

export type SubmissionInput = z.input<typeof SubmissionSchema>;
