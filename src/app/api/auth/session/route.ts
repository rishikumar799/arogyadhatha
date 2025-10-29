
import { NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { idToken } = await request.json();

  if (!idToken) {
    return NextResponse.json({ error: 'No ID token provided.' }, { status: 400 });
  }

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    const { uid } = decodedIdToken;

    const userDocRef = admin.firestore().collection('users').doc(uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User profile not found in database.' }, { status: 404 });
    }

    const userRoleFromDb = userDoc.data()?.role;

    if (!userRoleFromDb) {
      return NextResponse.json({ error: 'Role not found for this user.' }, { status: 403 });
    }

    // THE DEFINITIVE FIX: Enforce lowercase role consistency at the source.
    const lowercaseRole = userRoleFromDb.toLowerCase();

    // Update the user's custom claims with this consistent, lowercase role.
    await admin.auth().setCustomUserClaims(uid, { role: lowercaseRole });

    // Create the session cookie with the verified token.
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    cookies().set('__session', sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    // Return the consistent, lowercase role to the frontend.
    return NextResponse.json({ status: 'success', role: lowercaseRole });

  } catch (error) {
    console.error('Session login error:', error);
    return NextResponse.json({ error: 'Failed to create session.' }, { status: 401 });
  }
}
