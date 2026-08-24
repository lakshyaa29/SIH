# NagrikMitra AI (नागरिकमित्र AI) — "Your AI Guide to Government Services"

An intelligent, production-ready, full-stack Gov-Tech web platform that empowers citizens to turn natural language questions into verified, grounded government welfare schemes, eligibility checklists, required document lockers, and direct links to official government portals (`.gov.in` / `nic.in`).

---

## 🌟 Key Features

1. **AI Citizen Assistant**:
   - **Voice & Speech Input** (Web Speech API) with multilingual recognition across 8 Indian languages.
   - **Text-to-Speech (TTS)**: Listen to recommendations read aloud.
   - **RAG-Grounded Matching**: Intent detection across 15+ life-situation categories with strict anti-hallucination citations.
   - **Traceable Citizen Advice Token Slip**: Verifiable Token No. (e.g. `NM-2026-X9K2L`) with printable receipt generator.

2. **Smart Eligibility Wizard & Calculator**:
   - Multi-parameter demographic scoring (Age, State, Caste/Category, Education, Occupation, Income, Landholding).
   - Simultaneously calculates qualification percentages and personalized reasons across all 25+ central and state schemes.

3. **Government Services Directory**:
   - Search with instant debounced filtering.
   - Category and state filter pills with detailed modal popups.

4. **CPGRAMS Public Grievance Assistant**:
   - Citizen Charter delay diagnosis (>30 days breach alerts).
   - Structured grievance petition drafter with 1-click clipboard copy for direct submission on `https://pgportal.gov.in`.

5. **Citizen Dashboard & Document Readiness Locker**:
   - Saved service application tracking (Saved, In Progress, Documents Ready, Applied, Approved, Grievance Raised).
   - Document Readiness Locker for Aadhaar, Income Certificate, Bank Passbook, Ration Card, Land records.
   - Real-time activity timeline.

6. **Admin Control Center**:
   - Full CRUD for government schemes.
   - 1-Click "Mark as Verified" with timestamp audit trail.

7. **Jury & Presentation Hub**:
   - 1-Click Live End-to-End Simulation scenario for evaluators.
   - Architectural comparison & trust model breakdown.
   - Interactive Q&A accordion.

8. **Multilingual Support (8 Languages)**:
   - English, हिन्दी (Hindi), मराठी (Marathi), বাংলা (Bengali), தமிழ் (Tamil), తెలుగు (Telugu), ગુજરાતી (Gujarati), ಕನ್ನಡ (Kannada).

9. **Dark & Light Mode**:
   - Full toggleable theme support with high-contrast accessibility.

---

## 🚀 How to Run the Website

### Option 1: One-Click Windows Batch File (Recommended)
Double-click `start.bat` in this folder.
- Automatically initializes the database.
- Starts the FastAPI web server.
- Opens your browser automatically at `http://127.0.0.1:8000`.

### Option 2: Python Command Line
```bash
python run.py
```

### Option 3: Direct Web Server
```bash
uvicorn backend.app:app --host 127.0.0.1 --port 8000 --reload
```
Then visit `http://127.0.0.1:8000` in your web browser.

---

## 🧪 Automated Testing

To run the automated verification test suite:
```bash
python test_app.py
```
All 7 end-to-end tests verify:
1. Health check
2. Scheme catalog & keyword filtering
3. Intent detection
4. Grounded RAG retrieval & Token generation
5. Multi-factor eligibility calculator
6. CPGRAMS grievance diagnostic & petition drafting
7. Saved services tracker & official verification audit logging

---

## 🏗️ Architecture & Tech Stack

```
c:\Users\Sagar\Downloads\New folder\
├── run.py                       # One-click Python launcher
├── start.bat                    # One-click Windows batch launcher
├── test_app.py                  # Automated test suite (100% pass)
├── backend\
│   ├── app.py                   # FastAPI app & static file mounting
│   ├── database.py              # SQLite connection, schema, seed data
│   ├── nagrikmitra.db           # Persistent SQLite database
│   ├── rag_engine.py            # Intent classifier, RAG retrieval, grounding engine
│   └── routes\
│       ├── services_api.py      # /api/services, /api/categories, /api/platforms
│       ├── assistant_api.py     # /api/assistant/chat, /api/assistant/evaluate-eligibility
│       ├── grievance_api.py     # /api/grievance/analyze, /api/grievance/draft
│       └── dashboard_api.py     # /api/dashboard/saved, /api/dashboard/stats, /api/dashboard/activity
└── frontend\
    ├── index.html               # Main SPA entry
    ├── css\
    │   └── styles.css           # Gov-tech design system & dark/light theme
    └── js\
        ├── i18n.js              # 8-language translations dictionary
        ├── api.js               # REST client with offline resilience
        ├── assistant.js         # Chat UI, speech recognition & token generator
        ├── eligibility.js       # Multi-factor eligibility wizard
        ├── directory.js         # Searchable scheme catalog
        ├── grievance.js         # CPGRAMS diagnostic & petition drafter
        ├── dashboard.js         # Saved tracker & document locker
        ├── admin.js             # Scheme management & audit logs
        ├── jury.js              # 1-click evaluator demo & presentation Q&A
        └── app.js               # App orchestrator & router
```

---

## 🛡️ Anti-Hallucination & Trust Guarantee
- **No free-text fabrication**: All scheme names, statutory eligibility criteria, and required documents are retrieved directly from the verified database.
- **Official Domains Only**: Every recommended service links strictly to authentic `.gov.in` / `nic.in` domains.
- **Traceable Token Receipts**: Every recommendation gets a unique Citizen Token ID with date/time for accountability.
