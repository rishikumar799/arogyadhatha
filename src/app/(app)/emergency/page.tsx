
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, ShieldAlert, PlusCircle, AlertTriangle, Droplet, User, Building, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";

const emergencyContacts = [
    { name: "Apollo Emergency Ambulance", telugu: "అపోలో ఎమర్జెన్సీ అంబులెన్స్", distance: "2.5 km", available: true },
    { name: "Care Hospital Emergency", telugu: "కేర్ హాస్పిటల్ ఎమర్జెన్సీ", distance: "4 km", available: true },
    { name: "Dr. Rajesh Kumar (Emergency)", telugu: "డా. రాజేష్ కుమార్ (ఎమర్జెన్సీ)", distance: "N/A", available: false },
    { name: "Police Emergency", telugu: "పోలీస్ ఎమర్జెన్సీ", distance: "1.2 km", available: true },
    { name: "Fire Department", telugu: "అగ్నిమాపక శాఖ", distance: "3 km", available: true },
];

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
        }
    }[language];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-destructive">{t.title}</h1>
                <p className="text-muted-foreground mt-2">{t.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Button className="h-24 text-2xl font-bold" variant="destructive">
                    <Phone className="mr-4 h-8 w-8" /> {t.callAmbulance}
                </Button>
                <Button className="h-24 text-2xl font-bold" variant="secondary">
                    <MapPin className="mr-4 h-8 w-8" /> {t.shareLocation}
                </Button>
            </div>
            
            <Card className="border-destructive/50 bg-destructive/5 border">
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

            <div className="grid lg:grid-cols-2 gap-6">
                 <Card className="border">
                    <CardHeader>
                        <CardTitle>{t.emergencyContacts}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {emergencyContacts.map(contact => (
                                <li key={contact.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                                    <div>
                                        <p className="font-semibold">{language === 'en' ? contact.name : contact.telugu}</p>
                                        <p className="text-sm text-muted-foreground">{contact.distance}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant={contact.available ? 'default' : 'destructive'} className={cn('font-bold', contact.available ? 'bg-green-500' : '')}>
                                            {contact.available ? t.available : t.unavailable}
                                        </Badge>
                                        <Button size="icon" variant="outline" className="border"><Phone className="h-4 w-4"/></Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                 <div className="space-y-6">
                     <Card className="border">
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

                     <Card className="border">
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
