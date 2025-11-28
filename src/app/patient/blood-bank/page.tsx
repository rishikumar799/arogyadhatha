

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Droplets, MapPin, UserPlus, Loader2, Search, Phone, Filter, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';


const bloodRequestsData = [
    { id: 1, patientId: "PAT734", patientName: "lokesh chinta", bloodType: "O+", city: "guntur", contactInfo: "lokesh@email.com", postedAt: new Date(Date.now() - 1000 * 60 * 5) },
    { id: 2, patientId: "PAT735", patientName: "venkatesh", bloodType: "A+", city: "hyderabad", contactInfo: "venky@email.com", postedAt: new Date(Date.now() - 1000 * 60 * 30) },
    { id: 3, patientId: "PAT736", patientName: "surya", bloodType: "B-", city: "guntur", contactInfo: "surya@email.com", postedAt: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: 4, patientId: "PAT737", patientName: "pavan", bloodType: "AB+", city: "vijayawada", contactInfo: "pavan@email.com", postedAt: new Date(Date.now() - 1000 * 60 * 60 * 5) },
    { id: 5, patientId: "PAT738", patientName: "K. Srinivas", bloodType: "A-", city: "guntur", contactInfo: "srinivas.k@example.com", postedAt: new Date(Date.now() - 1000 * 60 * 15) },
    { id: 6, patientId: "PAT739", patientName: "M. Devi", bloodType: "O-", city: "guntur", contactInfo: "devi.m@example.com", postedAt: new Date(Date.now() - 1000 * 60 * 45) },
    { id: 7, patientId: "PAT740", patientName: "P. Kumar", bloodType: "B+", city: "hyderabad", contactInfo: "kumar.p@example.com", postedAt: new Date(Date.now() - 1000 * 60 * 90) },
    { id: 8, patientId: "PAT741", patientName: "G. Lakshmi", bloodType: "A+", city: "vijayawada", contactInfo: "lakshmi.g@example.com", postedAt: new Date(Date.now() - 1000 * 60 * 120) },
    { id: 9, patientId: "PAT742", patientName: "R. Prasad", bloodType: "O+", city: "guntur", contactInfo: "prasad.r@example.com", postedAt: new Date(Date.now() - 1000 * 60 * 180) },
    { id: 10, patientId: "PAT743", patientName: "S. Rao", bloodType: "B-", city: "hyderabad", contactInfo: "rao.s@example.com", postedAt: new Date(Date.now() - 1000 * 60 * 240) },
    { id: 11, patientId: "PAT744", patientName: "A. Reddy", bloodType: "AB-", city: "guntur", contactInfo: "reddy.a@example.com", postedAt: new Date(Date.now() - 1000 * 60 * 300) },
    { id: 12, patientId: "PAT745", patientName: "N. Murthy", bloodType: "O+", city: "vijayawada", contactInfo: "murthy.n@example.com", postedAt: new Date(Date.now() - 1000 * 60 * 60 * 8) },
    { id: 13, patientId: "PAT746", patientName: "T. Naidu", bloodType: "A+", city: "guntur", contactInfo: "naidu.t@example.com", postedAt: new Date(Date.now() - 1000 * 60 * 60 * 10) },
    { id: 14, patientId: "PAT747", patientName: "V. Sharma", bloodType: "B+", city: "hyderabad", contactInfo: "sharma.v@example.com", postedAt: new Date(Date.now() - 1000 * 60 * 60 * 12) },
    { id: 15, patientId: "PAT748", patientName: "Anil Varma", bloodType: "O-", city: "guntur", contactInfo: "anil.v@example.com", postedAt: new Date(Date.now() - 1000 * 60 * 25) },
    { id: 16, patientId: "PAT749", patientName: "Sunitha Reddy", bloodType: "A-", city: "hyderabad", contactInfo: "sunitha.r@example.com", postedAt: new Date(Date.now() - 1000 * 60 * 55) },
    { id: 17, patientId: "PAT750", patientName: "Rajesh Gupta", bloodType: "B+", city: "guntur", contactInfo: "rajesh.g@example.com", postedAt: new Date(Date.now() - 1000 * 60 * 110) },
    { id: 18, patientId: "PAT751", patientName: "Priya Singh", bloodType: "AB+", city: "vijayawada", contactInfo: "priya.s@example.com", postedAt: new Date(Date.now() - 1000 * 60 * 150) },
    ...Array.from({ length: 90 }, (_, i) => {
        const names = ["Ravi", "Suresh", "Mahesh", "Priya", "Lakshmi", "Sarala", "Gopi", "Krishna", "Ram", "Sita", "Anusha", "Kiran", "Madhu", "Naveen", "Deepa"];
        const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
        const cities = ["guntur", "hyderabad", "vijayawada", "mumbai", "bangalore"];
        const name = names[i % names.length] + ` ${i+1}`;
        return {
            id: 19 + i,
            patientId: `PAT${752+i}`,
            patientName: name,
            bloodType: bloodTypes[i % bloodTypes.length],
            city: cities[i % cities.length] === "guntur" && i % 2 === 0 ? "guntur" : cities[i % cities.length],
            contactInfo: `${name.toLowerCase().replace(" ",".")}@email.com`,
            postedAt: new Date(Date.now() - 1000 * 60 * (60 * (i+1)))
        }
    })
];

const bloodGroups = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const cities = ["All", "guntur", "hyderabad", "vijayawada", "mumbai", "bangalore"];

const bloodBankContacts = [
    { name: "Red Cross Blood Bank", city: "Guntur", contact: "0863-2220132" },
    { name: "NTR Trust Blood Bank", city: "Hyderabad", contact: "040-30795555" },
    { name: "Lions Club Blood Bank", city: "Vijayawada", contact: "0866-2575777" },
    { name: "Sanjeevani Blood Bank", city: "Hyderabad", contact: "040-27668686" },
    { name: "Amaravathi Blood Bank", city: "Guntur", contact: "0863-2233456" },
];

export default function BloodBankPage() {
    const [bloodRequests, setBloodRequests] = useState(bloodRequestsData.map(req => ({ ...req, postedAtString: '' })));
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // States for filter dropdowns
    const [selectedBloodType, setSelectedBloodType] = useState('All');
    const [selectedCity, setSelectedCity] = useState('All');

    // States for applied filters
    const [appliedBloodType, setAppliedBloodType] = useState('All');
    const [appliedCity, setAppliedCity] = useState('All');
    
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // This runs only on the client, after hydration
        setBloodRequests(bloodRequestsData.map(req => ({
            ...req,
            postedAtString: formatDistanceToNow(req.postedAt, { addSuffix: true })
        })));
    }, []);

    const handleApplyFilters = () => {
        setAppliedBloodType(selectedBloodType);
        setAppliedCity(selectedCity);
    };

    const handleClearFilters = () => {
        setSelectedBloodType('All');
        setSelectedCity('All');
        setAppliedBloodType('All');
        setAppliedCity('All');
    };

    const handleSubmit = (e: React.FormEvent, successMessage: string) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            toast({
                title: "Success!",
                description: successMessage,
            });
        }, 1500);
    };

    const filteredBloodRequests = useMemo(() => {
        return bloodRequests.filter(req => {
            const bloodTypeMatch = appliedBloodType === 'All' || req.bloodType === appliedBloodType;
            const cityMatch = appliedCity === 'All' || req.city.toLowerCase() === appliedCity.toLowerCase();
            return bloodTypeMatch && cityMatch;
        });
    }, [bloodRequests, appliedBloodType, appliedCity]);


    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold" style={{color: 'hsl(var(--nav-blood-bank))'}}>Blood Bank</h1>
                <p className="text-muted-foreground mt-2">Connect with donors or request blood in critical moments.</p>
            </div>
            
            <Tabs defaultValue="donors" className="w-full">
                <div className="sticky top-16 z-10 bg-background pt-2">
                    <div className="border-2 border-foreground shadow-md rounded-lg p-1 bg-muted">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="donors" className="font-bold">Blood Donors</TabsTrigger>
                            <TabsTrigger value="centers" className="font-bold">Blood Bank Centers</TabsTrigger>
                        </TabsList>
                    </div>
                </div>
                
                <TabsContent value="donors" className="mt-6">
                    <Card className="border-2 border-foreground shadow-md">
                        <CardHeader>
                            <CardTitle className="font-extrabold text-2xl">Find a Donor</CardTitle>
                            <CardDescription>Connect with donors or request blood.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Tabs defaultValue="find" className="w-full">
                                <div className="sticky top-32 z-10 bg-background py-2">
                                    <div className="border-2 border-foreground rounded-lg p-1 bg-muted">
                                        <TabsList className="grid w-full grid-cols-3">
                                            <TabsTrigger value="find" className="text-xs sm:text-sm font-semibold data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">Find a Donor</TabsTrigger>
                                            <TabsTrigger value="request" className="text-xs sm:text-sm font-semibold data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">Request Blood</TabsTrigger>
                                            <TabsTrigger value="register" className="text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-2 data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">
                                                <UserPlus className="h-4 w-4"/>Become a Donor
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <TabsContent value="find" className="mt-0">
                                        <div className="space-y-4">
                                            <div className="p-4 border rounded-lg">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="font-semibold flex items-center gap-2"><Filter className="h-5 w-5" /> Filters</h3>
                                                    <Button variant="ghost" onClick={handleClearFilters} className="text-sm h-auto p-1">
                                                        <X className="h-4 w-4 mr-1" /> Clear
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                    <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
                                                        <SelectTrigger className="border"><SelectValue placeholder="Blood Type" /></SelectTrigger>
                                                        <SelectContent>
                                                            {bloodGroups.map(bg => <SelectItem key={bg} value={bg}>{bg === 'All' ? 'All Blood Types' : bg}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                                                        <SelectTrigger className="border"><SelectValue placeholder="City" /></SelectTrigger>
                                                        <SelectContent>
                                                            {cities.map(city => <SelectItem key={city} value={city}>{city === 'All' ? 'All Cities' : city}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                    <Button onClick={handleApplyFilters} style={{backgroundColor: 'hsl(var(--nav-blood-bank))'}}>Go</Button>
                                                </div>
                                            </div>
                                            <div className="space-y-3 max-h-96 overflow-y-auto p-1">
                                                {filteredBloodRequests.length === 0 && (
                                                    <div className="text-center p-8 text-muted-foreground">
                                                        {bloodRequests.some(r => r.postedAtString === '') ? 'Loading...' : 'No donors match your criteria.'}
                                                    </div>
                                                )}
                                                {filteredBloodRequests.map((req, index) => (
                                                    <Card key={index} className="p-4 shadow-sm border">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="font-extrabold text-lg flex items-center gap-2"><User className="h-4 w-4"/> {req.id}. {req.patientName}</p>
                                                                <p className="text-sm text-muted-foreground ml-7">Patient ID: {req.patientId}</p>
                                                                <div className="flex items-center gap-4 mt-2">
                                                                    <Badge variant="destructive" className="text-base font-bold px-3 py-1" style={{backgroundColor: 'hsl(var(--nav-blood-bank))'}}>{req.bloodType}</Badge>
                                                                    <p className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4"/> {req.city}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <Link href="tel:8008334948">
                                                                    <Button className="bg-green-600 hover:bg-green-700">Contact</Button>
                                                                </Link>
                                                                <p className="text-xs text-muted-foreground mt-2">{isClient ? req.postedAtString : '...'}</p>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="request" className="mt-0">
                                        <form className="space-y-4" onSubmit={(e) => handleSubmit(e, "Your blood request has been posted successfully.")}>
                                            <div className="space-y-2"><Label htmlFor="patientName">Patient Name</Label><Input id="patientName" placeholder="Enter patient's name" className="border" /></div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="bloodType">Blood Group</Label>
                                                    <Select><SelectTrigger id="bloodType" className="border"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{bloodGroups.slice(1).map(bg => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}</SelectContent></Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="city">City</Label>
                                                    <Select><SelectTrigger id="city" className="border"><SelectValue placeholder="Select City" /></SelectTrigger><SelectContent>{cities.slice(1).map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}</SelectContent></Select>
                                                </div>
                                            </div>
                                            <div className="space-y-2"><Label htmlFor="contactInfo">Contact Info (Phone or Email)</Label><Input id="contactInfo" placeholder="Enter contact details" className="border" /></div>
                                            <Button type="submit" className="w-full" style={{backgroundColor: 'hsl(var(--nav-blood-bank))'}} disabled={isSubmitting}>
                                                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...</> : 'Post Blood Request'}
                                            </Button>
                                        </form>
                                    </TabsContent>
                                    <TabsContent value="register" className="mt-0">
                                        <form className="space-y-6" onSubmit={(e) => handleSubmit(e, "You have been registered as a donor. Thank you!")}>
                                            <div className="space-y-2"><Label htmlFor="donorName">Full Name</Label><Input id="donorName" placeholder="Enter your full name" className="border"/></div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="donorBloodType">Blood Group</Label>
                                                    <Select><SelectTrigger id="donorBloodType" className="border"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{bloodGroups.slice(1).map(bg => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}</SelectContent></Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="donorCity">City</Label>
                                                    <Select><SelectTrigger id="donorCity" className="border"><SelectValue placeholder="Select City" /></SelectTrigger><SelectContent>{cities.slice(1).map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}</SelectContent></Select>
                                                </div>
                                            </div>
                                            <div className="space-y-2"><Label htmlFor="donorContact">Contact Info (Phone or Email)</Label><Input id="donorContact" placeholder="Enter contact details" className="border"/></div>
                                            <div className="flex items-center space-x-4 rounded-md border p-4"><UserPlus className="h-6 w-6"/><div className="flex-1 space-y-1"><p className="text-sm font-medium leading-none">Available to Donate</p><p className="text-sm text-muted-foreground">Enable this to appear in searches for nearby donation requests.</p></div><Switch id="availability-mode" /></div>
                                            <Button type="submit" className="w-full" style={{backgroundColor: 'hsl(var(--nav-blood-bank))'}} disabled={isSubmitting}>
                                                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</> : 'Register as a Donor'}
                                            </Button>
                                        </form>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="centers" className="mt-6">
                     <Card className="border-2 border-foreground shadow-md">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Blood Bank Centers</CardTitle>
                            <CardDescription>Contact these blood banks directly for urgent needs.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {bloodBankContacts.map((bank, index) => (
                                <Card key={index} className="p-4 shadow-sm border">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-base">{bank.name}</p>
                                            <p className="text-sm text-muted-foreground">{bank.city}</p>
                                        </div>
                                        <a href={`tel:${bank.contact}`}>
                                            <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700">
                                                <Phone className="mr-2 h-4 w-4" /> Call Now
                                            </Button>
                                        </a>
                                    </div>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
