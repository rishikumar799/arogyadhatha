

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, Baby, CalendarDays, Camera, FileText, Flame, HeartHandshake, Info, Phone, ShieldAlert, Utensils, Video, File, View, Moon, Star, AlertTriangle, Pencil, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { PregnantLadyIcon } from "@/components/icons/pregnant-lady-icon";
import { format } from "date-fns";

const dietPlan = {
    breakfast: ["Oats with fruits", "2 boiled eggs"],
    lunch: ["Roti, dal, vegetable curry", "Salad"],
    dinner: ["Light vegetable soup", "Brown rice"],
};

const dailyActivities = [
    { activity: "Morning Walk", duration: "30 mins", icon: Flame },
    { activity: "Prenatal Yoga", duration: "20 mins", icon: HeartHandshake },
    { activity: "Light Stretching", duration: "15 mins", icon: Flame },
];

const scansAndReports = [
    { name: "First Trimester Screening", date: "2024-05-10" },
    { name: "Anomaly Scan (TIFFA)", date: "2024-07-22" },
    { name: "Glucose Tolerance Test", date: "2024-08-15" },
];

export default function PregnancyTrackerPage() {
    const pregnancyWeek = 22;
    const progressPercentage = (pregnancyWeek / 40) * 100;

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold" style={{color: 'hsl(var(--nav-appointments))'}}>Pregnancy Care</h1>
                <p className="text-muted-foreground mt-2">Your journey to motherhood, week by week.</p>
            </div>

            <Alert variant="destructive" className="bg-yellow-50 border-yellow-200 text-yellow-800 [&>svg]:text-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="font-bold">Doctor-Prescribed Plans</AlertTitle>
                <AlertDescription>
                The diet and activity plans shown here are based on your doctor's recommendations that you have uploaded. This app helps you track them but does not provide medical advice.
                </AlertDescription>
            </Alert>


            <Card>
                <CardHeader>
                    <CardTitle>Your Pregnancy Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-center">
                        <p className="text-lg font-semibold">Week {pregnancyWeek} / 40</p>
                        <p className="text-muted-foreground">Second Trimester</p>
                    </div>
                    <Progress value={progressPercentage} className="h-4" />
                    <div className="flex justify-between text-xs font-medium text-muted-foreground">
                        <span>Week 1</span>
                        <span>Week 40</span>
                    </div>
                    <Separator className="my-6" />
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-center">This Week's Guide</h3>
                        <div>
                            <h4 className="font-semibold text-lg mb-2">Baby's Development</h4>
                            <div className="flex items-start gap-4">
                                 <PregnantLadyIcon className="h-8 w-8 mt-1" style={{color: 'hsl(var(--nav-appointments))'}}/>
                                 <p className="text-muted-foreground">
                                    Your baby is now about the size of a small doll, and their senses are developing rapidly. They can hear your voice, and you might start to feel their first movements, known as "quickening."
                                </p>
                            </div>
                        </div>
                         <div>
                            <h4 className="font-semibold text-lg mb-2">Mother's Changes</h4>
                             <div className="flex items-start gap-4">
                                <HeartHandshake className="h-8 w-8 mt-1" style={{color: 'hsl(var(--nav-appointments))'}}/>
                                <p className="text-muted-foreground">
                                    You may be feeling more energetic as morning sickness subsides. Your baby bump is becoming more noticeable. It's a great time to focus on a healthy diet and gentle exercise.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
                 <div className="space-y-8">
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2"><Utensils style={{color: 'hsl(var(--nav-appointments))'}}/> Diet Plan (ఆహార ప్రణాళిక)</CardTitle>
                            <Button variant="outline" size="sm"><Pencil className="mr-2 h-4 w-4" /> Edit</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Breakfast</h4>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                    {dietPlan.breakfast.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Lunch</h4>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                    {dietPlan.lunch.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Dinner</h4>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                     {dietPlan.dinner.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2"><Flame style={{color: 'hsl(var(--nav-appointments))'}}/> Daily Activities (రోజువారీ కార్యకలాపాలు)</CardTitle>
                            <Button variant="outline" size="sm"><Pencil className="mr-2 h-4 w-4" /> Edit</Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {dailyActivities.map((act, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <act.icon className="h-5 w-5 text-primary" style={{color: 'hsl(var(--nav-appointments))'}}/>
                                        <p className="font-semibold">{act.activity}</p>
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground">{act.duration}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                 </div>
                 <div className="space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Doctor & Care Support</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="female doctor" />
                                    <AvatarFallback>SP</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold">Dr. Siva Parvathi</p>
                                    <p className="text-sm text-muted-foreground">Gynecologist</p>
                                </div>
                            </div>
                             <Button className="w-full justify-start gap-2" variant="outline"><Phone className="h-4 w-4"/> Call Doctor</Button>
                             <Button className="w-full justify-start gap-2" variant="outline"><Video className="h-4 w-4"/> Video Consult</Button>
                              <Button className="w-full justify-start gap-2 text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive" variant="outline">
                                <ShieldAlert className="h-4 w-4"/> Emergency Contact
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2"><FileText style={{color: 'hsl(var(--nav-appointments))'}}/> Scans & Reports (స్కాన్‌లు & నివేదికలు)</CardTitle>
                            <Button style={{backgroundColor: 'hsl(var(--nav-appointments))'}} size="sm"><Upload className="mr-2 h-4 w-4"/> Upload</Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                             {scansAndReports.map((report, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                                   <div>
                                       <p className="font-semibold">{report.name}</p>
                                       <p className="text-sm text-muted-foreground">{format(new Date(report.date), 'dd-MMM-yyyy')}</p>
                                   </div>
                                   <Button variant="ghost" size="icon">
                                        <View className="h-5 w-5" style={{color: 'hsl(var(--nav-appointments))'}}/>
                                   </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                 </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Award/> Congratulations!</CardTitle>
                         <CardDescription>This will be your certificate after delivery.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center p-8 bg-muted/40 rounded-lg space-y-4">
                        <Camera className="mx-auto h-16 w-16 text-muted-foreground"/>
                        <p className="font-semibold text-muted-foreground">Awaiting the big day!</p>
                         <p className="text-sm text-muted-foreground">After delivery, you'll find a beautiful certificate here with your and your baby's photo.</p>
                    </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200 p-6 relative overflow-hidden">
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full"></div>
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-100 rounded-full"></div>
                    <div className="relative z-10 space-y-4 text-blue-800">
                       <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold tracking-wider">BIRTH CERTIFICATE</h3>
                            <p className="text-xs font-medium">THIS DOCUMENT ACKNOWLEDGES THAT</p>
                       </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-blue-900">Name Surname</p>
                            <hr className="border-blue-300 my-2 w-1/2 mx-auto"/>
                        </div>
                        <div className="text-center text-sm">
                            <p>WAS BORN TO</p>
                            <div className="flex justify-center gap-8 mt-2 font-semibold">
                                <div>
                                    <p>Mother's Name</p>
                                    <hr className="border-blue-300 mt-1"/>
                                </div>
                                <div>
                                    <p>Father's Name</p>
                                     <hr className="border-blue-300 mt-1"/>
                                </div>
                            </div>
                        </div>
                        <div className="text-center text-sm">
                            <p>AT HOSPITAL PLACE IN CITY, COUNTRY</p>
                            <hr className="border-blue-300 mt-1 w-3/4 mx-auto"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-center text-sm pt-4">
                            <div>
                                <p>WEIGHT: ___ LBS</p>
                                <hr className="border-blue-300 mt-1"/>
                            </div>
                             <div>
                                <p>LENGTH: ___ INCH</p>
                                <hr className="border-blue-300 mt-1"/>
                            </div>
                             <div>
                                <p>DATE: __/__/____</p>
                                <hr className="border-blue-300 mt-1"/>
                            </div>
                            <div>
                                <p>SIGNATURE</p>
                                <hr className="border-blue-300 mt-1"/>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
