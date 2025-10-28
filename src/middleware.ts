import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('session');
  const superAdminSession = request.cookies.get('superAdminSession');

  const isAuthenticated = session || superAdminSession;
  const isAuthPage = pathname.startsWith('/auth');

  if (isAuthPage) {
    if (isAuthenticated) {
      const url = superAdminSession ? '/superadmin/dashboard' : '/patients/dashboard';
      return NextResponse.redirect(new URL(url, request.url));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
    matcher: [
      '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
    ],
  };
