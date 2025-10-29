
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('__session')?.value;
  const superAdminSessionCookie = request.cookies.get('superAdminSession')?.value;
  const isLoggedIn = !!(sessionCookie || superAdminSessionCookie);

  // If the user is not logged in and not on the sign-in page, redirect to sign-in
  if (!isLoggedIn && pathname !== '/auth/signin') {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // If the user is logged in and on the sign-in page, redirect to the home page
  if (isLoggedIn && pathname === '/auth/signin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
