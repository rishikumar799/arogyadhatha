
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = {
  patient: ['/patient'],
  doctor: ['/doctor'],
  receptionist: ['/receptionist'],
  diagnostics: ['/diagnostics'],
  superadmin: ['/superadmin'],
};

// Helper to map roles to their respective dashboards
const mapRoleToDashboard = (role: string) => {
  switch (role) {
    case 'patient':
      return '/patient/dashboard';
    case 'doctor':
      return '/doctor/dashboard';
    case 'receptionist':
      return '/receptionist/dashboard';
    case 'diagnostics':
      return '/diagnostics/dashboard';
    case 'superadmin':
      return '/superadmin/dashboard';
    default:
      return '/';
  }
};


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('__session')?.value;

  // If no session cookie, redirect to signin page, except for auth pages
  if (!sessionCookie) {
    if (pathname.startsWith('/auth')) {
        return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // If there is a session cookie, let's verify it
  const verifyUrl = new URL('/api/auth/verify-session', request.url);
  const response = await fetch(verifyUrl, {
    headers: {
        Cookie: `__session=${sessionCookie}`
    }
  });

  const { role } = await response.json();

  // Redirect logged-in users from auth pages
  if (pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL(mapRoleToDashboard(role), request.url));
  }

  // Check if user is accessing a protected route for their role
  const isAuthorized = Object.entries(PROTECTED_ROUTES).some(([r, routes]) => {
    if (role === r) {
      return routes.some((route) => pathname.startsWith(route));
    }
    return false;
  });

  if (!isAuthorized) {
    return NextResponse.redirect(new URL(mapRoleToDashboard(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
