'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from 'lucide-react';

// CORRECTED: The paths now point to the /dashboard sub-route for each role,
// based on the existing file structure you provided.
const roleDashboardPaths: { [key: string]: string } = {
  patient: '/patients/dashboard',
  doctor: '/doctor/dashboard',
  superadmin: '/superadmin/dashboard',
  receptionist: '/receptionist/dashboard',
  diagnostics: '/diagnostics/dashboard',
};

export default function HomePage() {
  const { userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && userProfile) {
      const role = userProfile.role.toLowerCase();
      const path = roleDashboardPaths[role];
      if (path) {
        router.replace(path);
      }
    }
  }, [userProfile, loading, router]);

  if (loading || userProfile) {
    return (
      <div className="flex h-[calc(100vh-8rem)] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] w-full items-center justify-center bg-background">
      <div className="mx-auto max-w-lg text-center space-y-6">
        
        <div 
          className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent-foreground text-transparent bg-clip-text">
          Aarogya Dhatha
        </div>

        <p className="text-muted-foreground">
          Welcome to the future of healthcare management. Please sign in to access your personalized dashboard.
        </p>

        <div>
          <Link href="/auth/signin">
            <Button size="lg" className="w-full max-w-xs mx-auto shadow-lg">
              Proceed to Sign In
            </Button>
          </Link>
        </div>

        <p className="pt-4 text-sm text-muted-foreground">
          This is the public home page. Specific dashboards for patients, doctors, and staff are protected and require authentication.
        </p>

      </div>
    </div>
  );
}
