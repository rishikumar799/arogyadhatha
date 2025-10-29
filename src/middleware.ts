
import { NextResponse, type NextRequest } from 'next/server';

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
  const sessionCookie = request.cookies.get('__session')?.value || '';

  // Allow access to internal Next.js and API routes
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('favicon.ico')) {
    return NextResponse.next();
  }

  // If trying to access a public path, allow it without checking for a session
  if (publicPaths.some(path => pathname === path)) {
    return NextResponse.next();
  }

  // For any other path, a session is required
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Verify the session by calling the new API route
  const verifyUrl = new URL('/api/auth/verify-session', request.url);
  const response = await fetch(verifyUrl, {
    headers: { 'Cookie': `__session=${sessionCookie}` },
  });

  // If the session is invalid, redirect to sign-in
  if (!response.ok) {
    const responseRedirect = NextResponse.redirect(new URL('/auth/signin', request.url));
    responseRedirect.cookies.set('__session', '', { maxAge: 0 }); // Clear bad cookie
    return responseRedirect;
  }

  const { role } = await response.json();
  const userRole = role as keyof typeof rolePaths;

  // If user is logged in and tries to access auth pages, redirect to their dashboard
  if (pathname.startsWith('/auth')) {
      if (userRole && rolePaths[userRole]) {
          return NextResponse.redirect(new URL(rolePaths[userRole] + '/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
  }

  if (!userRole || !rolePaths[userRole]) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  const allowedPath = rolePaths[userRole];

  // If the user is trying to access a path that does not correspond to their role, redirect them
  if (!pathname.startsWith(allowedPath)) {
    return NextResponse.redirect(new URL(`${allowedPath}/dashboard`, request.url));
  }

  // If all checks pass, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).+)',
  ],
};
