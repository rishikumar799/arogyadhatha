

'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Video, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/language-context";

const doctors = [
    { 
        name: "Dr. Ananya Sharma", 
        specialty: "General Physician", 
        experience: "5 years", 
        languages: "English, Telugu, Hindi", 
        status: "Online", 
        avatar: "https://placehold.co/100x100.png",
        dataAiHint: "female doctor"
    },
    { 
        name: "Dr. Vikram Singh", 
        specialty: "Pediatrician", 
        experience: "8 years", 
        languages: "English, Hindi", 
        status: "Online", 
        avatar: "https://placehold.co/100x100.png",
        dataAiHint: "male doctor"
    },
    { 
        name: "Dr. Priya Desai", 
        specialty: "General Physician", 
        experience: "3 years", 
        languages: "English, Telugu", 
        status: "Offline", 
        avatar: "https://placehold.co/100x100.png",
        dataAiHint: "female doctor portrait"
    },
    { 
        name: "Dr. Rohan Gupta", 
        specialty: "General Physician", 
        experience: "4 years", 
        languages: "English, Telugu", 
        status: "Online", 
        avatar: "https://placehold.co/100x100.png",
        dataAiHint: "male doctor"
    },
];

export default function JuniorDoctorsPage() {
    const { language } = useLanguage();

    const t = {
        en: {
            title: "24/7 Junior Doctors",
            subtitle: "Get instant consultation from our team of dedicated junior doctors, anytime.",
            experience: "of experience",
            speaks: "Speaks",
            online: "Online",
            offline: "Offline",
            videoCall: "Video Call",
            audioCall: "Audio Call"
        },
        te: {
            title: "24/7 జూనియర్ డాక్టర్లు",
            subtitle: "మా అంకితభావంతో కూడిన జూనియర్ డాక్టర్ల బృందం నుండి ఎప్పుడైనా తక్షణ సంప్రదింపులు పొందండి.",
            experience: "సంవత్సరాల అనుభవం",
            speaks: "మాట్లాడే భాషలు",
            online: "ఆన్‌లైన్",
            offline: "ఆఫ్‌లైన్",
            videoCall: "వీడియో కాల్",
            audioCall: "ఆడియో కాల్"
        }
    }[language];

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold" style={{color: 'hsl(var(--nav-junior-doctors))'}}>{t.title}</h1>
                <p className="text-muted-foreground mt-2">{t.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor, index) => (
                    <Card key={index} className="flex flex-col transition-shadow hover:shadow-md border-2 border-foreground shadow-md">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Avatar className="h-16 w-16 border" style={{borderColor: 'hsl(var(--nav-junior-doctors))'}}>
                                <AvatarImage src={doctor.avatar} data-ai-hint={doctor.dataAiHint} />
                                <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    {doctor.name}
                                </CardTitle>
                                <CardDescription>{doctor.specialty}</CardDescription>
                            </div>
                             {doctor.status === 'Online' ? (
                                <div className="ml-auto flex items-center gap-2 text-green-600 font-semibold">
                                    <span className="relative flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-600"></span>
                                    </span>
                                    {t.online}
                                </div>
                            ) : (
                                <Badge variant='secondary' className="ml-auto border">
                                    {t.offline}
                                </Badge>
                            )}
                        </CardHeader>
                        <CardContent className="flex-grow space-y-3 text-sm p-4 pt-0">
                            <p className="text-muted-foreground"><BadgeCheck className="inline-block mr-2 h-4 w-4" style={{color: 'hsl(var(--nav-junior-doctors))'}}/>{doctor.experience} {t.experience}</p>
                            <p className="text-muted-foreground">{t.speaks}: {doctor.languages}</p>
                        </CardContent>
                        <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                            <Button disabled={doctor.status === 'Offline'} style={{backgroundColor: doctor.status === 'Online' ? 'hsl(var(--nav-junior-doctors))' : ''}}>
                                <Video className="mr-2 h-4 w-4" /> {t.videoCall}
                            </Button>
                            <Button variant="outline" disabled={doctor.status === 'Offline'} className="border">
                                <Phone className="mr-2 h-4 w-4" /> {t.audioCall}
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
