
import { NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';

export async function POST(request: Request) {
  const { uid, role } = await request.json();

  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to set custom role:', error);
    return NextResponse.json({ error: 'Failed to set role' }, { status: 500 });
  }
}
