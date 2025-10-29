
import { type NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get('__session')?.value || '';

  if (!sessionCookie) {
    return NextResponse.json({ error: 'Session cookie not found' }, { status: 401 });
  }

  try {
    // THE REAL FIX: Verify the session cookie and trust the claims within it.
    // The role is baked into the session cookie when it's created.
    // There is no need for a separate, failure-prone database lookup.
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    
    const userRole = decodedClaims.role;

    if (!userRole) {
      // This would mean the session cookie was created without a role, which is an issue
      // in the session creation logic itself.
      return NextResponse.json({ error: 'Role not found in session claims.' }, { status: 403 });
    }

    // Return the authoritative role from the session cookie itself.
    return NextResponse.json({ role: userRole.toLowerCase() }, { status: 200 });

  } catch (error) {
    console.error('Verify session error:', error);
    return NextResponse.json({ error: 'Invalid or expired session.' }, { status: 401 });
  }
}
