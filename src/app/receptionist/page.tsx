'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { User } from 'firebase/auth';

// This is now a simple, clean component. The middleware handles all authentication.

export default function ReceptionistDashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // The auth state listener is useful for getting user info on the client-side,
    // but it's not required for security. The middleware has already protected this page.
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Receptionist Dashboard</h1>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Welcome</h2>
        {user ? (
          <p>Hello, <span className="font-medium">{user.email}</span>. You have successfully accessed your protected dashboard.</p>
        ) : (
          <p>Loading user data...</p>
        )}
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">This page is only visible to authenticated users with the 'receptionist' role.</p>
      </div>
    </div>
  );
}
