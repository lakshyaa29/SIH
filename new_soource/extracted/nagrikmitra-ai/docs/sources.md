# Data Sources

Every service record in this prototype links to a real, official
government domain. This file lists each source, its purpose, and how it
is used in the prototype. **No live API is connected to any of these —
all data show here (descriptions, eligibility, documents, steps) is a
hand-curated demo dataset for the hackathon prototype**, not a live feed
from these portals. Always confirm current details on the linked site
before a citizen acts on them.

| Name | Official URL | Purpose | What's used in the prototype | Verification date | Integration type |
|---|---|---|---|---|---|
| National Scholarship Portal | https://scholarships.gov.in | Central/state scholarship applications | Name, purpose, general eligibility/document pattern, URL | 2026-06-01 | Curated (demo) — not a live API |
| PM-KISAN | https://pmkisan.gov.in | Farmer income support | Name, purpose, general eligibility pattern, URL | 2026-06-01 | Curated (demo) |
| Ayushman Bharat — PM-JAY | https://pmjay.gov.in | Health insurance cover | Name, purpose, general eligibility pattern, URL | 2026-06-01 | Curated (demo) |
| UIDAI (Aadhaar) | https://uidai.gov.in | Aadhaar enrolment/update | Name, purpose, general process, URL | 2026-06-01 | Curated (demo) |
| Income Tax Department (PAN / e-PAN) | https://www.incometax.gov.in/iec/foportal/ | PAN issuance | Name, purpose, general process, URL | 2026-06-01 | Curated (demo) — confidence marked Medium; verify current e-PAN flow on-site |
| Parivahan Sewa (Sarathi) | https://parivahan.gov.in | Driving licence services | Name, purpose, general process, URL | 2026-06-01 | Curated (demo) |
| NFSA | https://nfsa.gov.in | Ration card / food security | Name, purpose, general process, URL | 2026-06-01 | Curated (demo) |
| e-Shram | https://eshram.gov.in | Unorganised worker registration | Name, purpose, general process, URL | 2026-06-01 | Curated (demo) |
| EPFO | https://www.epfindia.gov.in | Provident fund / pension | Name, purpose, general process, URL | 2026-06-01 | Curated (demo) |
| PFRDA (Atal Pension Yojana) | https://www.pfrda.org.in | Pension regulation (APY enrolled via banks/post offices) | Name, purpose, general process, URL | 2026-06-01 | Curated (demo) — confidence marked Medium |
| PMAY (Urban) | https://pmaymis.gov.in | Affordable housing scheme | Name, purpose, general process, URL | 2026-06-01 | Curated (demo) |
| Ministry of Women & Child Development | https://wcd.nic.in | Women & child welfare schemes | Name, purpose, general process, URL | 2026-06-01 | Curated (demo) — confidence marked Medium |
| NSAP | https://nsap.nic.in | Senior citizen / social assistance pension | Name, purpose, general process, URL | 2026-06-01 | Curated (demo) — confidence marked Medium |
| UDID (Disability) | https://www.swavlambancard.gov.in | Unique Disability ID | Name, purpose, general process, URL | 2026-06-01 | Curated (demo) — confidence marked Medium |
| Udyam Registration | https://udyamregistration.gov.in | MSME/business registration | Name, purpose, general process, URL | 2026-06-01 | Curated (demo) |
| CPGRAMS | https://pgportal.gov.in | Grievance redress | Name, purpose, general process, URL | 2026-06-01 | Curated (demo) — used for outbound "Open Official Grievance Portal" link only |
| DigiLocker | https://www.digilocker.gov.in | Digital document storage | Name, purpose, general process, URL | 2026-06-01 | Curated (demo) |
| UMANG | https://web.umang.gov.in | Unified government services app | Name, purpose, general process, URL | 2026-06-01 | Curated (demo) |
| MyScheme | https://www.myscheme.gov.in | Scheme discovery portal | Name, purpose, general process, URL | 2026-06-01 | Curated (demo) |
| India.gov.in | https://www.india.gov.in | National government directory | Name, purpose, general process, URL | 2026-06-01 | Curated (demo) |

## Notes

- "Verification date" reflects when this dataset was checked while
  building the prototype, not a live automated verification — this
  distinction is intentional and stated in the UI on every result
  ("Last verified: [date]").
- Confidence ratings of **Medium** are applied where the exact current
  URL/process for a scheme was less certain at curation time (PAN e-PAN
  flow, Atal Pension Yojana enrolment routing, WCD scheme specifics,
  NSAP state-level variation, UDID portal). These should be
  double-checked before any real citizen-facing deployment.
- No government API keys, scraping, or automated live verification are
  used anywhere in this prototype.
