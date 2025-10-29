
import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/lib/firebase-admin';

const SEVEN_DAYS_IN_SECONDS = 7 * 24 * 60 * 60;

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required.' }, { status: 400 });
    }

    const decodedToken = await auth.verifyIdToken(idToken);
    const userRole = decodedToken.role || 'patient'; 

    // Create the session cookie with the correct path and security attributes.
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: SEVEN_DAYS_IN_SECONDS * 1000 });

    const response = NextResponse.json({ status: 'success', role: userRole });
    
    // THE FIX: Set the cookie on the response with Path=/
    response.cookies.set('__session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: SEVEN_DAYS_IN_SECONDS,
      path: '/', // This makes the cookie available across the entire site
    });

    return response;

  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json({ error: 'Failed to create session.' }, { status: 500 });
  }
}
