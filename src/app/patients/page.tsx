'use client';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartPulse, CalendarCheck, MessageSquare, TestTube, Pill, BookOpenCheck, Shield, HandHeart, Droplets, Activity, Headset, Users2, User, Siren, Stethoscope } from 'lucide-react';

// Re-using the quickAccessItems array from your original code
const quickAccessItems = [
  { href: '/patients/symptom-checker', icon: HeartPulse, label: 'AI Symptom Checker' },
  { href: '/patients/appointments', icon: CalendarCheck, label: 'Book appointment & History' },
  { href: '/patients/opd-queue', icon: MessageSquare, label: 'OP STATUS' },
  { href: '/patients/lab-reports', icon: TestTube, label: 'Diagnostics' },
  { href: '/patients/medicines', icon: Pill, label: 'My Medicines' },
  { href: '/patients/health-knowledge', icon: BookOpenCheck, label: 'Health Knowledge' },
  { href: '/patients/insurances', icon: Shield, label: 'Insurances' },
  { href: '/patients/community-fund', icon: HandHeart, label: 'Crowd Funding' },
  { href: '/patients/blood-bank', icon: Droplets, label: 'Blood Bank' },
  { href: '/patients/health-tracker', label: 'Health Tracker', icon: Activity },
  { href: '/patients/junior-doctors', icon: Headset, label: '24/7 Jr. Doctors' },
  { href: '/patients/old-age-assistant', label: 'Old Age Assistant', icon: Users2 },
  { href: '/patients/profile', icon: User, label: 'Profile' },
  { href: '/patients/emergency', icon: Siren, label: 'Emergency' },
  { href: '/patients/surgery-care', label: 'Surgery Care', icon: Stethoscope},
];

export default function PatientDashboardPage() {
  const { userProfile, loading } = useAuth();

  // While the auth state is being determined, show a loading screen.
  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // If the user is not a patient, show an access denied message.
  // This is a crucial step for role-based access control.
  if (userProfile?.role !== 'patient') {
    return (
      <div className="flex h-[calc(100vh-8rem)] w-full items-center justify-center">
        <div className="text-center">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  // If loading is complete and the user is a patient, show the dashboard.
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, Patient!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is your personalized dashboard. You can access all your health services from here.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {quickAccessItems.map((item) => (
              <Link key={item.href} href={item.href} passHref>
                <div className="flex flex-col items-center justify-center text-center p-4 rounded-lg bg-background hover:bg-accent transition-colors cursor-pointer border">
                  <item.icon className="h-8 w-8 text-primary mb-2" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* You can add back the other sections (Organ Health, Carousel, etc.) here */}
    </div>
  );
}
