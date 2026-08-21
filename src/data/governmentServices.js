// Comprehensive Verified Indian Government Knowledge Base for Sahayak AI
// Covers Education, Identity, Social Welfare, Certificates, Employment, and Healthcare

export const GOVERNMENT_SERVICES = [
  {
    id: "edu-mahadbt-post-matric",
    name: "Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC Scholarship)",
    category: "Education",
    department: "Higher and Technical Education Department",
    state: "Maharashtra",
    description: "Financial assistance for students pursuing professional courses (Engineering, Medical, Architecture, Pharmacy, Management) in Maharashtra whose family annual income is up to ₹8 Lakhs.",
    eligibility: [
      { field: "state", label: "State", condition: "equals", requiredValue: "Maharashtra", help: "Must be a domicile of Maharashtra" },
      { field: "course", label: "Course", condition: "contains", requiredValue: ["Engineering", "Medical", "Pharmacy", "Management", "Polytechnic", "Degree"], help: "Approved professional degree/diploma courses" },
      { field: "income", label: "Annual Family Income", condition: "max", requiredValue: 800000, help: "Family income must be below ₹8,00,000 per annum" },
      { field: "user_type", label: "User Type", condition: "equals", requiredValue: "Student", help: "Must be currently enrolled student" }
    ],
    documents: [
      "Domicile Certificate of Maharashtra",
      "Current Year Income Certificate (issued by Tehsildar)",
      "CAP Allotment Letter / Admission Confirmation",
      "Mark Sheets of 10th, 12th & Previous Semester",
      "Aadhaar Card linked with Bank Account (NPCI Seeding)",
      "Fee Receipt of Current Academic Year"
    ],
    steps: [
      "Step 1: Register on the MahaDBT Portal (mahadbt.maharashtra.gov.in) using Aadhaar-linked mobile number.",
      "Step 2: Complete Profile creation (Personal details, Address, Income, Qualification, Course & Hostel details).",
      "Step 3: Select 'Post Matric Scholarship' under Higher Education Department.",
      "Step 4: Choose 'Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna'.",
      "Step 5: Upload mandatory scanned documents in PDF format (100KB–250KB).",
      "Step 6: Submit application and note down the Application Reference ID.",
      "Step 7: Submit physical copy of application along with documents to your College Scholarship Clerk."
    ],
    official_url: "https://mahadbt.maharashtra.gov.in",
    source_name: "Aaple Sarkar MahaDBT Portal (Official Govt. of Maharashtra)",
    last_verified: "2026-08-15",
    is_verified_official: true
  },
  {
    id: "edu-nsp-pragati",
    name: "AICTE Pragati Scholarship Scheme for Girl Students",
    category: "Education",
    department: "Ministry of Education / AICTE",
    state: "All India",
    description: "Financial assistance of ₹50,000 per annum to meritorious girl students pursuing technical education (Degree & Diploma) in AICTE approved institutions.",
    eligibility: [
      { field: "gender", label: "Gender", condition: "equals", requiredValue: "Female", help: "Exclusively for girl students" },
      { field: "course", label: "Course", condition: "contains", requiredValue: ["Engineering", "Technology", "Diploma", "Polytechnic"], help: "First year or Lateral entry in AICTE approved institute" },
      { field: "income", label: "Annual Family Income", condition: "max", requiredValue: 800000, help: "Family income under ₹8 Lakhs per annum" }
    ],
    documents: [
      "10th & 12th Mark sheets",
      "Income Certificate for the financial year",
      "Admission Letter issued by Directorate of Technical Education / Institute",
      "Bank Passbook copy showing IFSC and Account Number",
      "Aadhaar Card",
      "Declaration by Parents stating girl child criteria"
    ],
    steps: [
      "Step 1: Visit National Scholarship Portal (scholarships.gov.in).",
      "Step 2: Register for Fresh Application using OTR (One Time Registration).",
      "Step 3: Fill in Student Details and select Scheme: AICTE Pragati Scholarship.",
      "Step 4: Upload supporting documents.",
      "Step 5: Submit application for Institute Level Verification."
    ],
    official_url: "https://scholarships.gov.in",
    source_name: "National Scholarship Portal (NSP - Govt. of India)",
    last_verified: "2026-08-10",
    is_verified_official: true
  },
  {
    id: "id-aadhaar-lost-duplicate",
    name: "Re-issue / Order Aadhaar PVC Card or Download e-Aadhaar",
    category: "Identity",
    department: "Unique Identification Authority of India (UIDAI)",
    state: "All India",
    description: "Official online service to download instant signed e-Aadhaar PDF or order a durable water-resistant Aadhaar PVC Card delivered via Speed Post if lost or damaged.",
    eligibility: [
      { field: "intent", label: "Requirement", condition: "contains", requiredValue: ["aadhaar", "lost", "duplicate", "download", "pvc"], help: "Applicable to all Aadhaar holders" }
    ],
    documents: [
      "Aadhaar Number (12 digits) OR Enrollment ID (28 digits)",
      "Registered Mobile Number (for OTP verification)",
      "If mobile not linked: Alternate mobile number for PVC Card ordering"
    ],
    steps: [
      "Step 1: Open UIDAI Official Portal (myaadhaar.uidai.gov.in).",
      "Step 2: For Instant Digital Copy: Click 'Download Aadhaar', enter Aadhaar No. & OTP sent to registered mobile.",
      "Step 3: Open downloaded PDF using Password: First 4 letters of name in CAPITAL + Birth Year (e.g. AMIT1998).",
      "Step 4: For Physical Card Replacement: Click 'Order Aadhaar PVC Card' (Nominal Fee ₹50).",
      "Step 5: Enter Aadhaar Number and Security Captcha.",
      "Step 6: Authenticate via OTP (works with non-registered mobile as well).",
      "Step 7: Pay ₹50 via UPI/Netbanking and receive SRN Tracking Number."
    ],
    official_url: "https://myaadhaar.uidai.gov.in",
    source_name: "UIDAI MyAadhaar Portal (Govt. of India)",
    last_verified: "2026-08-18",
    is_verified_official: true
  },
  {
    id: "welfare-nsap-oldage-pension",
    name: "Indira Gandhi National Old Age Pension Scheme (IGNOAPS)",
    category: "Social Welfare",
    department: "Ministry of Rural Development / Social Justice Department",
    state: "All India",
    description: "Monthly financial pension provided to senior citizens living below poverty line (BPL) aged 60 years and above.",
    eligibility: [
      { field: "age", label: "Age Limit", condition: "min", requiredValue: 60, help: "Must be 60 years or older" },
      { field: "category", label: "Economic Status", condition: "contains", requiredValue: ["BPL", "Below Poverty Line", "Low Income"], help: "Applicant household must belong to BPL list" }
    ],
    documents: [
      "Proof of Age (Aadhaar Card / Voter ID / Birth Certificate)",
      "BPL Ration Card / BPL Certificate issued by Gram Panchayat / Municipality",
      "Bank Savings Account Passbook",
      "Passport size photographs",
      "Residence Proof / Domicile Certificate"
    ],
    steps: [
      "Step 1: Visit Social Welfare Department / Gram Panchayat / Block Development Office (BDO) or NSAP portal.",
      "Step 2: Collect Application Form for IGNOAPS Pension.",
      "Step 3: Attach verified BPL Card copy and Age Proof.",
      "Step 4: Submit to Social Welfare Officer or Tehsildar Office.",
      "Step 5: Verification conducted by local Gram Sevak / Talathi.",
      "Step 6: Upon approval, monthly pension is credited directly to Bank Account via Direct Benefit Transfer (DBT)."
    ],
    official_url: "https://nsap.nic.in",
    source_name: "National Social Assistance Programme (NSAP Portal)",
    last_verified: "2026-08-01",
    is_verified_official: true
  },
  {
    id: "cert-caste-certificate-mh",
    name: "Issuance of Caste / Tribe Certificate (Aaple Sarkar)",
    category: "Certificates",
    department: "Revenue Department",
    state: "Maharashtra",
    description: "Official legal certificate proving applicant's Caste / Reserved Category status for education admissions, government jobs, and welfare schemes.",
    eligibility: [
      { field: "state", label: "State", condition: "equals", requiredValue: "Maharashtra", help: "Resident of Maharashtra" },
      { field: "category", label: "Category", condition: "contains", requiredValue: ["SC", "ST", "OBC", "VJNT", "SBC", "SEBC", "Reserved"], help: "Belonging to recognized SC/ST/OBC/VJNT list" }
    ],
    documents: [
      "Applicant Aadhaar Card & Voter ID",
      "Father's / Paternal Relative's Caste Proof (School Leaving Certificate before cutoff year 1967/1993)",
      "7/12 Extract / Land Record or School Leaving Certificate of Applicant",
      "Affidavit for Caste Certificate in prescribed format",
      "Income Certificate / Ration Card"
    ],
    steps: [
      "Step 1: Visit Aaple Sarkar Portal (aaplesarkar.mahaonline.gov.in).",
      "Step 2: Register as new user and create Citizen Login.",
      "Step 3: Navigate to 'Revenue Department' -> Select 'Caste Certificate'.",
      "Step 4: Fill online application form with applicant and father's detail history.",
      "Step 5: Upload self-attested supporting documents (Proof of Identity, Address & Caste evidence).",
      "Step 6: Pay government service charge (~₹33).",
      "Step 7: Download digital digitally signed Caste Certificate within 15–21 working days after Sub-Divisional Officer (SDO) verification."
    ],
    official_url: "https://aaplesarkar.mahaonline.gov.in",
    source_name: "Aaple Sarkar MahaOnline (Govt. of Maharashtra)",
    last_verified: "2026-08-12",
    is_verified_official: true
  },
  {
    id: "cert-income-certificate",
    name: "Issuance of Annual Income Certificate",
    category: "Certificates",
    department: "Revenue & Land Records Department",
    state: "All India / State Specific",
    description: "Official document certifying the total annual income of a family from all sources, essential for scholarships, fee concessions, and government welfare benefits.",
    eligibility: [
      { field: "intent", label: "Requirement", condition: "contains", requiredValue: ["income", "certificate", "ebc", "concession"], help: "Any citizen requiring income proof for schemes" }
    ],
    documents: [
      "Salary Slip / Form 16 / ITR OR Employer Income Certificate",
      "Aadhaar Card & Electricity Bill / Ration Card",
      "Self-Declaration / Affidavit of Income sworn before Notary / Magistrate",
      "Talathi / Patwari Verification Report (if rural)"
    ],
    steps: [
      "Step 1: Access State e-District Portal (e.g. Aaple Sarkar / e-District Delhi / Edistrict UP).",
      "Step 2: Select 'Income Certificate' under Revenue Services.",
      "Step 3: Enter income details from agricultural, salary, or business sources.",
      "Step 4: Upload Aadhaar, Address Proof, and Income Affidavit.",
      "Step 5: Submit application; Tehsildar / Nayab Tehsildar approves after inquiry.",
      "Step 6: Download digitally signed certificate valid for 1 or 3 financial years."
    ],
    official_url: "https://services.india.gov.in",
    source_name: "National Services Portal (Govt. of India)",
    last_verified: "2026-08-14",
    is_verified_official: true
  },
  {
    id: "health-ayushman-bharat",
    name: "Ayushman Bharat PM-JAY Health Insurance Scheme",
    category: "Healthcare",
    department: "National Health Authority (NHA)",
    state: "All India",
    description: "World's largest government-funded healthcare scheme providing cashless health coverage up to ₹5 Lakhs per family per year for secondary and tertiary care hospitalization.",
    eligibility: [
      { field: "category", label: "Economic Status", condition: "contains", requiredValue: ["BPL", "Low Income", "SECC 2011", "Ration Card Holder"], help: "Deprived rural families / occupational urban workers" }
    ],
    documents: [
      "Aadhaar Card",
      "Ration Card / Ayushman Card",
      "Active Mobile Number"
    ],
    steps: [
      "Step 1: Check eligibility on PM-JAY portal (beneficiary.nha.gov.in) using Mobile No. or Ration Card No.",
      "Step 2: Visit nearest Empaneled Public/Private Hospital or Common Service Centre (CSC).",
      "Step 3: Meet Ayushman Mitra at hospital helpdesk for e-KYC verification.",
      "Step 4: Generate Ayushman Card instantly.",
      "Step 5: Avail 100% cashless treatment across 27,000+ empaneled hospitals nationwide."
    ],
    official_url: "https://pmjay.gov.in",
    source_name: "National Health Authority (NHA PM-JAY)",
    last_verified: "2026-08-17",
    is_verified_official: true
  },
  {
    id: "emp-national-career-service",
    name: "National Career Service (NCS) Job Seeker & Skill Portal",
    category: "Employment",
    department: "Ministry of Labour & Employment",
    state: "All India",
    description: "Free nationwide digital platform connecting job seekers with verified private & government job vacancies, skill development courses, career counseling, and job fairs.",
    eligibility: [
      { field: "user_type", label: "Status", condition: "contains", requiredValue: ["Student", "Graduate", "Unemployed", "Job Seeker"], help: "Any individual seeking employment" }
    ],
    documents: [
      "Aadhaar Card / Identity Card",
      "Educational Degree / Marksheet details",
      "Updated Resume / CV"
    ],
    steps: [
      "Step 1: Visit NCS Portal (ncs.gov.in) and click 'Register as Jobseeker'.",
      "Step 2: Authenticate using Unique Identifier (Aadhaar / PAN / Driving License).",
      "Step 3: Build profile adding education history, skills, experience, and preferred location.",
      "Step 4: Search and apply directly for government vacancies and private recruiters.",
      "Step 5: Receive job match alerts via SMS & Email."
    ],
    official_url: "https://ncs.gov.in",
    source_name: "National Career Service (Govt. of India)",
    last_verified: "2026-08-16",
    is_verified_official: true
  }
];

export const SERVICE_CATEGORIES = [
  "All Categories",
  "Education",
  "Identity",
  "Social Welfare",
  "Certificates",
  "Employment",
  "Healthcare"
];
