
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HeartPulse, MessageSquare, Siren, Users, TestTube, FlaskConical, LifeBuoy, Stethoscope, Microscope, Pill, Headset, Phone, Link2, CalendarCheck, User, Heart, Baby, Leaf, Droplets, Wind, Brain, LayoutGrid, Activity, FileText, MapPin, UserPlus, Shield, CheckCircle, ChevronLeft, ChevronRight, AlertTriangle, Globe, BookOpenCheck, HandHeart, Users2 } from 'lucide-react';
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


const quickAccessItems = [
  { href: '/patients/symptom-checker', icon: HeartPulse, label: 'AI Symptom Checker', telugu: 'వైద్య లక్షణాలు తనిఖీ', color: 'hsl(var(--nav-symptoms))' },
  { href: '/patients/appointments', icon: CalendarCheck, label: 'Book appointment & History', telugu: 'సమయం నమోదు చేసుకోండి', color: 'hsl(var(--nav-appointments))' },
  { href: '/patients/opd-queue', icon: MessageSquare, label: 'OP STATUS', telugu: 'OP స్థితి', color: 'hsl(var(--nav-chat))' },
  { href: '/patients/lab-reports', icon: TestTube, label: 'Diagnostics', telugu: 'రిపోర్టులు చూడండి', color: 'hsl(var(--nav-diagnostics))' },
  { href: '/patients/medicines', icon: Pill, label: 'My Medicines', telugu: 'మీ మందులు', color: 'hsl(var(--nav-medicines))' },
  { href: '/patients/health-knowledge', icon: BookOpenCheck, label: 'Health Knowledge', telugu: 'ఆరోగ్య పరిజ్ఞానం', color: 'hsl(var(--nav-profile))' },
  { href: '/patients/insurances', icon: Shield, label: 'Insurances', telugu: 'భీమా', color: 'hsl(var(--nav-profile))' },
  { href: '/patients/community-fund', icon: HandHeart, label: 'Crowd Funding', telugu: 'క్రౌడ్ ఫండింగ్', color: 'hsl(var(--nav-blood-bank))' },
  { href: '/patients/blood-bank', icon: Droplets, label: 'Blood Bank', telugu: 'రక్త నిధి', color: 'hsl(var(--nav-blood-bank))' },
  { href: '/patients/health-tracker', label: 'Health Tracker', telugu: 'ఆరోగ్య ట్రాకర్', icon: Activity, color: 'hsl(var(--nav-profile))' },
  { href: '/patients/junior-doctors', icon: Headset, label: '24/7 Jr. Doctors', telugu: 'ఉచిత సలహా', color: 'hsl(var(--nav-junior-doctors))' },
  { href: '/patients/pregnancy-tracker', label: 'Pregnancy Care', telugu: 'గర్భం', icon: PregnantLadyIcon, color: 'hsl(var(--nav-appointments))' },
  { href: '/patients/old-age-assistant', label: 'Old Age Assistant', telugu: 'వృద్ధాప్య సహాయం', icon: Users2, color: 'hsl(var(--nav-old-age))' },
  { href: '/patients/profile', icon: User, label: 'Profile', telugu: 'ప్రొఫైల్', color: 'hsl(var(--nav-profile))' },
  { href: '/patients/emergency', icon: Siren, label: 'Emergency', telugu: 'తక్షణ సహాయం', color: 'hsl(var(--nav-emergency))' },
  { href: '/patients/surgery-care', label: 'Surgery Care', telugu: 'సర్జరీ కేర్', icon: Stethoscope, color: 'hsl(var(--nav-appointments))'},
];

const medicineAssistanceItems = [
    { 
        icon: FlaskConical, 
        title: 'AI Medicine Assistant',
        description: 'Get instant answers about your medications.',
        buttonText: 'Ask AI',
        href: '/patients/medicine-assistant'
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
        href: "/patients/appointments",
        textColor: "text-white",
        bgColor: "bg-teal-500",
    },
    {
        title: "Daily Health Tip: Stay hydrated by drinking at least 8 glasses of water throughout the day!",
        buttonText: "Learn More",
        buttonIcon: Leaf,
        href: "/patients/health-tracker",
        textColor: "text-white",
        bgColor: "bg-green-500",
    },
    {
        title: "New Feature: Link your Aarogyasri & ABHA ID to manage all health records in one place.",
        buttonText: "Link Now",
        buttonIcon: Link2,
        href: "/patients/insurances#gov-health-ids",
        textColor: "text-white",
        bgColor: "bg-indigo-500",
    },
    {
        title: "Limited Time Offer: Get 20% off on all master health checkups this month!",
        buttonText: "Book Now",
        buttonIcon: TestTube,
        href: "/patients/lab-reports",
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
                    r={radius}
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
            <Card className="border">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">{language === 'en' ? 'Quick Access' : 'త్వరిత యాక్సెస్'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 gap-2">
                        {quickAccessItems.map((item) => (
                            <Link key={item.href} href={item.href} passHref>
                                <div
                                className="transition-colors hover:bg-background cursor-pointer h-full flex flex-col items-center justify-start text-center gap-1 p-2 rounded-lg"
                                >
                                <div className="p-3 rounded-full mb-1 bg-background">
                                    <item.icon className="h-6 w-6 text-primary" />
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
          <Card className="border">
            <CardHeader>
                <h2 className="text-lg font-semibold">{language === 'en' ? 'Organ Health Overview' : 'అవయవాల ఆరోగ్య స్థూలదృష్టి'}</h2>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-yellow-50 border-yellow-200 rounded-lg p-3">
                   <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-700 mt-0.5 flex-shrink-0"/>
                        <div>
                            <h4 className="font-semibold text-yellow-800 text-sm">{language === 'en' ? 'Disclaimer: For Your Safety' : 'గమనిక: మీ భద్రత కోసం'}</h4>
                            <p className="text-xs text-yellow-700">
                                {language === 'en' 
                                    ? "This 'Organ Health Overview' is for informational purposes only. I am an AI, and my analysis is based on your uploaded health data—it is **not** a medical diagnosis. For any health concerns or before taking any action, you must **always consult a qualified human doctor.**"
                                    : "ఈ 'అవయవాల ఆరోగ్య స్థూలదృష్టి' కేవలం సమాచార ప్రయోజనాల కోసం మాత్రమే. నేను ఒక AI, మరియు నా విశ్లేషణ మీరు అప్‌లోడ్ చేసిన ఆరోగ్య డేటాపై ఆధారపడి ఉంటుంది—ఇది వైద్య నిర్ధారణ **కాదు**. ఏవైనా ఆరోగ్య సమస్యల కోసం లేదా ఏదైనా చర్య తీసుకునే ముందు, మీరు తప్పనిసరిగా **అర్హతగల మానవ వైద్యుడిని సంప్రదించాలి.**"
                                }
                            </p>
                        </div>
                   </div>
                </div>
               <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {organHealthData.map((organ) => (
                         <OrganHealthDialog key={organ.name} organ={organ}>
                            <Card className="p-2 flex flex-col items-center text-center cursor-pointer hover:bg-background border">
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
                </div>
            </CardContent>
          </Card>
        </section>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold mb-2">{language === 'en' ? 'App Updates & Health Tips' : 'యాప్ అప్‌డేట్‌లు & ఆరోగ్య చిట్కాలు'}</h2>
          <Carousel
              setApi={setApi}
              plugins={[plugin.current]}
              className="w-full border rounded-lg overflow-hidden"
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
                  <Card className="hover:shadow-md transition-shadow cursor-pointer border">
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
                style={{ height: 'auto' }}
                data-ai-hint="google play badge"
              />
            </Link>
            <Link href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/640px-Download_on_the_App_Store_Badge.svg.png"
                alt="Download on the App Store"
                width={134}
                height={50}
                style={{ height: 'auto' }}
                data-ai-hint="app store badge"
              />
            </Link>
          </div>
        </section>
      </div>
  );
}
