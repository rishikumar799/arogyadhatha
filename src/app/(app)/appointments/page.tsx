

'use client';

import React, { useState, useMemo, useEffect, useTransition, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, MapPin, HeartPulse, Bone, Brain, Stethoscope as StethoscopeIcon, Baby, Leaf, Phone, Globe, Share2, Copy, Loader2, Star, Calendar, History, ChevronDown, FileText, Pill, CheckCircle, XCircle, Filter, X, PartyPopper, MessageSquare, Upload, Printer, Download, View, XCircleIcon, ImageIcon, File as FileIcon, Sparkles, Map as MapIcon, Clock, PlusCircle, Pencil, Trash2, CreditCard, Lock, Sun, Moon, Separator as SeparatorIcon, ArrowLeft, ChevronRight, HelpCircle, Wifi, Hospital, Briefcase, User, Wallet, Users, HeartHandshake, Bot, Shield, Droplets, SlidersHorizontal, ArrowUpDown, Video, Landmark } from "lucide-react";
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Suspense } from 'react';


const ToothIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 20a2 2 0 0 0 2-2V9.3a2 2 0 0 0-.6-1.4l-4.2-4.2a2 2 0 0 0-1.4-.6H8.3a2 2 0 0 0-1.4.6L2.7 7.9a2 2 0 0 0-.6 1.4V18a2 2 0 0 0 2 2Z"/><path d="M22 20H2"/><path d="m5 12 1-2h12l1 2"/><path d="M12 12v8"/></svg>
);


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

const initialDoctors = [
    { name: "Dr. V. Venkata Naidu, MS, MCh", specialty: "Urologist", experience: 25, hospital: "Guntur Kidney & Multispeciality Hospital", surgeries: "20,000+ Successful Surgeries", mainDealing: "Urology, advanced surgical procedures, and successful kidney transplants.", avatar: "https://picsum.photos/seed/doc11/100/100", dataAiHint: "male doctor experienced", opFee: 1100, availability: "Mon - Fri, 10 AM - 4 PM", consultationType: "Offline", gender: "Male", recommended: true, rating: 4.8 },
    { name: "General Medicine OP", specialty: "General Physician", experience: 15, hospital: "AIMS, Mangalagiri", surgeries: "N/A", mainDealing: "General health consultations and treatment.", avatar: "https://picsum.photos/seed/govdoc1/100/100", dataAiHint: "doctor symbol", opFee: 10, availability: "Mon - Sat, 9 AM - 1 PM", consultationType: "Offline", gender: "Both", rating: 4.2 },
    { name: "Orthopedics OP", specialty: "Orthopedic Surgeon", experience: 20, hospital: "AIMS, Mangalagiri", surgeries: "N/A", mainDealing: "Bone, joint, and muscle related issues.", avatar: "https://picsum.photos/seed/govdoc2/100/100", dataAiHint: "hospital icon", opFee: 10, availability: "Mon - Fri, 9 AM - 1 PM", consultationType: "Offline", gender: "Both", rating: 4.4 },
    { name: "Cardiology OP", specialty: "Cardiologist", experience: 18, hospital: "Guntur Government Hospital", surgeries: "N/A", mainDealing: "Heart-related diseases and check-ups.", avatar: "https://picsum.photos/seed/govdoc3/100/100", dataAiHint: "heart icon", opFee: 10, availability: "Mon - Sat, 10 AM - 2 PM", consultationType: "Offline", gender: "Both", rating: 4.3 },
    { name: "Dermatology OP", specialty: "Dermatologist", experience: 12, hospital: "Guntur Government Hospital", surgeries: "N/A", mainDealing: "Skin, hair, and nail problems.", avatar: "https://picsum.photos/seed/govdoc4/100/100", dataAiHint: "medical cross", opFee: 10, availability: "Mon, Wed, Fri, 2 PM - 5 PM", consultationType: "Offline", gender: "Both", rating: 4.1 },
];

const departments = [
    { value: "all", label: "All", Icon: StethoscopeIcon },
    { value: "Cardiologist", label: "Cardiology", Icon: HeartPulse },
    { value: "Orthopedic Surgeon", label: "Orthopedics", Icon: Bone },
    { value: "Orthopaedics", label: "Orthopedics", Icon: Bone },
    { value: "Neurologist", label: "Neurology", Icon: Brain },
    { value: "Gynaecologist", label: "Gynaecology", Icon: HeartHandshake },
    { value: "Pediatrician", label: "Pediatrics", Icon: Baby },
    { value: "Dermatologist", label: "Dermatology", Icon: Bot },
    { value: "Implantologist & Laser Specialist", label: "Dental", Icon: ToothIcon },
    { value: "General Physician", label: "General", Icon: User },
    { value: "Gastroenterologist", label: "Gastro", Icon: Leaf },
    { value: "Nephrologist", label: "Nephrology", Icon: Shield },
    { value: "Urologist", label: "Urology", Icon: Droplets },
    { value: "Intensivist", label: "Intensive Care", Icon: StethoscopeIcon },
    { value: "General Surgeon", label: "Surgery", Icon: Briefcase },
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
            <DialogTrigger asChild onClick={() => setIsDialogOpen(true)}>
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
                            <Button asChild variant="outline" className="flex-1">
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

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild onClick={handleOpen}>
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
            <DialogTrigger asChild onClick={() => setIsOpen(true)}>
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
                            <Button variant="outline" className="w-full sm:w-auto"><Download className="mr-2 h-4 w-4" />Download</Button>
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

function FollowUpForm({ onSave, onCancel, appointmentId, existingFollowUp }: { onSave: (apptId: number, followUp: any) => void; onCancel: () => void; appointmentId: number; existingFollowUp?: any }) {
    const { toast } = useToast();
    const [title, setTitle] = useState(existingFollowUp?.title || '');
    const [doctor, setDoctor] = useState(existingFollowUp?.doctor || '');
    const [date, setDate] = useState(existingFollowUp?.date || '');
    const [status, setStatus] = useState(existingFollowUp?.status || 'Active');
    const [summary, setSummary] = useState(existingFollowUp?.summary || '');
    const [medicines, setMedicines] = useState(existingFollowUp?.medicines?.join(', ') || '');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newFollowUp = {
            title,
            doctor,
            date,
            status,
            summary,
            medicines: medicines.split(',').map(m => m.trim()).filter(m => m),
            prescriptionImages: existingFollowUp?.prescriptionImages || [],
            details: existingFollowUp?.details || [],
        };
        onSave(appointmentId, newFollowUp);
        toast({
            title: `Follow-up ${existingFollowUp ? 'Updated' : 'Added'}`,
            description: "Your changes have been saved successfully.",
        });
        onCancel();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="fu-title">Follow-up Title</Label>
                <Input id="fu-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., 2nd Follow-up" required />
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

function TimeSlotSelector({ slots, selectedTime, onSelectTime, title, icon: Icon }: { slots: string[], selectedTime: string | null, onSelectTime: (time: string) => void, title: string, icon: React.ElementType }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="font-semibold flex items-center gap-2"><Icon className="h-5 w-5" />{title}</h4>
                <p className="text-xs text-muted-foreground">{slots.length} SLOTS</p>
            </div>
            <div className="flex flex-wrap gap-2">
                {slots.map(time => (
                    <Button 
                        key={time} 
                        variant={selectedTime === time ? "default" : "outline"}
                        className={cn("font-semibold", selectedTime === time && "text-primary-foreground")}
                        style={selectedTime === time ? { backgroundColor: 'hsl(var(--nav-appointments))' } : {}}
                        onClick={() => onSelectTime(time)}
                    >
                        {time}
                    </Button>
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
                        "flex flex-col items-center justify-center p-2 rounded-lg border w-16 shrink-0 transition-colors",
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

    const handleContinue = () => {
        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };
    
    const handlePay = () => {
        const finalReason = selectedExistingProblem || visitReason;
        const isFollowUp = !!selectedExistingProblem;
        onBookingComplete({
            doctor,
            date: selectedDate,
            time: selectedTime,
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
            router.push(`/video-call?${queryParams.toString()}`);
        } else {
            router.push(`/opd-queue?${queryParams.toString()}`);
        }
        onOpenChange(false);
    };
    
    useEffect(() => {
        if (open) {
            setStep(1);
            setConsultationType(null);
            setPaymentMethod(null);
            setSelectedTime(null);
            setSelectedDate(addDays(new Date(), 1));
            setVisitReason('');
            setSelectedExistingProblem('');
        }
    }, [open]);

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
                            <Card className={cn("cursor-pointer", consultationType === "Online" && "border-2 border-primary")} onClick={() => setConsultationType("Online")} style={{borderColor: consultationType === 'Online' ? 'hsl(var(--nav-appointments))' : ''}}>
                                <CardContent className="p-4 flex items-center gap-4">
                                    <Video className="h-8 w-8 text-primary" style={{color: 'hsl(var(--nav-appointments))'}} />
                                    <div>
                                        <p className="font-bold text-lg">Online Video Call</p>
                                        <p className="text-sm text-muted-foreground">Consult from anywhere</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className={cn("cursor-pointer", consultationType === "Offline" && "border-2 border-primary")} onClick={() => setConsultationType("Offline")} style={{borderColor: consultationType === 'Offline' ? 'hsl(var(--nav-appointments))' : ''}}>
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
                                    className="h-12 text-base"
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
                                        <div key={problem} className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted border bg-background">
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
                            <Card>
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
                                slots={["12:00 PM", "12:10 PM", "12:20 PM", "12:30 PM", "12:40 PM"]}
                                selectedTime={selectedTime}
                                onSelectTime={setSelectedTime}
                            />

                            <TimeSlotSelector 
                                title="Evening"
                                icon={Moon}
                                slots={["03:00 PM", "03:10 PM", "03:20 PM", "03:30 PM", "03:40 PM", "03:50 PM"]}
                                selectedTime={selectedTime}
                                onSelectTime={setSelectedTime}
                            />

                            <p className="text-xs text-center text-muted-foreground pt-2">*Includes a free chat follow-up for 3 days post-consultation.</p>
                        </div>
                    )}
                    {step === 4 && (
                        <div className="p-4 space-y-4">
                            <Card>
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
                            
                             <Card>
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
                                <Card className={cn("cursor-pointer", paymentMethod === 'Offline' && 'border-2 border-primary')} onClick={() => setPaymentMethod('Offline')} style={{borderColor: paymentMethod === 'Offline' ? 'hsl(var(--nav-appointments))' : ''}}>
                                    <CardContent className="p-4 flex items-center gap-3">
                                        <Landmark className="h-6 w-6 text-muted-foreground" />
                                        <div>
                                            <p className="font-bold">Pay at Hospital</p>
                                            <p className="text-sm text-muted-foreground">Pay directly at the hospital counter</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                             <Card className={cn("cursor-pointer", paymentMethod === 'Online' && 'border-2 border-primary')} onClick={() => setStep(5)} style={{borderColor: paymentMethod === 'Online' ? 'hsl(var(--nav-appointments))' : ''}}>
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
                                    <Button variant="ghost" className='w-full justify-start h-14' onClick={() => { setPaymentMethod('Online'); handlePay(); }}><Image src="https://picsum.photos/seed/gpay/40/40" alt="GPay" width={24} height={24} className='mr-4' data-ai-hint="google pay logo"/> Google Pay<ChevronRight className='ml-auto h-5 w-5 text-muted-foreground'/></Button>
                                    <Separator/>
                                    <Button variant="ghost" className='w-full justify-start h-14' onClick={() => { setPaymentMethod('Online'); handlePay(); }}><Image src="https://picsum.photos/seed/phonepe/40/40" alt="PhonePe" width={24} height={24} className='mr-4' data-ai-hint="phonepe logo"/> PhonePe<ChevronRight className='ml-auto h-5 w-5 text-muted-foreground'/></Button>
                                </div>
                             </div>
                             <div>
                                <h3 className='font-bold text-lg mb-2'>Credit/Debit Cards</h3>
                                <div>
                                    <Button variant="ghost" className='w-full justify-start h-14 text-primary' style={{color: 'hsl(var(--nav-appointments))'}}>
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

function AppointmentsPageComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const preselectedHospital = searchParams.get('hospital');
    
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
    const [showDoctorList, setShowDoctorList] = useState(false);
    const [displayedDepartments, setDisplayedDepartments] = useState(uniqueDepartments);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const commandRef = useRef<HTMLDivElement>(null);
    
    // History filters and state
    const [historySearchTerm, setHistorySearchTerm] = useState('');
    const [filterDoctor, setFilterDoctor] = useState('all');
    const [filterDate, setFilterDate] = useState<Date>();
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingFollowUp, setEditingFollowUp] = useState<{apptIndex: number, pIndex?: number} | null>(null);

    // Advanced Sort & Filter
    const [sortOption, setSortOption] = useState('recommended');
    const [isFilterOpen, setFilterOpen] = useState(false);
    const [advancedFilters, setAdvancedFilters] = useState({
        consultationType: [] as string[],
        gender: [] as string[],
        availableToday: false,
    });
    
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
    }, []);

    const [appointments, setAppointments] = useState(() => 
        initialAppointmentsData.map(appt => ({
            ...appt,
            prescriptions: appt.prescriptions.map(p => ({
                ...p,
                prescriptionImages: Array.isArray(p.prescriptionImages) ? p.prescriptionImages : (p.prescriptionImage ? [{ url: p.prescriptionImage, dataAiHint: p.dataAiHint || 'medical prescription' }] : [])
            }))
        }))
    );
    
    const activeFilterCount = useMemo(() => {
        let count = 0;
        count += advancedFilters.consultationType.length;
        count += advancedFilters.gender.length;
        if (advancedFilters.availableToday) count++;
        return count;
    }, [advancedFilters]);

    useEffect(() => {
        if (!selectedHospital || selectedHospital === 'all') {
            setDisplayedDepartments(uniqueDepartments);
        } else {
            const hospitalDoctors = doctors.filter(d => d.hospital === selectedHospital);
            const hospitalSpecialties = [...new Set(hospitalDoctors.map(d => d.specialty))];
            const filteredDepts = uniqueDepartments.filter(dept => hospitalSpecialties.includes(dept.value) || hospitalSpecialties.includes(dept.label));
            setDisplayedDepartments(filteredDepts);
        }
    }, [selectedHospital, doctors]);
    
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
          setShowSuggestions(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [commandRef]);


    
    const handleSaveFollowUp = (apptIndex: number, followUp: any) => {
        setAppointments(prev => prev.map((appt, i) => {
            if (i === apptIndex) {
                let newPrescriptions;
                if(editingFollowUp && editingFollowUp.pIndex !== undefined) {
                    // Editing existing
                     newPrescriptions = appt.prescriptions.map((p, p_idx) => p_idx === editingFollowUp.pIndex ? followUp : p);
                } else {
                    // Adding new
                    newPrescriptions = [...appt.prescriptions, followUp];
                }
                return { ...appt, prescriptions: newPrescriptions };
            }
            return appt;
        }));
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

    const handleOpenForm = (apptIndex: number, pIndex?: number) => {
        setEditingFollowUp({ apptIndex, pIndex });
        setIsFormOpen(true);
    };

    const handleFilter = (query = searchQuery) => {
        setShowDoctorList(true);
        const lowercasedQuery = query.toLowerCase();
        
        let doctorsToSort = initialDoctors.filter(doctor => {
            const nameMatch = doctor.name.toLowerCase().includes(lowercasedQuery);
            const specialtyMatch = doctor.specialty.toLowerCase().includes(lowercasedQuery);
            const hospitalMatch = doctor.hospital.toLowerCase().includes(lowercasedQuery);
            const searchMatch = nameMatch || hospitalMatch || specialtyMatch || lowercasedQuery === '';
            
            const hospitalFilterMatch = !selectedHospital || selectedHospital === 'all' || doctor.hospital === selectedHospital;
    
            const locationString = location.village || location.mandal || location.district;
            const hospitalDetails = hospitalsData[doctor.hospital];
            const locationMatch = !locationString || (hospitalDetails && hospitalDetails.location.toLowerCase() === locationString.toLowerCase());
    
            const consultationTypeMatch = advancedFilters.consultationType.length === 0 || advancedFilters.consultationType.includes(doctor.consultationType);
            const genderMatch = advancedFilters.gender.length === 0 || advancedFilters.gender.includes(doctor.gender);
            const availabilityMatch = !advancedFilters.availableToday || doctor.availability.includes(format(new Date(), 'EEE'));
    
            return searchMatch && hospitalFilterMatch && locationMatch && consultationTypeMatch && genderMatch && availabilityMatch;
        });
    
        switch (sortOption) {
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
                 doctorsToSort.sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0));
                break;
            default:
                break;
        }
    
        setFilteredDoctors(doctorsToSort);
    };
    
    useEffect(() => {
        if(showDoctorList) {
            handleFilter(searchQuery);
        }
    }, [sortOption, advancedFilters, selectedHospital, location, doctors]);


    const handleDepartmentSelect = (departmentValue: string) => {
        setShowDoctorList(true);
        const filtered = initialDoctors.filter(doctor => {
            const hospitalFilterMatch = !selectedHospital || selectedHospital === 'all' || doctor.hospital === selectedHospital;
            const departmentMatch = departmentValue === 'all' || doctor.specialty === departmentValue || (uniqueDepartments.find(d => d.value === departmentValue)?.label === doctor.specialty) || (uniqueDepartments.find(d => d.value === departmentValue)?.label === "Dental" && doctor.specialty.includes("Implantologist"));
            return departmentMatch && hospitalFilterMatch;
        });
        setFilteredDoctors(filtered);
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
            title: "Copied to Clipboard",
            description: "Doctor's details have been copied.",
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
            title: "Appointment Booked!",
            description: `Your ${details.consultationType} appointment for ${details.reason} with ${details.doctor.name} on ${details.date.toLocaleDateString()} at ${details.time} is confirmed.`,
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
            const doctorMatch = filterDoctor === 'all' || appt.initialDoctor === filterDoctor || appt.prescriptions.some(p => p.doctor === filterDoctor);
            const dateMatch = !filterDate || appt.date === filterDate.toLocaleDateString();
    
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
    }, [appointments, historySearchTerm, filterDoctor, filterDate]);


    const clearFilters = () => {
        setHistorySearchTerm('');
        setFilterDoctor('all');
        setFilterDate(undefined);
    };

    const handleBackToDepartments = () => {
        setShowDoctorList(false);
        clearDoctorSearch();
    };

    const clearDoctorSearch = () => {
        setSearchQuery('');
        setSelectedHospital('all');
        setSortOption('recommended');
        setAdvancedFilters({ consultationType: [], gender: [], availableToday: false });
        setShowDoctorList(false);
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
        const departmentSuggestions = (selectedHospital === 'all' ? uniqueDepartments : uniqueDepartments.filter(dept => hospitalSpecialties.includes(dept.label))).map(d => ({ type: 'Department', value: d.label, icon: d.Icon }));
    
        return [...doctorSuggestions, ...hospitalSuggestions, ...departmentSuggestions];
    
    }, [selectedHospital, doctors]);
    
    const handleSearchSelect = (value: string) => {
        setSearchQuery(value);
        setShowSuggestions(false);
        handleFilter(value);
    };

    const handleAdvancedFilterChange = (filterType: keyof typeof advancedFilters, value: string | boolean) => {
        setAdvancedFilters(prev => {
            if (typeof value === 'boolean') {
                return { ...prev, [filterType]: value };
            }
            const currentValues = prev[filterType as 'consultationType' | 'gender'];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];
            return { ...prev, [filterType]: newValues };
        });
    };

    
    if (!isClient) {
        return (
            <div className="space-y-6">
                <div className="w-full h-24 rounded-lg bg-muted animate-pulse"></div>
                <div className="w-full h-96 rounded-lg bg-muted animate-pulse"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Tabs defaultValue="find-doctor" className="w-full">
                 <div className="border rounded-lg p-1 bg-muted">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="find-doctor" className="font-bold">Find a Doctor</TabsTrigger>
                        <TabsTrigger value="history" className="font-bold">Appointments History</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="find-doctor" className="mt-6">
                    <div className="space-y-4">
                        <Card className="shadow-sm border">
                             <CardContent className="p-4 pt-4 space-y-4">
                                <div ref={commandRef} className="relative">
                                    <Command className="overflow-visible bg-transparent">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" style={{color: 'hsl(var(--nav-appointments))'}} />
                                            <CommandInput 
                                                className="pl-10 h-11 text-base w-full"
                                                placeholder="Doctor, hospital..." 
                                                value={searchQuery}
                                                onValueChange={(val) => {
                                                    setSearchQuery(val);
                                                    setShowSuggestions(true);
                                                }}
                                                onFocus={() => setShowSuggestions(true)}
                                            />
                                        </div>
                                        {showSuggestions && searchQuery && (
                                            <div className="absolute w-full mt-1 z-10">
                                                <Card className="border bg-background shadow-md">
                                                    <CommandList>
                                                        <Command>
                                                            {searchSuggestions
                                                                .filter(s => s.value.toLowerCase().includes(searchQuery.toLowerCase()))
                                                                .length === 0 ? (
                                                                    <CommandEmpty>No results found.</CommandEmpty>
                                                                ) : (
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
                                                            )}
                                                        </Command>
                                                    </CommandList>
                                                </Card>
                                            </div>
                                        )}
                                    </Command>
                                </div>
                                
                                <div className="grid grid-cols-[1fr_auto] gap-2">
                                    <Select value={selectedHospital} onValueChange={setSelectedHospital}>
                                        <SelectTrigger className="h-10 text-sm truncate">
                                            <div className="flex items-center gap-1 truncate">
                                               <Hospital className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                               <span className="truncate">
                                                    <SelectValue placeholder="All Hospitals" />
                                               </span>
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Hospitals</SelectItem>
                                            {hospitals.filter(h => h !== "all").map(hospital => (
                                                <SelectItem key={hospital} value={hospital}>{hospital}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <LocationSelector />
                                </div>
                                <Button className="w-full h-10" style={{backgroundColor: 'hsl(var(--nav-appointments))'}} onClick={() => handleFilter()}>
                                    Search
                                </Button>

                                <div className="flex items-center gap-2 mt-2">
                                    <Button variant="ghost" onClick={clearDoctorSearch} className="text-sm h-9 px-2 justify-start w-fit">
                                        <X className='mr-2 h-4 w-4' />
                                        Clear
                                    </Button>
                                    <div className='flex items-center gap-2 ml-auto'>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="h-9 relative">
                                                    <ArrowUpDown className="h-4 w-4 mr-1 sm:mr-2"/>
                                                    <span>Sort</span>
                                                    {sortOption !== 'recommended' && (
                                                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                                                            1
                                                        </span>
                                                    )}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-xs">
                                                <DialogHeader>
                                                    <DialogTitle>Sort by</DialogTitle>
                                                </DialogHeader>
                                                <RadioGroup value={sortOption} onValueChange={setSortOption} className="py-4">
                                                    <div className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md"><RadioGroupItem value="recommended" id="r-rec" /><Label htmlFor="r-rec">Recommended</Label></div>
                                                    <div className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md"><RadioGroupItem value="price_asc" id="r-pasc" /><Label htmlFor="r-pasc">Price: Low to High</Label></div>
                                                    <div className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md"><RadioGroupItem value="price_desc" id="r-pdesc" /><Label htmlFor="r-pdesc">Price: High to Low</Label></div>
                                                    <div className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md"><RadioGroupItem value="exp_desc" id="r-exp" /><Label htmlFor="r-exp">Experience</Label></div>
                                                    <div className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md"><RadioGroupItem value="rating_desc" id="r-rate" /><Label htmlFor="r-rate">Rating</Label></div>
                                                </RadioGroup>
                                            </DialogContent>
                                        </Dialog>

                                        <Dialog open={isFilterOpen} onOpenChange={setFilterOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="h-9 relative">
                                                    <SlidersHorizontal className="h-4 w-4 mr-1 sm:mr-2"/>
                                                    <span>Filter</span>
                                                    {activeFilterCount > 0 && (
                                                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                                                            {activeFilterCount}
                                                        </span>
                                                    )}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader><DialogTitle>Advanced Filters</DialogTitle></DialogHeader>
                                                <div className="space-y-6 py-4">
                                                    <div>
                                                        <h4 className="font-semibold mb-2">Consultation Type</h4>
                                                        <div className="flex items-center space-x-2"><Checkbox id="f-online" checked={advancedFilters.consultationType.includes('Online')} onCheckedChange={() => handleAdvancedFilterChange('consultationType', 'Online')} /><Label htmlFor="f-online">Online</Label></div>
                                                        <div className="flex items-center space-x-2"><Checkbox id="f-offline" checked={advancedFilters.consultationType.includes('Offline')} onCheckedChange={() => handleAdvancedFilterChange('consultationType', 'Offline')} /><Label htmlFor="f-offline">In-person</Label></div>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold mb-2">Gender</h4>
                                                        <div className="flex items-center space-x-2"><Checkbox id="f-male" checked={advancedFilters.gender.includes('Male')} onCheckedChange={() => handleAdvancedFilterChange('gender', 'Male')} /><Label htmlFor="f-male">Male</Label></div>
                                                        <div className="flex items-center space-x-2"><Checkbox id="f-female" checked={advancedFilters.gender.includes('Female')} onCheckedChange={() => handleAdvancedFilterChange('gender', 'Female')} /><Label htmlFor="f-female">Female</Label></div>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold mb-2">Availability</h4>
                                                        <div className="flex items-center space-x-2"><Checkbox id="f-today" checked={advancedFilters.availableToday} onCheckedChange={(checked) => handleAdvancedFilterChange('availableToday', !!checked)} /><Label htmlFor="f-today">Available Today</Label></div>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="ghost" onClick={() => setAdvancedFilters({ consultationType: [], gender: [], availableToday: false })}>Clear</Button>
                                                    <Button onClick={() => { setFilterOpen(false); handleFilter(); }} style={{backgroundColor: 'hsl(var(--nav-appointments))'}}>Apply Filters</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        {!showDoctorList ? (
                            <Card className="border">
                                <CardHeader>
                                    <CardTitle>Departments</CardTitle>
                                    <CardDescription>Select a department to find specialist doctors.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                        {displayedDepartments.filter(dep => dep.value !== 'all').map(dep => (
                                            <div
                                                key={dep.value}
                                                className="flex flex-col items-center justify-center text-center gap-1 p-2 rounded-lg cursor-pointer hover:bg-primary/5 transition-colors"
                                                onClick={() => handleDepartmentSelect(dep.value)}
                                            >
                                                <div className="p-3 rounded-full bg-primary/10">
                                                     <dep.Icon className="h-6 w-6 text-primary" style={{color: 'hsl(var(--nav-appointments))'}} />
                                                </div>
                                                <p className="font-bold text-xs leading-tight">{dep.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                             <div>
                                <div className="flex justify-between items-center mb-4">
                                    <Button variant="outline" onClick={handleBackToDepartments}>
                                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Departments
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {filteredDoctors.length > 0 ? filteredDoctors.map((doctor, index) => (
                                        <Card key={index} className="transition-shadow hover:shadow-md border relative overflow-hidden">
                                            {doctor.recommended && (
                                                <Badge className="absolute top-2 right-2 text-xs px-1.5 py-0.5 font-semibold z-10" variant="secondary">
                                                    <Star className="h-3 w-3 mr-1 text-yellow-500 fill-yellow-400" />
                                                    Recommended
                                                </Badge>
                                            )}
                                            <CardContent className="p-4 space-y-3">
                                                <div className="flex flex-row items-center gap-4">
                                                    <Avatar className="h-20 w-20 border-2 flex-shrink-0" style={{borderColor: 'hsl(var(--nav-appointments))'}}>
                                                        <AvatarImage src={doctor.avatar} data-ai-hint={doctor.dataAiHint} />
                                                        <AvatarFallback className="text-lg">{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 space-y-0.5 min-w-0">
                                                        <h3 className="font-bold text-lg leading-tight truncate">{doctor.name}</h3>
                                                        <p style={{color: 'hsl(var(--nav-appointments))'}} className="font-semibold text-sm">{doctor.specialty}</p>
                                                        <p className="text-xs text-muted-foreground">{doctor.experience} years exp.</p>
                                                        <p className="text-xs text-muted-foreground font-medium truncate">{doctor.hospital}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5 text-sm font-medium">
                                                    <p className="text-xs"><strong className="font-bold text-foreground">Focus:</strong> <span className="text-muted-foreground">{doctor.mainDealing}</span></p>
                                                    <p className="text-xs"><strong className="font-bold text-foreground">Surgeries:</strong> <span className="text-muted-foreground">{doctor.surgeries}</span></p>
                                                    <p className="text-xs"><strong className="font-bold text-foreground">Availability:</strong> <span className="text-muted-foreground">{doctor.availability}</span></p>
                                                </div>
                                                <Separator />
                                                 <div className="flex justify-between items-center gap-2">
                                                    <p className="text-xl font-bold" style={{color: 'hsl(var(--nav-appointments))'}}>₹{doctor.opFee}</p>
                                                    <div className="flex shrink-0 gap-2">
                                                        <Button variant="outline" size="sm" onClick={() => handleViewProfile(doctor)}>View Profile</Button>
                                                        <Button size="sm" style={{backgroundColor: 'hsl(var(--nav-appointments))'}} onClick={() => handleBookAppointment(doctor)}>
                                                            Book
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )) : (
                                        <div className="text-center p-8 text-muted-foreground">
                                            <p>No doctors found matching your criteria. Try broadening your search.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="history" className="mt-6">
                     <Card className="border">
                        <CardHeader>
                             <div className="flex items-center gap-2">
                                <History className="h-6 w-6"/>
                                <h2 className="text-2xl font-bold">Appointments History</h2>
                            </div>
                            <Separator className="my-4"/>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                                <div className="relative md:col-span-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input 
                                        placeholder="Search by name, problem..." 
                                        className="pl-10"
                                        value={historySearchTerm}
                                        onChange={(e) => setHistorySearchTerm(e.target.value)}
                                    />
                                </div>
                                <Select value={filterDoctor} onValueChange={setFilterDoctor}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Doctors" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {allDoctors.map(doc => <SelectItem key={doc} value={doc}>{doc === 'all' ? 'All Doctors' : doc}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                        "justify-start text-left font-normal",
                                        !filterDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {filterDate ? filterDate.toLocaleDateString() : <span>Filter by date</span>}
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
                                    Clear Filters
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                             <div className="grid grid-cols-1 gap-6">
                                {filteredAppointments.length > 0 ? filteredAppointments.map((appt, index) => (
                                    <Collapsible key={index} className="border rounded-lg bg-background">
                                        <CollapsibleTrigger className="w-full p-4 hover:bg-muted/50 transition-colors flex items-start justify-between text-left">
                                            <div className="flex-1 flex items-start gap-3">
                                                <span className="text-2xl font-bold text-blue-900 dark:text-blue-400">{filteredAppointments.indexOf(appt) + 1})</span>
                                                <div>
                                                    <p className="text-xl font-bold">{appt.problem}</p>
                                                    <div className="text-base font-semibold text-muted-foreground mt-1">{appt.specialty}</div>
                                                    <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2"><Calendar className="h-4 w-4"/> First seen: {appt.date} by {appt.initialDoctor}</div>
                                                </div>
                                            </div>
                                            <ChevronDown className="h-6 w-6 transition-transform duration-200 [&[data-state=open]]:rotate-180 flex-shrink-0 mt-1" />
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="p-4 border-t space-y-4 bg-muted/20">
                                            <div className="flex justify-end items-center">
                                                <Button size="sm" onClick={() => handleOpenForm(index)}>
                                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Follow-up
                                                </Button>
                                            </div>
                                            {appt.prescriptions.length > 0 ? (
                                                <div className="space-y-4">
                                                    {appt.prescriptions.map((item, pIndex) => (
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
                                                                <div className='p-4 border bg-background rounded-lg'>
                                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                                                                        <div className="font-semibold text-sm flex items-center gap-2 flex-wrap">
                                                                            <span className="text-lg font-bold text-blue-900 dark:text-blue-400">{filteredAppointments.indexOf(appt) + 1}.{pIndex + 1})</span>
                                                                            <span>{item.title}</span>
                                                                            <span className="hidden sm:inline mx-1 text-muted-foreground">•</span>
                                                                            <span className="font-bold" style={{color: 'hsl(var(--nav-appointments))'}}>{item.doctor}</span>
                                                                            <span className="hidden sm:inline mx-1 text-muted-foreground">•</span>
                                                                            <span>{item.date}</span>
                                                                        </div>
                                                                        <Badge variant={item.status === 'Completed' ? 'secondary' : 'default'} className={cn('w-fit mt-2 sm:mt-0', item.status === 'Active' ? 'bg-green-100 text-green-800' : '', item.status === 'Improved' || item.status === 'Resolved' ? 'bg-blue-100 text-blue-800' : '', item.status === 'Action Required' ? 'bg-yellow-100 text-yellow-800' : '')}>{item.status}</Badge>
                                                                    </div>
                                                                    
                                                                    <div className="flex items-center gap-2 flex-wrap overflow-x-auto pb-2">
                                                                         <Dialog>
                                                                            <DialogTrigger asChild>
                                                                                <Button size="sm" style={{backgroundColor: 'hsl(var(--nav-appointments))'}}>
                                                                                    <View className="mr-2 h-4 w-4" /> View Details
                                                                                </Button>
                                                                            </DialogTrigger>
                                                                            <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0 border">
                                                                                <DialogHeader className="p-6 pb-4">
                                                                                    <DialogTitle>{item.title}</DialogTitle>
                                                                                    <DialogDescription>
                                                                                        Follow-up from {item.date} by <span className="font-bold" style={{color: 'hsl(var(--nav-appointments))'}}>{item.doctor}</span>.
                                                                                    </DialogDescription>
                                                                                </DialogHeader>
                                                                                <div className="overflow-y-auto px-6 pb-6 space-y-6 flex-1">
                                                                                    
                                                                                    {item.prescriptionImages && item.prescriptionImages.length > 0 && (
                                                                                        <div>
                                                                                            <h4 className='font-semibold mb-2 text-base'>Prescription Images</h4>
                                                                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                                                                {item.prescriptionImages.map((img: any, imgIndex: number) => (
                                                                                                    <div key={imgIndex} className="cursor-pointer group relative" onClick={() => setZoomedImage(img.url)}>
                                                                                                        <Image 
                                                                                                            src={img.url} 
                                                                                                            alt={`Prescription for ${item.title} - Page ${imgIndex + 1}`}
                                                                                                            width={150}
                                                                                                            height={210}
                                                                                                            data-ai-hint={img.dataAiHint}
                                                                                                            className="rounded-lg border group-hover:opacity-80 transition-opacity w-full h-auto object-cover"
                                                                                                        />
                                                                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                                                                                            <Search className="text-white h-6 w-6" />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ))}
                                                                                            </div>
                                                                                            <Separator className="my-4" />
                                                                                        </div>
                                                                                    )}
                                                                                    
                                                                                    {item.medicines && item.medicines.length > 0 && (
                                                                                        <div>
                                                                                            <h4 className='font-semibold mb-2 text-base'>Medications</h4>
                                                                                            <div className="flex flex-wrap gap-2">
                                                                                                {item.medicines.map((med: string) => <Badge key={med} variant='secondary' className="text-sm">{med}</Badge>)}
                                                                                            </div>
                                                                                             <Separator className="my-4" />
                                                                                        </div>
                                                                                    )}
                                                                                    
                                                                                    {item.summary && (
                                                                                        <div>
                                                                                            <h4 className='font-semibold mb-2 text-base'>Condition Summary</h4>
                                                                                            <p className='text-sm text-muted-foreground'>{item.summary}</p>
                                                                                             <Separator className="my-4" />
                                                                                        </div>
                                                                                    )}
                                                                                    
                                                                                    {item.details && item.details.length > 0 && (
                                                                                         <div>
                                                                                            <h4 className='font-semibold mb-2 text-base'>Test Results</h4>
                                                                                            <div className="space-y-2">
                                                                                                {item.details.map((detail, dIndex) => (
                                                                                                    <div key={dIndex} className="p-3 border rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                                                                        <div className='mb-2 sm:mb-0'>
                                                                                                            <p className="font-bold">{detail.name}</p>
                                                                                                            <Badge variant={getReportStatusBadge(detail.status)}>{detail.status}</Badge>
                                                                                                        </div>
                                                                                                        <ViewReportDialog report={detail}>
                                                                                                            <Button variant="outline" size="sm">
                                                                                                                <View className="mr-2 h-4 w-4" /> View Report
                                                                                                            </Button>
                                                                                                        </ViewReportDialog>
                                                                                                    </div>
                                                                                                ))}
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </DialogContent>
                                                                        </Dialog>

                                                                       <UploadDialog
                                                                            trigger={
                                                                                <Button variant="outline" size="sm">
                                                                                    <Upload className="mr-2 h-4 w-4" /> Upload
                                                                                </Button>
                                                                            }
                                                                            appointmentId={index}
                                                                            prescriptionId={pIndex}
                                                                            onUpload={handleUpload}
                                                                        />
                                                                        <Button variant="outline" size="sm" onClick={() => handleOpenForm(index, pIndex)}>
                                                                            <Pencil className="mr-2 h-4 w-4" /> Edit
                                                                        </Button>
                                                                        <AlertDialog>
                                                                            <AlertDialogTrigger asChild>
                                                                                <Button variant="outline" size="sm" className="text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive">
                                                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                                                </Button>
                                                                            </AlertDialogTrigger>
                                                                            <AlertDialogContent>
                                                                                <AlertDialogHeader>
                                                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                                <AlertDialogDescription>
                                                                                    This action cannot be undone. This will permanently delete the follow-up entry for "{item.title}".
                                                                                </AlertDialogDescription>
                                                                                </AlertDialogHeader>
                                                                                <AlertDialogFooter>
                                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                <AlertDialogAction onClick={() => handleDeleteFollowUp(index, pIndex)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                                                                </AlertDialogFooter>
                                                                            </AlertDialogContent>
                                                                        </AlertDialog>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-base text-muted-foreground text-center py-4">No follow-ups recorded for this issue yet. Click "Add Follow-up" to start.</p>
                                            )}
                                        </CollapsibleContent>
                                    </Collapsible>
                                )) : (
                                    <div className="text-center p-8 text-muted-foreground">No appointments match your filters.</div>
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
                <DialogContent className="sm:max-w-2xl border">
                    {selectedDoctor && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-4">
                                     <Avatar className="h-20 w-20 border" style={{borderColor: 'hsl(var(--nav-appointments))'}}>
                                        <AvatarImage src={selectedDoctor.avatar} data-ai-hint={selectedDoctor.dataAiHint} />
                                        <AvatarFallback>{selectedDoctor.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <DialogTitle className="text-2xl">{selectedDoctor.name}</DialogTitle>
                                        <DialogDescription className="text-base" style={{color: 'hsl(var(--nav-appointments))'}}>{selectedDoctor.specialty}</DialogDescription>
                                        <p className="text-sm text-muted-foreground">{selectedDoctor.experience} years of experience</p>
                                    </div>
                                </div>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="p-4 rounded-lg bg-muted/50 border">
                                    <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                        <Wifi style={{color: 'hsl(var(--nav-appointments))'}}/>
                                        Availability
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
                                <div className="p-4 rounded-lg bg-muted/50 border">
                                    <h4 className="font-semibold text-lg mb-2">{selectedDoctor.hospital}</h4>
                                    <div className="space-y-2 text-sm">
                                        <p className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-1 flex-shrink-0"/> {hospitalsData[selectedDoctor.hospital as keyof typeof hospitalsData]?.address}</p>
                                        <p className="flex items-center gap-2"><Phone className="h-4 w-4"/> {hospitalsData[selectedDoctor.hospital as keyof typeof hospitalsData]?.phone}</p>
                                        <a href={hospitalsData[selectedDoctor.hospital as keyof typeof hospitalsData]?.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                                            <Globe className="h-4 w-4"/> Visit Website
                                        </a>
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg bg-muted/50 border">
                                    <h4 className="font-semibold text-lg mb-2">Consultation Fee</h4>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-bold" style={{color: 'hsl(var(--nav-appointments))'}}>₹{selectedDoctor.opFee}</p>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => handleShare(selectedDoctor)} disabled={isSharing}>
                                        {isSharing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Copy className="mr-2 h-4 w-4" />}
                                        {isSharing ? 'Copying...' : 'Copy Details'}
                                    </Button>
                                     <Button style={{backgroundColor: 'hsl(var(--nav-appointments))'}} onClick={() => handleBookAppointment(selectedDoctor)}>
                                        Book Appointment
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
                        <DialogTitle>{editingFollowUp?.pIndex !== undefined ? 'Edit Follow-up' : 'Add New Follow-up'}</DialogTitle>
                        <DialogDescription>
                            {editingFollowUp?.pIndex !== undefined ? 'Update the details for this entry.' : `Add a new follow-up for "${appointments[editingFollowUp?.apptIndex || 0]?.problem}".`}
                        </DialogDescription>
                    </DialogHeader>
                    {editingFollowUp && (
                        <FollowUpForm
                            appointmentId={editingFollowUp.apptIndex}
                            existingFollowUp={editingFollowUp.pIndex !== undefined ? appointments[editingFollowUp.apptIndex].prescriptions[editingFollowUp.pIndex] : undefined}
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
