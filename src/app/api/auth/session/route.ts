
import { NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';

export async function POST(request: Request) {
  const { idToken } = await request.json();

  if (!idToken) {
    return NextResponse.json({ error: 'No ID token provided.' }, { status: 400 });
  }

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  try {
    // First, verify the token to get the UID.
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    const { uid } = decodedIdToken;

    // Then, fetch the user's document from Firestore to get the authoritative role.
    const userDocRef = admin.firestore().collection('users').doc(uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User profile not found in database.' }, { status: 404 });
    }

    const userRoleFromDb = userDoc.data()?.role;

    if (!userRoleFromDb) {
      return NextResponse.json({ error: 'Role not found for this user.' }, { status: 403 });
    }

    // CRITICAL FIX: Always convert the role to lowercase.
    const lowercaseRole = userRoleFromDb.toLowerCase();

    // CRITICAL FIX: Update the custom claims with the lowercase role BEFORE creating the session cookie.
    // This ensures the middleware will see the same lowercase role.
    await admin.auth().setCustomUserClaims(uid, { role: lowercaseRole });

    // Create the session cookie. It will now be created with the updated, correct claims.
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    // Create a response object to set the cookie.
    const response = NextResponse.json({ status: 'success', role: lowercaseRole });

    // Set the cookie in the browser.
    response.cookies.set('__session', sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    // Return the response.
    return response;

  } catch (error) {
    console.error('Session login error:', error);
    return NextResponse.json({ error: 'Failed to create session.' }, { status: 401 });
  }
}
