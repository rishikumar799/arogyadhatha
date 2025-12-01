'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from 'next-themes';

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle>Theme</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div
          className={`cursor-pointer rounded-lg p-4 text-center ${
            theme === 'light' && 'ring-2 ring-primary'
          }`}
          onClick={() => setTheme('light')}
        >
          Light
        </div>
        <div
          className={`cursor-pointer rounded-lg p-4 text-center ${
            theme === 'dark' && 'ring-2 ring-primary'
          }`}
          onClick={() => setTheme('dark')}
        >
          Dark
        </div>
      </CardContent>
    </Card>
  );
}
