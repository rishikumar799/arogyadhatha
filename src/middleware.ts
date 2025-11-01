import { NextResponse, type NextRequest } from 'next/server';

// Define the paths for authentication and the main entry point after login
const AUTH_PATH = '/auth/signin';
const HOME_PATH = '/';

// Configuration to specify which routes the middleware should run on.
export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

/**
 * Maps a user's role to their specific dashboard path.
 * @param {string} role - The role of the user.
 * @returns {string} The path to the user's dashboard.
 */
function getDashboardPath(role: string): string {
  const dashboards: { [key: string]: string } = {
    superadmin: '/superadmin',
    doctor: '/doctor',
    receptionist: '/receptionist',
    diagnostics: '/diagnostics',
    patient: '/patients',
  };
  return dashboards[role.toLowerCase()] || HOME_PATH;
}

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('__session')?.value;
  const { pathname } = request.nextUrl;

  try {
    // If there's no session cookie and the user is not on the sign-in page, redirect them to sign-in.
    if (!sessionCookie) {
      if (pathname !== AUTH_PATH) {
        return NextResponse.redirect(new URL(AUTH_PATH, request.url));
      }
      return NextResponse.next();
    }

    // If a session cookie exists, verify it.
    const verifyUrl = new URL('/api/auth/verify-session', request.url);
    const verifyResponse = await fetch(verifyUrl, {
      headers: { Cookie: `__session=${sessionCookie}` },
    });

    // If verification fails, the session is invalid. Redirect to sign-in and clear the bad cookie.
    if (!verifyResponse.ok) {
      const response = NextResponse.redirect(new URL(AUTH_PATH, request.url));
      response.cookies.delete('__session');
      return response;
    }

    const { role } = await verifyResponse.json();
    if (!role) {
      throw new Error('Role not found in session');
    }

    const dashboardPath = getDashboardPath(role);

    // If the user is on the sign-in page but is already authenticated, redirect them to their dashboard.
    if (pathname === AUTH_PATH) {
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    // If the user is authenticated but is not on their correct dashboard path, redirect them.
    if (!pathname.startsWith(dashboardPath)) {
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    // If all checks pass, allow the request to proceed.
    return NextResponse.next();
    
  } catch (error) {
    console.error('Middleware error:', error);
    // In case of any error during middleware execution, redirect to the sign-in page.
    const response = NextResponse.redirect(new URL(AUTH_PATH, request.url));
    // Clear any potentially corrupted session cookie.
    response.cookies.delete('__session');
    return response;
  }
}
