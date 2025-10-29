
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { signIn } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    if (error && process.env.NODE_ENV === 'development') {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: `Debug info: ${error}`,
      });
    }
  }, [toast]);

  const SUPER_ADMIN_EMAIL = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || 'superadmin@example.com';
  const SUPER_ADMIN_PASSWORD = process.env.NEXT_PUBLIC_SUPER_ADMIN_PASSWORD || 'SuperSecret123';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let idToken;
      let role = 'patient';

      if (email === SUPER_ADMIN_EMAIL && password === SUPER_ADMIN_PASSWORD) {
        idToken = 'superadmin'; 
        role = 'superadmin';
      } else {
        const userCredential = await signIn(email, password);
        if (!userCredential?.user) {
          throw new Error('No user data received');
        }

        const userDocRef = doc(db, 'users', userCredential.user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          toast({
            title: 'Request Pending',
            description: 'Your registration request is still pending approval.',
          });
          await signOut(auth);
          setIsLoading(false);
          return;
        }

        idToken = await userCredential.user.getIdToken(true);
        const tokenResult = await userCredential.user.getIdTokenResult();
        role = (tokenResult.claims.role as string) || 'patient';
      }

      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'Session creation failed');
      }

      const sessionData = await res.json();

      const dashboard = `/${sessionData.role || role}/dashboard`;
      router.push(dashboard);
      toast({ title: 'Login Successful', description: `Welcome back!` });

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'Invalid credentials.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>Enter your email and password</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
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
          Don't have an account?{' '}
          <Link href="/auth/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
