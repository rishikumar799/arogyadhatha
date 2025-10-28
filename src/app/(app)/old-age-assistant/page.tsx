
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Users2, HandHeart, Briefcase, Car, Stethoscope, FileText, UserPlus, Info, CheckCircle, Loader2, Search, Upload, User, Phone, MessageSquare, MapPin, Clock, Camera, Image as ImageIcon, ChevronDown, ArrowLeft, Star, FileBadge } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const initialProviderData = Array.from({ length: 50 }, (_, i) => {
    const names = ["Rajesh", "Sunita", "Amit", "Priya", "Mohan", "Geeta", "Vikram", "Anjali", "Suresh", "Meena"];
    const skills = [
        ["Caretaker"],
        ["Nurse", "Caretaker"],
        ["Driver"],
        ["Caretaker", "Companion"],
        ["Nurse"],
        ["Driver", "Caretaker"],
        ["Caretaker", "Physiotherapy Assistant"],
        ["Nurse"],
        ["Companion"],
        ["Driver"],
    ];
    const name = `${names[i % names.length]} Kumar ${i + 1}`;
    return {
        id: `PROV${101 + i}`,
        name: name,
        avatar: `https://picsum.photos/seed/prov${i}/100/100`,
        dataAiHint: i % 4 === 0 ? "female nurse portrait" : "male caretaker portrait",
        rating: (3.5 + (i % 15) / 10).toFixed(1),
        skills: skills[i % skills.length],
        pricing: {
            day: 500 + (i % 10) * 50,
            month: 12000 + (i % 10) * 1000
        },
        location: i % 3 === 0 ? "Guntur" : "Hyderabad",
        verified: i % 1.2 > 0.2,
        contact: `+91 98765 432${(i < 10 ? '0' : '') + i}`,
    };
});

const services = [
    { id: "attendant", name: "A-to-Z Assistance Package", description: "Complete hospital visit management: pickup, consultation, and drop-off." },
    { id: "nurse", name: "Nurse at Home", description: "Skilled nursing care for medical needs." },
    { id: "caretaker", name: "Caretaker", description: "Non-medical support for daily activities." },
    { id: "maid", name: "Maid Services", description: "Help with household chores." },
    { id: "companion", name: "Companion", description: "Someone to talk to and spend time with." },
    { id: "vehicle", name: "Vehicle Service", description: "Arrange a vehicle for appointments." },
];

const hourlyUpdates = [
    { 
        date: "2024-07-28", 
        updates: [
            { time: "10:00 AM", text: "Reached patient's home. All is well.", location: "Rentala Village", photo: "https://picsum.photos/seed/update1/600/400", dataAiHint: "elderly person smiling" },
            { time: "11:15 AM", text: "Helping with breakfast and morning medications.", location: "Rentala Village" },
            { time: "12:30 PM", text: "Reading the newspaper together.", location: "Rentala Village", photo: "https://picsum.photos/seed/update2/600/400", dataAiHint: "reading newspaper" },
        ]
    },
    {
        date: "2024-07-27",
        updates: [
            { time: "09:30 AM", text: "Arrived at location. Patient is ready for the day.", location: "Rentala Village" },
            { time: "01:00 PM", text: "Lunch has been served. Patient is resting.", location: "Rentala Village" },
            { time: "04:00 PM", text: "Evening walk in the garden.", location: "Rentala Village", photo: "https://picsum.photos/seed/update3/600/400", dataAiHint: "walking garden" },
        ]
    }
];

export default function OldAgeAssistantPage() {
    const { toast } = useToast();
    const [isClient, setIsClient] = useState(false);
    
    const [serviceBookingStep, setServiceBookingStep] = useState<'form_and_directory' | 'tracking'>('form_and_directory');
    const [providerApplicationStatus, setProviderApplicationStatus] = useState<'form' | 'submitted' | 'approved'>('form');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSkill, setFilterSkill] = useState('All');
    const [filterLocation, setFilterLocation] = useState('All');
    
    const [assignedProvider, setAssignedProvider] = useState<any>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const filteredProviders = useMemo(() => {
        return initialProviderData.filter(provider => {
            const searchMatch = searchQuery === '' || provider.name.toLowerCase().includes(searchQuery.toLowerCase());
            const skillMatch = filterSkill === 'All' || provider.skills.includes(filterSkill);
            const locationMatch = filterLocation === 'All' || provider.location === filterLocation;
            return searchMatch && skillMatch && locationMatch;
        });
    }, [searchQuery, filterSkill, filterLocation]);

    const handleServiceRequestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            toast({ title: "Service Preferences Noted", description: "Your service request details have been sent to our backend." });
        }, 1000);
    };

    const handleBookProvider = (provider: any) => {
        setAssignedProvider(provider);
        setServiceBookingStep('tracking');
        toast({ title: "Provider Booked!", description: `${provider.name} has been assigned.`});
    };

    const handleProviderApplicationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            toast({
                title: "Application Submitted Successfully!",
                description: `Our team will review your application and contact you shortly.`,
            });
            setProviderApplicationStatus('submitted');
            setTimeout(() => {
                setProviderApplicationStatus('approved');
            }, 2000);
        }, 1500);
    };
    
    const assignedPatient = {
        name: "Chinta Lokesh Babu",
        service: "Daily Caretaker Package"
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
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                <div className="inline-block p-3 bg-primary/10 rounded-full" style={{backgroundColor: 'hsla(var(--nav-old-age)/0.1)'}}>
                     <Users2 className="h-8 w-8" style={{color: 'hsl(var(--nav-old-age))'}} />
                </div>
                <h1 className="text-4xl font-bold" style={{color: 'hsl(var(--nav-old-age))'}}>Old Age Assistant</h1>
                <p className="text-muted-foreground text-lg">Comprehensive care and support for senior citizens.</p>
            </div>

            <Tabs defaultValue="book-service" className="w-full">
                <div className="p-1 border bg-muted rounded-lg max-w-md mx-auto">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="book-service" className="font-bold">Book a Service</TabsTrigger>
                        <TabsTrigger value="become-provider" className="font-bold">Become a Provider</TabsTrigger>
                    </TabsList>
                </div>
                
                <TabsContent value="book-service" className="mt-6">
                    {serviceBookingStep === 'form_and_directory' && (
                         <Tabs defaultValue="form" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="form">Request a Service</TabsTrigger>
                                <TabsTrigger value="directory">Find a Provider</TabsTrigger>
                            </TabsList>
                             <TabsContent value="form" className="mt-6">
                                <Card className="border">
                                    <CardHeader>
                                        <CardTitle>Book a Service for Your Parents</CardTitle>
                                        <CardDescription>Tell us who needs the service and what you're looking for.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleServiceRequestSubmit} className="space-y-6">
                                             <div className="space-y-2">
                                                <Label htmlFor="parent-name">Patient's Full Name *</Label>
                                                <Input id="parent-name" placeholder="Enter their full name" className="border"/>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="service-type">Type of Service Required *</Label>
                                                <Select>
                                                    <SelectTrigger id="service-type" className="border">
                                                        <SelectValue placeholder="Select a service" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {services.map(service => (
                                                            <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                             <div className="space-y-2">
                                                <Label htmlFor="client-contact">Your Contact Number *</Label>
                                                <Input id="client-contact" type="tel" placeholder="Enter your phone number" className="border" />
                                            </div>
                                            <Button type="submit" className="w-full" style={{backgroundColor: 'hsl(var(--nav-old-age))'}} disabled={isSubmitting}>
                                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                                {isSubmitting ? 'Saving...' : 'Book Service'}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="directory" className="mt-6">
                                 <Card className="border">
                                    <CardHeader>
                                        <CardTitle>Find a Service Provider</CardTitle>
                                        <CardDescription>Browse our network to find the right care.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
                                            <Input 
                                                placeholder="Search by name..." 
                                                className="border"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                            <Select value={filterSkill} onValueChange={setFilterSkill}>
                                                <SelectTrigger className="border">
                                                    <SelectValue placeholder="Service Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="All">All Services</SelectItem>
                                                    <SelectItem value="Caretaker">Caretaker</SelectItem>
                                                    <SelectItem value="Nurse">Nurse</SelectItem>
                                                    <SelectItem value="Driver">Driver</SelectItem>
                                                    <SelectItem value="Companion">Companion</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Select value={filterLocation} onValueChange={setFilterLocation}>
                                                <SelectTrigger className="border">
                                                    <SelectValue placeholder="Location" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="All">All Locations</SelectItem>
                                                    <SelectItem value="Guntur">Guntur</SelectItem>
                                                    <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                                            {filteredProviders.map(provider => (
                                                 <Card key={provider.id} className="p-4 border shadow-sm">
                                                    <div className="flex items-start gap-4">
                                                        <Avatar className="h-16 w-16 border-2" style={{borderColor: 'hsl(var(--nav-old-age))'}}>
                                                            <AvatarImage src={provider.avatar} data-ai-hint={provider.dataAiHint} />
                                                            <AvatarFallback>{provider.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-lg">{provider.name}</h3>
                                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                                <div className="flex items-center gap-1">
                                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                                    <span className="font-bold text-sm">{provider.rating}</span>
                                                                </div>
                                                                <Separator orientation="vertical" className="h-4" />
                                                                 {provider.verified && (
                                                                    <Badge className="bg-green-100 text-green-800 border-green-300">
                                                                        <CheckCircle className="h-3 w-3 mr-1" /> Verified
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                             <div className="flex flex-wrap gap-1 mt-2">
                                                                {provider.skills.map(skill => (
                                                                    <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Separator className="my-3" />
                                                    <div className="flex items-center justify-between gap-2">
                                                         <div className='text-sm'>
                                                            <p><span className="font-bold">₹{provider.pricing.day}</span><span className="text-muted-foreground">/day</span></p>
                                                            <p><span className="font-bold">₹{provider.pricing.month}</span><span className="text-muted-foreground">/month</span></p>
                                                         </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button variant="outline" size="icon" asChild className="h-9 w-9">
                                                                <a href={`tel:${provider.contact}`}><Phone className="h-4 w-4"/></a>
                                                            </Button>
                                                            <Button size="sm" className="h-9" style={{backgroundColor: 'hsl(var(--nav-old-age))'}} onClick={() => handleBookProvider(provider)}>Book Now</Button>
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    )}

                    {serviceBookingStep === 'tracking' && assignedProvider && (
                        <Card className="border max-w-4xl mx-auto">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Family's View: Service Tracking</CardTitle>
                                        <CardDescription>Real-time updates for Chinta Lokesh Babu.</CardDescription>
                                    </div>
                                    <Button variant="outline" onClick={() => setServiceBookingStep('form_and_directory')} className="bg-green-100 text-green-800 border-green-300 hover:bg-green-200 hover:text-green-900">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Card className="p-4 border">
                                    <CardTitle className="mb-4">Assigned Provider</CardTitle>
                                    <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4">
                                        <Avatar className="h-20 w-20">
                                            <AvatarImage src={assignedProvider.avatar} data-ai-hint={assignedProvider.dataAiHint} />
                                            <AvatarFallback>{assignedProvider.name.split(' ').map((n:string) => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-xl">{assignedProvider.name}</h3>
                                            <div className="flex items-center justify-center sm:justify-start gap-2">
                                                {assignedProvider.skills.map((skill:string) => (
                                                    <Badge key={skill} variant="secondary">{skill}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" asChild><a href={`tel:${assignedProvider.contact}`}><Phone/></a></Button>
                                            <Button variant="outline"><MessageSquare/></Button>
                                        </div>
                                    </div>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Peace of Mind, Guaranteed</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground space-y-2">
                                        <p>Once a provider is assigned, you'll get access to their contact details and verified documents.</p>
                                        <p>Our provider will mark their attendance daily via the app.</p>
                                        <p>For your peace of mind, you will receive hourly status updates, including a photo with your parent and the provider's location.</p>
                                        <p>You can view all these updates in real-time right here in the app.</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Attendance</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-2 font-semibold">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            <p>Provider has marked attendance for today.</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Hourly Updates</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {hourlyUpdates.map((day) => (
                                            <Collapsible key={day.date} className="border rounded-lg" defaultOpen>
                                                <CollapsibleTrigger className="w-full p-3 flex justify-between items-center hover:bg-muted/50">
                                                    <span className="font-bold">{day.date} ({day.updates.length} updates)</span>
                                                    <ChevronDown className="h-5 w-5 transition-transform duration-200 [&[data-state=open]]:rotate-180" />
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="p-4 border-t space-y-4">
                                                    {day.updates.map((update, index) => (
                                                        <div key={index} className="flex gap-4">
                                                            <div className="font-bold text-sm w-20 text-right">{update.time}</div>
                                                            <div className="pl-4 border-l-2 flex-1 space-y-2">
                                                                <p className="font-semibold">{update.text}</p>
                                                                <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3"/>{update.location}</p>
                                                                {update.photo && (
                                                                     <Dialog>
                                                                        <DialogTrigger asChild>
                                                                            <Button variant="outline" size="sm" className="h-auto px-2 py-1 text-xs">
                                                                                <ImageIcon className="h-3 w-3 mr-1"/> View Photo
                                                                            </Button>
                                                                        </DialogTrigger>
                                                                        <DialogContent>
                                                                            <DialogHeader>
                                                                                <DialogTitle>Photo from {update.time}</DialogTitle>
                                                                            </DialogHeader>
                                                                            <Image src={update.photo} alt={`Update at ${update.time}`} width={600} height={400} data-ai-hint={update.dataAiHint} className="rounded-lg object-contain" />
                                                                        </DialogContent>
                                                                    </Dialog>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </CollapsibleContent>
                                            </Collapsible>
                                        ))}
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="become-provider" className="mt-6">
                    <Card className="border max-w-4xl mx-auto">
                        {providerApplicationStatus === 'form' && (
                            <>
                                <CardHeader>
                                    <CardTitle>Join as a Service Provider</CardTitle>
                                    <CardDescription>Apply to become a verified attendant, nurse, or driver.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleProviderApplicationSubmit} className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="provider-name">Full Name *</Label>
                                                <Input id="provider-name" placeholder="e.g., Bala Krishna" className="border"/>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="provider-skill">Primary Skill / Service *</Label>
                                                <Select>
                                                    <SelectTrigger id="provider-skill" className="border">
                                                        <SelectValue placeholder="Select your service type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="nurse">Nurse</SelectItem>
                                                        <SelectItem value="caretaker">Caretaker / Attendant</SelectItem>
                                                        <SelectItem value="driver">Driver</SelectItem>
                                                        <SelectItem value="maid">Maid</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="provider-contact">Your Contact Number *</Label>
                                                <Input id="provider-contact" type="tel" placeholder="Enter your phone number" className="border" />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <Label>Verification Documents *</Label>
                                            <Alert className="bg-blue-50 border-blue-200 text-blue-800 [&>svg]:text-blue-600">
                                                <Info className="h-4 w-4" />
                                                <AlertTitle className="font-bold">Our Process</AlertTitle>
                                                <AlertDescription>
                                                    After you apply, our team will call you to verify these documents. Once verified, you will be added to our network of trusted providers.
                                                </AlertDescription>
                                            </Alert>
                                            <div className="space-y-2">
                                                <Label htmlFor="doc-aadhar">Aadhar Card</Label>
                                                <Button asChild variant="outline" className="w-full justify-start text-left border-dashed">
                                                    <label htmlFor="doc-aadhar" className="cursor-pointer text-muted-foreground"><Upload className="mr-2 h-4 w-4" /> Upload Aadhar Card</label>
                                                </Button>
                                                <input id="doc-aadhar" type="file" className="hidden" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="doc-professional">Professional Certificate (for Nurses)</Label>
                                                <Button asChild variant="outline" className="w-full justify-start text-left border-dashed">
                                                    <label htmlFor="doc-professional" className="cursor-pointer text-muted-foreground"><Upload className="mr-2 h-4 w-4" /> Upload Nursing/Other Certificate</label>
                                                </Button>
                                                <input id="doc-professional" type="file" className="hidden" />
                                            </div>
                                        </div>

                                        <Button type="submit" className="w-full" style={{backgroundColor: 'hsl(var(--nav-old-age))'}} disabled={isSubmitting}>
                                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                                            {isSubmitting ? 'Submitting...' : 'Apply to Join'}
                                        </Button>
                                    </form>
                                </CardContent>
                            </>
                        )}
                        
                        {providerApplicationStatus === 'submitted' && (
                            <CardContent className="text-center p-8">
                                <Loader2 className="h-12 w-12 text-muted-foreground animate-spin mx-auto"/>
                                <h3 className="text-xl font-bold mt-4">Application Submitted!</h3>
                                <p className="text-muted-foreground">Our team is reviewing your application. We will contact you shortly. Please wait while we set up your dashboard...</p>
                            </CardContent>
                        )}

                        {providerApplicationStatus === 'approved' && (
                            <>
                               <CardHeader>
                                    <div className="flex items-center justify-between">
                                       <div>
                                            <CardTitle>Provider Dashboard</CardTitle>
                                            <CardDescription>Update your status for assigned patients here.</CardDescription>
                                       </div>
                                        <Button variant="outline" onClick={() => setProviderApplicationStatus('form')} className="bg-green-100 text-green-800 border-green-300 hover:bg-green-200 hover:text-green-900">
                                           <ArrowLeft className="mr-2 h-4 w-4" />
                                           Back
                                       </Button>
                                   </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                     <Alert className="bg-green-50 border-green-200 text-green-800 [&>svg]:text-green-600">
                                        <CheckCircle className="h-4 w-4" />
                                        <AlertTitle className="font-bold">Welcome, Bala Krishna! (ID: PROV151)</AlertTitle>
                                        <AlertDescription>
                                            Your application is approved. You are now a verified Arogyadhatha provider.
                                        </AlertDescription>
                                    </Alert>
                                    
                                     <Card>
                                        <CardHeader>
                                            <CardTitle>Current Assignment</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p><span className='font-bold'>Patient:</span> {assignedPatient.name}</p>
                                            <p><span className='font-bold'>Service:</span> {assignedPatient.service}</p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Submit Update</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <Alert variant="destructive">
                                                <AlertTitle className="font-bold">Legal Notice</AlertTitle>
                                                <AlertDescription>
                                                    Any misconduct, failure to provide updates, or theft will result in immediate account suspension and will be legally proceeded with according to the law.
                                                </AlertDescription>
                                            </Alert>
                                            <Textarea placeholder="Enter status update... e.g., Patient had lunch." rows={2} />
                                             <Button variant="outline" asChild className="w-full justify-start text-left border-dashed">
                                                <label className="cursor-pointer">
                                                    <Camera className="mr-2 h-4 w-4"/>
                                                    <span>Upload Photo (Optional)</span>
                                                    <input type="file" className="hidden" />
                                                </label>
                                            </Button>
                                            <Button className="w-full" style={{backgroundColor: 'hsl(var(--nav-old-age))'}}>Submit Update</Button>
                                        </CardContent>
                                    </Card>
                                </CardContent>
                            </>
                        )}
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
