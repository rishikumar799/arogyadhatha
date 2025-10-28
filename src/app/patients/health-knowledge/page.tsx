
'use client';

import React, { useState, useTransition, useMemo, useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, BookOpenCheck, Heart, FileText, Utensils, AlertTriangle, Search, ShieldAlert, TestTube2, Microscope, Brain, Globe, Dumbbell, Zap, Wind, Waves } from 'lucide-react';
import { getDiseaseInfo, DiseaseInfoOutput } from '@/ai/flows/ai-disease-info';
import { getDeepDive, DeepDiveOutput } from '@/ai/flows/ai-deep-dive';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';


const diseaseCategories = [
    "Acne", "ADHD", "Allergic Rhinitis (Hay Fever)", "Allergies", "Alzheimer's Disease", "Anemia", "Ankylosing Spondylitis", 
    "Anxiety", "Appendicitis", "Arthritis", "Asthma", "Atherosclerosis", "Atrial Fibrillation", "Autism", "Back Pain", 
    "Bacterial Vaginosis", "Bell's Palsy", "Benign Prostatic Hyperplasia (BPH)", "Bipolar Disorder", "Bladder Cancer", 
    "Blood Clots", "Bone Cancer", "Brain Tumor", "Breast Cancer", "Bronchitis", "Bulimia Nervosa", "Bursitis", "Celiac Disease", 
    "Cervical Cancer", "Cervical Spondylosis", "Chikungunya", "Chlamydia", "Cholera", "Chronic Fatigue Syndrome", 
    "Chronic Kidney Disease", "Chronic Pain", "Cirrhosis", "Cluster Headaches", "Colitis", "Colon Cancer", "Common Cold", 
    "Congestive Heart Failure", "Conjunctivitis (Pink Eye)", "COPD", "Coronary Artery Disease", "COVID-19", "Crohn's Disease", 
    "Cushing's Syndrome", "Cystic Fibrosis", "Dandruff", "Deep Vein Thrombosis (DVT)", "Dehydration", "Dementia", "Dengue Fever", "Depression", "Diabetes (Type 1 & 2)", "Diabetic Ketoacidosis", "Diabetic Neuropathy", "Diabetic Retinopathy", "Diarrhea", 
    "Down Syndrome", "Dry Eye", "Dysentery", "Dyslexia", "Ear Infection", "Eating Disorders", "Eczema (Atopic Dermatitis)", 
    "Endometriosis", "Epilepsy", "Erectile Dysfunction", "Esophageal Cancer", "Fatty Liver Disease", "Fibroids", "Fibromyalgia", 
    "Fistula", "Flu (Influenza)", "Food Poisoning", "Gallstones", "Gastroenteritis", "GERD (Acid Reflux)", "Gestational Diabetes", 
    "Glaucoma", "Goiter", "Gonorrhea", "Gout", "Graves' Disease", "Guillain-Barré Syndrome", "Gum Disease", "HIV/AIDS", 
    "Hair Loss", "Hashimoto's Thyroiditis", "Heart Attack", "Heart Failure", "Hepatitis (A, B, C)", "Hernia", "Herpes", 
    "High Cholesterol", "Hives", "Hodgkin's Lymphoma", "Human Papillomavirus (HPV)", "Huntington's Disease", 
    "Hypertension (High Blood Pressure)", "Hyperthyroidism", "Hypoglycemia", "Hypothyroidism", "Impetigo", "Insomnia", 
    "Irritable Bowel Syndrome (IBS)", "Jaundice", "Kidney Cancer", "Kidney Stones", "Klinefelter Syndrome", "Lactose Intolerance", 
    "Laryngitis", "Leukemia", "Lichen Planus", "Liver Cancer", "Lung Cancer", "Lupus", "Lyme Disease", "Lymphoma", "Macular Degeneration", 
    "Malaria", "Marfan Syndrome", "Measles", "Melanoma", "Meningitis", "Menopause", "Migraine", "Miscarriage", "Mononucleosis", 
    "Multiple Myeloma", "Multiple Sclerosis", "Mumps", "Muscle Spasms", "Muscular Dystrophy", "Myasthenia Gravis", "Narcolepsy", 
    "Obsessive-Compulsive Disorder (OCD)", "Obesity", "Oral Cancer", "Osteoarthritis", "Osteomyelitis", "Osteoporosis", "Ovarian Cancer", 
    "Ovarian Cysts", "Paget's Disease of Bone", "Pancreatic Cancer", "Pancreatitis", "Panic Disorder", "Parkinson's Disease", 
    "Pelvic Inflammatory Disease (PID)", "Peptic Ulcers", "Peripheral Artery Disease (PAD)", "Periodontitis", "Pharyngitis", 
    "Piles/Hemorrhoids", "Plague", "Pleurisy", "Pneumonia", "Polio", "Polycystic Ovary Syndrome (PCOS)", "Post-Traumatic Stress Disorder (PTSD)", 
    "Preeclampsia", "Premenstrual Syndrome (PMS)", "Prostate Cancer", "Psoriasis", "Psoriatic Arthritis", "Pulmonary Embolism", 
    "Rabies", "Raynaud's Disease", "Restless Legs Syndrome", "Retinal Detachment", "Rheumatic Fever", "Rheumatoid Arthritis", 
    "Ringworm", "Rosacea", "Rubella", "Sarcoidosis", "Scabies", "Scarlet Fever", "Schizophrenia", "Sciatica", "Scoliosis", "Sepsis", 
    "Shingles", "Sickle Cell Anemia", "Sinusitis", "Sjogren's Syndrome", "Skin Cancer", "Sleep Apnea", "Smallpox", "Spina Bifida", 
    "Sprains and Strains", "Stomach Cancer", "Stomach Ulcer", "Strep Throat", "Stroke", "Syphilis", "Tay-Sachs Disease", "Tetanus", 
    "Thalassemia", "Thyroid Cancer", "Tinnitus", "Tonsillitis", "Tourette Syndrome", "Toxic Shock Syndrome", "Trichomoniasis", 
    "Tuberculosis (TB)", "Turner Syndrome", "Typhoid Fever", "Ulcerative Colitis", "Urinary Tract Infection (UTI)", "Uterine Cancer", 
    "Varicose Veins", "Vertigo", "Vitiligo", "Vitamin B12 Deficiency", "Vitamin D Deficiency", "West Nile Virus", "Whooping Cough", 
    "Wilson's Disease", "Yeast Infection", "Yellow Fever", "Zika Virus"
].sort();

const HealthKnowledgeCategory = ({ icon: Icon, title, description, children, color }: { icon: React.ElementType, title: string, description: string, children: React.ReactNode, color: string }) => (
    <Card className="border">
        <Collapsible>
            <CollapsibleTrigger className="w-full">
                <CardHeader className="flex flex-row items-center gap-4 text-left">
                    <div className="p-3 rounded-full bg-primary/10">
                        <Icon className="h-8 w-8" style={{ color }} />
                    </div>
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <CardContent>
                    {children}
                </CardContent>
            </CollapsibleContent>
        </Collapsible>
    </Card>
);

const PlaceholderContent = ({ featureName }: { featureName: string }) => (
    <div className="text-center p-8 bg-muted/40 rounded-lg">
        <p className="font-semibold">Content for {featureName} is coming soon!</p>
        <p className="text-sm text-muted-foreground">This section is under development.</p>
    </div>
);

const FirstAidItem = ({ title, imageUrl, imageAlt, children }: { title: string, imageUrl?: string, imageAlt?: string, children: React.ReactNode }) => (
    <Card className="border">
        <CardHeader>
            <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
             {imageUrl && imageAlt && (
                <div className="my-4">
                    <Image
                        src={imageUrl}
                        alt={imageAlt}
                        width={600}
                        height={400}
                        data-ai-hint={imageAlt}
                        className="rounded-lg w-full object-cover"
                    />
                </div>
            )}
            {children}
        </CardContent>
    </Card>
);

export default function HealthKnowledgePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const resultsRef = useRef<HTMLDivElement>(null);
    
    const filteredDiseases = useMemo(() => {
        if (!searchTerm) {
            return diseaseCategories;
        }
        return diseaseCategories.filter(disease =>
            disease.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold" style={{color: 'hsl(var(--nav-profile))'}}>Health Knowledge</h1>
                <p className="text-muted-foreground mt-2">Explore various health topics to stay informed.</p>
            </div>

            <div className="space-y-4">
                <HealthKnowledgeCategory 
                    icon={ShieldAlert} 
                    title="First Aid" 
                    description="Learn what to do in critical situations like CPR, snake bites, and heart attacks."
                    color="hsl(var(--nav-emergency))"
                >
                    <div className="space-y-4">
                        <FirstAidItem 
                            title="How to Perform CPR (Cardiopulmonary Resuscitation)"
                            imageUrl="https://picsum.photos/seed/cpr-steps/600/400"
                            imageAlt="cpr steps diagram"
                        >
                            <p className="font-bold text-destructive">Disclaimer: This is a guide for untrained bystanders. Formal training is highly recommended.</p>
                            <h4 className="font-semibold text-foreground">1. Check for Safety & Response</h4>
                            <p>Ensure the scene is safe. Tap the person’s shoulder and shout, "Are you okay?" to check for a response.</p>
                            <h4 className="font-semibold text-foreground">2. Call for Help</h4>
                            <p>If there's no response, immediately call your local emergency number (e.g., 108 in India) or ask someone else to call.</p>
                            <h4 className="font-semibold text-foreground">3. Chest Compressions (C in C-A-B)</h4>
                            <p>Place the heel of one hand on the center of the person's chest. Place your other hand on top and interlock your fingers. Keep your arms straight and position your shoulders directly above your hands. Push hard and fast at a rate of 100-120 compressions per minute. Let the chest rise completely between compressions.</p>
                            <h4 className="font-semibold text-foreground">4. Airway & Breathing (A and B - for trained individuals)</h4>
                            <p>If you are trained in CPR, after 30 compressions, open the airway by tilting the head back and lifting the chin. Give 2 rescue breaths. Continue with cycles of 30 compressions and 2 breaths.</p>
                             <h4 className="font-semibold text-foreground">5. Continue Until Help Arrives</h4>
                            <p>Continue CPR until you see obvious signs of life, an AED is ready to use, or medical personnel take over.</p>
                        </FirstAidItem>

                        <FirstAidItem 
                            title="First Aid for Snake Bites"
                            imageUrl="https://picsum.photos/seed/snake-bite/600/400"
                            imageAlt="snake bite do's and dont's"
                        >
                            <p className="font-bold text-destructive">This is a medical emergency. Get to a hospital immediately.</p>
                            <h4 className="font-semibold text-foreground">What to DO:</h4>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Remain calm and move away from the snake.</li>
                                <li>Remove any tight clothing or jewelry near the bite area.</li>
                                <li>Keep the bitten limb still and, if possible, position it below the level of the heart.</li>
                                <li>Note the time of the bite and try to remember the snake's appearance (color, shape). Do not try to catch it.</li>
                                <li>Call for emergency help and transport to a hospital as quickly as possible.</li>
                            </ul>
                             <Separator className="my-4" />
                            <h4 className="font-semibold text-destructive">What NOT to do:</h4>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Do NOT cut the wound or try to suck out the venom.</li>
                                <li>Do NOT apply a tourniquet or tie a tight band.</li>
                                <li>Do NOT apply ice or wash the bite with water.</li>
                                <li>Do NOT drink alcohol or caffeine.</li>
                            </ul>
                        </FirstAidItem>

                        <FirstAidItem 
                            title="Responding to a Heart Attack"
                            imageUrl="https://picsum.photos/seed/heart-attack-symptoms/600/400"
                            imageAlt="heart attack symptoms"
                        >
                             <p className="font-bold text-destructive">A heart attack is a life-threatening emergency. Call for help immediately.</p>
                             <h4 className="font-semibold text-foreground">Recognize the Symptoms:</h4>
                             <p>Common symptoms include chest pain (pressure, squeezing, or aching), pain spreading to the arm, neck, or jaw, shortness of breath, cold sweat, nausea, and lightheadedness.</p>
                             <h4 className="font-semibold text-foreground">Immediate Steps:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li><strong>Call Emergency Services:</strong> Immediately call your local emergency number (e.g., 108). Do not wait.</li>
                                <li><strong>Chew Aspirin:</strong> If the person is not allergic, have them slowly chew one adult-strength (325 mg) aspirin.</li>
                                <li><strong>Loosen Clothing:</strong> Loosen any tight clothing around the neck and waist.</li>
                                <li><strong>Rest Comfortably:</strong> Have the person sit or lie down in a comfortable position.</li>
                                <li><strong>Be Ready for CPR:</strong> If the person becomes unconscious and stops breathing, be prepared to start CPR if you are trained.</li>
                            </ul>
                        </FirstAidItem>
                    </div>
                </HealthKnowledgeCategory>

                <HealthKnowledgeCategory 
                    icon={BookOpenCheck} 
                    title="Health Library" 
                    description="Look up information on various diseases and conditions."
                    color="hsl(var(--nav-profile))"
                >
                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search diseases..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <ScrollArea className="h-[40vh]">
                            <div className="flex flex-row flex-wrap gap-2 pr-4">
                                {filteredDiseases.map((disease) => (
                                    <Button
                                        key={disease}
                                        variant="ghost"
                                        size="sm"
                                        className="text-sm h-auto py-1.5 px-2 justify-start bg-muted/50"
                                    >
                                        {disease}
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </HealthKnowledgeCategory>

                 <HealthKnowledgeCategory 
                    icon={Zap} 
                    title="Wellness & Lifestyle" 
                    description="Tips for stress management, sleep, and overall well-being."
                    color="hsl(var(--nav-symptoms))"
                >
                    <PlaceholderContent featureName="Wellness & Lifestyle" />
                </HealthKnowledgeCategory>
                
                 <HealthKnowledgeCategory 
                    icon={Dumbbell} 
                    title="Fitness & Workouts" 
                    description="Guides for gym, yoga, and home workout routines."
                    color="hsl(var(--nav-medicines))"
                >
                    <PlaceholderContent featureName="Fitness & Workouts" />
                </HealthKnowledgeCategory>

                <HealthKnowledgeCategory 
                    icon={Heart} 
                    title="Sexual Health" 
                    description="Information on reproductive health and wellness."
                    color="hsl(var(--nav-blood-bank))"
                >
                    <PlaceholderContent featureName="Sexual Health" />
                </HealthKnowledgeCategory>
                
                <HealthKnowledgeCategory 
                    icon={Brain} 
                    title="Organs Health" 
                    description="Learn about keeping your vital organs healthy."
                    color="hsl(var(--nav-junior-doctors))"
                >
                     <PlaceholderContent featureName="Organs Health" />
                </HealthKnowledgeCategory>
            </div>

            <div ref={resultsRef} className="lg:col-span-2 space-y-6">
                {/* Analysis results will be handled in a future step */}
            </div>
        </div>
    );
}

    