
import admin from 'firebase-admin';

// This file is the single source of truth for initializing the Firebase Admin SDK.
// It ensures that the SDK is initialized only once, preventing errors in a serverless environment.

// Check if the SDK has already been initialized to prevent re-initialization.
if (!admin.apps.length) {
  try {
    // Initialize the SDK with service account credentials.
    // These credentials are read from environment variables for security.
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // THE FIX: The private key stored in environment variables has escaped newlines (\n).
        // We must replace these with actual newline characters (\n) for the key to be parsed correctly.
        // The regex /\\n/g is used to find all occurrences of the literal string '\n' and replace them.
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    // If initialization fails, log a detailed error message.
    // This is critical for debugging issues related to service account credentials or environment variables.
    console.error('CRITICAL: Firebase admin initialization error:', error);
  }
}

// Export the initialized admin instance for use throughout the application.
export default admin;
