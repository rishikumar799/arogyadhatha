
import { NextResponse, type NextRequest } from 'next/server';

const rolePaths: { [key: string]: string } = {
  patient: '/patients',
  doctor: '/doctor',
  receptionist: '/receptionist',
  superadmin: '/superadmin',
  diagnostics: '/diagnostics',
};

const publicPaths = ['/auth/signin', '/auth/signup', '/'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('__session')?.value || '';

  // Immediately allow API routes and static files to pass through
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('favicon.ico')) {
    return NextResponse.next();
  }

  // SCENARIO 1: USER IS LOGGED IN (has session cookie)
  if (sessionCookie) {
    // Verify the session
    const verifyUrl = new URL('/api/auth/verify-session', request.url);
    const response = await fetch(verifyUrl, {
      headers: { 'Cookie': `__session=${sessionCookie}` },
    });

    // If verification fails, cookie is bad. Clear it and redirect to sign-in.
    if (!response.ok) {
      const res = NextResponse.redirect(new URL('/auth/signin', request.url));
      res.cookies.set('__session', '', { maxAge: 0 });
      return res;
    }

    const { role } = await response.json();
    const userRole = role as keyof typeof rolePaths;

    // If user is logged in and on a public page, redirect to their dashboard.
    if (publicPaths.includes(pathname)) {
      const dashboardPath = userRole && rolePaths[userRole] ? `${rolePaths[userRole]}/dashboard` : '/';
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    // If the user's role is invalid, clear cookie and redirect
    if (!userRole || !rolePaths[userRole]) {
      const res = NextResponse.redirect(new URL('/auth/signin', request.url));
      res.cookies.set('__session', '', { maxAge: 0 });
      return res;
    }

    const allowedPath = rolePaths[userRole];

    // If the user tries to access a path that doesn't match their role, redirect.
    if (!pathname.startsWith(allowedPath)) {
      return NextResponse.redirect(new URL(`${allowedPath}/dashboard`, request.url));
    }

    // If all checks pass, allow the request.
    return NextResponse.next();
  }

  // SCENARIO 2: USER IS LOGGED OUT (no session cookie)
  else {
    // If the path is protected, redirect to sign-in
    if (!publicPaths.includes(pathname)) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    // Otherwise, allow access to the public page
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Match all paths except for static files, images, and API routes
    '/((?!api|_next/static|_next/image|favicon.ico).+)',
  ],
};
