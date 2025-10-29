
import { NextResponse, type NextRequest } from 'next/server';

// The matcher now EXCLUDES /api/ and other static paths.
export const config = {
  matcher: [
    // Match all routes except for:
    // 1. /api/ routes
    // 2. /_next/static/ (static files)
    // 3. /_next/image/ (image optimization files)
    // 4. /favicon.ico (favicon file)
    // 5. /auth/ (public auth pages)
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
  ],
};

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('__session')?.value;
  const currentPath = request.nextUrl.pathname;

  // If there's no session cookie, redirect to the sign-in page.
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // If there IS a session, verify it to get the user's role.
  try {
    // We use an absolute URL because middleware runs in a different context.
    const verifyUrl = new URL('/api/auth/verify-session', request.url);
    const response = await fetch(verifyUrl, {
      headers: {
        'Cookie': `__session=${sessionCookie}`
      }
    });

    if (!response.ok) {
      throw new Error('Session verification failed');
    }

    const { role } = await response.json();
    const userRole = role?.toLowerCase();

    if (!userRole) {
      throw new Error('Role not found in session');
    }

    // Define dashboard paths
    const dashboards: { [key: string]: string } = {
      superadmin: '/superadmin',
      doctor: '/doctor',
      receptionist: '/receptionist',
      diagnostics: '/diagnostics',
      patient: '/patients'
    };

    const expectedDashboardPrefix = dashboards[userRole];

    // If the user is not in their correct dashboard, redirect them.
    if (expectedDashboardPrefix && !currentPath.startsWith(expectedDashboardPrefix)) {
      return NextResponse.redirect(new URL(expectedDashboardPrefix, request.url));
    }

    // If user is in their correct dashboard, or no specific dashboard is defined,
    // allow the request to proceed.
    return NextResponse.next();

  } catch (error) {
    console.error('Middleware error:', error);
    // If verification fails, the session is invalid. Clear the cookie and redirect to sign-in.
    const response = NextResponse.redirect(new URL('/auth/signin', request.url));
    response.cookies.delete('__session');
    return response;
  }
}
