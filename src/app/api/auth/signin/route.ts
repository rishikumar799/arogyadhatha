import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import admin from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    const auth = getAuth(admin);
    const user = await auth.getUserByEmail(email);

    // IMPORTANT: This is a simplified example. In a real application, 
    // you would verify the password here. Next.js does not have a standard 
    // way to do this with Firebase Auth out-of-the-box.
    // You might need a custom solution or a different authentication provider.
    if (user) {
      // Create a session cookie
      const sessionCookie = await auth.createSessionCookie(
        await auth.createCustomToken(user.uid),
        { expiresIn: 60 * 60 * 24 * 5 * 1000 }
      );
      cookies().set('session', sessionCookie, { httpOnly: true, secure: true });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
