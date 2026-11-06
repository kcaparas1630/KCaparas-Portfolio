import 'server-only';
// Reads env at runtime from process.env (Vercel and `next dev` both populate it).
// Dynamic lookup keeps secrets out of the client bundle.
function read(key: string): string | undefined {
  return process.env[key];
}

export function requireEnv(key: string): string {
  const value = read(key);
  if (value == null || value === '') {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}

export function optionalEnv(key: string, fallback: string): string {
  const value = read(key);
  return value == null || value === '' ? fallback : value;
}

export const isProd = process.env.NODE_ENV === 'production';

export const SITE_URL = 'https://kcaparas.dev';

export const config = {
  get ratePerHour(): number {
    return Number(optionalEnv('WALL_RATE_LIMIT_PER_HOUR', '5')) || 5;
  },
  get publicResults(): boolean {
    return optionalEnv('WALL_PUBLIC_RESULTS', 'true') !== 'false';
  },
  get dailyMaxModerations(): number {
    return Number(optionalEnv('WALL_DAILY_MAX_MODERATIONS', '500')) || 500;
  },
  get adminToken(): string {
    return optionalEnv('WALL_ADMIN_TOKEN', '');
  },
  get moderationModel(): string {
    return optionalEnv('WALL_MODERATION_MODEL', 'claude-haiku-4-5-20251001');
  },
  get siteUrl(): string {
    return optionalEnv('SITE_URL', 'http://localhost:3000');
  },
  // Newline-separated regex sources, kept out of source control (set in .env /
  // Vercel) so the public repo never reveals what the coarse filter matches.
  // Each non-empty line is compiled case-insensitive. Unset = no coarse filter.
  get injectionPatterns(): RegExp[] {
    const raw = optionalEnv('WALL_INJECTION_PATTERNS', '');
    if (!raw) return [];
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
  },
};
