
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import admin from "./lib/firebase-admin";

// Role-based dashboard configuration
const ROLES_CONFIG: Record<string, { dashboard: string; prefix: string }> = {
  superadmin: { dashboard: "/superadmin/dashboard", prefix: "/superadmin" },
  doctor: { dashboard: "/doctor/dashboard", prefix: "/doctor" },
  receptionist: { dashboard: "/receptionist/dashboard", prefix: "/receptionist" },
  patient: { dashboard: "/patients/health-overview", prefix: "/patients" },
  diagnostic: { dashboard: "/diagnostics/dashboard", prefix: "/diagnostics" },
};

// Publicly accessible paths
const PUBLIC_PATHS = ["/", "/auth/signin", "/auth/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("firebase-session-token")?.value;

  // API routes are exempt from this middleware.
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // --- THIS IS THE CORRECTED AUTHENTICATION LOGIC ---
  let userRole: string | undefined;
  if (token) {
    try {
      // 1. Verify the session cookie to get the user's UID.
      const decodedToken = await admin.auth().verifySessionCookie(token, true);

      // 2. Fetch the user document from Firestore to get the definitive role.
      const userDoc = await admin.firestore().collection('users').doc(decodedToken.uid).get();

      if (userDoc.exists) {
        userRole = userDoc.data()?.role;
      } else {
        // If there's no user document, the user is not fully registered.
        userRole = undefined;
      }
    } catch (error) {
      // This catches invalid/expired tokens. userRole remains undefined.
      console.warn('Middleware token verification failed:', error);
      userRole = undefined;
    }
  }
  // --- END OF CORRECTED LOGIC ---
  
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  // --- 1. User is AUTHENTICATED (and has a valid role) ---
  if (userRole) {
    const roleConfig = ROLES_CONFIG[userRole];

    if (!roleConfig) {
      // Role from DB is invalid, log them out.
      const response = NextResponse.redirect(new URL("/auth/signin", request.url));
      response.cookies.delete("firebase-session-token");
      return response;
    }

    // If a logged-in user is on a public page, redirect to their dashboard.
    if (isPublicPath) {
      return NextResponse.redirect(new URL(roleConfig.dashboard, request.url));
    }

    // If a logged-in user is on the wrong dashboard, redirect to their own.
    if (!pathname.startsWith(roleConfig.prefix)) {
        return NextResponse.redirect(new URL(roleConfig.dashboard, request.url));
    }

    // Otherwise, they are in the right place. Allow them.
    return NextResponse.next();
  }

  // --- 2. User is NOT Authenticated ---
  if (isPublicPath) {
    return NextResponse.next();
  }

  // If they try to access a protected path, redirect to sign-in.
  const signInUrl = new URL("/auth/signin", request.url);
  signInUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(signInUrl);
}

// Config to apply the middleware to all paths except for static assets.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
