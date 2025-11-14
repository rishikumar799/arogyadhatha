'use client';

import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

type Role = 'Patient' | 'Doctor' | 'Receptionist' | 'Diagnostics';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<Role | '' >('');
  const [hospital, setHospital] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!role) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a role.' });
      return;
    }

    if (role !== 'Patient' && !hospital) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter hospital name.' });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create the user on the client
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid;

      const userData = {
        uid,
        firstName,
        lastName,
        email,
        role: role.toLowerCase(),
        hospital: role === 'Patient' ? '' : hospital,
        bloodGroup: bloodGroup || '',
        createdAt: new Date(),
        status: role === 'Patient' ? 'Approved' : 'Pending',
      };

      // 2. Save user data and handle role-specific logic
      if (role === 'Patient') {
        // For patients, create the user, set the role, and log them in immediately.
        await setDoc(doc(db, 'users', uid), userData);

        // 2a. Set the custom claim
        const setRoleResponse = await fetch('/api/auth/set-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid, role: 'patient' }),
        });

        if (!setRoleResponse.ok) {
          throw new Error('Failed to set user role.');
        }

        // 2b. Force-refresh the token to get the new custom claim
        const idToken = await user.getIdToken(true);

        // 2c. Create the session cookie
        const sessionResponse = await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });

        if (!sessionResponse.ok) {
          throw new Error('Failed to create session after signup.');
        }

        toast({ title: 'Registration Successful', description: 'Welcome! Redirecting you to your dashboard...' });
        
        // 2d. Redirect. The middleware will handle routing to the correct dashboard.
        window.location.assign('/');

      } else {
        // For other roles, submit them for approval and redirect to the sign-in page.
        await setDoc(doc(db, 'requests', uid), userData);
        toast({
          title: 'Request Submitted',
          description: 'Your registration is pending approval. You will be notified via email.',
        });
        window.location.assign('/auth/signin');
      }

    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Signup Failed', description: error.message || 'An unknown error occurred.' });
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>Enter your details to create an account</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Form fields remain the same */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={(value) => setRole(value as Role)} value={role}>
              <SelectTrigger id="role"><SelectValue placeholder="Select role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Patient">Patient</SelectItem>
                <SelectItem value="Doctor">Doctor</SelectItem>
                <SelectItem value="Receptionist">Receptionist</SelectItem>
                <SelectItem value="Diagnostics">Diagnostics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {role !== 'Patient' && role !== '' && (
            <div className="grid gap-2">
              <Label htmlFor="hospital">Hospital Name</Label>
              <Input id="hospital" placeholder="Enter hospital name" required value={hospital} onChange={(e) => setHospital(e.target.value)} />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="bloodGroup">Blood Group (Optional)</Label>
            <Select onValueChange={(value) => setBloodGroup(value)} value={bloodGroup}>
              <SelectTrigger id="bloodGroup"><SelectValue placeholder="Select Blood Group" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem><SelectItem value="A-">A-</SelectItem><SelectItem value="B+">B+</SelectItem><SelectItem value="B-">B-</SelectItem><SelectItem value="O+">O+</SelectItem><SelectItem value="O-">O-</SelectItem><SelectItem value="AB+">AB+</SelectItem><SelectItem value="AB-">AB-</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          Already have an account? <Link href="/auth/signin" className="underline">Sign in</Link>
        </div>
      </CardContent>
    </Card>
  );
}