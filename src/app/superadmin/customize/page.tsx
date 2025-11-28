'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Globe, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function CustomizePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customize</h1>
        <p className="text-muted-foreground mt-1">
          Tailor the look and feel of your application with these customization options.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-card/50 border-border/50 hover:bg-card/80 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
                <Globe className="text-primary" />
            </div>
            <CardTitle>Overall Web Customization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Update the overall look and feel of the website. (Coming Soon)
            </p>
          </CardContent>
        </Card>
        <Link href="/superadmin/customize/dashboard">
            <Card className="bg-card/50 border-border/50 hover:bg-card/80 hover:shadow-lg transition-all">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                            <LayoutDashboard className="text-primary" />
                        </div>
                        <CardTitle>Dashboard Customization</CardTitle>
                    </div>
                    <ChevronRight className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                    Customize the appearance and layout of your super admin dashboard.
                    </p>
                </CardContent>
            </Card>
        </Link>
      </div>
    </div>
  );
}
