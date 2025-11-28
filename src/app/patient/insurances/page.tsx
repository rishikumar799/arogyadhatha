

'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sparkles, Loader2, CheckCircle, XCircle, Info, FileText, Upload, Phone, ShieldAlert, BookOpen, User, Calendar, Briefcase, Bot, Paperclip, Send, Hospital, Share2, Download, Eye, EyeOff, ShieldCheck, FileWarning, Camera, ArrowRight, Check, Wallet, Banknote, Gift, MessageSquare, View, ChevronDown, Star } from "lucide-react";
import { preAuth, PreAuthOutput } from '@/ai/flows/ai-pre-auth';
import { previousAppointments } from '@/lib/appointments-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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


const insuranceData = {
    star: {
        name: "Star Health Insurance",
        policyName: "Family Health Optima",
        policyId: "P/12345/01/2023/000123",
        validity: "Dec 2025",
        frontImage: "https://picsum.photos/seed/star_front/400/250",
        backImage: "https://picsum.photos/seed/star_back/400/250",
    },
    abha: {
        name: "ABHA ID Card",
        abhaId: "12-3456-7890-1234",
        frontImage: "https://abdm.gov.in/assets/images/abha_card_2.png",
        backImage: "https://abdm.gov.in/assets/images/abha_card_2.png"
    },
    ntrVaidyaseva: {
        name: "Dr. NTR Vaidyaseva Trust",
        uhid: "AARYS123456789",
        frontImage: "https://picsum.photos/seed/ysr_front/400/250",
        backImage: "https://picsum.photos/seed/ysr_back/400/250",
    }
};

const pastStarClaims = [
  {
    id: "STAR-2023-98765",
    hospital: "KIMS Hospital, Secunderabad",
    procedure: "Cataract Surgery",
    claimDate: "2023-10-15",
    claimAmount: 45000,
    approvedAmount: 40000,
    status: "Claim Settled",
    tracking: [
        { stage: "Documents Submitted", date: "2023-10-10", status: "Completed", details: "Pre-authorization request and medical documents submitted." },
        { stage: "Initial Review", date: "2023-10-11", status: "Completed", details: "Claim documents verified by Star Health team." },
        { stage: "Pre-authorization Approved", date: "2023-10-12", status: "Completed", details: "Cashless treatment for ₹40,000 approved." },
        { stage: "Treatment Completed", date: "2023-10-15", status: "Completed", details: "Cataract surgery successfully performed." },
        { stage: "Final Bill Submitted", date: "2023-10-16", status: "Completed", details: "Hospital submitted final bill of ₹45,000." },
        { stage: "Claim Settled", date: "2023-10-20", status: "Completed", details: "Approved amount of ₹40,000 paid to hospital. Patient paid non-admissible charges of ₹5,000." },
    ]
  },
  {
    id: "STAR-2024-12345",
    hospital: "Continental Hospitals, Gachibowli",
    procedure: "ACL Reconstruction",
    claimDate: "2024-04-05",
    claimAmount: 180000,
    approvedAmount: 0,
    status: "Query Raised",
    tracking: [
        { stage: "Documents Submitted", date: "2024-04-01", status: "Completed", details: "Pre-authorization request and MRI reports submitted." },
        { stage: "Initial Review", date: "2024-04-02", status: "Active", details: "Claim is under review." },
        { stage: "Query Raised", date: "2024-04-03", status: "Active", details: "Query raised: 'Please submit detailed physiotherapy records prior to the injury.' Awaiting response from hospital." },
        { stage: "Pre-authorization Approved", date: null, status: "Pending", details: "" },
        { stage: "Claim Settled", date: null, status: "Pending", details: "" },
    ]
  }
];


function GovIdCard({
    title,
    idLabel,
    idValue,
    frontImage,
    backImage,
    isVerified = true
}: {
    title: string,
    idLabel: string,
    idValue: string,
    frontImage: string,
    backImage: string,
    isVerified?: boolean
}) {
    const { toast } = useToast();
    const [showId, setShowId] = useState(false);
    const [showPhoto, setShowPhoto] = useState(false);
    const uploadInputRef = React.useRef<HTMLInputElement>(null);

    const handleShare = async () => {
        const shareData = {
            title: `My ${title}`,
            text: `Here is my ${title}: ${idValue}`,
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                throw new Error("Web Share API not supported");
            }
        } catch (error) {
            navigator.clipboard.writeText(shareData.text);
            toast({ title: "Copied to Clipboard", description: `${title} details copied.` });
        }
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = frontImage;
        link.download = `${title.replace(/ /g, '_')}_Front.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Download Started", description: `Downloading ${title} card image.` });
    };

    const handleUploadClick = () => {
        uploadInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            toast({ title: "File Selected", description: `${event.target.files[0].name} is ready for upload.` });
        }
    };


    const maskedId = `**** **** ${idValue.slice(-4)}`;

    return (
        <Card className="border-2 border-foreground shadow-md flex flex-col">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span className="flex items-center gap-2"><GovIdIcon className="h-6 w-6 text-primary" style={{color: 'hsl(var(--primary))'}} /> {title}</span>
                    {isVerified && <Badge className="bg-green-100 text-green-800 border-green-300"><ShieldCheck className="mr-1.5 h-3 w-3" /> Verified</Badge>}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted border">
                    <div>
                        <p className="text-sm font-semibold">{idLabel}</p>
                        <p className="font-bold text-lg tracking-wider">{showId ? idValue : maskedId}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setShowId(!showId)}>
                        {showId ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                </div>
                 <div className="space-y-2">
                    <Button variant="outline" onClick={() => setShowPhoto(!showPhoto)} className="w-full border">
                        {showPhoto ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                        {showPhoto ? 'Hide Card Photos' : 'Show Card Photos'}
                    </Button>
                    {showPhoto && (
                        <div className="grid grid-cols-2 gap-4 pt-2">
                           <Dialog>
                                <DialogTrigger asChild>
                                    <div className="space-y-1 text-center cursor-pointer">
                                        <Image src={frontImage} alt={`${title} front`} width={200} height={125} data-ai-hint="government id card front" className="rounded-lg w-full" />
                                        <p className="text-xs text-muted-foreground font-semibold">Front</p>
                                    </div>
                                </DialogTrigger>
                                <DialogContent>
                                    <Image src={frontImage} alt={`${title} front`} width={600} height={375} data-ai-hint="government id card front" className="rounded-lg w-full" />
                                </DialogContent>
                            </Dialog>
                           <Dialog>
                                <DialogTrigger asChild>
                                     <div className="space-y-1 text-center cursor-pointer">
                                        <Image src={backImage} alt={`${title} back`} width={200} height={125} data-ai-hint="government id card back" className="rounded-lg w-full" />
                                        <p className="text-xs text-muted-foreground font-semibold">Back</p>
                                    </div>
                                </DialogTrigger>
                                 <DialogContent>
                                    <Image src={backImage} alt={`${title} back`} width={600} height={375} data-ai-hint="government id card back" className="rounded-lg w-full" />
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
                </div>
            </CardContent>
             <CardFooter className="flex-col gap-2">
                <Link href={`/pre-authorization?name=${encodeURIComponent(title)}`} className="w-full">
                    <Button className="w-full font-bold" style={{backgroundColor: 'hsl(var(--primary))'}}>
                        <Sparkles className="mr-2 h-4 w-4" /> Start Pre-Authorization
                    </Button>
                </Link>
                <div className="grid grid-cols-3 gap-2 w-full">
                    <Button variant="outline" className="border" onClick={handleDownload}><Download className="mr-2 h-4 w-4" /> Download</Button>
                    <Button variant="outline" className="border" onClick={handleUploadClick}><Upload className="mr-2 h-4 w-4" /> Upload</Button>
                    <input type="file" ref={uploadInputRef} onChange={handleFileChange} className="hidden" />
                    <Button variant="outline" onClick={handleShare} className="border"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
                </div>
            </CardFooter>
        </Card>
    );
}

const ClaimTracker = ({ claim, color = 'primary' }: { claim: any, color?: string }) => {
    return (
        <div className="space-y-4">
            {claim.tracking.map((step: any, index: number) => (
                 <div key={index} className="flex items-start gap-4">
                     <div className="flex flex-col items-center">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center border-2",
                            step.status === 'Completed' && "bg-primary text-primary-foreground border-primary",
                            step.status === 'Active' && `bg-${color}-500 text-white border-${color}-500`,
                            step.status === 'Pending' && "bg-muted border-dashed"
                        )} style={{
                           ...(step.status === 'Completed' && { backgroundColor: `hsl(var(--${color}))`, borderColor: `hsl(var(--${color}))` }),
                           ...(step.status === 'Active' && { backgroundColor: `hsl(var(--${color}))`, borderColor: `hsl(var(--${color}))`, animation: 'pulse 2s infinite' })
                        }}>
                            {step.status === 'Completed' ? <Check className="h-5 w-5" /> : <p className={cn("font-bold text-xs", step.status === 'Active' && 'text-white')}>{index + 1}</p>}
                        </div>
                        {index < claim.tracking.length - 1 && (
                            <div className={cn("w-0.5 flex-1", step.status === 'Completed' ? "bg-primary" : "bg-border")} style={{ backgroundColor: step.status === 'Completed' ? `hsl(var(--${color}))` : undefined }} />
                        )}
                    </div>
                    <div className="flex-1 pb-4">
                        <div className="flex justify-between items-center">
                             <p className={cn("font-semibold", step.status === 'Active' && `text-${color}-600`, step.status === 'Completed' && `text-${color}`)} style={{ color: (step.status === 'Active' || step.status === 'Completed') ? `hsl(var(--${color}))` : '' }}>{step.stage}</p>
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
                        <p className="text-xs text-muted-foreground">{step.date || 'Pending'}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

function PrivateInsuranceCard() {
    const { toast } = useToast();
    const data = insuranceData.star;
    const uploadInputRef = React.useRef<HTMLInputElement>(null);

    const handleShare = async () => {
        const shareData = {
            title: `My ${data.name}`,
            text: `Here is my insurance info: ${data.name}, Policy ID: ${data.policyId}`,
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                throw new Error("Web Share API not supported");
            }
        } catch (error) {
            navigator.clipboard.writeText(shareData.text);
            toast({ title: "Copied to Clipboard", description: "Insurance details copied." });
        }
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = data.frontImage;
        link.download = `${data.name.replace(/ /g, '_')}_Card.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Download Started", description: `Downloading ${data.name} card image.` });
    };

    const handleUploadClick = () => {
        uploadInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            toast({ title: "File Selected", description: `${event.target.files[0].name} is ready for upload.` });
        }
    };


    return (
        <Card className="border-2 border-foreground shadow-md flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Star className="h-6 w-6 text-yellow-500 fill-yellow-400" /> {data.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
                <div className="p-3 rounded-lg bg-muted border">
                    <p className="text-sm font-semibold">Policy Name</p>
                    <p className="font-bold text-lg">{data.policyName}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted border">
                    <p className="text-sm font-semibold">Policy ID</p>
                    <p className="font-bold text-lg">{data.policyId}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted border">
                    <p className="text-sm font-semibold">Validity</p>
                    <p className="font-bold text-lg">{data.validity}</p>
                </div>
            </CardContent>
             <CardFooter className="flex-col gap-2">
                 <Link href={`/pre-authorization?name=${encodeURIComponent(data.name)}`} className="w-full">
                    <Button className="w-full font-bold" style={{backgroundColor: 'hsl(var(--primary))'}}>
                        <Sparkles className="mr-2 h-4 w-4" /> Start Pre-Authorization
                    </Button>
                </Link>
                <div className="grid grid-cols-3 gap-2 w-full">
                    <Button variant="outline" className="border" onClick={handleDownload}><Download className="mr-2 h-4 w-4" /> Download</Button>
                    <Button variant="outline" className="border" onClick={handleUploadClick}><Upload className="mr-2 h-4 w-4" /> Upload</Button>
                    <input type="file" ref={uploadInputRef} onChange={handleFileChange} className="hidden" />
                    <Button variant="outline" onClick={handleShare} className="border"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
                </div>
            </CardFooter>
        </Card>
    )
}

function InsurancesPageComponent() {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold" style={{color: 'hsl(var(--primary))'}}>Insurance Hub</h1>
                <p className="text-muted-foreground mt-2">Manage your ABHA ID and private insurance policies.</p>
            </div>

             <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 items-stretch">
                <GovIdCard
                    title="ABHA ID Card"
                    idLabel="ABHA Address"
                    idValue={insuranceData.abha.abhaId}
                    frontImage={insuranceData.abha.frontImage}
                    backImage={insuranceData.abha.backImage}
                />
                <PrivateInsuranceCard />
            </div>

            <Separator />
            
            <Tabs defaultValue="star" className="w-full">
                <div className="border-2 border-foreground shadow-md rounded-lg p-1 bg-muted">
                    <TabsList className="grid w-full grid-cols-1">
                        <TabsTrigger value="star" className="font-bold">Star Health Claims</TabsTrigger>
                    </TabsList>
                </div>
                
                <TabsContent value="star" className="mt-6">
                    <div className="space-y-4">
                         {pastStarClaims.map((claim) => (
                            <Collapsible key={claim.id} className="border-2 rounded-lg bg-background">
                                <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 text-left">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-lg truncate">{claim.procedure}</p>
                                        <p className="text-sm text-muted-foreground truncate">{claim.hospital}</p>
                                        <p className="text-xs text-muted-foreground">{format(new Date(claim.claimDate), "dd MMM, yyyy")}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 ml-4">
                                        <Badge variant={claim.status === 'Claim Settled' ? 'default' : 'destructive'} className={cn('w-fit', claim.status === 'Claim Settled' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-orange-100 text-orange-800 border-orange-200')}>
                                            {claim.status}
                                        </Badge>
                                        <ChevronDown className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:-rotate-180" />
                                    </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="px-4 pb-4">
                                    <div className="space-y-4 pt-4 border-t">
                                        <div>
                                            <h4 className="text-sm font-semibold mb-3">Claim Status Tracker</h4>
                                            <ClaimTracker claim={claim} color="yellow" />
                                        </div>
                                        <div className="p-0 pt-4 mt-4 border-t">
                                            <Button variant="outline" className="w-full border">
                                                <FileText className="mr-2 h-4 w-4" /> View Documents
                                            </Button>
                                        </div>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}


export default function InsurancesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <InsurancesPageComponent />
        </Suspense>
    );
}

    
