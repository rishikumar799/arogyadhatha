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

  const SUPER_ADMIN_EMAIL =
    process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || 'superadmin@example.com';
  const SUPER_ADMIN_PASSWORD =
    process.env.NEXT_PUBLIC_SUPER_ADMIN_PASSWORD || 'SuperSecret123';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (email === SUPER_ADMIN_EMAIL && password === SUPER_ADMIN_PASSWORD) {
        document.cookie = 'superAdminSession=true; path=/';
        toast({ title: 'Super Admin Login', description: 'Welcome Super Admin!' });
        window.location.href = '/superadmin/dashboard';
        return;
      }

      if (!auth) {
        throw new Error('Firebase not initialized');
      }

      const userCredential = await signIn(email, password);
      if (!userCredential?.user) {
        throw new Error('No user data received');
      }
      
      const uid = userCredential.user.uid;
      let role: string | null = null;

      // Correctly map each role to its specific dashboard path
      const mapRoleToPrefix = (r: string) => {
        const role = (r || '').toString().toLowerCase();
        if (role === 'patient') return 'patient';
        if (role === 'doctor') return 'doctor';
        if (role === 'receptionist') return 'receptionist';
        if (role === 'diagnostics') return 'diagnostics';
        if (role === 'superadmin') return 'superadmin';
        return 'patient'; // Default fallback
      };

      try {
        const requestDoc = await getDoc(doc(db, 'requests', uid));
        const requestData = requestDoc.exists() ? requestDoc.data() : null;
        if (requestData && requestData.status !== 'Approved') {
          throw new Error('Your account is pending approval from the administrator');
        }

        const userDoc = await getDoc(doc(db, 'users', uid));
        const userData = userDoc.exists() ? userDoc.data() : null;

        if (userData && userData.role) {
          role = userData.role.toString().toLowerCase();
        }
      } catch (err: any) {
        const code = err?.code || '';
        const isPermissionError = typeof code === 'string' ? code.toLowerCase().includes('permission') : String(err?.message || '').toLowerCase().includes('permission');

        if (!role && isPermissionError) {
          try {
            const idToken = await userCredential.user.getIdToken(true);
            const res = await fetch('/api/auth/session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ idToken }),
            });

            if (!res.ok) {
              const body = await res.json().catch(() => ({}));
              throw new Error(body?.error || 'Server session fallback failed');
            }

            const data = await res.json();
            if (data?.error) throw new Error(data.error);
            role = data?.role?.toString().toLowerCase() || null;
          } catch (fallbackErr: any) {
            throw new Error('Missing or insufficient permissions to read user data from Firestore. Server fallback failed: ' + (fallbackErr?.message || fallbackErr));
          }
        }
      }

      if (!role) {
        await auth.signOut();
        throw new Error('User role not found. Please sign up or contact administrator.');
      }

      const prefix = mapRoleToPrefix(role);
      router.push(`/${prefix}/dashboard`);
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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
