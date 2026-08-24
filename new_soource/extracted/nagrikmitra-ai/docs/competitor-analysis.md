# Competitor / Landscape Analysis

NagrikMitra AI is proposed as a **conversational discovery layer on top
of** existing official government platforms — not a replacement for any
of them. This document compares what each platform actually does today
against what this prototype adds, without overstating either side.

| Capability | UMANG | MyScheme | DigiLocker | India.gov.in | CPGRAMS | **NagrikMitra AI (proposed layer)** |
|---|---|---|---|---|---|---|
| Main purpose | Unified access to hundreds of government services/transactions | Scheme discovery via filters (age, income, state, category) | Digital storage & sharing of government-issued documents | National directory of government websites & information | Grievance lodging & tracking | Conversational intent → matched service → action plan |
| Search / discovery | By service/department name | By structured filters | By document type | By department/ministry directory | By department/category | By free-text problem statement |
| Conversational AI | No | No | No | No | No | Yes (rule-based intent detection in this prototype) |
| Personalisation | No | Filter-based, self-selected | No | No | No | Follow-up-question-driven, adaptive per intent |
| Follow-up questions | No | No | No | No | No | Yes — minimum-necessary question engine |
| Eligibility guidance | Scheme-dependent, shown after you find it | Yes, once you've found and opened a scheme | N/A | N/A | N/A | Surfaced immediately alongside the match, in plain language |
| Source verification shown | Implicit (it's the official app) | Implicit (it's the official portal) | Implicit | Implicit | Implicit | Explicit confidence rating + "last verified" date on every result |
| Personalised action plan | No | No | No | No | Grievance-specific steps only | Yes — step-by-step plan generated per matched service |

## Honest framing

- **UMANG, MyScheme, DigiLocker, India.gov.in and CPGRAMS are the real,
  authoritative government systems.** NagrikMitra AI does not claim to
  replicate their functionality, hold their data, or replace them —
  every recommendation in this prototype links out to the citizen's next
  step on one of these (or another) official platform.
- NagrikMitra AI's contribution is narrowly scoped: turning an
  **unstructured problem statement into a starting point** (which
  service, which category, what to prepare) before handing the citizen
  off to the real system.
- Nothing in this prototype should be read as MyScheme or UMANG lacking
  eligibility or filter features — they do have them. The difference
  claimed here is the **entry point**: free-text conversation with
  adaptive follow-up questions, versus filter- or search-based discovery.
