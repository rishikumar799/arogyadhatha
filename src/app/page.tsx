'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-2xl p-8 space-y-8 text-center bg-white rounded-lg shadow-md dark:bg-gray-800">
        
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Welcome to Our Advanced Medical Platform
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300">
          Providing seamless and secure access for all user roles. Whether you are a patient, a doctor, or an administrator, our system is designed to meet your needs with efficiency and care.
        </p>

        <div className="pt-4">
          <Link href="/auth/signin">
            <Button size="lg" className="w-full max-w-xs mx-auto">
              Proceed to Sign In
            </Button>
          </Link>
        </div>

        <p className="pt-6 text-sm text-gray-500 dark:text-gray-400">
          This is the public home page. Specific dashboards for patients, doctors, and staff are protected and require authentication.
        </p>

      </div>
    </div>
  );
}
