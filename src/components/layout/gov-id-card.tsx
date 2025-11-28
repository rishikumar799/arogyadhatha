
'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GovIdIcon } from '@/components/icons/gov-id-icon';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ShieldCheck, Download, Upload, Share2, Sparkles } from "lucide-react";
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Link from 'next/link';

export function GovIdCard({
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
    const uploadInputRef = useRef<HTMLInputElement>(null);

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

    const maskedId = idValue.includes('@') ? idValue : `**** **** ${idValue.slice(-4)}`;

    return (
        <Card className="border-2 border-foreground shadow-md flex flex-col">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span className="flex items-center gap-2"><GovIdIcon className="h-6 w-6 text-primary" style={{ color: 'hsl(var(--primary))' }} /> {title}</span>
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
                    <Button className="w-full font-bold" style={{ backgroundColor: 'hsl(var(--primary))' }}>
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

    