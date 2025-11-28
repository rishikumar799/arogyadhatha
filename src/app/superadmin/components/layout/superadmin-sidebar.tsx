'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import PromoCard from './promo-card';
import { superAdminMenuItems } from '@/lib/nav-config';

export default function SuperAdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "superAdminSession=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push('/auth/signin');
  };

  return (
    <div className="hidden border-r bg-white md:block rounded-r-lg shadow-lg">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
            <span className="">Creative Point.</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {superAdminMenuItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:text-green-500 ${pathname.startsWith(href) ? 'bg-green-100 text-green-600' : ''}`}>
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <PromoCard />
        <div className="mt-auto p-4">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                 <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:text-green-500"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </nav>
        </div>
      </div>
    </div>
  );
}
