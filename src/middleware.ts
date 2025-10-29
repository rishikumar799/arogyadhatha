
import { NextResponse, type NextRequest } from 'next/server';
import admin from '@/lib/firebase-admin';

// THE DEFINITIVE FIX: Force the middleware to run in the Node.js runtime.
// This is required because `firebase-admin` is a Node.js library and is not
// compatible with the default lightweight "Edge" runtime.
export const runtime = 'nodejs';

const rolePaths: { [key: string]: string } = {
  patient: '/patients',
  doctor: '/doctor',
  receptionist: '/receptionist',
  superadmin: '/superadmin',
  diagnostics: '/diagnostics',
};

const publicPaths = ['/auth/signin', '/auth/signup', '/'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('__session')?.value || '';

  // Bypass for static files and API routes
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('favicon.ico')) {
    return NextResponse.next();
  }

  // --- Handle Logged-Out Users ---
  if (!sessionCookie) {
    if (publicPaths.includes(pathname)) {
      return NextResponse.next(); // Allow access to public pages
    }
    // For all other pages, redirect to sign-in
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // --- Handle Logged-In Users ---
  try {
    const decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
    const { uid } = decodedToken;

    const userDocRef = admin.firestore().collection('users').doc(uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      throw new Error('User document not found in Firestore.');
    }

    const userRole = (userDoc.data()?.role as string)?.toLowerCase();

    if (!userRole || !rolePaths[userRole]) {
      throw new Error('Invalid or missing role in Firestore document.');
    }

    if (publicPaths.includes(pathname)) {
      const dashboardPath = `${rolePaths[userRole]}/dashboard`;
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    const allowedPath = rolePaths[userRole];
    if (!pathname.startsWith(allowedPath)) {
      return NextResponse.redirect(new URL(`${allowedPath}/dashboard`, request.url));
    }

    return NextResponse.next();

  } catch (error) {
    console.error('Middleware Error:', error);
    const response = NextResponse.redirect(new URL('/auth/signin', request.url));
    response.cookies.set('__session', '', { maxAge: 0 });
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).+)',
  ],
};
