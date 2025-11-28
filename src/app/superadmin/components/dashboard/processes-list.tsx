'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const processes = [
    {
        name: 'User Registrations',
        status: 'Ongoing',
        details: 'Monitoring new user sign-ups and verification processes.',
    },
    {
        name: 'Hospital Onboarding',
        status: 'Pending',
        details: 'Awaiting verification for 5 new hospital partnerships.',
    },
    {
        name: 'Data Backup',
        status: 'Completed',
        details: 'Last backup completed yesterday at 11:59 PM.',
    },
    {
        name: 'System Update',
        status: 'Scheduled',
        details: 'Next system-wide update is scheduled for next Friday.',
    },
];

export default function ProcessesList() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Ongoing Processes</CardTitle>
      </CardHeader>
      <CardContent>
         <div className="space-y-4">
            {processes.map((process, index) => (
                <div key={index} className="flex items-start">
                    <div className="flex h-2 w-2 items-center justify-center rounded-full bg-primary mt-2" />
                    <div className="ml-4">
                        <p className="font-semibold">{process.name}</p>
                        <p className="text-sm text-muted-foreground">{process.details}</p>
                    </div>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
