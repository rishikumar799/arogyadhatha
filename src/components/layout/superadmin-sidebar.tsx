'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Users, Hospital, Stethoscope, Settings, LogOut } from 'lucide-react';

const navItems = [
  { href: '/superadmin/dashboard', label: 'Dashboard', icon: Home },
  { href: '/superadmin/users', label: 'Users', icon: Users },
  { href: '/superadmin/hospitals', label: 'Hospitals', icon: Hospital },
  { href: '/superadmin/requests', label: 'Requests', icon: Stethoscope },
];

const bottomNavItems = [
    { href: '/superadmin/settings', label: 'Settings', icon: Settings },
];

export default function SuperAdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "superAdminSession=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push('/auth/signin');
  };

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="">Arogyadhatha</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname === href ? 'bg-muted text-primary' : ''
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {bottomNavItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname === href ? 'bg-muted text-primary' : ''
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
             <button
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
                <LogOut className="h-4 w-4" />
                Logout
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
