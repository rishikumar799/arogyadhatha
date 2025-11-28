'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Menu,
  CircleUser,
  Home,
  Users,
  Bell,
  MessageSquare,
  FileQuestion,
  Settings,
  LogOut,
  Search
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
import { Input } from '@/components/ui/input';

const navItems = [
    { href: '/superadmin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/superadmin/notifications', label: 'Notifications', icon: Bell },
    { href: '/superadmin/users', label: 'Users', icon: Users },
    { href: '/superadmin/riders', label: 'Riders', icon: Users },
    { href: '/superadmin/messages', label: 'Messages', icon: MessageSquare },
    { href: '/superadmin/faq', label: 'FAQ', icon: FileQuestion },
  ];
  
  const bottomNavItems = [
      { href: '/superadmin/settings', label: 'Settings', icon: Settings },
  ];

async function handleSignOut(router: ReturnType<typeof useRouter>) {
    try {
        const response = await fetch('/api/auth/signout', { method: 'POST' });
        if (response.ok) {
            window.location.href = '/auth/signin';
        } else {
            console.error('Logout failed:', await response.json());
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
                    disabled={isLoggingOut}>
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0 bg-white">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold text-xl text-green-600">
                        <span>Creative Point.</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        {navItems.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:text-green-500 ${pathname.startsWith(href) ? 'bg-green-100 text-green-600' : ''
                                    }`}>
                                <Icon className="h-5 w-5" />
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
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:text-green-500 ${pathname.startsWith(href) ? 'bg-green-100 text-green-600' : ''
                                    }`}>
                                <Icon className="h-5 w-5" />
                                {label}
                            </Link>
                        ))}
                        <button
                            onClick={handleLogoutClick}
                            disabled={isLoggingOut}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:text-green-500 disabled:opacity-50">
                            <LogOut className="h-5 w-5" />
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
    };

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-4 lg:h-[60px] lg:px-6">
            <MobileNav />
            <div className="w-full flex-1">
                <h1 className="text-lg font-semibold text-green-600">Creative Point. <span className="text-gray-600">Hello, Welcome Back.</span></h1>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        type="search"
                        placeholder="Search for..."
                        className="pl-8 pr-4 py-2 w-full md:w-[200px] lg:w-[300px] rounded-lg border border-gray-300 focus:border-green-500 focus:ring-green-500" />
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
                <div className="text-sm text-gray-600">EN</div>
            </div>
        </header>
    );
}
