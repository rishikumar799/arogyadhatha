
export const medicineSchedule = [
    { 
        name: "Paracetamol", 
        teluguName: "పారాసిటమాల్", 
        use: "For fever and pain relief", 
        teluguUse: "జ్వరం మరియు నొప్పి నివారణకు", 
        dosage: "500mg", 
        frequency: "3 times a day",
        image: "https://picsum.photos/seed/paracetamol/100/100",
        dataAiHint: "white tablet",
        alerts: [
            { time: "9:00 AM", status: "taken" },
            { time: "1:00 PM", status: "taken" },
            { time: "9:00 PM", status: "pending" },
        ]
    },
    { 
        name: "Vitamin D3", 
        teluguName: "విటమిన్ డి3", 
        use: "For bone health", 
        teluguUse: "ఎముకల ఆరోగ్యానికి", 
        dosage: "60000 IU", 
        frequency: "Once a week",
        image: "https://picsum.photos/seed/vitamind/100/100",
        dataAiHint: "yellow softgel",
        alerts: [
            { time: "1:00 PM", status: "taken" }
        ]
    },
    { 
        name: "Metformin", 
        teluguName: "మెట్‌ఫార్మిన్", 
        use: "To control blood sugar", 
        teluguUse: "రక్తంలో చక్కెరను నియంత్రించడానికి", 
        dosage: "1000mg", 
        frequency: "Twice a day",
        image: "https://picsum.photos/seed/metformin/100/100",
        dataAiHint: "white pill",
        alerts: [
            { time: "8:30 AM", status: "missed" },
            { time: "8:30 PM", status: "pending" },
        ]
    },
    { 
        name: "Omega-3", 
        teluguName: "ఒమేగా-3", 
        use: "For heart health", 
        teluguUse: "గుండె ఆరోగ్యానికి", 
        dosage: "1 capsule", 
        frequency: "Once a day",
        image: "https://picsum.photos/seed/omega3/100/100",
        dataAiHint: "fish oil capsule",
        alerts: [
            { time: "9:30 PM", status: "pending" },
        ]
    },
];

export const medicineHistoryData = [
    {
        date: "Today, Jul 17, 2024",
        summary: "3 of 7 doses taken",
        medicines: [
            { name: "Paracetamol", alerts: [{time: "9:00 AM", status: "taken"}, {time: "1:00 PM", status: "taken"}, {time: "9:00 PM", status: "pending"}] },
            { name: "Vitamin D3", alerts: [{time: "1:00 PM", status: "taken"}] },
            { name: "Metformin", alerts: [{time: "8:30 AM", status: "missed"}, {time: "8:30 PM", status: "pending"}] },
            { name: "Omega-3", alerts: [{time: "9:30 PM", status: "pending"}] },
        ]
    },
    {
        date: "Yesterday, Jul 16, 2024",
        summary: "5 of 7 doses taken",
        medicines: [
             { name: "Paracetamol", alerts: [{time: "9:00 AM", status: "taken"}, {time: "1:00 PM", status: "taken"}, {time: "9:00 PM", status: "taken"}] },
             { name: "Vitamin D3", alerts: [] },
             { name: "Metformin", alerts: [{time: "8:30 AM", status: "missed"}, {time: "8:30 PM", status: "taken"}] },
             { name: "Omega-3", alerts: [{time: "9:30 PM", status: "taken"}] },
        ]
    },
    {
        date: "Jul 15, 2024",
        summary: "7 of 7 doses taken",
        medicines: [
             { name: "Paracetamol", alerts: [{time: "9:00 AM", status: "taken"}, {time: "1:00 PM", status: "taken"}, {time: "9:00 PM", status: "taken"}] },
             { name: "Vitamin D3", alerts: [] },
             { name: "Metformin", alerts: [{time: "8:30 AM", status: "taken"}, {time: "8:30 PM", status: "taken"}] },
             { name: "Omega-3", alerts: [{time: "9:30 PM", status: "taken"}] },
        ]
    }
];
