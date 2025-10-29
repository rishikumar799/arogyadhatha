
import { NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';

export async function POST(request: Request) {
  const { idToken } = await request.json();

  if (!idToken) {
    return NextResponse.json({ error: 'No ID token provided.' }, { status: 400 });
  }

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email } = decodedIdToken;

    const userDocRef = admin.firestore().collection('users').doc(uid);
    const userDoc = await userDocRef.get();

    let userRole: string;

    // THE FIX: If the user document does not exist in Firestore, create it.
    if (!userDoc.exists) {
      // Determine the role for the new user.
      // If it's the special superadmin email, assign the 'superadmin' role.
      if (email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL) {
        userRole = 'superadmin';
      } else {
        // Otherwise, default to 'patient' for all other new users.
        userRole = 'patient';
      }

      // Create the user document in Firestore with their email and new role.
      await userDocRef.set({
        email: email,
        role: userRole,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    } else {
      // If the user document exists, get their role from the database.
      const existingRole = userDoc.data()?.role;
      if (!existingRole) {
        return NextResponse.json({ error: 'Role not found for existing user.' }, { status: 403 });
      }
      userRole = existingRole;
    }

    const lowercaseRole = userRole.toLowerCase();

    // Set the role as a custom claim on the user's auth token.
    await admin.auth().setCustomUserClaims(uid, { role: lowercaseRole });

    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
    const response = NextResponse.json({ status: 'success', role: lowercaseRole });

    response.cookies.set('__session', sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Session login error:', error);
    return NextResponse.json({ error: 'Failed to create session.' }, { status: 401 });
  }
}
