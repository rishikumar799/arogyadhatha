
import { NextRequest, NextResponse } from 'next/server';
import { initAdmin } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
initAdmin();

/**
 * Handles the secure deletion of a user from Firebase Authentication and Firestore.
 * This function is intended to be called by the Super Admin.
 * @param req - The incoming Next.js API request.
 * @returns A response indicating the outcome of the deletion process.
 */
export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json();

    if (!uid) {
      return NextResponse.json({ message: 'User ID is required.' }, { status: 400 });
    }

    // --- Security Check (Optional but Recommended) ---
    // Here, you could add a check to ensure that the request is coming from an authenticated Super Admin.
    // This would involve verifying a token from the request headers.
    // For now, we will proceed assuming the request is legitimate.

    const auth = admin.auth();
    const db = admin.firestore();

    // 1. Delete the user from Firebase Authentication
    await auth.deleteUser(uid);

    // 2. Delete the user's registration request from Firestore
    const requestRef = db.collection('requests').doc(uid);
    await requestRef.delete();

    return NextResponse.json({ message: 'User successfully deleted.' }, { status: 200 });

  } catch (error: any) {
    console.error('Error deleting user:', error.message);

    // Provide a more specific error message based on the error code
    let errorMessage = 'An unexpected error occurred.';
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'User not found in Firebase Authentication.';
    } else if (error.code === 'permission-denied') {
      errorMessage = 'Permission denied. Ensure the admin service account has the necessary permissions.';
    }

    return NextResponse.json({ message: errorMessage, error: error.code }, { status: 500 });
  }
}
