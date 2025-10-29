// app/superadmin/settings/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Star, Shield } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Theme = 'light' | 'dark';

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>('light');
  const [notifications, setNotifications] = useState(true);
  const [premiumFeatures, setPremiumFeatures] = useState({
    analytics: true,
    auditLogs: false,
    advancedPermissions: false,
  });

  // Apply theme to document
  const applyTheme = (t: Theme) => {
    document.documentElement.setAttribute('data-theme', t);
    if (t === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  // Load theme from Firebase on mount
  useEffect(() => {
    const fetchTheme = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, 'theme', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const savedTheme = docSnap.data().mode as Theme;
          setTheme(savedTheme);
          applyTheme(savedTheme);
        } else {
          // Default theme if none exists
          setTheme('light');
          applyTheme('light');
        }
      } catch (error) {
        console.error('Failed to load theme from Firebase:', error);
        setTheme('light');
        applyTheme('light');
      }
    };

    fetchTheme();
  }, []);

  // Persist theme to Firebase whenever it changes
  const toggleTheme = async (newTheme?: Theme) => {
    const updatedTheme = newTheme || (theme === 'light' ? 'dark' : 'light');
    setTheme(updatedTheme);
    applyTheme(updatedTheme);

    const user = auth.currentUser;
    if (!user) return;

    try {
      const docRef = doc(db, 'theme', user.uid);
      await setDoc(docRef, { mode: updatedTheme }, { merge: true });
    } catch (error) {
      console.error('Failed to save theme to Firebase:', error);
    }
  };

  const togglePremiumFeature = (feature: keyof typeof premiumFeatures) => {
    setPremiumFeatures((prev) => ({ ...prev, [feature]: !prev[feature] }));
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight">Super Admin Settings</h1>

      {/* Appearance Card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-md bg-muted/20 dark:bg-muted/30">
                {theme === 'light' ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-blue-300" />
                )}
              </div>
              <div>
                <div className="font-medium">Theme Mode</div>
                <p className="text-sm text-muted-foreground">Switch between Light and Dark mode.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleTheme('light')}
              >
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleTheme('dark')}
              >
                Dark
              </Button>
              <Button size="sm" variant="ghost" onClick={() => toggleTheme()} title="Toggle theme">
                Toggle
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Enable Notifications</div>
              <p className="text-sm text-muted-foreground">Receive system alerts, requests, and updates.</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="h-5 w-5 accent-blue-500"
                aria-label="Enable notifications"
              />
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Premium Features Card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Premium Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground mb-2">
            Manage your premium features for enhanced admin control.
          </p>

          {([
            { key: 'analytics', label: 'Advanced Analytics', icon: <Star className="h-4 w-4" /> },
            { key: 'auditLogs', label: 'Audit Logs', icon: <Shield className="h-4 w-4" /> },
            { key: 'advancedPermissions', label: 'Advanced Permissions', icon: <Star className="h-4 w-4" /> },
          ] as const).map((feature) => (
            <div key={feature.key} className="flex items-center justify-between border-b border-border py-2">
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-md bg-muted/20 dark:bg-muted/30">{feature.icon}</div>
                <div className="font-medium">{feature.label}</div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={premiumFeatures[feature.key]}
                  onChange={() => togglePremiumFeature(feature.key)}
                  className="h-5 w-5 accent-purple-500"
                />
              </label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
