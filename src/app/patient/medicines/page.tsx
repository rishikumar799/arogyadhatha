

'use client';

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { FlaskConical, Stethoscope, Microscope, LifeBuoy, Bell, Utensils, Award, AlarmClock, Info, Loader2, Sparkles, AlertTriangle, Pencil, PlusCircle, History, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, FileText, X, Search, Upload, Hospital, Phone, MapPin, Tag, Package, PackageCheck, Send, ShoppingCart, MessageSquare, Download, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { generateDietPlan, AiDietPlanOutput } from '@/ai/flows/ai-diet-plan';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { medicineSchedule as initialMedicineSchedule, medicineHistoryData } from '@/lib/medicines-data';
import Image from 'next/image';
import { useLanguage } from '@/context/language-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';


const getStatusIcon = (status: string) => {
    switch (status) {
        case 'taken':
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        case 'missed':
            return <XCircle className="h-5 w-5 text-red-500" />;
        case 'pending':
            return <Clock className="h-5 w-5 text-yellow-500" />;
        default:
            return null;
    }
};


const medicineAssistanceItems = [
    { href: '/medicine-assistant', icon: FlaskConical, label: 'AI Medicine Assistant', telugu: 'AI మందుల సహాయకుడు' },
    { href: '#', icon: Stethoscope, label: 'Nearby Pharmacies', telugu: 'సమీపంలోని ఫార్మసీలు' },
    { href: '#', icon: Microscope, label: 'Drug Interaction Check', telugu: 'డ్రగ్ ఇంటరాక్షన్ చెక్' },
    { href: '#', icon: LifeBuoy, label: 'Pharmacist Consultation', telugu: 'ఫార్మసిస్ట్ సంప్రదింపులు' },
];

const pharmacies = [
    { name: "Apollo Pharmacy", logo: "https://picsum.photos/seed/apollo_pharmacy/100/100", dataAiHint: "apollo pharmacy logo", discount: "Up to 15% OFF", location: "Brodipet, Guntur", qrCode: "https://picsum.photos/seed/apollo_qr/200/200" },
    { name: "MedPlus Pharmacy", logo: "https://picsum.photos/seed/medplus/100/100", dataAiHint: "medplus logo", discount: "Flat 20% OFF", location: "Arundelpet, Guntur", qrCode: "https://picsum.photos/seed/medplus_qr/200/200" },
    { name: "7 Hills Pharmacy", logo: "https://picsum.photos/seed/7hills/100/100", dataAiHint: "pharmacy logo", discount: "Up to 18% OFF", location: "Kothapet, Guntur", qrCode: "https://picsum.photos/seed/7hills_qr/200/200" },
    { name: "Sanjivani Pharmacy", logo: "https://picsum.photos/seed/sanjivani/100/100", dataAiHint: "medical cross logo", discount: "Up to 15% OFF", location: "Lakshmipuram, Guntur", qrCode: "https://picsum.photos/seed/sanjivani_qr/200/200" },
    { name: "Wellness Forever", logo: "https://picsum.photos/seed/wellness/100/100", dataAiHint: "wellness logo", discount: "Flat 15% OFF", location: "Pattabhipuram, Guntur", qrCode: "https://picsum.photos/seed/wellness_qr/200/200" },
];

const userHealthProfile = {
    conditions: ["Fever & Cold", "Allergic Rhinitis"],
    medications: ["Paracetamol", "Cetirizine", "Metformin", "Vitamin D3"]
};

// Mock Data for Tracking and History
const activeOrder = {
    orderId: "MED45321",
    status: "Out for Delivery",
    steps: [
        { name: "Order Confirmed", date: "Jul 18, 10:00 AM", completed: true },
        { name: "Processing Medicines", date: "Jul 18, 10:15 AM", completed: true },
        { name: "Out for Delivery", date: "Jul 18, 11:30 AM", completed: true },
        { name: "Delivered", date: "Expected by 1:00 PM", completed: false },
    ],
};

const orderHistory = [
    { orderId: "MED39876", date: "2024-06-25", items: 4, total: 540 },
    { orderId: "MED35123", date: "2024-05-18", items: 2, total: 280 },
    { orderId: "MED34098", date: "2024-04-30", items: 5, total: 710 },
];

function DietPlanDialog() {
    const [isPending, startTransition] = useTransition();
    const [dietPlan, setDietPlan] = useState<AiDietPlanOutput | null>(null);
    const { language } = useLanguage();
    const { toast } = useToast();

    const handleGeneratePlan = () => {
        startTransition(async () => {
            const result = await generateDietPlan(userHealthProfile);
            setDietPlan(result);
        });
    };
    
    const formatPlanForText = () => {
        if (!dietPlan) return "";
        let text = `AI Diet Plan for ${userHealthProfile.conditions.join(', ')}\n\n`;
        dietPlan.plan.forEach(meal => {
            text += `**${meal.meal}**\n`;
            meal.items.forEach(item => text += `- ${item}\n`);
            text += `Reason: ${meal.reason}\n\n`;
        });
        text += "**General Advice**\n";
        dietPlan.generalAdvice.forEach(advice => text += `- ${advice}\n`);
        return text;
    };
    
    const handleCopyToClipboard = () => {
        const planText = formatPlanForText();
        navigator.clipboard.writeText(planText);
        toast({
            title: "Plan Copied!",
            description: "The diet plan has been copied to your clipboard.",
        });
    };

    const handleDownload = () => {
        toast({
            title: "Download Started",
            description: "Your diet plan is being prepared for download.",
        });
        // This is a simulation. In a real app, you'd generate a file.
    };

    const t = {
        en: {
            title: "AI Personalized Diet Plan",
            description: "A diet plan generated by AI based on your current health profile.",
            profileTitle: "Your current health profile:",
            conditions: "Active Conditions",
            medications: "Current Medications",
            generate: "Generate Plan",
            generating: "Generating your personalized diet plan...",
            analyzing: "The AI is analyzing your profile.",
            advice: "General Advice",
            reason: "Reason",
            disclaimerTitle: "Disclaimer",
            disclaimerText: "This diet plan is AI-generated and for informational purposes only. It is not a substitute for professional medical advice. Always consult a qualified doctor or dietitian.",
            disclaimerICMR: "ICMR Approved Info",
        },
        te: {
            title: "AI వ్యక్తిగతీకరించిన ఆహార ప్రణాళిక",
            description: "మీ ప్రస్తుత ఆరోగ్య ప్రొఫైల్ ఆధారంగా AI రూపొందించిన ఆహార ప్రణాళిక.",
            profileTitle: "మీ ప్రస్తుత ఆరోగ్య ప్రొఫైల్:",
            conditions: "క్రియాశీల పరిస్థితులు",
            medications: "ప్రస్తుత మందులు",
            generate: "ప్రణాళికను రూపొందించండి",
            generating: "మీ వ్యక్తిగతీకరించిన ఆహార ప్రణాళికను రూపొందిస్తోంది...",
            analyzing: "AI మీ ప్రొఫైల్‌ను విశ్లేషిస్తోంది.",
            advice: "సాధారణ సలహా",
            reason: "కారణం",
            disclaimerTitle: "గమనిక",
            disclaimerText: "ఈ ఆహార ప్రణాళిక AI ద్వారా రూపొందించబడింది మరియు సమాచార ప్రయోజనాల కోసం మాత్రమే. ఇది వృత్తిపరమైన వైద్య సలహాకు ప్రత్యామ్నాయం కాదు. ఎల్లప్పుడూ అర్హతగల వైద్యుడిని లేదా డైటీషియన్‌ను సంప్రదించండి.",
            disclaimerICMR: "ICMR ఆమోదించిన సమాచారం",
        }
    }[language];


    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex justify-center mt-2">
                    <Button className="w-full h-12 text-base" style={{backgroundColor: 'hsl(var(--nav-medicines))'}}>
                        <Sparkles className="mr-2 h-5 w-5" />
                        {language === 'en' ? 'Get AI Diet Plan' : 'AI డైట్ ప్లాన్ పొందండి'}
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl border">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2" style={{color: 'hsl(var(--nav-medicines))'}}><Sparkles /> {t.title}</DialogTitle>
                    <DialogDescription>
                       {t.description}
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[70vh] overflow-y-auto p-1 space-y-4">
                    {!dietPlan && !isPending && (
                        <div className="space-y-4">
                            <p className="font-semibold">{t.profileTitle}</p>
                            <div className="space-y-2">
                                <div>
                                    <Label>{t.conditions}</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {userHealthProfile.conditions.map(c => <Badge key={c} variant="outline" className="border">{c}</Badge>)}
                                    </div>
                                </div>
                                <div>
                                    <Label>{t.medications}</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {userHealthProfile.medications.map(m => <Badge key={m} variant="secondary" className="border">{m}</Badge>)}
                                    </div>
                                </div>
                            </div>
                            <Button onClick={handleGeneratePlan} className="w-full" style={{backgroundColor: 'hsl(var(--nav-medicines))'}}>
                                <Sparkles className="mr-2 h-4 w-4" /> {t.generate}
                            </Button>
                        </div>
                    )}
                    
                    {isPending && (
                        <div className="flex flex-col items-center justify-center h-64">
                            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" style={{color: 'hsl(var(--nav-medicines))'}}/>
                            <p className="font-semibold">{t.generating}</p>
                            <p className="text-sm text-muted-foreground">{t.analyzing}</p>
                        </div>
                    )}

                    {dietPlan && (
                        <div className="space-y-6">
                            {dietPlan.plan.map((meal, index) => (
                                <Card key={index} className="bg-muted/30 border">
                                    <CardHeader>
                                        <CardTitle className="text-lg">{meal.meal}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-3">
                                            {meal.items.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                        <p className="text-sm font-semibold italic p-2 rounded-lg bg-background border">
                                            <strong>{t.reason}:</strong> {meal.reason}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                            <Card className="border">
                                <CardHeader>
                                    <CardTitle className="text-lg">{t.advice}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                     <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                        {dietPlan.generalAdvice.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </CardContent>
                            </Card>
                            <Card className="border">
                                <CardHeader>
                                    <CardTitle>Save Plan</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-2">
                                     <Button variant="outline" className="border" onClick={handleDownload}>
                                        <Download className="mr-2 h-4 w-4" /> Download as Word
                                    </Button>
                                    <Button variant="outline" className="border" onClick={handleCopyToClipboard}>
                                        <Copy className="mr-2 h-4 w-4" /> Copy to Clipboard
                                    </Button>
                                </CardContent>
                                <CardFooter>
                                    <p className="text-xs text-muted-foreground">Copy the plan to paste it into your mobile notes or any other app.</p>
                                </CardFooter>
                            </Card>
                        </div>
                    )}

                    <div className="bg-yellow-50 border-yellow-200 rounded-lg p-4 mt-6 border">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-700 mt-1 flex-shrink-0"/>
                            <div>
                                <h4 className="font-semibold text-yellow-800">{t.disclaimerTitle}</h4>
                                <p className="text-sm text-yellow-700">
                                    {t.disclaimerText} <span className="font-semibold">({t.disclaimerICMR})</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function MedicineForm({ medicine, onSave }: { medicine?: any; onSave: (med: any) => void }) {
    const [name, setName] = useState(medicine?.name || '');
    const [teluguName, setTeluguName] = useState(medicine?.teluguName || '');
    const [medicineUse, setMedicineUse] = useState(medicine?.use || '');
    const [teluguUse, setTeluguUse] = useState(medicine?.teluguUse || '');
    const [dosage, setDosage] = useState(medicine?.dosage || '');
    const [frequency, setFrequency] = useState(medicine?.frequency || '');
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newMed = {
            ...medicine,
            name,
            teluguName,
            use: medicineUse,
            teluguUse,
            dosage,
            frequency,
            alerts: medicine?.alerts || [{ time: "9:00 AM", status: "pending" }],
        };
        onSave(newMed);
        toast({
            title: "Medicine Saved!",
            description: `${name} has been successfully saved.`,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="med-name">Medicine Name</Label>
                <Input id="med-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Paracetamol" required className="border"/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="med-telugu-name">Medicine Name (Telugu)</Label>
                <Input id="med-telugu-name" value={teluguName} onChange={(e) => setTeluguName(e.target.value)} placeholder="ఉదా., పారాసిటమాల్" className="border" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="med-use">Use (English)</Label>
                <Input id="med-use" value={medicineUse} onChange={(e) => setMedicineUse(e.target.value)} placeholder="e.g., For fever and pain relief" className="border" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="med-telugu-use">Use (Telugu)</Label>
                <Input id="med-telugu-use" value={teluguUse} onChange={(e) => setTeluguUse(e.target.value)} placeholder="ఉదా., జ్వరం మరియు నొప్పి నివారణకు" className="border" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="med-dosage">Dosage</Label>
                <Input id="med-dosage" value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="e.g., 500mg" className="border" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="med-frequency">Frequency</Label>
                <Input id="med-frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)} placeholder="e.g., Twice a day" className="border" />
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="submit" style={{ backgroundColor: 'hsl(var(--nav-medicines))' }}>Save Changes</Button>
                </DialogClose>
            </DialogFooter>
        </form>
    );
}

function OrderDialog({ pharmacy, trigger }: { pharmacy: any; trigger: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState<{role: 'user' | 'pharmacist', text: string}[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPrescriptionFile(e.target.files[0]);
            setChat([{ role: 'user', text: `Uploaded prescription: ${e.target.files[0].name}` }]);
            setStep(2);
        }
    };

    const handleSendMessage = () => {
        if (!message) return;
        setChat(prev => [...prev, { role: 'user', text: message }]);
        setMessage('');

        // Simulate pharmacist response
        setTimeout(() => {
            if (message.toLowerCase().includes('substitute')) {
                setChat(prev => [...prev, { role: 'pharmacist', text: "Yes, we can substitute with a generic version which costs ₹85 after discount. Is that okay?" }]);
            } else {
                 setChat(prev => [...prev, { role: 'pharmacist', text: "Thank you for your query. Your estimated total is ₹120 after a 15% discount. Shall I proceed?" }]);
            }
        }, 1500);
    };
    
    const handleProceedToPay = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setStep(3);
            setIsSubmitting(false);
        }, 1000);
    };

    const resetState = () => {
        setStep(1);
        setPrescriptionFile(null);
        setMessage('');
        setChat([]);
        setIsSubmitting(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetState(); }}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-lg border">
                <DialogHeader>
                    <DialogTitle>Order from {pharmacy.name}</DialogTitle>
                    {step === 1 && <DialogDescription>Upload your prescription to start.</DialogDescription>}
                    {step === 2 && <DialogDescription>Chat with the pharmacist for estimates and queries.</DialogDescription>}
                    {step === 3 && <DialogDescription>Scan the QR code to complete your payment.</DialogDescription>}
                </DialogHeader>

                {step === 1 && (
                    <div className="py-8 text-center">
                        <Button asChild variant="outline" className="h-24 w-full border-dashed border-2">
                            <label htmlFor="prescription-upload-main" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                                <Upload className="h-8 w-8 text-muted-foreground" />
                                <span className="font-semibold text-muted-foreground">Click to upload prescription</span>
                            </label>
                        </Button>
                        <input id="prescription-upload-main" type="file" className="hidden" onChange={handleFileChange} />
                    </div>
                )}
                
                {step === 2 && (
                    <div className="space-y-4">
                        <div className="h-64 space-y-3 overflow-y-auto rounded-lg border bg-muted/30 p-4">
                            {chat.map((c, i) => (
                                <div key={i} className={cn("flex items-end gap-2", c.role === 'user' ? "justify-end" : "justify-start")}>
                                     {c.role === 'pharmacist' && <Avatar className="h-6 w-6"><AvatarImage src={pharmacy.logo} /><AvatarFallback>{pharmacy.name.charAt(0)}</AvatarFallback></Avatar>}
                                    <p className={cn("max-w-[80%] rounded-lg px-3 py-2 text-sm", c.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background')}>
                                        {c.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <Textarea placeholder="Type your message..." value={message} onChange={(e) => setMessage(e.target.value)} className="resize-none border" rows={1}/>
                            <Button size="icon" onClick={handleSendMessage}><Send className="h-4 w-4"/></Button>
                        </div>
                         <Button className="w-full" onClick={handleProceedToPay} disabled={isSubmitting} style={{ backgroundColor: 'hsl(var(--nav-medicines))' }}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                            Proceed to Pay
                        </Button>
                    </div>
                )}

                {step === 3 && (
                     <div className="py-4 text-center space-y-4">
                        <p className="font-semibold">Scan to pay with any UPI app</p>
                        <Image src={pharmacy.qrCode} alt={`${pharmacy.name} QR Code`} width={200} height={200} data-ai-hint="QR code" className="mx-auto rounded-lg border p-1"/>
                         <DialogClose asChild>
                            <Button className="w-full">Done</Button>
                        </DialogClose>
                    </div>
                )}

            </DialogContent>
        </Dialog>
    );
}

export default function MyMedicinesPage() {
    const [medicineSchedule, setMedicineSchedule] = useState(initialMedicineSchedule);
    const [editingMedicine, setEditingMedicine] = useState<any | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [zoomedImage, setZoomedImage] = useState<{url: string, name: string} | null>(null);
    const { language } = useLanguage();

    const t = {
        en: {
            title: "My Medicines",
            description: "Your daily medication schedule and recovery plan.",
            currentPrescription: "Current Prescription",
            active: "Active",
            startedOn: "Started on Jul 15, 2024",
            addMedicine: "Add Medicine",
            historyTitle: "Medication History",
            historyDescription: "Your adherence record over the last few days.",
            dietTitle: "Diet & Recovery Plan",
            dietTelugu: "ఆహారం & కోలుకునే ప్రణాళిక",
            recoveryProb: "Recovery Probability",
            probTelugu: "కోలుకునే సంభావ్యత",
            dietRec: "Recommended Diet",
            dietRecTelugu: "సిఫార్సు చేయబడిన ఆహారం",
            dietInfo: "This is a general diet plan.",
            dietAI: "Get a personalized AI plan for better results.",
            assistanceTitle: "Medicine Assistance",
            editTitle: "Edit Medicine",
            addTitle: "Add New Medicine",
            editDescription: "Update the details for your medication.",
            addDescription: "Manually add a new medicine to your schedule.",
            mySchedule: "My Schedule",
            orderFromPharmacy: "Order from Pharmacy",
            trackOrder: "Track Order",
            orderHistory: "Order History",
            orderNow: "Order Now",
        },
        te: {
            title: "నా మందులు",
            description: "మీ రోజువారీ మందుల షెడ్యూల్ మరియు కోలుకునే ప్రణాళిక.",
            currentPrescription: "ప్రస్తుత ప్రిస్క్రిప్షన్",
            active: "క్రియాశీల",
            startedOn: "జూలై 15, 2024న ప్రారంభించబడింది",
            addMedicine: "మందును జోడించండి",
            historyTitle: "మందుల చరిత్ర",
            historyDescription: "గత కొన్ని రోజులుగా మీరు మందులు వేసుకున్న రికార్డు.",
            dietTitle: "ఆహారం & కోలుకునే ప్రణాళిక",
            dietTelugu: "",
            recoveryProb: "కోలుకునే సంభావ్యత",
            probTelugu: "",
            dietRec: "సిఫార్సు చేయబడిన ఆహారం",
            dietRecTelugu: "",
            dietInfo: "ఇది సాధారణ ఆహార ప్రణాళిక.",
            dietAI: "మంచి ఫలితాల కోసం వ్యక్తిగతీకరించిన AI ప్రణాళికను పొందండి.",
            assistanceTitle: "మందుల సహాయం",
            editTitle: "మందును సవరించండి",
            addTitle: "కొత్త మందును జోడించండి",
            editDescription: "మీ మందుల వివరాలను నవీకరించండి.",
            addDescription: "మీ షెడ్యూల్‌కు కొత్త మందును మాన్యువల్‌గా జోడించండి.",
            mySchedule: "నా షెడ్యూల్",
            orderFromPharmacy: "ఫార్మసీ నుండి ఆర్డర్ చేయండి",
            trackOrder: "ఆర్డర్‌ను ట్రాక్ చేయండి",
            orderHistory: "ఆర్డర్ చరిత్ర",
            orderNow: "ఇప్పుడే ఆర్డర్ చేయండి",
        }
    }[language];


    const handleSaveMedicine = (med: any) => {
        if (editingMedicine) {
            setMedicineSchedule(medicineSchedule.map(m => m.name === editingMedicine.name ? med : m));
        } else {
            setMedicineSchedule([...medicineSchedule, med]);
        }
        setEditingMedicine(null);
        setIsFormOpen(false);
    };
    
    const toggleAlertStatus = (medName: string, alertTime: string) => {
        setMedicineSchedule(schedule =>
            schedule.map(med => {
                if (med.name === medName) {
                    return {
                        ...med,
                        alerts: med.alerts.map(alert => {
                            if (alert.time === alertTime) {
                                const newStatus = alert.status === 'taken' ? 'pending' : 'taken';
                                return { ...alert, status: newStatus };
                            }
                            return alert;
                        }),
                    };
                }
                return med;
            })
        );
    };

    const openEditDialog = (med: any) => {
        setEditingMedicine(med);
        setIsFormOpen(true);
    };

    const openAddDialog = () => {
        setEditingMedicine(null);
        setIsFormOpen(true);
    };

    return (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <Tabs defaultValue="my-schedule" className="w-full">
                <div className="sticky top-16 z-10 bg-background pt-2 pb-4 space-y-2">
                    <h1 className="text-xl font-bold text-center" style={{color: 'hsl(var(--nav-medicines))'}}>{t.title}</h1>
                    <div className="border-2 border-foreground shadow-md rounded-lg p-1 bg-muted">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="my-schedule" className="font-bold">{t.mySchedule}</TabsTrigger>
                            <TabsTrigger value="order-pharmacy" className="font-bold">{t.orderFromPharmacy}</TabsTrigger>
                        </TabsList>
                    </div>
                </div>

                <TabsContent value="my-schedule" className="mt-0">
                    <div className="grid lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="border-2 border-foreground shadow-md">
                                <CardHeader>
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl">{t.currentPrescription}</CardTitle>
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-green-100 text-green-800 border">{t.active}</Badge> 
                                            <CardDescription>{t.startedOn}</CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <Button variant="outline" size="sm" onClick={openAddDialog} className="border">
                                            <PlusCircle className="mr-2 h-4 w-4" /> {t.addMedicine}
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {medicineSchedule.map((med, index) => (
                                            <div key={index} className='p-4 rounded-lg bg-muted/30 border'>
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className='flex-1'>
                                                        <div className="flex items-baseline gap-2">
                                                            <p className="font-extrabold text-xl">{language === 'en' ? med.name : med.teluguName}</p>
                                                            <p className="font-bold text-lg text-muted-foreground">{language === 'en' ? med.teluguName : med.name}</p>
                                                        </div>
                                                        <div className="font-semibold text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                                                            <Info className="h-4 w-4" />
                                                            <div>
                                                                <p>{language === 'en' ? med.use : med.teluguUse}</p>
                                                                <p className="text-sm">{language === 'en' ? med.teluguUse : med.use}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mt-2 font-semibold">{med.dosage} • {med.frequency}</p>
                                                    </div>
                                                    <div 
                                                        className="relative group cursor-pointer"
                                                        onClick={() => setZoomedImage({url: med.image, name: med.name})}
                                                    >
                                                        <Image src={med.image} alt={med.name} width={64} height={64} data-ai-hint={med.dataAiHint} className="rounded-md border-2 border-background group-hover:opacity-80 transition-opacity" />
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                                            <Search className="text-white h-6 w-6" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 mt-4 flex-wrap">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="outline" size="sm" className="h-8 text-xs border">
                                                                <History className="mr-1.5 h-3 w-3" /> History
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="border">
                                                            <DialogHeader>
                                                                <DialogTitle>History for {med.name}</DialogTitle>
                                                            </DialogHeader>
                                                            <div className="max-h-60 overflow-y-auto space-y-3 p-1">
                                                                {medicineHistoryData.map(day => {
                                                                    const medHistory = day.medicines.find(m => m.name === med.name);
                                                                    if (!medHistory) return null;
                                                                    return (
                                                                        <div key={day.date} className="p-3 border rounded-lg">
                                                                            <p className="font-bold">{day.date}</p>
                                                                            <div className="flex flex-wrap items-center gap-4 mt-2">
                                                                                {medHistory.alerts.map((alert, alertIndex) => (
                                                                                    <div key={alertIndex} className="flex items-center gap-2">
                                                                                        {getStatusIcon(alert.status)}
                                                                                        <span className="font-semibold text-sm">{alert.time}</span>
                                                                                        <span className="text-sm text-muted-foreground capitalize">({alert.status})</span>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                    <Button variant="outline" size="sm" className="h-8 text-xs border" onClick={() => openEditDialog(med)}>
                                                        <Pencil className="mr-1.5 h-3 w-3" /> Edit
                                                    </Button>
                                                </div>
                                                <Separator className="my-4" />
                                                <div className="flex items-center gap-2 mt-3">
                                                    <AlarmClock className="h-5 w-5 text-muted-foreground"/>
                                                    <h4 className="font-semibold text-muted-foreground">Alerts</h4>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {med.alerts.map(alert => (
                                                        <Badge 
                                                            key={alert.time}
                                                            onClick={() => toggleAlertStatus(med.name, alert.time)}
                                                            className={cn("text-base px-3 py-1 cursor-pointer transition-colors border", {
                                                                "bg-green-100 text-green-800 hover:bg-green-200 border-green-200": alert.status === 'taken',
                                                                "bg-red-100 text-red-800 hover:bg-red-200 border-red-200": alert.status === 'missed',
                                                                "bg-muted text-muted-foreground hover:bg-muted/80": alert.status === 'pending'
                                                            })}
                                                        >
                                                            {alert.time}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                        </div>

                        <div className="space-y-8">
                            <Card className="border-2 border-foreground shadow-md">
                                <CardHeader>
                                    <CardTitle>{t.dietTitle}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <Label>{t.recoveryProb}</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Progress value={90} className="w-full h-3" />
                                            <span className="font-bold" style={{color: 'hsl(var(--nav-medicines))'}}>90%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold flex items-center gap-2 mb-2"><Utensils style={{color: 'hsl(var(--nav-medicines))'}}/> {t.dietRec}</h3>
                                        <div className="text-sm text-muted-foreground p-3 bg-muted/40 rounded-lg space-y-1 border">
                                            <p>• {t.dietInfo}</p>
                                            <p>• {t.dietAI}</p>
                                        </div>
                                        <DietPlanDialog />
                                    </div>
                                </CardContent>
                            </Card>
                            
                            <Card className="border-2 border-foreground shadow-md">
                                <CardHeader><CardTitle>{t.assistanceTitle}</CardTitle></CardHeader>
                                <CardContent className="space-y-3">
                                {medicineAssistanceItems.map((item) => (
                                    <Link key={item.label} href={item.href} passHref>
                                        <Button variant="outline" className="w-full justify-start gap-3 border">
                                            <item.icon className="h-5 w-5" style={{color: 'hsl(var(--nav-medicines))'}} />
                                            <span>{language === 'en' ? item.label : item.telugu}</span>
                                        </Button>
                                    </Link>
                                ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="order-pharmacy" className="mt-6">
                    <Card className="border-2 border-foreground shadow-md">
                        <CardHeader>
                            <CardTitle>Order From Local Pharmacies</CardTitle>
                            <CardDescription>Get your medicines delivered from trusted pharmacies in Guntur.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {pharmacies.map((pharmacy) => (
                                <Card key={pharmacy.name} className="p-4 border">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                        <Image src={pharmacy.logo} alt={pharmacy.name} width={80} height={80} data-ai-hint={pharmacy.dataAiHint} className="rounded-lg border-2 border-background flex-shrink-0" />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold">{pharmacy.name}</h3>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1.5"><MapPin className="h-4 w-4" />{pharmacy.location}</p>
                                            <Badge className="mt-2 bg-green-100 text-green-800 border-green-200 border">
                                                <Tag className="h-4 w-4 mr-1.5"/>{pharmacy.discount}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardFooter className="p-0 pt-4 mt-4 border-t flex-col sm:flex-row gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="w-full sm:w-auto border"><Package className="mr-2 h-4 w-4"/>{t.trackOrder}</Button>
                                            </DialogTrigger>
                                            <DialogContent className="border">
                                                <DialogHeader>
                                                    <DialogTitle>Track Delivery</DialogTitle>
                                                    <DialogDescription>Status for Order ID: {activeOrder.orderId}</DialogDescription>
                                                </DialogHeader>
                                                <div className="py-4">
                                                    <ul className="space-y-6">
                                                        {activeOrder.steps.map((step, index) => (
                                                            <li key={index} className="flex items-start gap-4">
                                                                <div className="flex flex-col items-center">
                                                                    <div className={cn("h-8 w-8 rounded-full flex items-center justify-center border", step.completed ? "bg-primary" : "bg-muted ")} style={{backgroundColor: step.completed ? 'hsl(var(--nav-medicines))' : ''}}>
                                                                        {step.completed ? <CheckCircle className="h-5 w-5 text-primary-foreground" /> : <Package className="h-5 w-5 text-muted-foreground"/>}
                                                                    </div>
                                                                    {index < activeOrder.steps.length - 1 && <div className="w-0.5 h-12 mt-1 bg-border"/>}
                                                                </div>
                                                                <div>
                                                                    <p className={cn("font-bold", step.completed && "text-primary")} style={{color: step.completed ? 'hsl(var(--nav-medicines))' : ''}}>{step.name}</p>
                                                                    <p className="text-sm text-muted-foreground">{step.date}</p>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="w-full sm:w-auto border"><History className="mr-2 h-4 w-4"/>{t.orderHistory}</Button>
                                            </DialogTrigger>
                                            <DialogContent className="border">
                                                <DialogHeader>
                                                    <DialogTitle>Order History with {pharmacy.name}</DialogTitle>
                                                </DialogHeader>
                                                <div className="py-4 space-y-3 max-h-96 overflow-y-auto">
                                                    {orderHistory.map(order => (
                                                        <div key={order.orderId} className="p-3 border rounded-lg flex justify-between items-center">
                                                            <div>
                                                                <p className="font-bold">{order.orderId}</p>
                                                                <p className="text-sm text-muted-foreground">{order.date} • {order.items} items • ₹{order.total}</p>
                                                            </div>
                                                            <Button size="sm" style={{backgroundColor: 'hsl(var(--nav-medicines))'}}>Reorder</Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                        <OrderDialog 
                                            pharmacy={pharmacy} 
                                            trigger={
                                                <Button className="w-full sm:w-auto flex-1" style={{backgroundColor: 'hsl(var(--nav-medicines))'}}><MessageSquare className="mr-2 h-4 w-4"/>{t.orderNow}</Button>
                                            }
                                        />
                                    </CardFooter>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <DialogContent className="border">
                <DialogHeader>
                    <DialogTitle>{editingMedicine ? t.editTitle : t.addTitle}</DialogTitle>
                    <DialogDescription>
                        {editingMedicine ? t.editDescription : t.addDescription}
                    </DialogDescription>
                </DialogHeader>
                <MedicineForm medicine={editingMedicine} onSave={handleSaveMedicine} />
            </DialogContent>
            
            {zoomedImage && (
                <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
                    <DialogContent className="max-w-md flex flex-col p-0 border">
                         <DialogHeader className="p-4 bg-background rounded-t-lg z-10 shadow-sm flex-row items-center justify-between">
                            <DialogTitle>{zoomedImage.name}</DialogTitle>
                         </DialogHeader>
                        <div className="flex-1 relative bg-muted/20 flex items-center justify-center p-4">
                            <Image
                                src={zoomedImage.url}
                                alt={`Enlarged view of ${zoomedImage.name}`}
                                width={400}
                                height={400}
                                style={{objectFit: "contain"}}
                                className="rounded-lg"
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </Dialog>
    );
}

    
