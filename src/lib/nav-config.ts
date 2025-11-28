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
  Video,
  FileText,
  Sparkles,
  Leaf,
  Users2,
  Gift,
  Award,
  Phone,
  Baby,
  Book,
  Settings,
  Users,
  Briefcase,
  FileQuestion
} from "lucide-react";
import { PregnantLadyIcon } from "@/components/icons/pregnant-lady-icon";
import { GovIdIcon } from "@/components/icons/gov-id-icon";

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

export interface SuperAdminMenuItem {
  id: string;
  href: string;
  label: string;
  icon: React.ElementType;
}

export const allMenuItems: MenuItem[] = [
  { id: 'home', href: "/patient", label: "Home", telugu: "హోమ్", icon: LayoutGrid, color: "hsl(var(--primary))", defaultVisible: true, customizable: false },
  { id: 'symptoms', href: "/patient/symptom-checker", label: "AI Symptom Checker", telugu: "లక్షణాలు", icon: HeartPulse, color: "hsl(var(--primary))", defaultVisible: true, customizable: false },
  { id: 'appointments', href: "/patient/appointments", label: "Book appointment & History", telugu: "నమోదులు", icon: CalendarCheck, color: "hsl(var(--primary))", defaultVisible: true, customizable: false },
  { id: 'opd', href: "/patient/opd-queue", label: "OP STATUS", telugu: "OP స్థితి", icon: MessageSquare, color: "hsl(var(--primary))", defaultVisible: true, customizable: false },
  { id: 'ntrVaidyaseva', href: "/patient/ntr-vaidyaseva", label: "NTR Vaidyaseva", telugu: "ఎన్టీఆర్ వైద్యసేవ", icon: GovIdIcon, color: "hsl(var(--primary))", defaultVisible: true, customizable: false },
  { id: 'cmReliefFund', href: "/patient/ntr-vaidyaseva?tab=cm-relief-fund", label: "CM Relief Fund", telugu: "సీఎం సహాయ నిధి", icon: HandHeart, color: "hsl(var(--primary))", defaultVisible: true, customizable: true },
  { id: 'videoCall', href: "/patient/video-call", label: "Video Call", telugu: "వీడియో కాల్", icon: Video, color: "hsl(var(--primary))", defaultVisible: false, customizable: true },
  { id: 'diagnostics', href: "/patient/lab-reports", label: "Diagnostics", telugu: "రిపోర్టులు", icon: TestTube, color: "hsl(var(--primary))", defaultVisible: true, customizable: false },
  { id: 'medicines', href: "/patient/medicines", label: "Medicines", telugu: "మందులు", icon: Pill, color: "hsl(var(--primary))", defaultVisible: true, customizable: false },
  { id: 'functionalNutrition', href: "/patient/functional-nutrition", label: "Functional Nutrition", telugu: "ఫంక్షనల్ న్యూట్రిషన్", icon: Leaf, color: "hsl(var(--primary))", defaultVisible: true, customizable: true },
  { id: 'insurances', href: "/patient/insurances", label: "Insurances", telugu: "భీమా", icon: Shield, color: "hsl(var(--primary))", defaultVisible: false, customizable: true },
  { id: 'jeevandan', href: "/patient/jeevandan", label: "Jeevandan", telugu: "జీవన్‌దాన్", icon: Award, color: "hsl(var(--primary))", defaultVisible: true, customizable: true },
  { id: 'communityFund', href: "/patient/community-fund", label: "Crowd Funding", telugu: "క్రౌడ్ ఫండింగ్", icon: Gift, color: "hsl(var(--primary))", defaultVisible: true, customizable: true },
  { id: 'oldAgeAssistant', href: "/patient/old-age-assistant", label: "Old Age Assistant", telugu: "వృద్ధాప్య సహాయం", icon: HeartHandshake, color: "hsl(var(--primary))", defaultVisible: false, customizable: true },
  { id: 'healthKnowledge', href: "/patient/health-knowledge", label: "Health Knowledge", telugu: "ఆరోగ్య పరిజ్ఞానం", icon: BookOpenCheck, color: "hsl(var(--primary))", defaultVisible: false, customizable: true },
  { id: 'surgery', href: '/patient/surgery-care', label: 'Surgery Care', telugu: 'సర్జరీ కేర్', icon: Stethoscope, color: 'hsl(var(--primary))', defaultVisible: false, customizable: true },
  { id: 'bloodBank', href: "/patient/blood-bank", label: "Blood Bank", telugu: "రక్త నిధి", icon: Droplets, color: "hsl(var(--nav-blood-bank))", defaultVisible: true, customizable: true },
  { id: 'healthTracker', href: "/patient/health-tracker", label: "Health Tracker", telugu: "ఆరోగ్య ట్రాకర్", icon: Activity, color: "hsl(var(--primary))", defaultVisible: false, customizable: true },
  { id: 'jrDoctors', href: "/patient/junior-doctors", label: "24/7 Jr. Doctors", telugu: "ఉచిత సలహా", icon: Phone, color: "hsl(var(--primary))", defaultVisible: false, customizable: true },
  { id: 'pregnancy', href: "/patient/pregnancy-tracker", label: "Pregnancy Care", telugu: "గర్భం", icon: Baby, color: "hsl(var(--primary))", defaultVisible: false, customizable: true },
  { id: 'profile', href: "/patient/profile", label: "Profile", telugu: "ప్రొఫైల్", icon: User, color: "hsl(var(--primary))", defaultVisible: true, customizable: true },
  { id: 'ntrVaidyasevaDiseases', href: "/patient/aarogyasri-diseases", label: "NTR Vaidyaseva Diseases", telugu: "ఎన్టీఆర్ వైద్యసేవ వ్యాధులు", icon: Book, color: "hsl(var(--primary))", defaultVisible: false, customizable: true },
  { id: 'emergency', href: "/patient/emergency", label: "Emergency", telugu: "తక్షణ సహాయం", icon: Siren, color: "hsl(var(--destructive))", defaultVisible: true, customizable: false },
];

export const superAdminMenuItems: SuperAdminMenuItem[] = [
  { id: 'dashboard', href: '/superadmin/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'users', href: '/superadmin/users', label: 'Users', icon: Users },
  { id: 'requests', href: '/superadmin/requests', label: 'Requests', icon: FileQuestion },
  { id: 'hospitals', href: '/superadmin/hospitals', label: 'Hospitals', icon: Briefcase },
  { id: 'appointments', href: '/superadmin/appointments', label: 'Appointments', icon: CalendarCheck },
  { id: 'diagnostics', href: '/superadmin/diagnostics', label: 'Diagnostics', icon: TestTube },
  { id: 'pharmacy', href: '/superadmin/pharmacy', label: 'Pharmacy', icon: Pill },
  { id: 'customize', href: '/superadmin/customize', label: 'Customize', icon: Sparkles },
  { id: 'settings', href: '/superadmin/settings', label: 'Settings', icon: Settings },
];
