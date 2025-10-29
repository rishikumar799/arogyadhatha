'use client';

import Link from 'next/link';
import {
  Hospital,
  Stethoscope,
  Users,
  FlaskConical,
  Headphones,
  FileText,
  Settings,
} from 'lucide-react';

const sections = [
  {
    href: '/superadmin/hospitals',
    label: 'Hospitals',
    desc: 'Manage all hospitals & their admins',
    icon: Hospital,
    color: 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400',
    count: 10,
  },
  {
    href: '/superadmin/users/doctors',
    label: 'Doctors',
    desc: 'All registered doctors',
    icon: Stethoscope,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
    count: 80,
  },
  {
    href: '/superadmin/users/patients',
    label: 'Patients',
    desc: 'All patients in the system',
    icon: Users,
    color: 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400',
    count: 320,
  },
  {
    href: '/superadmin/users/diagnostics',
    label: 'Diagnostics',
    desc: 'All registered diagnostics staff',
    icon: FlaskConical,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
    count: 25,
  },
  {
    href: '/superadmin/users/receptionists',
    label: 'Receptionists',
    desc: 'All receptionists across hospitals',
    icon: Headphones,
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
    count: 15,
  },
  {
    href: '/superadmin/requests',
    label: 'Requests',
    desc: 'View system reports',
    icon: FileText,
    color: 'bg-teal-100 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400',
    count: 5,
  },
  {
    href: '/superadmin/settings',
    label: 'Settings',
    desc: 'Super Admin profile & system settings',
    icon: Settings,
    color: 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400',
  },
];

export default function SuperAdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Quick access to manage users, hospitals, and system reports
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="block rounded-2xl border border-border bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all p-6 group hover:scale-[1.02]"
          >
            {/* Icon */}
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-xl ${s.color} mb-4 group-hover:scale-110 transition-transform`}
            >
              <s.icon className="h-6 w-6" />
            </div>

            {/* Label + Description */}
            <h3 className="text-lg font-semibold">{s.label}</h3>
            <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>

            {/* Count */}
            {s.count !== undefined && (
              <p className="mt-3 text-2xl font-extrabold text-foreground">{s.count}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
