
import { CalendarCheck, FileText, Pill, Settings, Heart, TestTube, MessageSquare, Sparkles } from 'lucide-react';

export const notifications = [
    {
        id: '5',
        title: 'Navigation Updated',
        description: 'Your changes will be applied on the next page load.',
        telugu: { title: 'నావిగేషన్ నవీకరించబడింది', description: 'మీ మార్పులు తదుపరి పేజీ లోడ్‌లో వర్తిస్తాయి.' },
        timestamp: new Date(),
        read: false,
        icon: Settings,
        href: '/patients/profile',
        category: 'Settings'
    },
    {
        id: '1',
        title: 'Appointment Reminder',
        description: 'Your appointment with Dr. Ramesh Babu is tomorrow at 10:00 AM.',
        telugu: { title: 'అపాయింట్‌మెంట్ రిమైండర్', description: 'డాక్టర్ రమేష్ బాబుతో మీ అపాయింట్‌మెంట్ రేపు ఉదయం 10:00 గంటలకు ఉంది.' },
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: false,
        icon: CalendarCheck,
        href: '/patients/opd-queue',
        category: 'Appointments'
    },
    {
        id: '2',
        title: 'Report Ready',
        description: 'Your Complete Blood Count report is ready to view.',
        telugu: { title: 'నివేదిక సిద్ధంగా ఉంది', description: 'మీ పూర్తి రక్త గణన నివేదిక వీక్షించడానికి సిద్ధంగా ఉంది.' },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: false,
        icon: FileText,
        href: '/patients/lab-reports',
        category: 'Reports'
    },
    {
        id: '9',
        title: 'AI Analysis Complete',
        description: 'The AI analysis for your recent blood test is complete. No major abnormalities found.',
        telugu: { title: 'AI విశ్లేషణ పూర్తయింది', description: 'మీ ఇటీవలి రక్త పరీక్ష కోసం AI విశ్లేషణ పూర్తయింది. పెద్ద అసాధారణతలు ఏవీ కనుగొనబడలేదు.' },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        read: false,
        icon: Sparkles,
        href: '/patients/lab-reports',
        category: 'Reports'
    },
    {
        id: '3',
        title: 'Medication Time',
        description: "It's time to take your Metformin.",
        telugu: { title: 'మందుల సమయం', description: 'మీ మెట్‌ఫార్మిన్ తీసుకునే సమయం ఆసన్నమైంది.' },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
        read: true,
        icon: Pill,
        href: '/patients/medicines',
        category: 'Medications'
    },
     {
        id: '4',
        title: 'Appointment Confirmed',
        description: 'Your booking with Dr. Lakshmi Narasaiah for Aug 12 is confirmed.',
        telugu: { title: 'అపాయింట్‌మెంట్ నిర్ధారించబడింది', description: 'ఆగస్టు 12న డాక్టర్ లక్ష్మీ నరసయ్యతో మీ బుకింగ్ నిర్ధారించబడింది.' },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        read: true,
        icon: CalendarCheck,
        href: '/patients/opd-queue',
        category: 'Appointments'
    },
    {
        id: '10',
        title: 'Appointment Rescheduled',
        description: "Dr. Anjali's clinic has rescheduled your appointment to Aug 14 at 11:00 AM.",
        telugu: { title: 'అపాయింట్‌మెంట్ రీషెడ్యూల్ చేయబడింది', description: 'డాక్టర్ అంజలి క్లినిక్ మీ అపాయింట్‌మెంట్‌ను ఆగస్టు 14 ఉదయం 11:00 గంటలకు రీషెడ్యూల్ చేసింది.' },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2.5),
        read: false,
        icon: CalendarCheck,
        href: '/patients/opd-queue',
        category: 'Appointments'
    },
    {
        id: '6',
        title: 'New Message from Clinic',
        description: 'Dr. Ramesh Babu\'s clinic sent you a message regarding your follow-up.',
        telugu: { title: 'క్లినిక్ నుండి కొత్త సందేశం', description: 'డాక్టర్ రమేష్ బాబు క్లినిక్ మీ ఫాలో-అప్ గురించి మీకు ఒక సందేశం పంపింది.' },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        read: true,
        icon: MessageSquare,
        href: '/patients/opd-queue',
        category: 'Appointments'
    },
    {
        id: '11',
        title: 'Prescription Refill Reminder',
        description: 'Your prescription for Metformin is running low. Please consult your doctor for a refill.',
        telugu: { title: 'ప్రిస్క్రిప్షన్ రీఫిల్ రిమైండర్', description: 'మీ మెట్‌ఫార్మిన్ ప్రిస్క్రిప్షన్ తక్కువగా ఉంది. దయచేసి రీఫిల్ కోసం మీ వైద్యుడిని సంప్రదించండి.' },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3.5),
        read: true,
        icon: Pill,
        href: '/patients/medicines',
        category: 'Medications'
    },
    {
        id: '7',
        title: 'Test Results Uploaded',
        description: 'Your Liver Function Test results have been added to your record.',
        telugu: { title: 'పరీక్ష ఫలితాలు అప్‌లోడ్ చేయబడ్డాయి', description: 'మీ లివర్ ఫంక్షన్ టెస్ట్ ఫలితాలు మీ రికార్డుకు జోడించబడ్డాయి.' },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
        read: true,
        icon: TestTube,
        href: '/patients/lab-reports',
        category: 'Reports'
    },
    {
        id: '8',
        title: 'Health Tracker Summary',
        description: 'You met your activity goals for 5 days last week. Keep it up!',
        telugu: { title: 'హెల్త్ ట్రాకర్ సారాంశం', description: 'గత వారం మీరు 5 రోజులు మీ కార్యాచరణ లక్ష్యాలను చేరుకున్నారు. దానిని కొనసాగించండి!' },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        read: true,
        icon: Heart,
        href: '/patients/health-tracker',
        category: 'General'
    },
    {
        id: '12',
        title: 'Password Changed',
        description: 'Your account password was successfully changed.',
        telugu: { title: 'పాస్‌వర్డ్ మార్చబడింది', description: 'మీ ఖాతా పాస్‌వర్డ్ విజయవంతంగా మార్చబడింది.' },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
        read: true,
        icon: Settings,
        href: '/patients/settings',
        category: 'Settings'
    },
    {
        id: '13',
        title: 'Daily Health Tip',
        description: 'Tip: Staying hydrated is key to good health. Aim for 8 glasses of water a day.',
        telugu: { title: 'రోజువారీ ఆరోగ్య చిట్కా', description: 'చిట్కా: హైడ్రేట్‌గా ఉండటం మంచి ఆరోగ్యానికి కీలకం. రోజుకు 8 గ్లాసుల నీరు త్రాగాలని లక్ష్యంగా పెట్టుకోండి.' },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        read: true,
        icon: Heart,
        href: '/patients/health-tracker',
        category: 'General'
    }
];
