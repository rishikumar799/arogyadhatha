'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TrackingMap() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Real-Time Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Placeholder for a map component */}
        <div className="flex h-96 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
          Map Placeholder
        </div>
      </CardContent>
    </Card>
  );
}
