
import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';

export async function POST(req: NextRequest) {
  // Enhanced error checking for environment variables
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    const errorMessage = "Firebase Admin credentials are not set. Please create a .env.local file in the root directory and add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.";
    console.error(errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }

  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Ensure newlines are correctly formatted
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  // Initialize Firebase Admin SDK if not already initialized
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
      });
    } catch (error: any) {
      console.error("Firebase Admin initialization error:", error.message);
      return NextResponse.json({ error: "Failed to initialize Firebase Admin. Check your service account credentials.", details: error.message }, { status: 500 });
    }
  }

  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const userDoc = await admin.firestore().collection('users').doc(uid).get();

    if (!userDoc.exists) {
      const requestDoc = await admin.firestore().collection('requests').doc(uid).get();
      if(requestDoc.exists && requestDoc.data()?.status !== 'Approved') {
        return NextResponse.json({ error: 'Your account is pending approval.' }, { status: 403 });
      }
      return NextResponse.json({ error: 'User not found in database.' }, { status: 404 });
    }

    const role = userDoc.data()?.role;
    if (!role) {
      return NextResponse.json({ error: 'Role not found for this user.' }, { status: 500 });
    }

    return NextResponse.json({ role }, { status: 200 });

  } catch (error: any) {
    console.error('Session API Error:', error);
    let errorMessage = 'An internal server error occurred.';
    if (error.code === 'auth/id-token-expired') {
        errorMessage = 'Your session has expired. Please sign in again.';
    } else if (error.code === 'auth/argument-error') {
        errorMessage = 'Invalid authentication token provided.';
    }
    
    return NextResponse.json({ error: errorMessage, details: error.message }, { status: 500 });
  }
}
