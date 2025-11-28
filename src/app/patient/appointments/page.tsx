

'use client';

import React, { useState, useMemo, useEffect, useTransition, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, MapPin, HeartPulse, Bone, Brain, Stethoscope as StethoscopeIcon, Baby, Leaf, Phone, Globe, Share2, Copy, Loader2, Star, Calendar, History, ChevronDown, FileText, Pill, CheckCircle, XCircle, Filter, X, PartyPopper, MessageSquare, Upload, Printer, Download, View, XCircleIcon, ImageIcon, File as FileIcon, Sparkles, Map as MapIcon, Clock, PlusCircle, Pencil, Trash2, CreditCard, Lock, Sun, Moon, Separator as SeparatorIcon, ArrowLeft, ChevronRight, HelpCircle, Wifi, Hospital, Briefcase, User, Wallet, Users, HeartHandshake, Bot, Shield, Droplets, SlidersHorizontal, ArrowUpDown, Video, Landmark, Wind, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { previousAppointments as initialAppointmentsData } from '@/lib/appointments-data';
import { dummyReportData } from '@/lib/dummy-report-data';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { FlowerFall } from '@/components/ui/flower-fall';
import { analyzeReport, ReportAnalysisOutput } from '@/ai/flows/ai-report-analysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import { useLocation } from '@/context/location-context';
import { LocationSelector } from '@/components/layout/location-selector';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Suspense } from 'react';
import { getDeepDive, DeepDiveOutput } from '@/ai/flows/ai-deep-dive';
import { useLanguage } from '@/context/language-context';


const ToothIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 20a2 2 0 0 0 2-2V9.3a2 2 0 0 0-.6-1.4l-4.2-4.2a2 2 0 0 0-1.4-.6H8.3a2 2 0 0 0-1.4.6L2.7 7.9a2 2 0 0 0-.6 1.4V18a2 2 0 0 0 2 2Z"/><path d="M22 20H2"/><path d="m5 12 1-2h12l1 2"/><path d="M12 12v8"/></svg>
);


const hospitalsData: Record<string, { location: string; address: string; phone: string; website: string; hours?: string; rating?: string; reviews?: string }> = {
    "Guntur Kidney & Multispeciality Hospital": {
        location: "Guntur",
        address: "Kothapet, Guntur, Andhra Pradesh 522001",
        phone: "8008334948",
        website: "https://gunturkidneyhospital.com",
        hours: "Open 24 hours"
    },
    "AIIMS, Mangalagiri": {
        location: "Mangalagiri",
        address: "Mangalagiri, Andhra Pradesh 522503",
        phone: "08645 295 000",
        website: "https://www.aiimsmangalagiri.edu.in/",
        hours: "Open ⋅ Closes 5pm"
    },
    "Guntur Government Hospital": {
        location: "Guntur",
        address: "7CXV+Q6M, Sambasiva Pet, Guntur, Andhra Pradesh 522001",
        phone: "0863 223 4594",
        website: "https://gmc.ap.gov.in/ggh-guntur.html",
        hours: "Open 24 hours"
    },
    "Aster Ramesh Hospitals": {
        location: "Guntur",
        address: "Collector Office Rd, Beside Hindu College Grounds, Nagarampalem, Guntur, Andhra Pradesh 522004",
        phone: "0863 237 7777",
        website: "https://www.asterramesh.com/",
        hours: "Open 24 hours",
        rating: "4.8",
        reviews: "23,960 Google reviews"
    },
    "Lalitha Super Speciality Hospitals": {
        location: "Guntur",
        address: "12-21-13, Kothapet Main Rd, Kothapeta, Guntur, Andhra Pradesh 522001",
        phone: "094907 59378",
        website: "https://lalithahospitals.com/",
        hours: "Open 24 hours",
        rating: "4.5",
        reviews: "2,629 Google reviews"
    },
};

const initialDoctors = [
    { name: "Dr. V. Venkata Naidu, MS, MCh", specialty: "Urologist", experience: 25, hospital: "Guntur Kidney & Multispeciality Hospital", surgeries: "20,000+ Successful Surgeries", mainDealing: "Urology, advanced surgical procedures, and successful kidney transplants.", avatar: "https://picsum.photos/seed/doc11/100/100", dataAiHint: "male doctor experienced", opFee: 1100, availability: "Mon - Fri, 10 AM - 4 PM", consultationType: "Offline", gender: "Male", rating: 4.8 },
    { name: "General Medicine OP", specialty: "General Physician", experience: 15, hospital: "AIIMS, Mangalagiri", surgeries: "N/A", mainDealing: "General health consultations and treatment.", avatar: "https://picsum.photos/seed/govdoc1/100/100", dataAiHint: "doctor symbol", opFee: 10, availability: "Mon - Sat, 9 AM - 1 PM", consultationType: "Offline", gender: "Both", rating: 4.2 },
    { name: "Orthopedics OP", specialty: "Orthopedic Surgeon", experience: 20, hospital: "AIIMS, Mangalagiri", surgeries: "N/A", mainDealing: "Bone, joint, and muscle related issues.", avatar: "https://picsum.photos/seed/govdoc2/100/100", dataAiHint: "hospital icon", opFee: 10, availability: "Mon - Fri, 9 AM - 1 PM", consultationType: "Offline", gender: "Both", rating: 4.4 },
    { name: "Cardiology OP", specialty: "Cardiologist", experience: 18, hospital: "Guntur Government Hospital", surgeries: "N/A", mainDealing: "Heart-related diseases and check-ups.", avatar: "https://picsum.photos/seed/govdoc3/100/100", dataAiHint: "heart icon", opFee: 10, availability: "Mon - Sat, 10 AM - 2 PM", consultationType: "Offline", gender: "Both", rating: 4.3 },
    { name: "Dermatology OP", specialty: "Dermatologist", experience: 12, hospital: "Guntur Government Hospital", surgeries: "N/A", mainDealing: "Skin, hair, and nail problems.", avatar: "https://picsum.photos/seed/govdoc4/100/100", dataAiHint: "medical cross", opFee: 10, availability: "Mon, Wed, Fri, 2 PM - 5 PM", consultationType: "Offline", gender: "Both", rating: 4.1 },
    { name: "Dr. Ramana", specialty: "Cardiologist", experience: 15, hospital: "Aster Ramesh Hospitals", surgeries: "500+ Angioplasties", mainDealing: "Interventional Cardiology, Heart Failure Management.", avatar: "https://picsum.photos/seed/doc_ramana/100/100", dataAiHint: "male doctor serious", opFee: 800, availability: "Mon - Sat, 9 AM - 5 PM", consultationType: "Both", gender: "Male", rating: 4.9 },
    { name: "Dr. Lakshminarayana", specialty: "Orthopedic Surgeon", experience: 22, hospital: "Aster Ramesh Hospitals", surgeries: "1000+ Joint Replacements", mainDealing: "Knee and Hip Replacement, Trauma Surgery.", avatar: "https://picsum.photos/seed/doc_lakshmi/100/100", dataAiHint: "male doctor experienced", opFee: 750, availability: "Mon - Fri, 10 AM - 4 PM", consultationType: "Offline", gender: "Male", rating: 4.8 },
    { name: "Dr. Ashok", specialty: "Neurologist", experience: 18, hospital: "Aster Ramesh Hospitals", surgeries: "N/A", mainDealing: "Stroke, Epilepsy, Headache Management.", avatar: "https://picsum.photos/seed/doc_ashok/100/100", dataAiHint: "male doctor thinking", opFee: 900, availability: "Tue, Thu, Sat, 11 AM - 3 PM", consultationType: "Offline", gender: "Male", rating: 4.7 },
    { name: "Dr. Siva Parvathi", specialty: "Gynaecologist", experience: 20, hospital: "Aster Ramesh Hospitals", surgeries: "2000+ Deliveries", mainDealing: "High-risk Pregnancy, Infertility.", avatar: "https://picsum.photos/seed/doc_siva/100/100", dataAiHint: "female doctor smiling", opFee: 700, availability: "Mon - Sat, 10 AM - 5 PM", consultationType: "Both", gender: "Female", rating: 4.9 },
    { name: "Dr. Sathyam", specialty: "General Physician", experience: 12, hospital: "Aster Ramesh Hospitals", surgeries: "N/A", mainDealing: "Diabetes, Hypertension, Infectious Diseases.", avatar: "https://picsum.photos/seed/doc_sathyam/100/100", dataAiHint: "male doctor friendly", opFee: 600, availability: "Mon - Sat, 9 AM - 6 PM", consultationType: "Online", gender: "Male", rating: 4.6 },
    { name: "Dr. Ramana", specialty: "Pediatrician", experience: 10, hospital: "Aster Ramesh Hospitals", surgeries: "N/A", mainDealing: "General Pediatrics, Vaccinations.", avatar: "https://picsum.photos/seed/doc_ramana_ped/100/100", dataAiHint: "male doctor with child", opFee: 650, availability: "Mon - Fri, 9 AM - 1 PM", consultationType: "Offline", gender: "Male", rating: 4.5 },
    { name: "Dr. Lakshminarayana", specialty: "Dermatologist", experience: 8, hospital: "Aster Ramesh Hospitals", surgeries: "N/A", mainDealing: "Acne, Psoriasis, Skin Allergies.", avatar: "https://picsum.photos/seed/doc_lakshmi_derm/100/100", dataAiHint: "doctor examining skin", opFee: 700, availability: "Mon, Wed, Fri, 3 PM - 6 PM", consultationType: "Online", gender: "Male", rating: 4.4 },
    { name: "Dr. P.V. Raghava Sarma", specialty: "Cardiologist", experience: 30, hospital: "Lalitha Super Speciality Hospitals", surgeries: "Founder, HOD & Senior Consultant", mainDealing: "Interventional Cardiology, Structural Heart Disease.", avatar: "https://picsum.photos/seed/lalitha1/100/100", dataAiHint: "senior male doctor", opFee: 1200, availability: "Mon - Sat, 10 AM - 5 PM", consultationType: "Offline", gender: "Male", rating: 4.9 },
    { name: "Dr. G. Deepthi", specialty: "Cardiologist", experience: 10, hospital: "Lalitha Super Speciality Hospitals", surgeries: "Senior Resident/Consultant", mainDealing: "Echocardiography, Heart Failure.", avatar: "https://picsum.photos/seed/lalitha2/100/100", dataAiHint: "female doctor professional", opFee: 900, availability: "Mon - Sat, 9 AM - 4 PM", consultationType: "Offline", gender: "Female", rating: 4.8 },
    { name: "Dr. K. Phani", specialty: "Cardiologist", experience: 8, hospital: "Lalitha Super Speciality Hospitals", surgeries: "MD, DM Cardiology", mainDealing: "General Cardiology", avatar: "https://picsum.photos/seed/lalitha3/100/100", dataAiHint: "male doctor friendly", opFee: 800, availability: "By Appointment", consultationType: "Offline", gender: "Male", rating: 4.7 },
    { name: "Dr. P. Vijaya", specialty: "Neurologist", experience: 28, hospital: "Lalitha Super Speciality Hospitals", surgeries: "Founder, HOD & Chief Neurologist/Stroke Specialist", mainDealing: "Stroke Management, Epilepsy, Movement Disorders.", avatar: "https://picsum.photos/seed/lalitha4/100/100", dataAiHint: "senior female doctor", opFee: 1100, availability: "Mon - Fri, 10 AM - 4 PM", consultationType: "Offline", gender: "Female", rating: 4.9 },
    { name: "Dr. I. Maruthi Prasad", specialty: "Cardiothoracic & Vascular Surgeon", experience: 20, hospital: "Lalitha Super Speciality Hospitals", surgeries: "M.S., M.Ch (CTVS), Bypass, Thoracic and Vascular Surgeon", mainDealing: "Bypass Surgery, Valve Repair, Vascular Surgery.", avatar: "https://picsum.photos/seed/lalitha5/100/100", dataAiHint: "male surgeon", opFee: 1500, availability: "By Appointment", consultationType: "Offline", gender: "Male", rating: 4.8 },
    { name: "Dr. N. Srinivasa Rao", specialty: "Neurosurgeon", experience: 22, hospital: "Lalitha Super Speciality Hospitals", surgeries: "M.S., M.Ch (Neurosurgeon)", mainDealing: "Brain Tumors, Spine Surgery, Trauma.", avatar: "https://picsum.photos/seed/lalitha6/100/100", dataAiHint: "experienced male surgeon", opFee: 1400, availability: "Mon, Wed, Fri, 11 AM - 3 PM", consultationType: "Offline", gender: "Male", rating: 4.8 },
    { name: "Dr. S. Uma Shanker", specialty: "General & Laparoscopic Surgeon", experience: 18, hospital: "Lalitha Super Speciality Hospitals", surgeries: "DNB., MRCS., FAIS., FHPB. (HOD)", mainDealing: "Laparoscopic Procedures, Hernia, Gallbladder.", avatar: "https://picsum.photos/seed/lalitha7/100/100", dataAiHint: "male surgeon smiling", opFee: 950, availability: "Mon - Sat, 10 AM - 5 PM", consultationType: "Offline", gender: "Male", rating: 4.7 },
    { name: "Dr. N.V. Siva Rama Krishna", specialty: "Orthopedic Surgeon", experience: 25, hospital: "Lalitha Super Speciality Hospitals", surgeries: "M.S Ortho., Mch Ortho., FRNA (Joint replacement, Spine & Trauma Surgeon)", mainDealing: "Joint Replacement, Spine Surgery, Trauma.", avatar: "https://picsum.photos/seed/lalitha8/100/100", dataAiHint: "orthopedic surgeon", opFee: 1000, availability: "Tue, Thu, Sat, 9 AM - 2 PM", consultationType: "Offline", gender: "Male", rating: 4.9 },
    { name: "Dr. N. Praveen", specialty: "Nephrologist", experience: 15, hospital: "Lalitha Super Speciality Hospitals", surgeries: "MD., DM (Nephrologist)", mainDealing: "Kidney Disease, Dialysis, Transplant Nephrology.", avatar: "https://picsum.photos/seed/lalitha9/100/100", dataAiHint: "male doctor portrait", opFee: 900, availability: "Mon - Fri, 2 PM - 6 PM", consultationType: "Offline", gender: "Male", rating: 4.6 },
    { name: "Dr. S. Lakshmi Kumari", specialty: "Pulmonologist", experience: 12, hospital: "Lalitha Super Speciality Hospitals", surgeries: "MD (Pulmonologist)", mainDealing: "Asthma, COPD, Sleep Apnea.", avatar: "https://picsum.photos/seed/lalitha10/100/100", dataAiHint: "female doctor thoughtful", opFee: 850, availability: "Mon - Sat, 10 AM - 1 PM", consultationType: "Offline", gender: "Female", rating: 4.7 },
    { name: "Dr. P. Saravana Kumar", specialty: "Urologist", experience: 14, hospital: "Lalitha Super Speciality Hospitals", surgeries: "MBBS, MS, M Ch (Urology)", mainDealing: "Kidney Stones, Prostate Issues, Uro-oncology.", avatar: "https://picsum.photos/seed/lalitha11/100/100", dataAiHint: "male urologist", opFee: 950, availability: "Tue, Thu, 10 AM - 3 PM", consultationType: "Offline", gender: "Male", rating: 4.6 },
    { name: "Dr. P. Sirisha", specialty: "Gynaecologist", experience: 16, hospital: "Lalitha Super Speciality Hospitals", surgeries: "MS., OBG., MRCP (Gynaecologist)", mainDealing: "Obstetrics, Gynaecology, Laparoscopic Surgery.", avatar: "https://picsum.photos/seed/lalitha12/100/100", dataAiHint: "female gynaecologist", opFee: 800, availability: "Mon - Sat, 9 AM - 5 PM", consultationType: "Both", gender: "Female", rating: 4.8 },
    { name: "Dr. Sravani", specialty: "Ophthalmologist", experience: 7, hospital: "Lalitha Super Speciality Hospitals", surgeries: "DNB (Ophthalmologist)", mainDealing: "Cataract, Refractive Surgery.", avatar: "https://picsum.photos/seed/lalitha13/100/100", dataAiHint: "female ophthalmologist", opFee: 700, availability: "Mon, Wed, Fri, 10 AM - 2 PM", consultationType: "Offline", gender: "Female", rating: 4.5 },
];

const departments = [
    { value: "Cardiologist", label: "Cardiology", telugu: "కార్డియాలజీ", Icon: HeartPulse },
    { value: "Orthopedic Surgeon", label: "Orthopedics", telugu: "ఆర్థోపెడిక్స్", Icon: Bone },
    { value: "Orthopaedics", label: "Orthopedics", telugu: "ఆర్థోపెడిక్స్", Icon: Bone },
    { value: "Neurologist", label: "Neurology", telugu: "న్యూరాలజీ", Icon: Brain },
    { value: "Gynaecologist", label: "Gynaecology", telugu: "గైనకాలజీ", Icon: HeartHandshake },
    { value: "Pediatrician", label: "Pediatrics", telugu: "పీడియాట్రిక్స్", Icon: Baby },
    { value: "Dermatologist", label: "Dermatology", telugu: "డెర్మటాలజీ", Icon: Bot },
    { value: "Implantologist & Laser Specialist", label: "Dental", telugu: "డెంటల్", Icon: ToothIcon },
    { value: "General Physician", label: "General", telugu: "జనరల్", Icon: User },
    { value: "Gastroenterologist", label: "Gastro", telugu: "గ్యాస్ట్రో", Icon: Leaf },
    { value: "Nephrologist", label: "Nephrology", telugu: "నెఫ్రాలజీ", Icon: Shield },
    { value: "Urologist", label: "Urology", telugu: "యూరాలజీ", Icon: Droplets },
    { value: "Intensivist", label: "Intensive Care", telugu: "ఇంటెన్సివ్ కేర్", Icon: StethoscopeIcon },
    { value: "General Surgeon", label: "Surgery", telugu: "సర్జరీ", Icon: Briefcase },
    { value: "Cardiothoracic & Vascular Surgeon", label: "CTVS", telugu: "సిటివిఎస్", Icon: HeartPulse },
    { value: "Neurosurgeon", label: "Neuro Surgery", telugu: "న్యూరో సర్జరీ", Icon: Brain },
    { value: "General & Laparoscopic Surgeon", label: "Laparoscopic Surgery", telugu: "లాపరోస్కోపిక్ సర్జరీ", Icon: Briefcase },
    { value: "Pulmonologist", label: "Pulmonology", telugu: "పల్మోనాలజీ", Icon: Wind },
    { value: "Ophthalmologist", label: "Ophthalmology", telugu: "ఆప్తాల్మాలజీ", Icon: Eye },
];

const uniqueDepartments = Array.from(new Map(departments.map(item => [item.label, item])).values());

const hospitals = [
    "all",
    ...Object.keys(hospitalsData),
];


const getReportStatusBadge = (status: string) => {
    switch (status) {
        case 'Abnormal': return 'destructive';
        case 'Normal': return 'default';
        default: return 'secondary';
    }
};

function UploadDialog({ onUpload, trigger, appointmentId, prescriptionId }: { onUpload: (appointmentId: number, prescriptionId: number, newImage: { url: string; dataAiHint: string }, labName: string, reportDate: Date) => void, trigger: React.ReactNode, appointmentId: number, prescriptionId: number }) {
    const [fileName, setFileName] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [labName, setLabName] = useState('');
    const [reportDate, setReportDate] = useState<Date | undefined>();


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFileName(event.target.files[0].name);
        }
    };

    const handleUpload = () => {
        if (!reportDate) return;
        setIsUploading(true);
        setTimeout(() => {
            const newImage = {
                url: `https://picsum.photos/seed/newrx${Date.now()}/800/1100`,
                dataAiHint: 'medical prescription document',
            };
            onUpload(appointmentId, prescriptionId, newImage, labName, reportDate);
            setIsUploading(false);
            setFileName('');
            setLabName('');
            setReportDate(undefined);
            setIsDialogOpen(false); 
        }, 1500);
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild onClick={(e) => { e.stopPropagation(); setIsDialogOpen(true); }}>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Prescription or Report</DialogTitle>
                    <DialogDescription>
                        Upload a photo or PDF of your paper document. Add the lab name and date.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="lab-name">Lab/Clinic Name</Label>
                        <Input id="lab-name" value={labName} onChange={(e) => setLabName(e.target.value)} placeholder="e.g., Yoda Diagnostics" />
                    </div>
                     <div className="space-y-2">
                        <Label>Report Date</Label>
                         <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                "w-full justify-start text-left font-normal",
                                !reportDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {reportDate ? format(reportDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                                mode="single"
                                selected={reportDate}
                                onSelect={setReportDate}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="prescription-file">File</Label>
                        <div className="flex items-center gap-2">
                            <Button asChild variant="outline">
                                <label htmlFor={`file-upload-${appointmentId}-${prescriptionId}`} className="cursor-pointer">
                                    <Upload className="mr-2 h-4 w-4" />
                                    {fileName || 'Choose File'}
                                </label>
                            </Button>
                            <input id={`file-upload-${appointmentId}-${prescriptionId}`} type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf" />
                        </div>
                        {fileName && <p className="text-xs text-muted-foreground mt-1">Selected: {fileName}</p>}
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleUpload} disabled={!fileName || !reportDate || !labName || isUploading} className="w-full" style={{ backgroundColor: 'hsl(var(--nav-chat))' }}>
                        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        {isUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
function ReportAnalysisDialog({ report, trigger, children }: { report: any, trigger?: React.ReactNode, children?: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<ReportAnalysisOutput | null>(null);
    const [isPending, startTransition] = useTransition();
    const [reportContent, setReportContent] = useState('');

    const handleOpen = () => {
        const data = dummyReportData[`${report.name}-${report.date}`] || { content: "No content to analyze." };
        setReportContent(data.content);
        setAnalysisResult(null);
        setIsOpen(true);
    };

    const handleRunAnalysis = () => {
        if (!reportContent) return;

        startTransition(async () => {
            const result = await analyzeReport({ reportContent });
            setAnalysisResult(result);
        });
    };
    
    const handleDownloadSummary = () => {
        alert("Downloading AI Summary as PDF...");
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild onClick={(e) => { e.stopPropagation(); handleOpen(); }}>
                {trigger || children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-primary" style={{ color: 'hsl(var(--nav-chat))' }}><Sparkles /> AI Report Analysis</DialogTitle>
                    <DialogDescription>Analyzing: {report.name} from {format(new Date(report.date), 'dd-MMM-yyyy')}</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-4">
                        <h3 className="font-semibold">Original Report Content</h3>
                        <Textarea
                            className="h-96 font-mono text-xs"
                            value={reportContent}
                            onChange={(e) => setReportContent(e.target.value)}
                        />
                        <Button onClick={handleRunAnalysis} disabled={isPending || !reportContent} className="w-full" style={{ backgroundColor: 'hsl(var(--nav-chat))' }}>
                            {isPending ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                            ) : "Run AI Analysis"}
                        </Button>
                    </div>
                    <div className="space-y-4 relative">
                        <h3 className="font-semibold">AI Summary & Findings</h3>
                        {isPending && (
                            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
                                <Loader2 className="h-10 w-10 animate-spin text-primary" style={{ color: 'hsl(var(--nav-chat))' }} />
                                <p className="mt-4 text-muted-foreground">The AI is analyzing your report...</p>
                            </div>
                        )}
                        {analysisResult ? (
                            <div className="space-y-4">
                                <Card>
                                    <CardHeader className="pb-2"><CardTitle className="text-lg">Summary</CardTitle></CardHeader>
                                    <CardContent><p className="text-sm text-muted-foreground">{analysisResult.summary}</p></CardContent>
                                </Card>
                                {analysisResult.abnormalities.length > 0 ? (
                                    <Card>
                                        <CardHeader className="pb-2"><CardTitle className="text-lg">Abnormal Findings</CardTitle></CardHeader>
                                        <CardContent className="space-y-3">
                                            {analysisResult.abnormalities.map((item, index) => (
                                                <div key={index} className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
                                                    <div className="flex justify-between font-bold"><p>{item.item}</p><p>{item.result}</p></div>
                                                    <p className="text-xs text-muted-foreground">Normal Range: {item.normalRange}</p>
                                                    <p className="text-sm mt-2">{item.explanation}</p>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Card>
                                        <CardContent className="p-4 text-center">
                                            <p className="font-semibold text-green-600">No major abnormalities were found in this report.</p>
                                        </CardContent>
                                    </Card>
                                )}
                                <DialogFooter>
                                    <Button onClick={handleDownloadSummary} variant="outline">
                                        <Download className="mr-2 h-4 w-4" /> Download AI Summary (PDF)
                                    </Button>
                                </DialogFooter>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-96 rounded-lg bg-muted/50 border border-dashed">
                                <p className="text-muted-foreground">AI analysis results will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function ViewReportDialog({ report, trigger, children }: { report: any; trigger?: React.ReactNode; children?: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}>
                {trigger || children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>View Report: {report.name}</DialogTitle>
                    <DialogDescription>
                        From {report.labName} on {format(new Date(report.date), 'dd-MMM-yyyy')}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
                    {report.reportImage ? (
                         <div className="bg-muted/30 p-2 rounded-lg">
                             <Image
                                src={report.reportImage.url}
                                alt={`Report for ${report.name}`}
                                width={800}
                                height={1100}
                                data-ai-hint={report.reportImage.dataAiHint}
                                className="rounded-md border w-full h-auto object-contain"
                            />
                         </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                            <p className="text-muted-foreground">No image available for this report.</p>
                        </div>
                    )}
                </div>
                <DialogFooter className="pt-4 border-t flex-col sm:flex-row gap-2">
                    <ReportAnalysisDialog report={report}>
                        <Button variant="outline" className="w-full sm:w-auto border-primary/50 text-primary hover:text-primary hover:bg-primary/10">
                            <Sparkles className="mr-2 h-4 w-4" /> AI Analysis
                        </Button>
                    </ReportAnalysisDialog>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full sm:w-auto border"><Download className="mr-2 h-4 w-4" />Download</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xs">
                           <DialogHeader>
                                <DialogTitle>Download Report</DialogTitle>
                                <DialogDescription>Choose a format to download.</DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-2">
                                <Button style={{ backgroundColor: 'hsl(var(--nav-chat))' }}><FileIcon className="mr-2 h-4 w-4" /> PDF</Button>
                                <Button variant="secondary"><ImageIcon className="mr-2 h-4 w-4" /> Image</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function FollowUpForm({ onSave, onCancel, appointmentId, existingFollowUp, problemName }: { onSave: (apptId: number, followUp: any) => void; onCancel: () => void; appointmentId?: number; existingFollowUp?: any, problemName?: string }) {
    const { toast } = useToast();
    const [title, setTitle] = useState(existingFollowUp?.title || problemName ? 'Initial Diagnosis' : '');
    const [doctor, setDoctor] = useState(existingFollowUp?.doctor || '');
    const [date, setDate] = useState(existingFollowUp?.date || '');
    const [status, setStatus] = useState(existingFollowUp?.status || 'Active');
    const [summary, setSummary] = useState(existingFollowUp?.summary || '');
    const [medicines, setMedicines] = useState(existingFollowUp?.medicines?.join(', ') || '');
    const [problem, setProblem] = useState(problemName || '');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newFollowUp = {
            problem: problem,
            specialty: existingFollowUp?.specialty || '', // Needs to be handled better
            initialDoctor: doctor,
            date: format(new Date(), 'yyyy-MM-dd'),
            prescriptions: [{
                title,
                doctor,
                date: date || format(new Date(), 'MMM d, yyyy'),
                status,
                summary,
                medicines: medicines.split(',').map(m => m.trim()).filter(m => m),
                prescriptionImages: existingFollowUp?.prescriptionImages || [],
                details: existingFollowUp?.details || [],
            }],
        };
        onSave(appointmentId !== undefined ? appointmentId : -1, newFollowUp); // -1 for new
        toast({
            title: `History ${existingFollowUp ? 'Updated' : 'Created'}`,
            description: "Your changes have been saved successfully.",
        });
        onCancel();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             {!problemName && (
                 <div className="space-y-2">
                    <Label htmlFor="fu-problem">Health Problem</Label>
                    <Input id="fu-problem" value={problem} onChange={e => setProblem(e.target.value)} placeholder="e.g., Typhoid Fever" required />
                </div>
            )}
            <div className="space-y-2">
                <Label htmlFor="fu-title">Visit Title</Label>
                <Input id="fu-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Initial Diagnosis or 2nd Follow-up" required />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="fu-doctor">Doctor</Label>
                    <Input id="fu-doctor" value={doctor} onChange={e => setDoctor(e.target.value)} placeholder="e.g., Dr. Anjali" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="fu-date">Date Range</Label>
                    <Input id="fu-date" value={date} onChange={e => setDate(e.target.value)} placeholder="e.g., Aug 8, 2024 - Aug 15, 2024" required />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="fu-status">Status</Label>
                 <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="fu-status">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Improved">Improved</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Action Required">Action Required</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="fu-summary">Summary</Label>
                <Textarea id="fu-summary" value={summary} onChange={e => setSummary(e.target.value)} placeholder="Enter a brief summary of the consultation." />
            </div>
             <div className="space-y-2">
                <Label htmlFor="fu-medicines">Medicines (comma-separated)</Label>
                <Input id="fu-medicines" value={medicines} onChange={e => setMedicines(e.target.value)} placeholder="e.g., Paracetamol, Cetirizine" />
            </div>
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                <Button type="submit" style={{ backgroundColor: 'hsl(var(--nav-appointments))' }}>Save Changes</Button>
            </DialogFooter>
        </form>
    );
}

type Slot = {
  time: string;
  traffic: "Available" | "Busy" | "Full";
};

function TimeSlotSelector({
  slots,
  selectedTime,
  onSelectTime,
  title,
  icon: Icon,
}: {
  slots: Slot[];
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  title: string;
  icon: React.ElementType;
}) {

  const getTrafficClasses = (traffic: Slot['traffic']) => {
    switch (traffic) {
      case "Available":
        return "text-green-600";
      case "Busy":
        return "text-orange-500";
      case "Full":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </h4>
        <p className="text-xs text-muted-foreground">{slots.length} SLOTS</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {slots.map((slot) => (
          <div key={slot.time} className="flex flex-col items-center">
            <Button
              variant={selectedTime === slot.time ? "default" : "outline"}
              className={cn(
                "font-semibold w-full",
                selectedTime === slot.time && "text-primary-foreground",
                slot.traffic === "Full" && "bg-destructive/10 border-destructive/30 text-destructive/70 cursor-not-allowed hover:bg-destructive/20"
              )}
              style={selectedTime === slot.time ? { backgroundColor: 'hsl(var(--nav-appointments))' } : {}}
              onClick={() => onSelectTime(slot.time)}
              disabled={slot.traffic === "Full"}
            >
              {slot.time}
            </Button>
            <span className={cn("text-xs font-semibold mt-1", getTrafficClasses(slot.traffic))}>
              {slot.traffic}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const DateSelector = ({ selectedDate, onSelectDate }: { selectedDate: Date, onSelectDate: (date: Date) => void }) => {
    const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

    return (
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {dates.map(date => (
                <button 
                    key={date.toISOString()}
                    onClick={() => onSelectDate(date)}
                    className={cn(
                        "flex flex-col items-center justify-center p-2 rounded-lg border",
                        format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                            ? "bg-primary/10"
                            : "border-transparent hover:bg-muted"
                    )}
                    style={format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') ? { borderColor: 'hsl(var(--nav-appointments))' } : {}}
                >
                    <span className="text-xs font-bold uppercase">{format(date, 'EEE')}</span>
                    <span className="text-lg font-extrabold">{format(date, 'dd')}</span>
                    <span className="text-xs font-bold uppercase">{format(date, 'MMM')}</span>
                </button>
            ))}
        </div>
    );
};

function BookingDialog({ open, onOpenChange, doctor, onBookingComplete, existingProblems }: { open: boolean, onOpenChange: (open: boolean) => void, doctor: any | null, onBookingComplete: (details: any) => void, existingProblems: string[] }) {
    const [step, setStep] = useState(1);
    const [consultationType, setConsultationType] = useState<'Online' | 'Offline' | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'Online' | 'Offline' | null>(null);
    const [selectedDate, setSelectedDate] = useState(addDays(new Date(), 1));
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [visitReason, setVisitReason] = useState('');
    const [selectedExistingProblem, setSelectedExistingProblem] = useState('');
    
    const router = useRouter();

    const afternoonSlots: Slot[] = [
      { time: "12:00 PM", traffic: "Available" },
      { time: "12:10 PM", traffic: "Available" },
      { time: "12:20 PM", traffic: "Busy" },
      { time: "12:30 PM", traffic: "Busy" },
      { time: "12:40 PM", traffic: "Full" },
    ];

    const eveningSlots: Slot[] = [
      { time: "03:00 PM", traffic: "Available" },
      { time: "03:10 PM", traffic: "Available" },
      { time: "03:20 PM", traffic: "Available" },
      { time: "03:30 PM", traffic: "Busy" },
      { time: "03:40 PM", traffic: "Busy" },
      { time: "03:50 PM", traffic: "Full" },
    ];


    const handleContinue = () => {
        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };
    
    const handlePay = () => {
        const finalReason = selectedExistingProblem || visitReason;
        const isFollowUp = !!selectedExistingProblem;
        
        let finalTime = selectedTime;
        const selectedSlot = [...afternoonSlots, ...eveningSlots].find(s => s.time === selectedTime);

        if (selectedSlot && (selectedSlot.traffic === 'Busy' || selectedSlot.traffic === 'Full')) {
            alert(`The selected time ${selectedTime} is busy. We will book the next available slot for you, which might be around 5-10 minutes later.`);
            // In a real app, you'd find the next "Available" slot. Here we'll just simulate.
            const allSlots = [...afternoonSlots, ...eveningSlots];
            const currentIndex = allSlots.findIndex(s => s.time === selectedTime);
            const nextAvailable = allSlots.find((s, i) => i > currentIndex && s.traffic === 'Available');
            finalTime = nextAvailable ? nextAvailable.time : selectedTime; // Fallback to original time if no next available
        }


        onBookingComplete({
            doctor,
            date: selectedDate,
            time: finalTime,
            reason: finalReason,
            isFollowUp,
            consultationType,
        });

        const queryParams = new URLSearchParams({
            doctorName: doctor.name,
            hospital: doctor.hospital,
            specialty: doctor.specialty,
            avatar: doctor.avatar,
            dataAiHint: doctor.dataAiHint,
            reason: finalReason,
            consultationType: consultationType || '',
        });

        if (consultationType === 'Online') {
            router.push(`/opd-queue?${queryParams.toString()}&tab=video-call`);
        } else {
            router.push(`/opd-queue?${queryParams.toString()}&tab=opd-status`);
        }
        onOpenChange(false);
    };
    
    useEffect(() => {
        if (open) {
            // Pre-select consultation type if doctor only offers one
            if (doctor?.consultationType === 'Online' || doctor?.consultationType === 'Offline') {
                setConsultationType(doctor.consultationType);
                setStep(2); // Skip step 1
            } else {
                setStep(1);
            }
            setPaymentMethod(null);
            setSelectedTime(null);
            setSelectedDate(addDays(new Date(), 1));
            setVisitReason('');
            setSelectedExistingProblem('');
        }
    }, [open, doctor]);

    if (!doctor) return null;

    const bookingCharge = doctor.opFee * 0.05;
    const gst = bookingCharge * 0.18;
    const totalPaid = doctor.opFee + bookingCharge + gst;
    
    const getDialogTitle = () => {
        switch (step) {
            case 1: return 'Consultation Type';
            case 2: return 'Reason for Visit';
            case 3: return 'Select Time';
            case 4: return 'Payment Summary';
            case 5: return 'Payment Options';
            default: return '';
        }
    };

    const canContinueToReason = step === 1 && consultationType !== null;
    const canContinueToTime = step === 2 && (visitReason !== '' || selectedExistingProblem !== '');
    const canContinueToPayment = step === 3 && selectedTime !== null;
    const canPay = step === 4 && (paymentMethod !== null || consultationType === 'Offline');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 flex flex-col h-auto max-h-[90vh]">
                <DialogHeader className="p-4 border-b flex flex-row items-center space-y-0">
                    {step > 1 && (
                        <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2 h-8 w-8">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    )}
                    <DialogTitle className={cn("text-xl", step > 1 && "flex-1 text-center")}>
                        {getDialogTitle()}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto">
                    {step === 1 && (
                        <div className="p-4 space-y-4">
                            <h3 className="text-center font-semibold">How would you like to consult?</h3>
                            <Card className={cn("cursor-pointer border-2", consultationType === "Online" ? "border-primary" : "border-black/20 dark:border-white/20")} onClick={() => setConsultationType("Online")} style={{borderColor: consultationType === 'Online' ? 'hsl(var(--nav-appointments))' : ''}}>
                                <CardContent className="p-4 flex items-center gap-4">
                                    <Video className="h-8 w-8 text-primary" style={{color: 'hsl(var(--nav-appointments))'}} />
                                    <div>
                                        <p className="font-bold text-lg">Online Video Call</p>
                                        <p className="text-sm text-muted-foreground">Consult from anywhere</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className={cn("cursor-pointer border-2", consultationType === "Offline" ? "border-primary" : "border-black/20 dark:border-white/20")} onClick={() => setConsultationType("Offline")} style={{borderColor: consultationType === 'Offline' ? 'hsl(var(--nav-appointments))' : ''}}>
                                <CardContent className="p-4 flex items-center gap-4">
                                    <Hospital className="h-8 w-8 text-primary" style={{color: 'hsl(var(--nav-appointments))'}} />
                                    <div>
                                        <p className="font-bold text-lg">In-person Hospital Visit</p>
                                        <p className="text-sm text-muted-foreground">Visit the doctor at the clinic</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                     {step === 2 && (
                        <div className="p-4 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-problem" className="text-xl font-bold text-foreground">New Problem / Symptoms</Label>
                                <Input
                                    id="new-problem"
                                    placeholder="e.g., 'Fever and headache'"
                                    value={visitReason}
                                    onChange={(e) => { setVisitReason(e.target.value); setSelectedExistingProblem(''); }}
                                    className="h-12 text-base border-2 border-black/20 dark:border-white/20"
                                />
                            </div>
                            <div className="flex items-center">
                                <Separator className="flex-1" />
                                <span className="px-2 text-sm text-muted-foreground">OR</span>
                                <Separator className="flex-1" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xl font-bold text-foreground">Follow-up for Existing Problem</Label>
                                <RadioGroup value={selectedExistingProblem} onValueChange={(val) => { setSelectedExistingProblem(val); setVisitReason(''); }}>
                                    {existingProblems.map(problem => (
                                        <div key={problem} className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted border-2 border-black/20 dark:border-white/20 bg-background">
                                            <RadioGroupItem value={problem} id={problem} />
                                            <Label htmlFor={problem} className="font-bold text-lg text-foreground">{problem}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        </div>
                    )}
                    {step === 3 && (
                         <div className="p-4 space-y-6">
                            <Card className="border-2 border-black/20 dark:border-white/20">
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold">Consultation Fee</h3>
                                        <p className="text-sm text-muted-foreground">For a 15-minute slot</p>
                                    </div>
                                    <p className="text-2xl font-bold" style={{color: 'hsl(var(--nav-appointments))'}}>₹{doctor.opFee}</p>
                                </CardContent>
                            </Card>
                            
                            <DateSelector selectedDate={selectedDate} onSelectDate={setSelectedDate} />
                            
                            <TimeSlotSelector 
                                title="Afternoon"
                                icon={Sun}
                                slots={afternoonSlots}
                                selectedTime={selectedTime}
                                onSelectTime={setSelectedTime}
                            />

                            <TimeSlotSelector 
                                title="Evening"
                                icon={Moon}
                                slots={eveningSlots}
                                selectedTime={selectedTime}
                                onSelectTime={setSelectedTime}
                            />

                            <p className="text-xs text-center text-muted-foreground pt-2">*Includes a free chat follow-up for 3 days post-consultation.</p>
                        </div>
                    )}
                    {step === 4 && (
                        <div className="p-4 space-y-4">
                            <Card className="border-2 border-black/20 dark:border-white/20">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">Payment Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <p className="text-muted-foreground">Consultation Fee</p>
                                        <p className="font-medium">₹{doctor.opFee.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-muted-foreground">Booking Charge (incl. GST)</p>
                                        <p className="font-medium">₹{(bookingCharge + gst).toFixed(2)}</p>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-bold text-base">
                                        <p>To be paid</p>
                                        <p>₹{totalPaid.toFixed(2)}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            
                             <Card className="border-2 border-black/20 dark:border-white/20">
                                <CardHeader className="flex-row justify-between items-center pb-2">
                                    <CardTitle className="text-base">Your Details</CardTitle>
                                    <Button variant="link" className="p-0 h-auto text-sm">Edit</Button>
                                </CardHeader>
                                <CardContent className="text-sm space-y-1">
                                    <p className="font-semibold flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" />Chinta Lokesh Babu</p>
                                    <p className="text-muted-foreground flex items-center gap-2"><Phone className="h-4 w-4" />+91 8008334948</p>
                                </CardContent>
                            </Card>

                            <h3 className="font-bold text-lg">Payment Method</h3>
                             {consultationType === 'Offline' && (
                                <Card className={cn("cursor-pointer border-2", paymentMethod === 'Offline' ? 'border-primary' : 'border-black/20 dark:border-white/20')} onClick={() => setPaymentMethod('Offline')} style={{borderColor: paymentMethod === 'Offline' ? 'hsl(var(--nav-appointments))' : ''}}>
                                    <CardContent className="p-4 flex items-center gap-3">
                                        <Landmark className="h-6 w-6 text-muted-foreground" />
                                        <div>
                                            <p className="font-bold">Pay at Hospital</p>
                                            <p className="text-sm text-muted-foreground">Pay directly at the hospital counter</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                             <Card className={cn("cursor-pointer border-2", paymentMethod === 'Online' ? 'border-primary' : 'border-black/20 dark:border-white/20')} onClick={() => setStep(5)} style={{borderColor: paymentMethod === 'Online' ? 'hsl(var(--nav-appointments))' : ''}}>
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="h-6 w-6 text-muted-foreground" />
                                        <div>
                                            <p className="font-bold">Pay Online</p>
                                            <p className="text-sm text-muted-foreground">UPI, Credit/Debit Card</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                </CardContent>
                            </Card>

                         </div>
                    )}
                     {step === 5 && (
                        <div className='p-4 space-y-6'>
                             <p className="font-bold text-center -mb-2">₹{totalPaid.toFixed(2)}</p>
                             <div>
                                <h3 className='font-bold text-lg mb-2'>UPI Apps</h3>
                                <div className='space-y-1'>
                                    <Button variant="ghost" className='w-full justify-start h-14 border-2 border-black/20 dark:border-white/20' onClick={() => { setPaymentMethod('Online'); handlePay(); }}><Image src="https://picsum.photos/seed/gpay/40/40" alt="GPay" width={24} height={24} className='mr-4' data-ai-hint="google pay logo"/> Google Pay<ChevronRight className='ml-auto h-5 w-5 text-muted-foreground'/></Button>
                                    <Separator/>
                                    <Button variant="ghost" className='w-full justify-start h-14 border-2 border-black/20 dark:border-white/20' onClick={() => { setPaymentMethod('Online'); handlePay(); }}><Image src="https://picsum.photos/seed/phonepe/40/40" alt="PhonePe" width={24} height={24} className='mr-4' data-ai-hint="phonepe logo"/> PhonePe<ChevronRight className='ml-auto h-5 w-5 text-muted-foreground'/></Button>
                                </div>
                             </div>
                             <div>
                                <h3 className='font-bold text-lg mb-2'>Credit/Debit Cards</h3>
                                <div>
                                    <Button variant="ghost" className='w-full justify-start h-14 text-primary border-2 border-black/20 dark:border-white/20' style={{color: 'hsl(var(--nav-appointments))'}}>
                                        <PlusCircle className="mr-4 h-6 w-6"/> 
                                        <div>
                                            <p className='font-bold text-left'>Add New Card</p>
                                            <p className='text-xs text-muted-foreground font-normal'>Save and Pay via Cards</p>
                                        </div>
                                    </Button>
                                </div>
                             </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-4 border-t bg-background">
                    {step === 1 && <Button onClick={handleContinue} disabled={!canContinueToReason} className="w-full h-12 text-lg" style={{backgroundColor: 'hsl(var(--nav-appointments))'}}>Continue</Button>}
                    {step === 2 && <Button onClick={handleContinue} disabled={!canContinueToTime} className="w-full h-12 text-lg" style={{backgroundColor: 'hsl(var(--nav-appointments))'}}>Continue</Button>}
                    {step === 3 && <Button onClick={handleContinue} disabled={!canContinueToPayment} className="w-full h-12 text-lg" style={{backgroundColor: 'hsl(var(--nav-appointments))'}}>Continue</Button>}
                    {step === 4 && (
                        <div className="flex justify-between items-center w-full">
                            <div>
                                <p className="text-xl font-bold">₹{totalPaid.toFixed(2)}</p>
                                <button className="text-xs text-primary font-semibold" style={{color: 'hsl(var(--nav-appointments))'}} onClick={() => {}}>Payment method</button>
                            </div>
                            <Button className="h-12 px-6" style={{backgroundColor: 'hsl(var(--nav-appointments))'}} onClick={handlePay} disabled={paymentMethod !== 'Offline'}>
                                <div className="flex flex-col items-end -my-1">
                                    <span className="text-lg font-bold leading-tight">{paymentMethod === 'Offline' ? "Confirm Booking" : "Pay Now"}</span>
                                </div>
                                <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function HospitalInfoDialog({ hospitalName, children }: { hospitalName: string, children: React.ReactNode }) {
    const hospital = hospitalsData[hospitalName];
    if (!hospital) return <>{children}</>;

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md border-2 border-foreground">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{hospitalName}</DialogTitle>
                    <DialogDescription>{hospital.location}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground" /> 
                        <span className="text-muted-foreground">{hospital.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 flex-shrink-0 text-muted-foreground" /> 
                        <a href={`tel:${hospital.phone}`} className="text-blue-600 hover:underline">{hospital.phone}</a>
                    </div>
                    {hospital.hours && (
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 flex-shrink-0 text-muted-foreground" /> 
                            <span className="text-muted-foreground">{hospital.hours}</span>
                        </div>
                    )}
                     {hospital.website && (
                         <div className="flex items-center gap-2 text-sm">
                            <Globe className="h-4 w-4 flex-shrink-0 text-muted-foreground" /> 
                            <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                                Visit Website
                            </a>
                        </div>
                    )}
                </div>
                <DialogFooter className="grid grid-cols-2 gap-2">
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.address)}`} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button variant="outline" className="w-full border-2 border-foreground"><MapIcon className="mr-2 h-4 w-4"/> Directions</Button>
                    </a>
                     <a href={`tel:${hospital.phone}`} className="w-full">
                        <Button className="w-full bg-green-600 hover:bg-green-700"><Phone className="mr-2 h-4 w-4"/> Call Now</Button>
                    </a>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


function AppointmentsPageComponent() {
    const { language } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
        if (searchParams.get('action') === 'new-problem') {
            handleOpenForm(-1);
        }
    }, [searchParams]);
    
    const t = {
        en: {
            findDoctor: "Find a Doctor",
            history: "Appointments History",
            searchPlaceholder: "Doctor, hospital...",
            allHospitals: "All Hospitals",
            clear: "Clear",
            filters: "Filters",
            departments: "Departments",
            selectDepartment: "Select a department to find specialist doctors.",
            backToDepartments: "Back to Departments",
            noDoctorsFound: "No doctors found matching your criteria. Try broadening your search.",
            yearsExp: "years exp.",
            focus: "Focus:",
            surgeries: "Surgeries:",
            availability: "Availability:",
            viewProfile: "View Profile",
            book: "Book",
            historyTitle: "Appointments History",
            searchHistoryPlaceholder: "Search by name, problem...",
            allDoctors: "All Doctors",
            filterByDate: "Filter by date",
            clearFilters: "Clear Filters",
            allFollowUps: "All Follow-ups",
            addFollowUp: "Add Follow-up",
            addNewProblem: "Add New Health Problem",
            viewDetails: "View Details",
            upload: "Upload",
            edit: "Edit",
            delete: "Delete",
            areYouSure: "Are you sure?",
            deleteConfirmation: "This action cannot be undone. This will permanently delete the follow-up entry for \"{title}\".",
            cancel: "Cancel",
            noFollowUps: "No follow-ups recorded for this issue yet. Click \"Add Follow-up\" to start.",
            noAppointments: "No appointments match your filters.",
            copyDetails: "Copy Details",
            copying: "Copying...",
            bookAppointment: "Book Appointment",
            copiedToClipboard: "Copied to Clipboard",
            doctorDetailsCopied: "Doctor's details have been copied.",
            appointmentBooked: "Appointment Booked!",
            appointmentBookedDesc: "Your {consultationType} appointment for {reason} with {doctorName} on {date} at {time} is confirmed.",
        },
        te: {
            findDoctor: "డాక్టర్‌ను కనుగొనండి",
            history: "అపాయింట్‌మెంట్‌ల చరిత్ర",
            searchPlaceholder: "డాక్టర్, హాస్పిటల్...",
            allHospitals: "అన్ని ఆసుపత్రులు",
            clear: "క్లియర్",
            filters: "ఫిల్టర్లు",
            departments: "విభాగాలు",
            selectDepartment: "స్పెషలిస్ట్ డాక్టర్లను కనుగొనడానికి ఒక విభాగాన్ని ఎంచుకోండి.",
            backToDepartments: "విభాగాలకు తిరిగి వెళ్ళు",
            noDoctorsFound: "మీ ప్రమాణాలకు సరిపోయే డాక్టర్లు ఎవరూ కనుగొనబడలేదు. మీ శోధనను విస్తృతం చేయడానికి ప్రయత్నించండి.",
            yearsExp: "సంవత్సరాల అనుభవం",
            focus: "దృష్టి:",
            surgeries: "శస్త్రచికిత్సలు:",
            availability: "లభ్యత:",
            viewProfile: "ప్రొఫైల్ చూడండి",
            book: "బుక్ చేయండి",
            historyTitle: "అపాయింట్‌మెంట్‌ల చరిత్ర",
            searchHistoryPlaceholder: "పేరు, సమస్య ద్వారా శోధించండి...",
            allDoctors: "అందరూ డాక్టర్లు",
            filterByDate: "తేదీ వారీగా ఫిల్టర్ చేయండి",
            clearFilters: "ఫిల్టర్లను క్లియర్ చేయండి",
            allFollowUps: "అన్ని ఫాలో-అప్‌లు",
            addFollowUp: "ఫాలో-అప్ జోడించండి",
            addNewProblem: "కొత్త ఆరోగ్య సమస్యను జోడించండి",
            viewDetails: "వివరాలు చూడండి",
            upload: "అప్‌లోడ్ చేయండి",
            edit: "సవరించండి",
            delete: "తొలగించండి",
            areYouSure: "మీరు ఖచ్చితంగా ఉన్నారా?",
            deleteConfirmation: "ఈ చర్యను రద్దు చేయడం సాధ్యం కాదు. ఇది \"{title}\" కోసం ఫాలో-అప్ ఎంట్రీని శాశ్వతంగా తొలగిస్తుంది.",
            cancel: "రద్దు చేయండి",
            noFollowUps: "ఈ సమస్య కోసం ఇంకా ఫాలో-అప్‌లు నమోదు చేయబడలేదు. ప్రారంభించడానికి \"ఫాలో-అప్ జోడించండి\" క్లిక్ చేయండి.",
            noAppointments: "మీ ఫిల్టర్లకు సరిపోయే అపాయింట్‌మెంట్‌లు లేవు.",
            copyDetails: "వివరాలను కాపీ చేయండి",
            copying: "కాపీ చేస్తోంది...",
            bookAppointment: "అపాయింట్‌మెంట్ బుక్ చేయండి",
            copiedToClipboard: "క్లిప్‌బోర్డ్‌కు కాపీ చేయబడింది",
            doctorDetailsCopied: "డాక్టర్ వివరాలు కాపీ చేయబడ్డాయి.",
            appointmentBooked: "అపాయింట్‌మెంట్ బుక్ చేయబడింది!",
            appointmentBookedDesc: "{doctorName} తో మీ {consultationType} అపాయింట్‌మెంట్ {reason} కోసం {date} న {time} కి నిర్ధారించబడింది.",
        }
    }[language];


    const preselectedHospital = searchParams.get('hospital');
    const preselectedSpecialty = searchParams.get('specialty');
    
    const [doctors, setDoctors] = useState(initialDoctors);
    const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
    const [doctorForBooking, setDoctorForBooking] = useState<any | null>(null);
    const [isProfileOpen, setProfileOpen] = useState(false);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const { toast } = useToast();
    const [isSharing, setIsSharing] = useState(false);
    const { location } = useLocation();

    // Doctor filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedHospital, setSelectedHospital] = useState(preselectedHospital || 'all');
    
    const [filteredDoctors, setFilteredDoctors] = useState<typeof doctors>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(preselectedSpecialty || null);
    const [showSearchDialog, setShowSearchDialog] = useState(false);
    
    // History filters and state
    const [historySearchTerm, setHistorySearchTerm] = useState('');
    const [filterDoctor, setFilterDoctor] = useState('all');
    const [filterDate, setFilterDate] = useState<Date>();
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingFollowUp, setEditingFollowUp] = useState<{apptIndex: number, pIndex?: number, isNewProblem?: boolean} | null>(null);
    const [activeFilterCategory, setActiveFilterCategory] = useState('sort');
    
    const [appointments, setAppointments] = useState(() => 
        initialAppointmentsData.map(appt => ({
            ...appt,
            prescriptions: appt.prescriptions.map(p => ({
                ...p,
                prescriptionImages: Array.isArray(p.prescriptionImages) ? p.prescriptionImages : (p.prescriptionImage ? [{ url: p.prescriptionImage, dataAiHint: p.dataAiHint || 'medical prescription' }] : [])
            }))
        }))
    );

    // Actual filters applied to the doctor list
    const [sortOption, setSortOption] = useState('recommended');
    const [advancedFilters, setAdvancedFilters] = useState({
        consultationType: [] as string[],
        gender: [] as string[],
        availableToday: false,
    });
    
    const [isFilterOpen, setFilterOpen] = useState(false);
    
    useEffect(() => {
        if (preselectedHospital) {
            handleFilter('', 'recommended', { consultationType: [], gender: [], availableToday: false }, null, preselectedHospital);
        }
        if (preselectedSpecialty) {
            handleFilter('', 'recommended', { consultationType: [], gender: [], availableToday: false }, preselectedSpecialty, selectedHospital);
        }
    }, [preselectedHospital, preselectedSpecialty]);

    
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (sortOption !== 'recommended') count++;
        count += advancedFilters.consultationType.length;
        count += advancedFilters.gender.length;
        if (advancedFilters.availableToday) count++;
        return count;
    }, [sortOption, advancedFilters]);

     const handleSaveFollowUp = (apptIndex: number, followUp: any) => {
        if (apptIndex === -1) { // This is a new problem
            setAppointments(prev => [followUp, ...prev]);
        } else {
            setAppointments(prev => prev.map((appt, i) => {
                if (i === apptIndex) {
                    let newPrescriptions;
                    if(editingFollowUp && editingFollowUp.pIndex !== undefined) {
                        // Editing existing follow-up
                         newPrescriptions = appt.prescriptions.map((p, p_idx) => p_idx === editingFollowUp.pIndex ? followUp : p);
                    } else {
                        // Adding new follow-up to existing problem
                        newPrescriptions = [...appt.prescriptions, followUp];
                    }
                    return { ...appt, prescriptions: newPrescriptions };
                }
                return appt;
            }));
        }
    };
    
    const handleDeleteFollowUp = (apptIndex: number, pIndex: number) => {
        setAppointments(prev => prev.map((appt, i) => {
            if (i === apptIndex) {
                const newPrescriptions = appt.prescriptions.filter((_, p_idx) => p_idx !== pIndex);
                return { ...appt, prescriptions: newPrescriptions };
            }
            return appt;
        }));
        toast({ title: "Follow-up Deleted", description: "The entry has been removed from your history." });
    };

    const handleOpenForm = (apptIndex: number, pIndex?: number, isNewProblem = false) => {
        setEditingFollowUp({ apptIndex, pIndex, isNewProblem });
        setIsFormOpen(true);
    };

    const handleFilter = (query = searchQuery, newSort = sortOption, newAdvanced = advancedFilters, department = selectedDepartment, hospital = selectedHospital) => {
        const lowercasedQuery = query.toLowerCase();
        
        let doctorsToSort = initialDoctors.filter(doctor => {
            const nameMatch = doctor.name.toLowerCase().includes(lowercasedQuery);
            const specialtyMatch = doctor.specialty.toLowerCase().includes(lowercasedQuery);
            const hospitalMatch = doctor.hospital.toLowerCase().includes(lowercasedQuery);
            const searchMatch = nameMatch || hospitalMatch || specialtyMatch || lowercasedQuery === '';
            
            const hospitalFilterMatch = hospital === 'all' || doctor.hospital === hospital;
    
            const locationString = location.village || location.mandal || location.district;
            const hospitalDetails = hospitalsData[doctor.hospital];
            const locationMatch = !locationString || (hospitalDetails && hospitalDetails.location.toLowerCase() === locationString.toLowerCase());
    
            const consultationTypeMatch = newAdvanced.consultationType.length === 0 || newAdvanced.consultationType.includes(doctor.consultationType) || doctor.consultationType === 'Both';
            const genderMatch = newAdvanced.gender.length === 0 || newAdvanced.gender.includes(doctor.gender) || doctor.gender === 'Both';
            const availabilityMatch = !newAdvanced.availableToday || doctor.availability.includes(format(new Date(), 'EEE'));
            
            const departmentMatch = !department || doctor.specialty === department;

            return searchMatch && hospitalFilterMatch && locationMatch && consultationTypeMatch && genderMatch && availabilityMatch && departmentMatch;
        });
    
        switch (newSort) {
            case 'price_asc':
                doctorsToSort.sort((a, b) => a.opFee - b.opFee);
                break;
            case 'price_desc':
                doctorsToSort.sort((a, b) => b.opFee - a.opFee);
                break;
            case 'exp_desc':
                doctorsToSort.sort((a, b) => b.experience - a.experience);
                break;
            case 'rating_desc':
                 doctorsToSort.sort((a, b) => b.rating - a.rating);
                break;
            case 'recommended':
                 doctorsToSort.sort((a, b) => a.opFee - b.opFee);
                break;
            default:
                break;
        }
    
        setFilteredDoctors(doctorsToSort);
        if (department || query || hospital !== 'all') {
            setSelectedDepartment(department);
        }
    };

     useEffect(() => {
        handleFilter(searchQuery, sortOption, advancedFilters, selectedDepartment, selectedHospital);
    }, [sortOption, advancedFilters, selectedHospital, location, doctors]);


    const handleDepartmentSelect = (departmentValue: string) => {
        const newDepartment = departmentValue === 'all' ? null : departmentValue;
        setSelectedDepartment(newDepartment);
        handleFilter(searchQuery, sortOption, advancedFilters, newDepartment, selectedHospital);
    };

    const handleViewProfile = (doctor: any) => {
        setSelectedDoctor(doctor);
        setProfileOpen(true);
    };
    
    const handleShare = (doctor: any) => {
        setIsSharing(true);
        const hospital = hospitalsData[doctor.hospital as keyof typeof hospitalsData];
        const shareText = `Check out Dr. ${doctor.name}, ${doctor.specialty} at ${doctor.hospital}.\nAddress: ${hospital.address}\nContact: ${hospital.phone}`;
        navigator.clipboard.writeText(shareText);
        toast({
            title: t.copiedToClipboard,
            description: t.doctorDetailsCopied,
        });
        setTimeout(() => setIsSharing(false), 1000);
    };

    const handleBookAppointment = (doctor: any) => {
        setProfileOpen(false); // Close profile dialog if open
        setDoctorForBooking(doctor);
        setIsBookingOpen(true);
    };

     const handleBookingComplete = (details: any) => {
        toast({
            title: t.appointmentBooked,
            description: t.appointmentBookedDesc
                .replace('{consultationType}', details.consultationType)
                .replace('{reason}', details.reason)
                .replace('{doctorName}', details.doctor.name)
                .replace('{date}', details.date.toLocaleDateString())
                .replace('{time}', details.time)
        });

        if (details.isFollowUp) {
             setAppointments(prev => prev.map(appt => {
                if (appt.problem === details.reason) {
                    const newFollowUp = {
                        title: `${appt.prescriptions.length + 1}th Follow-up`,
                        status: 'Active',
                        date: format(details.date, 'MMM d, yyyy'),
                        doctor: details.doctor.name,
                        summary: `Booked a new ${details.consultationType} consultation.`,
                        medicines: [],
                        prescriptionImages: [],
                        details: []
                    };
                    return { ...appt, prescriptions: [...appt.prescriptions, newFollowUp] };
                }
                return appt;
            }));
        } else {
            const newAppointment = {
                problem: details.reason,
                specialty: details.doctor.specialty,
                date: format(new Date(), "yyyy-MM-dd"),
                initialDoctor: details.doctor.name,
                prescriptions: [
                     {
                        title: "1st Follow-up (Consultation Booked)",
                        status: "Active",
                        date: format(details.date, 'MMM d, yyyy'),
                        doctor: details.doctor.name,
                        summary: `Initial ${details.consultationType} consultation booked for "${details.reason}".`,
                        medicines: [],
                        prescriptionImages: [],
                        details: [],
                    }
                ]
            };
            setAppointments(prev => [newAppointment, ...prev]);
        }
    };

    const allDoctors = useMemo(() => {
        const doctors = new Set<string>();
        appointments.forEach(appt => {
            doctors.add(appt.initialDoctor);
            appt.prescriptions.forEach(p => doctors.add(p.doctor));
        });
        return ['all', ...Array.from(doctors)];
    }, [appointments]);

    const filteredAppointments = useMemo(() => {
        return appointments.filter((appt) => {
            if (!isClient) return false;
            const doctorMatch = filterDoctor === 'all' || appt.initialDoctor === filterDoctor || appt.prescriptions.some(p => p.doctor === filterDoctor);
            const dateMatch = !filterDate || new Date(appt.date).toDateString() === filterDate.toDateString();
    
            if (!historySearchTerm) {
                return doctorMatch && dateMatch;
            }
    
            const lowercasedSearchTerm = historySearchTerm.toLowerCase();
            
            const baseIndex = appointments.indexOf(appt) + 1;
    
            const keywordMatch = (
                baseIndex.toString() === lowercasedSearchTerm ||
                appt.problem.toLowerCase().includes(lowercasedSearchTerm) ||
                appt.initialDoctor.toLowerCase().includes(lowercasedSearchTerm) ||
                appt.specialty.toLowerCase().includes(lowercasedSearchTerm) ||
                (appt.technicalName && appt.technicalName.toLowerCase().includes(lowercasedSearchTerm)) ||
                appt.date.toLowerCase().includes(lowercasedSearchTerm) ||
                appt.prescriptions.some((p, pIndex) => {
                    const subSerialNumber = `${baseIndex}.${pIndex + 1}`;
                    return (
                        subSerialNumber === lowercasedSearchTerm ||
                        p.title.toLowerCase().includes(lowercasedSearchTerm) ||
                        p.doctor.toLowerCase().includes(lowercasedSearchTerm) ||
                        p.summary.toLowerCase().includes(lowercasedSearchTerm) ||
                        (p.medicines && p.medicines.some(m => m.toLowerCase().includes(lowercasedSearchTerm))) ||
                        (p.details && p.details.some(d => d.name.toLowerCase().includes(lowercasedSearchTerm)))
                    );
                })
            );
            return keywordMatch && doctorMatch && dateMatch;
        });
    }, [appointments, historySearchTerm, filterDoctor, filterDate, isClient]);


    const clearFilters = () => {
        setHistorySearchTerm('');
        setFilterDoctor('all');
        setFilterDate(undefined);
    };

    const clearDoctorSearch = () => {
        setSearchQuery('');
        setSelectedHospital('all');
        setSelectedDepartment(null);
        handleFilter('', 'recommended', { consultationType: [], gender: [], availableToday: false }, null, 'all');
    };

    const handleUpload = (appointmentId: number, prescriptionId: number, newImage: { url: string; dataAiHint: string }, labName: string, reportDate: Date) => {
        setAppointments(prevAppointments => {
            return prevAppointments.map((appt, apptIndex) => {
                if (apptIndex === appointmentId) {
                    const newPrescriptions = appt.prescriptions.map((p, pIndex) => {
                        if (pIndex === prescriptionId) {
                            return {
                                ...p,
                                prescriptionImages: [...p.prescriptionImages, newImage]
                            };
                        }
                        return p;
                    });
                    return { ...appt, prescriptions: newPrescriptions };
                }
                return appt;
            });
        });
    };

    const searchSuggestions = useMemo(() => {
        const hospitalDoctors = selectedHospital === 'all' ? initialDoctors : initialDoctors.filter(d => d.hospital === selectedHospital);
        const hospitalSpecialties = [...new Set(hospitalDoctors.map(d => d.specialty))];
    
        const doctorSuggestions = hospitalDoctors.map(d => ({ type: 'Doctor', value: d.name, icon: StethoscopeIcon }));
        const hospitalSuggestions = (selectedHospital === 'all' ? Object.keys(hospitalsData) : [selectedHospital]).map(h => ({ type: 'Hospital', value: h, icon: Hospital }));
        const departmentSuggestions = (selectedHospital === 'all' ? uniqueDepartments : uniqueDepartments.filter(dept => hospitalSpecialties.includes(dept.value))).map(d => ({ type: 'Department', value: d.label, icon: d.Icon }));
    
        return [...doctorSuggestions, ...hospitalSuggestions, ...departmentSuggestions];
    
    }, [selectedHospital, doctors]);
    
    const handleSearchSelect = (value: string) => {
        setSearchQuery(value);
        setShowSearchDialog(false);
        handleFilter(value, sortOption, advancedFilters, selectedDepartment, selectedHospital);
    };
    
    const handleOpenFilter = () => {
        //setTempSortOption(sortOption);
        //setTempAdvancedFilters(advancedFilters);
        setActiveFilterCategory('sort');
        setFilterOpen(true);
    };

    const handleApplyFilters = () => {
        //setSortOption(tempSortOption);
        //setAdvancedFilters(tempAdvancedFilters);
        //handleFilter(searchQuery, tempSortOption, tempAdvancedFilters, selectedDepartment, selectedHospital);
        setFilterOpen(false);
    };
    
    const handleClearAllFilters = () => {
        /*setTempSortOption('recommended');
        setTempAdvancedFilters({
            consultationType: [],
            gender: [],
            availableToday: false,
        });*/
    };
    
    const handleTempFilterChange = (filterType: any, value: string | boolean) => {
       /* setTempAdvancedFilters(prev => {
            if (typeof value === 'boolean') {
                return { ...prev, [filterType]: value };
            }
            if (filterType === 'consultationType' || filterType === 'gender') {
                const currentValues = prev[filterType];
                const newValues = currentValues.includes(value as never)
                    ? currentValues.filter(v => v !== value)
                    : [...currentValues, value];
                return { ...prev, [filterType]: newValues };
            }
            return prev;
        });*/
    };
    
    const AiDeepDiveDialog = ({ diseaseName, trigger }: { diseaseName: string; trigger: React.ReactNode }) => {
        const [isOpen, setIsOpen] = useState(false);
        const [isPending, startTransition] = useTransition();
        const [result, setResult] = useState<DeepDiveOutput | null>(null);

        const handleOpen = (e: React.MouseEvent) => {
            e.stopPropagation(); // Prevent the collapsible from toggling
            setIsOpen(true);
            if (!result) { // Only fetch if no result yet
                startTransition(async () => {
                    const res = await getDeepDive({ diseaseName, language });
                    setResult(res);
                });
            }
        };

        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild onClick={handleOpen}>
                    {trigger}
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>AI Analysis: {diseaseName}</DialogTitle>
                        <DialogDescription>A deep-dive summary of your treatment history.</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto p-1">
                        {isPending ? (
                            <div className="flex justify-center items-center h-40">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : result ? (
                            <div className="whitespace-pre-wrap text-sm text-muted-foreground">{result.details}</div>
                        ) : (
                            <p>No analysis available.</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        );
    };

    
    if (!isClient) {
        return (
            <div className="space-y-6">
                <div className="w-full h-24 rounded-lg bg-muted animate-pulse"></div>
                <div className="w-full h-96 rounded-lg bg-muted animate-pulse"></div>
            </div>
        );
    }

    const showDoctorList = selectedDepartment || searchQuery || selectedHospital !== 'all' || preselectedSpecialty;

    return (
        <div className="space-y-6">
            <Tabs defaultValue={searchParams.get('tab') || "find-doctor"} className="w-full">
                <div className="sticky top-16 z-10 bg-background pt-2">
                    <div className="border-2 border-foreground shadow-md rounded-lg p-1 bg-muted">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="find-doctor" className="font-bold">{t.findDoctor}</TabsTrigger>
                            <TabsTrigger value="history" className="font-bold">{t.history}</TabsTrigger>
                        </TabsList>
                    </div>
                </div>

                <TabsContent value="find-doctor" className="mt-6">
                    <div className="space-y-4">
                        <Card className="border-2 border-black/20 dark:border-white/20 shadow-sm">
                            <CardContent className="p-4 pt-4 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <div className="sm:col-span-1 md:col-span-1">
                                        <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="w-full h-11 justify-start text-muted-foreground text-sm border-2 border-black/20 dark:border-white/20">
                                                    <Search className="mr-2 h-4 w-4 text-primary" style={{color: 'hsl(var(--nav-appointments))'}} />
                                                    {searchQuery || t.searchPlaceholder}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="p-0">
                                                <DialogHeader>
                                                    <DialogTitle className="sr-only">Search</DialogTitle>
                                                </DialogHeader>
                                                <Command>
                                                    <CommandInput 
                                                        placeholder={t.searchPlaceholder}
                                                        value={searchQuery}
                                                        onValueChange={(value) => {
                                                            setSearchQuery(value);
                                                            if (value.trim() === '') {
                                                                handleFilter('', sortOption, advancedFilters, selectedDepartment, selectedHospital);
                                                            }
                                                        }}
                                                        onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleSearchSelect(searchQuery);
                                                        }
                                                        }}
                                                    />
                                                    <CommandList>
                                                        <CommandEmpty>No results found.</CommandEmpty>
                                                        <CommandGroup heading="Suggestions">
                                                            {searchSuggestions
                                                                .filter(s => s.value.toLowerCase().includes(searchQuery.toLowerCase()))
                                                                .slice(0, 10)
                                                                .map((suggestion) => (
                                                                    <CommandItem
                                                                        key={suggestion.value}
                                                                        onSelect={() => handleSearchSelect(suggestion.value)}
                                                                        className="flex items-center gap-2 cursor-pointer"
                                                                    >
                                                                        <suggestion.icon className="h-4 w-4 text-muted-foreground" />
                                                                        <span className="font-semibold text-foreground">{suggestion.value}</span>
                                                                        <Badge variant="outline" className="ml-auto text-xs">{suggestion.type}</Badge>
                                                                    </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <Select value={selectedHospital} onValueChange={(value) => { setSelectedHospital(value); handleFilter(searchQuery, sortOption, advancedFilters, selectedDepartment, value); }}>
                                        <SelectTrigger className="h-11 text-sm truncate border-2 border-black/20 dark:border-white/20">
                                            <div className="flex items-center gap-1 truncate">
                                               <Hospital className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                               <span className="truncate">
                                                    <SelectValue placeholder={t.allHospitals} />
                                               </span>
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{t.allHospitals}</SelectItem>
                                            {hospitals.filter(h => h !== "all").map(hospital => (
                                                <SelectItem key={hospital} value={hospital}>{hospital}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <LocationSelector />
                                </div>
                                <div className="flex items-center justify-between gap-2 mt-2">
                                    <Button variant="ghost" onClick={clearDoctorSearch} className="text-sm h-9 px-2 justify-start w-fit">
                                        <X className='mr-2 h-4 w-4' />
                                        {t.clear}
                                    </Button>
                                    <div className='flex items-center gap-2'>
                                        <Dialog open={isFilterOpen} onOpenChange={setFilterOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="h-9 relative border-2 border-black/20 dark:border-white/20" onClick={handleOpenFilter}>
                                                    <SlidersHorizontal className="h-4 w-4 mr-1 sm:mr-2"/>
                                                    <span>{t.filters}</span>
                                                    {activeFilterCount > 0 && (
                                                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                                                            {activeFilterCount}
                                                        </span>
                                                    )}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md p-0 flex flex-col h-[80vh] sm:h-[60vh]">
                                                <DialogHeader className="p-4 border-b">
                                                    <DialogTitle>Advanced Filters</DialogTitle>
                                                </DialogHeader>
                                                <div className="flex-1 flex overflow-hidden">
                                                    <div className="w-1/3 bg-muted/50 border-r overflow-y-auto">
                                                        <button className={cn("w-full text-left p-3 font-semibold text-sm", activeFilterCategory === 'sort' && 'bg-background')} onClick={() => setActiveFilterCategory('sort')}>Sort</button>
                                                        <button className={cn("w-full text-left p-3 font-semibold text-sm", activeFilterCategory === 'consultation' && 'bg-background')} onClick={() => setActiveFilterCategory('consultation')}>Consultation</button>
                                                        <button className={cn("w-full text-left p-3 font-semibold text-sm", activeFilterCategory === 'gender' && 'bg-background')} onClick={() => setActiveFilterCategory('gender')}>Gender</button>
                                                        <button className={cn("w-full text-left p-3 font-semibold text-sm", activeFilterCategory === 'availability' && 'bg-background')} onClick={() => setActiveFilterCategory('availability')}>Availability</button>
                                                    </div>
                                                    <div className="w-2/3 p-4 overflow-y-auto">
                                                        {activeFilterCategory === 'sort' && (
                                                            <RadioGroup value={''} onValueChange={() => {}} className="space-y-3">
                                                                <div className="flex items-center space-x-2"><RadioGroupItem value="recommended" id="r-rec" /><Label htmlFor="r-rec">Recommended</Label></div>
                                                                <div className="flex items-center space-x-2"><RadioGroupItem value="price_asc" id="r-pasc" /><Label htmlFor="r-pasc">Price: Low to High</Label></div>
                                                                <div className="flex items-center space-x-2"><RadioGroupItem value="price_desc" id="r-pdesc" /><Label htmlFor="r-pdesc">Price: High to Low</Label></div>
                                                                <div className="flex items-center space-x-2"><RadioGroupItem value="exp_desc" id="r-exp" /><Label htmlFor="r-exp">Experience</Label></div>
                                                                <div className="flex items-center space-x-2"><RadioGroupItem value="rating_desc" id="r-rate" /><Label htmlFor="r-rate">Rating</Label></div>
                                                            </RadioGroup>
                                                        )}
                                                         {activeFilterCategory === 'consultation' && (
                                                            <div className="space-y-3">
                                                                <div className="flex items-center space-x-2"><Checkbox id="f-online" checked={false} onCheckedChange={() => {}} /><Label htmlFor="f-online">Online</Label></div>
                                                                <div className="flex items-center space-x-2"><Checkbox id="f-offline" checked={false} onCheckedChange={() => {}} /><Label htmlFor="f-offline">In-person</Label></div>
                                                            </div>
                                                        )}
                                                        {activeFilterCategory === 'gender' && (
                                                            <div className="space-y-3">
                                                                <div className="flex items-center space-x-2"><Checkbox id="f-male" checked={false} onCheckedChange={() => {}} /><Label htmlFor="f-male">Male</Label></div>
                                                                <div className="flex items-center space-x-2"><Checkbox id="f-female" checked={false} onCheckedChange={() => {}} /><Label htmlFor="f-female">Female</Label></div>
                                                            </div>
                                                        )}
                                                         {activeFilterCategory === 'availability' && (
                                                            <div className="space-y-3">
                                                                <div className="flex items-center space-x-2"><Checkbox id="f-today" checked={false} onCheckedChange={() => {}} /><Label htmlFor="f-today">Available Today</Label></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <DialogFooter className="p-4 border-t flex justify-between w-full">
                                                    <Button variant="ghost" onClick={handleClearAllFilters}>Clear</Button>
                                                    <Button onClick={handleApplyFilters} style={{backgroundColor: 'hsl(var(--nav-appointments))'}}>Apply Filters</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        {showDoctorList ? (
                             <div className="grid grid-cols-1 gap-4">
                                {filteredDoctors.length > 0 ? filteredDoctors.map((doctor, index) => (
                                     <Card key={index} className="transition-shadow hover:shadow-md relative overflow-hidden text-black border-2 border-black dark:border-white">
                                        <CardContent className="p-4 space-y-3">
                                            <div className="flex flex-row items-start gap-4">
                                                <Avatar className="h-20 w-20 border-2 flex-shrink-0" style={{borderColor: 'hsl(var(--nav-appointments))'}}>
                                                    <AvatarImage src={doctor.avatar} data-ai-hint={doctor.dataAiHint} />
                                                    <AvatarFallback className="text-lg">{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 space-y-0.5 min-w-0">
                                                    <h3 className="font-extrabold text-xl text-black dark:text-white leading-tight truncate">{doctor.name}</h3>
                                                    <p style={{color: 'hsl(var(--nav-appointments))'}} className="font-bold text-base">{doctor.specialty}</p>
                                                    <p className="text-sm font-bold text-black dark:text-white">{doctor.experience} {t.yearsExp}</p>
                                                     <div className="flex items-center gap-1">
                                                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />
                                                        <span className="font-bold text-lg text-black dark:text-white">{doctor.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-1 text-sm">
                                                <p><span className="text-black dark:text-white font-bold">Focus:</span> <span className="text-black dark:text-gray-300">{doctor.mainDealing}</span></p>
                                                <p><span className="text-black dark:text-white font-bold">Surgeries:</span> <span className="text-black dark:text-gray-300">{doctor.surgeries}</span></p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-black dark:text-white font-bold">Mode:</span>
                                                    <div className="flex items-center gap-1.5 font-semibold">
                                                        {(doctor.consultationType === 'Both' || doctor.consultationType === 'Online') && <span className="flex items-center gap-1 text-xs"><Wifi className="h-3 w-3"/>Online</span>}
                                                        {(doctor.consultationType === 'Both') && <span>&</span>}
                                                        {(doctor.consultationType === 'Both' || doctor.consultationType === 'Offline') && <span className="flex items-center gap-1 text-xs"><Hospital className="h-3 w-3"/>Offline</span>}
                                                    </div>
                                                </div>
                                                <p><span className="text-black dark:text-white font-bold">Availability:</span> <span className="text-black dark:text-gray-300">{doctor.availability}</span></p>
                                            </div>
                                             <div className="flex justify-between items-center gap-2 pt-2">
                                                <p className="text-2xl font-bold" style={{color: 'hsl(var(--nav-appointments))'}}>₹{doctor.opFee}</p>
                                                <div className="flex shrink-0 gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleViewProfile(doctor)} className="border-2 border-black dark:border-white">{t.viewProfile}</Button>
                                                    <Button size="sm" style={{backgroundColor: 'hsl(var(--nav-appointments))'}} onClick={() => handleBookAppointment(doctor)}>
                                                        {t.book}
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )) : (
                                    <div className="text-center p-8 text-muted-foreground">
                                        <p>{t.noDoctorsFound}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                             <Card className="shadow-md border-2 border-foreground">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">{t.departments}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                        {uniqueDepartments.map((dep) => (
                                            <div
                                                key={dep.value}
                                                onClick={() => handleDepartmentSelect(dep.value)}
                                                className="transition-colors hover:bg-background cursor-pointer h-full flex flex-col items-center justify-start text-center gap-1 p-2 rounded-lg"
                                            >
                                                <div className="p-3 rounded-full mb-1 bg-background">
                                                    <dep.Icon className="h-6 w-6" style={{color: 'hsl(var(--nav-appointments))'}} />
                                                </div>
                                                <p className="font-bold text-xs leading-tight text-foreground">{language === 'en' ? dep.label : dep.telugu}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="history" className="mt-6">
                     <Card className="border-2 border-black/20 dark:border-white/20">
                        <CardHeader>
                             <div className="flex items-center justify-between gap-2">
                                <div className='flex items-center gap-2'>
                                  <History className="h-6 w-6"/>
                                  <h2 className="text-2xl font-bold">{t.historyTitle}</h2>
                                </div>
                                <Button size="sm" onClick={() => handleOpenForm(-1, undefined, true)} className="border-2 border-black/20 dark:border-white/20">
                                    <PlusCircle className="mr-2 h-4 w-4" /> {t.addNewProblem}
                                </Button>
                            </div>
                            <Separator className="my-4"/>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                                <div className="relative md:col-span-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input 
                                        placeholder={t.searchHistoryPlaceholder}
                                        className="pl-10 border-2 border-black/20 dark:border-white/20"
                                        value={historySearchTerm}
                                        onChange={(e) => setHistorySearchTerm(e.target.value)}
                                    />
                                </div>
                                <Select value={filterDoctor} onValueChange={setFilterDoctor}>
                                    <SelectTrigger className="border-2 border-black/20 dark:border-white/20">
                                        <SelectValue placeholder={t.allDoctors} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {allDoctors.map(doc => <SelectItem key={doc} value={doc}>{doc === 'all' ? t.allDoctors : doc}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                        "justify-start text-left font-normal border-2 border-black/20 dark:border-white/20",
                                        !filterDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {isClient && filterDate ? format(filterDate, 'PPP') : <span>{t.filterByDate}</span>}
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                    <CalendarComponent
                                        mode="single"
                                        selected={filterDate}
                                        onSelect={setFilterDate}
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            {(historySearchTerm || filterDoctor !== 'all' || filterDate) && (
                                <Button variant="ghost" onClick={clearFilters} className="text-sm h-8 px-2 justify-start w-fit">
                                    <X className='mr-2 h-4 w-4' />
                                    {t.clearFilters}
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                             <div className="grid grid-cols-1 gap-6">
                                {filteredAppointments.length > 0 ? filteredAppointments.map((appt: any, index) => (
                                    <Collapsible key={index} className="rounded-lg bg-background border-2 border-black/20 dark:border-white/20">
                                        <div className="p-4 cursor-pointer" onClick={(e) => {
                                            const target = e.target as HTMLElement;
                                            if (!target.closest('button')) {
                                                const trigger = e.currentTarget.querySelector('.collapsible-trigger-button') as HTMLElement;
                                                trigger?.click();
                                            }
                                        }}>
                                             <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-xl font-bold flex flex-wrap items-baseline">
                                                      <span className="text-blue-600 dark:text-blue-400 mr-1">{index + 1}.</span> 
                                                      {appt.problem}
                                                      {appt.technicalName && <span className="text-sm text-muted-foreground font-semibold ml-2">({appt.technicalName})</span>}
                                                    </h3>
                                                    <div className="text-xs text-muted-foreground mt-2 space-y-1">
                                                        <p><strong>First visit:</strong> {isClient ? format(new Date(appt.date), 'dd MMM, yyyy') : '...'}</p>
                                                        <p><strong>Doctor:</strong> {appt.initialDoctor} ({appt.specialty})</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                                    <div onClick={(e) => e.stopPropagation()}>
                                                      <AiDeepDiveDialog
                                                          diseaseName={appt.problem}
                                                          trigger={
                                                              <Button variant="default" size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                                                                  <Sparkles className="mr-2 h-3 w-3" /> {t.allFollowUps}
                                                              </Button>
                                                          }
                                                      />
                                                    </div>
                                                    <CollapsibleTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 collapsible-trigger-button">
                                                            <ChevronDown className="h-6 w-6 transition-transform duration-200 [&[data-state=open]]:rotate-180" />
                                                        </Button>
                                                    </CollapsibleTrigger>
                                                </div>
                                            </div>
                                        </div>

                                        <CollapsibleContent className="p-4 border-t space-y-4 bg-muted/20">
                                            <div className="flex justify-end items-center">
                                                <Button size="sm" onClick={() => handleOpenForm(index)} className="border-2 border-black/20 dark:border-white/20">
                                                    <PlusCircle className="mr-2 h-4 w-4" /> {t.addFollowUp}
                                                </Button>
                                            </div>
                                            {appt.prescriptions.length > 0 ? (
                                                <div className="space-y-4">
                                                    {appt.prescriptions.map((item: any, pIndex: number) => (
                                                        <div key={pIndex}>
                                                            {item.title === 'Condition Status' && item.status === 'Resolved' ? (
                                                                 <div className='p-4 border bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200 dark:border-blue-800 rounded-lg text-center relative overflow-hidden'>
                                                                    <FlowerFall />
                                                                    <div className="relative z-10">
                                                                        <PartyPopper className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-2"/>
                                                                        <p className="font-bold text-lg text-blue-800 dark:text-blue-300">Congratulations on your recovery!</p>
                                                                        <p className="text-sm text-blue-700 dark:text-blue-400/80">{item.summary}</p>
                                                                    </div>
                                                                 </div>
                                                            ) : (
                                                                <Collapsible className="p-4 border-2 border-black/20 dark:border-white/20 bg-background rounded-lg">
                                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                                                                        <div>
                                                                             <p className="text-lg font-bold">
                                                                                <span className="font-bold text-blue-600 dark:text-blue-400">{filteredAppointments.indexOf(appt) + 1}.{pIndex + 1})</span> {item.title}
                                                                            </p>
                                                                            <p className="text-sm text-black dark:text-gray-300 mt-1 ml-8">{item.doctor} • {item.date}</p>
                                                                        </div>
                                                                        <Badge variant={item.status === 'Completed' ? 'secondary' : 'default'} className={cn('w-fit mt-2 sm:mt-0', item.status === 'Active' ? 'bg-green-100 text-green-800' : '', item.status === 'Improved' || item.status === 'Resolved' ? 'bg-blue-100 text-blue-800' : '', item.status === 'Action Required' ? 'bg-yellow-100 text-yellow-800' : '')}>{item.status}</Badge>
                                                                    </div>
                                                                    
                                                                    <div className="flex items-center gap-2 flex-wrap mb-4">
                                                                        <CollapsibleTrigger asChild>
                                                                            <Button size="sm" style={{backgroundColor: 'hsl(var(--nav-appointments))'}}>
                                                                                <View className="mr-2 h-4 w-4" /> {t.viewDetails}
                                                                            </Button>
                                                                        </CollapsibleTrigger>
                                                                        <UploadDialog
                                                                            trigger={
                                                                                <Button variant="outline" size="sm" className="border-2 border-black/20 dark:border-white/20">
                                                                                    <Upload className="mr-2 h-4 w-4" /> {t.upload}
                                                                                </Button>
                                                                            }
                                                                            appointmentId={index}
                                                                            prescriptionId={pIndex}
                                                                            onUpload={handleUpload}
                                                                        />
                                                                        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleOpenForm(index, pIndex); }} className="border-2 border-black/20 dark:border-white/20">
                                                                            <Pencil className="mr-2 h-4 w-4" /> {t.edit}
                                                                        </Button>
                                                                        <AlertDialog>
                                                                            <AlertDialogTrigger asChild>
                                                                                <Button variant="outline" size="sm" className="text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive" onClick={(e) => e.stopPropagation()}>
                                                                                    <Trash2 className="mr-2 h-4 w-4" /> {t.delete}
                                                                                </Button>
                                                                            </AlertDialogTrigger>
                                                                            <AlertDialogContent>
                                                                                <AlertDialogHeader>
                                                                                <DialogTitle>{t.areYouSure}</DialogTitle>
                                                                                <AlertDialogDescription>
                                                                                    {t.deleteConfirmation.replace('{title}', item.title)}
                                                                                </AlertDialogDescription>
                                                                                </AlertDialogHeader>
                                                                                <AlertDialogFooter>
                                                                                <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                                                                                <AlertDialogAction onClick={() => handleDeleteFollowUp(index, pIndex)} className="bg-destructive hover:bg-destructive/90">{t.delete}</AlertDialogAction>
                                                                                </AlertDialogFooter>
                                                                            </AlertDialogContent>
                                                                        </AlertDialog>
                                                                    </div>
                                                                    <CollapsibleContent className="space-y-1">
                                                                        <div className="space-y-1 py-2 border-b">
                                                                            <h4 className="font-bold text-base underline">Summary</h4>
                                                                            <p className="text-sm text-muted-foreground">{item.summary}</p>
                                                                        </div>

                                                                        {item.medicines.length > 0 && (
                                                                            <div className="space-y-1 py-2 border-b">
                                                                                <h4 className="font-bold text-base underline">Medicines</h4>
                                                                                <div className="flex flex-wrap gap-2">
                                                                                    {item.medicines.map((med: string, i: number) => <Badge key={i} variant="secondary" className="font-normal">{med}</Badge>)}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {item.prescriptionImages && item.prescriptionImages.length > 0 && (
                                                                            <div className="space-y-1 py-2 border-b">
                                                                                <h4 className="font-bold text-base underline">Prescriptions</h4>
                                                                                <div className="flex flex-wrap gap-2">
                                                                                    {item.prescriptionImages.map((img: {url: string, dataAiHint: string}, i: number) => (
                                                                                        <Image key={i} src={img.url} alt={`Prescription ${i+1}`} width={80} height={110} data-ai-hint={img.dataAiHint} className="rounded-md border-2 border-black/20 dark:border-white/20 cursor-pointer" onClick={(e) => { e.stopPropagation(); setZoomedImage(img.url); }} />
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        
                                                                        {item.details && item.details.length > 0 && (
                                                                            <div className="space-y-2 py-2">
                                                                                <h4 className="font-bold text-base underline">Lab Reports</h4>
                                                                                <div className="space-y-2">
                                                                                    {item.details.map((detail: any, i: number) => (
                                                                                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-background border-2 border-black/20 dark:border-white/20">
                                                                                            <p className="font-semibold text-sm">{detail.name}</p>
                                                                                            <div className="flex items-center gap-2">
                                                                                                <Badge variant={getReportStatusBadge(detail.status)}>{detail.status}</Badge>
                                                                                                <ViewReportDialog report={detail}>
                                                                                                     <Button variant="ghost" size="icon" className="h-8 w-8"><View className="h-4 w-4 text-primary" style={{color: 'hsl(var(--nav-appointments))'}} /></Button>
                                                                                                </ViewReportDialog>
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </CollapsibleContent>
                                                                </Collapsible>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-base text-muted-foreground text-center py-4">{t.noFollowUps}</p>
                                            )}
                                        </CollapsibleContent>
                                    </Collapsible>
                                )) : (
                                    <div className="text-center p-8 text-muted-foreground border-2 border-black/20 dark:border-white/20 rounded-lg">{t.noAppointments}</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            
            <BookingDialog
                open={isBookingOpen}
                onOpenChange={setIsBookingOpen}
                doctor={doctorForBooking}
                onBookingComplete={handleBookingComplete}
                existingProblems={appointments.map(a => a.problem)}
            />

            <Dialog open={isProfileOpen} onOpenChange={setProfileOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Doctor Profile</DialogTitle>
                    </DialogHeader>
                    {selectedDoctor && (
                        <>
                           
                                <div className="flex items-center gap-4">
                                     <Avatar className="h-20 w-20 border" style={{borderColor: 'hsl(var(--nav-appointments))'}}>
                                        <AvatarImage src={selectedDoctor.avatar} data-ai-hint={selectedDoctor.dataAiHint} />
                                        <AvatarFallback>{selectedDoctor.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-2xl font-bold">{selectedDoctor.name}</h3>
                                        <p className="text-base" style={{color: 'hsl(var(--nav-appointments))'}}>{selectedDoctor.specialty}</p>
                                        <p className="text-sm text-muted-foreground">{selectedDoctor.experience} years of experience</p>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />
                                            <span className="font-bold text-lg">{selectedDoctor.rating}</span>
                                        </div>
                                    </div>
                                </div>
                          
                            <div className="space-y-4 py-4">
                                <div className="p-4 rounded-lg bg-muted/50">
                                    <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                        <Wifi style={{color: 'hsl(var(--nav-appointments))'}}/>
                                        {t.availability}
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <p className="flex items-center gap-2"><Clock className="h-4 w-4"/> {selectedDoctor.availability}</p>
                                        <div className="flex items-center gap-2">
                                            {Array.isArray(selectedDoctor.consultationType) ? (
                                                selectedDoctor.consultationType.map((type: string) => (
                                                    <span key={type} className="flex items-center gap-1.5 font-semibold">
                                                        {type === 'Online' ? <Wifi className="h-4 w-4"/> : <Hospital className="h-4 w-4"/>}
                                                        {type}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="flex items-center gap-1.5 font-semibold">
                                                    {selectedDoctor.consultationType === 'Online' ? <Wifi className="h-4 w-4"/> : <Hospital className="h-4 w-4"/>}
                                                    {selectedDoctor.consultationType}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg bg-muted/50">
                                    <h4 className="font-semibold text-lg mb-2">{selectedDoctor.hospital}</h4>
                                    <div className="space-y-2 text-sm">
                                        <p className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-1 flex-shrink-0"/> {hospitalsData[selectedDoctor.hospital as keyof typeof hospitalsData]?.address}</p>
                                        <p className="flex items-center gap-2"><Phone className="h-4 w-4"/> {hospitalsData[selectedDoctor.hospital as keyof typeof hospitalsData]?.phone}</p>
                                        <a href={hospitalsData[selectedDoctor.hospital as keyof typeof hospitalsData]?.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                                            <Globe className="h-4 w-4"/> Visit Website
                                        </a>
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg bg-muted/50">
                                    <h4 className="font-semibold text-lg mb-2">Consultation Fee</h4>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-bold" style={{color: 'hsl(var(--nav-appointments))'}}>₹{selectedDoctor.opFee}</p>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => handleShare(selectedDoctor)} disabled={isSharing} className="border-2 border-black/20 dark:border-white/20">
                                        {isSharing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Copy className="mr-2 h-4 w-4" />}
                                        {isSharing ? t.copying : t.copyDetails}
                                    </Button>
                                     <Button style={{backgroundColor: 'hsl(var(--nav-appointments))'}} onClick={() => handleBookAppointment(selectedDoctor)}>
                                        {t.bookAppointment}
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

             <Dialog open={zoomedImage !== null} onOpenChange={() => setZoomedImage(null)}>
                <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0">
                     <DialogHeader className="p-4 bg-background rounded-t-lg z-10 shadow-sm flex-row items-center justify-between">
                        <DialogTitle>Prescription Viewer</DialogTitle>
                        <DialogDescription>Full-size view of the prescription.</DialogDescription>
                     </DialogHeader>
                    <div className="flex-1 relative bg-muted/20">
                        {zoomedImage && (
                            <Image
                                src={zoomedImage}
                                alt="Zoomed Prescription"
                                fill={true}
                                style={{objectFit: "contain"}}
                                className="p-4"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingFollowUp?.isNewProblem ? 'Add New Health Problem' : (editingFollowUp?.pIndex !== undefined ? 'Edit Follow-up' : 'Add New Follow-up')}</DialogTitle>
                        <DialogDescription>
                            {editingFollowUp?.isNewProblem ? 'Create a new entry in your health history.' : 'Update the details for this entry.'}
                        </DialogDescription>
                    </DialogHeader>
                    {editingFollowUp && (
                        <FollowUpForm
                            appointmentId={editingFollowUp.isNewProblem ? undefined : editingFollowUp.apptIndex}
                            existingFollowUp={editingFollowUp.pIndex !== undefined ? appointments[editingFollowUp.apptIndex].prescriptions[editingFollowUp.pIndex] : undefined}
                            problemName={editingFollowUp.isNewProblem ? '' : appointments[editingFollowUp.apptIndex].problem}
                            onSave={handleSaveFollowUp}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function AppointmentsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AppointmentsPageComponent />
        </Suspense>
    )
}
