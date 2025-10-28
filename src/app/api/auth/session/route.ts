
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from 'firebase-admin';
import { initAdmin } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  await initAdmin();
  const { idToken } = await request.json();

  try {
    const decodedToken = await auth().verifyIdToken(idToken);
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth().createSessionCookie(idToken, { expiresIn });

    cookies().set('__session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}
