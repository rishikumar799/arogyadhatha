
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('firebase-session-token');

  // Define protected routes
  const protectedRoutes = ['/patients', '/doctors', '/superadmin'];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !sessionCookie) {
    // If it's a protected route and there's no session cookie, redirect to sign-in
    const signinUrl = new URL('/auth/signin', request.url);
    signinUrl.searchParams.set('next', pathname); // Optional: redirect back after login
    return NextResponse.redirect(signinUrl);
  }

  // Allow the request to continue
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
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
  ],
};
