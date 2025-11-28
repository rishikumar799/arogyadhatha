

'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HeartPulse, MessageSquare, Siren, Users, TestTube, FlaskConical, LifeBuoy, Stethoscope, Microscope, Pill, Headset, Phone, Link2, CalendarCheck, User, Heart, Baby, Leaf, Droplets, Wind, Brain, LayoutGrid, Activity, FileText, MapPin, UserPlus, Shield, CheckCircle, ChevronLeft, ChevronRight, AlertTriangle, Globe, BookOpenCheck, HandHeart, Users2, Gift, Award, HeartHandshake } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { useRef, useEffect, useState } from 'react';
import { PregnantLadyIcon } from '@/components/icons/pregnant-lady-icon';
import { GovIdIcon } from '@/components/icons/gov-id-icon';
import { formatDistanceToNow } from "date-fns";
import { HealthOverview } from './health-overview';
import { OrganHealthDialog } from '@/components/layout/organ-health-dialog';
import { organHealthData } from '@/lib/organ-health-data';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/context/language-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';


const quickAccessItems = [
  { href: '/patient/symptom-checker', icon: HeartPulse, label: 'AI Symptom Checker', telugu: 'వైద్య లక్షణాలు తనిఖీ', color: 'hsl(var(--nav-symptoms))' },
  { href: '/patient/appointments', icon: CalendarCheck, label: 'Book appointment & History', telugu: 'సమయం నమోదు చేసుకోండి', color: 'hsl(var(--nav-appointments))' },
  { href: '/patient/opd-queue', icon: MessageSquare, label: 'OP STATUS', telugu: 'OP స్థితి', color: 'hsl(var(--nav-chat))' },
  { href: '/patient/aarogyasri-claims', label: 'NTR Vaidyaseva', telugu: 'ఎన్టీఆర్ వైద్యసేవ', icon: GovIdIcon, color: 'hsl(var(--primary))' },
  { href: '/patient/lab-reports', icon: TestTube, label: 'Diagnostics', telugu: 'రిపోర్టులు చూడండి', color: 'hsl(var(--nav-diagnostics))' },
  { href: '/patient/medicines', icon: Pill, label: 'My Medicines', telugu: 'మీ మందులు', color: 'hsl(var(--nav-medicines))' },
  { href: '/patient/functional-nutrition', icon: Leaf, label: 'Functional Nutrition', telugu: 'ఫంక్షనల్ న్యూట్రిషన్', color: 'hsl(var(--primary))' },
  { href: '/patient/health-knowledge', icon: BookOpenCheck, label: 'Health Knowledge', telugu: 'ఆరోగ్య పరిజ్ఞానం', color: 'hsl(var(--nav-profile))' },
  { href: '/patient/insurances', icon: Shield, label: 'Insurances', telugu: 'భీమా', color: 'hsl(var(--nav-profile))' },
  { href: '/patient/community-fund', icon: Gift, label: 'Crowd Funding', telugu: 'క్రౌడ్ ఫండింగ్', color: 'hsl(var(--nav-blood-bank))' },
  { href: '/patient/blood-bank', icon: Droplets, label: 'Blood Bank', telugu: 'రక్త నిధి', color: 'hsl(var(--nav-blood-bank))' },
  { href: '/patient/jeevandan', icon: Award, label: 'Jeevandan', telugu: 'జీవన్‌దాన్', color: 'hsl(var(--nav-symptoms))' },
  { href: '/patient/health-tracker', label: 'Health Tracker', telugu: 'ఆరోగ్య ట్రాకర్', icon: Activity, color: 'hsl(var(--nav-profile))' },
  { href: '/patient/junior-doctors', icon: Phone, label: '24/7 Jr. Doctors', telugu: 'ఉచిత సలహా', color: 'hsl(var(--nav-junior-doctors))' },
  { href: '/patient/pregnancy-tracker', label: 'Pregnancy Care', telugu: 'గర్భం', icon: Baby, color: 'hsl(var(--nav-appointments))' },
  { href: '/patient/old-age-assistant', label: 'Old Age Assistant', telugu: 'వృద్ధాప్య సహాయం', icon: HeartHandshake, color: 'hsl(var(--nav-old-age))' },
  { href: '/patient/profile', icon: User, label: 'Profile', telugu: 'ప్రొఫైల్', color: 'hsl(var(--nav-profile))' },
  { href: '/patient/emergency', icon: Siren, label: 'Emergency', telugu: 'తక్షణ సహాయం', color: 'hsl(var(--nav-emergency))' },
  { href: '/patient/surgery-care', label: 'Surgery Care', telugu: 'సర్జరీ కేర్', icon: Stethoscope, color: 'hsl(var(--nav-appointments))'},
];

const medicineAssistanceItems = [
    { 
        icon: FlaskConical, 
        title: 'AI Medicine Assistant',
        description: 'Get instant answers about your medications.',
        buttonText: 'Ask AI',
        href: '/patient/medicine-assistant'
    },
    { 
        icon: Users, 
        title: 'Pharmacist Consultation',
        description: 'Speak with a licensed pharmacist for expert advice.',
        buttonText: 'Consult',
        href: '#'
    },
];

const carouselSlides = [
    {
        title: "50% OFF on All Doctor Consultations!",
        description: "Use code AROGYADHATHA to get half price on any consultation booking.",
        buttonText: "Book an Appointment",
        buttonIcon: CheckCircle,
        href: "/appointments",
        textColor: "text-white",
        bgColor: "bg-teal-500",
    },
    {
        title: "Daily Health Tip: Stay hydrated by drinking at least 8 glasses of water throughout the day!",
        buttonText: "Learn More",
        buttonIcon: Leaf,
        href: "/health-tracker",
        textColor: "text-white",
        bgColor: "bg-green-500",
    },
    {
        title: "New Feature: Link your NTR Vaidyaseva & ABHA ID to manage all health records in one place.",
        buttonText: "Link Now",
        buttonIcon: Link2,
        href: "/insurances#gov-health-ids",
        textColor: "text-white",
        bgColor: "bg-indigo-500",
    },
    {
        title: "Limited Time Offer: Get 20% off on all master health checkups this month!",
        buttonText: "Book Now",
        buttonIcon: TestTube,
        href: "/lab-reports",
        textColor: "text-white",
        bgColor: "bg-purple-500",
    },
];

const CircularProgress = ({ percentage, children, size = 100, strokeWidth = 8, color } : { percentage: number | null, children: React.ReactNode, size?: number, strokeWidth?: number, color?: string }) => {
    const validPercentage = (percentage === null || isNaN(percentage)) ? 0 : percentage;

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
                    r={(size - strokeWidth) / 2}
                    cx={size/2}
                    cy={size/2}
                />
                {percentage !== null && (
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
                )}
            </svg>
            <div className="absolute">{children}</div>
        </div>
    );
};

export default function DashboardPage() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const { language } = useLanguage();
 
  useEffect(() => {
    if (!api) {
      return
    }
 
    setCurrent(api.selectedScrollSnap() + 1)
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])


  const scoreGuide = [
      { range: "90% - 95%", meaning: "Excellent" },
      { range: "80% - 89%", meaning: "Good" },
      { range: "70% - 79%", meaning: "Somewhat Good" },
      { range: "50% - 69%", meaning: "Needs Consultation" },
  ];

  return (
    <div className="space-y-6">
        
        <div className="text-center">
            <p className="text-xs md:text-base font-bold text-foreground">
                {language === 'en'
                    ? "Right disease for right doctor + Right Diet = 99% cure"
                    : "సరైన వ్యాధికి సరైన డాక్టర్ + సరైన ఆహారం = 99% నివారణ"
                }
            </p>
        </div>


        <section className="-mt-4">
            <Card className="shadow-md border-2 border-foreground">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">{language === 'en' ? 'Quick Access' : 'త్వరిత యాక్సెస్'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 gap-2">
                        {quickAccessItems.map((item) => (
                            <Link key={item.label} href={item.href} passHref>
                                <div
                                className="transition-colors hover:bg-background cursor-pointer h-full flex flex-col items-center justify-start text-center gap-1 p-2 rounded-lg"
                                >
                                <div className="mb-1 flex items-center justify-center h-10 w-10">
                                    <item.icon className="h-8 w-8" style={{color: item.color}} />
                                </div>
                                <p className="font-bold text-xs leading-tight text-foreground">{language === 'en' ? item.label : item.telugu}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </section>
        
        <section>
          <Card className="shadow-md border-2 border-foreground">
            <CardHeader className="pb-2">
                <CardTitle>{language === 'en' ? 'Organ Health Overview' : 'అవయవాల ఆరోగ్య స్థూలదృష్టి'}</CardTitle>
                <div className="bg-yellow-50 border-yellow-200 rounded-lg p-2 text-xs border">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-700 mt-0.5 flex-shrink-0"/>
                        <p className="text-yellow-800">
                           {language === 'en' 
                                ? "I am an AI, and. my analysis is based on your uploaded health data—it is not a medical diagnosis. You must always consult a qualified human doctor."
                                : "నేను AIని, మరియు నా విశ్లేషణ మీ అప్‌లోడ్ చేసిన ఆరోగ్య డేటాపై ఆధారపడి ఉంటుంది—ఇది వైద్య నిర్ధారణ కాదు. మీరు ఎల్లప్పుడూ అర్హతగల మానవ వైద్యుడిని సంప్రదించాలి."}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {organHealthData.map((organ) => (
                         <OrganHealthDialog key={organ.name} organ={organ}>
                            <Card className="p-2 flex flex-col items-center text-center cursor-pointer hover:bg-muted/50 border-2">
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
                                <p className="font-semibold text-sm" style={{color: organ.color}}>
                                    {organ.healthScore !== null ? `${organ.healthScore}%` : '--%'}
                                </p>
                                <p className="text-xs font-semibold" style={{color: organ.color}}>{organ.status}</p>
                            </Card>
                        </OrganHealthDialog>
                    ))}
                </div>
                <Separator className="my-4" />
                <div className="p-4 rounded-lg border-2 bg-muted/40">
                  <h3 className="text-base font-semibold mb-1">Health Score Guide</h3>
                  <p className="text-xs text-muted-foreground mb-3">This guide helps you understand the scores. Do not worry; a human doctor can solve these problems.</p>
                  <div className="space-y-2 text-sm">
                      {scoreGuide.map((item, index) => (
                          <div key={index} className="flex justify-between border-b pb-2 last:border-b-0">
                              <span className="font-medium text-muted-foreground">{item.range}</span>
                              <span className="font-semibold">{item.meaning}</span>
                          </div>
                      ))}
                  </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold mb-2">{language === 'en' ? 'App Updates & Health Tips' : 'యాప్ అప్‌డేట్‌లు & ఆరోగ్య చిట్కాలు'}</h2>
          <Carousel
              setApi={setApi}
              plugins={[plugin.current]}
              className="w-full shadow-md border-2 border-foreground rounded-lg overflow-hidden"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
          >
              <CarouselContent>
                  {carouselSlides.map((slide, index) => (
                      <CarouselItem key={index}>
                          <div 
                              className={cn("p-6 flex items-center justify-center text-center min-h-[180px] relative", slide.textColor, slide.bgColor)}
                          >
                               <div className="space-y-3 z-20 flex flex-col items-center justify-center h-full">
                                  <p className="font-bold text-xl drop-shadow-md max-w-lg mx-auto">{slide.title}</p>
                                  {slide.description && <p className="text-sm drop-shadow-sm">{slide.description}</p>}
                                  <Link href={slide.href}>
                                      <Button variant="outline" className="bg-background/80 hover:bg-background font-bold shrink-0 border text-foreground">
                                          <slide.buttonIcon className="mr-2 h-4 w-4" /> {slide.buttonText}
                                      </Button>
                                  </Link>
                              </div>
                          </div>
                      </CarouselItem>
                  ))}
              </CarouselContent>
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-30">
                  {carouselSlides.map((_, index) => (
                      <button
                          key={index}
                          onClick={() => api?.scrollTo(index)}
                          className={cn(
                              "h-2 w-2 rounded-full transition-all bg-white/50",
                              current === index + 1 ? "w-4 bg-white" : "hover:bg-white/80"
                          )}
                          aria-label={`Go to slide ${index + 1}`}
                      />
                  ))}
              </div>
          </Carousel>
        </div>

        <section>
          <h2 className="text-lg font-semibold mb-2">{language === 'en' ? 'Medicine Assistance' : 'మందుల సహాయం'}</h2>
          <div className="space-y-4">
            {medicineAssistanceItems.map((item) => (
               <Link key={item.title} href={item.href} passHref>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 border-foreground shadow-md">
                      <CardContent className="p-4 flex items-center gap-4">
                          <div className="bg-primary/10 p-3 rounded-full">
                              <item.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                              <h3 className="font-semibold">{item.title}</h3>
                              <p className="text-sm text-muted-foreground">{item.description}</p>

                          </div>
                          <Button size="sm" variant="ghost" className="text-primary">{item.buttonText}</Button>
                      </CardContent>
                  </Card>
              </Link>
            ))}
          </div>
        </section>
        
        <section className="text-center py-6">
          <h2 className="text-lg font-semibold mb-2">{language === 'en' ? 'Download The App' : 'యాప్‌ను డౌన్‌లోడ్ చేసుకోండి'}</h2>
          <div className="flex justify-center gap-4">
            <Link href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                width={150}
                height={50}
                data-ai-hint="google play badge"
              />
            </Link>
            <Link href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/640px-Download_on_the_App_Store_Badge.svg.png"
                alt="Download on the App Store"
                width={134}
                height={50}
                data-ai-hint="app store badge"
              />
            </Link>
          </div>
        </section>
      </div>
  );
}
