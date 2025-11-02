
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('firebase-session-token');

  // Define ALL protected routes
  const protectedRoutes = ['/patients', '/doctor', '/superadmin', '/receptionist', '/diagnostics'];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !sessionCookie) {
    // If it's a protected route and there's no session cookie, redirect to sign-in
    const signinUrl = new URL('/auth/signin', request.url);
    signinUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(signinUrl);
  }

  // If it's a protected route and the user is authenticated, or it's not a protected route,
  // allow the request to continue.
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (authentication pages which are not protected)
     */
    // CORRECTED: Removed the stray double quote at the end of the regex.
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
  ],
};
