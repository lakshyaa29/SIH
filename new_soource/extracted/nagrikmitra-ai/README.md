# NagrikMitra AI — "Your AI Guide to Government Services"

A prototype AI assistant that helps citizens turn a plain-language problem
("I need financial help for my education") into a specific, verified
government service, with eligibility, required documents, an action plan,
and a link to the real official portal.

---

## ⚠️ Read this first — how this prototype is built

The original brief asked for a full React + Vite + Node/Express + SQLite
stack. This build ships as **one self-contained file, `index.html`**,
instead. That trade-off was made deliberately, for a beginner-friendly,
guaranteed-to-work hackathon demo:

- **No `npm install`, no server, no build step, no API key.** Double-click
  `index.html` and the whole product — landing page, AI assistant,
  intent detection, follow-up questions, service database, results,
  dashboard, admin panel, grievance flow, jury page — works immediately,
  offline, in any modern browser.
- All the logic is written as the **same functions and data shapes** a
  real backend would use (`retrieveRelevantServices()`,
  `generateGroundedResponse()`, a `SERVICES` table shaped like a database
  row). See **"Upgrading to the full stack"** below for exactly how to
  lift this into Node/Express + SQLite/React if you want to extend it
  after the hackathon.
- Session data (saved services, activity history) lives in memory in the
  browser tab only — it resets on refresh. There is no backend database
  in this build, so nothing is written to disk or transmitted anywhere.

Everything else in this document describes what's actually implemented.

---

## 1. Problem statement

Citizens often don't know:
- Which government scheme/service applies to them
- Whether they're eligible
- Which documents they need
- Where to apply, and which government website is genuinely official
- What to do if an application is delayed or rejected

## 2. Solution

A conversational assistant that:
1. Takes a free-text problem statement
2. Detects the citizen's **intent** (Education, Pension, Farmer Services, …)
3. Asks the **minimum necessary follow-up questions**
4. **Retrieves** matching services from a curated government-service database
5. Returns a **grounded, sourced** recommendation with a confidence rating,
   eligibility checklist, required documents, and a step-by-step action plan
6. Always links to the real official government portal for the next step

## 3. Feature checklist

- Landing page with hero "ask box", popular services, how-it-works, trust section
- Conversational AI assistant with visible intent detection + progress
- Rule-based follow-up question engine (per-intent question sets)
- 20-service curated government database (real official domains)
- Result page: match %, "why this recommendation", eligibility, documents,
  source + confidence, action plan, save/open-website buttons
- Service directory with keyword search
- Dashboard: saved services + recent activity (session-based)
- Grievance flow (CPGRAMS-style, routes to the real portal — does not submit anything)
- Official Platforms section (UMANG, DigiLocker, MyScheme, India.gov.in, CPGRAMS)
- Admin panel: add / edit / delete / mark-verified for services (no auth — demo only)
- "For Jury" page with a one-click reference demo + presentation-ready Q&A
- Demo Mode: 5 example queries that auto-run the entire flow
- Language selector (English fully implemented; Hindi/Marathi have a small
  demo translation layer on the hero section, clearly a "demo" layer — not
  a full localisation)
- Loading-state sequence ("Understanding your request…" → "Finding
  relevant government services…" → "Checking available information…")
- Accessible: skip link, visible focus states, labelled form fields,
  `prefers-reduced-motion` respected, keyboard-operable buttons
- Disclaimer footer on every page

## 4. Anti-hallucination rules (implemented)

1. The assistant can only recommend services that exist in `SERVICES` —
   there is no free-text generation of scheme names or facts.
2. Every recommendation shows a source (`source_name` + `official_url`).
3. Every recommendation shows a Low/Medium/High confidence rating.
4. Eligibility and document lists are pulled verbatim from the database
   record — never invented per-conversation.
5. Official URLs are hand-curated, real, `.gov.in`/`nic.in`-class domains
   (see `docs/sources.md`) — never auto-generated.
6. Demo data and "verified" government information are labelled
   consistently throughout the UI and this README.
7. If no service scores well enough, the assistant explicitly says:
   *"I couldn't confidently identify a suitable government service.
   Please verify through official government portals."* and points to
   Demo Mode / the service directory instead of guessing.

## 5. RAG-style architecture

```
Citizen types a problem
        ↓
detectIntent(text)              — keyword/rule-based classifier
        ↓
Follow-up Question Engine       — QUESTIONS[intent], asks minimum needed
        ↓
User Profile (answers object)
        ↓
retrieveRelevantServices()      — filters + scores SERVICES by category & profile
        ↓
Top-matching Service record(s)  — real data, never generated
        ↓
generateGroundedResponse()      — builds "why this matches" from the
                                   retrieved record + the user's own answers
        ↓
Confidence Score + Official Source
        ↓
Personalised Action Plan + "Open Official Website"
```

`retrieveRelevantServices()` and `generateGroundedResponse()` are written
as standalone functions in `index.html` specifically so they can be
lifted into a real backend (e.g. swapping the keyword filter for a vector
database, or the template-based response for a real LLM call) without
changing their inputs/outputs.

## 6. Data model (portable to SQLite/PostgreSQL)

Each service record (see `SERVICES` in `index.html`) maps directly onto a
`services` table:

```
id, service_name, category, description, states, eligibility,
required_documents, application_steps, official_url, source_name,
last_verified, confidence, keywords
```

A full backend would add: `users`, `sources`, `conversations`, `messages`,
`recommendations`, `saved_services`, `verification_logs` — exactly as
specified in the original brief — with `recommendations` and
`saved_services` foreign-keyed to `users` and `services`.

## 7. Installation & running the demo (Windows, beginner-friendly)

No installation is required for the current build.

1. Locate the folder `nagrikmitra-ai` you downloaded/unzipped.
2. Double-click `index.html`. It opens in your default browser
   (Chrome/Edge/Firefox all work).
3. On the landing page, type a problem in the box and click **"Find My
   Service"**, or click **"Try Demo Mode"** on the Assistant page and
   pick one of the five example queries.
4. Explore **Services**, **My Dashboard**, **Official Platforms**,
   **Admin**, and **For Jury / About** from the top navigation.

That's it — no Node.js, no terminal commands, no `.env` file needed for
this build.

## 8. Upgrading to the full Node/Express + SQLite + React stack

If you want to extend this into the originally-specified stack:

1. **Backend**: create an Express app exposing the endpoints listed in
   the brief (`GET /api/services`, `POST /api/assistant/message`, etc.).
   Move the `SERVICES` array into a SQLite table seeded on startup, and
   port `detectIntent()`, `retrieveRelevantServices()`, and
   `generateGroundedResponse()` almost unchanged into backend route
   handlers.
2. **AI layer**: replace the mock/demo response generator with a real
   LLM call (server-side only — never expose an API key in frontend
   code), keeping the same "retrieve first, generate grounded answer
   second" flow so hallucination-prevention rules still hold.
3. **Frontend**: rebuild the views in `index.html` as React components
   (Vite + Tailwind), calling the new REST endpoints via `fetch`
   instead of reading the in-memory `state` object directly.
4. **Persistence**: replace the in-memory `state.saved` / `state.history`
   arrays with real `saved_services` / `conversations` rows tied to a
   logged-in user.

## 9. Manual testing checklist

- [ ] Landing page loads with hero, popular services, how-it-works, trust section
- [ ] Typing a problem and pressing Enter/"Find My Service" opens the Assistant with that message sent
- [ ] Assistant detects intent for each of the 5 demo queries correctly
- [ ] Follow-up questions match the intent (Education → state/level/income; Pension → age/state/employment/existing; Farmer → state/land/need)
- [ ] Submitting empty chat input shows a validation nudge, does not crash
- [ ] A nonsense/unmatched query returns the "couldn't confidently identify" fallback message
- [ ] Result page shows match %, why-it-matches, eligibility, documents, source, confidence, action plan
- [ ] "Open Official Website" opens the real government domain in a new tab
- [ ] "Save This Service" adds it to My Dashboard and toggles to "✓ Saved"
- [ ] Service directory search filters correctly for "scholarship", "farmer", "pension", "certificate", "complaint"
- [ ] Grievance page returns a CPGRAMS-routed result for a "pending 30 days" style message
- [ ] Admin panel: add, edit, delete, and "mark verified" all update the table
- [ ] Jury page's one-click demo runs the full flow end-to-end
- [ ] Language selector swaps hero text for Hindi/Marathi (demo layer)
- [ ] Page is usable at mobile width and via keyboard-only navigation

## 10. Security & privacy notes (prototype-level)

- No external network calls are made by this build — all data is local
  to the HTML file and the browser tab.
- No personal data is transmitted or stored outside the session.
- No API keys are present anywhere in this codebase.
- **This prototype is not production-ready.** A real deployment would
  need authentication, encrypted persistence, input sanitisation on a
  real backend, rate limiting, and a formal data-protection review
  before handling real citizen data.

## 11. Documentation

- `docs/presentation.md` — slide-by-slide content for a hackathon deck
- `docs/competitor-analysis.md` — how this compares to UMANG / MyScheme / DigiLocker / India.gov.in / CPGRAMS
- `docs/sources.md` — every official government source used, with verification notes

## 12. Disclaimer

> NagrikMitra AI is a prototype intended to help citizens discover
> relevant government services. Information should be verified on the
> linked official government portal before taking action. The system
> does not replace official government authorities.
