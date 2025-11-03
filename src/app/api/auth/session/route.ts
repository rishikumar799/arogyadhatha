
import { NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin'; 

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
    }

    const auth = admin.auth();
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    // *** TEMPORARY FIX ***
    // The 'secure' flag is removed to allow the cookie to be set over HTTP
    // in a local development environment. This is for debugging purposes.
    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      path: '/',
    };

    const response = NextResponse.json({ status: 'success' }, { status: 200 });
    response.cookies.set('firebase-session-token', sessionCookie, options);

    return response;
  } catch (error: any) {
    console.error('Error creating session cookie:', error);
    return NextResponse.json({ error: 'Unauthorized: ' + error.message }, { status: 401 });
  }
}
