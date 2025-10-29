import admin from 'firebase-admin';

// This is the direct initialization method you suggested.
// It is simpler but relies on a local file being present.

if (!admin.apps.length) {
  try {
    // We use require here because it can handle JSON files directly.
    // The path is relative from the final build location of this file.
    const serviceAccount = require('../../../serviceAccountKey.json');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // The database URL is still useful to have in an environment variable.
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });

  } catch (error: any) {
    // Provide a helpful error message if the key file is missing.
    if (error.code === 'MODULE_NOT_FOUND') {
      throw new Error(
        'Firebase Admin initialization error: The serviceAccountKey.json file was not found. Please download it from your Firebase project settings and place it in the root directory of your project.'
      );
    }
    // Re-throw other errors.
    throw error;
  }
}

export default admin;
