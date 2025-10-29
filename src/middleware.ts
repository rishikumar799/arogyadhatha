
export const runtime = 'nodejs'; // Force Node.js runtime

import { NextResponse, type NextRequest } from 'next/server';
import admin from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

// Define role-based paths
const rolePaths = {
  patient: '/patients',
  doctor: '/doctor',
  receptionist: '/receptionist',
  superadmin: '/superadmin',
  diagnostics: '/diagnostics',
};

// Public paths that do not require authentication
const publicPaths = ['/auth/signin', '/auth/signup', '/'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = cookies().get('__session')?.value || '';

  // Allow access to API routes, static files, and image optimization files
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('favicon.ico')) {
    return NextResponse.next();
  }

  // If trying to access a public path, allow it
  if (publicPaths.some(path => pathname === path)) {
    return NextResponse.next();
  }

  // If there's no session cookie, redirect to sign-in for any protected route
  if (!sessionCookie) {
    if (pathname !== '/auth/signin') {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
    return NextResponse.next();
  }

  try {
    // Verify the session cookie to get the user's role
    const decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
    const userRole = decodedToken.role as keyof typeof rolePaths;

    // If user is logged in and tries to access signin/signup, redirect to their dashboard
    if (pathname.startsWith('/auth')) {
        if (userRole && rolePaths[userRole]) {
            return NextResponse.redirect(new URL(rolePaths[userRole] + '/dashboard', request.url));
        }
         // If role is somehow missing, fall back to a default page or sign-in
         return NextResponse.redirect(new URL('/', request.url));
    }

    if (!userRole) {
      throw new Error('Role not found in token');
    }

    const allowedPath = rolePaths[userRole];

    // If the user is trying to access a path that does not correspond to their role, redirect them.
    if (!pathname.startsWith(allowedPath)) {
       console.log(`Redirecting user with role '${userRole}' from '${pathname}' to '${allowedPath}/dashboard'.`);
       return NextResponse.redirect(new URL(`${allowedPath}/dashboard`, request.url));
    }

    // If the user is authorized, allow the request to proceed
    return NextResponse.next();

  } catch (error) {
    // If verification fails (e.g., expired cookie), clear the invalid cookie and redirect to sign-in
    console.error('Middleware error:', error);
    const response = NextResponse.redirect(new URL('/auth/signin', request.url));
    response.cookies.set('__session', '', { maxAge: 0 }); // Clear the cookie
    return response;
  }
}

// Matcher to specify which paths the middleware should run on.
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).+)',
  ],
};
