
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { notifications } from '@/lib/notifications';
import { format, isToday, isYesterday } from 'date-fns';
import { Bell, Clock } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';

const NotificationItem = ({ notification, language }: { notification: (typeof notifications)[0], language: 'en' | 'te' }) => {
    const title = language === 'en' ? notification.title : notification.telugu.title;
    const description = language === 'en' ? notification.description : notification.telugu.description;

    return (
        <Link href={notification.href} key={notification.id} passHref>
            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border-b last:border-b-0">
                <div className={`mt-1 p-2 rounded-full ${notification.read ? 'bg-muted' : 'bg-primary/10'}`}>
                    <notification.icon className={`h-6 w-6 ${notification.read ? 'text-muted-foreground' : 'text-primary'}`} style={{color: 'hsl(var(--nav-notifications))'}}/>
                </div>
                <div className="flex-1">
                    <p className={`font-semibold ${notification.read ? 'text-muted-foreground' : ''}`}>{title}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {format(new Date(notification.timestamp), 'dd-MMM-yyyy, h:mm a')}
                    </p>
                </div>
                {!notification.read && <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" style={{backgroundColor: 'hsl(var(--nav-notifications))'}} />}
            </div>
        </Link>
    );
};

export default function NotificationsPage() {
    const [filter, setFilter] = useState('All');
    const { language } = useLanguage();

    const t = {
        en: {
            title: "Notifications",
            subtitle: "A complete history of your account alerts and updates.",
            filterTitle: "Filter Notifications",
            filterDescription: "Select a category to view specific notifications.",
            noNotifications: "No Notifications",
            noNotificationsInCategory: "You have no notifications in the \"{filter}\" category.",
            today: "Today",
            yesterday: "Yesterday",
        },
        te: {
            title: "ప్రకటనలు",
            subtitle: "మీ ఖాతా హెచ్చరికలు మరియు నవీకరణల పూర్తి చరిత్ర.",
            filterTitle: "ప్రకటనలను ఫిల్టర్ చేయండి",
            filterDescription: "నిర్దిష్ట ప్రకటనలను వీక్షించడానికి ఒక వర్గాన్ని ఎంచుకోండి.",
            noNotifications: "ప్రకటనలు లేవు",
            noNotificationsInCategory: "మీకు \"{filter}\" వర్గంలో ప్రకటనలు లేవు.",
            today: "ఈ రోజు",
            yesterday: "నిన్న",
        }
    }[language];

    const notificationCategories = useMemo(() => [
        { en: 'All', te: 'అన్నీ' },
        { en: 'Appointments', te: 'అపాయింట్‌మెంట్‌లు' },
        { en: 'Reports', te: 'నివేదికలు' },
        { en: 'Medications', te: 'మందులు' },
        { en: 'General', te: 'సాధారణం' },
        { en: 'Settings', te: 'సెట్టింగ్‌లు' },
    ], []);


    const filteredNotifications = useMemo(() => {
        if (filter === 'All' || filter === 'అన్నీ') {
            return notifications;
        }
        const englishCategory = notificationCategories.find(c => c.te === filter)?.en || filter;
        return notifications.filter(n => n.category === englishCategory);
    }, [filter, notificationCategories]);

    const groupedNotifications = useMemo(() => {
        return filteredNotifications.reduce((acc, notification) => {
            const date = new Date(notification.timestamp);
            let group;
            if (isToday(date)) {
                group = t.today;
            } else if (isYesterday(date)) {
                group = t.yesterday;
            } else {
                group = format(date, 'MMMM d, yyyy');
            }
            if (!acc[group]) {
                acc[group] = [];
            }
            acc[group].push(notification);
            return acc;
        }, {} as Record<string, typeof notifications>);
    }, [filteredNotifications, t.today, t.yesterday]);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold" style={{color: 'hsl(var(--nav-notifications))'}}>{t.title}</h1>
                <p className="text-muted-foreground mt-2">{t.subtitle}</p>
            </div>

            <Card className="border">
                <CardHeader>
                    <CardTitle>{t.filterTitle}</CardTitle>
                    <CardDescription>{t.filterDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={filter} onValueChange={setFilter}>
                        <TabsList className="grid grid-cols-3 sm:grid-cols-6 h-auto">
                            {notificationCategories.map(category => (
                                <TabsTrigger key={category.en} value={language === 'en' ? category.en : category.te}>
                                    {language === 'en' ? category.en : category.te}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </CardContent>
            </Card>

            <div className="space-y-6">
                {Object.keys(groupedNotifications).length > 0 ? (
                    Object.entries(groupedNotifications).map(([group, notifs]) => (
                        <Card key={group} className="border">
                            <CardHeader>
                                <CardTitle className="text-lg">{group}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {notifs.map(notification => (
                                    <NotificationItem key={notification.id} notification={notification} language={language} />
                                ))}
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="text-center p-12 border">
                        <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">{t.noNotifications}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {t.noNotificationsInCategory.replace('{filter}', filter)}
                        </p>
                    </Card>
                )}
            </div>
        </div>
    );
}
