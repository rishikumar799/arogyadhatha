'use client';
import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';

export default function DiagnosticsLayout({ children }: { children: React.ReactNode }) {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (userProfile?.role !== 'diagnostics') {
    return (
      <div className="flex h-[calc(100vh-8rem)] w-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">You do not have permission to view this section.</p>
        </div>
      </div>
    );
  }

  return <div className="space-y-6">{children}</div>;
}
