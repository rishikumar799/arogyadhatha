'''
This is the POST route for creating a session cookie.
It exchanges an ID token from the Firebase client SDK for a session cookie.
'''
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import admin from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';

export async function POST(request: Request) {
  const { idToken } = await request.json();

  if (!idToken) {
    return NextResponse.json({ error: 'ID token is required.' }, { status: 400 });
  }

  try {
    const auth = getAuth(admin);
    
    // Verify the ID token to ensure it is valid.
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // The token is valid. Now, create the session cookie.
    // Set session expiration to 5 days. Adjust as needed.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    // Set the cookie on the response. 
    // The 'secure' and 'httpOnly' flags are essential for security.
    cookies().set('session', sessionCookie, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: expiresIn, 
      path: '/', // The cookie is available to all pages
    });

    return NextResponse.json({ success: true, message: 'Session created successfully.' });

  } catch (error: any) {
    console.error('Error creating session cookie:', error);
    // The token was invalid, expired, or there was some other Firebase error.
    return NextResponse.json(
      { success: false, error: 'Invalid or expired token.', detail: error.message }, 
      { status: 401 }
    );
  }
}
