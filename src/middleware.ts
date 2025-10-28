
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from 'firebase-admin';
import { initAdmin } from '@/lib/firebase-admin';

export async function middleware(request: NextRequest) {
  await initAdmin();
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('__session')?.value;

  const protectedRoutes = [
    '/admin/dashboard',
    '/diagnostics/dashboard',
    '/doctor/dashboard',
    '/patient/dashboard',
    '/receptionist/dashboard',
    '/superadmin/dashboard'
  ];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/auth/signin?error=Not+authenticated', request.url));
    }

    try {
      const decodedToken = await auth().verifySessionCookie(sessionCookie, true);
      const userRole = decodedToken.role.toString().toLowerCase().trim();

      if (pathname.startsWith('/superadmin/dashboard') && userRole !== 'superadmin') {
        return NextResponse.redirect(new URL('/auth/signin?error=Access+denied', request.url));
      }

      // Add similar checks for other roles if needed

      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/auth/signin?error=Invalid+session', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/diagnostics/dashboard/:path*',
    '/doctor/dashboard/:path*',
    '/patient/dashboard/:path*',
    '/receptionist/dashboard/:path*',
    '/superadmin/dashboard/:path*',
    '/((?!_next/static|_next/image|favicon.ico).)*'
  ],
};
