
import * as admin from 'firebase-admin';

// Function to initialize the Firebase Admin SDK
export const initAdmin = () => {
  // Check if the app is already initialized to prevent errors
  if (admin.apps.length > 0) {
    return;
  }

  try {
    // Initialize the Firebase Admin SDK from environment variables
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // The private key needs to be properly formatted.
        // Replace \\n with \n to ensure it's a valid private key.
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
  }
};
