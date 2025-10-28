
'use client';

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Bell, Clock } from 'lucide-react';
import { notifications } from '@/lib/notifications';
import { format } from 'date-fns';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';

export function NotificationsDropdown() {
  const [isClient, setIsClient] = React.useState(false);
  const { language } = useLanguage();

  const t = {
    en: {
      alerts: "Alerts",
      notifications: "Notifications",
      markAllAsRead: "Mark all as read",
      viewAll: "View all notifications"
    },
    te: {
      alerts: "హెచ్చరికలు",
      notifications: "ప్రకటనలు",
      markAllAsRead: "అన్నీ చదివినట్లు గుర్తించండి",
      viewAll: "అన్ని ప్రకటనలను వీక్షించండి"
    }
  }[language];

  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 rounded-full text-primary-foreground relative p-0">
          <Bell className="h-5 w-5" />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
              </span>
            )}
            <span className='sr-only'>{t.alerts}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex justify-between items-center">
            <span className='font-bold text-base'>{t.notifications}</span>
            <Button variant="ghost" size="sm" className='h-auto px-2 py-1 text-xs'>{t.markAllAsRead}</Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-96 overflow-y-auto">
            {notifications.slice(0, 4).map((notification) => {
                const title = language === 'en' ? notification.title : notification.telugu.title;
                const description = language === 'en' ? notification.description : notification.telugu.description;

                return (
                    <Link href={notification.href} key={notification.id} passHref>
                        <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer">
                            <div className={`mt-1 p-1.5 rounded-full ${notification.read ? 'bg-muted' : 'bg-primary/10'}`}>
                                <notification.icon className={`h-5 w-5 ${notification.read ? 'text-muted-foreground' : 'text-primary'}`} />
                            </div>
                            <div className='flex-1'>
                                <p className={`font-semibold ${notification.read ? 'text-muted-foreground' : ''}`}>{title}</p>
                                <p className="text-sm text-muted-foreground">{description}</p>
                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                                    <Clock className="h-3 w-3" />
                                    {isClient ? format(new Date(notification.timestamp), 'dd-MMM-yyyy') : '...'}
                                </p>
                            </div>
                            {!notification.read && <div className="mt-1 h-2 w-2 rounded-full bg-primary" />}
                        </DropdownMenuItem>
                    </Link>
                );
            })}
        </div>
        <DropdownMenuSeparator />
        <Link href="/notifications" passHref>
            <DropdownMenuItem className="justify-center font-semibold text-primary">
                {t.viewAll}
            </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
