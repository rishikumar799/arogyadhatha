
import { NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { idToken } = await request.json();

  if (!idToken) {
    return NextResponse.json({ error: 'No ID token provided.' }, { status: 400 });
  }

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds

  try {
    // Verify the ID token and create a session cookie.
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    // Set the session cookie in the browser.
    cookies().set('__session', sessionCookie, {
      maxAge: expiresIn / 1000, // maxAge is in seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return NextResponse.json({ status: 'success', role: decodedToken.role });

  } catch (error) {
    console.error('Session login error:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 401 });
  }
}
