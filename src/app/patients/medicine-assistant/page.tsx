
'use client';

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { aiMedicineAssistant, AiMedicineAssistantOutput } from '@/ai/flows/ai-medicine-assistant';
import { Loader2, Sparkles, Pill, AlertTriangle, FileText } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export default function MedicineAssistantPage() {
    const [medicineName, setMedicineName] = useState('');
    const [result, setResult] = useState<AiMedicineAssistantOutput | null>(null);
    const [isPending, startTransition] = useTransition();
    const { language } = useLanguage();

    const t = {
        en: {
            pageTitle: "AI Medicine Assistant",
            pageDescription: "Get information about medications, dosages, and side effects.",
            cardTitle: "Enter Medicine Name",
            cardDescription: "Our AI will provide detailed information about the drug.",
            inputPlaceholder: "e.g., Paracetamol",
            buttonText: "Get Information",
            fetchingText: "Fetching...",
            resultTitle: "Dosage",
            sideEffectsTitle: "Side Effects",
            disclaimerTitle: "Disclaimer",
            disclaimerText: "This information is AI-generated and for informational purposes only. It is not a substitute for professional medical advice. Always consult with a qualified healthcare provider before making any decisions about your health or treatment.",
            loadingTitle: "Fetching Medicine Data...",
            loadingDescription: "Our AI is preparing the information for you."
        },
        te: {
            pageTitle: "AI మందుల సహాయకుడు",
            pageDescription: "మందులు, మోతాదులు మరియు దుష్ప్రభావాల గురించి సమాచారం పొందండి.",
            cardTitle: "మందు పేరును నమోదు చేయండి",
            cardDescription: "మా AI డ్రగ్ గురించి వివరణాత్మక సమాచారాన్ని అందిస్తుంది.",
            inputPlaceholder: "ఉదా., పారాసెటమాల్",
            buttonText: "సమాచారం పొందండి",
            fetchingText: "తీసుకుంటోంది...",
            resultTitle: "మోతాదు",
            sideEffectsTitle: "దుష్ప్రభావాలు",
            disclaimerTitle: "గమనిక",
            disclaimerText: "ఈ సమాచారం AI ద్వారా రూపొందించబడింది మరియు సమాచార ప్రయోజనాల కోసం మాత్రమే. ఇది వృత్తిపరమైన వైద్య సలహాకు ప్రత్యామ్నాయం కాదు. మీ ఆరోగ్యం లేదా చికిత్స గురించి ఏదైనా నిర్ణయాలు తీసుకునే ముందు ఎల్లప్పుడూ అర్హతగల ఆరోగ్య సంరక్షణ ప్రదాతని సంప్రదించండి.",
            loadingTitle: "మందుల డేటాను పొందుతోంది...",
            loadingDescription: "మా AI మీ కోసం సమాచారాన్ని సిద్ధం చేస్తోంది."
        }
    }[language];


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!medicineName) return;

        startTransition(async () => {
            const res = await aiMedicineAssistant({ medicineName });
            setResult(res);
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
             {isPending && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                    <Loader2 className="h-16 w-16 animate-spin mb-4" style={{color: 'hsl(var(--nav-medicines))'}} />
                    <h2 className="text-2xl font-bold">{t.loadingTitle}</h2>
                    <p className="text-muted-foreground">{t.loadingDescription}</p>
                </div>
            )}
            <div className="text-center">
                <h1 className="text-3xl font-bold" style={{color: 'hsl(var(--nav-medicines))'}}>{t.pageTitle}</h1>
                <p className="text-muted-foreground">{t.pageDescription}</p>
            </div>

            <Card className="overflow-hidden border">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>{t.cardTitle}</CardTitle>
                        <CardDescription>{t.cardDescription}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input
                            placeholder={t.inputPlaceholder}
                            value={medicineName}
                            onChange={(e) => setMedicineName(e.target.value)}
                            disabled={isPending}
                            className="border"
                        />
                    </CardContent>
                    <CardFooter className="bg-muted/30 px-6 py-4">
                        <Button type="submit" disabled={isPending || !medicineName} style={{backgroundColor: 'hsl(var(--nav-medicines))'}}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t.fetchingText}
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    {t.buttonText}
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            {result && !isPending && (
                <Card className="border">
                    <CardHeader>
                        <CardTitle className="text-2xl" style={{color: 'hsl(var(--nav-medicines))'}}>{result.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><Pill /> {t.resultTitle}</h3>
                            <p className="text-muted-foreground">{result.dosage}</p>
                        </div>
                         <hr/>
                        <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><AlertTriangle /> {t.sideEffectsTitle}</h3>
                            <p className="text-muted-foreground">{result.sideEffects}</p>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                           <div className="flex items-start gap-3">
                                <FileText className="h-5 w-5 text-yellow-700 mt-1"/>
                                <div>
                                    <h4 className="font-semibold text-yellow-800">{t.disclaimerTitle}</h4>
                                    <p className="text-sm text-yellow-700">
                                        {t.disclaimerText}
                                    </p>
                                </div>
                           </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
