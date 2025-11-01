
import { NextResponse, type NextRequest } from 'next/server';
import admin from '@/lib/firebase-admin';

// Define roles and their corresponding base paths for redirection and authorization
const ROLES_AND_PATHS: { [key: string]: string } = {
  superadmin: '/superadmin',
  doctor: '/doctor',
  receptionist: '/receptionist',
  diagnostics: '/diagnostics',
  patient: '/patients',
};

const PUBLIC_PATHS = ['/auth/signin', '/auth/signup'];
const ROOT_PATH = '/';

/**
 * Verifies the session cookie and returns the decoded token.
 * Returns null if the cookie is missing, invalid, or expired.
 */
async function verifySession(sessionCookie: string | undefined) {
  if (!sessionCookie) return null;
  try {
    // Verify the session cookie. This checks for tampering and expiration.
    const decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
    return decodedToken;
  } catch (error) {
    console.error('Middleware: Session cookie verification failed.', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('__session')?.value;

  // 1. Verify the session and get user info
  const decodedToken = await verifySession(sessionCookie);
  const userRole = decodedToken?.role as string | undefined;

  // --- LOGIC FOR LOGGED-IN USERS ---
  if (decodedToken && userRole) {
    const userDashboard = ROLES_AND_PATHS[userRole];

    // If logged-in user tries to access a public page (signin/signup) or the root,
    // redirect them to their specific dashboard.
    if (PUBLIC_PATHS.includes(pathname) || pathname === ROOT_PATH) {
      return NextResponse.redirect(new URL(userDashboard || ROOT_PATH, request.url));
    }

    // Check if the user is trying to access a dashboard they are NOT authorized for.
    // This happens if the path starts with a known dashboard path that is not their own.
    const isAccessingUnauthorizedDashboard = Object.values(ROLES_AND_PATHS).some(path => 
      pathname.startsWith(path) && path !== userDashboard
    );

    if (isAccessingUnauthorizedDashboard) {
      // Not authorized, redirect to their own dashboard.
      return NextResponse.redirect(new URL(userDashboard || ROOT_PATH, request.url));
    }

    // If all checks pass, allow the request.
    return NextResponse.next();
  }

  // --- LOGIC FOR GUESTS (NOT LOGGED-IN) ---
  else {
    const isPublic = PUBLIC_PATHS.includes(pathname) || pathname === ROOT_PATH;
    
    // If a guest tries to access a protected page, redirect them to sign-in.
    if (!isPublic) {
      const response = NextResponse.redirect(new URL('/auth/signin', request.url));
      // Ensure any invalid/expired cookie is cleared.
      response.cookies.delete('__session');
      return response;
    }

    // Allow guests to access public pages.
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // This matches all paths except for API routes and static assets.
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
};
