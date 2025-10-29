
import { type NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get('__session')?.value || '';

  if (!sessionCookie) {
    return NextResponse.json({ error: 'Session cookie not found' }, { status: 401 });
  }

  try {
    const decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
    return NextResponse.json({ role: decodedToken.role }, { status: 200 });
  } catch (error) {
    // If verification fails, return an error
    return NextResponse.json({ error: 'Invalid session cookie' }, { status: 401 });
  }
}
