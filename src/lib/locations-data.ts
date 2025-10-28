
export const locations: Record<string, { name: string; districts: { name: string; mandals: { name: string; villages: string[] }[] }[] }> = {
    "Andhra Pradesh": {
        name: "Andhra Pradesh",
        districts: [
            {
                name: "Anantapur",
                mandals: [
                    { name: "Anantapur", villages: ["Anantapur Urban", "Anantapur Rural"] },
                    { name: "Gooty", villages: ["Gooty", "Pamidi"] },
                ],
            },
            {
                name: "Chittoor",
                mandals: [
                    { name: "Chittoor", villages: ["Chittoor Urban", "Chittoor Rural"] },
                    { name: "Punganur", villages: ["Punganur", "Sompalle"] },
                ],
            },
            {
                name: "East Godavari",
                mandals: [
                    { name: "Rajahmundry", villages: ["Rajahmundry Urban", "Rajahmundry Rural"] },
                    { name: "Kadiam", villages: ["Kadiam", "Jegurapadu"] },
                ],
            },
            {
                name: "Guntur",
                mandals: [
                    { name: "Guntur East", villages: ["Guntur"] },
                    { name: "Guntur West", villages: ["Guntur"] },
                    { name: "Mangalagiri", villages: ["Mangalagiri", "Tadepalli"] },
                    { name: "Tenali", villages: ["Tenali", "Kollipara"] },
                ],
            },
             {
                name: "Palnadu",
                mandals: [
                    { name: "Narasaraopet", villages: ["Narasaraopet", "Kotappakonda"] },
                    { name: "Macherla", villages: ["Macherla", "Kesanupalle"] },
                    { name: "Gurazala", villages: ["Gurazala", "Daida"] },
                    { name: "Rentachintala", villages: ["Rentachintala", "Rentala", "Pasuvemula", "Goli"] },
                ],
            },
            {
                name: "Krishna",
                mandals: [
                    { name: "Machilipatnam", villages: ["Machilipatnam", "Gudivada"] },
                    { name: "Vuyyuru", villages: ["Vuyyuru", "Pamarru"] },
                ],
            },
             {
                name: "NTR",
                mandals: [
                    { name: "Vijayawada", villages: ["Vijayawada Urban", "Vijayawada Rural"] },
                    { name: "Nandigama", villages: ["Nandigama", "Kanchikacherla"] },
                ],
            },
            {
                name: "Kurnool",
                mandals: [
                    { name: "Kurnool", villages: ["Kurnool Urban", "Kurnool Rural"] },
                    { name: "Adoni", villages: ["Adoni", "Yemmiganur"] },
                ],
            },
            {
                name: "Prakasam",
                mandals: [
                    { name: "Ongole", villages: ["Ongole", "Korisapadu"] },
                    { name: "Markapur", villages: ["Markapur", "Tarlupadu"] },
                ],
            },
            {
                name: "SPSR Nellore",
                mandals: [
                    { name: "Nellore", villages: ["Nellore Urban", "Nellore Rural"] },
                    { name: "Kavali", villages: ["Kavali", "Buchireddypalem"] },
                ],
            },
            {
                name: "Srikakulam",
                mandals: [
                    { name: "Srikakulam", villages: ["Srikakulam Urban", "Srikakulam Rural"] },
                    { name: "Palasa", villages: ["Palasa", "Kasibugga"] },
                ],
            },
            {
                name: "Visakhapatnam",
                mandals: [
                    { name: "Visakhapatnam", villages: ["Visakhapatnam Urban", "Visakhapatnam Rural"] },
                    { name: "Gajuwaka", villages: ["Gajuwaka", "Anakapalle"] },
                ],
            },
            {
                name: "Vizianagaram",
                mandals: [
                    { name: "Vizianagaram", villages: ["Vizianagaram Urban", "Vizianagaram Rural"] },
                    { name: "Bobbili", villages: ["Bobbili", "Parvathipuram"] },
                ],
            },
            {
                name: "West Godavari",
                mandals: [
                    { name: "Eluru", villages: ["Eluru", "Bhimavaram"] },
                    { name: "Tadepalligudem", villages: ["Tadepalligudem", "Tanuku"] },
                ],
            },
            {
                name: "YSR Kadapa",
                mandals: [
                    { name: "Kadapa", villages: ["Kadapa Urban", "Kadapa Rural"] },
                    { name: "Proddatur", villages: ["Proddatur", "Jammalamadugu"] },
                ],
            },
        ],
    },
    "Telangana": {
        name: "Telangana",
        districts: [
            {
                name: "Hyderabad",
                mandals: [{ name: "Hyderabad", villages: ["Hyderabad Urban"] }],
            },
            {
                name: "Warangal",
                mandals: [{ name: "Warangal", villages: ["Warangal Urban"] }],
            },
            {
                name: "Karimnagar",
                mandals: [{ name: "Karimnagar", villages: ["Karimnagar Urban"] }],
            },
        ],
    },
    "Tamil Nadu": {
        name: "Tamil Nadu",
        districts: [
            { name: "Chennai", mandals: [{ name: "Chennai", villages: ["Chennai"] }] },
            { name: "Coimbatore", mandals: [{ name: "Coimbatore", villages: ["Coimbatore"] }] },
        ],
    },
    "Karnataka": {
        name: "Karnataka",
        districts: [
            { name: "Bengaluru Urban", mandals: [{ name: "Bengaluru", villages: ["Bengaluru"] }] },
            { name: "Mysuru", mandals: [{ name: "Mysuru", villages: ["Mysuru"] }] },
        ],
    },
    "Maharashtra": {
        name: "Maharashtra",
        districts: [
            { name: "Mumbai", mandals: [{ name: "Mumbai", villages: ["Mumbai"] }] },
            { name: "Pune", mandals: [{ name: "Pune", villages: ["Pune"] }] },
        ],
    },
};
