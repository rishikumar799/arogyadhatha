'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  Users,
  FileBarChart,
  Settings,
  ClipboardList,
  LogOut,
  UserCog,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context'; // We still need this for logout

// Corrected Navigation Items
const navItems = [
  { href: '/superadmin', label: 'Dashboard', icon: FileBarChart }, // Corrected path
  { href: '/superadmin/hospitals', label: 'Hospitals (Sub Admins)', icon: Building2 },
  { href: '/superadmin/users', label: 'Manage Users', icon: Users },
  { href: '/superadmin/requests', label: 'Requests', icon: ClipboardList },
  { href: '/superadmin/settings', label: 'Settings', icon: Settings },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { signOut } = useAuth(); // Only need signOut

  const handleLogout = async () => {
    await signOut();
    // After sign out, redirect to login. This is safe.
    window.location.href = '/auth/signin';
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r shadow-sm flex flex-col">
        <div className="p-4 flex items-center gap-3 border-b">
          <img src="/images/MEDIBRIDGE.png" alt="Logo" className="h-8" />
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            // The check needs to be exact for the root dashboard link
            const isActive = item.href === '/superadmin' 
              ? pathname === item.href 
              : pathname.startsWith(item.href);
              
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <Link href="/superadmin/editprofile">
            <Button variant="outline" className="w-full justify-start gap-2">
              <UserCog className="h-5 w-5" />
              Edit Profile
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full justify-start mt-2 gap-2" 
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
