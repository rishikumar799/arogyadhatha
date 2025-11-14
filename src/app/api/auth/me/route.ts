
import { type NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

/**
 * API route to get the current user's profile from the session cookie.
 * This is the definitive server-side check for authentication state.
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Get the session cookie from the request headers.
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('firebase-session-token')?.value;

    // If there's no cookie, there's no user. Return null.
    if (!sessionCookie) {
      return NextResponse.json(null, { status: 200 });
    }

    // 2. Verify the session cookie with Firebase Admin.
    // The `true` checks for revocation.
    const decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
    
    // 3. (Optional but Recommended) Fetch the user's full profile from Firestore.
    // This ensures we have the latest role and other details.
    const userDoc = await admin.firestore().collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      // This indicates a mismatch between auth and database, a rare but possible state.
      // Treat the user as logged out.
      return NextResponse.json(null, { status: 200 });
    }

    const userProfile = userDoc.data();

    // 4. Return the combined user data.
    return NextResponse.json({ ...decodedToken, ...userProfile }, { status: 200 });

  } catch (error) {
    // This will catch errors like an expired or invalid session cookie.
    // In all error cases, we treat the user as logged out.
    console.warn('Session verification failed:', error);
    return NextResponse.json(null, { status: 200 });
  }
}
