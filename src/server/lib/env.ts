import 'server-only';
import { z } from 'zod';

// Newline-separated regex sources, kept out of source control (set in .env /
// Vercel) so the public repo never reveals what the coarse filter matches.
// Each non-empty line is compiled case-insensitive. Unset = no coarse filter.
function compilePatterns(raw: string): RegExp[] {
  return raw
    .split(/\r?\n|;;;/)
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((source) => {
      try {
        return [new RegExp(source, 'i')];
      } catch {
        return [];
      }
    });
}

const schema = z.object({
  ANTHROPIC_API_KEY: z.string(),
  DATABASE_URL: z.url(),
  WALL_ADMIN_TOKEN: z.string(),

  AWS_REGION: z.string(),
  AWS_S3_BUCKET: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  // Local MinIO only. Leave unset in production to use AWS S3.
  S3_ENDPOINT: z.url().optional(),

  // Optional only until notes move to Postgres, then these go away. Without
  // them the wall and admin login fail per request, the rest of the site works.
  UPSTASH_REDIS_REST_URL: z.url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  WALL_RATE_LIMIT_PER_HOUR: z.coerce.number().int().positive().default(5),
  WALL_DAILY_MAX_MODERATIONS: z.coerce.number().int().positive().default(500),
  WALL_PUBLIC_RESULTS: z
    .string()
    .default('true')
    .transform((value) => value !== 'false'),
  WALL_MODERATION_MODEL: z.string().default('claude-haiku-4-5-20251001'),
  WALL_INJECTION_PATTERNS: z.string().default('').transform(compilePatterns),
});

// `KEY=` in a .env file means unset, not an empty value.
const provided = Object.fromEntries(Object.entries(process.env).filter(([, value]) => value !== ''));
const parsed = schema.safeParse(provided);

if (!parsed.success) {
  // Names and reasons only, values must never reach a log.
  const problems = parsed.error.issues.map((issue) => {
    const name = issue.path.join('.');
    return `  ${name}: ${provided[name] === undefined ? 'missing' : issue.message}`;
  });
  throw new Error(`Invalid environment variables:\n${problems.join('\n')}`);
}

export const env = parsed.data;

export const isProd = process.env.NODE_ENV === 'production';

export const SITE_URL = 'https://kcaparas.dev';
