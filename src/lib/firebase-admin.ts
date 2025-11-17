
import 'server-only';
import admin from 'firebase-admin';

// Check if the app is already initialized to prevent errors
if (!admin.apps.length) {
  // Read the environment variables
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // The private key is stored with escaped newlines in the .env file.
  // We need to replace them back to actual newlines for the SDK to parse the key correctly.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  // --- CRITICAL VALIDATION ---
  // If any of these critical variables are missing, we must throw a real error
  // to stop the server from starting in a broken state. This is the root cause of the crash.
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'CRITICAL_ERROR: Missing Firebase Admin SDK environment variables. Check your .env.local file. Required: NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY'
    );
  }

  // Initialize the Firebase Admin SDK
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    console.log('Firebase Admin SDK initialized successfully.');

  } catch (error: any) {
    // If initialization fails (e.g., malformed credentials), log the specific error and re-throw
    console.error('Firebase Admin SDK Initialization Error:', error);
    throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
  }
}

// Export the initialized admin instance
export default admin;
