
import { NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json({ error: 'ID token not provided' }, { status: 400 });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const db = getFirestore();
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    let role = 'patient'; // Default role

    if (userDoc.exists) {
      role = userDoc.data()?.role || role;
    } else {
      // This is a new user, create a document for them.
      // The superadmin setup script handles superadmin creation.
      // All other new users signing up through the app will be patients.
      await userRef.set({
        uid,
        email: decodedToken.email,
        role,
        createdAt: new Date(),
      });
    }

    // Set custom claims if they don't match the database role
    if (decodedToken.role !== role) {
      await admin.auth().setCustomUserClaims(uid, { role });
    }

    // THE FIX: Set a proper expiration for the session cookie.
    // 5 days in seconds. This was previously 0, causing immediate expiration.
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({ success: true, role });

    // Set the session cookie in the browser.
    response.cookies.set('__session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: expiresIn, // Use the same expiration time
    });

    return response;

  } catch (error: any) {
    console.error('Session login error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
