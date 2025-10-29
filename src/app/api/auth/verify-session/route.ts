
import { type NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  let sessionCookie = request.cookies.get('__session')?.value;

  if (!sessionCookie) {
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      sessionCookie = authHeader.substring(7);
    }
  }

  if (!sessionCookie) {
    return NextResponse.json({ error: 'Session cookie not found' }, { status: 401 });
  }

  try {
    // Step 1: Verify the session cookie to get the user's unique ID (UID).
    const decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
    const { uid } = decodedToken;

    // Step 2: Fetch the user's profile directly from the Firestore database.
    // This is the single source of truth for the user's role.
    const userDocRef = admin.firestore().collection('users').doc(uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User profile not found in database.' }, { status: 404 });
    }

    const userRole = userDoc.data()?.role;

    if (!userRole) {
      return NextResponse.json({ error: 'Role not found in user profile.' }, { status: 403 });
    }

    // Step 3: Return the authoritative role from the database.
    return NextResponse.json({ role: userRole.toLowerCase() }, { status: 200 });

  } catch (error) {
    console.error('Verify session error:', error);
    return NextResponse.json({ error: 'Invalid or expired session.' }, { status: 401 });
  }
}