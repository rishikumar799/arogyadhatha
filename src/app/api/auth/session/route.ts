
import { NextResponse, type NextRequest } from 'next/server';
import admin from '@/lib/firebase-admin'; 

const SEVEN_DAYS_IN_SECONDS = 7 * 24 * 60 * 60;

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required.' }, { status: 400 });
    }

    // Use the correctly imported admin object
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userRole = decodedToken.role || 'patient'; 

    // Create the session cookie
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn: SEVEN_DAYS_IN_SECONDS * 1000 });

    const response = NextResponse.json({ status: 'success', role: userRole });
    
    // Set the cookie on the response with Path=/
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
