import 'server-only';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifyAdminCookieValue } from './admin-cookie';
import { requestIp } from './request-ip';

export async function createContext({ req }: { req: Request }) {
  const cookieStore = await cookies();
  return {
    ip: requestIp(req.headers),
    cookies: cookieStore,
    isAdmin: verifyAdminCookieValue(cookieStore.get(ADMIN_COOKIE)?.value),
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
