
export const dummyReportData: Record<string, { content: string, image?: string, dataAiHint?: string }> = {
    "Complete Blood Count-2024-07-15": {
        content: `
Patient Name: Chinta Lokesh Babu
Date: 2024-07-15
Test: Complete Blood Count (CBC)
Doctor: Dr. Rajesh Kumar

Hemoglobin: 13.5 g/dL (Normal: 13.0-17.0)
WBC Count: 11,500 /mcL (Normal: 4,000-11,000) - Slightly High
Platelet Count: 250,000 /mcL (Normal: 150,000-450,000)
RBC Count: 4.8 million/mcL (Normal: 4.5-5.5)
`,
        image: "https://picsum.photos/seed/cbc_report/800/1100",
        dataAiHint: "lab report"
    },
    "Chest X-Ray-2024-07-10": {
        image: "https://picsum.photos/seed/xray/800/1100",
        dataAiHint: "chest xray",
        content: `
Patient Name: Chinta Lokesh Babu
Date: 2024-07-10
Test: Chest X-Ray (PA view)
Doctor: Dr. Rajesh Kumar

TECHNIQUE:
Single postero-anterior view of the chest was obtained.

FINDINGS:
Lungs: The lungs are well-aerated. No focal consolidation, mass, or pneumothorax is seen.
Heart: The cardiomediastinal silhouette is within normal limits.
Pleura: No pleural effusion or thickening.
Bones: The visualized bony structures appear unremarkable.

IMPRESSION:
Normal chest X-ray.
`
    },
    "MRI Brain Scan-2024-05-12": {
        content: `
Patient Name: Chinta Lokesh Babu
Date: 2024-05-12
Test: MRI Brain Scan
Doctor: Dr. Arjun Kumar

TECHNIQUE:
Multi-planar, multi-sequential MRI of the brain was performed without intravenous contrast.

FINDINGS:
Brain Parenchyma: No evidence of acute infarction, hemorrhage, or mass lesion. The gray-white matter differentiation is preserved.
Ventricles: The ventricular system is normal in size and configuration.
Cerebellum and Brainstem: Unremarkable.
Major Vascular Structures: Normal flow voids are seen.

IMPRESSION:
Unremarkable MRI of the brain.
`,
        image: "https://picsum.photos/seed/mri_brain_report/800/1100",
        dataAiHint: "mri scan"
    },
    "CT Scan Abdomen-2024-02-25": {
        content: `
Patient Name: Chinta Lokesh Babu
Date: 2024-02-25
Test: CT Scan Abdomen (with contrast)
Doctor: Dr. Arjun Kumar

TECHNIQUE:
Axial CT images of the abdomen were obtained following the administration of oral and intravenous contrast.

FINDINGS:
Liver: Normal in size and attenuation. No focal lesions.
Gallbladder: Unremarkable. No stones or wall thickening.
Spleen, Pancreas, Kidneys, Adrenal Glands: All appear normal.
Bowel: No evidence of obstruction or inflammatory changes.
Aorta and IVC: Normal caliber.

IMPRESSION:
Normal CT scan of the abdomen.
`,
        image: "https://picsum.photos/seed/ct_abdomen_report/800/1100",
        dataAiHint: "ct scan"
    },
     "Fever & Cold Consultation-2024-07-22": {
        content: `
Patient Name: Chinta Lokesh Babu
Date: 2024-07-22
Doctor: Dr. Shashank
Chief Complaint: Fever, cough, and running nose for 3 days.

DIAGNOSIS:
Viral Upper Respiratory Tract Infection

PRESCRIPTION:
1. Paracetamol 500mg - one tablet SOS for fever
2. Cetirizine 10mg - one tablet at night
3. Steam inhalation twice a day

ADVICE:
- Take adequate rest
- Stay hydrated
- Follow-up if symptoms persist after 3 days
`,
        image: "https://picsum.photos/seed/fever_cold_report/800/1100",
        dataAiHint: "prescription document"
    },
    "Widal Test for Typhoid-2024-08-02": {
        content: `
Patient Name: Chinta Lokesh Babu
Date: 2024-08-02
Test: Widal Test for Typhoid
Doctor: Dr. Anjali

RESULTS:
Salmonella typhi O: 1:160 (Positive)
Salmonella typhi H: 1:320 (Positive)

IMPRESSION:
The serological results are suggestive of Typhoid fever (Enteric fever). Clinical correlation is advised.
`,
        image: "https://picsum.photos/seed/widal_report/800/1100",
        dataAiHint: "lab report"
    },
    "Echocardiogram-2024-08-10": {
        content: `
Patient Name: Chinta Lokesh Babu
Date: 2024-08-10
Test: 2D Echocardiogram
Doctor: Ashok kumar chintha

FINDINGS:
Left Ventricle: Mildly dilated, normal wall thickness.
Ejection Fraction (EF): 50% (Mildly reduced, Normal > 55%).
Valves: Mitral valve shows mild regurgitation.
Pericardium: No pericardial effusion.

IMPRESSION:
Mild left ventricular systolic dysfunction with mild mitral regurgitation. Findings may be related to recent viral illness. Follow-up is recommended.
`,
        image: "https://picsum.photos/seed/echo_report/800/1100",
        dataAiHint: "medical chart"
    },
    "Troponin-I-2024-08-10": {
        content: `
Patient Name: Chinta Lokesh Babu
Date: 2024-08-10
Test: Troponin-I Level
Doctor: Ashok kumar chintha

RESULT:
Troponin-I: 0.8 ng/mL (Normal < 0.04 ng/mL) - High

IMPRESSION:
Elevated Troponin-I level indicates some degree of cardiac muscle injury, likely due to post-viral myocarditis. Requires monitoring.
`,
        image: "https://picsum.photos/seed/troponin_report/800/1100",
        dataAiHint: "lab report"
    },
    // New data from here
    "Liver Function Test-2024-07-16": {
        content: `
Patient Name: Chinta Lokesh Babu
Date: 2024-07-16
Test: Liver Function Test (LFT)
Doctor: Dr. Priya Sharma

Bilirubin (Total): 1.5 mg/dL (Normal: 0.2-1.2) - High
ALT (SGPT): 55 U/L (Normal: 7-56)
AST (SGOT): 48 U/L (Normal: 10-40) - High

IMPRESSION:
Slight elevation in bilirubin and AST. Clinical correlation recommended.
`,
        image: "https://picsum.photos/seed/lft_report_jul16/800/1100",
        dataAiHint: "lab report"
    },
    "Thyroid Function Test-2024-07-16": {
        content: `
Patient Name: Chinta Lokesh Babu
Date: 2024-07-16
Test: Thyroid Function Test
Doctor: Dr. Priya Sharma

TSH: 4.5 µIU/mL (Normal: 0.4-4.2) - Slightly High
T3, Total: 120 ng/dL (Normal: 80-220)
T4, Total: 8.0 µg/dL (Normal: 5.0-12.0)

IMPRESSION:
Subclinical hypothyroidism. Monitoring advised.
`,
        image: "https://picsum.photos/seed/thyroid_report_jul16/800/1100",
        dataAiHint: "lab report"
    },
    "Urinalysis-2024-07-17": {
        content: `
Patient Name: Chinta Lokesh Babu
Date: 2024-07-17
Test: Urinalysis
Doctor: Dr. Rajesh Kumar

Color: Yellow
Appearance: Clear
pH: 6.0
Protein: Negative
Glucose: Negative
Ketones: Negative

IMPRESSION:
Normal study.
`,
        image: "https://picsum.photos/seed/urinalysis_report_jul17/800/1100",
        dataAiHint: "lab report"
    },
    "Lipid Profile-2024-06-20": {
        content: `
Patient Name: Chinta Lokesh Babu
Date: 2024-06-20
Test: Lipid Profile
Doctor: Dr. Rajesh Kumar

Total Cholesterol: 180 mg/dL (Desirable: <200)
Triglycerides: 150 mg/dL (Desirable: <150) - Borderline
HDL Cholesterol: 45 mg/dL (Desirable: >40)
LDL Cholesterol: 105 mg/dL (Desirable: <100) - Near Optimal

IMPRESSION:
Borderline triglycerides. LDL near optimal. Diet and exercise advised.
`,
        image: "https://picsum.photos/seed/lipid_report_jun20/800/1100",
        dataAiHint: "lab report"
    },
    "HbA1c-2024-06-20": {
        content: `
Patient Name: Chinta Lokesh Babu
Date: 2024-06-20
Test: HbA1c (Glycated Hemoglobin)
Doctor: Dr. Rajesh Kumar

Result: 5.5% (Normal: <5.7%)

IMPRESSION:
Value is within the normal range. Good glycemic control.
`,
        image: "https://picsum.photos/seed/hba1c_report_jun20/800/1100",
        dataAiHint: "lab report"
    },
     "Vitamin D Level-2024-06-20": {
        content: `
Patient Name: Chinta Lokesh Babu
Date: 2024-06-20
Test: Vitamin D (25-Hydroxy)
Doctor: Dr. Rajesh Kumar

Result: 18 ng/mL (Deficiency: <20 ng/mL)

IMPRESSION:
Vitamin D deficiency noted. Supplementation recommended.
`,
        image: "https://picsum.photos/seed/vitd_report_jun20/800/1100",
        dataAiHint: "lab report"
    },
    "Complete Blood Count-2024-04-10": {
        content: `
Patient Name: Chinta Lokesh Babu
Date: 2024-04-10
Test: Complete Blood Count (CBC)
Doctor: Dr. Rajesh Kumar

Hemoglobin: 14.0 g/dL (Normal: 13.0-17.0)
WBC Count: 7,200 /mcL (Normal: 4,000-11,000)
Platelet Count: 310,000 /mcL (Normal: 150,000-450,000)

IMPRESSION:
Normal study.
`,
        image: "https://picsum.photos/seed/cbc_report_apr10/800/1100",
        dataAiHint: "lab report"
    },
    "Liver Function Test-2024-01-05": {
        content: `
Patient Name: Chinta Lokesh Babu
Date: 2024-01-05
Test: Liver Function Test
Doctor: Dr. Priya Sharma

Bilirubin (Total): 0.8 mg/dL (Normal: 0.2-1.2)
ALT (SGPT): 25 U/L (Normal: 7-56)
AST (SGOT): 22 U/L (Normal: 10-40)

IMPRESSION:
All values are within the normal range.
`,
        image: "https://picsum.photos/seed/lft_report_jan05/800/1100",
        dataAiHint: "lab report"
    },
    "Abdominal Ultrasound-2024-07-18": {
        content: `
Patient Name: Chinta Lokesh Babu
Date: 2024-07-18
Test: Abdominal Ultrasound
Doctor: Dr. Priya Sharma

IMPRESSION:
Liver, gallbladder, pancreas, spleen, and both kidneys are normal in size, shape, and echotexture. No evidence of free fluid. Normal study.
`,
        image: "https://picsum.photos/seed/ultrasound_jul18/800/1100",
        dataAiHint: "ultrasound image"
    },
    "Serum Creatinine-2024-07-18": {
        content: `
Patient Name: Chinta Lokesh Babu
Date: 2024-07-18
Test: Serum Creatinine
Doctor: Dr. Priya Sharma

Result: 0.9 mg/dL (Normal: 0.7-1.3 mg/dL)

IMPRESSION:
Normal kidney function.
`,
        image: "https://picsum.photos/seed/creatinine_jul18/800/1100",
        dataAiHint: "lab report"
    },
    "Urine Culture-2024-07-18": {
        content: `
Patient Name: Chinta Lokesh Babu
Date: 2024-07-18
Test: Urine Culture
Doctor: Dr. Priya Sharma

Result: No significant growth of bacteria after 48 hours of incubation.

IMPRESSION:
Negative for urinary tract infection.
`,
        image: "https://picsum.photos/seed/urine_culture_jul18/800/1100",
        dataAiHint: "lab report document"
    },
    "Vitamin B12 Level-2024-06-20": {
        content: `
Patient Name: Chinta Lokesh Babu
Date: 2024-06-20
Test: Vitamin B12 Level
Doctor: Dr. Rajesh Kumar

Result: 250 pg/mL (Normal: 200-900 pg/mL)

IMPRESSION:
Vitamin B12 levels are in the lower end of the normal range. Monitoring is suggested.
`,
        image: "https://picsum.photos/seed/b12_jun20/800/1100",
        dataAiHint: "lab report"
    },
    "ESR (Erythrocyte Sedimentation Rate)-2024-07-15": {
        content: `
Patient Name: Chinta Lokesh Babu
Date: 2024-07-15
Test: ESR
Doctor: Dr. Rajesh Kumar

Result: 22 mm/hr (Normal: 0-15 mm/hr) - Elevated

IMPRESSION:
Elevated ESR may indicate inflammation. Correlate clinically.
`,
        image: "https://picsum.photos/seed/esr_jul15/800/1100",
        dataAiHint: "medical chart"
    },
    "ECG-2024-07-10": {
        content: `
Patient Name: Chinta Lokesh Babu
Date: 2024-07-10
Test: Electrocardiogram (ECG)
Doctor: Dr. Rajesh Kumar

Rhythm: Normal Sinus Rhythm
Heart Rate: 78 bpm
Axis: Normal
Intervals: PR, QRS, QT intervals are within normal limits.
ST-T waves: No significant ST-T changes.

IMPRESSION:
Normal ECG.
`,
        image: "https://picsum.photos/seed/ecg_jul10/800/1100",
        dataAiHint: "ecg graph"
    }
};
