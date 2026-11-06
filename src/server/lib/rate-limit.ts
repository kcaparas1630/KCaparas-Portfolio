import 'server-only';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { config, optionalEnv, requireEnv } from './env';

const LOGIN_ATTEMPTS_PER_HOUR = 10;

// Hash the IP before it's ever used as a key so we never store raw addresses.
async function hashIp(ip: string): Promise<string> {
  const salt = optionalEnv('WALL_ADMIN_TOKEN', 'wall-rate-salt');
  const data = new TextEncoder().encode(`${ip}:${salt}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 24);
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number; // epoch ms when the window resets
}

// Sliding window, N requests/hour per hashed IP. Constructed per call — Upstash
// REST is stateless, so there's no pool to reuse.
async function limit(ip: string, prefix: string, perHour: number): Promise<RateLimitResult> {
  const ratelimit = new Ratelimit({
    redis: new Redis({
      url: requireEnv('UPSTASH_REDIS_REST_URL'),
      token: requireEnv('UPSTASH_REDIS_REST_TOKEN'),
    }),
    limiter: Ratelimit.slidingWindow(perHour, '1 h'),
    prefix,
    analytics: false,
  });

  const { success, remaining, reset } = await ratelimit.limit(await hashIp(ip));
  return { success, remaining, reset };
}

export function checkRateLimit(ip: string): Promise<RateLimitResult> {
  return limit(ip, 'wall:rate', config.ratePerHour);
}

// A separate bucket, so posting notes can't lock the admin out of logging in.
export function checkLoginRateLimit(ip: string): Promise<RateLimitResult> {
  return limit(ip, 'admin:login-rate', LOGIN_ATTEMPTS_PER_HOUR);
}
