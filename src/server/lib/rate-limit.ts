import 'server-only';
import { Ratelimit } from '@upstash/ratelimit';
import { env } from './env';
import { redis } from './redis';

const LOGIN_ATTEMPTS_PER_HOUR = 10;

// Hash the IP before it's ever used as a key so we never store raw addresses.
async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(`${ip}:${env.WALL_ADMIN_TOKEN}`);
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

// Sliding window, N requests/hour per hashed IP.
function limiter(prefix: string, perHour: number) {
  return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(perHour, '1 h'), prefix, analytics: false });
}

const noteLimiter = limiter('wall:rate', env.WALL_RATE_LIMIT_PER_HOUR);
// A separate bucket, so posting notes can't lock the admin out of logging in.
const loginLimiter = limiter('admin:login-rate', LOGIN_ATTEMPTS_PER_HOUR);

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  return noteLimiter.limit(await hashIp(ip));
}

export async function checkLoginRateLimit(ip: string): Promise<RateLimitResult> {
  return loginLimiter.limit(await hashIp(ip));
}
