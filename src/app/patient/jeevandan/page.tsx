
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HandHeart, Search, Info, Award, ShieldCheck, CheckCircle, Loader2, ListOrdered, User, Droplets, Clock, Hospital, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from 'date-fns';

const waitingListData = [
  { id: 'JW001', organ: 'Kidney', bloodType: 'O+', priority: 'Urgent', city: 'Guntur', registeredAt: new Date('2023-01-15') },
  { id: 'JW002', organ: 'Liver', bloodType: 'A+', priority: 'High', city: 'Vijayawada', registeredAt: new Date('2023-03-22') },
  { id: 'JW003', organ: 'Heart', bloodType: 'B-', priority: 'Urgent', city: 'Hyderabad', registeredAt: new Date('2023-05-10') },
  { id: 'JW004', organ: 'Kidney', bloodType: 'AB+', priority: 'Medium', city: 'Guntur', registeredAt: new Date('2023-07-18') },
  { id: 'JW005', organ: 'Lungs', bloodType: 'O-', priority: 'High', city: 'Visakhapatnam', registeredAt: new Date('2023-09-01') },
  { id: 'JW006', organ: 'Kidney', bloodType: 'A-', priority: 'Urgent', city: 'Guntur', registeredAt: new Date('2023-11-05') },
  { id: 'JW007', organ: 'Liver', bloodType: 'B+', priority: 'Medium', city: 'Hyderabad', registeredAt: new Date('2024-01-20') },
  { id: 'JW008', organ: 'Pancreas', bloodType: 'O+', priority: 'Low', city: 'Vijayawada', registeredAt: new Date('2024-03-12') },
];

const priorityLevels = [
  { level: 'Urgent', description: 'Immediate, life-threatening need. Top of the list.' },
  { level: 'High', description: 'Serious condition requiring timely transplant.' },
  { level: 'Medium', description: 'Stable but needs a transplant in the medium term.' },
  { level: 'Low', description: 'Condition is currently stable and can wait longer.' },
];

const bloodGroups = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const organs = ["All", "Kidney", "Liver", "Heart", "Lungs", "Pancreas", "Cornea"];
const cities = ["All", "Guntur", "Hyderabad", "Vijayawada", "Visakhapatnam"];

export default function JeevandanPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterBloodType, setFilterBloodType] = useState('All');
  const [filterOrgan, setFilterOrgan] = useState('All');
  const [filterCity, setFilterCity] = useState('All');

  const filteredWaitingList = useMemo(() => {
    return waitingListData.filter(item => 
      (filterBloodType === 'All' || item.bloodType === filterBloodType) &&
      (filterOrgan === 'All' || item.organ === filterOrgan) &&
      (filterCity === 'All' || item.city === filterCity)
    );
  }, [filterBloodType, filterOrgan, filterCity]);

  const handleSubmitPledge = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Pledge Submitted!",
        description: "Thank you for your noble pledge. You will receive an official confirmation soon.",
      });
    }, 1500);
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold" style={{ color: 'hsl(var(--nav-symptoms))' }}>Jeevandan Organ Donation</h1>
        <p className="text-muted-foreground mt-2">Pledge to save lives. Find information on organ donation in Andhra Pradesh.</p>
      </div>
      
      <Tabs defaultValue="about" className="w-full">
        <div className="sticky top-16 z-10 bg-background pt-2">
            <div className="border-2 border-foreground shadow-md rounded-lg p-1 bg-muted">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="about" className="font-bold">About</TabsTrigger>
                    <TabsTrigger value="pledge" className="font-bold">Pledge</TabsTrigger>
                    <TabsTrigger value="waiting-list" className="font-bold">Waiting List</TabsTrigger>
                    <TabsTrigger value="priority" className="font-bold">Priority</TabsTrigger>
                </TabsList>
            </div>
        </div>

        <TabsContent value="about" className="mt-6">
          <Card className="border-2 border-foreground shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Info className="h-6 w-6"/> About Jeevandan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>The "Jeevandan" programme, initiated by the Government of Andhra Pradesh, is a cadaver organ donation scheme that aims to streamline the process of organ harvesting and transplantation. It provides a transparent framework for allocating organs to needy patients.</p>
              <p>This initiative bridges the gap between organ donors and recipients, ensuring that the gift of life is managed with the utmost respect and efficiency. By pledging your organs, you can save up to 8 lives.</p>
               <Button asChild style={{backgroundColor: 'hsl(var(--nav-symptoms))'}}>
                <a href="https://jeevandan.ap.gov.in/" target="_blank" rel="noopener noreferrer">Visit Official Jeevandan Website</a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pledge" className="mt-6">
          <Card className="border-2 border-foreground shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><HandHeart className="h-6 w-6"/> Pledge to Donate Organs</CardTitle>
              <CardDescription>Fill out the form below to become a hero. Your pledge is a priceless gift.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPledge} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pledge-name">Full Name</Label>
                    <Input id="pledge-name" placeholder="Enter your full name" required className="border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pledge-age">Age</Label>
                    <Input id="pledge-age" type="number" placeholder="Enter your age" required className="border" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="pledge-blood-type">Blood Group</Label>
                        <Select>
                            <SelectTrigger id="pledge-blood-type" className="border"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>{bloodGroups.slice(1).map(bg => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pledge-phone">Phone Number</Label>
                        <Input id="pledge-phone" type="tel" placeholder="Enter your mobile number" required className="border" />
                    </div>
                </div>
                 <div className="flex items-start space-x-2 pt-4">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                    <Label htmlFor="pledge-consent" className="text-sm font-normal text-muted-foreground">
                        I hereby consent to donate my organs/tissues for transplantation purposes after my death.
                    </Label>
                </div>
                <Button type="submit" className="w-full" style={{backgroundColor: 'hsl(var(--nav-symptoms))'}} disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Submitting...</> : "Submit My Pledge"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="waiting-list" className="mt-6">
          <Card className="border-2 border-foreground shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ListOrdered className="h-6 w-6"/> Organ Waiting List</CardTitle>
              <CardDescription>A live, transparent list of patients awaiting organ transplants.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4 p-4 border rounded-lg">
                    <Select value={filterBloodType} onValueChange={setFilterBloodType}>
                        <SelectTrigger className="border"><SelectValue placeholder="Blood Type"/></SelectTrigger>
                        <SelectContent>{bloodGroups.map(bg => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}</SelectContent>
                    </Select>
                     <Select value={filterOrgan} onValueChange={setFilterOrgan}>
                        <SelectTrigger className="border"><SelectValue placeholder="Organ"/></SelectTrigger>
                        <SelectContent>{organs.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={filterCity} onValueChange={setFilterCity}>
                        <SelectTrigger className="border"><SelectValue placeholder="City"/></SelectTrigger>
                        <SelectContent>{cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                     <Button variant="outline" onClick={() => { setFilterBloodType('All'); setFilterOrgan('All'); setFilterCity('All'); }}>Clear</Button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                    <Table>
                        <TableHeader className="sticky top-0 bg-background">
                        <TableRow>
                            <TableHead>Patient ID</TableHead>
                            <TableHead>Organ</TableHead>
                            <TableHead>Blood Type</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Waiting Since</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {filteredWaitingList.map(item => (
                            <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.organ}</TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="border">{item.bloodType}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge className={getPriorityBadgeClass(item.priority)}>{item.priority}</Badge>
                            </TableCell>
                            <TableCell>{formatDistanceToNow(item.registeredAt, { addSuffix: true })}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="priority" className="mt-6">
          <Card className="border-2 border-foreground shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Award className="h-6 w-6"/> Priority Allocation Explained</CardTitle>
              <CardDescription>How the waiting list priority is determined.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Organ allocation is a complex medical process based on several factors to ensure fairness and medical suitability. It is NOT first-come, first-served.</p>
              <ul className="list-disc list-inside space-y-2 pl-4 text-muted-foreground">
                <li><span className="font-semibold text-foreground">Medical Urgency:</span> Patients in a more critical condition are given higher priority.</li>
                <li><span className="font-semibold text-foreground">Blood Type Compatibility:</span> The donor's and recipient's blood types must be compatible.</li>
                <li><span className="font-semibold text-foreground">Time on Waiting List:</span> The duration a patient has been on the list is a factor, but not the primary one.</li>
                <li><span className="font-semibold text-foreground">Geographic Location:</span> Organs are typically offered locally first to minimize preservation time.</li>
              </ul>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Priority Level</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {priorityLevels.map(p => (
                    <TableRow key={p.level}>
                      <TableCell><Badge className={getPriorityBadgeClass(p.level)}>{p.level}</Badge></TableCell>
                      <TableCell>{p.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
