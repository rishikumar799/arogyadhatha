
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function TermsPage() {
    const { language } = useLanguage();

    const t = {
        en: {
            pageTitle: "Terms & Conditions",
            lastUpdated: "Last updated: July 25, 2024",
            sections: [
                {
                    title: "1. Introduction",
                    content: "Welcome to Arogyadhatha (\"App\", \"Service\"). These Terms & Conditions (\"Terms\") govern your use of our application and services. By accessing or using the Service, you agree to be bound by these Terms."
                },
                {
                    title: "2. Medical Disclaimer",
                    content: "The information provided by Arogyadhatha, including but not limited to the AI Symptom Checker, is for informational purposes only and does not constitute medical advice. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition."
                },
                {
                    title: "3. User Accounts",
                    content: "To use certain features of the App, you may be required to create an account. You are responsible for safeguarding your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account."
                },
                {
                    title: "4. Privacy Policy",
                    content: "Our Privacy Policy describes how we handle the information you provide to us when you use our Services. You understand that through your use of the Services you consent to the collection and use of this information."
                },
                {
                    title: "5. Limitation of Liability",
                    content: "In no event shall Arogyadhatha, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service."
                },
                {
                    title: "6. Changes to Terms",
                    content: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page."
                }
            ]
        },
        te: {
            pageTitle: "నిబంధనలు & షరతులు",
            lastUpdated: "చివరిగా నవీకరించబడింది: జూలై 25, 2024",
            sections: [
                {
                    title: "1. పరిచయం",
                    content: "ఆరోగ్యధాత (\"యాప్\", \"సేవ\") కు స్వాగతం. ఈ నిబంధనలు & షరతులు (\"నిబంధనలు\") మా అప్లికేషన్ మరియు సేవల యొక్క మీ వినియోగాన్ని నియంత్రిస్తాయి. సేవను యాక్సెస్ చేయడం లేదా ఉపయోగించడం ద్వారా, మీరు ఈ నిబంధనలకు కట్టుబడి ఉండటానికి అంగీకరిస్తున్నారు."
                },
                {
                    title: "2. వైద్య నిరాకరణ",
                    content: "AI లక్షణాల తనిఖీతో సహా ఆరోగ్యధాత అందించిన సమాచారం సమాచార ప్రయోజనాల కోసం మాత్రమే మరియు వైద్య సలహా కాదు. ఇది వృత్తిపరమైన వైద్య సలహా, రోగ నిర్ధారణ లేదా చికిత్సకు ప్రత్యామ్నాయం కాదు. వైద్య పరిస్థితికి సంబంధించి మీకు ఏవైనా ప్రశ్నలు ఉంటే ఎల్లప్పుడూ మీ వైద్యుడిని లేదా ఇతర అర్హతగల ఆరోగ్య ప్రదాతని సంప్రదించండి."
                },
                {
                    title: "3. వినియోగదారు ఖాతాలు",
                    content: "యాప్ యొక్క కొన్ని ఫీచర్లను ఉపయోగించడానికి, మీరు ఒక ఖాతాను సృష్టించాల్సి రావచ్చు. మీ ఖాతా సమాచారాన్ని భద్రపరచడం మరియు మీ ఖాతా క్రింద జరిగే అన్ని కార్యకలాపాలకు మీరే బాధ్యత వహించాలి. మీ ఖాతా యొక్క ఏదైనా అనధికారిక వినియోగం గురించి మాకు వెంటనే తెలియజేయడానికి మీరు అంగీకరిస్తున్నారు."
                },
                {
                    title: "4. గోప్యతా విధానం",
                    content: "మీరు మా సేవలను ఉపయోగించినప్పుడు మాకు అందించిన సమాచారాన్ని మేము ఎలా నిర్వహిస్తామో మా గోప్యతా విధానం వివరిస్తుంది. సేవల యొక్క మీ ఉపయోగం ద్వారా మీరు ఈ సమాచారం యొక్క సేకరణ మరియు వినియోగానికి అంగీకరిస్తున్నారని మీరు అర్థం చేసుకున్నారు."
                },
                {
                    title: "5. బాధ్యత యొక్క పరిమితి",
                    content: "ఏ సందర్భంలోనూ ఆరోగ్యధాత, లేదా దాని డైరెక్టర్లు, ఉద్యోగులు, భాగస్వాములు, ఏజెంట్లు, సరఫరాదారులు లేదా అనుబంధ సంస్థలు, లాభాల నష్టం, డేటా, ఉపయోగం, గుడ్‌విల్ లేదా ఇతర కనిపించని నష్టాలతో సహా ఏవైనా పరోక్ష, యాదృచ్ఛిక, ప్రత్యేక, పర్యవసానమైన లేదా శిక్షాత్మక నష్టాలకు బాధ్యత వహించరు, ఇది సేవను యాక్సెస్ చేయడం లేదా ఉపయోగించడం లేదా యాక్సెస్ చేయలేకపోవడం లేదా ఉపయోగించలేకపోవడం వల్ల కలుగుతుంది."
                },
                {
                    title: "6. నిబంధనలలో మార్పులు",
                    content: "మా ఏకైక అభీష్టానుసారం, ఈ నిబంధనలను ఎప్పుడైనా సవరించడానికి లేదా భర్తీ చేయడానికి మాకు హక్కు ఉంది. ఈ పేజీలో కొత్త నిబంధనలను పోస్ట్ చేయడం ద్వారా మేము ఏవైనా మార్పుల గురించి నోటీసును అందిస్తాము."
                }
            ]
        }
    }[language];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                 <div className="inline-block p-3 bg-primary/10 rounded-full">
                     <FileText className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl font-bold">{t.pageTitle}</h1>
                <p className="text-muted-foreground text-lg">{t.lastUpdated}</p>
            </div>

            <Card className="border-2">
                <CardContent className="p-6 space-y-6 text-muted-foreground">
                    {t.sections.map((section, index) => (
                        <section key={index} className="space-y-2">
                            <h2 className="text-2xl font-semibold text-foreground">{section.title}</h2>
                            <p>{section.content}</p>
                        </section>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
