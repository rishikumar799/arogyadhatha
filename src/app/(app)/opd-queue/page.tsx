
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Clock, Stethoscope, Video, Hospital as HospitalIcon, Send, Phone, MapPin, Globe, AlertTriangle } from "lucide-react";
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

const hospitalsData: Record<string, { location: string; address: string; phone: string; website: string; }> = {
    "Guntur Kidney & Multispeciality Hospital": {
        location: "Guntur",
        address: "Kothapet, Guntur, Andhra Pradesh 522001",
        phone: "8008334948",
        website: "https://gunturkidneyhospital.com"
    },
    "AIMS, Mangalagiri": {
        location: "Mangalagiri",
        address: "Mangalagiri, Guntur, Andhra Pradesh 522503",
        phone: "08645 295 000",
        website: "https://www.aiimsmangalagiri.edu.in/"
    },
    "Guntur Government Hospital": {
        location: "Guntur",
        address: "Medical College Rd, Kanna Vari Thota, Guntur, Andhra Pradesh 522004",
        phone: "0863 223 4594",
        website: "https://gmc.ap.gov.in/ggh-guntur.html"
    }
};

const InPersonCard = ({ appointment }: { appointment: any }) => {
    const hospitalInfo = hospitalsData[appointment.hospital];
    
    return (
        <Card className="border">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2" style={{borderColor: 'hsl(var(--primary))'}}>
                        <AvatarImage src={appointment.avatar} data-ai-hint={appointment.dataAiHint} />
                        <AvatarFallback>{appointment.doctorName.split(' ').map((n:string)=>n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="font-bold text-xl">{appointment.doctorName}</h2>
                        <p className="font-semibold" style={{color: 'hsl(var(--primary))'}}>{appointment.specialty}</p>
                        <p className="text-muted-foreground font-semibold">{appointment.hospital}</p>
                    </div>
                </div>
            </CardHeader>
             {hospitalInfo && (
                <CardContent className="space-y-2 text-sm pt-0 border-t pt-4 mt-2">
                    <p className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-1 flex-shrink-0"/> {hospitalInfo.address}</p>
                    <p className="flex items-center gap-2"><Phone className="h-4 w-4"/> {hospitalInfo.phone}</p>
                    <Link href={hospitalInfo.website} target="_blank" rel="noopener noreferrer">
                        <Button variant="link" className="p-0 h-auto text-sm flex items-center gap-2">
                           <Globe className="h-4 w-4"/> Visit Website
                        </Button>
                    </Link>
                </CardContent>
            )}
             <CardContent>
                <div className="grid grid-cols-3 gap-2">
                    <Card className="text-center p-2 border">
                        <CardHeader className="p-0 mb-1">
                            <CardTitle className="text-xs font-semibold text-muted-foreground">Currently Serving</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <p className="text-3xl font-bold" style={{color: 'hsl(var(--primary))'}}>19</p>
                        </CardContent>
                    </Card>
                    <Card className="text-center p-2 border">
                        <CardHeader className="p-0 mb-1">
                            <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center justify-center gap-1">
                                <User className="h-3 w-3" />
                                Total OPs
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <p className="text-3xl font-bold text-muted-foreground">154</p>
                        </CardContent>
                    </Card>
                    <Card className="text-center p-2 border-2 shadow-lg" style={{borderColor: 'hsl(var(--primary))'}}>
                        <CardHeader className="p-0 mb-1">
                            <CardTitle className="text-xs font-semibold" style={{color: 'hsl(var(--primary))'}}>Your Token</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <p className="text-3xl font-bold animation-blink" style={{color: 'hsl(var(--primary))'}}>{appointment.token}</p>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>
    );
};

const VideoCallCard = ({ appointment }: { appointment: any }) => {
    const [timeLeft, setTimeLeft] = useState({ minutes: 5, seconds: 0 });
    const isTimeUp = timeLeft.minutes === 0 && timeLeft.seconds === 0;

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { minutes: prev.minutes - 1, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="space-y-4">
             <Card className="border">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2" style={{borderColor: 'hsl(var(--primary))'}}>
                            <AvatarImage src={appointment.avatar} data-ai-hint={appointment.dataAiHint} />
                            <AvatarFallback>{appointment.doctorName.split(' ').map((n:string)=>n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle>{appointment.doctorName}</CardTitle>
                            <CardDescription>{appointment.specialty}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <Card className="border overflow-hidden">
                <div className="aspect-video bg-black relative flex items-center justify-center">
                    <p className="text-white z-10">Doctor's video will appear here</p>
                    <div className="absolute bottom-4 right-4 h-24 w-20 bg-gray-700 rounded-lg border-2 border-white">
                        <p className="text-white text-xs text-center p-1">Your video</p>
                    </div>
                </div>
            </Card>
            
            <Card className="border">
                 <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Clock className="h-8 w-8 text-primary" style={{color: 'hsl(var(--primary))'}}/>
                        <div className="text-center">
                            {isTimeUp ? (
                                <p className="text-lg font-bold text-green-600">The doctor will join shortly.</p>
                            ) : (
                                <>
                                    <p className="text-muted-foreground text-sm">Consultation will begin in:</p>
                                    <p className="text-2xl font-bold">
                                        {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                    <Button variant="destructive" size="lg"><Phone className="mr-2 h-5 w-5"/> End Call</Button>
                </CardContent>
            </Card>

             <Card className="border">
                <CardHeader><CardTitle>Chat</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="h-40 overflow-y-auto p-2 border rounded-md bg-muted/40">
                         {/* Chat messages would go here */}
                         <p className="text-sm text-muted-foreground text-center pt-12">Chat with your doctor during the call.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Textarea placeholder="Type your message..." className="resize-none" rows={1}/>
                        <Button size="icon"><Send className="h-4 w-4"/></Button>
                    </div>
                </CardContent>
            </Card>
            
            <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-700 mt-1 flex-shrink-0"/>
                        <div>
                            <h4 className="font-semibold text-yellow-800">Please be prepared!</h4>
                            <p className="text-sm text-yellow-700">
                                Have your medical records and any questions ready. Find a quiet, well-lit place for the best experience.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};


function OpdQueueContent() {
    const searchParams = useSearchParams();
    
    // Mocking two appointments for demonstration
    const appointments = [
        {
            id: 1,
            doctorName: searchParams.get('doctorName') || "Orthopedics OP",
            hospital: searchParams.get('hospital') || "AIMS, Mangalagiri",
            specialty: searchParams.get('specialty') || "Orthopedic Surgeon",
            avatar: searchParams.get('avatar') || "https://picsum.photos/seed/govdoc2/100/100",
            dataAiHint: searchParams.get('dataAiHint') || "hospital icon",
            reason: searchParams.get('reason') || "Knee Pain",
            consultationType: searchParams.get('consultationType') || "Offline",
            token: "23",
            eta: "15 mins"
        },
        {
            id: 2,
            doctorName: "Dr. Ananya Sharma",
            hospital: "Online Consultation",
            specialty: "General Physician",
            avatar: "https://picsum.photos/seed/doc_ananya/100/100",
            dataAiHint: "female doctor",
            reason: "Follow-up for Viral Fever",
            consultationType: "Online",
            token: "N/A",
            eta: "Starts in 5 mins"
        }
    ];
    
    const defaultTab = searchParams.get('consultationType') === 'Online' ? 'video-call' : 'opd-status';

    const opdAppointments = appointments.filter(a => a.consultationType === 'Offline');
    const videoAppointments = appointments.filter(a => a.consultationType === 'Online');

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold" style={{color: 'hsl(var(--primary))'}}>Live Consultations</h1>
            </div>
            
            <Tabs defaultValue={defaultTab} className="w-full">
                <div className="border rounded-lg p-1 bg-muted">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="opd-status" className="font-bold flex items-center gap-2">
                            <HospitalIcon className="h-4 w-4"/> Hospital Visit
                             {opdAppointments.length > 0 && <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">{opdAppointments.length}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger value="video-call" className="font-bold flex items-center gap-2">
                            <Video className="h-4 w-4"/> Video Call
                             {videoAppointments.length > 0 && <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">{videoAppointments.length}</Badge>}
                        </TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="opd-status" className="mt-6">
                    <div className="space-y-6">
                        {opdAppointments.length > 0 ? opdAppointments.map((appt, index) => (
                           <div key={appt.id} className="space-y-4">
                                <h2 className="font-bold text-lg text-center">{index + 1}. Appointment for "{appt.reason}"</h2>
                                <InPersonCard appointment={appt} />
                           </div>
                        )) : (
                            <Card className="text-center p-8">
                                <CardTitle>No Hospital Visits</CardTitle>
                                <CardDescription>You have no upcoming hospital appointments.</CardDescription>
                            </Card>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="video-call" className="mt-6">
                     <div className="space-y-6">
                        {videoAppointments.length > 0 ? videoAppointments.map((appt, index) => (
                            <div key={appt.id} className="space-y-4">
                                <h2 className="font-bold text-lg text-center">{index + 1}. Video Call for "{appt.reason}"</h2>
                                <VideoCallCard appointment={appt} />
                           </div>
                        )) : (
                            <Card className="text-center p-8">
                                <CardTitle>No Video Calls Scheduled</CardTitle>
                                <CardDescription>You have no upcoming video consultations.</CardDescription>
                            </Card>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default function OpdQueuePage() {
    return (
        <Suspense fallback={<OpdQueueSkeleton />}>
            <OpdQueueContent />
        </Suspense>
    );
}

function OpdQueueSkeleton() {
    return (
        <div className="max-w-md mx-auto space-y-6">
            <div className="text-center">
                <Skeleton className="h-8 w-48 mx-auto" />
            </div>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
    )
}

    