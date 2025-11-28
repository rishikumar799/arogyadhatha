

'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Heart, TrendingUp, PlusCircle, Scale, Activity, Flame, Footprints, Info, Watch, Radio, Target, Bike, PersonStanding, Dumbbell, Leaf, Check, Droplets, Wind, Brain, Loader2 } from "lucide-react";
import { useMemo, useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';
import { OrganHealthDialog } from '@/components/layout/organ-health-dialog';
import { organHealthData } from '@/lib/organ-health-data';
import { format } from "date-fns";

const measurementHistory = [
    { date: "2024-07-20", weight: "75 kg", bp: "120/80 mmHg", bmi: 24.5 },
    { date: "2024-07-13", weight: "75.5 kg", bp: "122/81 mmHg", bmi: 24.7 },
    { date: "2024-07-06", weight: "76 kg", bp: "125/85 mmHg", bmi: 24.8 },
];

const getBmiCategory = (bmi: number | null) => {
    if (bmi === null) return { category: "N/A", className: "" };
    if (bmi < 18.5) return { category: "Underweight", className: "bg-blue-100 text-blue-800" };
    if (bmi >= 18.5 && bmi < 25) return { category: "Normal", className: "bg-green-100 text-green-800" };
    if (bmi >= 25 && bmi < 30) return { category: "Overweight", className: "bg-yellow-100 text-yellow-800" };
    if (bmi >= 30 && bmi < 40) return { category: "Obese", className: "bg-red-100 text-red-800" };
    return { category: "Morbidly Obese", className: "bg-red-200 text-red-900" };
};

const getBpCategory = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80) return { category: "Normal", className: "bg-green-100 text-green-800" };
    if (systolic >= 120 && systolic <= 129 && diastolic < 80) return { category: "Elevated", className: "bg-yellow-100 text-yellow-800" };
    if (systolic >= 130 || diastolic >= 80) return { category: "High", className: "bg-red-100 text-red-800" };
    return { category: "Normal", className: "bg-green-100 text-green-800" };
}

const stepsData = {
    steps: 1129,
    goal: 5000,
    slowWalking: 591,
    briskWalking: 538,
    distance: 0.85,
    calories: 34
};

const weeklyActivityData = {
    goal: 150,
    completed: 76,
    briskWalking: 76,
    running: 0,
    cycling: 0,
};

const weekDays = [
    { day: "Mon", date: 15 },
    { day: "Tue", date: 16 },
    { day: "Wed", date: 17, active: true },
    { day: "Thu", date: 18, active: true },
    { day: "Fri", date: 19, active: true },
    { day: "Sat", date: 20 },
    { day: "Sun", date: 21 },
];

const CircularProgress = ({ percentage, children, size = 100, strokeWidth = 8, color } : { percentage: number, children: React.ReactNode, size?: number, strokeWidth?: number, color?: string }) => {
    const validPercentage = isNaN(percentage) ? 0 : percentage;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (validPercentage / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{width: size, height: size}}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    className="text-muted/30"
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx={size/2}
                    cy={size/2}
                />
                <circle
                    stroke={color || "hsl(var(--primary))"}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    r={radius}
                    cx={size/2}
                    cy={size/2}
                />
            </svg>
            <div className="absolute">{children}</div>
        </div>
    );
};

const BmiGauge = ({ bmi }: { bmi: number | null }) => {
    const getRotation = (bmiValue: number | null) => {
        if (bmiValue === null) return -90;
        if (bmiValue < 15) return -80;
        if (bmiValue > 45) return 80;
        return ((bmiValue - 15) / 30) * 160 - 80;
    };

    const rotation = getRotation(bmi);
    const bmiCategoryInfo = getBmiCategory(bmi);

    const GaugeLabel = ({ angle, label, value }: { angle: number; label: string; value: string }) => (
        <text
            transform={`rotate(${angle} 50 50) translate(0, 5)`}
            className="text-[5px] font-bold fill-black"
            textAnchor="middle"
        >
            <tspan x="50" y="15">{label}</tspan>
            <tspan x="50" y="21">{value}</tspan>
        </text>
    );

    return (
        <div className="relative w-[300px] h-[190px] mx-auto font-sans">
            <svg viewBox="0 0 100 65" className="w-full h-full overflow-visible">
                {/* Colored Arcs for BMI categories */}
                <path d="M 5 50 A 45 45 0 0 1 95 50" fill="none" strokeWidth="20" className="stroke-muted/10" />
                <path d="M 5 50 A 45 45 0 0 1 24.5 17.5" fill="none" strokeWidth="20" stroke="#3b82f6" />
                <path d="M 24.5 17.5 A 45 45 0 0 1 50 10" fill="none" strokeWidth="20" stroke="#22c55e" />
                <path d="M 50 10 A 45 45 0 0 1 75.5 17.5" fill="none" strokeWidth="20" stroke="#facc15" />
                <path d="M 75.5 17.5 A 45 45 0 0 1 95 50" fill="none" strokeWidth="20" stroke="#ef4444" />
                
                {/* Category Labels */}
                <GaugeLabel angle={-45} label="Normal" value="18.5-24.9" />
                <GaugeLabel angle={0} label="Overweight" value="25-29.9" />
                <GaugeLabel angle={45} label="Obese" value="30-39.9" />

                 {/* Needle */}
                 {bmi !== null && (
                    <g transform={`rotate(${rotation} 50 50)`}>
                        <path d="M 50 10 L 48 50 L 52 50 Z" fill="hsl(var(--foreground) / 0.8)" />
                        <circle cx="50" cy="50" r="4" fill="hsl(var(--foreground))" />
                    </g>
                 )}
            </svg>

             {bmi !== null ? (
                <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-3xl font-bold" style={{color: 'hsl(var(--nav-profile))'}}>{bmi.toFixed(1)}</p>
                    <Badge className={`text-sm mt-1 ${bmiCategoryInfo?.className}`}>{bmiCategoryInfo?.category}</Badge>
                </div>
            ) : (
                 <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-muted-foreground">Enter values</p>
                 </div>
            )}
             <div className="absolute bottom-0 w-full h-8 bg-foreground rounded-b-md flex items-center justify-center">
                <p className="text-background font-bold text-sm tracking-wider">BODY MASS INDEX</p>
            </div>
        </div>
    );
};

const BmiAdvice = ({ bmi }: { bmi: number | null }) => {
    if (bmi === null) return null;

    const { category } = getBmiCategory(bmi);
    let advice = { title: "", points: [], icon: Leaf, color: "text-primary" };

    switch (category) {
        case "Underweight":
            advice = {
                title: "Advice for Healthy Weight Gain",
                points: [
                    "Eat more frequent, nutrient-rich meals.",
                    "Incorporate protein shakes or smoothies.",
                    "Choose foods with healthy fats like avocados and nuts.",
                    "Engage in strength training to build muscle mass.",
                ],
                icon: Dumbbell,
                color: "text-blue-500"
            };
            break;
        case "Normal":
            advice = {
                title: "You're Doing Great! Keep it Up!",
                points: [
                    "Maintain your balanced diet and regular physical activity.",
                    "Continue monitoring your health to stay in this healthy range.",
                    "Ensure you get adequate sleep and manage stress.",
                    "Stay hydrated by drinking plenty of water.",
                ],
                icon: Target,
                color: "text-green-500"
            };
            break;
        case "Overweight":
            advice = {
                title: "Tips for a Healthier BMI",
                points: [
                    "Focus on a balanced diet with more fruits and vegetables.",
                    "Incorporate at least 30 minutes of moderate exercise daily.",
                    "Reduce intake of sugary drinks and processed foods.",
                    "Practice mindful eating and portion control.",
                ],
                icon: Leaf,
                color: "text-yellow-500"
            };
            break;
        case "Obese":
        case "Morbidly Obese":
            advice = {
                title: "Guidance for Significant Weight Management",
                points: [
                    "Consult a doctor or dietitian for a personalized plan.",
                    "Aim for gradual, sustainable weight loss.",
                    "Increase daily physical activity, starting with walking.",
                    "Join a support group or work with a health coach.",
                ],
                icon: Heart,
                color: "text-red-500"
            };
            break;
        default:
            return null;
    }

    const AdviceIcon = advice.icon;

    return (
        <div className="mt-6">
            <CardHeader className="px-0 pt-4">
                <CardTitle className={`flex items-center gap-2 ${advice.color}`}>
                    <AdviceIcon /> {advice.title}
                </CardTitle>
                <CardDescription>Here are some tips to help you improve or maintain your BMI.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
                <ul className="space-y-3">
                    {advice.points.map((point, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <Check className="h-5 w-5 mt-1 text-primary flex-shrink-0" style={{color: 'hsl(var(--nav-profile))'}}/>
                            <span className="text-muted-foreground">{point}</span>
                        </li>
                    ))}
                </ul>
                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                   <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-yellow-700 mt-1 flex-shrink-0"/>
                        <div>
                            <h4 className="font-semibold text-yellow-800">Disclaimer</h4>
                            <p className="text-sm text-yellow-700">
                                This advice is for informational purposes only. Always consult with a healthcare professional before making significant changes to your diet or exercise routine.
                            </p>
                        </div>
                   </div>
                </div>
            </CardContent>
        </div>
    );
};


export default function HealthTrackerPage() {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [heightUnit, setHeightUnit] = useState('cm');
    const [weightUnit, setWeightUnit] = useState('kg');
    const [isSaving, setIsSaving] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isStartingExercise, setIsStartingExercise] = useState(false);

    const calculatedBmi = useMemo(() => {
        const h = parseFloat(height);
        const w = parseFloat(weight);

        if (h > 0 && w > 0) {
            let heightInMeters;
            if (heightUnit === 'cm') {
                heightInMeters = h / 100;
            } else { // ft
                heightInMeters = h * 0.3048;
            }

            let weightInKg = w;
            if (weightUnit === 'lbs') {
                weightInKg = w * 0.453592;
            }
            
            return weightInKg / (heightInMeters * heightInMeters);
        }
        return null;
    }, [height, weight, heightUnit, weightUnit]);
    
    const latestBmi = 24.5;
    const bmiInfo = getBmiCategory(latestBmi);

    const latestBp = { systolic: 120, diastolic: 80 };
    const bpInfo = getBpCategory(latestBp.systolic, latestBp.diastolic);

    const stepsPercentage = (stepsData.steps / stepsData.goal) * 100;
    const slowWalkingPercentage = (stepsData.slowWalking / (stepsData.slowWalking + stepsData.briskWalking)) * 100;
    const briskWalkingPercentage = 100 - slowWalkingPercentage;

    const weeklyActivityPercentage = (weeklyActivityData.completed / weeklyActivityData.goal) * 100;

    const heightPlaceholders: { [key: string]: string } = {
        cm: 'e.g., 175',
        ft: 'e.g., 5.9'
    };

    const weightPlaceholders: { [key: string]: string } = {
        kg: 'e.g., 75',
        lbs: 'e.g., 165'
    };

    const handleSaveMeasurement = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1500);
    };

    const handleConnectWatch = () => {
        setIsConnecting(true);
        setTimeout(() => setIsConnecting(false), 2000);
    };

    const handleStartExercise = () => {
        setIsStartingExercise(true);
        setTimeout(() => setIsStartingExercise(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold" style={{color: 'hsl(var(--nav-profile))'}}>Health & Activity</h1>
                    <p className="text-muted-foreground">Monitor your vitals, steps, and activity goals.</p>
                </div>
                <Button variant="outline" onClick={handleConnectWatch} disabled={isConnecting} className="border">
                    {isConnecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Watch className="mr-2 h-4 w-4"/>}
                    {isConnecting ? 'Connecting...' : 'Connect Watch'}
                </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Footprints/> Today's Steps</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-center">
                            <CircularProgress percentage={stepsPercentage} size={80} strokeWidth={6}>
                                <div className="text-center">
                                    <p className="text-muted-foreground text-xs">Steps</p>
                                    <p className="text-lg font-bold">{stepsData.steps}</p>
                                </div>
                            </CircularProgress>
                        </div>
                        <div className="space-y-2">
                            <div className="w-full h-2 rounded-full bg-muted/30 flex overflow-hidden">
                                <div className="bg-orange-300" style={{width: `${slowWalkingPercentage}%`}}></div>
                                <div className="bg-orange-500" style={{width: `${briskWalkingPercentage}%`}}></div>
                            </div>
                            <div className="flex justify-between text-xs font-medium">
                                <p>{stepsData.slowWalking} <span className="text-muted-foreground">Slow</span></p>
                                <p>{stepsData.briskWalking} <span className="text-muted-foreground">Brisk</span></p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <p className="text-xs text-muted-foreground">Distance</p>
                                <p className="text-lg font-bold">{stepsData.distance} <span className="text-base">km</span></p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Calories</p>
                                <p className="text-lg font-bold">{stepsData.calories} <span className="text-base">kcal</span></p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                 <Card className="border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Target/> Weekly Activity</CardTitle>
                        <CardDescription className="flex items-center gap-1.5 text-xs"><Info className="h-3 w-3"/> WHO: {weeklyActivityData.goal} Min/week.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="flex justify-center">
                            <CircularProgress percentage={weeklyActivityPercentage} size={80} strokeWidth={6}>
                                <div className="text-center">
                                    <p className="text-xl font-bold">{weeklyActivityPercentage.toFixed(0)}<span className="text-base">%</span></p>
                                    <p className="text-muted-foreground font-medium text-xs">{weeklyActivityData.completed} Min</p>
                                </div>
                            </CircularProgress>
                        </div>

                        <div className="space-y-3 text-center">
                            <div className="flex justify-around">
                                <div className="text-center">
                                    <p className="text-muted-foreground text-xs">Brisk Walking</p>
                                    <p className="font-bold">{weeklyActivityData.briskWalking} <span className="text-xs text-muted-foreground">Min</span></p>
                                </div>
                                 <div className="text-center">
                                    <p className="text-muted-foreground text-xs">Running</p>
                                    <p className="font-bold">{weeklyActivityData.running} <span className="text-xs text-muted-foreground">Min</span></p>
                                </div>
                                <div className="text-center">
                                    <p className="text-muted-foreground text-xs">Cycling</p>
                                    <p className="font-bold">{weeklyActivityData.cycling} <span className="text-xs text-muted-foreground">Min</span></p>
                                </div>
                            </div>
                        </div>
                        <Button className="w-full h-10" style={{backgroundColor: 'hsl(var(--nav-profile))'}} onClick={handleStartExercise} disabled={isStartingExercise}>
                            {isStartingExercise ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isStartingExercise ? 'Starting...' : 'Start Exercise'}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card className="border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2" style={{color: 'hsl(var(--nav-profile))'}}><Heart style={{color: 'hsl(var(--nav-profile))'}}/>Organ Health Overview</CardTitle>
                    <div className="text-sm text-muted-foreground">
                        <p>A summary of your key organ health based on recent reports.</p>
                        <p>మీ గత నివేదికల(Reports) ప్రకారం, మీ ముఖ్య అవయవాల ఆరోగ్య స్థితి యొక్క సారాంశం ఇది.</p>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {organHealthData.map((organ) => (
                         <OrganHealthDialog key={organ.name} organ={organ}>
                            <Card className="p-2 flex flex-col items-center text-center cursor-pointer hover:bg-muted/50 border">
                                <CircularProgress percentage={organ.healthScore} size={60} strokeWidth={5} color={organ.color}>
                                    <Image
                                        src={organ.image}
                                        alt={organ.name}
                                        width={30}
                                        height={30}
                                        data-ai-hint={organ.dataAiHint}
                                        className="rounded-full object-cover"
                                    />
                                </CircularProgress>
                                <p className="mt-2 text-xs font-bold">{organ.name}</p>
                                {organ.healthScore !== null ? (
                                    <p className="font-semibold text-sm" style={{color: organ.color}}>{organ.healthScore}%</p>
                                ) : (
                                    <p className="font-semibold text-sm" style={{color: organ.color}}>--%</p>
                                )}
                                <p className="text-xs font-semibold" style={{color: organ.color}}>{organ.status}</p>
                            </Card>
                        </OrganHealthDialog>
                    ))}
                </CardContent>
            </Card>
            
            <Card className="border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Activity /> Vital Signs</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                             <div className="flex items-center gap-2 text-sm font-semibold mb-2 text-muted-foreground"><Scale className="h-4 w-4" />Last BMI Reading</div>
                             <div className="text-center">
                                <p className="text-3xl font-bold">{latestBmi}</p>
                                <Badge className={`mt-2 text-xs border ${bmiInfo.className}`}>{bmiInfo.category}</Badge>
                            </div>
                        </div>
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                             <div className="flex items-center gap-2 text-sm font-semibold mb-2 text-muted-foreground"><Heart className="h-4 w-4" />Last Blood Pressure</div>
                            <div className="text-center">
                                <p className="text-3xl font-bold">{latestBp.systolic}/{latestBp.diastolic} <span className="text-lg text-muted-foreground">mmHg</span></p>
                                <Badge className={`mt-2 text-xs border ${bpInfo.className}`}>{bpInfo.category}</Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2"><Scale /> BMI Calculator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="height">Height</Label>
                                    <Tabs defaultValue={heightUnit} onValueChange={setHeightUnit} className="w-auto">
                                        <TabsList className="h-7 text-xs border">
                                            <TabsTrigger value="cm" className="h-5 px-2">cm</TabsTrigger>
                                            <TabsTrigger value="ft" className="h-5 px-2">ft</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>
                                <Input id="height" type="number" placeholder={heightPlaceholders[heightUnit]} value={height} onChange={(e) => setHeight(e.target.value)} className="border" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="calc-weight">Weight</Label>
                                    <Tabs defaultValue={weightUnit} onValueChange={setWeightUnit} className="w-auto">
                                        <TabsList className="h-7 text-xs border">
                                            <TabsTrigger value="kg" className="h-5 px-2">kg</TabsTrigger>
                                            <TabsTrigger value="lbs" className="h-5 px-2">lbs</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>
                                <Input id="calc-weight" type="number" placeholder={weightPlaceholders[weightUnit]} value={weight} onChange={(e) => setWeight(e.target.value)} className="border" />
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center pt-4 md:pt-0">
                            <BmiGauge bmi={calculatedBmi} />
                        </div>
                    </div>

                    <BmiAdvice bmi={calculatedBmi} />
                    
                    <div className="pt-6 border-t">
                        <h4 className="font-semibold flex items-center gap-2"><Info className="h-5 w-5 text-primary" style={{color: 'hsl(var(--nav-profile))'}}/> What is BMI?</h4>
                        <p className="text-sm text-muted-foreground">
                            Body Mass Index (BMI) is a measure of body fat based on height and weight. It's a simple way to see if you're in a healthy weight range.
                        </p>
                         <p className="text-sm text-muted-foreground">
                            బాడీ మాస్ ఇండెక్స్ (BMI) అనేది ఎత్తు మరియు బరువు ఆధారంగా శరీర కొవ్వు యొక్క కొలత. మీరు ఆరోగ్యకరమైన బరువు పరిధిలో ఉన్నారో లేదో చూడటానికి ఇది ఒక సులభమైన మార్గం.
                        </p>
                    </div>
                </CardContent>
            </Card>


            <Card className="border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><PlusCircle /> Add New Measurement</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input id="weight" type="number" placeholder="e.g., 75" className="border" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                         <div className="space-y-2">
                            <Label htmlFor="bpSystolic">BP Systolic</Label>
                            <Input id="bpSystolic" type="number" placeholder="e.g., 120" className="border" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="bpDiastolic">BP Diastolic</Label>
                            <Input id="bpDiastolic" type="number" placeholder="e.g., 80" className="border" />
                        </div>
                    </div>
                    <Button className="w-full sm:w-auto" style={{backgroundColor: 'hsl(var(--nav-profile))'}} onClick={handleSaveMeasurement} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isSaving ? 'Saving...' : 'Save Measurement'}
                    </Button>
                </CardContent>
            </Card>

            <Card className="border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Activity /> Measurement History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Weight</TableHead>
                                <TableHead>Blood Pressure</TableHead>
                                <TableHead>BMI</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {measurementHistory.map((entry, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{format(new Date(entry.date), 'dd-MMM-yyyy')}</TableCell>
                                    <TableCell>{entry.weight}</TableCell>
                                    <TableCell>{entry.bp}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`border ${getBmiCategory(entry.bmi).className}`}>{entry.bmi}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    );
}
    

    




















    





    


    

