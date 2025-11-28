

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, Lock, PlusCircle, Sparkles, Upload, ArrowRight, Info, Phone } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';


export default function StartCampaignPage() {
    const { toast } = useToast();

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-primary">Start Your Funding Campaign</h1>
                <p className="text-muted-foreground mt-2">Raise funds from our community with a simple, verified process.</p>
            </div>

            <Card className="border-2 border-foreground shadow-md">
                <CardHeader>
                    <CardTitle>Patient & Campaign Details</CardTitle>
                    <CardDescription>Fill in the details below. Fields marked with * are required.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="patient-name">Patient Name *</Label>
                                <Input id="patient-name" placeholder="Enter patient's full name" className="border" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="patient-age">Patient Age *</Label>
                                <Input id="patient-age" type="number" placeholder="e.g., 8" className="border"/>
                            </div>
                        </div>

                         <div className="space-y-2">
                            <Label htmlFor="campaign-title">Campaign Title *</Label>
                            <Input id="campaign-title" placeholder="e.g., Help Lakshmi Fight Liver Disease" className="border"/>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="patient-story">Patient's Story *</Label>
                            <Textarea id="patient-story" placeholder="Share the patient's journey, their current struggle, and their hope for the future. A heartfelt story helps donors connect." rows={5} className="border"/>
                        </div>
                    </div>

                    <Separator />
                    
                    <div className="space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="funding-goal">Funding Goal (INR) *</Label>
                                <Input id="funding-goal" type="number" placeholder="e.g., 350000" className="border"/>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="end-date">Campaign End Date *</Label>
                                <Input id="end-date" type="date" className="border"/>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                         <h3 className="font-medium">Verification Documents</h3>
                         <Alert className="bg-blue-50 border-blue-200 text-blue-800 [&>svg]:text-blue-600 border">
                            <Info className="h-4 w-4" />
                            <AlertTitle className="font-bold">Transparency is Key</AlertTitle>
                            <AlertDescription>
                                Uploading reports and hospital estimates helps us verify your campaign faster and builds trust with donors.
                            </AlertDescription>
                        </Alert>
                         <div className="space-y-2">
                            <Label>Doctor's Diagnosis/Prescription *</Label>
                            <Button variant="outline" asChild className="w-full justify-start text-left border-dashed border-2">
                                <label className="cursor-pointer">
                                    <Upload className="mr-2 h-4 w-4"/>
                                    <span>Upload Diagnosis Report</span>
                                    <input type="file" className="hidden" />
                                </label>
                            </Button>
                        </div>
                         <div className="space-y-2">
                            <Label>Hospital Cost Estimate</Label>
                            <Button variant="outline" asChild className="w-full justify-start text-left border-dashed border-2">
                                 <label className="cursor-pointer">
                                    <Upload className="mr-2 h-4 w-4"/>
                                    <span>Upload Cost Estimate Letter</span>
                                     <input type="file" className="hidden" />
                                </label>
                            </Button>
                        </div>
                         <div className="space-y-2">
                            <Label>Patient Photos/Videos (up to 3)</Label>
                             <div className="grid grid-cols-3 gap-2">
                                <Button variant="outline" className="h-24 border-dashed border"><PlusCircle className="h-6 w-6 text-muted-foreground"/></Button>
                                <Button variant="outline" className="h-24 border-dashed border"><PlusCircle className="h-6 w-6 text-muted-foreground"/></Button>
                                <Button variant="outline" className="h-24 border-dashed border"><PlusCircle className="h-6 w-6 text-muted-foreground"/></Button>
                             </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                     <div className="flex items-start space-x-2 w-full">
                        <input type="checkbox" id="terms" className="mt-1"/>
                        <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            I confirm all information is correct and agree to the <Link href="/terms" className="text-primary underline">Terms of Service</Link>.
                        </label>
                    </div>
                    <Button className="w-full h-12 text-lg" onClick={() => toast({ title: "Campaign Submitted!", description: "Our team will review your application and contact you shortly."})}>
                        Submit for Verification <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </CardFooter>
            </Card>

             <Card className="border-2 border-foreground shadow-md">
                <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                    <CardDescription>For any assistance with your campaign, please contact us.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild variant="outline" className="w-full border">
                        <a href="tel:8008334948">
                            <Phone className="mr-2 h-4 w-4"/> Call Support
                        </a>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
