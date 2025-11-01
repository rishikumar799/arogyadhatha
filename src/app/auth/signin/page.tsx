'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

function getDashboardPath(role: string): string {
  const dashboards: { [key: string]: string } = {
    superadmin: '/superadmin',
    doctor: '/doctor',
    receptionist: '/receptionist',
    diagnostics: '/diagnostics',
    patient: '/patients',
  };
  return dashboards[role.toLowerCase()] || '/';
}

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (!user) throw new Error('Firebase user authentication failed.');

      const idToken = await user.getIdToken();

      // 2. Call the session API to create the cookie
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Session API call failed. Please check server logs.');
      }

      const { role } = data;
      if (!role) {
        throw new Error('Role is missing from the API response.');
      }
      
      const dashboardPath = getDashboardPath(role);

      toast({ title: 'Login Successful', description: 'Redirecting to your dashboard...' });

      // 3. Perform a full page redirect. This is the most robust method
      // to ensure the browser has processed the session cookie before the next page loads.
      window.location.href = dashboardPath;

    } catch (error: any) {
      console.error('SIGN-IN ERROR:', error.message);
      toast({ title: 'Login Failed', description: error.message, variant: 'destructive' });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sign In</h1>
          <p className="text-gray-500 dark:text-gray-400">Enter your email and password to access your account</p>
        </div>
        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account? <Link href="/auth/signup" className="font-medium text-blue-600 hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
