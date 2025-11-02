
import { type NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get('firebase-session-token')?.value || '';

  if (!sessionCookie) {
    return NextResponse.json({ error: 'Session cookie not found.' }, { status: 401 });
  }

  try {
    // DIAGNOSTIC STEP: The `checkRevoked` flag is set to `false`.
    // If the login loop stops, it confirms the issue is a server-side permission problem where the
    // service account cannot check for revoked sessions. The long-term fix is to adjust IAM permissions.
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, false);
    const uid = decodedClaims.uid;
    
    const userDocRef = admin.firestore().collection('users').doc(uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: `User profile not found in database for UID: ${uid}` }, { status: 404 });
    }
    
    const userRole = userDoc.data()?.role;
    if (!userRole) {
      return NextResponse.json({ error: `Role not found in user profile for UID: ${uid}` }, { status: 404 });
    }

    return NextResponse.json({ role: userRole.toLowerCase() }, { status: 200 });

  } catch (error: any) {
    console.error('Verify session error:', error);
    return NextResponse.json({ 
        error: 'Invalid or expired session cookie.',
        detail: error.message
    }, { status: 401 });
  }
}
