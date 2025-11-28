

'use client';

import React, { useState, useTransition, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sparkles, Loader2, CheckCircle, XCircle, Info, FileText, Upload, Phone, ShieldAlert, BookOpen, User, Calendar, Briefcase, Bot, Paperclip, Send, UserCheck } from "lucide-react";
import { preAuth, PreAuthOutput } from '@/ai/flows/ai-pre-auth';
import { previousAppointments } from '@/lib/appointments-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const surgeryOptions = [
    "Appendectomy",
    "CABG (Bypass Surgery)",
    "Cataract Surgery",
    "C-Section",
    "Gallbladder Removal",
    "Heart Valve Replacement",
    "Hernia Repair",
    "Hip Replacement",
    "Hysterectomy",
    "Kidney Stone Removal",
    "Kidney Transplant",
    "Knee Replacement",
    "Liver Transplant",
    "Stent (Angioplasty)",
];


function PreAuthPageComponent() {
    const searchParams = useSearchParams();
    const insuranceName = searchParams.get('name') || 'Insurance';

    const [selectedProblem, setSelectedProblem] = useState('');
    const [proposedSurgery, setProposedSurgery] = useState('');
    const [isPending, startTransition] = useTransition();
    const [analysisResult, setAnalysisResult] = useState<PreAuthOutput | null>(null);
    const [newProblem, setNewProblem] = useState('');
    const [fileName, setFileName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState<'aarogyamithra' | 'insurance' | 'secondOpinion' | null>(null);
    const [submissionStatus, setSubmissionStatus] = useState<any>(null);
    const [secondOpinionStatus, setSecondOpinionStatus] = useState<'idle' | 'pending' | 'approved'>('idle');


    const problems = useMemo(() => {
        return previousAppointments.map(appt => appt.problem);
    }, []);

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
            const documentContent = type === 'new' ? `
                Patient Name: Chinta Lokesh Babu, Age: 27
                Doctor's Note: Patient reports severe stomach pain localized in the lower right quadrant. Physical examination shows rebound tenderness. Suspected acute appendicitis.
                Recommendation: Immediate surgical consultation for appendectomy.
            ` : undefined;

            const result = await preAuth({
                healthProblem: healthProblem,
                proposedSurgery: proposedSurgery,
                documentContent: documentContent,
            });
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
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold" style={{color: 'hsl(var(--primary))'}}>AI Pre-Authorization for {insuranceName}</h1>
                <p className="text-muted-foreground mt-2">Verify medical necessity for surgeries before approval.</p>
            </div>
            
            <Alert className="bg-blue-50 border-blue-200 text-blue-800 [&>svg]:text-blue-600">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle className="font-bold">How This Works</AlertTitle>
                <AlertDescription>
                    This AI tool is a **gatekeeper**, not a final judge. It analyzes data to fast-track clearly justified claims and is based on **ICMR Approved Info**. If a claim is ambiguous or lacks evidence, it is **FLAGGED for a mandatory second opinion** from a human doctor. No claim is ever rejected by AI alone.
                </AlertDescription>
            </Alert>

            <Card className="border-2 border-foreground shadow-md">
                <CardHeader>
                    <CardTitle>Create New Pre-Authorization Request</CardTitle>
                    <CardDescription>Select the patient's condition and enter the proposed surgery.</CardDescription>
                </CardHeader>
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
                                    <Select onValueChange={setSelectedProblem} value={selectedProblem}>
                                        <SelectTrigger id="health-problem" className="border">
                                            <SelectValue placeholder="Select a health problem from history" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {problems.map(problem => (
                                                <SelectItem key={problem} value={problem}>{problem}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="proposed-surgery-history">Proposed Surgery / Procedure</Label>
                                     <Select onValueChange={setProposedSurgery} value={proposedSurgery}>
                                        <SelectTrigger id="proposed-surgery-history" className="border">
                                            <SelectValue placeholder="Select a standard procedure" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {surgeryOptions.map(surgery => (
                                                <SelectItem key={surgery} value={surgery}>{surgery}</SelectItem>
                                            ))}
                                        </SelectContent>
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
                                 <div className="space-y-2">
                                    <Label htmlFor="new-health-problem">New Health Problem</Label>
                                    <Input
                                        id="new-health-problem"
                                        placeholder="e.g., Acute Appendicitis"
                                        value={newProblem}
                                        onChange={(e) => setNewProblem(e.target.value)}
                                        className="border"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="proposed-surgery-new">Proposed Surgery / Procedure</Label>
                                    <Select onValueChange={setProposedSurgery} value={proposedSurgery}>
                                        <SelectTrigger id="proposed-surgery-new" className="border">
                                            <SelectValue placeholder="Select a standard procedure" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {surgeryOptions.map(surgery => (
                                                <SelectItem key={surgery} value={surgery}>{surgery}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="documents">Supporting Documents *</Label>
                                     <Button asChild variant="outline" className="w-full justify-start text-left border-dashed border-2">
                                        <label className="cursor-pointer flex items-center">
                                            <Upload className="mr-2 h-4 w-4"/>
                                            <span className="text-muted-foreground flex-1">{fileName || 'Upload Scans, Reports, or Doctor\'s Note (PDF/Image)'}</span>
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
                 <div className="p-4 pt-0">
                    <Link href="/aarogyasri-diseases" passHref>
                        <Button variant="link" className="p-0 h-auto text-blue-600 underline">
                            <BookOpen className="mr-2 h-4 w-4" /> View NTR Vaidyaseva Covered Diseases
                        </Button>
                    </Link>
                 </div>
            </Card>

            {isPending && (
                <Card className="text-center p-8 border-2 border-foreground shadow-md">
                    <Loader2 className="h-12 w-12 text-muted-foreground animate-spin mx-auto"/>
                    <h3 className="text-xl font-bold mt-4">Analyzing Documents...</h3>
                    <p className="text-muted-foreground">The AI is cross-referencing all available reports, prescriptions, and doctor summaries for "{selectedProblem || newProblem}".</p>
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
                        <Button className="w-full" disabled={isSubmissionDisabled} onClick={() => handleSubmission(insuranceName.includes('NTR Vaidyaseva') ? 'aarogyamithra' : 'insurance')}>
                            {isSubmitting === 'aarogyamithra' || isSubmitting === 'insurance' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>}
                            {isSubmitting ? 'Submitting...' : `Submit to ${insuranceName}`}
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {submissionStatus && (
                <Card className="border-2 border-green-500 bg-green-50/50">
                    <CardHeader>
                        <CardTitle className="text-green-700 flex items-center gap-2"><CheckCircle /> Claim Submitted</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Claim ID:</strong> {submissionStatus.id}</p>
                        <p><strong>Submitted To:</strong> {submissionStatus.type === 'aarogyamithra' ? 'NTR Vaidyaseva (Aarogyamithra)' : (insuranceName || 'Insurance')}</p>
                        <p><strong>Claim Amount:</strong> {submissionStatus.amount}</p>
                        <p><strong>Status:</strong> <span className="font-bold text-yellow-600">{submissionStatus.status}</span></p>
                    </CardContent>
                </Card>
            )}

             <Card className="border-2 border-foreground shadow-md">
                <CardHeader>
                    <CardTitle>Emergency Support</CardTitle>
                    <CardDescription>For urgent inquiries or assistance with emergency fund sanctions.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a href="tel:104" className="w-full">
                        <Button variant="outline" className="w-full h-16 text-lg border">
                           <Phone className="mr-3 h-5 w-5"/> Call 104
                        </Button>
                    </a>
                    <Button variant="destructive" className="w-full h-16 text-lg border">
                        <ShieldAlert className="mr-3 h-5 w-5"/> Report for Emergency Funds
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}


export default function PreAuthorizationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PreAuthPageComponent />
        </Suspense>
    );
}
