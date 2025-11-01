
import { NextResponse, type NextRequest } from 'next/server';

export const config = {
  matcher: [
    // Match all routes except for static assets and API routes.
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('__session')?.value;
  const currentPath = request.nextUrl.pathname;

  const isAuthPage = currentPath.startsWith('/auth');

  // If the user is on an authentication page and has a valid session, redirect them.
  if (isAuthPage) {
    if (sessionCookie) {
      try {
        const verifyUrl = new URL('/api/auth/verify-session', request.url);
        const response = await fetch(verifyUrl, {
          headers: { 'Cookie': `__session=${sessionCookie}` },
        });

        if (response.ok) {
          const { role } = await response.json();
          const userRole = role?.toLowerCase();
          
          if (userRole) {
            const dashboardPath = getDashboardPath(userRole);
            return NextResponse.redirect(new URL(dashboardPath, request.url));
          }
        }
      } catch (error) {
        console.error('Middleware (auth page) error:', error);
        // If verification fails, let them stay on the auth page.
      }
    }
    // If on an auth page and no session, allow access.
    return NextResponse.next();
  }

  // For all other pages, protect them.
  if (!sessionCookie) {
    if (currentPath !== '/auth/signin') {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
    return NextResponse.next();
  }

  try {
    const verifyUrl = new URL('/api/auth/verify-session', request.url);
    const response = await fetch(verifyUrl, {
      headers: { 'Cookie': `__session=${sessionCookie}` },
    });

    if (!response.ok) {
      throw new Error('Session verification failed');
    }

    const { role } = await response.json();
    const userRole = role?.toLowerCase();

    if (!userRole) {
      throw newError('Role not found in session');
    }

    const expectedDashboardPath = getDashboardPath(userRole);

    if (currentPath.startsWith('/api')) {
      return NextResponse.next();
    }
    
    // Redirect to the correct dashboard if not already there
    if (!currentPath.startsWith(expectedDashboardPath)) {
      return NextResponse.redirect(new URL(expectedDashboardPath, request.url));
    }

    return NextResponse.next();

  } catch (error) {
    console.error('Middleware error:', error);
    const response = NextResponse.redirect(new URL('/auth/signin', request.url));
    response.cookies.delete('__session');
    return response;
  }
}

function getDashboardPath(role: string): string {
  const dashboards: { [key: string]: string } = {
    superadmin: '/superadmin',
    doctor: '/doctor',
    receptionist: '/receptionist',
    diagnostics: '/diagnostics',
    patient: '/patients',
  };
  return dashboards[role] || '/';
}
