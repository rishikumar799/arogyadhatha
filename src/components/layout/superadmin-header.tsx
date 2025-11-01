'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react'; // Import useState
import {
  Menu,
  CircleUser,
  Home,
  Users,
  Hospital,
  Stethoscope,
  Settings,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
    { href: '/superadmin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/superadmin/users', label: 'Users', icon: Users },
    { href: '/superadmin/hospitals', label: 'Hospitals', icon: Hospital },
    { href: '/superadmin/requests', label: 'Requests', icon: Stethoscope },
  ];
  
  const bottomNavItems = [
      { href: '/superadmin/settings', label: 'Settings', icon: Settings },
  ];

  // A single, reusable sign-out handler
  async function handleSignOut(router: ReturnType<typeof useRouter>) {
      try {
          const response = await fetch('/api/auth/signout', { method: 'POST' });
          if (response.ok) {
              // Force a full page reload to ensure all state is cleared
              window.location.href = '/auth/signin';
          } else {
              console.error('Logout failed:', await response.json());
              // Fallback for router push if window reload fails for some reason
              router.push('/auth/signin');
          }
      } catch (error) {
          console.error('Error during logout:', error);
          router.push('/auth/signin');
      }
  }

function MobileNav() {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogoutClick = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        await handleSignOut(router);
        setIsLoggingOut(false);
    };

    return (
        <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
            disabled={isLoggingOut}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <span>Arogyadhatha</span>
                </Link>
            </div>
            <div className="flex-1 overflow-y-auto">
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
                        onClick={handleLogoutClick}
                        disabled={isLoggingOut}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary disabled:opacity-50"
                    >
                        <LogOut className="h-4 w-4" />
                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                </nav>
            </div>
        </SheetContent>
      </Sheet>
    )
}

export default function SuperAdminHeader() {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogoutClick = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        await handleSignOut(router);
        // No need to set isLoggingOut to false, as the page will be unloaded.
    };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <MobileNav />
      <div className="w-full flex-1">
        {/* Optional: Add breadcrumbs or a search bar here */}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild><Link href="/superadmin/editprofile">Edit Profile</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link href="/superadmin/settings">Settings</Link></DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogoutClick} disabled={isLoggingOut}>
            {isLoggingOut ? 'Logging out...' : 'Logout'}
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
