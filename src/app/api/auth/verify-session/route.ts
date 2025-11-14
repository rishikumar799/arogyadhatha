
import { type NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get('firebase-session-token')?.value || '';

  if (!sessionCookie) {
    return NextResponse.json({ error: 'Session cookie not found.' }, { status: 401 });
  }

  try {
    // The `checkRevoked` flag is set to `true` to ensure that revoked sessions are not authenticated.
    // This requires the service account to have the "Firebase Auth Admin" IAM role.
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    const userRole = decodedClaims.role;

    if (!userRole) {
      return NextResponse.json({ error: 'Role not found in session claims.' }, { status: 403 });
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
