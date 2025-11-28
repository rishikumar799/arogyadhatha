
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, FileDown, Lock, Palette, Trash2, Loader2 } from "lucide-react";
import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/context/language-context";

export default function SettingsPage() {
    const [isDownloading, setIsDownloading] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const { language } = useLanguage();

    const t = {
        en: {
            title: "Settings",
            changePassword: "Change Password",
            manageNotifications: "Manage Notifications",
            theme: "Theme",
            exportData: "Export My Data",
            exportingData: "Downloading...",
            deleteAccount: "Delete Account",
            deletingAccount: "Deleting..."
        },
        te: {
            title: "సెట్టింగ్‌లు",
            changePassword: "పాస్‌వర్డ్ మార్చండి",
            manageNotifications: "ప్రకటనలను నిర్వహించండి",
            theme: "థీమ్",
            exportData: "నా డేటాను ఎగుమతి చేయండి",
            exportingData: "డౌన్‌లోడ్ చేస్తోంది...",
            deleteAccount: "ఖాతాను తొలగించండి",
            deletingAccount: "తొలగిస్తోంది..."
        }
    }[language];

    const handleDownloadData = () => {
        setIsDownloading(true);
        setTimeout(() => {
            setIsDownloading(false);
        }, 1500);
    };

    const handleDeleteAccount = () => {
        setIsDeleting(true);
        setTimeout(() => {
            setIsDeleting(false);
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold" style={{color: 'hsl(var(--nav-profile))'}}>{t.title}</h1>
            </div>

            <Card className="border-2 border-foreground shadow-md">
                <CardContent className="p-4 space-y-2">
                     <Button variant="outline" className="w-full justify-start gap-3 border text-base py-6">
                        <Lock className="h-5 w-5" style={{color: 'hsl(var(--nav-profile))'}}/>
                        <span>{t.changePassword}</span>
                    </Button>
                    <Link href="/notifications">
                        <Button variant="outline" className="w-full justify-start gap-3 border text-base py-6">
                            <Bell className="h-5 w-5" style={{color: 'hsl(var(--nav-profile))'}}/>
                            <span>{t.manageNotifications}</span>
                        </Button>
                    </Link>
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                           <Palette className="h-5 w-5" style={{color: 'hsl(var(--nav-profile))'}}/>
                           <span className="font-semibold text-base">{t.theme}</span>
                        </div>
                       <ThemeToggle />
                    </div>
                    <Button variant="outline" onClick={handleDownloadData} disabled={isDownloading} className="w-full justify-start gap-3 border text-base py-6">
                       {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="h-5 w-5" style={{color: 'hsl(var(--nav-profile))'}}/>}
                       <span>{isDownloading ? t.exportingData : t.exportData}</span>
                    </Button>
                     <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting} className="w-full justify-start gap-3 text-base py-6 border">
                       {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="h-5 w-5"/>}
                       <span>{isDeleting ? t.deletingAccount : t.deleteAccount}</span>
                   </Button>
                </CardContent>
            </Card>
        </div>
    );
}
