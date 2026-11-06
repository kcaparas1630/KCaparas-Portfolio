import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE, verifyAdminCookieValue } from '@/server/lib/admin-cookie';
import { ADMIN_PATH } from '@/shared/lib/admin-routes';

// Guards the admin area. The admin root is the login page and stays reachable;
// anything deeper requires a valid session cookie.
export function proxy(request: NextRequest) {
  if (verifyAdminCookieValue(request.cookies.get(ADMIN_COOKIE)?.value)) return NextResponse.next();
  return NextResponse.redirect(new URL(ADMIN_PATH, request.url));
}

// Next reads this statically, so it can't use ADMIN_PATH.
export const config = {
  matcher: '/kcaparas-admin/:path+',
};
