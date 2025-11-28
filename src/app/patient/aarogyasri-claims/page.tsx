
'use client';

import React, { useState, useMemo, Suspense, useTransition, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sparkles, Loader2, CheckCircle, XCircle, Info, FileText, Upload, Phone, ShieldAlert, BookOpen, User, Calendar, Briefcase, Bot, Paperclip, Send, Hospital, Share2, Download, Eye, EyeOff, ShieldCheck, FileWarning, Camera, ArrowRight, Check, Wallet, Banknote, Gift, MessageSquare, View, ChevronDown, Star, UserCheck, History } from "lucide-react";
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { GovIdIcon } from '@/components/icons/gov-id-icon';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { preAuth, PreAuthOutput } from '@/ai/flows/ai-pre-auth';
import { previousAppointments } from '@/lib/appointments-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GovIdCard } from '@/components/layout/gov-id-card';

const insuranceData = {
    ntrVaidyaseva: {
        name: "Dr. NTR Vaidyaseva Trust",
        uhid: "AARYS123456789",
        frontImage: "https://picsum.photos/seed/ysr_front/400/250",
        backImage: "https://picsum.photos/seed/ysr_back/400/250",
    }
};

const pastNTRVaidyasevaClaimsData = [
    {
        id: "ARS-2025-00487",
        hospital: "Sunrise Multispeciality, Vijayawada",
        procedure: "Appendectomy",
        claimDate: "2023-11-02",
        sanctionedAmount: 50000,
        finalBillAmount: 40000,
        refundAmount: 10000,
        status: "Claim Settled",
        expenditure: [
            { item: "Room Rent (General Ward)", amount: 5000, details: {days: 2, costPerDay: 2500, note: "2 days stay in General Ward at ₹2500/day."} },
            { item: "Surgeon Fees", amount: 15000, details: { doctor: "Dr. Ashok", note: "Dr. Ashok's fee for Appendectomy surgery." } },
            { item: "Anesthetist Fees", amount: 5000, details: { doctor: "Dr. Priya", note: "Anesthesia administration for the procedure." } },
            { item: "Pharmacy & Consumables", amount: 8000, details: [ { med: 'IV Fluids', cost: 1000 }, { med: 'Antibiotics', cost: 3000 }, { med: 'Painkillers', cost: 1500 }, { med: 'Surgical Supplies', cost: 2500 } ] },
            { item: "Diagnostic Tests (Blood, USG)", amount: 7000, details: [ { test: 'Complete Blood Count', result: 'Normal', bill: 500 }, { test: 'Ultrasound Abdomen', result: 'Shows inflamed appendix', bill: 1500 }, { test: 'Post-op Blood Test', result: 'Normal', bill: 500 } ] },
        ],
        tracking: [
            { stage: "Vaidya Mithra Registration", status: "Completed", date: "2023-11-02", details: "Patient registered at the hospital's NTR Vaidyaseva desk by Aarogyamithra." },
            { stage: "Cashless Diagnostics", status: "Completed", date: "2023-11-02", details: "Initial diagnostic tests (Blood test, Ultrasound) were conducted on a cashless basis." },
            { stage: "Preauthorization Request", status: "Completed", date: "2023-11-02", details: "Hospital has submitted a pre-authorization request for Appendectomy." },
            { stage: "AI Verification (Arogyadhatha)", status: "Completed", date: "2023-11-02", details: "Arogyadhatha AI has verified your reports for accuracy and confirmed medical necessity based on the diagnosis." },
            { stage: "Preauthorization by Panel Doctor", status: "Completed", date: "2023-11-03", details: "Your case was reviewed and approved by an NTR Vaidyaseva-empanelled doctor." },
            { stage: "Preauthorization by Trust Doctor", status: "Completed", date: "2023-11-03", details: "Final approval granted by the NTR Vaidyaseva Trust doctor." },
            { stage: "Surgery/Treatment", status: "Completed", date: "2023-11-04", details: "Your Appendectomy surgery was successfully completed." },
            { stage: "Cashless Post-op Diagnostics", status: "Completed", date: "2023-11-05", details: "Post-operative diagnostic tests conducted on a cashless basis." },
            { stage: "Discharge", status: "Completed", date: "2023-11-05", details: "Patient has been discharged from the hospital after successful recovery." },
            { stage: "Follow up", status: "Completed", date: "2023-11-12", details: "Scheduled for a follow-up visit on Nov 12th." },
            { stage: "Claim Initiated", status: "Completed", date: "2023-11-06", details: "Final bill and discharge summary submitted to the Trust for claim settlement." },
            { stage: "Social Audit & Feedback", status: "Completed", date: "2023-11-07", details: "Patient feedback collected and audit completed." },
        ]
    },
    {
        id: "ARS-2024-00132",
        hospital: "Care Hospital, Guntur",
        procedure: "Angioplasty",
        claimDate: "2024-03-22",
        sanctionedAmount: 125000,
        finalBillAmount: null,
        refundAmount: null,
        status: "Preauthorization by Panel Doctor",
        expenditure: [],
        tracking: [
            { stage: "Vaidya Mithra Registration", status: "Completed", date: "2024-03-22", details: "Patient registration completed." },
            { stage: "Cashless Diagnostics", status: "Completed", date: "2024-03-22", details: "ECG and blood tests conducted." },
            { stage: "Preauthorization Request", status: "Completed", date: "2024-03-22", details: "Hospital submitted request for Angioplasty." },
            { stage: "AI Verification (Arogyadhatha)", status: "Active", date: "2024-03-23", details: "Arogyadhatha AI has flagged the reports for manual review due to missing diagnostic details. Awaiting second opinion." },
            { stage: "Preauthorization by Panel Doctor", status: "Pending", date: null, details: "Pending AI verification and second opinion." },
            { stage: "Preauthorization by Trust Doctor", status: "Pending", date: null, details: "Pending panel doctor approval." },
            { stage: "Surgery/Treatment", status: "Pending", date: null, details: "Pending pre-authorization." },
            { stage: "Cashless Post-op Diagnostics", status: "Pending", date: null, details: "Pending treatment." },
            { stage: "Discharge", status: "Pending", date: null, details: "Pending treatment completion." },
            { stage: "Follow up", status: "Pending", date: null, details: "Pending discharge." },
            { stage: "Claim Initiated", status: "Pending", date: null, details: "Pending discharge." },
            { stage: "Social Audit & Feedback", status: "Pending", date: null, details: "Pending claim settlement." },
        ]
    }
];

const surgeryOptions = [
    "Appendectomy", "CABG (Bypass Surgery)", "Cataract Surgery", "C-Section", "Gallbladder Removal",
    "Heart Valve Replacement", "Hernia Repair", "Hip Replacement", "Hysterectomy", "Kidney Stone Removal",
    "Kidney Transplant", "Knee Replacement", "Liver Transplant", "Stent (Angioplasty)",
];


const ClaimTracker = ({ claim }: { claim: any }) => {
    return (
        <div className="space-y-4">
            {claim.tracking.map((step: any, index: number) => (
                 <div key={index} className="flex items-start gap-4">
                     <div className="flex flex-col items-center">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center border-2",
                            step.status === 'Completed' && "bg-primary text-primary-foreground border-primary",
                            step.status === 'Active' && "bg-primary text-primary-foreground border-primary animate-pulse",
                            step.status === 'Pending' && "bg-muted border-dashed"
                        )} style={{
                           ...(step.status === 'Completed' && { backgroundColor: `hsl(var(--primary))`, borderColor: `hsl(var(--primary))` }),
                           ...(step.status === 'Active' && { backgroundColor: `hsl(var(--primary))`, borderColor: `hsl(var(--primary))` })
                        }}>
                            {step.status === 'Completed' ? <Check className="h-5 w-5" /> : <p className={cn("font-bold text-xs", step.status === 'Active' && 'text-white')}>{index + 1}</p>}
                        </div>
                        {index < claim.tracking.length - 1 && (
                            <div className={cn("w-0.5 flex-1", step.status === 'Completed' ? "bg-primary" : "bg-border")} style={{ backgroundColor: step.status === 'Completed' ? `hsl(var(--primary))` : undefined }} />
                        )}
                    </div>
                    <div className="flex-1 pb-4">
                        <div className="flex justify-between items-center">
                             <p className={cn("font-semibold", (step.status === 'Active' || step.status === 'Completed') && `text-primary`)} style={{ color: (step.status === 'Active' || step.status === 'Completed') ? `hsl(var(--primary))` : '' }}>{step.stage}</p>
                             {step.details && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="link" size="sm" className="p-0 h-auto text-xs">View Details</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Details for: {step.stage}</DialogTitle>
                                        </DialogHeader>
                                        <div className="py-4 text-sm text-muted-foreground">{step.details}</div>
                                    </DialogContent>
                                </Dialog>
                             )}
                        </div>
                        <p className="text-xs text-muted-foreground">{step.date ? (new Date(step.date).toLocaleDateString()) : 'Pending'}</p>
                    </div>
                </div>
            ))}

            {claim.refundAmount > 0 && (
                <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                         <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 bg-green-100 text-green-700 border-green-300">
                           <Banknote className="h-5 w-5"/>
                        </div>
                    </div>
                     <div>
                        <p className="font-semibold text-green-700">Refund to Government</p>
                        <p className="text-xs text-muted-foreground">₹{claim.refundAmount.toLocaleString('en-IN')} returned to the government.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

function ExpenditureDetailDialog({ item }: { item: any }) {
    
    const renderDetails = () => {
        if (typeof item.details === 'string' || item.details.note) {
            return <p>{item.details.note || item.details}</p>;
        }

        if (Array.isArray(item.details) && item.details[0]?.med) { // Pharmacy
            return (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Medicine/Consumable</TableHead>
                            <TableHead className="text-right">Cost</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {item.details.map((d: any, i: number) => (
                            <TableRow key={i}>
                                <TableCell>{d.med}</TableCell>
                                <TableCell className="text-right">₹{d.cost.toLocaleString('en-IN')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            );
        }

        if (Array.isArray(item.details) && item.details[0]?.test) { // Diagnostics
            return (
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Test Name</TableHead>
                            <TableHead>Result</TableHead>
                            <TableHead className="text-right">Bill</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {item.details.map((d: any, i: number) => (
                            <TableRow key={i}>
                                <TableCell>{d.test}</TableCell>
                                <TableCell><Badge variant="outline">{d.result}</Badge></TableCell>
                                <TableCell className="text-right">₹{d.bill.toLocaleString('en-IN')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            );
        }

        return <p>Details not available in the expected format.</p>;
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="w-full text-left text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition-colors">
                    <div className="flex justify-between font-semibold">
                        <span>{item.item}</span>
                        <span>₹{item.amount.toLocaleString('en-IN')}</span>
                    </div>
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Expenditure Details: {item.item}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    {renderDetails()}
                </div>
            </DialogContent>
        </Dialog>
    )
}

function VerificationDialog({ claim }: { claim: any }) {
    const { toast } = useToast();
    const [otp, setOtp] = useState('');
    const [selfie, setSelfie] = useState<File | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    
    const handleVerify = () => {
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            toast({
                title: "Claim Verified & Closed",
                description: `Claim ID ${claim.id} has been successfully verified and closed.`,
            });
        }, 2000);
    }
    
    const totalExpenditure = claim.expenditure.reduce((acc: number, item: any) => acc + item.amount, 0);
    const difference = claim.sanctionedAmount - totalExpenditure;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    className="w-full border"
                >
                    {claim.status === 'Claim Settled' ? <FileText className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                    {claim.status === 'Claim Settled' ? 'View Final Bill' : 'View & Verify Bill'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg border">
                <DialogHeader>
                    <DialogTitle>Verify Final Bill for Claim: {claim.id}</DialogTitle>
                    <DialogDescription>
                        Please review the hospital's final expenditure report and verify with OTP and selfie to close the claim.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto p-1 space-y-4">
                    <Card className="border">
                        <CardHeader className="p-4">
                            <CardTitle>Expenditure Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-1">
                                {claim.expenditure.map((item: any, index: number) => (
                                    <ExpenditureDetailDialog key={index} item={item} />
                                ))}
                            </div>
                             <Separator className="my-4" />
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between font-semibold"><p>Total Sanctioned:</p> <p>₹{claim.sanctionedAmount.toLocaleString('en-IN')}</p></div>
                                <div className="flex justify-between font-semibold"><p>Total Spent:</p> <p>₹{totalExpenditure.toLocaleString('en-IN')}</p></div>
                                <div className={cn("flex justify-between font-bold text-base", difference >= 0 ? "text-green-600" : "text-red-600")}>
                                    <p>{difference >= 0 ? "Refundable to Govt:" : "Over-billed:"}</p>
                                    <p>₹{Math.abs(difference).toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border">
                        <CardHeader className="p-4">
                            <CardTitle>Patient Verification</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-4">
                             <div className="space-y-2">
                                <Label htmlFor="otp">Enter OTP sent to your registered mobile</Label>
                                <Input id="otp" type="number" placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label>Discharge Selfie</Label>
                                <Button asChild variant="outline" className="w-full border-dashed border-2">
                                    <label className="cursor-pointer">
                                        <Camera className="mr-2 h-4 w-4"/>
                                        {selfie ? selfie.name : "Take Verification Selfie"}
                                        <input type="file" accept="image/*" capture="user" className="hidden" onChange={(e) => setSelfie(e.target.files?.[0] || null)} />
                                    </label>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="destructive" className="w-full sm:w-auto">
                                <FileWarning className="mr-2 h-4 w-4" /> Raise a Complaint
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Raise Complaint for Claim: {claim.id}</DialogTitle>
                            </DialogHeader>
                            <Textarea placeholder="Please describe your issue with the billing or treatment..." rows={5}/>
                            <Button variant="destructive" className="w-full">Submit Complaint</Button>
                        </DialogContent>
                    </Dialog>
                    <Button 
                        className="w-full sm:w-auto" 
                        style={{backgroundColor: 'hsl(var(--primary))'}} 
                        disabled={!otp || !selfie || isVerifying}
                        onClick={handleVerify}
                    >
                        {isVerifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4" />}
                        {isVerifying ? 'Verifying...' : 'Verify & Close Claim'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function PreAuthComponent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const insuranceName = searchParams.get('name') || 'Dr. NTR Vaidyaseva Trust';

    const [selectedProblem, setSelectedProblem] = useState('');
    const [proposedSurgery, setProposedSurgery] = useState('');
    const [isPending, startTransition] = useTransition();
    const [analysisResult, setAnalysisResult] = useState<PreAuthOutput | null>(null);
    const [newProblem, setNewProblem] = useState('');
    const [fileName, setFileName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState<'aarogyamithra' | 'insurance' | 'secondOpinion' | null>(null);
    const [submissionStatus, setSubmissionStatus] = useState<any>(null);
    const [secondOpinionStatus, setSecondOpinionStatus] = useState<'idle' | 'pending' | 'approved'>('idle');

    const problems = useMemo(() => previousAppointments.map(appt => appt.problem), []);

    const handleSubmit = (e: React.FormEvent, type: 'history' | 'new') => {
        e.preventDefault();
        const healthProblem = type === 'history' ? selectedProblem : newProblem;

        if (!healthProblem || !proposedSurgery) return;
        if (type === 'new' && !fileName) {
            alert("Please upload supporting documents for a new problem.");
            return;
        }
        
        setAnalysisResult(null);
        setSubmissionStatus(null);
        setIsSubmitting(null);
        setSecondOpinionStatus('idle');

        startTransition(async () => {
            const documentContent = type === 'new' ? `Patient Name: Chinta Lokesh Babu, Age: 27\nDoctor's Note: Patient reports severe stomach pain localized in the lower right quadrant. Physical examination shows rebound tenderness. Suspected acute appendicitis.\nRecommendation: Immediate surgical consultation for appendectomy.` : undefined;
            const result = await preAuth({ healthProblem, proposedSurgery, documentContent });
            setAnalysisResult(result);
        });
    };
    
    const handleSecondOpinion = () => {
        setIsSubmitting('secondOpinion');
        setTimeout(() => {
            setSecondOpinionStatus('approved');
            setIsSubmitting(null);
        }, 1500);
    }
    
    const handleSubmission = (type: 'aarogyamithra' | 'insurance') => {
        setIsSubmitting(type);
        setTimeout(() => {
            setSubmissionStatus({
                type: type,
                id: `CLAIM-${Date.now()}`,
                amount: `₹${(Math.random() * 200000 + 50000).toFixed(0)}`,
                status: 'Pending Approval',
                date: new Date().toISOString()
            });
            setIsSubmitting(null);
        }, 1500);
    };

    const isSubmissionDisabled = !analysisResult || !!isSubmitting || (analysisResult.decision === 'FLAGGED FOR REVIEW' && secondOpinionStatus !== 'approved');

    return (
        <div className="space-y-6">
             <Alert className="bg-blue-50 border-blue-200 text-blue-800 [&>svg]:text-blue-600">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle className="font-bold">How This Works</AlertTitle>
                <AlertDescription>
                    This AI tool is a **gatekeeper**, not a final judge. It analyzes data to fast-track clearly justified claims and is based on **ICMR Approved Info**. If a claim is ambiguous or lacks evidence, it is **FLAGGED for a mandatory second opinion** from a human doctor. No claim is ever rejected by AI alone.
                </AlertDescription>
            </Alert>
            <Tabs defaultValue="history" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="history">From Patient History</TabsTrigger>
                    <TabsTrigger value="new">New Health Problem</TabsTrigger>
                </TabsList>
                <TabsContent value="history">
                    <form onSubmit={(e) => handleSubmit(e, 'history')}>
                        <CardContent className="space-y-4 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="health-problem">Patient's Health Problem</Label>
                                {problems.length > 0 ? (
                                    <Select onValueChange={setSelectedProblem} value={selectedProblem}>
                                        <SelectTrigger id="health-problem" className="border"><SelectValue placeholder="Select a health problem from history" /></SelectTrigger>
                                        <SelectContent>{problems.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                                    </Select>
                                ) : (
                                    <div className='p-4 border-2 border-dashed rounded-lg text-center'>
                                        <p className="text-sm text-muted-foreground">No health history found.</p>
                                        <Button 
                                            variant="link" 
                                            className="h-auto p-0 mt-1" 
                                            onClick={() => router.push('/appointments?tab=history&action=new-problem')}
                                        >
                                            Create New Health Problem in History
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="proposed-surgery-history">Proposed Surgery / Procedure</Label>
                                <Select onValueChange={setProposedSurgery} value={proposedSurgery}>
                                    <SelectTrigger id="proposed-surgery-history" className="border"><SelectValue placeholder="Select a standard procedure" /></SelectTrigger>
                                    <SelectContent>{surgeryOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full" style={{backgroundColor: 'hsl(var(--primary))'}} disabled={isPending || !selectedProblem || !proposedSurgery}>
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                {isPending ? 'Analyzing...' : 'Run AI Necessity Check'}
                            </Button>
                        </CardFooter>
                    </form>
                </TabsContent>
                <TabsContent value="new">
                    <form onSubmit={(e) => handleSubmit(e, 'new')}>
                         <CardContent className="space-y-4 pt-6">
                           {/* Form fields for new problem */}
                            <div className="space-y-2">
                                <Label htmlFor="new-health-problem">New Health Problem</Label>
                                <Input id="new-health-problem" placeholder="e.g., Acute Appendicitis" value={newProblem} onChange={(e) => setNewProblem(e.target.value)} className="border"/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="proposed-surgery-new">Proposed Surgery / Procedure</Label>
                                <Select onValueChange={setProposedSurgery} value={proposedSurgery}>
                                    <SelectTrigger id="proposed-surgery-new" className="border"><SelectValue placeholder="Select a standard procedure" /></SelectTrigger>
                                    <SelectContent>{surgeryOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="documents">Supporting Documents *</Label>
                                <Button asChild variant="outline" className="w-full justify-start text-left border-dashed border-2">
                                    <label className="cursor-pointer flex items-center">
                                        <Upload className="mr-2 h-4 w-4"/><span className="text-muted-foreground flex-1">{fileName || 'Upload Scans, Reports, or Doctor\'s Note (PDF/Image)'}</span>
                                        <input id="doc-upload" type="file" className="hidden" onChange={(e) => setFileName(e.target.files?.[0].name || '')} />
                                    </label>
                                </Button>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full" style={{backgroundColor: 'hsl(var(--primary))'}} disabled={isPending || !newProblem || !proposedSurgery || !fileName}>
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                {isPending ? 'Analyzing...' : 'Run AI Necessity Check'}
                            </Button>
                        </CardFooter>
                    </form>
                </TabsContent>
            </Tabs>
            
            {isPending && (
                <Card className="text-center p-8 border-2 border-foreground shadow-md">
                    <Loader2 className="h-12 w-12 text-muted-foreground animate-spin mx-auto"/>
                    <h3 className="text-xl font-bold mt-4">Analyzing Documents...</h3>
                    <p className="text-muted-foreground">The AI is cross-referencing all available reports for "{selectedProblem || newProblem}".</p>
                </Card>
            )}

            {analysisResult && (
                <Card className="border-2 border-foreground shadow-md">
                    <CardHeader>
                        <CardTitle>AI Analysis Result & Claim Packet</CardTitle>
                    </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="p-4 rounded-lg border bg-muted/30">
                            <h3 className="font-bold text-lg mb-4">Pre-Authorization Summary</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground"/> Patient: <span className="font-semibold">Chinta Lokesh Babu (PAT001)</span></div>
                                <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-muted-foreground"/> Health Problem: <span className="font-semibold">{selectedProblem || newProblem}</span></div>
                                <div className="flex items-center gap-2"><Bot className="h-4 w-4 text-muted-foreground"/> Proposed Surgery: <span className="font-semibold">{proposedSurgery}</span></div>
                                <div className="flex items-center gap-2"><Paperclip className="h-4 w-4 text-muted-foreground"/> Supporting Evidence: <span className="font-semibold">{fileName ? `Uploaded Document (${fileName})` : 'From Patient History'}</span></div>
                                <Separator className="my-3"/>
                                <div className="flex items-start gap-2">
                                    <div className="mt-1">
                                        {analysisResult.decision === 'APPROVED' ? <CheckCircle className="h-4 w-4 text-green-500"/> : <XCircle className="h-4 w-4 text-red-500"/>}
                                    </div>
                                    <div>
                                        <p className="font-bold">AI Necessity Check: <span className={analysisResult.decision === 'APPROVED' ? 'text-green-600' : 'text-red-600'}>{analysisResult.decision}</span></p>
                                        <p className="text-xs text-muted-foreground">{analysisResult.reasoning}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {analysisResult.decision === 'FLAGGED FOR REVIEW' && (
                            <div className="p-4 rounded-lg border bg-muted/30">
                                <h3 className="font-bold text-lg mb-2">Second Opinion Required</h3>
                                {secondOpinionStatus === 'idle' && (
                                    <>
                                        <p className="text-sm text-muted-foreground mb-4">Because the AI found ambiguity, this case requires a manual second opinion from a verified doctor to proceed.</p>
                                        <Button className="w-full" onClick={handleSecondOpinion} disabled={isSubmitting === 'secondOpinion'}>
                                            {isSubmitting === 'secondOpinion' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <UserCheck className="mr-2 h-4 w-4"/>}
                                            {isSubmitting === 'secondOpinion' ? 'Finding Doctor...' : 'Get Second Opinion from Verified Doctor'}
                                        </Button>
                                    </>
                                )}
                                {secondOpinionStatus === 'approved' && (
                                     <div className="flex items-center gap-3 text-green-600">
                                        <CheckCircle className="h-6 w-6"/>
                                        <div>
                                            <p className="font-bold">Second Opinion: Approved</p>
                                            <p className="text-sm">A verified doctor has reviewed the case and confirmed that the surgery is medically necessary. You can now submit the claim.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" disabled={isSubmissionDisabled} onClick={() => handleSubmission('aarogyamithra')}>
                            {isSubmitting === 'aarogyamithra' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>}
                            {isSubmitting ? 'Submitting...' : 'Submit to Arogyamithra'}
                        </Button>
                    </CardFooter>
                </Card>
            )}
             {submissionStatus && (
                <Card className="border-2 border-green-500 bg-green-50/50">
                    <CardHeader><CardTitle className="text-green-700 flex items-center gap-2"><CheckCircle /> Claim Submitted</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Claim ID:</strong> {submissionStatus.id}</p>
                        <p><strong>Submitted To:</strong> Arogyamithra</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function NTRVaidyasevaClaimsPageComponent() {
    const [claims, setClaims] = useState(pastNTRVaidyasevaClaimsData);
    
    // This effect ensures date formatting happens only on the client
    useEffect(() => {
        setClaims(pastNTRVaidyasevaClaimsData.map(claim => ({
            ...claim,
            formattedClaimDate: format(new Date(claim.claimDate), "dd MMM, yyyy")
        })));
    }, []);

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold" style={{color: 'hsl(var(--primary))'}}>Dr. NTR Vaidyaseva Claims</h1>
                <p className="text-muted-foreground mt-2">Track your government health scheme claims from start to finish.</p>
            </div>
            
            <GovIdCard
                title={insuranceData.ntrVaidyaseva.name}
                idLabel="UHID"
                idValue={insuranceData.ntrVaidyaseva.uhid}
                frontImage={insuranceData.ntrVaidyaseva.frontImage}
                backImage={insuranceData.ntrVaidyaseva.backImage}
            />

            
             <Tabs defaultValue="claims" className="w-full">
                <div className="border-2 border-foreground shadow-md rounded-lg p-1 bg-muted">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="claims" className="font-bold">My Claims</TabsTrigger>
                        <TabsTrigger value="pre-auth" className="font-bold">Pre-Authorization</TabsTrigger>
                    </TabsList>
                </div>

                 <TabsContent value="claims" className="mt-6">
                    <div className="space-y-4">
                        {claims.map((claim: any) => (
                            <Collapsible key={claim.id} className="border-2 rounded-lg bg-background">
                                <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 text-left">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-lg truncate">{claim.procedure}</p>
                                        <p className="text-sm text-muted-foreground truncate">{claim.hospital}</p>
                                        <p className="text-xs text-muted-foreground">{claim.formattedClaimDate || 'Loading...'}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 ml-4">
                                        <Badge variant={claim.status === 'Claim Settled' ? 'default' : 'destructive'} className={cn('w-fit', claim.status === 'Claim Settled' && 'bg-green-100 text-green-800 border-green-200')}>
                                            {claim.status}
                                        </Badge>
                                        <ChevronDown className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:-rotate-180" />
                                    </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="px-4 pb-4">
                                    <div className="space-y-4 pt-4 border-t">
                                        <div>
                                            <h4 className="text-sm font-semibold mb-3">Claim Status Tracker</h4>
                                            <ClaimTracker claim={claim} />
                                        </div>
                                        <div className="p-0 pt-4 mt-4 border-t">
                                            <VerificationDialog claim={claim} />
                                        </div>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        ))}
                    </div>
                 </TabsContent>
                 <TabsContent value="pre-auth" className="mt-6">
                    <Card className="border-2 border-foreground shadow-md">
                        <CardHeader>
                            <CardTitle>AI Pre-Authorization</CardTitle>
                            <CardDescription>Verify medical necessity for surgeries before approval.</CardDescription>
                        </CardHeader>
                        <PreAuthComponent />
                    </Card>
                 </TabsContent>
            </Tabs>

        </div>
    );
}


export default function NTRVaidyasevaClaimsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NTRVaidyasevaClaimsPageComponent />
        </Suspense>
    );
}

    

    
