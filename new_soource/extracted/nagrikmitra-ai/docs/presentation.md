# NagrikMitra AI — Presentation Content

*(~12 slides, hackathon-ready bullet points)*

---

## Slide 1 — Title
**NagrikMitra AI**
*Your AI Guide to Government Services*
Team / Hackathon name / Date

---

## Slide 2 — Problem
- Citizens often don't know which government scheme applies to them
- Eligibility rules, documents, and application steps are scattered across hundreds of portals
- Discovery requires already knowing the scheme's name
- Delays and rejections leave citizens with no clear next step

---

## Slide 3 — Existing Gap
- UMANG, MyScheme, DigiLocker, India.gov.in, CPGRAMS each solve one piece — access, discovery, storage, directory, grievance
- None of them start from a citizen's **plain-language problem statement**
- None ask **follow-up questions** to narrow down eligibility conversationally
- Search still requires the citizen to know the right keywords

---

## Slide 4 — Our Solution
- A conversational layer **on top of** existing official platforms — not a replacement for them
- Citizen describes their problem in everyday language
- System detects intent, asks minimum necessary questions, retrieves a verified match
- Every answer is sourced, rated for confidence, and linked to the real official portal

---

## Slide 5 — How It Works
1. Describe your problem
2. Answer a few targeted questions
3. Get a matched, verified service
4. Follow a step-by-step action plan to the official portal

---

## Slide 6 — AI Architecture
- Rule-based intent detector maps free text → one of 15 life-situation categories
- Follow-up Question Engine asks only what's needed per category
- Retrieval layer scores a curated service database against the citizen's profile
- Response generator explains "why this matches" using only retrieved facts

---

## Slide 7 — RAG + Verification
- Retrieve first, generate second — the AI never answers before checking the database
- Every recommendation carries: official source, last-verified date, confidence rating
- Hallucination-prevention rules: no invented schemes, no invented URLs, no invented eligibility
- Low-confidence or no-match cases say so explicitly instead of guessing

---

## Slide 8 — User Journey
- Landing page → "Describe your problem"
- Conversational assistant → intent + follow-ups
- Result page → match %, eligibility, documents, action plan, official link
- Dashboard → saved services & activity, for the citizen to track progress

---

## Slide 9 — Technology
- Client-side prototype: HTML/CSS/JS, zero install, fully clickable
- Data model designed for direct portability to SQLite → PostgreSQL
- Retrieval/response functions written as swappable modules for a future real LLM + vector DB
- Upgrade path documented to a full Node/Express + React + SQLite stack

---

## Slide 10 — Prototype Demo
- Live click-through: student scholarship scenario (Maharashtra, undergraduate, income bracket)
- Demo Mode: 5 one-click example queries, no typing required
- Admin panel: add/edit/verify a service live
- Grievance flow: routes a "pending 30 days" complaint to the real CPGRAMS portal

---

## Slide 11 — Impact
- Reduces the *discovery* barrier, not just the *application* barrier
- Meets citizens in their own words instead of requiring scheme-name knowledge
- Transparent trust model: source + confidence shown on every answer
- Designed to layer onto — not compete with — official government platforms

---

## Slide 12 — Future Scope
- Real LLM integration behind the same retrieve-then-generate interface
- Live status-tracking via official scheme APIs where available
- Full multilingual support beyond the current demo translation layer
- Verified-partner programme with state government departments
- Persistent, authenticated citizen accounts with encrypted storage
