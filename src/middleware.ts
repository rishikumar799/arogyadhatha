import { NextResponse, type NextRequest } from 'next/server';

const AUTH_PATH = '/auth/signin';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('__session')?.value;
  const { pathname, searchParams } = request.nextUrl;

  // Check if the redirect is coming from a successful sign-in.
  const isFromSignIn = searchParams.get('from') === 'signin';

  // If it's from sign-in, let it pass once to allow the cookie to be set.
  // This prevents the redirect loop.
  if (isFromSignIn) {
    return NextResponse.next();
  }

  // For all other requests, enforce security.
  // If no session and not on the auth page, redirect to sign-in.
  if (!sessionCookie && pathname !== AUTH_PATH) {
    return NextResponse.redirect(new URL(AUTH_PATH, request.url));
  }

  // If the user is authenticated and tries to visit the sign-in page, redirect to the root.
  // This is a secondary issue we can fix later, for now it prevents them getting stuck on signin.
  if (sessionCookie && pathname === AUTH_PATH) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
