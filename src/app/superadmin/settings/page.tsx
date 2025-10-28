'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { toast } = useToast();
  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || '');
  const [password, setPassword] = useState(process.env.NEXT_PUBLIC_SUPER_ADMIN_PASSWORD || '');

  const handleSaveChanges = () => {
    // This is a placeholder for saving changes. In a real application,
    // you would want to update the environment variables or a configuration file.
    toast({ title: 'Settings Saved', description: 'Your changes have been saved.' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Super Admin Settings</CardTitle>
        <CardDescription>Manage your super admin credentials.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </CardContent>
    </Card>
  );
}
