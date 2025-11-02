import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;

  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');

  // If trying to access a protected route without a session, redirect to sign-in
  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // If logged in and trying to access an auth page (like sign-in), redirect to the dashboard
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/patients', request.url));
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
