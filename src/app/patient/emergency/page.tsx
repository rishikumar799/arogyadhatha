
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, ShieldAlert, AlertTriangle, Droplet, User, Camera, CheckCircle, Loader2, Ambulance, Timer, History, View } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const emergencyContacts = [
    { name: "Apollo Emergency Ambulance", telugu: "అపోలో ఎమర్జెన్సీ అంబులెన్స్", distance: "2.5 km", available: true },
    { name: "Care Hospital Emergency", telugu: "కేర్ హాస్పిటల్ ఎమర్జెన్సీ", distance: "4 km", available: true },
    { name: "Dr. Rajesh Kumar (Emergency)", telugu: "డా. రాజేష్ కుమార్ (ఎమర్జెన్సీ)", distance: "N/A", available: false },
    { name: "Police Emergency", telugu: "పోలీస్ ఎమర్జెన్సీ", distance: "1.2 km", available: true },
    { name: "Fire Department", telugu: "అగ్నిమాపక శాఖ", distance: "3 km", available: true },
];

const incidentHistory = [
    { id: "INC001", date: "2024-07-15", location: "Near Market Yard, Guntur", status: "Patient Rescued" },
    { id: "INC002", date: "2024-06-28", location: "Highway NH16, near Chilakaluripet", status: "Successfully Handled" },
    { id: "INC003", date: "2024-05-10", location: "Pattabhipuram Main Road", status: "Patient Rescued" },
];

function ReportIncidentDialog() {
    const { toast } = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [step, setStep] = useState(1);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        let stream: MediaStream;
        const getCameraPermission = async () => {
          try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setHasCameraPermission(true);
    
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            toast({
              variant: 'destructive',
              title: 'Camera Access Denied',
              description: 'Please enable camera permissions in your browser settings.',
            });
          }
        };
    
        if(step === 1){
            getCameraPermission();
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
      }, [step, toast]);

    const handleNextStep = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setStep(prev => prev + 1);
            setIsProcessing(false);
            if (step === 2) {
                toast({
                    title: "Alert Sent!",
                    description: "Help is on the way to the incident location.",
                });
            }
        }, 1500);
    };

    return (
        <Dialog onOpenChange={(isOpen) => !isOpen && setStep(1)}>
            <DialogTrigger asChild>
                 <Button className="h-24 text-2xl font-bold border-2" variant="secondary">
                    <Camera className="mr-4 h-8 w-8" /> Report & Share Location
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Report Incident & Get Help</DialogTitle>
                    <DialogDescription>Follow these steps to quickly alert emergency services.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {step === 1 && (
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg text-center">Step 1: Capture Photo of Incident</h3>
                            <div className="relative aspect-video w-full bg-black rounded-md overflow-hidden border">
                                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                                {hasCameraPermission === false && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                                         <Alert variant="destructive" className="m-4">
                                            <AlertTriangle className="h-4 w-4" />
                                            <AlertTitle>Camera Access Required</AlertTitle>
                                            <AlertDescription>
                                                Please allow camera access to report an incident.
                                            </AlertDescription>
                                        </Alert>
                                    </div>
                                )}
                            </div>
                            <Button onClick={handleNextStep} disabled={!hasCameraPermission || isProcessing} className="w-full" variant="destructive">
                                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                                {isProcessing ? 'Capturing...' : 'Click Photo & Proceed'}
                            </Button>
                        </div>
                    )}
                    {step === 2 && (
                         <div className="space-y-4">
                            <div className="text-center">
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                                <h3 className="font-bold text-lg">Photo Captured Successfully</h3>
                            </div>
                            <h3 className="font-bold text-lg text-center mt-6">Step 2: Sharing Location & Details</h3>
                             <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted border">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="mt-2 font-semibold">Sending location and photo to nearby emergency services...</p>
                             </div>
                            <Button onClick={handleNextStep} disabled={isProcessing} className="w-full" variant="destructive">
                                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {isProcessing ? 'Sending...' : 'Confirm & Send Alert'}
                            </Button>
                        </div>
                    )}
                    {step === 3 && (
                        <div className="text-center space-y-6 py-8">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <h3 className="font-bold text-2xl">Help is on the way!</h3>
                            <div className="space-y-4">
                                <Card className="p-4 border-2">
                                    <CardHeader className="p-0">
                                        <CardTitle className="flex items-center justify-center gap-2">
                                            <Ambulance className="h-6 w-6 text-primary" /> Ambulance Allocated
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0 pt-2">
                                        <p className="text-xl font-bold">AP-07-5555</p>
                                    </CardContent>
                                </Card>
                                 <Card className="p-4 border-2">
                                    <CardHeader className="p-0">
                                        <CardTitle className="flex items-center justify-center gap-2">
                                            <Timer className="h-6 w-6 text-primary" /> Estimated Arrival
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0 pt-2">
                                        <p className="text-xl font-bold">5-7 minutes</p>
                                    </CardContent>
                                </Card>
                                <Card className="p-4 border-2">
                                    <CardHeader className="p-0 mb-2">
                                        <CardTitle className="flex items-center justify-center gap-2">
                                            <User className="h-6 w-6 text-primary" /> Driver Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0 space-y-2">
                                        <p className="text-lg font-bold">Suresh Kumar</p>
                                        <Button asChild variant="outline" className="w-full border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800">
                                            <a href="tel:+919876543210"><Phone className="mr-2 h-4 w-4"/> Call Driver</a>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                            <p className="text-sm text-muted-foreground pt-4">You may now safely leave the area if needed. The ambulance has your exact location.</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function EmergencyPage() {
    const { language } = useLanguage();

    const t = {
        en: {
            title: "Emergency Services",
            subtitle: "In case of emergency, use the options below immediately.",
            callAmbulance: "CALL AMBULANCE - 108",
            shareLocation: "Share My Location",
            criticalInfo: "Critical Information",
            criticalInfoDesc: "Share this with emergency services.",
            name: "Name",
            age: "Age",
            years: "Years",
            bloodGroup: "Blood Group",
            contact: "Contact",
            emergencyContacts: "Emergency Contacts",
            available: "Available",
            unavailable: "Unavailable",
            medicalAlerts: "Medical Alerts",
            currentMedications: "Current Medications:",
            knownAllergies: "Known Allergies:",
            emergencyInstructions: "Emergency Instructions",
            instructions: [
                "1. Stay calm and do not panic.",
                "2. Call the ambulance or your nearest emergency contact.",
                "3. Share your live location if possible.",
                "4. Inform them about your medical alerts.",
            ],
            incidentHistory: "Incident Report History",
            livesSaved: "Lives Saved: 3",
        },
        te: {
            title: "అత్యవసర సేవలు",
            subtitle: "అత్యవసర పరిస్థితులలో, వెంటనే క్రింది ఎంపికలను ఉపయోగించండి.",
            callAmbulance: "అంబులెన్స్‌కు కాల్ చేయండి - 108",
            shareLocation: "నా లొకేషన్ పంచుకోండి",
            criticalInfo: "క్లిష్టమైన సమాచారం",
            criticalInfoDesc: "దీనిని అత్యవసర సేవలతో పంచుకోండి.",
            name: "పేరు",
            age: "వయస్సు",
            years: "సంవత్సరాలు",
            bloodGroup: "రక్త వర్గం",
            contact: "సంప్రదించండి",
            emergencyContacts: "అత్యవసర పరిచయాలు",
            available: "అందుబాటులో ఉంది",
            unavailable: "అందుబాటులో లేదు",
            medicalAlerts: "వైద్య హెచ్చరికలు",
            currentMedications: "ప్రస్తుత మందులు:",
            knownAllergies: "తెలిసిన అలెర్జీలు:",
            emergencyInstructions: "అత్యవసర సూచనలు",
            instructions: [
                "1. ప్రశాంతంగా ఉండండి మరియు భయపడకండి.",
                "2. అంబులెన్స్‌కు లేదా మీ సమీప అత్యవసర పరిచయానికి కాల్ చేయండి.",
                "3. వీలైతే మీ ప్రత్యక్ష లొకేషన్‌ను పంచుకోండి.",
                "4. మీ వైద్య హెచ్చరికల గురించి వారికి తెలియజేయండి.",
            ],
            incidentHistory: "సంఘటన నివేదిక చరిత్ర",
            livesSaved: "కాపాడిన ప్రాణాలు: 3",
        }
    }[language];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-destructive">{t.title}</h1>
                <p className="text-muted-foreground mt-2">{t.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                 <Button className="h-24 text-2xl font-bold border-2" variant="destructive" asChild>
                    <a href="tel:108">
                        <Phone className="mr-4 h-8 w-8" /> {t.callAmbulance}
                    </a>
                </Button>
                <ReportIncidentDialog />
            </div>
            
            <Card className="border-destructive/50 bg-destructive/5 border-2">
                <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2"><ShieldAlert/> {t.criticalInfo}</CardTitle>
                    <CardDescription>{t.criticalInfoDesc}</CardDescription>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                    <p><strong>{t.name}:</strong> Chinta Lokesh Babu</p>
                    <p><strong>{t.age}:</strong> 27 {t.years}</p>
                    <p><strong>{t.bloodGroup}:</strong> O+ Positive</p>
                    <p><strong>{t.contact}:</strong> +91 8008334948</p>
                </CardContent>
            </Card>

            <Card className="border-2">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>{t.incidentHistory}</span>
                        <Badge variant="secondary" className="text-base border">{t.livesSaved}</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {incidentHistory.map(item => (
                        <div key={item.id} className="p-3 rounded-lg bg-muted/50 border flex justify-between items-center">
                           <div>
                                <p className="font-semibold">{item.date} - <span className="text-muted-foreground">{item.location}</span></p>
                                <p className="text-sm text-green-600 font-bold">{item.status}</p>
                           </div>
                           <Dialog>
                               <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm"><View className="h-4 w-4 mr-1"/> Details</Button>
                               </DialogTrigger>
                               <DialogContent>
                                   <DialogHeader>
                                       <DialogTitle>Incident Details: {item.id}</DialogTitle>
                                   </DialogHeader>
                                   <div className="py-4 space-y-2">
                                       <p><strong>Date:</strong> {item.date}</p>
                                       <p><strong>Location:</strong> {item.location}</p>
                                       <p><strong>Outcome:</strong> {item.status}</p>
                                       <p><strong>Summary:</strong> An ambulance was dispatched immediately and the patient was transported to the nearest hospital. Your quick report was critical.</p>
                                   </div>
                               </DialogContent>
                           </Dialog>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
                 <Card className="border-2">
                    <CardHeader>
                        <CardTitle>{t.emergencyContacts}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {emergencyContacts.map(contact => (
                                <li key={contact.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border-2">
                                    <div>
                                        <p className="font-semibold">{language === 'en' ? contact.name : contact.telugu}</p>
                                        <p className="text-sm text-muted-foreground">{contact.distance}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant={contact.available ? 'default' : 'destructive'} className={cn('font-bold border-2', contact.available ? 'bg-green-500' : '')}>
                                            {contact.available ? t.available : t.unavailable}
                                        </Badge>
                                        <Button size="icon" variant="outline" className="border-2"><Phone className="h-4 w-4"/></Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                 <div className="space-y-6">
                     <Card className="border-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><AlertTriangle/> {t.medicalAlerts}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <h4 className="font-semibold">{t.currentMedications}</h4>
                                <p className="text-muted-foreground">Metformin, Paracetamol</p>
                            </div>
                            <div>
                                <h4 className="font-semibold">{t.knownAllergies}</h4>
                                <p className="text-muted-foreground">Penicillin</p>
                            </div>
                        </CardContent>
                    </Card>

                     <Card className="border-2">
                        <CardHeader>
                            <CardTitle>{t.emergencyInstructions}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                           {t.instructions.map((item, index) => (
                               <p key={index}>{item}</p>
                           ))}
                        </CardContent>
                    </Card>
                 </div>
            </div>
        </div>
    )
}
