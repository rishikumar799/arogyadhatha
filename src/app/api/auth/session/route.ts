
import { NextResponse, type NextRequest } from 'next/server';
import admin from '@/lib/firebase-admin';

const SEVEN_DAYS_IN_SECONDS = 7 * 24 * 60 * 60;

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required.' }, { status: 400 });
    }

    // This part remains the same: verify the token, get the role.
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userRole = decodedToken.role || 'patient';

    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn: SEVEN_DAYS_IN_SECONDS * 1000 });

    // --- THE CRITICAL FIX IS HERE ---
    // 1. Create the response object.
    const response = NextResponse.json({ status: 'success', role: userRole });

    // 2. Set the cookie with flags that allow cross-site usage.
    // `SameSite=None` and `Secure=true` are required for the cookie to be sent
    // from the browser in the embedded IDE environment.
    response.cookies.set('__session', sessionCookie, {
      httpOnly: true,       // Prevents client-side JS from accessing the cookie
      secure: true,           // MUST be true when SameSite=None
      sameSite: 'none',       // Allows the cookie to be sent in cross-site requests
      maxAge: SEVEN_DAYS_IN_SECONDS, // The cookie's lifetime
      path: '/',               // The cookie is available for all pages
    });

    // 3. Return the response with the correctly configured cookie.
    return response;

  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json({ error: 'Failed to create session.' }, { status: 500 });
  }
}
