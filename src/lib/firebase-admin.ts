
import 'server-only';
import admin from 'firebase-admin';
import { env } from '@/config/env'; // Import the validated environment variables

// ======================================================================================
// FIREBASE ADMIN SDK INITIALIZATION (SINGLETON)
// ======================================================================================
// This pattern ensures that the Firebase Admin SDK is initialized only once per server
// instance. This is crucial for performance and to avoid re-initialization errors.
// We use a global symbol to store the initialized instance.
// ======================================================================================

declare global {
  // We need to declare the global.firebaseAdminInstance variable to avoid TypeScript errors.
  var firebaseAdminInstance: admin.app.App | undefined;
}

if (!global.firebaseAdminInstance) {
  // The private key from the .env.local file has escaped newlines (\n).
  // We need to replace them with actual newlines for the SDK to parse the key correctly.
  const privateKey = env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  try {
    // Initialize the app with the validated credentials from env.ts
    global.firebaseAdminInstance = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
    console.log('✅ Firebase Admin SDK initialized successfully (Singleton)');

  } catch (error: any) {
    // If initialization fails, log the specific error and re-throw
    console.error('🔥 Firebase Admin SDK Initialization Error:', error);
    throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
  }
}

// Export the initialized admin instance for use in other server-side modules.
export default global.firebaseAdminInstance;
