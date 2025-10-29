
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

  // Bypass for API, static files, etc.
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('favicon.ico')) {
    return NextResponse.next();
  }

  // --- LOGGED-OUT USERS ---
  if (!sessionCookie) {
    if (!publicPaths.includes(pathname)) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
    return NextResponse.next();
  }

  // --- LOGGED-IN USERS ---
  // Call the verification API, passing the cookie in a robust way.
  const verifyUrl = new URL('/api/auth/verify-session', request.url);
  const response = await fetch(verifyUrl, {
    headers: {
      'Authorization': `Bearer ${sessionCookie}`,
    },
  });

  // If verification fails, the cookie is bad. Clear it and redirect.
  if (!response.ok) {
    const res = NextResponse.redirect(new URL('/auth/signin', request.url));
    res.cookies.set('__session', '', { maxAge: 0 });
    return res;
  }

  const { role } = await response.json();
  const userRole = role as keyof typeof rolePaths;

  // If a logged-in user is on a public page, redirect them to their dashboard.
  if (publicPaths.includes(pathname)) {
    const dashboardPath = userRole && rolePaths[userRole] ? `${rolePaths[userRole]}/dashboard` : '/';
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  // If the user role from the token is invalid, clear the session.
  if (!userRole || !rolePaths[userRole]) {
    const res = NextResponse.redirect(new URL('/auth/signin', request.url));
    res.cookies.set('__session', '', { maxAge: 0 });
    return res;
  }

  // If the user is trying to access a path that doesn't match their role, redirect.
  const allowedPath = rolePaths[userRole];
  if (!pathname.startsWith(allowedPath)) {
    return NextResponse.redirect(new URL(`${allowedPath}/dashboard`, request.url));
  }

  // All checks passed. Allow the request.
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).+)',
  ],
};
