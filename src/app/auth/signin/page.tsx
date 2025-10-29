'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const rolePaths: { [key: string]: string } = {
  patient: '/patients',
  doctor: '/doctor',
  receptionist: '/receptionist',
  superadmin: '/superadmin',
  diagnostics: '/diagnostics',
};

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user) {
        throw new Error('Authentication failed. Please try again.');
      }

      const idToken = await user.getIdToken();

      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Session creation failed.');
      }

      const { role } = await res.json();

      if (!role || !rolePaths[role]) {
        throw new Error('Role not found or invalid for this user.');
      }

      toast({ title: 'Login Successful', description: `Welcome back! Redirecting...` });

      // Force a hard browser redirect. This is the most reliable method.
      const dashboardPath = `${rolePaths[role]}/dashboard`;
      window.location.href = dashboardPath;

    } catch (error: any) {
      let errorMessage = 'Invalid email or password.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>Enter your email and password to access your account</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
