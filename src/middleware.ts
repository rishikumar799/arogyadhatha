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
    return NextResponse.redirect(new URL('/auth/signin', request.url));
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
      throw new Error('Role not found in session');
    }

    const expectedDashboardPath = getDashboardPath(userRole);
    const inCorrectDashboard = currentPath.startsWith(expectedDashboardPath);
    
    // Handle the case where the patient dashboard is also the root of the /patients section
    if(userRole === 'patient' && currentPath === '/patients') {
      return NextResponse.next();
    }

    if (!inCorrectDashboard) {
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
    superadmin: '/superadmin/dashboard',
    doctor: '/doctor/dashboard',
    receptionist: '/receptionist/dashboard',
    diagnostics: '/diagnostics/dashboard',
   
  };
  return dashboards[role] || '/';
}
