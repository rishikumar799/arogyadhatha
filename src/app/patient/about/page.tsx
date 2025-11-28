
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function AboutPage() {
    const { language } = useLanguage();

    const t = {
        en: {
            title: "About Arogyadhatha",
            subtitle: "Your Comprehensive Health Companion",
            introductionTitle: "Introduction",
            introductionP1: "Arogyadhatha is an all-in-one digital health platform designed to empower users by providing easy access to a wide range of healthcare services and information. In a world where managing health can be complex and fragmented, Arogyadhatha serves as a single, user-friendly bridge between patients and the healthcare ecosystem. Our mission is to make healthcare simple, accessible, and personalized for everyone.",
            introductionP2: "The app is built with a mobile-first approach, featuring a clean interface and intuitive navigation. It also includes bilingual support (English and Telugu) to cater to a diverse user base.",
            coreFeaturesTitle: "Core Features",
            symptomChecker: "1. AI Symptom Checker",
            symptomCheckerDesc: "An intelligent tool that allows users to input their health symptoms and receive an AI-generated analysis, providing immediate, preliminary guidance and specialist recommendations.",
            healthTracker: "2. Health & Activity Tracker",
            healthTrackerDesc: "A personal dashboard to monitor key health vitals like BMI, blood pressure, and daily physical activity, helping users stay proactive about their health.",
            appointments: "3. Appointments",
            appointmentsDesc: "A streamlined system for finding and booking appointments with doctors across various specialties and hospitals, simplifying the process of getting medical consultations.",
            chatQueue: "4. Chat & OPD Queue",
            chatQueueDesc: "A live chat feature and a real-time queue tracking system to reduce uncertainty and wait times for outpatient appointments.",
            diagnostics: "5. Diagnostics & Reports",
            diagnosticsDesc: "A centralized hub to manage all medical reports, book diagnostic tests, and understand complex results with AI-powered analysis.",
            medicines: "6. My Medicines",
            medicinesDesc: "A personal medication management tool that tracks schedules and dosages, with an AI assistant for drug information."
        },
        te: {
            title: "ఆరోగ్యధాత గురించి",
            subtitle: "మీ సమగ్ర ఆరోగ్య సహచరుడు",
            introductionTitle: "పరిచయం",
            introductionP1: "ఆరోగ్యధాత అనేది వినియోగదారులకు విస్తృత శ్రేణి ఆరోగ్య సంరక్షణ సేవలు మరియు సమాచారాన్ని సులభంగా యాక్సెస్ చేయడం ద్వారా వారికి అధికారం కల్పించడానికి రూపొందించబడిన ఒక ఆల్-ఇన్-వన్ డిజిటల్ హెల్త్ ప్లాట్‌ఫారమ్. ఆరోగ్యాన్ని నిర్వహించడం సంక్లిష్టంగా మరియు ఖండితంగా ఉన్న ప్రపంచంలో, ఆరోగ్యధాత రోగులు మరియు ఆరోగ్య సంరక్షణ పర్యావరణ వ్యవస్థ మధ్య ఒకే, వినియోగదారు-స్నేహపూర్వక వంతెనగా పనిచేస్తుంది. ఆరోగ్య సంరక్షణను అందరికీ సులభతరం చేయడం, ప్రాప్యత చేయడం మరియు వ్యక్తిగతీకరించడం మా లక్ష్యం.",
            introductionP2: "ఈ యాప్ మొబైల్-ఫస్ట్ విధానంతో రూపొందించబడింది, ఇది శుభ్రమైన ఇంటర్‌ఫేస్ మరియు సహజమైన నావిగేషన్‌ను కలిగి ఉంటుంది. ఇది విభిన్న వినియోగదారుల కోసం ద్విభాషా మద్దతును (ఇంగ్లీష్ మరియు తెలుగు) కూడా కలిగి ఉంటుంది.",
            coreFeaturesTitle: "ప్రధాన ఫీచర్లు",
            symptomChecker: "1. AI లక్షణాల తనిఖీ",
            symptomCheckerDesc: "వినియోగదారులు వారి ఆరోగ్య లక్షణాలను ఇన్‌పుట్ చేయడానికి మరియు AI- రూపొందించిన విశ్లేషణను స్వీకరించడానికి అనుమతించే ఒక తెలివైన సాధనం, తక్షణ, ప్రాథమిక మార్గదర్శకత్వం మరియు నిపుణుల సిఫార్సులను అందిస్తుంది.",
            healthTracker: "2. ఆరోగ్యం & కార్యాచరణ ట్రాకర్",
            healthTrackerDesc: "BMI, రక్తపోటు మరియు రోజువారీ శారీరక శ్రమ వంటి ముఖ్య ఆరోగ్య వైటల్స్‌ను పర్యవేక్షించడానికి ఒక వ్యక్తిగత డాష్‌బోర్డ్, వినియోగదారులు వారి ఆరోగ్యం గురించి చురుకుగా ఉండటానికి సహాయపడుతుంది.",
            appointments: "3. అపాయింట్‌మెంట్లు",
            appointmentsDesc: "వివిధ ప్రత్యేకతలు మరియు ఆసుపత్రులలోని వైద్యులతో అపాయింట్‌మెంట్‌లను కనుగొనడం మరియు బుక్ చేయడం కోసం ఒక క్రమబద్ధమైన వ్యవస్థ, వైద్య సంప్రదింపులు పొందే ప్రక్రియను సులభతరం చేస్తుంది.",
            chatQueue: "4. చాట్ & OPD క్యూ",
            chatQueueDesc: "అవుట్‌పేషెంట్ అపాయింట్‌మెంట్‌ల కోసం అనిశ్చితిని మరియు నిరీక్షణ సమయాలను తగ్గించడానికి ఒక ప్రత్యక్ష చాట్ ఫీచర్ మరియు నిజ-సమయ క్యూ ట్రాకింగ్ సిస్టమ్.",
            diagnostics: "5. డయాగ్నోస్టిక్స్ & నివేదికలు",
            diagnosticsDesc: "అన్ని వైద్య నివేదికలను నిర్వహించడానికి, డయాగ్నోస్టిక్ పరీక్షలను బుక్ చేయడానికి మరియు AI- శక్తితో కూడిన విశ్లేషణతో సంక్లిష్ట ఫలితాలను అర్థం చేసుకోవడానికి ఒక కేంద్రీకృత హబ్.",
            medicines: "6. నా మందులు",
            medicinesDesc: "షెడ్యూల్‌లు మరియు మోతాదులను ట్రాక్ చేసే ఒక వ్యక్తిగత మందుల నిర్వహణ సాధనం, డ్రగ్ సమాచారం కోసం AI అసిస్టెంట్‌తో."
        }
    }[language];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                <div className="inline-block p-3 bg-primary/10 rounded-full">
                     <Activity className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl font-bold">{t.title}</h1>
                <p className="text-muted-foreground text-lg">{t.subtitle}</p>
            </div>

            <Card className="shadow-md border-2 border-foreground">
                <CardHeader>
                    <CardTitle>{t.introductionTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <p>{t.introductionP1}</p>
                    <p>{t.introductionP2}</p>
                </CardContent>
            </Card>

             <Card className="shadow-md border-2 border-foreground">
                <CardHeader>
                    <CardTitle>{t.coreFeaturesTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg">{t.symptomChecker}</h3>
                        <p className="text-muted-foreground">{t.symptomCheckerDesc}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg">{t.healthTracker}</h3>
                        <p className="text-muted-foreground">{t.healthTrackerDesc}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg">{t.appointments}</h3>
                        <p className="text-muted-foreground">{t.appointmentsDesc}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg">{t.chatQueue}</h3>
                        <p className="text-muted-foreground">{t.chatQueueDesc}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg">{t.diagnostics}</h3>
                        <p className="text-muted-foreground">{t.diagnosticsDesc}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg">{t.medicines}</h3>
                        <p className="text-muted-foreground">{t.medicinesDesc}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
