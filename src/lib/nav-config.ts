
import {
  HeartPulse,
  MessageSquare,
  Siren,
  TestTube,
  Pill,
  CalendarCheck,
  LayoutGrid,
  Headset,
  Activity,
  Heart,
  Droplets,
  Stethoscope,
  Shield,
  User,
  Globe,
  BookOpenCheck,
  Languages,
  HandHeart,
  HeartHandshake,
  Video
} from "lucide-react";
import { PregnantLadyIcon } from "@/components/icons/pregnant-lady-icon";
import { Users2 } from 'lucide-react';

export interface MenuItem {
    id: string;
    href: string;
    label: string;
    telugu: string;
    icon: React.ElementType;
    color: string;
    defaultVisible: boolean;
    customizable: boolean;
}

export const allMenuItems: MenuItem[] = [
  { id: 'home', href: "/", label: "Home", telugu: "హోమ్", icon: LayoutGrid, color: "hsl(var(--nav-home))", defaultVisible: true, customizable: false },
  { id: 'symptoms', href: "/symptom-checker", label: "AI Symptom Checker", telugu: "లక్షణాలు", icon: HeartPulse, color: "hsl(var(--nav-symptoms))", defaultVisible: true, customizable: false },
  { id: 'appointments', href: "/appointments", label: "Book appointment & History", telugu: "నమోదులు", icon: CalendarCheck, color: "hsl(var(--nav-appointments))", defaultVisible: true, customizable: false },
  { id: 'opd', href: "/opd-queue", label: "OP STATUS", telugu: "OP స్థితి", icon: MessageSquare, color: "hsl(var(--nav-chat))", defaultVisible: true, customizable: false },
  { id: 'videoCall', href: "/video-call", label: "Video Call", telugu: "వీడియో కాల్", icon: Video, color: "hsl(var(--nav-chat))", defaultVisible: true, customizable: true },
  { id: 'diagnostics', href: "/lab-reports", label: "Diagnostics", telugu: "రిపోర్టులు", icon: TestTube, color: "hsl(var(--nav-diagnostics))", defaultVisible: true, customizable: false },
  { id: 'medicines', href: "/medicines", label: "Medicines", telugu: "మందులు", icon: Pill, color: "hsl(var(--nav-medicines))", defaultVisible: true, customizable: false },
  { id: 'crowdFunding', href: "/community-fund", label: "Crowd Funding", telugu: "క్రౌడ్ ఫండింగ్", icon: HandHeart, color: "hsl(var(--nav-blood-bank))", defaultVisible: true, customizable: true },
  { id: 'oldAgeAssistant', href: "/old-age-assistant", label: "Old Age Assistant", telugu: "వృద్ధాప్య సహాయం", icon: Users2, color: "hsl(var(--nav-old-age))", defaultVisible: true, customizable: true },
  { id: 'healthKnowledge', href: "/health-knowledge", label: "Health Knowledge", telugu: "ఆరోగ్య పరిజ్ఞానం", icon: BookOpenCheck, color: "hsl(var(--nav-profile))", defaultVisible: true, customizable: true },
  { id: 'surgery', href: '/surgery-care', label: 'Surgery Care', telugu: 'సర్జరీ కేర్', icon: Stethoscope, color: 'hsl(var(--nav-appointments))', defaultVisible: false, customizable: true },
  { id: 'bloodBank', href: "/blood-bank", label: "Blood Bank", telugu: "రక్త నిధి", icon: HeartHandshake, color: "hsl(var(--nav-blood-bank))", defaultVisible: false, customizable: true },
  { id: 'healthTracker', href: "/health-tracker", label: "Health Tracker", telugu: "ఆరోగ్య ట్రాకర్", icon: Heart, color: "hsl(var(--nav-profile))", defaultVisible: false, customizable: true },
  { id: 'jrDoctors', href: "/junior-doctors", label: "Jr. Doctors", telugu: "డాక్టర్లు", icon: Headset, color: "hsl(var(--nav-junior-doctors))", defaultVisible: false, customizable: true },
  { id: 'pregnancy', href: "/pregnancy-tracker", label: "Pregnancy Care", telugu: "గర్భం", icon: PregnantLadyIcon, color: "hsl(var(--nav-appointments))", defaultVisible: false, customizable: true },
  { id: 'insurances', href: "/insurances", label: "Insurances", telugu: "భీమా", icon: Shield, color: "hsl(var(--nav-profile))", defaultVisible: false, customizable: true },
  { id: 'profile', href: "/profile", label: "Profile", telugu: "ప్రొఫైల్", icon: User, color: "hsl(var(--nav-profile))", defaultVisible: true, customizable: true },
  { id: 'emergency', href: "/emergency", label: "Emergency", telugu: "తక్షణ సహాయం", icon: Siren, color: "hsl(var(--destructive))", defaultVisible: true, customizable: false },
];
