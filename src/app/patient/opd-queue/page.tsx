
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Clock, Stethoscope, Video, Hospital as HospitalIcon, Send, Phone, MapPin, Globe, AlertTriangle, CheckCircle, Languages } from "lucide-react";
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/context/language-context';

const hospitalsData: Record<string, { location: string; address: string; phone: string; website: string; }> = {
    "Guntur Kidney & Multispeciality Hospital": {
        location: "Guntur",
        address: "Kothapet, Guntur, Andhra Pradesh 522001",
        phone: "8008334948",
        website: "https://gunturkidneyhospital.com"
    },
    "AIIMS, Mangalagiri": {
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
    },
    "Aster Ramesh Multispeciality Hospital": {
        location: "Guntur",
        address: "Ring Road, Guntur, Andhra Pradesh 522007",
        phone: "0863 222 3333",
        website: "https://www.asterramesh.com"
    },
};

const InPersonCard = ({ appointment }: { appointment: any }) => {
    const { language } = useLanguage();
    const hospitalInfo = hospitalsData[appointment.hospital];

    const t = {
        en: {
            doctorStatus: "Doctor's Status",
            approxWait: "Approx. Wait",
            appointmentTime: "Appointment Time",
            currentlyServing: "Currently Serving",
            lastUpdated: "Last updated: 2 min ago by Reception",
            yourToken: "Your Token",
            yourOPNumber: "Your OP Number",
            abhaToken: "ABHA Token",
            completed: "Completed",
            pending: "Pending",
            visitWebsite: "Visit Website"
        },
        te: {
            doctorStatus: "డాక్టర్ స్థితి",
            approxWait: "సుమారు నిరీక్షణ",
            appointmentTime: "అపాయింట్‌మెంట్ సమయం",
            currentlyServing: "ప్రస్తుతం సేవలందిస్తున్నారు",
            lastUpdated: "చివరిగా నవీకరించబడింది: 2 నిమిషాల క్రితం రిసెప్షన్ ద్వారా",
            yourToken: "మీ టోకెన్",
            yourOPNumber: "మీ OP నంబర్",
            abhaToken: "ABHA టోకెన్",
            completed: "పూర్తయింది",
            pending: "పెండింగ్‌లో ఉంది",
            visitWebsite: "వెబ్‌సైట్‌ను సందర్శించండి"
        }
    };
    
    return (
        <Card className="border-2 border-foreground shadow-md">
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
                 {hospitalInfo && (
                    <div className="space-y-2 text-sm pt-4">
                        <p className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-1 flex-shrink-0"/> {hospitalInfo.address}</p>
                        <p className="flex items-center gap-2"><Phone className="h-4 w-4"/> {hospitalInfo.phone}</p>
                        <Link href={hospitalInfo.website} target="_blank" rel="noopener noreferrer">
                            <Button variant="link" className="p-0 h-auto text-sm flex items-center gap-2">
                               <Globe className="h-4 w-4"/> {t[language].visitWebsite}
                            </Button>
                        </Link>
                    </div>
                )}
            </CardHeader>
             <CardContent>
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="p-2 rounded-lg text-center border-2 border-foreground">
                        <p className="text-xs font-semibold text-muted-foreground flex items-center justify-center gap-1.5">
                            <span className={cn("relative flex h-3 w-3", appointment.doctorStatus !== 'Available' && 'text-red-500')}>
                                {appointment.doctorStatus === 'Available' ? (
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
                                ) : (
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                )}
                            </span>
                            {t[language].doctorStatus}
                        </p>
                        <p className={cn("font-bold text-base mt-1", appointment.doctorStatus !== 'Available' ? "text-red-500" : "text-primary")}>{appointment.doctorStatus}</p>
                    </div>
                     <div className="p-2 rounded-lg text-center border-2 border-foreground">
                        <p className="text-xs font-semibold text-muted-foreground">{t[language].approxWait}</p>
                        <p className="font-bold text-base mt-1" style={{color: 'hsl(var(--primary))'}}>{appointment.approxWait}</p>
                    </div>
                     <div className="p-2 rounded-lg text-center border-2 border-foreground">
                        <p className="text-xs font-semibold text-muted-foreground">{t[language].appointmentTime}</p>
                        <p className="font-bold text-base mt-1" style={{color: 'hsl(var(--primary))'}}>{appointment.appointmentTime}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <Card className="text-center p-2 border-2 border-foreground">
                        <CardHeader className="p-0 mb-1">
                            <CardTitle className="text-xs font-semibold text-muted-foreground">{t[language].currentlyServing}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <p className="text-3xl font-bold" style={{color: 'hsl(var(--primary))'}}>19</p>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                                <Clock className="h-3 w-3" />
                                {t[language].lastUpdated}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="text-center p-2 border-2 border-primary">
                        <CardHeader className="p-0 mb-1">
                            <CardTitle className="text-xs font-semibold flex items-center justify-center gap-1.5" style={{color: 'hsl(var(--primary))'}}>
                                {appointment.abhaToken ? t[language].abhaToken : (appointment.hospital === "Aster Ramesh Multispeciality Hospital" ? t[language].yourOPNumber : t[language].yourToken)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <p className="text-3xl font-bold" style={{color: 'hsl(var(--primary))'}}>{appointment.abhaToken || appointment.token}</p>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
             <CardFooter className="grid grid-cols-2 gap-2 p-4">
                <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 border">
                    <CheckCircle className="mr-2 h-4 w-4" /> {t[language].completed}
                </Button>
                <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 border">
                    <Clock className="mr-2 h-4 w-4" /> {t[language].pending}
                </Button>
            </CardFooter>
        </Card>
    );
};

const VideoCallCard = ({ appointment }: { appointment: any }) => {
    const { language } = useLanguage();
    const [timeLeft, setTimeLeft] = useState({ minutes: 5, seconds: 0 });
    const isTimeUp = timeLeft.minutes === 0 && timeLeft.seconds === 0;

    const t = {
        en: {
            doctorVideo: "Doctor's video will appear here",
            yourVideo: "Your video",
            beginsIn: "Consultation will begin in:",
            joining: "The doctor will join shortly.",
            endCall: "End Call",
            chatTitle: "Chat",
            chatPlaceholder: "Type your message...",
            chatHint: "Chat with your doctor during the call.",
            bePrepared: "Please be prepared!",
            preparedHint: "Have your medical records and any questions ready. Find a quiet, well-lit place for the best experience."
        },
        te: {
            doctorVideo: "డాక్టర్ వీడియో ఇక్కడ కనిపిస్తుంది",
            yourVideo: "మీ వీడియో",
            beginsIn: "సంప్రదింపులు దీనిలో ప్రారంభమవుతాయి:",
            joining: "డాక్టర్ త్వరలో చేరతారు.",
            endCall: "కాల్ ముగించు",
            chatTitle: "చాట్",
            chatPlaceholder: "మీ సందేశాన్ని టైప్ చేయండి...",
            chatHint: "కాల్ సమయంలో మీ డాక్టర్‌తో చాట్ చేయండి.",
            bePrepared: "దయచేసి సిద్ధంగా ఉండండి!",
            preparedHint: "మీ వైద్య రికార్డులు మరియు ఏవైనా ప్రశ్నలను సిద్ధంగా ఉంచుకోండి. ఉత్తమ అనుభవం కోసం నిశ్శబ్దంగా, బాగా వెలుతురు ఉన్న ప్రదేశాన్ని కనుగొనండి."
        }
    };

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
             <Card className="border-2 border-foreground shadow-md">
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

            <Card className="border-2 border-foreground shadow-md overflow-hidden">
                <div className="aspect-video bg-black relative flex items-center justify-center">
                    <p className="text-white z-10">{t[language].doctorVideo}</p>
                    <div className="absolute bottom-4 right-4 h-24 w-20 bg-gray-700 rounded-lg border-2 border-white">
                        <p className="text-white text-xs text-center p-1">{t[language].yourVideo}</p>
                    </div>
                </div>
            </Card>
            
            <Card className="border-2 border-foreground shadow-md">
                 <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Clock className="h-8 w-8 text-primary" style={{color: 'hsl(var(--primary))'}}/>
                        <div className="text-center">
                            {isTimeUp ? (
                                <p className="text-lg font-bold text-green-600">{t[language].joining}</p>
                            ) : (
                                <>
                                    <p className="text-muted-foreground text-sm">{t[language].beginsIn}</p>
                                    <p className="text-2xl font-bold">
                                        {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                    <Button variant="destructive" size="lg"><Phone className="mr-2 h-5 w-5"/> {t[language].endCall}</Button>
                </CardContent>
            </Card>

             <Card className="border-2 border-foreground shadow-md">
                <CardHeader><CardTitle>{t[language].chatTitle}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="h-40 overflow-y-auto p-2 border rounded-md bg-muted/40">
                         {/* Chat messages would go here */}
                         <p className="text-sm text-muted-foreground text-center pt-12">{t[language].chatHint}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Textarea placeholder={t[language].chatPlaceholder} className="resize-none border" rows={1}/>
                        <Button size="icon"><Send className="h-4 w-4"/></Button>
                    </div>
                </CardContent>
            </Card>
            
            <Card className="bg-yellow-50 border-yellow-200 border">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-700 mt-1 flex-shrink-0"/>
                        <div>
                            <h4 className="font-semibold text-yellow-800">{t[language].bePrepared}</h4>
                            <p className="text-sm text-yellow-700">
                                {t[language].preparedHint}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};


function OpdQueueContent() {
    const { language } = useLanguage();
    const searchParams = useSearchParams();
    
    const appointments = [
        {
            id: 1,
            doctorName: searchParams.get('doctorName') || "Orthopedics OP",
            hospital: searchParams.get('hospital') || "AIIMS, Mangalagiri",
            specialty: searchParams.get('specialty') || "Orthopedic Surgeon",
            avatar: searchParams.get('avatar') || "https://picsum.photos/seed/govdoc2/100/100",
            dataAiHint: searchParams.get('dataAiHint') || "hospital icon",
            reason: searchParams.get('reason') || "Knee Pain",
            consultationType: searchParams.get('consultationType') || "Offline",
            token: "N/A",
            abhaToken: "AIIMS-54",
            appointmentTime: "11:30 AM",
            doctorStatus: "Available",
            approxWait: "50 min",
        },
        {
            id: 3,
            doctorName: "Dr. Ramana",
            hospital: "Aster Ramesh Multispeciality Hospital",
            specialty: "Cardiologist",
            avatar: "https://picsum.photos/seed/doc_ramana/100/100",
            dataAiHint: "male doctor serious",
            reason: "Heart Pain",
            consultationType: "Offline",
            token: "24",
            appointmentTime: "04:30 PM",
            doctorStatus: "In Surgery",
            approxWait: "1-2 hours"
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
            appointmentTime: "Starts in 5 mins",
            doctorStatus: "Online",
            approxWait: "5 min"
        }
    ];
    
    const defaultTab = searchParams.get('consultationType') === 'Online' ? 'video-call' : 'opd-status';

    const opdAppointments = appointments.filter(a => a.consultationType === 'Offline');
    const videoAppointments = appointments.filter(a => a.consultationType === 'Online');

    const t = {
        en: {
            title: "Live Consultations",
            appointmentFor: "Appointment for",
            videoCallFor: "Video Call for",
            hospitalVisit: "Hospital Visit",
            videoCall: "Video Call",
            noHospitalVisits: "No Hospital Visits",
            noHospitalVisitsDesc: "You have no upcoming hospital appointments.",
            noVideoCalls: "No Video Calls Scheduled",
            noVideoCallsDesc: "You have no upcoming video consultations."
        },
        te: {
            title: "ప్రత్యక్ష సంప్రదింపులు",
            appointmentFor: "దీని కోసం అపాయింట్‌మెంట్",
            videoCallFor: "దీని కోసం వీడియో కాల్",
            hospitalVisit: "ఆసుపత్రి సందర్శన",
            videoCall: "వీడియో కాల్",
            noHospitalVisits: "ఆసుపత్రి సందర్శనలు లేవు",
            noHospitalVisitsDesc: "మీకు రాబోయే ఆసుపత్రి అపాయింట్‌మెంట్‌లు లేవు.",
            noVideoCalls: "వీడియో కాల్‌లు షెడ్యూల్ చేయబడలేదు",
            noVideoCallsDesc: "మీకు రాబోయే వీడియో సంప్రదింపులు లేవు."
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold" style={{color: 'hsl(var(--primary))'}}>{t[language].title}</h1>
            </div>
            
            <Tabs defaultValue={defaultTab} className="w-full">
                <div className="border-2 border-foreground shadow-md rounded-lg p-1 bg-muted">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="opd-status" className="font-bold flex items-center gap-2">
                            <HospitalIcon className="h-4 w-4"/> {t[language].hospitalVisit}
                             {opdAppointments.length > 0 && <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">{opdAppointments.length}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger value="video-call" className="font-bold flex items-center gap-2">
                            <Video className="h-4 w-4"/> {t[language].videoCall}
                             {videoAppointments.length > 0 && <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">{videoAppointments.length}</Badge>}
                        </TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="opd-status" className="mt-6">
                    <div className="space-y-6">
                        {opdAppointments.length > 0 ? opdAppointments.map((appt, index) => (
                           <div key={appt.id} className="space-y-4">
                                <h2 className="font-bold text-lg text-center">{index + 1}. {t[language].appointmentFor} "{appt.reason}"</h2>
                                <InPersonCard appointment={appt} />
                           </div>
                        )) : (
                            <Card className="text-center p-8 border-2 border-foreground shadow-md">
                                <CardTitle>{t[language].noHospitalVisits}</CardTitle>
                                <CardDescription>{t[language].noHospitalVisitsDesc}</CardDescription>
                            </Card>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="video-call" className="mt-6">
                     <div className="space-y-6">
                        {videoAppointments.length > 0 ? videoAppointments.map((appt, index) => (
                            <div key={appt.id} className="space-y-4">
                                <h2 className="font-bold text-lg text-center">{index + 1}. {t[language].videoCallFor} "{appt.reason}"</h2>
                                <VideoCallCard appointment={appt} />
                           </div>
                        )) : (
                            <Card className="text-center p-8 border-2 border-foreground shadow-md">
                                <CardTitle>{t[language].noVideoCalls}</CardTitle>
                                <CardDescription>{t[language].noVideoCallsDesc}</CardDescription>
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
