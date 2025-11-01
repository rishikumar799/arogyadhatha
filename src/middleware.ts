import { NextResponse, type NextRequest } from 'next/server';

const AUTH_PATH = '/auth/signin';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('__session')?.value;
  const { pathname } = request.nextUrl;

  // If there's no session cookie and the user is not trying to access the sign-in page,
  // redirect them to the sign-in page.
  if (!sessionCookie && pathname !== AUTH_PATH) {
    return NextResponse.redirect(new URL(AUTH_PATH, request.url));
  }

  // If the user is already authenticated and tries to access the sign-in page,
  // redirect them to the home page so they don't get stuck.
  if (sessionCookie && pathname === AUTH_PATH) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If none of the above conditions are met, the user is authorized to proceed.
  return NextResponse.next();
}
