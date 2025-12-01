'use client';

import ThemeSelector from '@/app/superadmin/customize/theme-selector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutPanelLeft } from 'lucide-react';

export default function DashboardCustomizationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Customization</h1>
        <p className="text-muted-foreground mt-1">
          Customize the appearance and layout of your super admin dashboard.
        </p>
      </div>
      <ThemeSelector />
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <LayoutPanelLeft className="text-primary" />
          </div>
          <CardTitle>Layout</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Customize the arrangement of dashboard elements. (Coming Soon)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
