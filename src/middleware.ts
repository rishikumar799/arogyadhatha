
import { NextResponse, type NextRequest } from 'next/server';

const rolePaths: { [key: string]: string } = {
  patient: '/patients',
  doctor: '/doctor',
  receptionist: '/receptionist',
  superadmin: '/superadmin',
  diagnostics: '/diagnostics',
};

const publicPaths = ['/auth/signin', '/auth/signup', '/'];

// Helper to get the correct dashboard path based on role
const getDashboardPath = (role: keyof typeof rolePaths | undefined) => {
  if (!role || !rolePaths[role]) {
    return '/'; // Default to home page if role is invalid
  }
  // The patient dashboard is at /patients, not /patients/dashboard
  if (role === 'patient') {
    return rolePaths.patient;
  }
  return `${rolePaths[role]}/dashboard`;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('__session')?.value || '';

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
  const verifyUrl = new URL('/api/auth/verify-session', request.url);
  const response = await fetch(verifyUrl, {
    headers: { 'Authorization': `Bearer ${sessionCookie}` },
  });

  if (!response.ok) {
    const res = NextResponse.redirect(new URL('/auth/signin', request.url));
    res.cookies.set('__session', '', { maxAge: 0 });
    return res;
  }

  const { role } = await response.json();
  const userRole = role as keyof typeof rolePaths;

  // Redirect logged-in users from public pages to their dashboard
  if (publicPaths.includes(pathname)) {
    const dashboardPath = getDashboardPath(userRole);
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  if (!userRole || !rolePaths[userRole]) {
    const res = NextResponse.redirect(new URL('/auth/signin', request.url));
    res.cookies.set('__session', '', { maxAge: 0 });
    return res;
  }

  // If a user is on a path not allowed for their role, redirect to their dashboard
  const allowedPath = rolePaths[userRole];
  if (!pathname.startsWith(allowedPath)) {
    const dashboardPath = getDashboardPath(userRole);
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).+)',
  ],
};
