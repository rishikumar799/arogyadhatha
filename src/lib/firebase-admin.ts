
import * as admin from 'firebase-admin';

// This file is the single source of truth for initializing the Firebase Admin SDK.
// It ensures that the SDK is initialized only once, preventing errors in a serverless environment.

// The service account credentials are not stored in the codebase for security reasons.
// Instead, they are provided as environment variables during the build and runtime.
//
// - NEXT_PUBLIC_FIREBASE_PROJECT_ID: The public ID of your Firebase project.
// - FIREBASE_CLIENT_EMAIL: The client email of the service account.
// - FIREBASE_PRIVATE_KEY: The private key of the service account.
//
// These variables are configured in the `apphosting.yaml` file to be securely
// available to the server-side runtime environment.

interface FirebaseAdminConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

function getFirebaseAdminConfig(): FirebaseAdminConfig {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // The private key comes from a secret manager, and newlines need to be correctly formatted.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Firebase Admin SDK credentials are not set. Please check your environment variables (NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY).'
    );
  }

  return { projectId, clientEmail, privateKey };
}

export function initAdmin() {
  // Check if the app is already initialized to prevent re-initialization
  if (admin.apps.length === 0) {
    console.log('Initializing Firebase Admin SDK...');
    try {
      const config = getFirebaseAdminConfig();
      admin.initializeApp({
        credential: admin.credential.cert(config),
      });
      console.log('Firebase Admin SDK initialized successfully.');
    } catch (error) {
      console.error('Error initializing Firebase Admin SDK:', error);
      // We throw the error to ensure that any process that depends on the Admin SDK
      // will fail loudly instead of continuing in a broken state.
      throw error;
    }
  }
}
