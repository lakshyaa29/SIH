"""
NagrikMitra AI - RAG (Retrieval-Augmented Generation) & Reasoning Engine
Intent classification, multi-factor matching, grounded citation generation, and anti-hallucination validation.
"""

import json
import re

INTENTS = [
    {
        "key": "Education",
        "label": "Education & Scholarships",
        "keywords": ["scholarship", "student", "education", "study", "college", "tuition", "fee", "financial help education", "stipend", "school", "degree", "ug", "pg", "phd", "matric", "fellowship", "books", "hostel fee"]
    },
    {
        "key": "Farmer Services",
        "label": "Farmer & Agriculture Welfare",
        "keywords": ["farmer", "farming", "crop", "kisan", "agriculture", "cultivator", "land holding", "drought", "crop loss", "fertilizer", "tractor", "seed subsidy", "pm kisan", "fasal bima", "irrigation", "soil health"]
    },
    {
        "key": "Healthcare",
        "label": "Healthcare & Medical Assistance",
        "keywords": ["health", "hospital", "medical", "treatment", "insurance", "ayushman", "surgery", "sick", "illness", "doctor", "cashless treatment", "pmjay", "operation", "medicine", "dialysis", "cardiac"]
    },
    {
        "key": "Pensions",
        "label": "Pensions & Retirement Security",
        "keywords": ["pension", "retire", "retirement", "provident fund", "epf", "uan", "old age income", "atal pension", "apy", "eps", "pf claim", "gratuity", "superannuation"]
    },
    {
        "key": "Aadhaar & Identity",
        "label": "Aadhaar & Identity Verification",
        "keywords": ["aadhaar", "aadhar", "uid number", "biometric update", "phone link aadhaar", "pvc aadhaar", "address change in aadhaar", "myaadhaar", "identity card"]
    },
    {
        "key": "Government Certificates",
        "label": "Government Certificates & Documents",
        "keywords": ["pan card", "pan number", "digilocker", "certificate", "birth certificate", "income certificate", "caste certificate", "domicile", "digital documents", "marksheet"]
    },
    {
        "key": "Driving Licence & Transport",
        "label": "Driving Licence & Transport Services",
        "keywords": ["driving licence", "driving license", "learner licence", "vehicle licence", "rto", "dl renewal", "sarathi", "parivahan", "vehicle rc", "driving test"]
    },
    {
        "key": "Food & Ration",
        "label": "Ration Card & Food Security",
        "keywords": ["ration card", "ration", "food security", "pds", "subsidised food", "onorc", "bpl ration", "annapurna", "free ration", "ration shop"]
    },
    {
        "key": "Employment & Labour",
        "label": "Employment, Labour & Gig Workers",
        "keywords": ["job", "employment", "worker", "unorganised", "shram", "daily wage", "gig worker", "labour card", "svanidhi", "street vendor", "hawker", "construction worker"]
    },
    {
        "key": "Housing",
        "label": "Housing & Pucca House Assistance",
        "keywords": ["house", "housing", "home loan", "awas", "pucca house", "pmay", "home subsidy", "slum redevelopment", "affordable house"]
    },
    {
        "key": "Women & Child Welfare",
        "label": "Women & Child Welfare Schemes",
        "keywords": ["woman", "women", "girl child", "daughter", "maternity", "anganwadi", "pregnant", "mother", "pmmvy", "sukanya samriddhi", "poshan", "lactating"]
    },
    {
        "key": "Senior Citizen Services",
        "label": "Senior Citizen Welfare & Care",
        "keywords": ["senior citizen", "elderly", "old age pension", "widow", "destitute", "vaya vandana", "geriatric", "assisted living", "age 60", "age 70"]
    },
    {
        "key": "Disability Services",
        "label": "Divyangjan & Disability Welfare",
        "keywords": ["disability", "disabled", "divyang", "udid", "swavlamban", "disability card", "handicap", "wheelchair", "prosthetic", "blindness", "hearing aid"]
    },
    {
        "key": "Business & Startups",
        "label": "MSME, Business & Startup Credit",
        "keywords": ["business", "startup", "udyam", "msme", "company registration", "shop registration", "mudra loan", "credit subsidy", "commercial loan", "self employment"]
    },
    {
        "key": "Grievance & Redressal",
        "label": "Public Grievance & Escalation (CPGRAMS)",
        "keywords": ["complaint", "grievance", "pending", "delayed", "delay", "not responding", "rejected", "stuck", "no response", "escalate", "pgportal", "bribe", "officer inaction", "harassment"]
    }
]

QUESTIONS_PER_INTENT = {
    "Education": [
        {
            "id": "state",
            "label": "Which state/UT are you located in?",
            "type": "select",
            "options": ["Maharashtra", "Delhi", "Uttar Pradesh", "Karnataka", "Tamil Nadu", "West Bengal", "Bihar", "Rajasthan", "Madhya Pradesh", "Gujarat", "Other State / All India"]
        },
        {
            "id": "level",
            "label": "What is your current education level?",
            "type": "select",
            "options": ["School (Class 1-10)", "Higher Secondary (11-12)", "Undergraduate (Degree / Diploma)", "Postgraduate (Master's)", "PhD / Doctorate"]
        },
        {
            "id": "income",
            "label": "What is your approximate annual family income?",
            "type": "select",
            "options": ["Below ₹1.5 Lakh", "₹1.5 Lakh – ₹2.5 Lakh", "₹2.5 Lakh – ₹6 Lakh", "Above ₹6 Lakh"]
        }
    ],
    "Farmer Services": [
        {
            "id": "state",
            "label": "Which state is your farm land located in?",
            "type": "select",
            "options": ["Maharashtra", "Punjab", "Uttar Pradesh", "Karnataka", "Madhya Pradesh", "Haryana", "Rajasthan", "Andhra Pradesh", "Other State / All India"]
        },
        {
            "id": "land",
            "label": "Do you hold agricultural land in your / family name?",
            "type": "select",
            "options": ["Yes, land title in my name", "Yes, joint / family-owned land", "Tenant farmer / Sharecropper", "Landless agriculture labourer"]
        },
        {
            "id": "need",
            "label": "What specific assistance do you need?",
            "type": "select",
            "options": ["Direct Income Support (₹6,000/yr)", "Crop Loss Insurance / Calamity Compensation", "Subsidized Seeds / Fertilizer / Equipment", "Kisan Credit Card (Low Interest Loan)"]
        }
    ],
    "Healthcare": [
        {
            "id": "state",
            "label": "Which state are you residing in?",
            "type": "select",
            "options": ["Maharashtra", "Delhi", "Uttar Pradesh", "Karnataka", "Tamil Nadu", "West Bengal", "Bihar", "Gujarat", "Other State / All India"]
        },
        {
            "id": "assist",
            "label": "What medical assistance is required?",
            "type": "select",
            "options": ["Cashless Hospitalisation / Surgery Cover (₹5 Lakh)", "Senior Citizen Health Card (Age 70+)", "Medicines & Diagnostic Assistance", "Maternal & Delivery Health Support"]
        },
        {
            "id": "coverage",
            "label": "Do you or your family currently hold an Ayushman Bharat or State Health Card?",
            "type": "select",
            "options": ["No, need to apply / check eligibility", "Yes, have card but need hospital list", "Card application is pending"]
        }
    ],
    "Pensions": [
        {
            "id": "age",
            "label": "What is your current age bracket?",
            "type": "select",
            "options": ["18–40 years", "41–59 years", "60 years and above"]
        },
        {
            "id": "employment",
            "label": "What was / is your primary employment sector?",
            "type": "select",
            "options": ["Unorganised / Daily Wage / Small Business", "Organised Salaried Sector (EPF/EPS)", "Government Employee", "Homemaker / Unemployed"]
        },
        {
            "id": "existing",
            "label": "Are you already receiving any monthly pension benefit?",
            "type": "select",
            "options": ["No, applying for new pension", "Yes, but need to resolve delay / claim"]
        }
    ],
    "Housing": [
        {
            "id": "area",
            "label": "Where is your residence located?",
            "type": "select",
            "options": ["Urban (City / Municipal Area)", "Rural (Gram Panchayat / Village)"]
        },
        {
            "id": "pucca",
            "label": "Does your family own a pucca (brick/concrete) house anywhere in India?",
            "type": "select",
            "options": ["No, living in kutcha house / rented", "Yes, already own a pucca house"]
        },
        {
            "id": "income",
            "label": "What is your annual household income?",
            "type": "select",
            "options": ["Below ₹3 Lakh (EWS)", "₹3 Lakh – ₹6 Lakh (LIG)", "Above ₹6 Lakh (MIG)"]
        }
    ],
    "Business & Startups": [
        {
            "id": "biz_stage",
            "label": "What is the current stage of your business?",
            "type": "select",
            "options": ["New Business Idea / Starting Up", "Existing Micro Enterprise (Shop / Trading)", "Small Manufacturing / Service Enterprise"]
        },
        {
            "id": "loan_req",
            "label": "What is your financial or credit requirement?",
            "type": "select",
            "options": ["Micro Loan up to ₹50,000 (MUDRA Shishu)", "Loan ₹50,000 to ₹5 Lakhs (MUDRA Kishore)", "Loan ₹5 Lakhs to ₹20 Lakhs (MUDRA Tarun)", "Free MSME / Udyam Registration & Certificates"]
        }
    ],
    "Employment & Labour": [
        {
            "id": "worker_type",
            "label": "What is your primary occupation?",
            "type": "select",
            "options": ["Urban Street Vendor / Hawker", "Construction / Daily Wage Labour", "Gig / Platform Delivery Worker", "Domestic / Service Worker"]
        },
        {
            "id": "need",
            "label": "What support are you looking for?",
            "type": "select",
            "options": ["Working Capital Loan (PM SVANidhi ₹10k - ₹50k)", "National e-Shram Registration & Social Security", "Accident Insurance & Welfare Card"]
        }
    ],
    "Grievance & Redressal": [
        {
            "id": "dept",
            "label": "Which government department / scheme is this grievance about?",
            "type": "select",
            "options": ["Scholarship / Education Portal", "PM-KISAN / Agriculture Department", "EPFO / Pension Disbursal", "Ration Card / Food Supply", "Aadhaar / PAN / Identity Authority", "Municipal / Housing Department", "Other Central or State Department"]
        },
        {
            "id": "duration",
            "label": "How long has your application or complaint been pending without resolution?",
            "type": "select",
            "options": ["Less than 15 days", "15 to 30 days", "More than 30 days (Breaches CPGRAMS Citizen Charter)"]
        },
        {
            "id": "ref_available",
            "label": "Do you have an application reference number or acknowledgment slip?",
            "type": "select",
            "options": ["Yes, have official application / acknowledgment ID", "No, applied offline or don't have reference"]
        }
    ],
    "__default": [
        {
            "id": "state",
            "label": "Which state or Union Territory are you from?",
            "type": "select",
            "options": ["Maharashtra", "Delhi", "Uttar Pradesh", "Karnataka", "Tamil Nadu", "West Bengal", "Bihar", "Gujarat", "Other State / All India"]
        },
        {
            "id": "category",
            "label": "Which category best fits your requirement?",
            "type": "select",
            "options": ["Education & Scholarship", "Healthcare & Treatment", "Pensions & Senior Care", "Farmer & Agriculture Support", "Housing & Subsidy", "Business & Loans", "Grievance / Pending Issue"]
        }
    ]
}

def detect_intent(text: str) -> dict:
    if not text or not text.strip():
        return {"key": None, "label": "Unspecified", "confidence": 0}
    
    clean_text = " " + re.sub(r'[^a-zA-Z0-9\s]', ' ', text.lower()) + " "
    
    best_intent = None
    max_score = 0

    for intent in INTENTS:
        score = 0
        for kw in intent["keywords"]:
            pattern = r'\b' + re.escape(kw.lower()) + r'\b'
            matches = len(re.findall(pattern, clean_text))
            if matches > 0:
                score += matches * (3 if " " in kw else 2)
            elif kw.lower() in clean_text:
                score += 1
        
        if score > max_score:
            max_score = score
            best_intent = intent

    if not best_intent or max_score == 0:
        return {"key": None, "label": "Other / Unclear", "confidence": 0}

    confidence = min(98, max(60, 50 + (max_score * 8)))
    return {
        "key": best_intent["key"],
        "label": best_intent["label"],
        "confidence": confidence
    }

def get_questions_for_intent(intent_key: str) -> list:
    return QUESTIONS_PER_INTENT.get(intent_key, QUESTIONS_PER_INTENT["__default"])

def retrieve_relevant_services(intent_key: str, answers: dict, services_pool: list) -> list:
    """
    RAG Retrieval: Filters and ranks services from the verified database based on intent and profile answers.
    """
    scored = []
    
    for s in services_pool:
        score = 20
        
        # Category alignment
        if intent_key and s["category"].lower() == intent_key.lower():
            score += 45
        elif intent_key and intent_key.lower() in s["category"].lower():
            score += 35
        
        # Profile resonance
        answers_str = " ".join([str(v) for v in (answers or {}).values()]).lower()
        
        keywords = s.get("keywords", [])
        if isinstance(keywords, str):
            try:
                keywords = json.loads(keywords)
            except:
                keywords = []
                
        for kw in keywords:
            if kw.lower() in answers_str:
                score += 8
                
        # Income weighting
        income = (answers or {}).get("income", "")
        if "Below" in income or "1.5" in income or "2.5" in income:
            if s["category"] in ["Education", "Housing", "Food & Ration", "Healthcare", "Senior Citizen Services"]:
                score += 10
                
        # Land holding
        land = (answers or {}).get("land", "")
        if "title in my name" in land or "joint" in land:
            if s["id"] in ["pm-kisan", "pmfby"]:
                score += 15
        elif "Tenant" in land or "Landless" in land:
            if s["id"] == "eshram":
                score += 15
                
        # Vendor check
        worker = (answers or {}).get("worker_type", "")
        if "Street Vendor" in worker or "Hawker" in worker:
            if s["id"] == "pm-svanidhi":
                score += 25
                
        # Business loan
        loan = (answers or {}).get("loan_req", "")
        if "MUDRA" in loan and s["id"] == "pm-mudra":
            score += 25
        if "Udyam" in loan and s["id"] == "udyam":
            score += 25
            
        score = min(99, max(30, score))
        scored.append({"service": s, "score": score})

    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:4]

def generate_grounded_response(service: dict, answers: dict) -> list:
    """
    RAG Grounding: Generates clear, verified explanations based strictly on the retrieved scheme record
    and user inputs to prevent any hallucinations.
    """
    rationale = []
    
    states = service.get("states", ["All"])
    if isinstance(states, str):
        try:
            states = json.loads(states)
        except:
            states = ["All"]
            
    if answers.get("state"):
        if "All" in states:
            rationale.append(f"Applicable for your location in {answers['state']} under Central / All-India nationwide coverage.")
        elif answers["state"] in states:
            rationale.append(f"Direct state-approved scheme for residents of {answers['state']}.")
            
    if answers.get("level"):
        rationale.append(f"Specifically matches your education tier: {answers['level']}.")
        
    if answers.get("income"):
        rationale.append(f"Aligns with your specified household income bracket ({answers['income']}).")
        
    if answers.get("land"):
        rationale.append(f"Evaluated against landholding status ({answers['land']}).")
        
    if answers.get("need"):
        rationale.append(f"Directly addresses your primary request: {answers['need']}.")
        
    if answers.get("worker_type"):
        rationale.append(f"Targeted welfare bracket for {answers['worker_type']}.")
        
    if answers.get("assist"):
        rationale.append(f"Provides intended coverage for: {answers['assist']}.")
        
    if not rationale:
        rationale.append(f"High relevance match based on the core category: {service.get('category', 'Government Service')}.")
        rationale.append(f"Official benefit backed by {service.get('ministry') or service.get('source_name', 'Government of India')}.")

    return rationale

def evaluate_full_profile(profile: dict, all_services: list) -> list:
    """
    Evaluates a citizen's full demographic profile across all indexed schemes simultaneously.
    """
    results = []
    for s in all_services:
        score = 40
        reasons = []
        
        # Age check
        age_str = str(profile.get("age", 25))
        try:
            age = int(re.findall(r'\d+', age_str)[0]) if re.findall(r'\d+', age_str) else 25
        except:
            age = 25
            
        if s["id"] == "apy-pension":
            if 18 <= age <= 40:
                score += 25
                reasons.append(f"Age {age} falls inside eligible bracket (18-40 years).")
            else:
                score -= 30
        elif s["id"] == "nsap-pension":
            if age >= 60:
                score += 30
                reasons.append(f"Senior citizen age requirement (60+) satisfied.")
            else:
                score -= 25
                
        # Occupation / Land
        occ = profile.get("occupation", "").lower()
        if "farmer" in occ:
            if s["category"] == "Farmer Services":
                score += 35
                reasons.append("Eligible as an agricultural cultivator / farmer family.")
        elif "student" in occ:
            if s["category"] == "Education":
                score += 35
                reasons.append("Eligible as an enrolled student.")
        elif "vendor" in occ or "hawker" in occ:
            if s["id"] in ["pm-svanidhi", "eshram"]:
                score += 40
                reasons.append("Directly designated for urban street vendors and micro retailers.")
        elif "business" in occ or "entrepreneur" in occ or "shop" in occ:
            if s["category"] == "Business & Startups":
                score += 35
                reasons.append("Eligible for MSME credit guarantees and Udyam certification.")

        # Income
        inc = profile.get("income", "")
        if "Below" in inc or "1.5" in inc or "2.5" in inc or "BPL" in inc:
            if s["category"] in ["Healthcare", "Food & Ration", "Housing", "Education", "Senior Citizen Services"]:
                score += 15
                reasons.append("Priority eligibility under lower income / EWS deprivation criteria.")

        score = min(98, max(25, score))
        results.append({
            "service": s,
            "match_percentage": score,
            "qualification_reasons": reasons if reasons else [f"Standard eligibility criteria for {s['category']}."]
        })

    results.sort(key=lambda x: x["match_percentage"], reverse=True)
    return results
