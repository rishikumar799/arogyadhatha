
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, Hospital, Loader2, MessageSquare, Search, ShieldCheck, UserCheck, Heart, User } from "lucide-react";
import { RupeeIcon } from '@/components/icons/rupee-icon';
import { InsuranceIcon } from '@/components/icons/insurance-icon';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';

const services = [
    { title: "Get An Expert Second Opinion", icon: UserCheck },
    { title: "Find Top Cashless Hospitals", icon: Hospital },
    { title: "Find Surgery Cost Estimate", icon: RupeeIcon },
    { title: "Verify Insurance Coverage", icon: InsuranceIcon },
];

const surgeriesOffered = [
    { name: 'Knee Replacement', imageUrl: 'https://picsum.photos/seed/knee/100/100', dataAiHint: 'knee bone' },
    { name: 'Cataract', imageUrl: 'https://picsum.photos/seed/cataract/100/100', dataAiHint: 'eye icon' },
    { name: 'Gallstone Surgery', imageUrl: 'https://picsum.photos/seed/gallstones/100/100', dataAiHint: 'gallbladder stones' },
    { name: 'Hernia Repair', imageUrl: 'https://picsum.photos/seed/hernia/100/100', dataAiHint: 'abdominal hernia' },
    { name: 'Hysterectomy', imageUrl: 'https://picsum.photos/seed/hysterectomy/100/100', dataAiHint: 'uterus organ' },
    { name: 'C-Section/Delivery', imageUrl: 'https://picsum.photos/seed/csection/100/100', dataAiHint: 'baby womb' },
    { name: 'Kidney Stones', imageUrl: 'https://picsum.photos/seed/kidneystone/100/100', dataAiHint: 'kidney stones' },
    { name: 'Appendectomy', imageUrl: 'https://picsum.photos/seed/appendix/100/100', dataAiHint: 'appendix organ' },
    { name: 'Piles/Hemorrhoids', imageUrl: 'https://picsum.photos/seed/piles/100/100', dataAiHint: 'intestine icon' },
    { name: 'Fistula', imageUrl: 'https://picsum.photos/seed/fistula/100/100', dataAiHint: 'medical icon' },
    { name: 'Lasik', imageUrl: 'https://picsum.photos/seed/lasik/100/100', dataAiHint: 'eye laser icon' },
    { name: 'Varicose Veins', imageUrl: 'https://picsum.photos/seed/varicose/100/100', dataAiHint: 'leg veins' },
    { name: 'Hair Transplant', imageUrl: 'https://picsum.photos/seed/hair/100/100', dataAiHint: 'hair follicle' },
    { name: 'Liposuction', imageUrl: 'https://picsum.photos/seed/liposuction/100/100', dataAiHint: 'body fat' },
];

const transplantsOffered = [
    { name: 'Kidney Transplant', imageUrl: 'https://picsum.photos/seed/kidney-transplant/100/100', dataAiHint: 'kidney organ' },
    { name: 'Liver Transplant', imageUrl: 'https://picsum.photos/seed/liver-transplant/100/100', dataAiHint: 'liver organ' },
    { name: 'Heart Transplant', imageUrl: 'https://picsum.photos/seed/heart-transplant/100/100', dataAiHint: 'heart transplant' },
    { name: 'Lung Transplant', imageUrl: 'https://picsum.photos/seed/lung-transplant/100/100', dataAiHint: 'lungs organ' },
];

function InquiryForm({ topic }: { topic: string }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            // Here you would typically close the dialog and show a toast
        }, 1500);
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter your name" className="border" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="Enter your phone number" className="border" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select>
                    <SelectTrigger id="city" className="border">
                        <SelectValue placeholder="Select your city" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="guntur">Guntur</SelectItem>
                        <SelectItem value="hyderabad">Hyderabad</SelectItem>
                        <SelectItem value="vijayawada">Vijayawada</SelectItem>
                        <SelectItem value="vizag">Visakhapatnam</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="message">Tell us more (optional)</Label>
                <Textarea id="message" placeholder="Please provide a brief reason for your inquiry..." className="border" />
            </div>
            <Button type="submit" className="w-full" style={{ backgroundColor: 'hsl(var(--nav-appointments))' }} disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                    </>
                ) : `Request a Call Back for ${topic}`}
            </Button>
        </form>
    );
}

export default function SurgeryCarePage() {
    const [inquiryTopic, setInquiryTopic] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleInquiryClick = (topic: string) => {
        setInquiryTopic(topic);
        setIsFormOpen(true);
    }

    return (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <div className="space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold" style={{ color: 'hsl(var(--nav-appointments))' }}>Surgery Care</h1>
                    <p className="text-muted-foreground mt-2">End-to-end assistance for 50+ surgical procedures.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {services.map((service, index) => (
                        <DialogTrigger asChild key={index} onClick={() => handleInquiryClick(service.title)}>
                            <Card className="flex items-center p-4 hover:bg-muted/50 transition-colors cursor-pointer border">
                                <div className="p-3 bg-primary/10 rounded-full mr-4">
                                    <service.icon className="h-6 w-6" style={{ color: 'hsl(var(--nav-appointments))' }} />
                                </div>
                                <p className="font-semibold text-base">{service.title}</p>
                            </Card>
                        </DialogTrigger>
                    ))}
                </div>
                
                <Card className="border">
                    <CardHeader>
                        <CardTitle>Popular Surgeries</CardTitle>
                        <CardDescription>Click on a surgery to get a cost estimate and a free consultation.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {surgeriesOffered.map((surgery) => (
                            <DialogTrigger asChild key={surgery.name} onClick={() => handleInquiryClick(surgery.name)}>
                                <Card className="text-center p-4 hover:shadow-md transition-shadow cursor-pointer border">
                                    <Image
                                        src={surgery.imageUrl}
                                        alt={`${surgery.name} icon`}
                                        width={60}
                                        height={60}
                                        data-ai-hint={surgery.dataAiHint}
                                        className="mx-auto rounded-lg mb-2"
                                    />
                                    <p className="font-semibold text-sm">{surgery.name}</p>
                                </Card>
                            </DialogTrigger>
                        ))}
                    </CardContent>
                </Card>

                 <Card className="border">
                    <CardHeader>
                        <CardTitle>Transplant Surgeries</CardTitle>
                        <CardDescription>Specialized care and complete support for organ transplants.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {transplantsOffered.map((surgery) => (
                             <DialogTrigger asChild key={surgery.name} onClick={() => handleInquiryClick(surgery.name)}>
                                <Card className="text-center p-4 hover:shadow-md transition-shadow cursor-pointer border">
                                     <Image
                                        src={surgery.imageUrl}
                                        alt={`${surgery.name} icon`}
                                        width={60}
                                        height={60}
                                        data-ai-hint={surgery.dataAiHint}
                                        className="mx-auto rounded-lg mb-2"
                                    />
                                    <p className="font-semibold text-sm">{surgery.name}</p>
                                </Card>
                            </DialogTrigger>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <DialogContent className="border">
                <DialogHeader>
                    <DialogTitle>Request a Call Back</DialogTitle>
                    <DialogDescription>
                        Your inquiry for <span className="font-bold" style={{color: 'hsl(var(--nav-appointments))'}}>{inquiryTopic}</span> has been noted. Please fill out the form below, and our expert team will contact you shortly to assist you.
                    </DialogDescription>
                </DialogHeader>
                <InquiryForm topic={inquiryTopic} />
            </DialogContent>
        </Dialog>
    );
}
