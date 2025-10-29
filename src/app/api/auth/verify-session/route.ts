
import { type NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  let sessionCookie = request.cookies.get('__session')?.value;

  // As a fallback, check the Authorization header if the cookie isn't found directly.
  // This makes verification more reliable from the middleware.
  if (!sessionCookie) {
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      sessionCookie = authHeader.substring(7);
    }
  }

  if (!sessionCookie) {
    return NextResponse.json({ error: 'Session identifier not found' }, { status: 401 });
  }

  try {
    // Verify the session cookie and return the user's role.
    const decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
    return NextResponse.json({ role: decodedToken.role }, { status: 200 });
  } catch (error) {
    // If verification fails, the session is invalid.
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
}
