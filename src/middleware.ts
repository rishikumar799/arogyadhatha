
import { NextResponse, type NextRequest } from 'next/server';

// Role-based path configuration
const rolePaths: { [key: string]: string } = {
  patient: '/patients',
  doctor: '/doctor',
  receptionist: '/receptionist',
  superadmin: '/superadmin', // CORRECTED: The base path for the role.
  diagnostics: '/diagnostics',
};

// Define public paths that do not require authentication
const publicPathPrefixes = ['/auth'];
const publicExactPaths = ['/'];

// Helper to get the correct dashboard path based on role
const getDashboardPath = (role: keyof typeof rolePaths | undefined) => {
  if (!role || !rolePaths[role]) {
    return '/'; // Default to home page if role is invalid
  }
  if (role === 'patient') {
    return rolePaths.patient; // Patient dashboard is at the root of their path
  }
  // This now correctly constructs /superadmin/dashboard
  return `${rolePaths[role]}/dashboard`;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('__session')?.value || '';

  // Bypass for internal Next.js requests and static assets
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('favicon.ico')) {
    return NextResponse.next();
  }

  const isPublicPath = 
    publicExactPaths.includes(pathname) || 
    publicPathPrefixes.some(prefix => pathname.startsWith(prefix));

  // --- SESSION VERIFICATION ---
  let sessionStatus: { isAuthenticated: boolean; role?: keyof typeof rolePaths } = { isAuthenticated: false };

  if (sessionCookie) {
    const verifyUrl = new URL('/api/auth/verify-session', request.url);
    const response = await fetch(verifyUrl, { headers: { 'Authorization': `Bearer ${sessionCookie}` } });

    if (response.ok) {
      const { role } = await response.json();
      sessionStatus = { isAuthenticated: true, role: role as keyof typeof rolePaths };
    } else {
      // Invalid session cookie, treat as logged out and clear the bad cookie
      const res = NextResponse.redirect(new URL('/auth/signin', request.url));
      res.cookies.set('__session', '', { maxAge: 0 });
      return res;
    }
  }

  const { isAuthenticated, role } = sessionStatus;
  const dashboardPath = getDashboardPath(role);

  // --- ROUTING LOGIC ---

  // If user is authenticated
  if (isAuthenticated) {
    // and tries to access a public path, redirect to their dashboard
    if (isPublicPath) {
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    // and tries to access a path not matching their role, redirect to their dashboard
    const allowedPath = role ? rolePaths[role] : '';
    if (!allowedPath || !pathname.startsWith(allowedPath)) {
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }
  } 
  // If user is not authenticated
  else {
    // and tries to access a protected path, redirect to sign-in
    if (!isPublicPath) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  // Otherwise, allow the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except for the ones starting with 'api', '_next/static', etc.
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
