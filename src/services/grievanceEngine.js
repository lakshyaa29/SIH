/* =========================================================================
   NagrikMitra AI / Sahayak AI — CPGRAMS Public Grievance & Escalation Engine
   ========================================================================= */

export function analyzeGrievance({ description, department, ref_number, days_pending }) {
  const days = parseInt(days_pending) || 30;
  const isDelayed = days > 30;

  // Determine severity tier
  let severity = "MODERATE";
  if (days > 90) severity = "CRITICAL";
  else if (days > 45) severity = "HIGH";

  // Statutory Grounds
  const statutoryGrounds = [
    `Breach of Statutory Service Guarantee under Citizen's Charter (Max 30 Days)`,
    `Unreasonable Administrative Delay (> ${days} Days Pending Without Notice)`,
    `Denial of Timely Direct Benefit Transfer (DBT) Disbursement`
  ];

  // Action Steps
  const recommendedActions = [
    { step: 1, action: `Copy the AI-drafted formal petition below` },
    { step: 2, action: `Visit pgportal.gov.in (Centralized Public Grievance Redress System)` },
    { step: 3, action: `Select Ministry: ${department || 'Respective Nodal Ministry'}` },
    { step: 4, action: `Paste petition into grievance text box and attach application receipt` },
    { step: 5, action: `Receive unique CPGRAMS Registration Number with mandatory 30-day resolution timeline` }
  ];

  return {
    is_delayed: isDelayed,
    days_pending: days,
    severity: severity,
    suggested_department: department || "Department of Administrative Reforms & Public Grievances",
    statutory_grounds: statutoryGrounds,
    recommended_actions: recommendedActions
  };
}

export function generateGrievancePetition({ description, department, ref_number, days_pending, citizen_name = "Citizen Applicant" }) {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const refStr = ref_number ? ` (Application Ref ID: ${ref_number})` : '';
  const days = days_pending || 30;

  const petitionText = `FORMAL PUBLIC GRIEVANCE PETITION UNDER CPGRAMS

Date: ${currentDate}

TO:
The Nodal Public Grievance Officer,
${department || 'Central / State Nodal Department'}

SUBJECT: Formal Grievance regarding Unreasonable Administrative Delay in Service Delivery${refStr}

RESPECTED SIR / MADAM,

I am writing to formally lodge a grievance regarding my pending application for government statutory services under your department.

1. APPLICANT DETAILS & CASE SUMMARY:
- Applicant Name: ${citizen_name}
- Service / Department: ${department}
- Reference ID: ${ref_number || 'N/A'}
- Pending Duration: ${days} Days (Exceeds 30-Day Citizen Charter Standard)

2. DESCRIPTION OF ISSUES / INACTION:
"${description}"

3. STATUTORY GROUNDS & BREACH OF SERVICE GUARANTEE:
As per the mandatory guidelines of the Department of Administrative Reforms and Public Grievances (DARPG) and the Citizen's Charter, public service applications must be processed within a statutory timeframe not exceeding 30 days. The current delay of ${days} days without valid written explanation constitutes an administrative breach of service guarantee.

4. PRAYER / REQUESTED RELIEF:
I respectfully request the Nodal Officer to:
a) Expedite the processing and final approval/disbursal of my application.
b) Issue an immediate status update and reason for the ${days}-day delay.
c) Credit entitled benefits directly to the verified bank account.

Thanking You,

Yours Faithfully,
${citizen_name}
Lodged via Sahayak AI Citizen Portal (Ref Token: SAH-${Math.floor(100000 + Math.random() * 900000)})
`;

  return petitionText;
}
