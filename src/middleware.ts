
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('firebase-session-token')?.value;

  // Define all paths that are considered public and do not require authentication.
  const publicPaths = [
    '/', // The homepage
    '/auth/signin', // The sign-in page
    '/auth/signup', // The sign-up page
  ];

  // Determine if the current path is a public one.
  const isPublicPath = publicPaths.includes(pathname);

  // If the user has a session and tries to access an authentication page, redirect them to the homepage.
  if (sessionCookie && (pathname.startsWith('/auth/signin') || pathname.startsWith('/auth/signup'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If the user does NOT have a session and is trying to access a protected (non-public) route,
  // redirect them to the sign-in page.
  if (!sessionCookie && !isPublicPath) {
    const signinUrl = new URL('/auth/signin', request.url);
    signinUrl.searchParams.set('next', pathname); // Remember where they were going
    return NextResponse.redirect(signinUrl);
  }

  // If none of the above conditions are met, allow the request to proceed.
  return NextResponse.next();
}

// This configuration applies the middleware to all routes except for API routes, 
// Next.js static files, image optimization files, and the favicon.
// This is a robust and standard approach.
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
