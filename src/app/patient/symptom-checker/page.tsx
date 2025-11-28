
'use client';

import React, { useState, useTransition, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getDiseaseInfo, DiseaseInfoOutput } from '@/ai/flows/ai-disease-info';
import { analyzeReport, ReportAnalysisOutput } from '@/ai/flows/ai-report-analysis';
import { Loader2, Mic, Sparkles, Search, AlertTriangle, CheckCircle2, Utensils, FileText, Stethoscope, User, ArrowLeft, Languages, Upload, Info, TestTube2, PlusCircle, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/context/language-context';
import { ScrollArea } from '@/components/ui/scroll-area';

const allTopics = [
    { english: "Abdominal Pain", telugu: "కడుపు నొప్పి" },
    { english: "Acne", telugu: "మొటిమలు" },
    { english: "ADHD (Attention Deficit Hyperactivity Disorder)", telugu: "ADHD (ఏకాగ్రత లోపం)" },
    { english: "Allergic Rhinitis (Hay Fever)", telugu: "అలెర్జీ రినిటిస్ (గవత జ్వరం)" },
    { english: "Allergies", telugu: "అలెర్జీలు" },
    { english: "Alzheimer's Disease", telugu: "అల్జీమర్స్ వ్యాధి" },
    { english: "Anemia", telugu: "రక్తహీనత" },
    { english: "Ankylosing Spondylitis", telugu: "యాంకైలోజింగ్ స్పాండిలైటిస్" },
    { english: "Anxiety", telugu: "ఆందోళన" },
    { english: "Appendicitis", telugu: "అపెండిసైటిస్" },
    { english: "Arthritis", telugu: "కీళ్లనొప్పులు" },
    { english: "Asthma", telugu: "ఉబ్బసం" },
    { english: "Atherosclerosis", telugu: "అథెరోస్క్లెరోసిస్" },
    { english: "Atrial Fibrillation", telugu: "ఏట్రియల్ ఫిబ్రిలేషన్" },
    { english: "Autism", telugu: "ఆటిజం" },
    { english: "Back Pain", telugu: "వీపు నొప్పి" },
    { english: "Bacterial Vaginosis", telugu: "బాక్టీరియల్ వాగినోసిస్" },
    { english: "Bad Breath (Halitosis)", telugu: "దుర్వాసన (హాలిటోసిస్)" },
    { english: "Bell's Palsy", telugu: "బెల్స్ పాల్సీ" },
    { english: "Benign Prostatic Hyperplasia (BPH)", telugu: "బినైన్ ప్రోస్టాటిక్ హైపర్‌ప్లాసియా" },
    { english: "Bipolar Disorder", telugu: "బైపోలార్ డిజార్డర్" },
    { english: "Bladder Cancer", telugu: "మూత్రాశయ క్యాన్సర్" },
    { english: "Bloating", telugu: "ఉబ్బరం" },
    { english: "Blood Clots", telugu: "రక్తం గడ్డకట్టడం" },
    { english: "Body Ache", telugu: "శరీర నొప్పులు" },
    { english: "Bone Cancer", telugu: "ఎముక క్యాన్సర్" },
    { english: "Brain Tumor", telugu: "మెదడు కణితి" },
    { english: "Breast Cancer", telugu: "రొమ్ము క్యాన్సర్" },
    { english: "Bronchitis", telugu: "బ్రోంకైటిస్" },
    { english: "Bruise", telugu: "గాయం" },
    { english: "Bulimia Nervosa", telugu: "బులిమియా నెర్వోసా" },
    { english: "Burns", telugu: "కాలిన గాయాలు" },
    { english: "Bursitis", telugu: "బుర్సిటిస్" },
    { english: "Cataract", telugu: "శుక్లాలు" },
    { english: "Celiac Disease", telugu: "సెలియాక్ వ్యాధి" },
    { english: "Cervical Cancer", telugu: "గర్భాశయ క్యాన్సర్" },
    { english: "Cervical Spondylosis", telugu: "సెర్వికల్ స్పాండిలోసిస్" },
    { english: "Chest Pain", telugu: "ఛాతీ నొప్పి" },
    { english: "Chikungunya", telugu: "చికున్‌గున్యా" },
    { english: "Chills", telugu: "చలి" },
    { english: "Chlamydia", telugu: "క్లమిడియా" },
    { english: "Cholera", telugu: "కలరా" },
    { english: "Chronic Fatigue Syndrome", telugu: "దీర్ఘకాలిక అలసట సిండ్రోమ్" },
    { english: "Chronic Kidney Disease", telugu: "దీర్ఘకాలిక మూత్రపిండాల వ్యాధి" },
    { english: "Chronic Pain", telugu: "దీర్ఘకాలిక నొప్పి" },
    { english: "Cirrhosis", telugu: "సిర్రోసిస్" },
    { english: "Cluster Headaches", telugu: "క్లస్టర్ తలనొప్పి" },
    { english: "Colitis", telugu: "పెద్దప్రేగు శోథ" },
    { english: "Colon Cancer", telugu: "పెద్దప్రేగు క్యాన్సర్" },
    { english: "Common Cold", telugu: "సాధారణ జలుబు" },
    { english: "Congestive Heart Failure", telugu: "గుండె వైఫల్యం" },
    { english: "Conjunctivitis (Pink Eye)", telugu: "కండ్లకలక" },
    { english: "Constipation", telugu: "మలబద్ధకం" },
    { english: "COPD (Chronic Obstructive Pulmonary Disease)", telugu: "సిఓపిడి" },
    { english: "Coronary Artery Disease", telugu: "కరోనరీ ఆర్టరీ వ్యాధి" },
    { english: "Cough", telugu: "దగ్గు" },
    { english: "COVID-19", telugu: "కోవిడ్-19" },
    { english: "Cramps", telugu: "తిమ్మిరి" },
    { english: "Crohn's Disease", telugu: "క్రోన్స్ వ్యాధి" },
    { english: "Cushing's Syndrome", telugu: "కుషింగ్స్ సిండ్రోమ్" },
    { english: "Cuts and Scrapes", telugu: "కోతలు మరియు గీతలు" },
    { english: "Cystic Fibrosis", telugu: "సిస్టిక్ ఫైброసిస్" },
    { english: "Dandruff", telugu: "చుండ్రు" },
    { english: "Deep Vein Thrombosis (DVT)", telugu: "డీప్ వెయిన్ థ్రాంబోసిస్" },
    { english: "Dehydration", telugu: "డీహైడ్రేషన్" },
    { english: "Dementia", telugu: "చిత్తవైకల్యం" },
    { english: "Dengue Fever", telugu: "డెంగ్యూ జ్వరం" },
    { english: "Depression", telugu: "కుంగుబాటు" },
    { english: "Diabetes (Type 1 & 2)", telugu: "మధుమేహం (రకం 1 & 2)" },
    { english: "Diabetic Ketoacidosis", telugu: "డయాబెటిక్ కీటోయాసిడోసిస్" },
    { english: "Diabetic Neuropathy", telugu: "డయాబెటిక్ న్యూరోపతి" },
    { english: "Diabetic Retinopathy", telugu: "డయాబెటిక్ రెటినోపతి" },
    { english: "Diarrhea", telugu: "విరేచనాలు" },
    { english: "Dizziness", telugu: "తలతిరగడం" },
    { english: "Down Syndrome", telugu: "డౌన్ సిండ్రోమ్" },
    { english: "Dry Eye", telugu: "పొడి కన్ను" },
    { english: "Dysentery", telugu: "విరేచనాలు (రక్తంతో)" },
    { english: "Dyslexia", telugu: "డైస్లెక్సియా" },
    { english: "Ear Infection", telugu: "చెవి ఇన్ఫెక్షన్" },
    { english: "Earache", telugu: "చెవి నొప్పి" },
    { english: "Eating Disorders", telugu: "ఆహార లోపాలు" },
    { english: "Eczema (Atopic Dermatitis)", telugu: "తామర (అటోపిక్ డెర్మటైటిస్)" },
    { english: "Endometriosis", telugu: "ఎండోమెట్రియోసిస్" },
    { english: "Epilepsy", telugu: "మూర్ఛ" },
    { english: "Erectile Dysfunction", telugu: "అంగస్తంభన సమస్య" },
    { english: "Esophageal Cancer", telugu: "అన్నవాహిక క్యాన్సర్" },
    { english: "Fatigue", telugu: "అలసట" },
    { english: "Fatty Liver Disease", telugu: "ఫ్యాటీ లివర్ వ్యాధి" },
    { english: "Fever", telugu: "జ్వరం" },
    { english: "Fibroids", telugu: "ఫైబ్రాయిడ్లు" },
    { english: "Fibromyalgia", telugu: "ఫైబ్రోమైయాల్జియా" },
    { english: "Fistula", telugu: "ఫిస్టులా" },
    { english: "Flu (Influenza)", telugu: "ఫ్లూ (ఇన్ఫ్లుఎంజా)" },
    { english: "Food Poisoning", telugu: "ఫుడ్ పాయిజనింగ్" },
    { english: "Gallstones", telugu: "పిత్తాశయ రాళ్ళు" },
    { english: "Gas and Gas Pains", telugu: "గ్యాస్ మరియు గ్యాస్ నొప్పులు" },
    { english: "Gastroenteritis", telugu: "గ్యాస్ట్రోఎంటరైటిస్" },
    { english: "GERD (Acid Reflux)", telugu: "GERD (యాసిడ్ రిఫ్లక్స్)" },
    { english: "Gestational Diabetes", telugu: "గర్భధారణ మధుమేహం" },
    { english: "Glaucoma", telugu: "గ్లాకోమా" },
    { english: "Goiter", telugu: "గాయిటర్" },
    { english: "Gonorrhea", telugu: "గోనేరియా" },
    { english: "Gout", telugu: "గౌట్" },
    { english: "Graves' Disease", telugu: "గ్రేవ్స్ వ్యాధి" },
    { english: "Guillain-Barré Syndrome", telugu: "గుల్లెన్-బారే సిండ్రోమ్" },
    { english: "Gum Disease", telugu: "చిగుళ్ళ వ్యాధి" },
    { english: "Hair Loss", telugu: "జుట్టు రాలడం" },
    { english: "Hashimoto's Thyroiditis", telugu: "హషిమోటోస్ థైరాయిడైటిస్" },
    { english: "Headache", telugu: "తలనొప్పి" },
    { english: "Heart Attack", telugu: "గుండెపోటు" },
    { english: "Heart Failure", telugu: "గుండె వైఫల్యం" },
    { english: "Heartburn", telugu: "ఛాతీలో మంట" },
    { english: "Hepatitis (A, B, C)", telugu: "హెపటైటిస్ (A, B, C)" },
    { english: "Hernia", telugu: "హెర్నియా" },
    { english: "Herpes", telugu: "హెర్పెస్" },
    { english: "High Cholesterol", telugu: "అధిక కొలెస్ట్రాల్" },
    { english: "Hives", telugu: "దద్దుర్లు" },
    { english: "HIV/AIDS", telugu: "HIV/AIDS" },
    { english: "Hodgkin's Lymphoma", telugu: "హాడ్కిన్స్ లింఫోమా" },
    { english: "Human Papillomavirus (HPV)", telugu: "హ్యూమన్ పాపిల్లోమావైరస్ (HPV)" },
    { english: "Huntington's Disease", telugu: "హంటింగ్టన్ వ్యాధి" },
    { english: "Hypertension (High Blood Pressure)", telugu: "అధిక రక్తపోటు" },
    { english: "Hyperthyroidism", telugu: "హైపర్ థైరాయిడిజం" },
    { english: "Hypoglycemia", telugu: "హైపోగ్లైసీమియా" },
    { english: "Hypothyroidism", telugu: "హైపోథైరాయిడిజం" },
    { english: "Hysterectomy", telugu: "హిస్టెరెక్టమీ" },
    { english: "Impetigo", telugu: "ఇంపెటిగో" },
    { english: "Indigestion", telugu: "అజీర్తి" },
    { english: "Insomnia", telugu: "నిద్రలేమి" },
    { english: "Irritable Bowel Syndrome (IBS)", telugu: "ఇరిటబుల్ బవెల్ సిండ్రోమ్ (IBS)" },
    { english: "Itching", telugu: "దురద" },
    { english: "Jaundice", telugu: "పచ్చ కామెర్లు" },
    { english: "Joint Pain", telugu: "కీళ్ల నొప్పి" },
    { english: "Kidney Cancer", telugu: "మూత్రపిండాల క్యాన్సర్" },
    { english: "Kidney Stones", telugu: "మూత్రపిండాల్లో రాళ్లు" },
    { english: "Knee Pain", telugu: "మోకాలి నొప్పి" },
    { english: "Knee Replacement", telugu: "మోకాలి మార్పిడి" },
    { english: "Klinefelter Syndrome", telugu: "క్లైన్‌ఫెల్టర్ సిండ్రోమ్" },
    { english: "Lactose Intolerance", telugu: "లాక్టోస్ అసహనం" },
    { english: "Laryngitis", telugu: "గొంతు వాపు" },
    { english: "Lasik", telugu: "లేసిక్" },
    { english: "Leukemia", telugu: "లుకేమియా" },
    { english: "Lichen Planus", telugu: "లైకెన్ ప్లానస్" },
    { english: "Liposuction", telugu: "లిపోసక్షన్" },
    { english: "Liver Cancer", telugu: "కాలేయ క్యాన్సర్" },
    { english: "Liver Cirrhosis", telugu: "కాలేయ సిర్రోసిస్" },
    { english: "Loss of Smell or Taste", telugu: "వాసన లేదా రుచి కోల్పోవడం" },
    { english: "Lung Cancer", telugu: "ఊపిరితిత్తుల క్యాన్సర్" },
    { english: "Lupus", telugu: "లూపస్" },
    { english: "Lyme Disease", telugu: "లైమ్ వ్యాధి" },
    { english: "Lymphoma", telugu: "లింఫోమా" },
    { english: "Macular Degeneration", telugu: "మాక్యులార్ డిజెనరేషన్" },
    { english: "Malaria", telugu: "మలేరియా" },
    { english: "Marfan Syndrome", telugu: "మార్ఫాన్ సిండ్రోమ్" },
    { english: "Measles", telugu: "తట్టు" },
    { english: "Melanoma", telugu: "మెలనోమా" },
    { english: "Meningitis", telugu: "మెనింజైటిస్" },
    { english: "Menopause", telugu: "రుతువిరతి" },
    { english: "Migraine", telugu: "మైగ్రేన్" },
    { english: "Miscarriage", telugu: "గర్భస్రావం" },
    { english: "Mononucleosis", telugu: "మోనోన్యూక్లియోసిస్" },
    { english: "Motion Sickness", telugu: "ప్రయాణంలో వాంతులు" },
    { english: "Multiple Myeloma", telugu: "మల్టిపుల్ మైలోమా" },
    { english: "Multiple Sclerosis", telugu: "మల్టిపుల్ స్క్లెరోసిస్" },
    { english: "Mumps", telugu: "గవదబిళ్లలు" },
    { english: "Muscle Spasms", telugu: "కండరాల నొప్పులు" },
    { english: "Muscular Dystrophy", telugu: "కండరాల బలహీనత" },
    { english: "Myasthenia Gravis", telugu: "మస్తీనియా గ్రేవిస్" },
    { english: "Narcolepsy", telugu: "నార్కోలెప్సీ" },
    { english: "Nausea", telugu: "వికారం" },
    { english: "Neck Pain", telugu: "మెడ నొప్పి" },
    { english: "Obesity", telugu: "ఊబకాయం" },
    { english: "Obsessive-Compulsive Disorder (OCD)", telugu: "అబ్సెసివ్-కంపల్సివ్ డిజార్డర్ (OCD)" },
    { english: "Oral Cancer", telugu: "నోటి క్యాన్సర్" },
    { english: "Osteoarthritis", telugu: "ఆస్టియో ఆర్థరైటిస్" },
    { english: "Osteomyelitis", telugu: "ఎముకల ఇన్ఫెక్షన్" },
    { english: "Osteoporosis", telugu: "బోలు ఎముకల వ్యాధి" },
    { english: "Ovarian Cancer", telugu: "అండాశయ క్యాన్సర్" },
    { english: "Ovarian Cysts", telugu: "అండాశయ తిత్తులు" },
    { english: "Paget's Disease of Bone", telugu: "పేజెట్స్ వ్యాధి" },
    { english: "Pancreatic Cancer", telugu: "క్లోమ క్యాన్సర్" },
    { english: "Pancreatitis", telugu: "పాంక్రియాటైటిస్" },
    { english: "Panic Disorder", telugu: "పానిక్ డిజార్డర్" },
    { english: "Parkinson's Disease", telugu: "పార్కిన్సన్స్ వ్యాధి" },
    { english: "Pelvic Inflammatory Disease (PID)", telugu: "పెల్విక్ ఇన్ఫ్లమేటరీ డిసీజ్ (PID)" },
    { english: "Peptic Ulcers", telugu: "పెప్టిక్ అల్సర్లు" },
    { english: "Peripheral Artery Disease (PAD)", telugu: "పెరిఫెరల్ ఆర్టరీ డిసీజ్ (PAD)" },
    { english: "Periodontitis", telugu: "చిగుళ్ళ వ్యాధి" },
    { english: "Pharyngitis", telugu: "గొంతు నొప్పి" },
    { english: "Piles/Hemorrhoids", telugu: "పైల్స్/మొలలు" },
    { english: "Plague", telugu: "ప్లేగు" },
    { english: "Pleurisy", telugu: "ప్లూరిసీ" },
    { english: "Pneumonia", telugu: "న్యుమోనియా" },
    { english: "Polio", telugu: "పోలియో" },
    { english: "Polycystic Ovary Syndrome (PCOS)", telugu: "పాలిసిస్టిక్ ఓవరీ సిండ్రోమ్ (PCOS)" },
    { english: "Post-Traumatic Stress Disorder (PTSD)", telugu: "పోస్ట్-ట్రామాటిక్ స్ట్రెస్ డిజార్డర్ (PTSD)" },
    { english: "Post-viral fatigue", telugu: "పోస్ట్-వైరల్ ఫెటీగ్" },
    { english: "Preeclampsia", telugu: "ప్రీఎక్లాంప్సియా" },
    { english: "Premenstrual Syndrome (PMS)", telugu: "ప్రీమెన్‌స్ట్రువల్ సిండ్రోమ్ (PMS)" },
    { english: "Prostate Cancer", telugu: "ప్రోస్టేట్ క్యాన్సర్" },
    { english: "Psoriasis", telugu: "సోరియాసిస్" },
    { english: "Psoriatic Arthritis", telugu: "సోరియాటిక్ ఆर्थరైటిస్" },
    { english: "Pulmonary Embolism", telugu: "పల్మనరీ ఎంబాలిజం" },
    { english: "Rabies", telugu: "రేబిస్" },
    { english: "Raynaud's Disease", telugu: "రేనాడ్స్ వ్యాధి" },
    { english: "Restless Legs Syndrome", telugu: "రెస్ట్‌లెస్ లెగ్స్ సిండ్రోమ్" },
    { english: "Retinal Detachment", telugu: "రెటీనా డిటాచ్‌మెంట్" },
    { english: "Rheumatic Fever", telugu: "రుమాటిక్ జ్వరం" },
    { english: "Rheumatoid Arthritis", telugu: "రుమటాయిడ్ ఆర్థరైటిస్" },
    { english: "Ringworm", telugu: "తామర" },
    { english: "Rosacea", telugu: "రోసేసియా" },
    { english: "Rubella", telugu: "రుబెల్లా" },
    { english: "Runny or Stuffy Nose", telugu: " соложен нос или заложенный нос" },
    { english: "Sarcoidosis", telugu: "సార్కోయిడోసిస్" },
    { english: "Scabies", telugu: "గజ్జి" },
    { english: "Scarlet Fever", telugu: "స్కార్లెట్ జ్వరం" },
    { english: "Schizophrenia", telugu: "స్కిజోఫ్రెనియా" },
    { english: "Sciatica", telugu: "సయాటికా" },
    { english: "Scoliosis", telugu: "వెన్నెముక వంకర" },
    { english: "Sepsis", telugu: "సెప్సిస్" },
    { english: "Shingles", telugu: "షింగిల్స్" },
    { english: "Shortness of Breath", telugu: "శ్వాస ఆడకపోవడం" },
    { english: "Sickle Cell Anemia", telugu: "సికిల్ సెల్ అనీమియా" },
    { english: "Sinusitis", telugu: "సైనసైటిస్" },
    { english: "Sjogren's Syndrome", telugu: "జోగ్రెన్స్ సిండ్రోమ్" },
    { english: "Skin Cancer", telugu: "చర్మ క్యాన్సర్" },
    { english: "Skin Rash", telugu: "చర్మపు దద్దుర్లు" },
    { english: "Sleep Apnea", telugu: "స్లీప్ అప్నియా" },
    { english: "Smallpox", telugu: "మశూచి" },
    { english: "Sore Throat", telugu: "గొంతు నొప్పి" },
    { english: "Spina Bifida", telugu: "స్పైనా బైఫిడా" },
    { english: "Sprains and Strains", telugu: "బెణుకులు మరియు బెణుకులు" },
    { english: "Stomach ache / Stomach Pain", telugu: "కడుపు నొప్పి" },
    { english: "Stomach Cancer", telugu: "కడుపు క్యాన్సర్" },
    { english: "Stomach Ulcer", telugu: "కడుపు పుండు" },
    { english: "Strep Throat", telugu: "గొంతు నొప్పి" },
    { english: "Stress", telugu: "ఒత్తిడి" },
    { english: "Stroke", telugu: "పక్షవాతం" },
    { english: "Sunburn", telugu: "వడదెబ్బ" },
    { english: "Syphilis", telugu: "సిఫిలిస్" },
    { english: "Tay-Sachs Disease", telugu: "టే-సాక్స్ వ్యాధి" },
    { english: "Tetanus", telugu: "ధనుర్వాతం" },
    { english: "Thalassemia", telugu: "థలసేమియా" },
    { english: "Thyroid Cancer", telugu: "థైరాయిడ్ క్యాన్సర్" },
    { english: "Tinnitus", telugu: "టిన్నిటస్" },
    { english: "Tonsillitis", telugu: "టాన్సిలిటిస్" },
    { english: "Toothache", telugu: "పంటి నొప్పి" },
    { english: "Tourette Syndrome", telugu: "టూరెట్ సిండ్రోమ్" },
    { english: "Toxic Shock Syndrome", telugu: "టాక్సిక్ షాక్ సిండ్రోమ్" },
    { english: "Trichomoniasis", telugu: "ట్రైకోమోనియాసిస్" },
    { english: "Tuberculosis (TB)", telugu: "క్షయవ్యాధి (TB)" },
    { english: "Turner Syndrome", telugu: "టర్నర్ సిండ్రోమ్" },
    { english: "Typhoid / Typhoid Fever", telugu: "టైఫాయిడ్ / టైఫాయిడ్ జ్వరం" },
    { english: "Ulcerative Colitis", telugu: "అల్సరేటివ్ కొలిటిస్" },
    { english: "Urinary Tract Infection (UTI)", telugu: "మూత్ర నాళాల ఇన్ఫెక్షన్ (UTI)" },
    { english: "Uterine Cancer", telugu: "గర్భాశయ క్యాన్సర్" },
    { english: "Varicose Veins", telugu: "వెరికోస్ వెయిన్స్" },
    { english: "Vertigo", telugu: "వెర్టిగో" },
    { english: "Vitamin A Deficiency", telugu: "విటమిన్ ఎ లోపం" },
    { english: "Vitamin B12 Deficiency", telugu: "విటమిన్ బి12 లోపం" },
    { english: "Vitamin C Deficiency (Scurvy)", telugu: "విటమిన్ సి లోపం (స్కర్వీ)" },
    { english: "Vitamin D Deficiency", telugu: "విటమిన్ డి లోపం" },
    { english: "Vitamin E Deficiency", telugu: "విటమిన్ ఇ లోపం" },
    { english: "Vitamin K Deficiency", telugu: "విటమిన్ కె లోపం" },
    { english: "Vitiligo", telugu: "బొల్లి" },
    { english: "Vomiting", telugu: "వాంతులు" },
    { english: "West Nile Virus", telugu: "వెస్ట్ నైల్ వైరస్" },
    { english: "Whooping Cough", telugu: "కోరింత దగ్గు" },
    { english: "Wilson's Disease", telugu: "విల్సన్స్ వ్యాధి" },
    { english: "Yeast Infection", telugu: "ఈస్ట్ ఇన్ఫెక్షన్" },
    { english: "Yellow Fever", telugu: "పసుపు జ్వరం" },
    { english: "Zika Virus", telugu: "జికా వైరస్" },
].sort((a, b) => a.english.localeCompare(b.english));

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function SymptomCheckerPage() {
    const [activeTab, setActiveTab] = useState("symptoms");
    
    const [symptomSearchTerm, setSymptomSearchTerm] = useState('');
    const [originalSearchTerm, setOriginalSearchTerm] = useState('');
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [symptomAnalysisResult, setSymptomAnalysisResult] = useState<DiseaseInfoOutput | null>(null);
    const [isSymptomPending, startSymptomTransition] = useTransition();
    
    const [reportAnalysisResult, setReportAnalysisResult] = useState<ReportAnalysisOutput | null>(null);
    const [isReportPending, startReportTransition] = useTransition();
    const [reportFiles, setReportFiles] = useState<File[]>([]);
    const reportFileRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    const [isListening, setIsListening] = useState(false);
    const { language } = useLanguage();
    const [analysisLanguage, setAnalysisLanguage] = useState<"en" | "te">(language);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    const recognitionRef = useRef<any>(null);

    const translations = {
        en: {
            title: "AI Symptom Checker & Report Analyzer",
            symptomsTab: "Check Symptoms",
            reportTab: "Analyze Report",
            searchPlaceholder: "e.g., 'fever and headache' or 'Diabetes'",
            commonTopics: "Common Symptoms and Diseases",
            getAnalysis: "Get AI Analysis",
            analyzing: "Analyzing...",
            analysisResult: "AI Analysis Result",
            aiAnalysedReport: "AI Analysed Report",
            basicSummary: "Basic Summary",
            nextSteps: "Next Steps",
            specialistRec: "Specialist to consult:",
            disclaimerTitle: "Disclaimer",
            disclaimerText: "This AI tool helps suggest the right specialist. It is not a medical diagnosis. Always consult a human doctor.",
            disclaimerICMR: "ICMR Approved Info",
            symptoms: "Symptoms",
            firstAid: "Suggested First Aid",
            diet: "Recommended Diet",
            tests: "Recommended Tests",
            affectedOrgans: "Affected Organs",
            specialist: "Recommended Specialist",
            language: "Translate to తెలుగు",
            back: "Back",
            uploadReport: "Upload Report",
            uploadHint: "Upload one or more images or PDFs of your medical reports.",
            abnormalFindings: "Abnormal Findings",
            diseaseName: "Identified Condition",
            dietSuggestions: "Diet & Lifestyle Suggestions",
        },
        te: {
            title: "AI లక్షణాల తనిఖీ & నివేదిక విశ్లేషణ",
            symptomsTab: "లక్షణాలను తనిఖీ చేయండి",
            reportTab: "నివేదికను విశ్లేషించండి",
            searchPlaceholder: "ఉదా., 'జ్వరం మరియు తలనొప్పి' లేదా 'డయాబెటిస్'",
            commonTopics: "సాధారణ లక్షణాలు మరియు వ్యాధులు",
            getAnalysis: "AI విశ్లేషణ పొందండి",
            analyzing: "విశ్లేషిస్తోంది...",
            analysisResult: "AI విశ్లేషణ ఫలితం",
            aiAnalysedReport: "AI విశ్లేషించిన నివేదిక",
            basicSummary: "ప్రాథమిక సారాంశం",
            nextSteps: "తదుపరి చర్యలు",
            specialistRec: "సంప్రదించవలసిన నిపుణులు:",
            disclaimerTitle: "గమనిక",
            disclaimerText: "ఈ AI సాధనం సరైన నిపుణుడిని సూచించడంలో సహాయపడుతుంది. ఇది వైద్య నిర్ధారణ కాదు. ఎల్లప్పుడూ మానవ వైద్యుడిని సంప్రదించండి.",
            disclaimerICMR: "ICMR ఆమోదించిన సమాచారం",
            symptoms: "లక్షణాలు",
            firstAid: "సూచించబడిన ప్రథమ చికిత్స",
            diet: "సిఫార్సు చేయబడిన ఆహారం",
            tests: "సిఫార్సు చేయబడిన పరీక్షలు",
            affectedOrgans: "ప్రభావిత అవయవాలు",
            specialist: "సిఫార్సు చేయబడిన నిపుణులు",
            language: "Translate to English",
            back: "వెనుకకు",
            uploadReport: "నివేదికను అప్‌లోడ్ చేయండి",
            uploadHint: "మీ వైద్య నివేదికల యొక్క ఒకటి లేదా అంతకంటే ఎక్కువ చిత్రాలు లేదా PDFలను అప్‌లోడ్ చేయండి.",
            abnormalFindings: "అసాధారణ పరిశీలనలు",
            diseaseName: "గుర్తించబడిన పరిస్థితి",
            dietSuggestions: "ఆహారం & జీవనశైలి సూచనలు",
        }
    };

    const t = translations[language];

    const combinedFilters = useMemo(() => {
        return ['All', ...alphabet];
    }, []);

    const filteredTopics = useMemo(() => {
        if (!activeFilter || activeFilter === 'All') return allTopics;
        return allTopics.filter(topic => topic.english.toUpperCase().startsWith(activeFilter!));
    }, [activeFilter]);
    
    useEffect(() => {
        if (symptomAnalysisResult || reportAnalysisResult) {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [symptomAnalysisResult, reportAnalysisResult]);

    useEffect(() => {
        setSymptomSearchTerm(selectedTopics.join(', '));
    }, [selectedTopics]);

    const handleSymptomSearch = (term: string, lang: "en" | "te" = language) => {
        if (!term) return;
        setOriginalSearchTerm(term);
        setAnalysisLanguage(lang);

        startSymptomTransition(async () => {
            const result = await getDiseaseInfo({ diseaseName: term, language: lang });
            setSymptomAnalysisResult(result);
        });
    };
    
    const handleReportAnalysis = async () => {
        if (reportFiles.length === 0) return;
        
        setReportAnalysisResult(null);

        startReportTransition(async () => {
            const file = reportFiles[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const photoDataUri = reader.result as string;
                const result = await analyzeReport({ photoDataUri, language: analysisLanguage });
                setReportAnalysisResult(result);
            };
        });
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setReportFiles(prev => [...prev, ...Array.from(files)]);
        }
    };
    
    const handleTopicClick = (topic: string) => {
        setSelectedTopics(prev => {
            const topicInCorrectLang = language === 'en' ? topic : allTopics.find(t => t.english === topic)?.telugu || topic;
            if (prev.includes(topicInCorrectLang)) {
                return prev.filter(t => t !== topicInCorrectLang);
            } else {
                return [...prev, topicInCorrectLang];
            }
        });
    };
    
    const handleLanguageToggle = (type: 'symptom' | 'report') => {
        const newLang = analysisLanguage === 'en' ? 'te' : 'en';
        setAnalysisLanguage(newLang);

        if (type === 'symptom' && originalSearchTerm) {
            handleSymptomSearch(originalSearchTerm, newLang);
        } else if (type === 'report' && reportFiles.length > 0) {
             startReportTransition(async () => {
                const file = reportFiles[0];
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = async () => {
                    const photoDataUri = reader.result as string;
                    const result = await analyzeReport({ photoDataUri, language: newLang });
                    setReportAnalysisResult(result);
                };
            });
        }
    };
    
    const handleBack = () => {
        setSymptomAnalysisResult(null);
        setReportAnalysisResult(null);
        setSymptomSearchTerm('');
        setSelectedTopics([]);
        setReportFiles([]);
    };

    const getSectionTitle = (key: string, isDisease?: boolean) => {
        if (key === 'summary') return t.basicSummary;
        if (key === 'abnormalities') return t.abnormalFindings;
        if (key === 'symptoms' && isDisease === false) return t.firstAid;
        if (key === 'symptoms' && isDisease === true) return t.symptoms;
        if (key === 'recommendedDiet') return t.diet;
        if (key === 'recommendedTests') return t.tests;
        if (key === 'affectedOrgans') return t.affectedOrgans;
        if (key === 'recommendedSpecialist') return t.specialist;
        if (key === 'diseaseName') return t.diseaseName;
        if (key === 'dietSuggestions') return t.dietSuggestions;

        return key;
    };
    
    const getSectionIcon = (key: string) => {
        switch(key) {
            case 'summary': return <Info className="h-5 w-5"/>;
            case 'abnormalities': return <AlertTriangle className="h-5 w-5"/>;
            case 'symptoms': return <Stethoscope className="h-5 w-5"/>;
            case 'recommendedDiet': return <Utensils className="h-5 w-5"/>;
            case 'dietSuggestions': return <Utensils className="h-5 w-5"/>;
            case 'recommendedTests': return <TestTube2 className="h-5 w-5"/>;
            case 'affectedOrgans': return <AlertTriangle className="h-5 w-5"/>;
            case 'recommendedSpecialist': return <User className="h-5 w-5"/>;
            case 'diseaseName': return <FileText className="h-5 w-5"/>;
            default: return <Sparkles className="h-5 w-5"/>;
        }
    };
    
    const reportSections = [
        { key: 'summary', title: 'Basic Summary' },
        { key: 'abnormalities', title: 'Abnormal Findings' },
        { key: 'diseaseName', title: 'Identified Condition' },
        { key: 'symptoms', title: 'Symptoms' },
        { key: 'affectedOrgans', title: 'Affected Organs' },
        { key: 'dietSuggestions', title: 'Diet & Lifestyle Suggestions' },
    ];


    const hasResult = symptomAnalysisResult || reportAnalysisResult;

    return (
        <div className="space-y-4">
             <div className="text-center mb-4">
                <h1 className="text-xl md:text-2xl font-bold scroll-m-20 tracking-tight" style={{color: 'hsl(var(--nav-symptoms))'}}>{t.title}</h1>
            </div>
            <div className="sticky top-[64px] z-10 bg-background py-2">
                 <div className={cn("grid grid-cols-2 gap-2 p-1 rounded-lg border-2 border-foreground shadow-md bg-muted", hasResult && 'border-green-500')}>
                    <div 
                        className={cn(
                            "cursor-pointer rounded-md p-2",
                            activeTab === 'symptoms' ? "bg-primary text-primary-foreground shadow-sm" : ""
                        )}
                        style={{backgroundColor: activeTab === 'symptoms' ? 'hsl(var(--nav-symptoms))' : ''}}
                        onClick={() => activeTab !== 'symptoms' && handleBack() || setActiveTab('symptoms')}
                    >
                        <h2 className="font-bold text-base text-center">{t.symptomsTab}</h2>
                    </div>
                     <div 
                        className={cn(
                            "cursor-pointer rounded-md p-2",
                            activeTab === 'report' ? "bg-primary text-primary-foreground shadow-sm" : ""
                        )}
                        style={{backgroundColor: activeTab === 'report' ? 'hsl(var(--nav-symptoms))' : ''}}
                        onClick={() => activeTab !== 'report' && handleBack() || setActiveTab('report')}
                    >
                         <h2 className="font-bold text-base text-center">{t.reportTab}</h2>
                    </div>
                </div>
            </div>
            
            <div className="space-y-4">
                {activeTab === 'symptoms' && (
                    <Card className="shadow-md border-2 border-foreground">
                        <CardContent className="p-4 space-y-4">
                            <div className="relative">
                                <Textarea
                                    placeholder={t.searchPlaceholder}
                                    className="min-h-[80px] pr-24 text-base border"
                                    value={symptomSearchTerm}
                                    onChange={(e) => setSymptomSearchTerm(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSymptomSearch(symptomSearchTerm); }}}
                                />
                                <div className='absolute top-2 right-2 flex flex-col gap-2'>
                                    <Button variant="ghost" size="icon" onClick={() => {}}>
                                        <Mic className={cn("h-5 w-5", isListening ? "text-destructive animation-blink" : "")} style={{color: 'hsl(var(--nav-symptoms))'}}/>
                                    </Button>
                                </div>
                            </div>
                            <Button onClick={() => handleSymptomSearch(symptomSearchTerm)} disabled={isSymptomPending || !symptomSearchTerm.trim()} className="w-full h-11 text-base" style={{backgroundColor: 'hsl(var(--nav-symptoms))'}}>
                                {isSymptomPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Search className="mr-2 h-5 w-5" />}
                                {t.getAnalysis}
                            </Button>
                        </CardContent>
                    </Card>
                )}
                {activeTab === 'report' && (
                    <Card className="shadow-md border-2 border-foreground">
                        <CardContent className="p-4 space-y-4">
                             <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Button asChild variant="outline" className="flex-1 h-20 border-dashed border-2">
                                        <label htmlFor="report-upload" className="cursor-pointer flex flex-col items-center justify-center gap-1">
                                            <Upload className="h-5 w-5" />
                                            <span className="text-sm font-semibold">{t.uploadReport}</span>
                                        </label>
                                    </Button>
                                    <input ref={reportFileRef} id="report-upload" type="file" className="hidden" accept="image/*,.pdf" multiple onChange={handleFileChange}/>
                                    <Button size="icon" variant="outline" className="h-20 w-20 border-dashed border-2" onClick={() => reportFileRef.current?.click()}>
                                        <PlusCircle className="h-6 w-6 text-muted-foreground" />
                                    </Button>
                                </div>
                            </div>

                            {reportFiles.length > 0 && (
                                <div>
                                    <p className="font-semibold text-sm mb-2">Selected Files:</p>
                                    <div className="space-y-2">
                                        {reportFiles.map((file, index) => (
                                            <div key={index} className="flex items-center gap-2 text-sm p-2 bg-muted/50 rounded-md border">
                                                <Paperclip className="h-4 w-4 text-muted-foreground" />
                                                <span className="flex-1 truncate">{file.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <Button onClick={handleReportAnalysis} disabled={isReportPending || reportFiles.length === 0} className="w-full h-11 text-base" style={{backgroundColor: 'hsl(var(--nav-symptoms))'}}>
                                {isReportPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                                {t.getAnalysis}
                            </Button>
                        </CardContent>
                    </Card>
                )}
                
                {!symptomAnalysisResult && !reportAnalysisResult && activeTab === 'symptoms' && (
                    <Card className="shadow-md border-2 border-foreground">
                        <CardHeader>
                            <CardTitle>{t.commonTopics}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-0">
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(32px,1fr))] gap-1 mb-4">
                                {combinedFilters.map(letter => (
                                    <Button
                                        key={letter}
                                        size="sm"
                                        variant={activeFilter === letter || (activeFilter === null && letter === 'All') ? "default" : "outline"}
                                        onClick={() => setActiveFilter(letter === 'All' ? null : letter)}
                                        className="h-8 w-full p-0 border"
                                        style={activeFilter === letter || (activeFilter === null && letter === 'All') ? {backgroundColor: 'hsl(var(--nav-symptoms))'} : {}}
                                    >
                                        {letter}
                                    </Button>
                                ))}
                            </div>
                            <ScrollArea className="h-60">
                                <div className="flex flex-wrap gap-2 pr-4 pb-4">
                                    {filteredTopics.map(topic => {
                                        const currentTopic = language === 'en' ? topic.english : topic.telugu;
                                        const isSelected = selectedTopics.includes(currentTopic);
                                        return (
                                            <Button
                                                key={topic.english}
                                                variant={isSelected ? "default" : "outline"}
                                                size="sm"
                                                className="h-auto border"
                                                onClick={() => handleTopicClick(currentTopic)}
                                                 style={isSelected ? {backgroundColor: 'hsl(var(--nav-symptoms))'} : {}}
                                            >
                                                <div className="text-center p-1">
                                                    <p className="font-semibold text-sm">{currentTopic}</p>
                                                </div>
                                            </Button>
                                        )
                                    })}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                )}
                
                <div ref={resultsRef}>
                    {symptomAnalysisResult && activeTab === 'symptoms' && (
                        <Card className="shadow-md border-2 border-foreground">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="flex items-center gap-2" style={{color: 'hsl(var(--nav-symptoms))'}}>
                                            <Sparkles /> {t.analysisResult}
                                        </CardTitle>
                                        <CardDescription>
                                            Analysis for: <span className="font-bold">{symptomAnalysisResult.diseaseName}</span>
                                        </CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => handleLanguageToggle('symptom')} className="h-9 border">
                                        <Languages className="mr-2 h-4 w-4" />
                                        {analysisLanguage === 'en' ? 'తెలుగులో' : 'English'}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-800/50 dark:text-yellow-300 rounded-lg p-3 text-sm border">
                                   <div className="flex items-start gap-2">
                                        <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0"/>
                                        <div>
                                            <h4 className="font-bold">{t.disclaimerTitle}</h4>
                                            <p>{t.disclaimerText} <span className="font-semibold">({t.disclaimerICMR})</span></p>
                                        </div>
                                   </div>
                                </div>
                                {Object.entries(symptomAnalysisResult).map(([key, value]) => {
                                    if (['isDisease', 'diseaseName', 'recommendedSpecialist'].includes(key) || !value || (Array.isArray(value) && value.length === 0)) return null;
                                    const sectionTitle = getSectionTitle(key, symptomAnalysisResult.isDisease);
                                    const icon = getSectionIcon(key);
                                    return (
                                        <div key={key}>
                                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2" style={{color: 'hsl(var(--nav-symptoms))'}}>
                                                 {icon} {sectionTitle}
                                            </h3>
                                            {Array.isArray(value) ? (
                                                <ul className="space-y-2">
                                                    {(value as string[]).map((point, i) => (
                                                        <li key={i} className="flex items-start gap-3">
                                                            <CheckCircle2 className="h-5 w-5 mt-1 text-green-500 flex-shrink-0" />
                                                            <span className="text-muted-foreground">{point}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-muted-foreground">{value.toString()}</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </CardContent>
                            <CardFooter className="flex-col items-start gap-2 bg-muted/40 p-4 border-t">
                                 <p className="text-sm font-semibold text-muted-foreground">{t.specialistRec}</p>
                                <p className="font-bold text-xl" style={{color: 'hsl(var(--nav-symptoms))'}}>{symptomAnalysisResult.recommendedSpecialist}.</p>
                                <Link href={`/appointments?specialty=${symptomAnalysisResult.recommendedSpecialist?.split(',')[0]}`} className="w-full">
                                    <Button className="w-full mt-2" style={{backgroundColor: 'hsl(var(--nav-symptoms))'}}>
                                       Book Appointment
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    )}
                     {reportAnalysisResult && activeTab === 'report' && (
                        <div className="space-y-2">
                             <Card className="shadow-md border-2 border-foreground">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="flex items-center gap-2" style={{color: 'hsl(var(--nav-symptoms))'}}>
                                                <Sparkles /> {t.aiAnalysedReport}
                                            </CardTitle>
                                        </div>
                                         <Button variant="outline" size="sm" onClick={() => handleLanguageToggle('report')} className="h-9 border">
                                            <Languages className="mr-2 h-4 w-4" />
                                            {analysisLanguage === 'en' ? 'తెలుగులో' : 'English'}
                                        </Button>
                                    </div>
                                </CardHeader>
                                 <CardContent className="space-y-4">
                                     <div className="bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-800/50 dark:text-yellow-300 rounded-lg p-3 text-sm border">
                                        <div className="flex items-start gap-2">
                                            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0"/>
                                            <div>
                                                <h4 className="font-bold">{t.disclaimerTitle}</h4>
                                                <p>{t.disclaimerText} <span className="font-semibold">({t.disclaimerICMR})</span></p>
                                            </div>
                                        </div>
                                    </div>
                                    {reportSections.map(({ key }) => {
                                        const value = (reportAnalysisResult as any)[key];
                                        if (!value || (Array.isArray(value) && value.length === 0)) return null;

                                        const sectionTitle = getSectionTitle(key);
                                        const icon = getSectionIcon(key);
                                        
                                        return (
                                            <div key={key}>
                                                <h3 className="font-bold text-lg mb-2 flex items-center gap-2" style={{color: 'hsl(var(--nav-symptoms))'}}>
                                                    {icon} {sectionTitle}
                                                </h3>
                                                {key === 'abnormalities' ? (
                                                    <div className="space-y-2">
                                                        {(value as any[]).map((item, index) => (
                                                            <div key={index} className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
                                                                <div className="flex justify-between font-bold text-sm"><p>{item.item}</p><p>{item.result}</p></div>
                                                                <p className="text-xs text-muted-foreground">Normal Range: {item.normalRange}</p>
                                                                <p className="text-sm mt-2">{item.explanation}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : Array.isArray(value) ? (
                                                    <ul className="space-y-1">
                                                        {(value as string[]).map((point, i) => (
                                                            <li key={i} className="flex items-start gap-2">
                                                                <CheckCircle2 className="h-4 w-4 mt-1 text-green-500 flex-shrink-0" />
                                                                <span className="text-sm text-muted-foreground">{point}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">{value.toString()}</p>
                                                )}
                                            </div>
                                        )
                                    })}
                                    
                                </CardContent>
                                 <CardFooter className="flex-col items-start gap-2 bg-muted/40 p-4 border-t">
                                     <p className="text-sm font-semibold text-muted-foreground">{t.specialistRec}</p>
                                    <p className="font-bold text-xl" style={{color: 'hsl(var(--nav-symptoms))'}}>Cardiologist, Endocrinologist.</p>
                                    <Link href="/appointments" className="w-full">
                                        <Button className="w-full mt-2" style={{backgroundColor: 'hsl(var(--nav-symptoms))'}}>
                                           Book Appointment
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
