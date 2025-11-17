import { type NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';

const ROLES = {
  superadmin: { dashboard: "/superadmin/dashboard" },
  doctor: { dashboard: "/doctor/dashboard" },
  receptionist: { dashboard: "/receptionist/dashboard" },
  patient: { dashboard: "/patients/dashboard" },
  diagnostic: { dashboard: "/diagnostics/dashboard" },
};

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required.' }, { status: 400 });
    }

    // Decode token
    const decoded = await admin.auth().verifyIdToken(idToken);

    let role = decoded.role as keyof typeof ROLES;

    // 🔥 FIX: If custom claim missing → check Firestore
    if (!role) {
      const userDoc = await admin.firestore().collection('users').doc(decoded.uid).get();
      role = userDoc.data()?.role;
    }

    if (!role || !ROLES[role]) {
      return NextResponse.json(
        { error: 'Role missing or invalid. Contact admin.' },
        { status: 403 }
      );
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    const dashboardUrl = ROLES[role].dashboard;

    const res = NextResponse.json({ success: true, dashboardUrl });

    const isSecure = process.env.NODE_ENV === 'production' || request.url.startsWith("https");

    res.cookies.set('firebase-session-token', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: isSecure,
      path: '/',
      sameSite: 'lax',
    });

    res.cookies.set('role', role, {
      maxAge: expiresIn,
      httpOnly: false,
      secure: isSecure,
      path: '/',
      sameSite: 'lax',
    });

    res.cookies.set('uid', decoded.uid, {
      maxAge: expiresIn,
      httpOnly: false,
      secure: isSecure,
      path: '/',
      sameSite: 'lax',
    });

    return res;

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Session creation failed.' }, { status: 500 });
  }
}