

'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Leaf, Award, ChevronRight, Scale, Utensils, HeartPulse, Droplets, BookOpen, Dna, Target, Dumbbell, Check, Info, Star, Book, GraduationCap, Microscope, Heart, Quote } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';


const nutritionists = [
    {
        name: "Dr. Anjali Mehta",
        credentials: "MD, Certified Functional Nutritionist",
        specialty: "Root Cause Analysis",
        expertise: ["Gut Health", "Autoimmune Disorders", "Metabolic Syndrome"],
        avatarUrl: "https://picsum.photos/seed/nutri1/100/100",
        dataAiHint: "female nutritionist portrait",
        rating: 4.9,
        reviews: 124,
        profile: {
            education: "MD (Internal Medicine), Certified Functional Medicine Practitioner (IFM)",
            experience: "12+ years of experience blending conventional and functional medicine.",
            philosophy: "I believe in a science-based, patient-centered approach. My goal is to move beyond symptom management to identify and address the underlying drivers of chronic illness.",
            testimonials: [
                { name: "S. Rao", text: "Dr. Mehta's approach changed my life. After years of struggling with digestive issues that no one could solve, her root-cause analysis identified the problem. I feel better than I have in a decade." },
                { name: "Priya K.", text: "Her guidance on managing my autoimmune condition through nutrition has been invaluable. She is incredibly knowledgeable and supportive." },
            ]
        }
    },
    {
        name: "Rohan Varma",
        credentials: "M.Sc. Nutrition, Dietetics",
        specialty: "Hormonal Balance & Weight Management",
        expertise: ["PCOS/PCOD", "Thyroid Health", "Sustainable Weight Loss"],
        avatarUrl: "https://picsum.photos/seed/nutri2/100/100",
        dataAiHint: "male nutritionist smiling",
        rating: 4.8,
        reviews: 98,
        profile: {
            education: "M.Sc. in Clinical Nutrition and Dietetics, Certified Diabetes Educator",
            experience: "9 years specializing in hormonal health and lifestyle modification for weight management.",
            philosophy: "Food is medicine. I help clients understand the connection between their diet and hormonal well-being, creating sustainable plans that fit their lifestyle without extreme restrictions.",
            testimonials: [
                { name: "Anitha G.", text: "Rohan helped me finally understand my PCOS. His diet plan was practical and I've seen amazing results in my cycle regulation and energy levels." },
            ]
        }
    },
    {
        name: "Priya Singh",
        credentials: "Certified Clinical Nutritionist",
        specialty: "Food Intolerance & Allergies",
        expertise: ["Food Sensitivities", "Elimination Diets", "Pediatric Nutrition"],
        avatarUrl: "https://picsum.photos/seed/nutri3/100/100",
        dataAiHint: "female nutritionist professional",
        rating: 4.9,
        reviews: 150,
         profile: {
            education: "Post Graduate Diploma in Clinical Nutrition, Certified in Food Allergy Management",
            experience: "10 years of experience helping adults and children navigate complex food intolerances.",
            philosophy: "There is no one-size-fits-all diet. I use careful analysis and guided elimination diets to pinpoint trigger foods and build a nutritious, enjoyable eating plan that restores health.",
            testimonials: [
                 { name: "Aarav's Mother", text: "Priya was amazing with my son. She helped us identify his food sensitivities and now his eczema and digestive issues are completely gone. We are so grateful." },
            ]
        }
    },
];

const tools = [
    { 
        category: "Body Metrics",
        icon: Scale,
        items: [
            { id: "bmr", name: "BMR Calculator" }, 
            { id: "bmi", name: "BMI Calculator" }, 
            { id: "bodyfat", name: "Body Fat Percentage" }
        ] 
    },
    { 
        category: "Weight Management", 
        icon: Utensils,
        items: [
            { id: "weightgain", name: "Weight Gain Calculator" }, 
            { id: "weightloss", name: "Weight Loss Calculator" }
        ] 
    },
    { 
        category: "Nutrition & Diet", 
        icon: Leaf,
        items: [
            { id: "macros", name: "Macros Calculator" }, 
            { id: "dietsuggestion", name: "Dietary Suggestion Tool" }
        ] 
    },
    { 
        category: "Digestive Health", 
        icon: HeartPulse,
        items: [
            { id: "bristol", name: "Bristol Stool Analysis" }, 
            { id: "hpylori", name: "H. Pylori Test Guide" }
        ] 
    },
    { 
        category: "Vitamins & Minerals", 
        icon: Droplets,
        items: [
            { id: "vitamins", name: "Vitamins Guide" }, 
            { id: "minerals", name: "Minerals Guide" }
        ] 
    },
    { 
        category: "Guides & Plans", 
        icon: BookOpen,
        items: [
            { id: "g1free", name: "G1 Free Diet Plan" }, 
            { id: "g1protein", name: "G1 Protein Guide" }, 
            { id: "vitcal", name: "Vitamins & Minerals Calendar" }
        ] 
    },
    { 
        category: "Advanced Health", 
        icon: Dna,
        items: [
            { id: "advgut", name: "Advanced Gut Health" }, 
            { id: "foodintolerance", name: "Food Intolerance Test" },
            { id: "oxalates", name: "Oxalates Foods List" }
        ] 
    },
];

const getBmiCategory = (bmi: number | null) => {
    if (bmi === null) return { category: "N/A", className: "" };
    if (bmi < 18.5) return { category: "Underweight", className: "bg-blue-100 text-blue-800" };
    if (bmi >= 18.5 && bmi < 25) return { category: "Normal", className: "bg-green-100 text-green-800" };
    if (bmi >= 25 && bmi < 30) return { category: "Overweight", className: "bg-yellow-100 text-yellow-800" };
    if (bmi >= 30 && bmi < 40) return { category: "Obese", className: "bg-red-100 text-red-800" };
    return { category: "Morbidly Obese", className: "bg-red-200 text-red-900" };
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
            className="text-[5px] font-bold fill-muted-foreground"
            textAnchor="middle"
        >
            <tspan x="50" y="15">{label}</tspan>
            <tspan x="50" y="21">{value}</tspan>
        </text>
    );

    return (
        <div className="relative w-[300px] h-[190px] mx-auto font-sans">
            <svg viewBox="0 0 100 65" className="w-full h-full overflow-visible">
                <path d="M 5 50 A 45 45 0 0 1 95 50" fill="none" strokeWidth="20" className="stroke-muted/10" />
                <path d="M 5 50 A 45 45 0 0 1 24.5 17.5" fill="none" strokeWidth="20" stroke="#3b82f6" />
                <path d="M 24.5 17.5 A 45 45 0 0 1 50 10" fill="none" strokeWidth="20" stroke="#22c55e" />
                <path d="M 50 10 A 45 45 0 0 1 75.5 17.5" fill="none" strokeWidth="20" stroke="#facc15" />
                <path d="M 75.5 17.5 A 45 45 0 0 1 95 50" fill="none" strokeWidth="20" stroke="#ef4444" />
                
                <GaugeLabel angle={-45} label="Normal" value="18.5-24.9" />
                <GaugeLabel angle={0} label="Overweight" value="25-29.9" />
                <GaugeLabel angle={45} label="Obese" value="30-39.9" />

                 {bmi !== null && (
                    <g transform={`rotate(${rotation} 50 50)`}>
                        <path d="M 50 10 L 48 50 L 52 50 Z" fill="hsl(var(--foreground) / 0.8)" />
                        <circle cx="50" cy="50" r="4" fill="hsl(var(--foreground))" />
                    </g>
                 )}
            </svg>

             {bmi !== null ? (
                <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-3xl font-bold text-primary">{bmi.toFixed(1)}</p>
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
                icon: HeartPulse,
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
                            <Check className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
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

function BmiCalculatorDialog({ children }: { children: React.ReactNode }) {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [heightUnit, setHeightUnit] = useState('cm');
    const [weightUnit, setWeightUnit] = useState('kg');

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
    
    const heightPlaceholders: { [key: string]: string } = { cm: 'e.g., 175', ft: 'e.g., 5.9' };
    const weightPlaceholders: { [key: string]: string } = { kg: 'e.g., 75', lbs: 'e.g., 165' };

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-lg border-2 border-foreground">
                <DialogHeader>
                    <DialogTitle>BMI Calculator</DialogTitle>
                    <DialogDescription>Calculate your Body Mass Index based on standard medical formulas.</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="height">Height</Label>
                                    <Tabs defaultValue={heightUnit} onValueChange={setHeightUnit} className="w-auto">
                                        <TabsList className="h-7 text-xs border"><TabsTrigger value="cm" className="h-5 px-2">cm</TabsTrigger><TabsTrigger value="ft" className="h-5 px-2">ft</TabsTrigger></TabsList>
                                    </Tabs>
                                </div>
                                <Input id="height" type="number" placeholder={heightPlaceholders[heightUnit]} value={height} onChange={(e) => setHeight(e.target.value)} className="border"/>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="calc-weight">Weight</Label>
                                    <Tabs defaultValue={weightUnit} onValueChange={setWeightUnit} className="w-auto">
                                        <TabsList className="h-7 text-xs border"><TabsTrigger value="kg" className="h-5 px-2">kg</TabsTrigger><TabsTrigger value="lbs" className="h-5 px-2">lbs</TabsTrigger></TabsList>
                                    </Tabs>
                                </div>
                                <Input id="calc-weight" type="number" placeholder={weightPlaceholders[weightUnit]} value={weight} onChange={(e) => setWeight(e.target.value)} className="border"/>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center pt-4 md:pt-0">
                            <BmiGauge bmi={calculatedBmi} />
                        </div>
                    </div>
                    <BmiAdvice bmi={calculatedBmi} />
                </div>
            </DialogContent>
        </Dialog>
    );
}

function ComingSoonDialog({ toolName, children }: { toolName: string; children: React.ReactNode }) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md border-2 border-foreground">
                <DialogHeader>
                    <DialogTitle>Feature Coming Soon!</DialogTitle>
                    <DialogDescription>
                        The "{toolName}" is under development. Thank you for your patience!
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

function NutritionistProfileDialog({ nutritionist }: { nutritionist: typeof nutritionists[0] }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full border-2 border-foreground">View Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl border-2 border-foreground">
                <DialogHeader>
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                        <Avatar className="h-24 w-24 border-2 border-primary">
                            <AvatarImage src={nutritionist.avatarUrl} data-ai-hint={nutritionist.dataAiHint}/>
                            <AvatarFallback className="text-3xl">{nutritionist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                            <DialogTitle className="text-2xl">{nutritionist.name}</DialogTitle>
                            <DialogDescription>{nutritionist.credentials}</DialogDescription>
                             <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                                <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />
                                <span className="font-bold text-lg">{nutritionist.rating}</span>
                                <span className="text-sm text-muted-foreground">({nutritionist.reviews} reviews)</span>
                            </div>
                        </div>
                    </div>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto p-1 space-y-6">
                    <Card className="border-2 border-foreground">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2"><Microscope className="text-primary"/> Root Cause Philosophy</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{nutritionist.profile.philosophy}</p>
                        </CardContent>
                    </Card>
                     <Card className="border-2 border-foreground">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2"><Book className="text-primary"/> Education & Experience</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                             <div className="flex items-start gap-3">
                                <GraduationCap className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0"/>
                                <div>
                                    <h4 className="font-semibold">Education</h4>
                                    <p className="text-sm text-muted-foreground">{nutritionist.profile.education}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Award className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0"/>
                                <div>
                                    <h4 className="font-semibold">Experience</h4>
                                    <p className="text-sm text-muted-foreground">{nutritionist.profile.experience}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                     <Card className="border-2 border-foreground">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2"><Heart className="text-primary"/> Patient Stories</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {nutritionist.profile.testimonials.map((testimonial, index) => (
                                <blockquote key={index} className="border-l-4 border-primary pl-4 italic">
                                    <p className="text-muted-foreground">"{testimonial.text}"</p>
                                    <footer className="mt-2 font-semibold">- {testimonial.name}</footer>
                                </blockquote>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                 <DialogFooter>
                    <ComingSoonDialog toolName="Book Consultation" >
                        <Button className="w-full bg-green-600 hover:bg-green-700">Book Consultation</Button>
                    </ComingSoonDialog>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function NutritionistCard({ nutritionist }: { nutritionist: typeof nutritionists[0] }) {
    return (
        <Card className="p-4 border-2 border-foreground">
            <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 border-2 border-green-500/50 flex-shrink-0">
                    <AvatarImage src={nutritionist.avatarUrl} data-ai-hint={nutritionist.dataAiHint} />
                    <AvatarFallback>{nutritionist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-bold">{nutritionist.name}</h3>
                    <p className="text-xs text-muted-foreground">{nutritionist.credentials}</p>
                     <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
                        <span className="font-bold text-sm">{nutritionist.rating}</span>
                        <span className="text-xs text-muted-foreground">({nutritionist.reviews} reviews)</span>
                    </div>
                </div>
            </div>

            <div className="mt-3 space-y-2">
                 <div>
                    <p className="text-sm font-semibold mb-1">Expert in:</p>
                    <div className="flex flex-wrap gap-1">
                        {nutritionist.expertise.map((exp, index) => (
                            <Dialog key={index}>
                                <DialogTrigger asChild>
                                    <Badge variant="secondary" className="cursor-pointer border hover:bg-muted">{exp}</Badge>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md border-2 border-foreground">
                                    <DialogHeader>
                                        <DialogTitle>Inquiry for: {exp}</DialogTitle>
                                        <DialogDescription>
                                            To learn more about how {nutritionist.name} can help with {exp}, please book a consultation.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <ComingSoonDialog toolName="Book Consultation">
                                            <Button className="w-full bg-green-600 hover:bg-green-700">Book Consultation</Button>
                                        </ComingSoonDialog>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        ))}
                    </div>
                </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex gap-2">
                <NutritionistProfileDialog nutritionist={nutritionist} />
                 <ComingSoonDialog toolName="Book Consultation">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">Book Consultation</Button>
                </ComingSoonDialog>
            </div>
        </Card>
    )
}

export default function FunctionalNutritionPage() {
    
    const renderToolButton = (item: { id: string, name: string }) => {
        const button = (
            <Button
                variant="outline"
                className="h-auto p-4 flex justify-between items-center text-left border-2 bg-background hover:bg-muted/50 hover:border-primary/50 group border-foreground"
            >
                <span className="text-base font-semibold">{item.name}</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
            </Button>
        );

        if (item.id === 'bmi') {
            return <BmiCalculatorDialog key={item.id}>{button}</BmiCalculatorDialog>;
        }
        
        return <ComingSoonDialog key={item.id} toolName={item.name}>{button}</ComingSoonDialog>;
    };

    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                 <h1 className="text-3xl font-extrabold tracking-tight text-green-700 dark:text-green-400">
                    Functional Nutrition
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Find the root cause of your health issues with advanced tools and expert guidance.
                </p>
            </div>

            <Card className="border-2 border-foreground shadow-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                        <Award className="h-7 w-7 text-amber-500" />
                        Meet Our Top Certified Nutritionists
                    </CardTitle>
                    <CardDescription>
                        Our experts analyze where doctors might not, focusing on the root cause to guide you to optimal health.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {nutritionists.map((nutritionist, index) => (
                        <NutritionistCard key={index} nutritionist={nutritionist} />
                    ))}
                </CardContent>
            </Card>

            <Separator />
            
            <div className="space-y-8">
                {tools.map((section, index) => (
                    <div key={index}>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                           <section.icon className="h-6 w-6 text-green-600" />
                           {section.category}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {section.items.map((item) => renderToolButton(item))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
