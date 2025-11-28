
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRightIcon, User, ListOrdered, HandHeart, CheckCircle, FileText, Loader2, Upload, Phone, Hospital, MessageSquare } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const familyDetailsData = [
    { name: "Chinta Lokesh Babu", uhid: "10074478890", relation: "Self", age: 27 },
    { name: "Lakshmi Narayana", uhid: "10074478891", relation: "Father", age: 52 },
    { name: "Shiva Parvathi", uhid: "10074478892", relation: "Mother", age: 48 },
    { name: "Chinta Ashok", uhid: "10074478893", relation: "Brother", age: 24 },
];

const recentOPCases = [
    { date: "15-Jul-2024", hospital: "Guntur Government Hospital", department: "General Medicine", doctor: "Dr. Srinivas" },
    { date: "28-Jun-2024", hospital: "Guntur Government Hospital", department: "Orthopedics", doctor: "Dr. K. Rao" },
    { date: "10-May-2024", hospital: "AIIMS, Mangalagiri", department: "Cardiology", doctor: "Dr. P. Sharma" },
];

const opStatisticsData = [
  { hospital: 'GGH, Guntur', cases: 1200 },
  { hospital: 'AIIMS, Mangalagiri', cases: 850 },
  { hospital: 'KGH, Vizag', cases: 980 },
  { hospital: 'RIMS, Kadapa', cases: 750 },
  { hospital: 'SVIMS, Tirupati', cases: 920 },
];

const CmrflaimTracker = ({ claim }: { claim: any }) => {
    return (
        <div className="space-y-4">
            {claim.tracking.map((step: any, index: number) => (
                 <div key={index} className="flex items-start gap-4">
                     <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step.status === 'Completed' ? 'bg-primary text-primary-foreground border-primary' : (step.status === 'Active' ? 'bg-primary text-primary-foreground border-primary animate-pulse' : 'bg-muted border-dashed')}`}>
                            {step.status === 'Completed' ? <CheckCircle className="h-5 w-5" /> : <p className={`font-bold text-xs ${step.status === 'Active' ? 'text-white' : ''}`}>{index + 1}</p>}
                        </div>
                        {index < claim.tracking.length - 1 && (
                            <div className={`w-0.5 flex-1 ${step.status === 'Completed' ? 'bg-primary' : 'bg-border'}`} />
                        )}
                    </div>
                    <div className="flex-1 pb-4">
                        <p className={`font-semibold ${step.status === 'Active' || step.status === 'Completed' ? 'text-primary' : ''}`}>{step.stage}</p>
                        <p className="text-xs text-muted-foreground">{step.details}</p>
                        <p className="text-xs text-muted-foreground">{step.date || 'Pending'}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default function NTRVaidyasevaPage() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [applicationStatus, setApplicationStatus] = useState<'form' | 'submitted'>('form');

    const [claim, setClaim] = useState({
        id: "CMRF-2024-001",
        applicant: "Chinta Lokesh Babu",
        status: "Application Submitted",
        tracking: [
            { stage: "Application Submitted", status: "Active", date: new Date().toLocaleDateString(), details: "Your application has been received and is pending verification." },
            { stage: "AI Document Verification", status: "Pending", date: null, details: "AI is verifying the completeness and validity of uploaded documents." },
            { stage: "Review by CM Office", status: "Pending", date: null, details: "Your application is with the concerned officials for review." },
            { stage: "Approval Status", status: "Pending", date: null, details: "Awaiting final decision from the CM office." },
            { stage: "Fund Disbursed", status: "Pending", date: null, details: "Funds will be transferred upon approval." },
        ]
    });

    const handleApplicationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setApplicationStatus('submitted');
            toast({
                title: "Application Submitted!",
                description: "Your CM Relief Fund application is now being tracked.",
            });
        }, 1500);
    };

    return (
        <div className="space-y-4">
            <Tabs defaultValue="ntr-vaidyaseva" className="w-full">
                 <div className="sticky top-16 z-10 bg-background pt-2">
                    <div className="border-2 border-foreground shadow-md rounded-lg p-1 bg-muted">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="ntr-vaidyaseva" className="font-bold">NTR Vaidyaseva</TabsTrigger>
                            <TabsTrigger value="cm-relief-fund" className="font-bold">CM Relief Fund</TabsTrigger>
                        </TabsList>
                    </div>
                </div>

                <TabsContent value="ntr-vaidyaseva" className="mt-6">
                    <div className="space-y-4 max-w-md mx-auto">
                        <Button variant="default" className="w-full h-auto p-3 text-left justify-between bg-primary">
                            <div className="font-bold">
                                <p className="text-xs">UHID:</p>
                                <p className="text-lg tracking-wider">10074478890</p>
                            </div>
                            <ChevronRightIcon className="h-6 w-6" />
                        </Button>
                        
                        <Card className="border-2">
                            <CardContent className="p-4">
                                <p className="font-semibold">Address :</p>
                                <p>RENTALA</p>
                                <p>RENTACHINTALA</p>
                                <p>PALNADU</p>
                                <p>ANDHRA PRADESH</p>
                            </CardContent>
                        </Card>

                        <Collapsible className="border-2 rounded-lg bg-background">
                            <CollapsibleTrigger className="w-full p-4 flex items-center justify-between font-bold text-lg">
                                Family details
                                <ChevronDown className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:-rotate-180" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-4 pb-4">
                                <div className="space-y-2 pt-2 border-t">
                                    {familyDetailsData.map(member => (
                                        <div key={member.uhid} className="p-2 border rounded-lg">
                                            <p className="font-bold">{member.name} <span className="text-sm text-muted-foreground">({member.relation})</span></p>
                                            <p className="text-xs">UHID: {member.uhid} | Age: {member.age}</p>
                                        </div>
                                    ))}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                        
                        <Card className="border-2 text-center p-4">
                            <CardContent className="p-0">
                                <p className="font-semibold text-muted-foreground">NO IP Cases Found</p>
                            </CardContent>
                        </Card>

                        <Collapsible className="border-2 rounded-lg bg-background">
                            <CollapsibleTrigger className="w-full p-4 flex items-center justify-between font-bold text-lg">
                                Recent OP case
                                <ChevronDown className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:-rotate-180" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-4 pb-4">
                                <div className="space-y-2 pt-2 border-t">
                                     {recentOPCases.map(opCase => (
                                        <div key={opCase.date} className="p-2 border rounded-lg">
                                            <p className="font-bold">{opCase.hospital}</p>
                                            <p className="text-sm"><span className="font-semibold">{opCase.department}</span> - {opCase.doctor}</p>
                                            <p className="text-xs text-muted-foreground">{opCase.date}</p>
                                        </div>
                                    ))}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        <Card className="border-2">
                            <CardHeader>
                                <CardTitle>Data Analytics: OP Visits</CardTitle>
                                <CardDescription>Based on Govt. statistics</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={opStatisticsData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis dataKey="hospital" type="category" width={80} tick={{ fontSize: 10 }} interval={0} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="cases" fill="hsl(var(--primary))" name="OP Cases" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="cm-relief-fund" className="mt-6">
                    <div className="max-w-2xl mx-auto space-y-6">
                        {applicationStatus === 'form' ? (
                            <Card className="border-2 border-foreground shadow-md">
                                <CardHeader>
                                    <CardTitle>CM Relief Fund Application</CardTitle>
                                    <CardDescription>Digitize your application to ensure all documents are complete and trackable.</CardDescription>
                                </CardHeader>
                                <form onSubmit={handleApplicationSubmit}>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="patient-name">Patient Name *</Label>
                                            <Input id="patient-name" placeholder="Enter patient's name" required className="border"/>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="contact-number">Contact Number *</Label>
                                            <Input id="contact-number" type="tel" placeholder="Enter a valid phone number" required className="border"/>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="hospital-name">Hospital Name *</Label>
                                            <Input id="hospital-name" placeholder="Enter hospital name" required className="border"/>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="estimated-cost">Estimated Treatment Cost *</Label>
                                            <Input id="estimated-cost" type="number" placeholder="Enter estimated amount in INR" required className="border"/>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Required Documents</Label>
                                            <Button asChild variant="outline" className="w-full justify-start border-dashed border">
                                                <label className="cursor-pointer text-muted-foreground"><Upload className="mr-2 h-4 w-4"/> Upload Doctor's Letter & Estimate</label>
                                            </Button>
                                             <p className="text-xs text-muted-foreground">Upload all relevant documents from your app history or from your device.</p>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                                            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Submitting...</> : "Submit Application"}
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Card>
                        ) : (
                            <Card className="border-2 border-foreground shadow-md">
                                <CardHeader>
                                    <CardTitle>Application Status: {claim.id}</CardTitle>
                                    <CardDescription>Your application is being processed. You can track its progress below.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <CmrflaimTracker claim={claim} />
                                </CardContent>
                                <CardFooter className="grid grid-cols-2 gap-2">
                                    <Button variant="outline" className="border"><Phone className="mr-2 h-4 w-4"/>Contact Support</Button>
                                    <Button variant="outline" className="border"><MessageSquare className="mr-2 h-4 w-4"/>Chat with Official</Button>
                                </CardFooter>
                            </Card>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
