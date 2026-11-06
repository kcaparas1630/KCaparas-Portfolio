import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE, verifyAdminCookieValue } from '@/server/lib/admin-cookie';

// Guards the admin area. /admin itself is the login page and stays reachable;
// anything deeper requires a valid session cookie.
export function proxy(request: NextRequest) {
  if (verifyAdminCookieValue(request.cookies.get(ADMIN_COOKIE)?.value)) return NextResponse.next();
  return NextResponse.redirect(new URL('/admin', request.url));
}

export const config = {
  matcher: '/admin/:path+',
};
