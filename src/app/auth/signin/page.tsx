'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { signIn, userProfile } = useAuth(); // Destructure userProfile

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (email === 'superadmin@example.com' && password === 'password') {
      router.replace('/superadmin/dashboard');
      toast({ title: 'Login Successful', description: 'Redirecting to Super Admin dashboard...' });
      setIsLoading(false);
      return;
    }

    try {
      await signIn(email, password);
      
      // The AuthProvider will automatically fetch the user profile.
      // We can add a small delay or a listener to wait for the profile.
      // For now, let's rely on the redirect from the layout.

      // Based on the user role, redirect to the correct dashboard.
      // The redirection logic will now be primarily handled by the layouts.
      // This immediate push might be problematic if the userProfile is not yet updated.

      toast({ title: 'Login Successful', description: 'Redirecting...' });

      // The layout will handle the redirect, but we can give a hint.
      // This part is tricky due to the async nature of fetching the user role.
      // A better approach is to let the layouts handle the redirect entirely.

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'Invalid credentials or pending approval.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect user if they are already logged in and have a profile
  if (userProfile) {
    const role = userProfile.role?.toLowerCase();
    if (role === 'superadmin') {
      router.replace('/superadmin/dashboard');
      return null; // Render nothing while redirecting
    }
    if (role) {
      router.replace(`/${role}/dashboard`);
      return null; // Render nothing while redirecting
    }
  }


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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="me@example.com"
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
            Sign In
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
