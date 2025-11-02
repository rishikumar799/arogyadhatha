import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

const superAdminEmail = 'superadmin@example.com';
const superAdminPassword = 'SuperSecret123';

try {
  if (admin.apps.length === 0) {
    console.log('Initializing Firebase Admin SDK...');
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }

  const auth = admin.auth();
  const db = getFirestore();

  console.log(`Checking if user ${superAdminEmail} exists...`);

  let user;
  try {
    user = await auth.getUserByEmail(superAdminEmail);
    console.log('User already exists. Updating user to be a super admin.');
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.log('User not found. Creating a new user...');
      user = await auth.createUser({
        email: superAdminEmail,
        password: superAdminPassword,
        emailVerified: true,
        disabled: false,
      });
      console.log('Successfully created new user.');
    } else {
      throw error;
    }
  }

  console.log(`Setting custom claims and Firestore role for user: ${user.uid}`);
  await auth.setCustomUserClaims(user.uid, { role: 'superadmin' });

  await db.collection('users').doc(user.uid).set({
    uid: user.uid,
    email: superAdminEmail,
    role: 'superadmin',
    firstName: 'Super',
    lastName: 'Admin',
    createdAt: new Date(),
  }, { merge: true });

  console.log('✅ Super admin setup complete!');
  console.log('You can now log in with the following credentials:');
  console.log(`   Email: ${superAdminEmail}`);
  console.log('   Password: [hidden for security]');

} catch (error) {
  console.error('❌ Error setting up super admin:', error.message);
  console.error('Please ensure your Firebase Admin environment variables are set correctly.');
}
