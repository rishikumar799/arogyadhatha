'use client';

import Link from 'next/link';
import { Stethoscope, Users, FlaskConical, Headphones } from 'lucide-react';

const sections = [
  {
    href: '/superadmin/users/doctors',
    label: 'Doctors',
    desc: 'View and manage all registered doctors',
    icon: Stethoscope,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
  },
  {
    href: '/superadmin/users/patients',
    label: 'Patients',
    desc: 'Access patient records and profiles',
    icon: Users,
    color: 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400',
  },
  {
    href: '/superadmin/users/diagnostics',
    label: 'Diagnostics',
    desc: 'Manage diagnostics staff and reports',
    icon: FlaskConical,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
  },
  {
    href: '/superadmin/users/receptionists',
    label: 'Receptionists',
    desc: 'Control receptionist access and duties',
    icon: Headphones,
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
  },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
        <p className="text-muted-foreground mt-1">
          View and organize all user groups in the system
        </p>
      </div>

      {/* Users Grid */}
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
          </Link>
        ))}
      </div>
    </div>
  );
}
