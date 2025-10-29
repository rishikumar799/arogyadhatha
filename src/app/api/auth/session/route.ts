
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
    // Verify the ID token to get the user's UID
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid } = decodedToken;

    // Fetch the user's document from Firestore to get their role
    const userDocRef = admin.firestore().collection('users').doc(uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      console.error(`No user document found in Firestore for UID: ${uid}`);
      return NextResponse.json({ error: 'User profile not found in database.' }, { status: 404 });
    }

    const userRole = userDoc.data()?.role;

    if (!userRole) {
      console.error(`User document for UID: ${uid} is missing the 'role' field.`);
      return NextResponse.json({ error: 'Role not found for this user.' }, { status: 403 });
    }

    // (Optional but good practice) Ensure the custom claim is set correctly for future use
    await admin.auth().setCustomUserClaims(uid, { role: userRole });

    // Create the session cookie
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    // Set the session cookie in the browser
    cookies().set('__session', sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    // Return the authoritative role from the database
    return NextResponse.json({ status: 'success', role: userRole });

  } catch (error) {
    console.error('Session login error:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 401 });
  }
}
