/* =========================================================================
   NagrikMitra AI / Sahayak AI — Jury & Presentation Demo Scenarios
   ========================================================================= */

export const DEMO_SCENARIOS = [
  {
    id: "demo-scholarship",
    title: "DEMO 1 — Engineering Student Scholarship",
    query: "I am a 22-year-old student from Maharashtra and I need financial assistance for my college tuition fees.",
    language: "en",
    context: {
      intent: "Scholarship & Financial Aid",
      category: "Education",
      state: "Maharashtra",
      user_type: "Student",
      course: "Undergraduate Engineering",
      income: "₹1.5 Lakh – ₹2.5 Lakh"
    },
    serviceId: "nsp-scholarship",
    questions: [
      {
        id: "income",
        question: "What is your family's annual income level?",
        options: ["Below ₹1.5 Lakh (BPL/EWS)", "₹1.5 Lakh – ₹2.5 Lakh", "Above ₹2.5 Lakh"],
        answer: "₹1.5 Lakh – ₹2.5 Lakh",
        field: "income",
        value: "₹1.5 Lakh – ₹2.5 Lakh"
      }
    ]
  },
  {
    id: "demo-farmer",
    title: "DEMO 2 — Small Farmer Drought Compensation & Income Support",
    query: "I am a small farmer in Maharashtra facing crop loss due to drought. Is there any financial support or crop insurance scheme for me?",
    language: "en",
    context: {
      intent: "Direct Income Support & Crop Loss Insurance",
      category: "Farmer Services",
      state: "Maharashtra",
      user_type: "Landholding Farmer",
      income: "Below ₹1.5 Lakh"
    },
    serviceId: "pm-kisan",
    questions: [
      {
        id: "land",
        question: "Do you own cultivable agricultural land registered in 7/12 / Khatoni?",
        options: ["Yes, registered owner", "Tenant farmer", "Landless agriculture worker"],
        answer: "Yes, registered owner",
        field: "land_holding",
        value: "Own Cultivable Land"
      }
    ]
  },
  {
    id: "demo-grievance",
    title: "DEMO 3 — CPGRAMS Public Grievance (NSP Delay > 45 Days)",
    query: "I applied for my National Scholarship on scholarships.gov.in 45 days ago. My college verified it, but state disbursal has been stuck with no status update.",
    language: "en",
    context: {
      intent: "CPGRAMS Public Grievance",
      category: "Grievance & Redressal",
      department: "Education / Scholarship Portal",
      days_pending: 45,
      ref_number: "MH2026-NSP-9921"
    },
    serviceId: "cpgrams",
    questions: []
  },
  {
    id: "demo-solar",
    title: "DEMO 4 — PM Surya Ghar Free Solar Electricity",
    query: "I want to install rooftop solar panels at home to get free electricity units under government subsidy.",
    language: "en",
    context: {
      intent: "PM Surya Ghar Subsidy",
      category: "Housing",
      state: "All",
      user_type: "Homeowner"
    },
    serviceId: "pm-surya-ghar",
    questions: []
  }
];
