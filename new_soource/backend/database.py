"""
NagrikMitra AI - Database Layer
SQLite schema, connection handling, and comprehensive seed data for 50+ verified official Indian government services.
"""

import sqlite3
import json
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "nagrikmitra.db")

DEFAULT_SERVICES = [
    # ------------------ 1. EDUCATION & SCHOLARSHIPS ------------------
    {
        "id": "nsp-scholarship",
        "service_name": "National Scholarship Portal (NSP)",
        "category": "Education",
        "ministry": "Ministry of Education",
        "description": "Single-window digital portal hosting hundreds of central, state, UGC, and AICTE government scholarships for school, undergraduate, postgraduate, and PhD students across India.",
        "states": ["All"],
        "eligibility": [
            "Enrolled student in recognized school/UG/PG/PhD institution",
            "Meets specific scheme income/merit/category criteria on NSP",
            "Valid Aadhaar-linked active bank account"
        ],
        "required_documents": [
            "Aadhaar card",
            "Bank passbook (Aadhaar-seeded)",
            "Latest mark sheet / Bonafide student certificate",
            "Income certificate (competent revenue authority)",
            "Category/Caste certificate (if applicable)"
        ],
        "application_steps": [
            "Register on scholarships.gov.in as a fresh or renewal applicant with Aadhaar",
            "Fill personal, academic, and bank account details",
            "Select specific scholarship scheme(s) matching your profile",
            "Upload verified documents and submit application",
            "Institute verification followed by State/Nodal officer verification",
            "Disbursement directly via Direct Benefit Transfer (DBT)"
        ],
        "official_url": "https://scholarships.gov.in",
        "source_name": "Ministry of Education — National Scholarship Portal",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["scholarship", "student", "education", "study", "college", "fee", "tuition", "financial help education", "stipend", "merit", "post matric", "pre matric", "ugc", "aicte"]
    },
    {
        "id": "pm-yasasvi",
        "service_name": "PM-YASASVI Scholarship Scheme",
        "category": "Education",
        "ministry": "Ministry of Social Justice and Empowerment",
        "description": "Top-class school and college education scholarship providing up to ₹1,25,000/year for meritorious students from Other Backward Classes (OBC), Economically Backward Classes (EBC), and De-Notified Tribes (DNT).",
        "states": ["All"],
        "eligibility": [
            "Students belonging to OBC, EBC, or DNT categories studying in Class 9, 11 or top identified colleges",
            "Annual family income not exceeding ₹2.5 Lakh per annum"
        ],
        "required_documents": [
            "Aadhaar Card",
            "OBC / EBC / DNT Category Certificate",
            "Annual Income Certificate (< ₹2.5 Lakh)",
            "Previous Class Marksheet",
            "Aadhaar-linked Bank Account details"
        ],
        "application_steps": [
            "Apply online through the National Scholarship Portal (scholarships.gov.in)",
            "Select Department of Social Justice and Empowerment -> PM YASASVI",
            "Enter academic records and category certificates",
            "Institution and district welfare officer verify application",
            "Scholarship credited via PFMS Direct Benefit Transfer"
        ],
        "official_url": "https://scholarships.gov.in",
        "source_name": "Ministry of Social Justice & Empowerment",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["yasasvi", "pm yasasvi", "obc scholarship", "ebc", "dnt", "school scholarship", "hostel allowance"]
    },
    {
        "id": "vidyalakshmi-edu",
        "service_name": "Vidya Lakshmi — Government Education Loan Portal",
        "category": "Education",
        "ministry": "Department of Higher Education & Department of Financial Services",
        "description": "First-of-its-kind single window portal for students to access education loans and government interest subsidies (CSIS) across 40+ public and private scheduled banks.",
        "states": ["All"],
        "eligibility": [
            "Indian national admitted to recognized higher education course in India or abroad",
            "Central Sector Interest Subsidy (CSIS) available for families with annual income up to ₹4.5 Lakh"
        ],
        "required_documents": [
            "Admission letter and fee breakdown from college/university",
            "10th, 12th, and Degree mark sheets",
            "Income certificate for interest subsidy claim",
            "KYC documents (Aadhaar, PAN) of student and co-borrower/parent",
            "Asset and liability statement (for loans above ₹7.5 Lakh)"
        ],
        "application_steps": [
            "Register on vidyalakshmi.co.in",
            "Fill the Common Education Loan Application Form (CELAF)",
            "Search and apply to up to 3 banks and multiple loan schemes simultaneously",
            "Track loan sanction status in real time online",
            "Direct loan disbursal to university/college tuition account"
        ],
        "official_url": "https://www.vidyalakshmi.co.in",
        "source_name": "Department of Higher Education (MoE) & NSDL",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["education loan", "vidya lakshmi", "college loan", "student loan", "interest subsidy", "csis", "study abroad loan"]
    },
    {
        "id": "swayam-moocs",
        "service_name": "SWAYAM — Free Online Higher Education & Certifications",
        "category": "Education",
        "ministry": "Ministry of Education",
        "description": "Government digital learning platform offering thousands of free courses from Class 9 up to Post-Graduation designed by IITs, IIMs, IISc, and Central Universities with academic credit transfer under UGC guidelines.",
        "states": ["All"],
        "eligibility": [
            "Open to all students, working professionals, and lifelong learners across India and abroad",
            "No admission fees for learning course contents"
        ],
        "required_documents": [
            "Valid email ID and mobile number",
            "College roll number (if seeking UGC credit transfer to degree mark sheet)"
        ],
        "application_steps": [
            "Visit swayam.gov.in and create a learner profile",
            "Enroll in any chosen engineering, science, humanities, or management course",
            "Access video lectures, reading material, quizzes, and discussion forums for free",
            "Register for in-person proctored exam at nominal fee to receive official verified certificate and college credits"
        ],
        "official_url": "https://swayam.gov.in",
        "source_name": "Ministry of Education — SWAYAM",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["swayam", "online courses", "free courses", "iit courses", "nptel", "ugc credits", "higher education online", "certifications"]
    },

    # ------------------ 2. FARMER SERVICES & AGRICULTURE ------------------
    {
        "id": "pm-kisan",
        "service_name": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
        "category": "Farmer Services",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "Direct income support scheme providing ₹6,000 per year in three equal instalments of ₹2,000 directly into the bank accounts of all landholding farmer families.",
        "states": ["All"],
        "eligibility": [
            "Landholding farmer family with cultivable land in state land records",
            "Excludes institutional landholders, government employees, income-tax payers, doctors/engineers/lawyers"
        ],
        "required_documents": [
            "Aadhaar card",
            "Land ownership records (7/12, Khatoni / RoR)",
            "Active Aadhaar-linked bank account",
            "Active mobile number linked to Aadhaar (for e-KYC)"
        ],
        "application_steps": [
            "Visit pmkisan.gov.in or nearest Common Service Centre (CSC)",
            "Click 'New Farmer Registration' and enter Aadhaar & State",
            "Fill land ownership details, survey number, and bank details",
            "Complete mandatory e-KYC via OTP or biometric scan",
            "State/UT nodal officer verifies land records",
            "Direct DBT payment of ₹2,000 every 4 months"
        ],
        "official_url": "https://pmkisan.gov.in",
        "source_name": "Ministry of Agriculture & Farmers Welfare — PM-KISAN",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["farmer", "farming", "crop", "kisan", "agriculture", "land", "cultivator", "income support farmer", "samman nidhi", "fertilizer subsidy", "pm kisan"]
    },
    {
        "id": "pmfby",
        "service_name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        "category": "Farmer Services",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "Comprehensive crop insurance scheme protecting farmers against financial losses caused by natural calamities, droughts, floods, pests, and post-harvest unseasonal rain with nominal farmer premium (1.5% Rabi, 2% Kharif, 5% Commercial).",
        "states": ["All"],
        "eligibility": [
            "All farmers including sharecroppers and tenant farmers growing notified crops in notified areas",
            "Available to both loanee and non-loanee farmers"
        ],
        "required_documents": [
            "Aadhaar card",
            "Land possession certificate / Land Record (7/12, Khatoni)",
            "Sowing certificate / Crop Declaration certificate issued by Patwari / Village Revenue Officer",
            "Bank passbook with clear account number and IFSC"
        ],
        "application_steps": [
            "Visit pmfby.gov.in or nearest CSC, bank branch, or Agriculture Insurance Company office before cut-off date",
            "Select 'Farmer Corner' and fill crop insurance application",
            "Upload land records and sowing certificate",
            "Pay subsidized farmer share of premium (1.5% to 5%) online or via bank",
            "Receive policy receipt; report crop loss within 72 hours via Crop Insurance App / 14447 helpline for direct bank settlement"
        ],
        "official_url": "https://pmfby.gov.in",
        "source_name": "Ministry of Agriculture & Farmers Welfare — PMFBY",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["crop insurance", "fasal bima", "pmfby", "crop loss", "drought", "flood loss", "hailstorm", "agriculture compensation", "farmer insurance"]
    },
    {
        "id": "kcc-loan",
        "service_name": "Kisan Credit Card (KCC) Scheme",
        "category": "Farmer Services",
        "ministry": "Ministry of Agriculture & Farmers Welfare / RBI",
        "description": "Subsidized institutional short-term credit up to ₹3 Lakhs at 4% effective interest rate (with 3% prompt repayment incentive) for crop cultivation, livestock, dairy, and fisheries.",
        "states": ["All"],
        "eligibility": [
            "Owner cultivators, tenant farmers, oral lessees, sharecroppers, and Self-Help Groups (SHGs) of farmers",
            "Animal husbandry, dairy, and fisheries farmers are also eligible up to ₹2 Lakh without collateral"
        ],
        "required_documents": [
            "Duly filled KCC application form",
            "Identity Proof (Aadhaar, Voter ID, PAN)",
            "Address Proof",
            "Land holding records certified by revenue department",
            "Cropping pattern and land acreage declaration"
        ],
        "application_steps": [
            "Download KCC form from agricoop.gov.in or collect from local bank branch / CSC",
            "Submit application with land record details",
            "Bank processes and issues KCC card within 14 days without processing fee for loans up to ₹3 Lakh",
            "Use KCC RuPay card at ATMs and PoS machines for agriculture purchases"
        ],
        "official_url": "https://agricoop.gov.in",
        "source_name": "Department of Agriculture & Farmers Welfare",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["kcc", "kisan credit card", "crop loan", "low interest farm loan", "agriculture credit", "dairy loan", "fisheries credit"]
    },
    {
        "id": "pm-kusum",
        "service_name": "PM-KUSUM (Solar Agriculture Pumps & Grid Subsidy)",
        "category": "Farmer Services",
        "ministry": "Ministry of New and Renewable Energy",
        "description": "Government subsidy of up to 60% for installing standalone solar agriculture pumps (off-grid) and solarization of existing grid-connected agricultural pumps with option to sell surplus power to DISCOMs.",
        "states": ["All"],
        "eligibility": [
            "Individual farmers, groups of farmers, cooperatives, Panchayats, and Farmer Producer Organizations (FPOs)",
            "Must possess cultivable land suitable for pump installation or solar plant"
        ],
        "required_documents": [
            "Aadhaar card",
            "Land title records (Khasra/Khatoni)",
            "Bank account passbook",
            "Electricity connection consumer number (if solarizing existing electric pump)"
        ],
        "application_steps": [
            "Apply on the state renewable energy development agency portal (e.g. MEDA, UPNEDA) linked from pmkusum.mnre.gov.in",
            "Select solar pump capacity (3HP, 5HP, 7.5HP)",
            "Pay farmer contribution share (10% to 40% based on state subsidy tier)",
            "Inspection and installation of solar panels and solar pump by empanelled vendor",
            "Enjoy zero electricity bills for irrigation"
        ],
        "official_url": "https://pmkusum.mnre.gov.in",
        "source_name": "Ministry of New and Renewable Energy",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["pm kusum", "solar pump", "kisan solar", "agriculture solar subsidy", "solar irrigation", "diesel pump replacement", "kusum"]
    },
    {
        "id": "soil-health-card",
        "service_name": "Soil Health Card Scheme",
        "category": "Farmer Services",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "Provides farmers with crop-wise nutrient status recommendations for their specific soil plot every 2 years to optimize fertilizer dosage and enhance crop productivity.",
        "states": ["All"],
        "eligibility": [
            "All farmers holding agricultural land in India"
        ],
        "required_documents": [
            "Farmer Aadhaar card",
            "Land survey / Khasra number"
        ],
        "application_steps": [
            "Soil sample is collected from farmer's field by agriculture department officer / Gram Sevak",
            "Sample is tested in district soil testing laboratory for 12 essential nutrients",
            "Soil Health Card is generated and distributed to farmer or downloaded from soilhealth.dac.gov.in",
            "Follow customized fertilizer and organic manure recommendations"
        ],
        "official_url": "https://soilhealth.dac.gov.in",
        "source_name": "Department of Agriculture & Farmers Welfare",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["soil health card", "soil testing", "fertilizer recommendation", "soil fertility", "agriculture soil report"]
    },

    # ------------------ 3. HEALTHCARE & WELLNESS ------------------
    {
        "id": "pmjay",
        "service_name": "Ayushman Bharat — PM-JAY (Pradhan Mantri Jan Arogya Yojana)",
        "category": "Healthcare",
        "ministry": "National Health Authority (Ministry of Health & Family Welfare)",
        "description": "World's largest government-funded health assurance scheme providing ₹5 lakh health cover per family per year for secondary and tertiary hospitalisation at empanelled public & private hospitals.",
        "states": ["All"],
        "eligibility": [
            "Families identified as deprived under SECC 2011 database or state-extended welfare criteria",
            "Senior citizens aged 70+ (under expanded Ayushman Bharat Vaya Vandana cover)",
            "No family size or age restrictions"
        ],
        "required_documents": [
            "Aadhaar card of all family members",
            "Ration Card or State-notified Family ID / Samagra ID",
            "Mobile number for OTP verification"
        ],
        "application_steps": [
            "Check eligibility on pmjay.gov.in or the 'Am I Eligible' mobile portal",
            "Visit nearest Empanelled Health Care Provider (EHCP) or Ayushman Mitra kiosk / CSC",
            "Verify identity through Aadhaar and Ration Card e-KYC",
            "Receive Ayushman Golden Card (PVC / Digital e-Card)",
            "Present card at any empanelled hospital across India for 100% cashless hospitalisation"
        ],
        "official_url": "https://pmjay.gov.in",
        "source_name": "National Health Authority — PM-JAY",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["health", "hospital", "medical", "treatment", "insurance", "ayushman", "surgery cost", "healthcare assistance", "pmjay", "cashless treatment", "cardiology", "operation"]
    },
    {
        "id": "pmbjp-janaushadhi",
        "service_name": "Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)",
        "category": "Healthcare",
        "ministry": "Department of Pharmaceuticals, Ministry of Chemicals & Fertilizers",
        "description": "Government initiative offering over 2,000 high-quality generic medicines and 300 surgical items at 50% to 90% cheaper prices than branded market equivalents through 10,000+ dedicated Kendras.",
        "states": ["All"],
        "eligibility": [
            "Open to all citizens without income or demographic restrictions",
            "Prescription from registered medical practitioner recommended"
        ],
        "required_documents": [
            "Doctor's prescription (for schedule drugs); no document needed for OTC items and sanitary pads (₹1/pad)"
        ],
        "application_steps": [
            "Locate nearest Jan Aushadhi Kendra using the 'Jan Aushadhi Sugam' mobile app or janaushadhi.gov.in",
            "Present prescription or medicine chemical composition",
            "Purchase certified WHO-GMP generic medicines at 50-90% lower rates",
            "Interested entrepreneurs can also apply online to open a new Jan Aushadhi Kendra"
        ],
        "official_url": "https://janaushadhi.gov.in",
        "source_name": "Pharmaceuticals & Medical Devices Bureau of India (PMBI)",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["janaushadhi", "generic medicines", "cheap medicine", "pharmacy subsidy", "oxyo biodegradable pads", "affordable healthcare", "pmbjp"]
    },
    {
        "id": "abha-card",
        "service_name": "ABHA — Ayushman Bharat Health Account",
        "category": "Healthcare",
        "ministry": "National Health Authority (NHA)",
        "description": "Creation of a 14-digit digital health ID enabling citizens to seamlessly store, access, and share medical records, lab reports, prescriptions, and insurance claims digitally with verified doctors.",
        "states": ["All"],
        "eligibility": [
            "Any Indian citizen of any age"
        ],
        "required_documents": [
            "Aadhaar card or Driving Licence",
            "Mobile number linked to Aadhaar (for OTP authentication)"
        ],
        "application_steps": [
            "Visit abha.abdm.gov.in or download the ABHA app",
            "Click 'Create ABHA Number' and enter 12-digit Aadhaar",
            "Authenticate using OTP sent to Aadhaar-registered mobile",
            "Choose a personalized ABHA address (like username@abdm)",
            "Download instant digital ABHA Card and link medical histories from hospitals"
        ],
        "official_url": "https://abha.abdm.gov.in",
        "source_name": "National Health Authority — ABDM",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["abha", "health id", "digital health card", "abdm", "medical records online", "ayushman health account"]
    },
    {
        "id": "nikshay-poshan",
        "service_name": "Nikshay Poshan Yojana (TB Patient Nutrition Support)",
        "category": "Healthcare",
        "ministry": "Ministry of Health and Family Welfare",
        "description": "Direct Benefit Transfer of ₹500 per month for the entire duration of treatment to all notified Tuberculosis (TB) patients to support nutritional requirements.",
        "states": ["All"],
        "eligibility": [
            "All TB patients notified on the national Ni-kshay health portal (both public and private sectors)"
        ],
        "required_documents": [
            "Aadhaar card",
            "Active bank account details (Aadhaar linked)",
            "Ni-kshay patient registration ID"
        ],
        "application_steps": [
            "Patient is registered by treating doctor / health facility on nikshay.in",
            "Submit bank passbook copy and Aadhaar to the health worker / DOTS centre",
            "Direct Benefit Transfer of ₹500/month credited automatically to bank account during active treatment"
        ],
        "official_url": "https://www.nikshay.in",
        "source_name": "Central TB Division — Ministry of Health & Family Welfare",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["nikshay", "tb patient", "tuberculosis allowance", "nutrition support", "dbt health"]
    },

    # ------------------ 4. PENSIONS & SOCIAL SECURITY ------------------
    {
        "id": "apy-pension",
        "service_name": "Atal Pension Yojana (APY)",
        "category": "Pensions",
        "ministry": "Ministry of Finance / PFRDA",
        "description": "Guaranteed monthly pension scheme of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000 per month starting at age 60 for citizens working in the unorganised sector.",
        "states": ["All"],
        "eligibility": [
            "Indian citizen aged between 18 and 40 years",
            "Possesses a valid savings bank or post office account",
            "Must not be an income-tax payer (effective from Oct 2022 rules)"
        ],
        "required_documents": [
            "Aadhaar card",
            "Active Savings Bank / Post Office account",
            "Mobile number registered with bank account",
            "Nominee details"
        ],
        "application_steps": [
            "Visit your home bank branch, post office, or use net banking / mobile banking app",
            "Fill APY subscriber registration form and choose desired monthly pension slab",
            "Authorise auto-debit of monthly/quarterly contribution from savings account",
            "Receive Permanent Retirement Account Number (PRAN) for APY via SMS",
            "Guaranteed lifetime pension begins automatically upon attaining age 60"
        ],
        "official_url": "https://www.pfrda.org.in",
        "source_name": "Pension Fund Regulatory & Development Authority (PFRDA)",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["pension", "atal pension yojana", "apy", "old age income", "retirement savings unorganised", "monthly pension", "guaranteed pension"]
    },
    {
        "id": "epfo-pension",
        "service_name": "EPFO — Employees' Pension Scheme (EPS-95)",
        "category": "Pensions",
        "ministry": "Ministry of Labour & Employment",
        "description": "Social security pension scheme for organized sector employees covered under EPF & MP Act 1952, providing monthly pension post-retirement, disablement pension, and widow/children pension.",
        "states": ["All"],
        "eligibility": [
            "Salaried employee with regular EPF/EPS contributions",
            "Minimum 10 years of eligible contributory service for regular superannuation pension",
            "Retirement age of 58 years (early pension option available from age 50)"
        ],
        "required_documents": [
            "Activated Universal Account Number (UAN)",
            "Aadhaar card linked with UAN (KYC approved)",
            "Cancelled bank cheque or bank passbook copy",
            "Form 10D (online composite pension claim form)"
        ],
        "application_steps": [
            "Login to unifiedportal-mem.epfindia.gov.in with UAN and password",
            "Verify that service history and exit date are marked by employer",
            "Navigate to Online Services -> Claim (Form-31, 19, 10C & 10D)",
            "Select Form 10D (Monthly Pension Claim)",
            "Upload bank proof and verify via Aadhaar OTP",
            "Pension Payment Order (PPO) issued and monthly credit to bank account"
        ],
        "official_url": "https://www.epfindia.gov.in",
        "source_name": "Employees' Provident Fund Organisation (EPFO)",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["pension", "retire", "provident fund", "epf", "uan", "employee pension", "eps 95", "pf withdrawal", "superannuation", "ppo"]
    },
    {
        "id": "nsap-pension",
        "service_name": "National Social Assistance Programme (Indira Gandhi Old Age Pension)",
        "category": "Senior Citizen Services",
        "ministry": "Ministry of Rural Development",
        "description": "Centrally sponsored non-contributory monthly pension scheme for destitute senior citizens, widows, and disabled individuals belonging to Below Poverty Line (BPL) households.",
        "states": ["All"],
        "eligibility": [
            "Age 60 years and above (IGNOAPS component)",
            "Household certified as living Below Poverty Line (BPL) as per state criteria"
        ],
        "required_documents": [
            "Aadhaar card",
            "Age proof (Birth certificate, voter card, school leaving certificate)",
            "BPL card / Ration card with BPL endorsement",
            "Bank / Post office passbook (Aadhaar linked)"
        ],
        "application_steps": [
            "Download application from nsap.nic.in or collect form from Gram Panchayat / BDO / Municipal office",
            "Submit filled form with BPL and age proof to Block Development Officer or Sub-Divisional Magistrate",
            "Verification and social audit by local revenue inspector",
            "Sanction order issued and monthly pension credited directly via DBT"
        ],
        "official_url": "https://nsap.nic.in",
        "source_name": "Ministry of Rural Development — NSAP",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["senior citizen", "elderly", "old age pension", "widow pension", "bpl pension", "nsap", "social assistance", "indira gandhi pension"]
    },
    {
        "id": "pm-sym",
        "service_name": "PM-SYM — Pradhan Mantri Shram Yogi Maan-dhan",
        "category": "Pensions",
        "ministry": "Ministry of Labour & Employment",
        "description": "Voluntary and contributory pension scheme for unorganized workers (street vendors, agricultural workers, construction labourers, domestic help) ensuring an assured minimum pension of ₹3,000/month after age 60.",
        "states": ["All"],
        "eligibility": [
            "Unorganized worker aged 18 to 40 years",
            "Monthly income of ₹15,000 or below",
            "Must NOT be an income-tax payer or covered under EPFO/ESIC/NPS"
        ],
        "required_documents": [
            "Aadhaar card",
            "Savings bank account passbook with IFSC",
            "Mobile number"
        ],
        "application_steps": [
            "Visit nearest Common Service Centre (CSC) or register at maandhan.in",
            "Enter Aadhaar and bank details for e-KYC",
            "System calculates monthly contribution (₹55 to ₹200 based on entry age) matched 50:50 by Central Govt",
            "Initial contribution paid in cash at CSC; auto-debit set up for future months",
            "Receive instant Shram Yogi Pension Card with unique Pension Account Number"
        ],
        "official_url": "https://maandhan.in",
        "source_name": "Ministry of Labour & Employment — Maan-dhan",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["shram yogi", "pm sym", "unorganized pension", "labour pension", "3000 pension", "maandhan"]
    },

    # ------------------ 5. HOUSING & INFRASTRUCTURE ------------------
    {
        "id": "pmay-urban",
        "service_name": "Pradhan Mantri Awas Yojana (PMAY Urban)",
        "category": "Housing",
        "ministry": "Ministry of Housing and Urban Affairs",
        "description": "Provides all-weather pucca houses with water, sanitation, and electricity to eligible urban families in EWS and LIG categories through interest subsidies and direct financial assistance.",
        "states": ["All"],
        "eligibility": [
            "Beneficiary family must not own a pucca house anywhere in India",
            "Annual income: EWS up to ₹3 Lakh, LIG up to ₹6 Lakh, MIG up to ₹18 Lakh",
            "Female head of household must be owner / co-owner"
        ],
        "required_documents": [
            "Aadhaar cards of all household members",
            "Income certificate / ITR acknowledgement",
            "Self-declaration confirming no other pucca house owned",
            "Bank passbook copy",
            "Land title documents / property agreement (for construction subsidy)"
        ],
        "application_steps": [
            "Visit pmaymis.gov.in or municipal ward office / CSC",
            "Select 'Citizen Assessment' and enter Aadhaar details",
            "Fill household details, income, address, and housing requirement category",
            "Field inspection and geo-tagging by urban local body",
            "Subsidy transferred directly into home loan account / DBT bank account"
        ],
        "official_url": "https://pmaymis.gov.in",
        "source_name": "Ministry of Housing & Urban Affairs — PMAY",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["house", "housing", "home loan", "awas", "affordable housing", "pucca house", "pmay", "home subsidy", "pmay urban"]
    },
    {
        "id": "pm-surya-ghar",
        "service_name": "PM Surya Ghar: Muft Bijli Yojana",
        "category": "Housing",
        "ministry": "Ministry of New and Renewable Energy",
        "description": "Direct central financial subsidy of up to ₹78,000 for installing 1 kW to 3 kW rooftop solar systems, providing up to 300 units of free electricity every month to 1 crore households.",
        "states": ["All"],
        "eligibility": [
            "Indian citizen household owning a residential house with suitable roof space",
            "Possesses a valid residential electricity connection in their name",
            "Must not have availed any previous central solar subsidy"
        ],
        "required_documents": [
            "Electricity bill (showing Consumer / CA number)",
            "Aadhaar card of electricity connection holder",
            "Bank account details (cancelled cheque / passbook)",
            "Roof photograph"
        ],
        "application_steps": [
            "Register on pmsuryaghar.gov.in with State, DISCOM, and Consumer Number",
            "Apply for Rooftop Solar and choose an empanelled vendor",
            "DISCOM provides technical feasibility approval",
            "Vendor installs solar plant and net-meter is installed by DISCOM",
            "Submit commissioning certificate; direct subsidy up to ₹78,000 is credited to bank account within 30 days"
        ],
        "official_url": "https://pmsuryaghar.gov.in",
        "source_name": "Ministry of New & Renewable Energy — PM Surya Ghar",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["surya ghar", "rooftop solar", "free electricity", "solar subsidy", "muft bijli", "solar panel home", "78000 subsidy"]
    },
    {
        "id": "swachh-bharat-toilet",
        "service_name": "Swachh Bharat Mission (IHHL Toilet Subsidy)",
        "category": "Housing",
        "ministry": "Ministry of Jal Shakti / Ministry of Housing & Urban Affairs",
        "description": "Direct cash incentive of ₹12,000 to individual rural and urban households for construction of Individual Household Latrines (IHHL).",
        "states": ["All"],
        "eligibility": [
            "Households without an individual household toilet",
            "Belongs to BPL or identified APL deprived categories (SC/ST, small/marginal farmers, women-headed households)"
        ],
        "required_documents": [
            "Aadhaar card",
            "Bank passbook",
            "Ration Card / BPL card",
            "Photograph of applicant in front of construction site"
        ],
        "application_steps": [
            "Apply online at sbm.gov.in (Gramin) or swachhbharaturban.gov.in (Urban)",
            "Enter personal details, bank account, and toilet location",
            "Gram Panchayat / Urban local body verifies eligibility",
            "Financial incentive of ₹12,000 disbursed via DBT upon geo-tagged photo verification"
        ],
        "official_url": "https://sbm.gov.in",
        "source_name": "Department of Drinking Water & Sanitation — SBM",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["toilet subsidy", "ihhl", "swachh bharat", "12000 toilet assistance", "sanitation subsidy"]
    },

    # ------------------ 6. WOMEN & CHILD WELFARE ------------------
    {
        "id": "wcd-schemes",
        "service_name": "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
        "category": "Women & Child Welfare",
        "ministry": "Ministry of Women & Child Development",
        "description": "Direct Benefit Transfer of ₹5,000 in two instalments for first living child, and ₹6,000 in a single instalment for a second girl child to pregnant women and lactating mothers for improved health and nutrition.",
        "states": ["All"],
        "eligibility": [
            "Pregnant women and lactating mothers for first child and second girl child",
            "Excludes regular central/state government and PSU employees"
        ],
        "required_documents": [
            "Aadhaar card of mother and husband",
            "Mother and Child Protection (MCP) Card / ANC registration details",
            "Bank / Post office passbook of the woman (Aadhaar-linked)",
            "Child birth certificate (for subsequent instalments)"
        ],
        "application_steps": [
            "Register at nearest Anganwadi Centre (AWC) or apply online at pmmvy.wcd.gov.in",
            "Fill Form 1A within 150 days of Last Menstrual Period (LMP) with MCP card",
            "Complete mandatory antenatal check-up (ANC) for instalment verification",
            "Submit Form 1B after institutional delivery and registration of birth",
            "DBT incentive transferred directly into woman's bank account"
        ],
        "official_url": "https://pmmvy.wcd.gov.in",
        "source_name": "Ministry of Women & Child Development — PMMVY",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["woman", "women", "girl child", "daughter", "maternity", "anganwadi", "child welfare", "nutrition scheme", "pregnancy benefit", "mother", "pmmvy"]
    },
    {
        "id": "sukanya-samriddhi",
        "service_name": "Sukanya Samriddhi Yojana (SSY)",
        "category": "Women & Child Welfare",
        "ministry": "Ministry of Finance / Beti Bachao Beti Padhao",
        "description": "Government small-savings scheme for the girl child offering the highest sovereign-backed tax-free interest rate (8.2% p.a.), exempt under Section 80C, with partial withdrawal for higher education at age 18.",
        "states": ["All"],
        "eligibility": [
            "Girl child who is an Indian resident and under 10 years of age on account opening date",
            "Maximum two accounts per family (or three in case of twins/triplets)"
        ],
        "required_documents": [
            "Birth Certificate of the girl child",
            "Identity and Address Proof (Aadhaar/PAN) of the parent/legal guardian",
            "Photographs of child and guardian"
        ],
        "application_steps": [
            "Visit any Post Office branch or authorized public/private commercial bank",
            "Fill the SSY account opening form (Form-1)",
            "Deposit initial minimum amount of ₹250 (max ₹1.5 Lakh/year)",
            "Receive physical SSY passbook to track high-yield tax-free compounding interest"
        ],
        "official_url": "https://www.indiapost.gov.in",
        "source_name": "Department of Posts & Ministry of Finance",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["sukanya", "sukanya samriddhi", "girl child savings", "ssy", "tax free interest", "daughter education fund", "beti bachao"]
    },
    {
        "id": "pm-ujjwala",
        "service_name": "Pradhan Mantri Ujjwala Yojana (PMUY 2.0)",
        "category": "Women & Child Welfare",
        "ministry": "Ministry of Petroleum and Natural Gas",
        "description": "Deposit-free LPG connection along with free first LPG cylinder and double-burner stove to adult women belonging to poor / BPL households across India.",
        "states": ["All"],
        "eligibility": [
            "Adult woman (aged 18+) belonging to BPL/poor household, SC/ST, PMAY beneficiary, or Most Backward Classes (MBC)",
            "No existing LPG connection in the same household"
        ],
        "required_documents": [
            "Aadhaar card of applicant woman and all adult family members",
            "Ration card or BPL certificate proving household composition",
            "Bank passbook (Aadhaar linked) for targeted cylinder subsidy"
        ],
        "application_steps": [
            "Visit pmuy.gov.in or any nearby Indane, Bharatgas, or HP Gas distributor",
            "Fill Ujjwala 2.0 application form with family Aadhaar details",
            "Distributor completes e-KYC and biometric authentication",
            "Collect free new LPG connection, regulator, pipe, stove, and first refill"
        ],
        "official_url": "https://www.pmuy.gov.in",
        "source_name": "Ministry of Petroleum & Natural Gas — PMUY",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["gas cylinder", "ujjwala", "lpg connection", "free gas", "pmuy", "clean cooking fuel", "gas subsidy"]
    },

    # ------------------ 7. BUSINESS, MSME & STARTUPS ------------------
    {
        "id": "udyam",
        "service_name": "Udyam MSME Registration & Subsidy Access",
        "category": "Business & Startups",
        "ministry": "Ministry of Micro, Small & Medium Enterprises",
        "description": "Free, paperless, online government registration for micro, small, and medium businesses to avail priority sector bank loans, collateral-free credit, 50% patent discount, and government tender exemptions.",
        "states": ["All"],
        "eligibility": [
            "Micro: Investment <= ₹1 Crore and Turnover <= ₹5 Crore",
            "Small: Investment <= ₹10 Crore and Turnover <= ₹50 Crore",
            "Medium: Investment <= ₹50 Crore and Turnover <= ₹250 Crore",
            "Proprietor, partner, or director possessing valid Aadhaar"
        ],
        "required_documents": [
            "Aadhaar card of entrepreneur / authorized signatory",
            "PAN card of the business / proprietor",
            "GSTIN (unless exempted by GST laws)",
            "Bank account number and IFSC code"
        ],
        "application_steps": [
            "Visit udyamregistration.gov.in (no official government fee)",
            "Select 'For New Entrepreneurs who are not Registered yet as MSME'",
            "Enter Aadhaar number and name, verify via OTP",
            "PAN details are automatically fetched from CBDT database",
            "Enter enterprise name, business address, bank details, and NIC activity code",
            "Submit declaration to instantly generate permanent Udyam Registration Certificate with QR code"
        ],
        "official_url": "https://udyamregistration.gov.in",
        "source_name": "Ministry of Micro, Small & Medium Enterprises — Udyam",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["business", "startup", "udyam", "msme", "company registration", "small business registration", "mudra loan", "cgtsme", "subsidies"]
    },
    {
        "id": "pm-mudra",
        "service_name": "Pradhan Mantri MUDRA Yojana (PMMY)",
        "category": "Business & Startups",
        "ministry": "Department of Financial Services, Ministry of Finance",
        "description": "Collateral-free micro-credit loans up to ₹20 Lakhs for non-corporate, non-farm micro and small enterprises under Shishu (up to ₹50k), Kishore (₹50k to ₹5L), Tarun (₹5L to ₹10L), and Tarun Plus (up to ₹20L) categories.",
        "states": ["All"],
        "eligibility": [
            "Small business proprietors, shopkeepers, artisans, fruit/vegetable vendors, small manufacturing units",
            "Indian citizen with viable business plan and clean credit history"
        ],
        "required_documents": [
            "Identity Proof (Aadhaar, Voter ID, PAN)",
            "Address Proof (Utility bill, Ration card)",
            "Business registration / Shop & Establishment Certificate",
            "Bank account statements for last 6 months",
            "Quotation of machinery/items to be purchased (for equipment finance)"
        ],
        "application_steps": [
            "Apply online at udyamimitra.in or visit any Public/Private sector bank branch or NBFC",
            "Choose loan category (Shishu, Kishore, or Tarun)",
            "Submit MUDRA loan application form with business proposal",
            "Bank evaluates proposal and sanctions collateral-free loan",
            "Borrower receives MUDRA Card (debit card) for hassle-free working capital drawal"
        ],
        "official_url": "https://www.mudra.org.in",
        "source_name": "MUDRA / Department of Financial Services",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["mudra loan", "business loan", "collateral free loan", "shopkeeper loan", "startup loan", "shishu kishore tarun", "micro enterprise loan", "udyamimitra"]
    },
    {
        "id": "pm-vishwakarma",
        "service_name": "PM Vishwakarma Scheme (Artisans & Craftspeople)",
        "category": "Business & Startups",
        "ministry": "Ministry of Micro, Small & Medium Enterprises",
        "description": "End-to-end support for 18 traditional trades (carpenters, blacksmiths, goldsmiths, potters, cobblers, tailors, sculptors) offering recognition, ₹15,000 modern toolkit grant, skill training with ₹500/day stipend, and collateral-free loans up to ₹3 Lakh at 5% interest.",
        "states": ["All"],
        "eligibility": [
            "Artisan / craftsperson working with hands and tools in one of the 18 specified family-based traditional trades",
            "Minimum age 18 years; only one member per family"
        ],
        "required_documents": [
            "Aadhaar card",
            "Mobile number",
            "Bank passbook copy",
            "Ration card"
        ],
        "application_steps": [
            "Visit nearest Common Service Centre (CSC) for free PM Vishwakarma registration",
            "Biometric authentication and trade selection",
            "Gram Panchayat / Urban Local Body verifies trade identity",
            "Undergo 5-7 days basic skill training with ₹500 daily stipend",
            "Receive digital PM Vishwakarma Certificate, ID card, ₹15,000 e-voucher for toolkit, and collateral-free enterprise loan"
        ],
        "official_url": "https://pmvishwakarma.gov.in",
        "source_name": "Ministry of MSME — PM Vishwakarma",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["vishwakarma", "artisan loan", "carpenter", "blacksmith", "tailor loan", "toolkit grant", "pm vishwakarma", "traditional craftsmen"]
    },
    {
        "id": "pmegp-subsidy",
        "service_name": "PMEGP — Prime Minister's Employment Generation Programme",
        "category": "Business & Startups",
        "ministry": "Ministry of Micro, Small and Medium Enterprises / KVIC",
        "description": "Credit-linked government subsidy scheme providing 15% to 35% government capital subsidy on bank-financed project costs up to ₹50 Lakhs for manufacturing units and ₹20 Lakhs for service enterprises.",
        "states": ["All"],
        "eligibility": [
            "Any individual above 18 years of age (minimum 8th pass for manufacturing projects above ₹10 Lakhs)",
            "Self-Help Groups, Co-operative Societies, and Charitable Trusts"
        ],
        "required_documents": [
            "Aadhaar card and PAN card",
            "Detailed Project Report (DPR)",
            "Educational qualification certificate",
            "Caste / Special category certificate (for higher 25-35% subsidy)"
        ],
        "application_steps": [
            "Apply online on the PMEGP e-portal (kviconline.gov.in/pmegpeportal)",
            "Fill applicant details and upload DPR & project cost breakdown",
            "District Level Task Force Committee (DLTFC) scrutinizes application and forwards to preferred financing bank",
            "Bank sanctions loan and KVIC deposits the margin money subsidy into locked escrow account for 3 years"
        ],
        "official_url": "https://www.kviconline.gov.in/pmegpeportal",
        "source_name": "Khadi and Village Industries Commission (KVIC)",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["pmegp", "kvic loan", "business subsidy", "manufacturing loan subsidy", "self employment scheme", "start factory loan"]
    },

    # ------------------ 8. EMPLOYMENT & LABOUR ------------------
    {
        "id": "eshram",
        "service_name": "e-Shram — National Unorganised Workers Database",
        "category": "Employment & Labour",
        "ministry": "Ministry of Labour & Employment",
        "description": "National registration portal creating a unified database for unorganised sector workers, providing a 12-digit Universal Account Number (UAN) with accidental insurance and social security linkages.",
        "states": ["All"],
        "eligibility": [
            "Worker in unorganised sector (construction, domestic work, agriculture, street vending, gig workers)",
            "Age between 16 and 59 years",
            "Must NOT be a member of EPFO/ESIC or an income tax payer"
        ],
        "required_documents": [
            "Aadhaar card",
            "Aadhaar-linked active mobile number",
            "Savings bank account number with IFSC code"
        ],
        "application_steps": [
            "Go to eshram.gov.in and click 'Register on e-Shram'",
            "Enter Aadhaar-linked mobile number and captcha, verify OTP",
            "Fill personal details, residential address, education, and occupation code",
            "Provide bank account details for direct benefit transfers",
            "Preview and submit declaration",
            "Download instant e-Shram Card with photo and UAN"
        ],
        "official_url": "https://eshram.gov.in",
        "source_name": "Ministry of Labour & Employment — e-Shram",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["job", "employment", "worker", "unorganised", "shram", "daily wage worker", "gig worker", "labour card", "eshram", "labour welfare", "migrant worker"]
    },
    {
        "id": "pm-svanidhi",
        "service_name": "PM SVANidhi — Street Vendor Special Micro-Credit",
        "category": "Employment & Labour",
        "ministry": "Ministry of Housing and Urban Affairs",
        "description": "Special micro-credit facility providing affordable collateral-free working capital loans of ₹10,000 (1st tranche), ₹20,000 (2nd tranche), and ₹50,000 (3rd tranche) with 7% interest subsidy and cashback on digital transactions for urban street vendors.",
        "states": ["All"],
        "eligibility": [
            "Urban street vendors, hawkers, thelawalas vending in urban areas",
            "Vendors holding Certificate of Vending (CoV) / Identity Card or Letter of Recommendation (LoR) from Urban Local Body"
        ],
        "required_documents": [
            "Aadhaar card",
            "Vending Certificate / Identity Card or Letter of Recommendation (LoR)",
            "Bank savings account passbook",
            "Mobile number linked to Aadhaar"
        ],
        "application_steps": [
            "Visit pmsvanidhi.mohua.gov.in or apply via local Urban Local Body (ULB) / CSC",
            "Login with mobile number and verify via Aadhaar OTP",
            "Select ULB and upload Certificate of Vending or apply for LoR",
            "Select preferred lending institution (LBS bank, cooperative bank, NBFC)",
            "Bank verifies and disburses ₹10,000 working capital within 7-14 days without collateral",
            "Timely repayment unlocks next tranche of ₹20,000 and ₹50,000 with 7% interest subsidy credited directly to bank"
        ],
        "official_url": "https://pmsvanidhi.mohua.gov.in",
        "source_name": "Ministry of Housing & Urban Affairs — PM SVANidhi",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["street vendor", "hawker", "svanidhi", "thelawala", "working capital loan", "vendor subsidy", "micro loan", "pm svanidhi"]
    },
    {
        "id": "mgnrega",
        "service_name": "MGNREGA — Mahatma Gandhi National Rural Employment Guarantee",
        "category": "Employment & Labour",
        "ministry": "Ministry of Rural Development",
        "description": "Guarantees at least 100 days of wage employment in a financial year to every rural household whose adult members volunteer to do unskilled manual work with direct statutory minimum wage payments into bank accounts.",
        "states": ["All"],
        "eligibility": [
            "Adult members of rural households willing to do unskilled manual labour",
            "Residing in rural Gram Panchayat area"
        ],
        "required_documents": [
            "Aadhaar card",
            "Proof of residence in Gram Panchayat",
            "Passport-size photographs of all adult household applicants",
            "Aadhaar-linked Bank / Post Office passbook"
        ],
        "application_steps": [
            "Apply in writing or orally to Gram Panchayat for Job Card",
            "Gram Panchayat conducts verification and issues Job Card within 15 days",
            "Submit application for work demand to Gram Panchayat / Programme Officer",
            "Work must be provided within 15 days of demand; otherwise entitled to daily unemployment allowance",
            "Wages credited weekly directly to Aadhaar-enabled bank account"
        ],
        "official_url": "https://nrega.nic.in",
        "source_name": "Ministry of Rural Development — MGNREGA",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["mgnrega", "nrega", "job card", "100 days work", "rural employment", "manual labour wages", "gram panchayat work"]
    },
    {
        "id": "pmkvy-skills",
        "service_name": "Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0)",
        "category": "Employment & Labour",
        "ministry": "Ministry of Skill Development and Entrepreneurship",
        "description": "Government skill development certification scheme offering free industry-relevant technical training, soft skills, and digital literacy across 30+ sectors with government certification and job placement assistance.",
        "states": ["All"],
        "eligibility": [
            "Indian youth who are school/college dropouts or unemployed seeking marketable industry skills",
            "Possessing valid Aadhaar and bank account"
        ],
        "required_documents": [
            "Aadhaar card / Voter ID",
            "Bank passbook",
            "Education qualification mark sheets"
        ],
        "application_steps": [
            "Visit skillindiadigital.gov.in or pmkvyofficial.org",
            "Find nearest authorized Training Centre by location and job sector (e.g. IT, Automotive, Healthcare, Solar)",
            "Enroll in Short Term Training (STT) or Recognition of Prior Learning (RPL)",
            "Complete free training, pass assessment exam to get Skill India National Certificate and placement support"
        ],
        "official_url": "https://www.pmkvyofficial.org",
        "source_name": "National Skill Development Corporation (NSDC)",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["pmkvy", "skill development", "free training", "skill india", "job placement training", "vocational course"]
    },

    # ------------------ 9. IDENTITY, CITIZEN CERTIFICATES & TRANSPORT ------------------
    {
        "id": "uidai-aadhaar",
        "service_name": "Aadhaar Services (UIDAI Enrolment & Update)",
        "category": "Aadhaar & Identity",
        "ministry": "Unique Identification Authority of India (UIDAI)",
        "description": "Government service to enrol for a 12-digit unique Aadhaar identity or update demographic details (address, mobile, email, name) and biometric data (fingerprints, iris, photo).",
        "states": ["All"],
        "eligibility": [
            "Resident of India who has resided for 182 days or more in the preceding 12 months",
            "All age groups from newborns (Baal Aadhaar) to senior citizens"
        ],
        "required_documents": [
            "Proof of Identity (POI) - PAN, Passport, Voter ID, Ration card",
            "Proof of Address (POA) - Electricity bill, Water bill, Rent agreement, Bank passbook",
            "Proof of Date of Birth (PDB) - Birth certificate, SSLC book"
        ],
        "application_steps": [
            "Book an online appointment at appointments.uidai.gov.in or visit Aadhaar Seva Kendra",
            "Fill standard enrolment / update form",
            "Submit original POI/POA documents for scanning",
            "Provide biometric capture (fingerprints, iris, facial photograph)",
            "Collect acknowledgement slip containing 28-digit Enrolment ID (EID)",
            "Download updated e-Aadhaar from myaadhaar.uidai.gov.in within 3 to 15 days"
        ],
        "official_url": "https://uidai.gov.in",
        "source_name": "Unique Identification Authority of India (UIDAI)",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["aadhaar", "aadhar", "uid", "identity proof", "biometric update", "address update", "phone link aadhaar", "pvc aadhaar", "myaadhaar"]
    },
    {
        "id": "pan-services",
        "service_name": "Instant e-PAN & PAN Card Services",
        "category": "Government Certificates",
        "ministry": "Income Tax Department, Ministry of Finance",
        "description": "Paperless, real-time facility to generate a 10-digit alphanumeric Permanent Account Number (PAN) in PDF format within 10 minutes using Aadhaar e-KYC free of cost.",
        "states": ["All"],
        "eligibility": [
            "Individual who has never been allotted a PAN",
            "Possesses a valid Aadhaar linked to an active mobile number",
            "Date of birth in Aadhaar must have full DD/MM/YYYY format",
            "Must not be a minor on the date of application for instant e-PAN"
        ],
        "required_documents": [
            "Aadhaar card",
            "Aadhaar-linked mobile phone (for 6-digit OTP verification)"
        ],
        "application_steps": [
            "Open incometax.gov.in and click 'Instant e-PAN'",
            "Select 'Get New e-PAN' and enter 12-digit Aadhaar number",
            "Accept consent and submit OTP received on Aadhaar-linked mobile",
            "Validate Aadhaar details displayed on screen",
            "Submit PAN request and receive Acknowledgement Number",
            "Download digitally signed e-PAN PDF within minutes"
        ],
        "official_url": "https://www.incometax.gov.in/iec/foportal/",
        "source_name": "Income Tax Department, Government of India",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["pan card", "pan", "income tax id", "permanent account number", "e-pan", "tax filing", "apply pan"]
    },
    {
        "id": "driving-licence",
        "service_name": "Driving Licence Services (Sarathi Parivahan)",
        "category": "Driving Licence & Transport",
        "ministry": "Ministry of Road Transport & Highways",
        "description": "End-to-end portal for Learner's Licence (LL) application, online LL exam, permanent Driving Licence (DL) test slot booking, renewal, and international driving permit.",
        "states": ["All"],
        "eligibility": [
            "Age 16+ for gearless two-wheeler up to 50cc (with parental consent)",
            "Age 18+ for private light motor vehicles (car/motorcycle with gear)",
            "Age 20+ for commercial transport vehicles",
            "Must pass the online/in-person learner knowledge test"
        ],
        "required_documents": [
            "Aadhaar card / Proof of Identity",
            "Address proof (Utility bill, Ration card, Passport)",
            "Age proof (Birth certificate, 10th marksheet, PAN)",
            "Passport-size photograph & signature",
            "Form 1A Medical Certificate (for commercial / age 40+)"
        ],
        "application_steps": [
            "Visit parivahan.gov.in and select Sarathi Services -> Select State",
            "Apply online for 'Learner's Licence' using Aadhaar authentication (contactless)",
            "Take online learner's test from home or RTO",
            "Download Learner's Licence immediately after passing",
            "After mandatory 30-day waiting period, book practical driving test slot",
            "Appear at RTO with vehicle for driving skill test to get permanent DL card"
        ],
        "official_url": "https://parivahan.gov.in",
        "source_name": "Ministry of Road Transport & Highways — Parivahan Sewa",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["driving licence", "driving license", "learner licence", "vehicle", "dl renewal", "rto", "parivahan", "sarathi", "ll test", "transport"]
    },
    {
        "id": "passport-seva",
        "service_name": "Passport Seva (Ministry of External Affairs)",
        "category": "Government Certificates",
        "ministry": "Ministry of External Affairs",
        "description": "Comprehensive portal to apply for fresh Indian Passport, Tatkaal passport, re-issue, Police Clearance Certificate (PCC), and track appointment at PSK / POPSK centres.",
        "states": ["All"],
        "eligibility": [
            "Citizen of India by birth or naturalization"
        ],
        "required_documents": [
            "Proof of Date of Birth (Birth certificate, 10th marksheet, Aadhaar, PAN)",
            "Proof of Present Address (Aadhaar, Electricity bill, Water bill, Bank passbook)",
            "Non-ECR proof (Matriculation 10th certificate or higher degree / Income tax payee)"
        ],
        "application_steps": [
            "Register on passportindia.gov.in and login",
            "Fill online application for Fresh / Re-issue of Passport",
            "Pay online fee and schedule appointment at nearest Passport Seva Kendra (PSK / POPSK)",
            "Visit PSK with original documents for biometric capture and document verification",
            "Police verification is initiated and passport is delivered securely via India Post Speed Post"
        ],
        "official_url": "https://www.passportindia.gov.in",
        "source_name": "Ministry of External Affairs — Consular, Passport & Visa Division",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["passport", "passport seva", "indian passport", "tatkaal passport", "pcc", "psk appointment", "mea"]
    },
    {
        "id": "voter-services",
        "service_name": "Voter ID Services (ECI Election Commission of India)",
        "category": "Aadhaar & Identity",
        "ministry": "Election Commission of India",
        "description": "Apply for new Voter ID (Form 6), overseas elector registration (Form 6A), Aadhaar-EPIC linking (Form 6B), deletion/objection (Form 7), and shifting of residence / correction (Form 8).",
        "states": ["All"],
        "eligibility": [
            "Indian citizen who has attained 18 years of age on the qualifying date (Jan 1, Apr 1, Jul 1, Oct 1)",
            "Ordinary resident in the constituency"
        ],
        "required_documents": [
            "Passport size photograph",
            "Age proof (Aadhaar, PAN, Birth certificate, 10th marksheet)",
            "Address proof (Aadhaar, Bank passbook, Ration card, Electricity bill)"
        ],
        "application_steps": [
            "Visit voters.eci.gov.in or download the Voter Helpline App",
            "Fill Form 6 for New Registration of General Elector",
            "Upload photograph, age proof, and address proof",
            "Booth Level Officer (BLO) visits residence for field verification",
            "Electoral Registration Officer (ERO) approves entry; download digital e-EPIC and receive physical PVC EPIC card by Speed Post"
        ],
        "official_url": "https://voters.eci.gov.in",
        "source_name": "Election Commission of India (ECI)",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["voter id", "epic card", "form 6", "election commission", "voters portal", "vote registration", "eci"]
    },
    {
        "id": "ration-card",
        "service_name": "Ration Card & NFSA Food Security",
        "category": "Food & Ration",
        "ministry": "Department of Food & Public Distribution",
        "description": "Issue of Antyodaya Anna Yojana (AAY) and Priority Household (PHH) ration cards for subsidised foodgrain distribution with nationwide portability under One Nation One Ration Card (ONORC).",
        "states": ["All"],
        "eligibility": [
            "Household residing in state meeting state-notified NFSA economic criteria",
            "Does not possess an existing valid ration card in another household",
            "Family members having verified Aadhaar linkages"
        ],
        "required_documents": [
            "Aadhaar cards of all family members to be listed",
            "Proof of current residential address",
            "Income certificate / BPL certificate",
            "Family group photograph",
            "Bank passbook of female head of household"
        ],
        "application_steps": [
            "Go to nfsa.gov.in or respective state Food & Civil Supplies portal",
            "Submit online application form with family member details and Aadhaar",
            "Upload scanned documents and address verification",
            "Field inspection and social audit by Taluka Supply Officer (TSO) / Inspector",
            "Approval and digital Ration Card generation",
            "Collect foodgrains from any Fair Price Shop (FPS) across India via biometric authentication"
        ],
        "official_url": "https://nfsa.gov.in",
        "source_name": "Department of Food & Public Distribution — NFSA",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["ration card", "ration", "food security", "pds", "subsidised food", "one nation one ration card", "onorc", "wheat", "rice", "bpl card"]
    },
    {
        "id": "digilocker",
        "service_name": "DigiLocker — National Digital Document Wallet",
        "category": "Government Certificates",
        "ministry": "Ministry of Electronics & Information Technology (MeitY)",
        "description": "Official cloud document wallet under Digital India providing 1 GB of secure cloud storage and instant verification of over 5.6 billion legally valid issued documents (driving licence, Aadhaar, marksheets, vehicle RC, caste certificates).",
        "states": ["All"],
        "eligibility": [
            "Any Indian citizen possessing an active mobile number and Aadhaar"
        ],
        "required_documents": [
            "Aadhaar card",
            "Mobile number linked to Aadhaar (for OTP)"
        ],
        "application_steps": [
            "Download DigiLocker app from App Store / Play Store or visit digilocker.gov.in",
            "Sign up using mobile number and set a 6-digit security PIN",
            "Link 12-digit Aadhaar to auto-discover documents issued by state and central bodies",
            "Search for specific issuer (e.g. CBSE, State Education Board, State Transport, UIDAI)",
            "Enter registration / roll / policy number to fetch digitally signed certificate",
            "Issued documents are legally equivalent to original physical documents under Rule 9A of IT Rules 2016"
        ],
        "official_url": "https://www.digilocker.gov.in",
        "source_name": "Ministry of Electronics & IT — DigiLocker",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["certificate", "digilocker", "digital documents", "store documents", "birth certificate", "marksheet storage", "driving license digital", "vehicle rc", "10th marksheet"]
    },

    # ------------------ 10. DISABILITY & DIVYANGJAN SERVICES ------------------
    {
        "id": "udid-disability",
        "service_name": "Unique Disability ID (UDID / Swavlamban)",
        "category": "Disability Services",
        "ministry": "Department of Empowerment of Persons with Disabilities",
        "description": "Unified digital identity card and national database for Persons with Disabilities (PwD) enabling seamless cross-state access to travel concessions, pensions, assistive aids, and reservations.",
        "states": ["All"],
        "eligibility": [
            "Person with 40% or more benchmark disability in any of the 21 categories recognized under the Rights of Persons with Disabilities (RPwD) Act 2016"
        ],
        "required_documents": [
            "Aadhaar card or voter ID",
            "Passport-size photograph and specimen signature/thumb impression",
            "Disability certificate issued by competent Medical Board (if existing)"
        ],
        "application_steps": [
            "Register online at swavlambancard.gov.in",
            "Fill demographic details, education, employment, and disability details",
            "Upload photograph, identity proof, and address proof",
            "System assigns an appointment at District Hospital / Medical Board",
            "Attend medical assessment examination",
            "Medical Board approves disability percentage; downloadable e-UDID generated and plastic smartcard delivered by post"
        ],
        "official_url": "https://www.swavlambancard.gov.in",
        "source_name": "Department of Empowerment of Persons with Disabilities — UDID",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["disability", "disabled", "divyang", "udid", "disability certificate", "disability id", "swavlamban", "wheelchair", "hearing aid", "pwd reservation"]
    },
    {
        "id": "adip-scheme",
        "service_name": "ADIP Scheme (Free Assistive Devices & Artificial Limbs)",
        "category": "Disability Services",
        "ministry": "Ministry of Social Justice and Empowerment / ALIMCO",
        "description": "Provides free motorized tricycles, wheelchairs, hearing aids, braille kits, prosthetics, and cochlear implants to needy persons with disabilities.",
        "states": ["All"],
        "eligibility": [
            "Indian citizen with 40% or more benchmark disability (holding UDID card / Medical certificate)",
            "Monthly family income up to ₹20,000 for 100% free aids; ₹20,001 to ₹30,000 for 50% subsidy"
        ],
        "required_documents": [
            "UDID Card / Disability Certificate",
            "Income certificate / BPL Card",
            "Aadhaar Card",
            "Photograph showing disability"
        ],
        "application_steps": [
            "Register online at adip.disabilityaffairs.gov.in or attend district ALIMCO assessment camp",
            "Submit medical and income verification",
            "Assessment team fits and customizes required assistive device",
            "Free distribution of assistive aid at mega distribution camp"
        ],
        "official_url": "https://adip.disabilityaffairs.gov.in",
        "source_name": "Department of Empowerment of Persons with Disabilities / ALIMCO",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["adip", "wheelchair free", "hearing aid subsidy", "artificial limbs", "alimco", "divyang aid"]
    },

    # ------------------ 11. GRIEVANCE, RTI & LEGAL AID ------------------
    {
        "id": "cpgrams",
        "service_name": "CPGRAMS — Centralised Public Grievance Redress",
        "category": "Grievance & Redressal",
        "ministry": "Department of Administrative Reforms and Public Grievances (DARPG)",
        "description": "24x7 online single-window portal enabling citizens to lodge grievances, track action taken, appeal unsatisfactory resolutions, and escalate unresolved complaints across 90+ central ministries and all state governments.",
        "states": ["All"],
        "eligibility": [
            "Any Indian citizen having a genuine grievance against government service delivery, delay, corruption, or denial of statutory benefit"
        ],
        "required_documents": [
            "Details of previous reference number / application number",
            "Copy of previous correspondence or rejection notice (if any)",
            "Clear timeline of events and department name"
        ],
        "application_steps": [
            "Visit pgportal.gov.in and login or register as a citizen",
            "Click 'Lodge Public Grievance'",
            "Select target Ministry / Department / State Government from hierarchical menu",
            "Enter clear description of grievance (up to 2000 characters) and attach supporting PDF",
            "Submit to generate unique Registration Number (e.g., DARPG/E/2026/00123)",
            "Department designated Public Grievance Officer must respond within 30 days; if unsatisfied, file Appeal to Appellate Authority within 30 days"
        ],
        "official_url": "https://pgportal.gov.in",
        "source_name": "Department of Administrative Reforms & Public Grievances (DARPG)",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["complaint", "grievance", "pending", "delay", "not responding", "rejected application", "escalate", "pgportal", "cpgrams", "harassment", "bribe", "officer not replying"]
    },
    {
        "id": "rti-online",
        "service_name": "RTI Online — Right to Information Filing Portal",
        "category": "Grievance & Redressal",
        "ministry": "Department of Personnel and Training (DoPT)",
        "description": "Electronic single window for Indian citizens to file online RTI applications and first appeals to any Central Government Ministry, Department, or Public Authority with nominal ₹10 fee.",
        "states": ["All"],
        "eligibility": [
            "Citizen of India seeking information from Public Authorities under RTI Act, 2005",
            "BPL cardholders are completely exempt from application fees"
        ],
        "required_documents": [
            "BPL certificate / Ration card (only if seeking fee exemption); no document required for general citizens"
        ],
        "application_steps": [
            "Visit rtionline.gov.in and click 'Submit Request'",
            "Select the Ministry / Department / Public Authority from dropdown",
            "Type specific information request text (up to 3000 characters) and attach supporting PDF",
            "Pay ₹10 application fee via UPI, Net Banking, or Debit Card (free for BPL)",
            "Public Information Officer (PIO) is statutorily mandated to reply within 30 days (48 hours for life and liberty matters)"
        ],
        "official_url": "https://rtionline.gov.in",
        "source_name": "Department of Personnel and Training (DoPT)",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["rti", "right to information", "rti online", "file rti", "government transparency", "public information officer", "first appeal rti"]
    },
    {
        "id": "tele-law",
        "service_name": "Tele-Law — Free Legal Advice for Citizens",
        "category": "Grievance & Redressal",
        "ministry": "Department of Justice, Ministry of Law and Justice",
        "description": "Provides free, direct video-conference and telephone legal advice from Panel Lawyers to marginalized, rural, and underprivileged citizens through local Common Service Centres (CSC).",
        "states": ["All"],
        "eligibility": [
            "Free legal advice for Women, Children, SC/ST, Divyangjan, Victims of trafficking/disaster, Industrial workmen, and Persons with annual income under ₹3 Lakh"
        ],
        "required_documents": [
            "Aadhaar card",
            "Category certificate / Income proof (for free eligibility verification)"
        ],
        "application_steps": [
            "Visit nearest Common Service Centre (CSC) or download the Tele-Law Mobile App",
            "Register basic details and select legal dispute category (property, marriage, labour, criminal, dowry, consumer)",
            "Book an online appointment with the designated Panel Lawyer",
            "Consult with the advocate via video call or telephone at CSC",
            "Get official pre-litigation legal advice and document review"
        ],
        "official_url": "https://www.tele-law.in",
        "source_name": "Department of Justice — Ministry of Law & Justice",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["tele law", "free lawyer", "legal aid", "nalso", "court advice", "free legal consultation", "dispute advice"]
    },

    # ------------------ 12. UMBRELLA SINGLE-WINDOW PLATFORMS ------------------
    {
        "id": "umang",
        "service_name": "UMANG (Unified Mobile App for New-age Governance)",
        "category": "All-in-One Portals",
        "ministry": "Ministry of Electronics & Information Technology (MeitY)",
        "description": "Unified platform aggregating over 1,500+ central and state government services in 13 Indian languages — encompassing EPF passbook, utility bills, gas booking, scholarships, passport services, and farmer schemes in one app.",
        "states": ["All"],
        "eligibility": [
            "All Indian citizens, students, farmers, youth, and senior citizens"
        ],
        "required_documents": [
            "Mobile number for account creation",
            "Aadhaar (optional for advanced unified services like DigiLocker & EPFO integration)"
        ],
        "application_steps": [
            "Download UMANG app or visit web.umang.gov.in",
            "Register using mobile number and configure MPIN or biometric login",
            "Browse categories: Education, Agriculture, Health, Bills & Utilities, Employment, Social Welfare",
            "Select specific department service (e.g. View EPF Passbook, Bharat BillPay)",
            "Complete service transaction directly without visiting separate department portals"
        ],
        "official_url": "https://web.umang.gov.in",
        "source_name": "Ministry of Electronics & IT — UMANG",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["umang", "multiple government services app", "one app government", "mobile governance", "epf passbook", "electricity bill", "gas booking"]
    },
    {
        "id": "myscheme",
        "service_name": "MyScheme — Government Scheme Discovery Engine",
        "category": "All-in-One Portals",
        "ministry": "National e-Governance Division (NeGD)",
        "description": "National scheme discovery portal indexing 1,000+ government welfare schemes with an intuitive eligibility filter helping citizens identify every benefit they qualify for across all life stages.",
        "states": ["All"],
        "eligibility": [
            "Any citizen looking to discover schemes matching their demographic and financial profile"
        ],
        "required_documents": [
            "No documents needed for discovery; specific scheme pages list necessary application requirements"
        ],
        "application_steps": [
            "Visit myscheme.gov.in",
            "Click 'Find Schemes For You'",
            "Enter age, gender, state of residence, caste category, employment, and income",
            "System calculates eligibility and outputs tailored list of central and state schemes",
            "Click on any scheme for comprehensive breakdown and direct link to official applying portal"
        ],
        "official_url": "https://www.myscheme.gov.in",
        "source_name": "National Government Services Portal — MyScheme",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["myscheme", "find scheme", "which scheme applies to me", "scheme discovery", "welfare benefits", "central schemes", "state schemes"]
    },
    {
        "id": "india-gov",
        "service_name": "India.gov.in — National Portal of India",
        "category": "All-in-One Portals",
        "ministry": "National Informatics Centre (NIC)",
        "description": "The umbrella national portal indexing government websites, services and information across ministries and states.",
        "states": ["All"],
        "eligibility": [
            "Any citizen"
        ],
        "required_documents": ["None"],
        "application_steps": [
            "Visit india.gov.in",
            "Use the directory to locate the correct department/ministry website",
            "Follow through to the department's own official service page"
        ],
        "official_url": "https://www.india.gov.in",
        "source_name": "National Informatics Centre — National Portal of India",
        "last_verified": "2026-06-15",
        "confidence": "High",
        "keywords": ["india.gov.in", "national portal", "government directory"]
    }
]

PLATFORMS = [
    {
        "id": "umang",
        "name": "UMANG",
        "purpose": "All-in-One Unified Governance App",
        "description": "Access 1,500+ central and state government services from one secure mobile and web portal including PF claims, utilities, and citizen certificates.",
        "url": "https://web.umang.gov.in",
        "source": "Ministry of Electronics & IT (MeitY)"
    },
    {
        "id": "digilocker",
        "name": "DigiLocker",
        "purpose": "Digital Document Wallet & Verifier",
        "description": "Store, access, and digitally share 5.6+ billion verified government documents (Aadhaar, Driving Licence, Marksheets, Caste certificates) with 100% legal validity.",
        "url": "https://www.digilocker.gov.in",
        "source": "Ministry of Electronics & IT (MeitY)"
    },
    {
        "id": "myscheme",
        "name": "MyScheme",
        "purpose": "National Welfare Scheme Discovery Engine",
        "description": "Discover eligible government schemes and subsidies across all central ministries and state departments using conversational profile filters.",
        "url": "https://www.myscheme.gov.in",
        "source": "National e-Governance Division (NeGD)"
    },
    {
        "id": "india-gov",
        "name": "India.gov.in",
        "purpose": "National Government Services Directory",
        "description": "The official single-window portal providing structured access to every government ministry, department, legislative act, and citizen service across India.",
        "url": "https://www.india.gov.in",
        "source": "National Informatics Centre (NIC)"
    },
    {
        "id": "cpgrams",
        "name": "CPGRAMS",
        "purpose": "Public Grievance Redressal & Escalation",
        "description": "24x7 online grievance portal to lodge, track, and escalate complaints against any central or state government department with mandatory 30-day resolution.",
        "url": "https://pgportal.gov.in",
        "source": "Department of Administrative Reforms & Public Grievances (DARPG)"
    },
    {
        "id": "nsp",
        "name": "National Scholarship Portal",
        "purpose": "Single-Window Scholarship Hub",
        "description": "Common electronic application platform for hundreds of central, UGC, AICTE, and state scholarship schemes disbursing funds via Aadhaar DBT.",
        "url": "https://scholarships.gov.in",
        "source": "Ministry of Education"
    }
]

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS services (
        id TEXT PRIMARY KEY,
        service_name TEXT NOT NULL,
        category TEXT NOT NULL,
        ministry TEXT,
        description TEXT NOT NULL,
        states TEXT NOT NULL,
        eligibility TEXT NOT NULL,
        required_documents TEXT NOT NULL,
        application_steps TEXT NOT NULL,
        official_url TEXT NOT NULL,
        source_name TEXT NOT NULL,
        last_verified TEXT NOT NULL,
        confidence TEXT NOT NULL,
        keywords TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS saved_services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        service_id TEXT NOT NULL,
        user_token TEXT NOT NULL,
        status TEXT DEFAULT 'Saved',
        notes TEXT,
        saved_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(service_id, user_token)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS activity_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_token TEXT NOT NULL,
        action_type TEXT NOT NULL,
        title TEXT NOT NULL,
        details TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS grievance_cases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token_id TEXT NOT NULL,
        department TEXT NOT NULL,
        scheme_name TEXT,
        issue_type TEXT NOT NULL,
        description TEXT NOT NULL,
        ref_number TEXT,
        days_pending INTEGER DEFAULT 0,
        suggested_action TEXT,
        draft_letter TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS verification_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        service_id TEXT NOT NULL,
        verified_by TEXT NOT NULL,
        verification_date TEXT NOT NULL,
        status TEXT NOT NULL,
        notes TEXT
    )
    """)

    # Seed or Upsert all DEFAULT_SERVICES
    for s in DEFAULT_SERVICES:
        cursor.execute("""
        INSERT INTO services (
            id, service_name, category, ministry, description, states,
            eligibility, required_documents, application_steps,
            official_url, source_name, last_verified, confidence, keywords
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            service_name = excluded.service_name,
            category = excluded.category,
            ministry = excluded.ministry,
            description = excluded.description,
            states = excluded.states,
            eligibility = excluded.eligibility,
            required_documents = excluded.required_documents,
            application_steps = excluded.application_steps,
            official_url = excluded.official_url,
            source_name = excluded.source_name,
            confidence = excluded.confidence,
            keywords = excluded.keywords
        """, (
            s["id"],
            s["service_name"],
            s["category"],
            s.get("ministry", ""),
            s["description"],
            json.dumps(s["states"]),
            json.dumps(s["eligibility"]),
            json.dumps(s["required_documents"]),
            json.dumps(s["application_steps"]),
            s["official_url"],
            s["source_name"],
            s["last_verified"],
            s["confidence"],
            json.dumps(s["keywords"])
        ))

    conn.commit()
    conn.close()

init_db()
