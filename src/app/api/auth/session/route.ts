
import { type NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required.' }, { status: 400 });
    }

    // --- THIS IS THE CORE FIX YOU REQUESTED ---
    // First, verify the token to get the user's data and custom claims.
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Now, ENFORCE THE RULE: A user MUST have a 'role' to log in.
    if (!decodedToken.role) {
      // If there is no role, the user is not fully registered or is pending approval.
      // We REJECT the login attempt with a clear error message.
      return NextResponse.json(
        {
          error: 'Your account is not fully registered or is pending approval.',
        },
        { status: 403 } // 403 Forbidden
      );
    }
    // --- END OF CORE FIX ---

    // If the user has a role, proceed to create the session cookie.
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    // Set cookie policy for the session cookie.
    const options = {
      name: 'firebase-session-token',
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'lax' as const,
    };

    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.set(options);

    return response;

  } catch (error: any) {
    console.error('Session Login Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create session.',
        detail: error.message,
      },
      { status: 500 }
    );
  }
}

// Handles session logout by clearing the cookie.
export async function GET(request: NextRequest) {
  try {
    const options = {
      name: 'firebase-session-token',
      value: '',
      maxAge: -1, // Expire immediately
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'lax' as const,
    };

    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.set(options);

    return response;

  } catch (error: any) {
    console.error('Session Logout Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to log out.',
        detail: error.message,
      },
      { status: 500 }
    );
  }
}
