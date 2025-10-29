
import { NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

export async function GET() {
  const sessionCookie = cookies().get('__session')?.value;

  if (!sessionCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (sessionCookie === 'superadmin') {
    return NextResponse.json({ role: 'superadmin' });
  }

  try {
    const decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
    const userRole = (decodedToken as any).role || 'patient'; 

    return NextResponse.json({ role: userRole });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
