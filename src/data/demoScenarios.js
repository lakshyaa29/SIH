// Pre-loaded SIH Demo Scenarios for Instant Judge Demonstration

export const DEMO_SCENARIOS = [
  {
    id: "demo-scholarship",
    title: "DEMO 1 — Engineering Scholarship",
    query: "I am a first-year engineering student from Maharashtra and I need a scholarship.",
    language: "en",
    context: {
      intent: "Scholarship / Financial Assistance",
      category: "Education",
      state: "Maharashtra",
      user_type: "Student",
      course: "Engineering",
      year: "1st Year",
      income: 450000
    },
    serviceId: "edu-mahadbt-post-matric",
    questions: [
      {
        id: "income",
        question: "What is your family's annual income approx?",
        options: ["Under ₹2.5 Lakhs", "Under ₹8 Lakhs", "Above ₹8 Lakhs"],
        answer: "Under ₹8 Lakhs",
        field: "income",
        value: 450000
      }
    ]
  },
  {
    id: "demo-aadhaar",
    title: "DEMO 2 — Lost Aadhaar Card",
    query: "I lost my Aadhaar card. What should I do?",
    language: "en",
    context: {
      intent: "Aadhaar Card Replacement / Download",
      category: "Identity",
      state: "All India",
      user_type: "Individual",
      action: "Duplicate / Re-issue"
    },
    serviceId: "id-aadhaar-lost-duplicate",
    questions: [
      {
        id: "mobile_linked",
        question: "Is your mobile number linked to your Aadhaar card?",
        options: ["Yes, mobile is active & linked", "No, or I don't remember"],
        answer: "Yes, mobile is active & linked",
        field: "mobile_linked",
        value: true
      }
    ]
  },
  {
    id: "demo-pension",
    title: "DEMO 3 — Senior Citizen Pension",
    query: "My mother needs help applying for a pension.",
    language: "en",
    context: {
      intent: "Old Age Pension Scheme",
      category: "Social Welfare",
      user_type: "Senior Citizen",
      relation: "Mother"
    },
    serviceId: "welfare-nsap-oldage-pension",
    questions: [
      {
        id: "age",
        question: "How old is your mother?",
        options: ["60 years or above", "Under 60 years"],
        answer: "60 years or above",
        field: "age",
        value: 62
      },
      {
        id: "category",
        question: "Does your family possess a BPL / Low Income Card?",
        options: ["Yes, BPL Ration Card", "No / General Category"],
        answer: "Yes, BPL Ration Card",
        field: "category",
        value: "BPL"
      }
    ]
  },
  {
    id: "demo-certificate",
    title: "DEMO 4 — Caste Certificate (Maharashtra)",
    query: "I need to apply for a caste certificate.",
    language: "en",
    context: {
      intent: "Caste Certificate Issuance",
      category: "Certificates",
      state: "Maharashtra",
      user_type: "Resident"
    },
    serviceId: "cert-caste-certificate-mh",
    questions: [
      {
        id: "state",
        question: "Which state are you a resident of?",
        options: ["Maharashtra", "Delhi", "Other State"],
        answer: "Maharashtra",
        field: "state",
        value: "Maharashtra"
      },
      {
        id: "caste_category",
        question: "Which reserved category do you belong to?",
        options: ["OBC", "SC", "ST", "VJNT / SBC"],
        answer: "OBC",
        field: "category",
        value: "OBC"
      }
    ]
  }
];
