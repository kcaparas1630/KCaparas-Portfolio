import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '@/server/lib/env';

export const ADMIN_COOKIE = 'wall_admin';
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Stateless signed cookie: HMAC of a fixed payload keyed by WALL_ADMIN_TOKEN.
// Rotating the token invalidates every existing session for free.
const PAYLOAD = 'admin';

function sign(secret: string): string {
  return `v1.${createHmac('sha256', secret).update(PAYLOAD).digest('hex')}`;
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function makeAdminCookieValue(): string {
  return sign(env.WALL_ADMIN_TOKEN);
}

export function verifyAdminCookieValue(value: string | undefined | null): boolean {
  if (!value) return false;
  return safeEqual(value, sign(env.WALL_ADMIN_TOKEN));
}

export function tokenMatches(provided: string | undefined | null): boolean {
  if (!provided) return false;
  return safeEqual(provided, env.WALL_ADMIN_TOKEN);
}
