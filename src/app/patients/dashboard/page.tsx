'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This component is a workaround to redirect any traffic
// that might still be trying to access the old dashboard path.
export default function PatientDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    // The main patient page is now at /patients, which serves as the dashboard.
    router.replace('/patients');
  }, [router]);

  // Render a simple loading state while the redirect happens.
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to your dashboard...</p>
    </div>
  );
}
