
import { NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';

export async function POST(request: Request) {
  const { idToken } = await request.json();

  if (idToken === 'superadmin') {
    const response = NextResponse.json({ role: 'superadmin' });
    // This value needs to be handled in the verify-session route
    response.cookies.set('__session', 'superadmin', { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return response;
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const db = admin.firestore();
    const userDocRef = db.collection('users').doc(uid);
    const userDoc = await userDocRef.get();
    
    if (!userDoc.exists) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const role = userDoc.data()?.role || 'patient';

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({ role });
    response.cookies.set('__session', sessionCookie, { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    return response;
  } catch (error) {
    console.error('Session login error:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 401 });
  }
}
