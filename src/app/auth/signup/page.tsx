
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const idToken = await userCredential.user.getIdToken();

      if (role === 'Patient') {
        await setDoc(doc(db, 'users', uid), {
          uid,
          firstName,
          lastName,
          email,
          role,
          hospital: '',
          bloodGroup: bloodGroup || '',
          createdAt: new Date(),
        });

        const response = await fetch('/api/auth/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        });

        if (!response.ok) {
          throw new Error('Failed to create session');
        }

        toast({ title: 'Registration Successful', description: 'You are now logged in.' });
        router.push('/patients/dashboard');
      } else {
        await setDoc(doc(db, 'requests', uid), {
          uid,
          firstName,
          lastName,
          email,
          role,
          hospital,
          bloodGroup: bloodGroup || '',
          status: 'Pending',
          createdAt: new Date(),
        });

        toast({
          title: 'Request Submitted',
          description: 'Your registration is pending approval by Super Admin.',
        });

        router.push('/auth/signin');
      }

      // Clear form
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setRole('');
      setHospital('');
      setBloodGroup('');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Signup Failed', description: error.message || 'Error occurred.' });
    } finally {
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
          {/* First/Last name */}
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

          {/* Role */}
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={(value: Role) => setRole(value)} value={role}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Patient">Patient</SelectItem>
                <SelectItem value="Doctor">Doctor</SelectItem>
                <SelectItem value="Receptionist">Receptionist</SelectItem>
                <SelectItem value="Diagnostics">Diagnostics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Hospital for non-patients */}
          {role !== 'Patient' && role !== '' && (
            <div className="grid gap-2">
              <Label htmlFor="hospital">Hospital Name</Label>
              <Input
                id="hospital"
                placeholder="Enter hospital name"
                required
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
              />
            </div>
          )}

          {/* Blood group (optional) */}
          <div className="grid gap-2">
            <Label htmlFor="bloodGroup">Blood Group (Optional)</Label>
            <Select onValueChange={(value: string) => setBloodGroup(value)} value={bloodGroup}>
              <SelectTrigger id="bloodGroup">
                <SelectValue placeholder="Select Blood Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Email / Password */}
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
