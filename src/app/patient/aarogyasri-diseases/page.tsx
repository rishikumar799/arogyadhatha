
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, ShieldAlert } from "lucide-react";
import { useLanguage } from "@/context/language-context";

const specialties = {
    en: [
        { 
            title: "Cardiology & Cardiothoracic Surgery",
            items: ["Angioplasty (stents)", "Coronary Artery Bypass Grafting (CABG)", "Valve replacements", "Pacemaker implantation", "Congenital Heart Defects (ASD, VSD)"]
        },
        {
            title: "Oncology (Cancer Treatment)",
            items: ["Surgical Oncology (Tumor Removal)", "Chemotherapy", "Radiation Oncology", "Treatment for Leukemia, Lymphoma"]
        },
        {
            title: "Neurology & Neurosurgery",
            items: ["Brain tumor surgery", "Treatment for head injuries", "Spinal surgeries", "Stroke management"]
        },
        {
            title: "Nephrology & Urology",
            items: ["Kidney Transplantation", "Support for Dialysis", "Kidney stone surgery (PCNL, URS)", "Prostate surgery (TURP)"]
        },
        {
            title: "Orthopedics",
            items: ["Total Knee Replacement", "Total Hip Replacement", "Complex fracture surgeries", "Spinal fixation"]
        },
        {
            title: "Gastroenterology",
            items: ["Liver Transplantation", "Surgeries for appendix, gallbladder", "Therapeutic Endoscopy"]
        },
        {
            title: "Pediatrics",
            items: ["Neonatal Intensive Care (NICU)", "Cochlear Implant Surgery", "Surgeries for congenital anomalies"]
        },
        {
            title: "Organ Transplantation",
            items: ["Kidney Transplant", "Liver Transplant", "Heart Transplant", "Lung Transplant", "Corneal Transplant"]
        },
        {
            title: "Other Major Categories",
            items: ["Polytrauma (major accidents)", "Severe Burns management", "Complex Gynaecology surgeries", "Major ENT surgeries"]
        }
    ],
    te: [
        { 
            title: "కార్డియాలజీ & కార్డియోథొరాసిక్ సర్జరీ",
            items: ["యాంజియోప్లాస్టీ (స్టెంట్లు)", "కరోనరీ ఆర్టరీ బైపాస్ గ్రాఫ్టింగ్ (CABG)", "వాల్వ్ పునఃస్థాపనలు", "పేస్‌మేకర్ ఇంప్లాంటేషన్", "పుట్టుకతో వచ్చే గుండె లోపాలు (ASD, VSD)"]
        },
        {
            title: "ఆంకాలజీ (క్యాన్సర్ చికిత్స)",
            items: ["సర్జికల్ ఆంకాలజీ (కణితి తొలగింపు)", "కీమోథెరపీ", "రేడియేషన్ ఆంకాలజీ", "లుకేమియా, లింఫోమా చికిత్స"]
        },
        {
            title: "న్యూరాలజీ & న్యూరోసర్జరీ",
            items: ["బ్రెయిన్ ట్యూమర్ సర్జరీ", "తల గాయాలకు చికిత్స", "వెన్నెముక శస్త్రచికిత్సలు", "స్ట్రోక్ నిర్వహణ"]
        },
        {
            title: "నెఫ్రాలజీ & యూరాలజీ",
            items: ["కిడ్నీ మార్పిడి", "డయాలసిస్ కోసం మద్దతు", "కిడ్నీ స్టోన్ సర్జరీ (PCNL, URS)", "ప్రోస్టేట్ సర్జరీ (TURP)"]
        },
        {
            title: "ఆర్థోపెడిక్స్",
            items: ["మొత్తం మోకాలి మార్పిడి", "మొత్తం తుంటి మార్పిడి", "సంక్లిష్ట ఫ్రాక్చర్ శస్త్రచికిత్సలు", "వెన్నెముక స్థిరీకరణ"]
        },
        {
            title: "గ్యాస్ట్రోఎంటరాలజీ",
            items: ["కాలేయ మార్పిడి", "అపెండిక్స్, పిత్తాశయం కోసం శస్త్రచికిత్సలు", "థెరప్యూటిక్ ఎండోస్కోపీ"]
        },
        {
            title: "పీడియాట్రిక్స్",
            items: ["నియోనాటల్ ఇంటెన్సివ్ కేర్ (NICU)", "కోక్లియర్ ఇంప్లాంట్ సర్జరీ", "పుట్టుకతో వచ్చే క్రమరాహిత్యాలకు శస్త్రచికిత్సలు"]
        },
        {
            title: "అవయవ మార్పిడి",
            items: ["కిడ్నీ మార్పిడి", "కాలేయ మార్పిడి", "గుండె మార్పిడి", "ఊపిరితిత్తుల మార్పిడి", "కార్నియల్ మార్పిడి"]
        },
        {
            title: "ఇతర ప్రధాన వర్గాలు",
            items: ["పాలిట్రామా (ప్రధాన ప్రమాదాలు)", "తీవ్రమైన కాలిన గాయాల నిర్వహణ", "సంక్లిష్ట గైనకాలజీ శస్త్రచికిత్సలు", "ప్రధాన ENT శస్త్రచికిత్సలు"]
        }
    ]
};


export default function NTRVaidyasevaDiseasesPage() {
    const { language } = useLanguage();

    const t = {
        en: {
            pageTitle: "NTR Vaidyaseva Covered Diseases",
            pageDescription: "A general list of diseases and therapies covered under the scheme.",
            disclaimerTitle: "Disclaimer",
            disclaimerText: "This list is for informational purposes only. Coverage is determined by the official guidelines of the Dr. NTR Vaidyaseva Health Care Trust. Always confirm with the trust or hospital.",
            notCoveredTitle: "What is Generally NOT Covered?",
            notCoveredItems: [
                "Primary care services (common cold, fever).",
                "Outpatient treatments not leading to hospitalization.",
                "Cosmetic surgeries.",
                "Minor procedures that do not require hospitalization."
            ]
        },
        te: {
            pageTitle: "ఎన్టీఆర్ వైద్యసేవ పరిధిలోని వ్యాధులు",
            pageDescription: "పథకం కింద కవర్ చేయబడిన వ్యాధులు మరియు చికిత్సల సాధారణ జాబితా.",
            disclaimerTitle: "గమనిక",
            disclaimerText: "ఈ జాబితా సమాచార ప్రయోజనాల కోసం మాత్రమే. డాక్టర్ ఎన్టీఆర్ వైద్యసేవ హెల్త్ కేర్ ట్రస్ట్ యొక్క అధికారిక మార్గదర్శకాల ద్వారా కవరేజ్ నిర్ణయించబడుతుంది. ఎల్లప్పుడూ ట్రస్ట్ లేదా ఆసుపత్రితో నిర్ధారించుకోండి.",
            notCoveredTitle: "సాధారణంగా ఏవి కవర్ చేయబడవు?",
            notCoveredItems: [
                "ప్రాథమిక సంరక్షణ సేవలు (సాధారణ జలుబు, జ్వరం).",
                "ఆసుపత్రిలో చేరాల్సిన అవసరం లేని అవుట్‌పేషెంట్ చికిత్సలు.",
                "కాస్మెటిక్ సర్జరీలు.",
                "ఆసుపత్రిలో చేరాల్సిన అవసరం లేని చిన్న ప్రక్రియలు."
            ]
        }
    }[language];

    const currentSpecialties = specialties[language];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                 <div className="inline-block p-3 bg-primary/10 rounded-full">
                     <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl font-bold">{t.pageTitle}</h1>
                <p className="text-muted-foreground text-lg">{t.pageDescription}</p>
            </div>

            <Card className="border-2 bg-blue-50 border-blue-200 text-blue-800">
                 <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <ShieldAlert className="h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold">{t.disclaimerTitle}</h4>
                            <p className="text-sm">{t.disclaimerText}</p>
                        </div>
                   </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {currentSpecialties.map((specialty, index) => (
                    <Card key={index} className="border-2">
                        <CardHeader>
                            <CardTitle>{specialty.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                {specialty.items.map((item, itemIndex) => (
                                    <li key={itemIndex}>{item}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-2 border-destructive/50 bg-destructive/5">
                <CardHeader>
                    <CardTitle className="text-destructive">{t.notCoveredTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-destructive/80">
                       {t.notCoveredItems.map((item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
