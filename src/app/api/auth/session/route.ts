
import { NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin'; // USE the centralized admin instance

export async function POST(request: Request) {
  const { idToken } = await request.json();

  if (!idToken) {
    return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
  }

  try {
    const auth = admin.auth();
    const decodedToken = await auth.verifyIdToken(idToken);
    const role = decodedToken.role || 'patient'; 

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    // CORRECTED: Ensure the name is consistent
    const options = {
      name: 'firebase-session-token', 
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    };

    const response = NextResponse.json({ status: 'success', role }, { status: 200 });
    response.cookies.set(options);

    return response;
  } catch (error: any) {
    console.error('Error creating session cookie:', error);
    return NextResponse.json({ error: 'Unauthorized: ' + error.message }, { status: 401 });
  }
}
