
import { NextResponse, type NextRequest } from 'next/server';

// Define the paths for each role
const rolePaths: { [key: string]: string } = {
  patient: '/patients',
  doctor: '/doctor',
  receptionist: '/receptionist',
  superadmin: '/superadmin',
  diagnostics: '/diagnostics',
};

// Define paths that are publicly accessible
const publicPaths = ['/auth/signin', '/auth/signup', '/'];

// The main middleware function
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('__session')?.value || '';

  // --- Step 1: Immediately bypass middleware for API calls and static files ---
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('favicon.ico')) {
    return NextResponse.next();
  }

  // --- Step 2: Handle users who are logged out (no session cookie) ---
  if (!sessionCookie) {
    // If the requested path is NOT a public path, redirect to sign-in
    if (!publicPaths.includes(pathname)) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
    // If it is a public path, allow access
    return NextResponse.next();
  }

  // --- Step 3: Handle users who are logged in (have a session cookie) ---
  // Verify the session cookie by calling the verification API route
  const verifyUrl = new URL('/api/auth/verify-session', request.url);
  const response = await fetch(verifyUrl, {
    headers: { 'Cookie': `__session=${sessionCookie}` },
  });

  // If the cookie is invalid (verification failed)
  if (!response.ok) {
    // Clear the invalid cookie and redirect to sign-in
    const res = NextResponse.redirect(new URL('/auth/signin', request.url));
    res.cookies.set('__session', '', { maxAge: 0 });
    return res;
  }

  const { role } = await response.json();
  const userRole = role as keyof typeof rolePaths;

  // If the logged-in user is trying to access a public page (like the sign-in page)
  if (publicPaths.includes(pathname)) {
    // Redirect them to their proper dashboard
    const dashboardPath = userRole && rolePaths[userRole] ? `${rolePaths[userRole]}/dashboard` : '/';
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  // If the user's role is not valid or doesn't exist in our defined paths
  if (!userRole || !rolePaths[userRole]) {
    // Clear the cookie and send them to sign-in
    const res = NextResponse.redirect(new URL('/auth/signin', request.url));
    res.cookies.set('__session', '', { maxAge: 0 });
    return res;
  }

  const allowedPath = rolePaths[userRole];

  // If the user is trying to access a path that doesn't belong to their role
  if (!pathname.startsWith(allowedPath)) {
    // Redirect them to their own dashboard
    return NextResponse.redirect(new URL(`${allowedPath}/dashboard`, request.url));
  }

  // --- Step 4: If all checks pass, allow the request to proceed ---
  return NextResponse.next();
}

// --- Config: Apply the middleware to all paths except those specified ---
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).+)',
  ],
};
