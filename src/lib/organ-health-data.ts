
import React from "react";

export const organHealthData = [
    {
      name: "Heart",
      condition: "Mildly reduced Ejection Fraction",
      healthScore: 85,
      status: "Needs Monitoring",
      sourceOfAnalysis: "Based on: Echocardiogram from Aug 2024 showing mildly reduced Ejection Fraction (50%) and elevated Troponin-I.",
      recommendations: ["Follow up with your cardiologist as scheduled.", "Continue taking prescribed medications (Metoprolol, Aspirin).", "Maintain a low-sodium diet and engage in light cardio as advised."],
      relatedTests: [
        { name: "Echocardiogram", date: "2024-08-10", result: "Abnormal" },
        { name: "Troponin-I", date: "2024-08-10", result: "Abnormal" },
        { name: "Lipid Profile", date: "2024-06-20", result: "Normal" },
        { name: "Blood Pressure", date: "2024-08-18", result: "Normal" },
      ],
      image: "https://picsum.photos/seed/heart/100/100",
      dataAiHint: "heart organ",
      color: "hsl(var(--primary))",
    },
    {
      name: "Liver",
      condition: "Liver Cirrhosis",
      healthScore: null,
      status: "Needs Critical Attention",
      sourceOfAnalysis: "Based on: Doctor's notes mentioning 'episodes of confusion (encephalopathy)', diagnosis of Liver Cirrhosis, and referral to transplant team.",
      recommendations: ["Your doctor has referred you to the transplant team. It is important to follow up on this recommendation immediately.", "Continue all prescribed medications like Lactulose and Rifaximin.", "Strictly avoid alcohol and consult your doctor about any new medications."],
      relatedTests: [
        { name: "Liver Function Test", date: "2023-09-25", result: "Abnormal" },
        { name: "Ultrasound Abdomen", date: "2021-09-16", result: "Abnormal" },
        { name: "Ammonia Level Test", date: "2024-07-10", result: "Abnormal" },
        { name: "FibroScan", date: "2023-09-26", result: "Abnormal" },
      ],
      image: "https://picsum.photos/seed/liver/100/100",
      dataAiHint: "liver organ",
      color: "hsl(var(--primary))",
    },
    {
      name: "Kidneys",
      condition: "Healthy",
      healthScore: 90,
      status: "Good",
      sourceOfAnalysis: "Based on: Your recent Urinalysis and Serum Creatinine levels, which are in the normal range.",
      recommendations: ["Stay well-hydrated by drinking plenty of water throughout the day."],
      relatedTests: [
        { name: "Urinalysis", date: "2024-07-17", result: "Normal" },
        { name: "Kidney Function Test", date: "2024-08-02", result: "Normal" },
      ],
      image: "https://picsum.photos/seed/kidneys/100/100",
      dataAiHint: "kidneys organ",
      color: "hsl(var(--primary))",
    },
    {
      name: "Lungs",
      condition: "Healthy",
      healthScore: 92,
      status: "Good",
      sourceOfAnalysis: "Based on: Your recent Chest X-Ray, which was clear.",
      recommendations: ["Avoid exposure to smoke and pollutants.", "Practice deep breathing exercises."],
      relatedTests: [
        { name: "Chest X-Ray", date: "2024-07-10", result: "Normal" }
      ],
      image: "https://picsum.photos/seed/lungs/100/100",
      dataAiHint: "lungs organ",
      color: "hsl(var(--primary))",
    },
    {
      name: "Brain",
      condition: "Healthy",
      healthScore: 98,
      status: "Healthy",
      sourceOfAnalysis: "Based on: Your MRI Brain Scan from May 2024, which showed no abnormalities.",
      recommendations: ["Continue to manage stress and get adequate sleep.", "Engage in mentally stimulating activities."],
       relatedTests: [
        { name: "MRI Brain Scan", date: "2024-05-12", result: "Normal" }
      ],
      image: "https://picsum.photos/seed/brain/100/100",
      dataAiHint: "brain organ",
      color: "hsl(var(--primary))",
    },
    {
        name: "Stomach (Gut)",
        condition: "Healthy",
        healthScore: 93,
        status: "Healthy",
        sourceOfAnalysis: "Based on: Your recent CT Scan of the abdomen and Upper GI Endoscopy, which were normal.",
        recommendations: ["Maintain a balanced diet rich in fiber."],
        relatedTests: [
          { name: "CT Scan Abdomen", date: "2024-02-25", result: "Normal" },
          { name: "Upper GI Endoscopy", date: "2022-03-22", result: "Normal" }
        ],
        image: "https://picsum.photos/seed/stomach/100/100",
        dataAiHint: "stomach organ",
        color: "hsl(var(--primary))",
    }
];
