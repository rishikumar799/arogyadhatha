'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

type Theme = 'light' | 'dark';
const THEME_KEY = 'medibridge:theme';

export default function EditProfilePage() {
  const [theme, setTheme] = useState<Theme>('light');
  const [name, setName] = useState('Super Admin');
  const [email, setEmail] = useState('superadmin@medibridge.com');
  const [isActive, setIsActive] = useState(true);
  const [canDelete, setCanDelete] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  // Apply theme to document
  const applyTheme = (t: Theme) => {
    if (typeof window === 'undefined') return;
    document.documentElement.setAttribute('data-theme', t);
    if (t === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  // Load saved theme on mount (persistent dark/light mode)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY) as Theme | null;
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = stored === 'light' || stored === 'dark' ? stored : prefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      applyTheme(initialTheme);
    } catch {
      setTheme('light');
      applyTheme('light');
    }
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your Super Admin account settings and security preferences
        </p>
      </div>

      {/* Profile Card */}
      <Card className="max-w-2xl border border-border/50 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Name</label>
            <Input placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Email</label>
            <Input placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Preferences Card */}
      <Card className="max-w-2xl border border-border/50 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Account Active */}
          <div className="flex items-center justify-between">
            <label className="font-medium">Account Active</label>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          {/* Delete Users Permission */}
          <div className="flex items-center justify-between">
            <label className="font-medium">Can Delete Users</label>
            <Switch checked={canDelete} onCheckedChange={setCanDelete} />
          </div>
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card className="max-w-2xl border border-border/50 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Two-Factor Auth */}
          <div className="flex items-center justify-between">
            <label className="font-medium">Two-Factor Authentication</label>
            <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
          </div>

          <Button variant="outline" className="w-full">
            Change Password
          </Button>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="max-w-2xl">
        <Button className="w-full">Save Changes</Button>
      </div>
    </div>
  );
}
