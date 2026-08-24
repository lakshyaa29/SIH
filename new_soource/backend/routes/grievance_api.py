"""
NagrikMitra AI - CPGRAMS Public Grievance API Endpoints
Grievance diagnosis, Citizen Charter delay compliance audit, and formal petition drafter.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid
from ..database import get_db

router = APIRouter(prefix="/api/grievance", tags=["Grievance"])

class GrievanceAnalyzeRequest(BaseModel):
    description: str
    department: Optional[str] = "General / Unknown"
    scheme_name: Optional[str] = ""
    ref_number: Optional[str] = ""
    days_pending: Optional[int] = 30

class GrievanceDraftRequest(BaseModel):
    citizen_name: Optional[str] = "Concerned Citizen"
    contact_number: Optional[str] = ""
    department: str
    scheme_name: Optional[str] = "Government Scheme / Benefit"
    ref_number: Optional[str] = "N/A"
    days_pending: int = 30
    issue_summary: str
    state: Optional[str] = "All India"

@router.post("/analyze")
def analyze_grievance(payload: GrievanceAnalyzeRequest):
    desc = payload.description.lower()
    days = payload.days_pending or 30
    
    # Check delay threshold
    is_delayed = days >= 30
    urgency = "High (Citizen Charter Breach)" if is_delayed else "Moderate"
    
    suggested_dept = payload.department
    if "scholarship" in desc or "student" in desc or "college" in desc:
        suggested_dept = "Department of Higher Education (Ministry of Education)"
    elif "kisan" in desc or "farmer" in desc or "crop" in desc:
        suggested_dept = "Department of Agriculture & Farmers Welfare"
    elif "epf" in desc or "pension" in desc or "pf" in desc or "uan" in desc:
        suggested_dept = "Employees' Provident Fund Organisation (EPFO) / Ministry of Labour"
    elif "ration" in desc or "food" in desc or "fps" in desc:
        suggested_dept = "Department of Food and Public Distribution / State Food Department"
    elif "aadhaar" in desc or "uid" in desc:
        suggested_dept = "Unique Identification Authority of India (UIDAI)"
    elif "hospital" in desc or "ayushman" in desc or "medical" in desc:
        suggested_dept = "National Health Authority (Ministry of Health & Family Welfare)"
    elif "house" in desc or "awas" in desc or "pmay" in desc:
        suggested_dept = "Ministry of Housing and Urban Affairs / PMAY Directorate"

    action_points = [
        f"Target Official Authority: **{suggested_dept}**",
        "Step 1: Check real-time tracking status on the respective department portal using your Reference ID."
    ]
    
    if is_delayed:
        action_points.append(
            f"Step 2: Since the request has been pending for **{days} days** (exceeding the standard 30-day Citizen Charter timeline), you are entitled to lodge a formal grievance on CPGRAMS."
        )
        action_points.append(
            "Step 3: Generate the structured CPGRAMS draft letter below, copy it, and submit on pgportal.gov.in under the designated Public Grievance Officer."
        )
        action_points.append(
            "Step 4: If no resolution is provided within 30 days of filing on CPGRAMS, escalate to the First Appellate Authority on the portal."
        )
    else:
        action_points.append(
            f"Step 2: Your application has been pending for {days} days. Most administrative procedures have a 15-30 day processing window."
        )
        action_points.append(
            "Step 3: If not resolved upon completion of 30 days, copy the prepared petition below and submit on CPGRAMS."
        )

    return {
        "is_delayed": is_delayed,
        "urgency": urgency,
        "suggested_department": suggested_dept,
        "action_points": action_points,
        "official_portal": "https://pgportal.gov.in",
        "portal_name": "CPGRAMS (pgportal.gov.in)"
    }

@router.post("/draft")
def generate_grievance_draft(payload: GrievanceDraftRequest):
    today = datetime.now().strftime("%d-%B-%Y")
    ref_text = payload.ref_number if payload.ref_number and payload.ref_number.strip() != "" else "[Pending / Reference ID Not Issued]"
    
    letter = f"""TO:
The Public Grievance Officer (PGO)
{payload.department}
Government of India / State Government of {payload.state}

DATE: {today}

SUBJECT: Formal Public Grievance regarding inordinate delay in processing application / service delivery for {payload.scheme_name} (Ref No: {ref_text})

RESPECTED SIR / MADAM,

I am writing to formally submit a public grievance under the Centralised Public Grievance Redress and Monitoring System (CPGRAMS) regarding the unreasonable delay in service delivery.

DETAILS OF GRIEVANCE:
1. Citizen Name: {payload.citizen_name}
2. Contact Details: {payload.contact_number or '[Registered Mobile Number]'}
3. Department / Authority Concerned: {payload.department}
4. Scheme / Service Name: {payload.scheme_name}
5. Application / Reference Number: {ref_text}
6. Period of Inordinate Delay: Over {payload.days_pending} days without resolution.

SUMMARY OF MATTER:
{payload.issue_summary}

PRAYER / RELIEF REQUESTED:
Under the Citizen Charter and standard DARPG service delivery guidelines, citizen applications are required to be processed in a timely manner. As this matter has remained unresolved for over {payload.days_pending} days without official communication, I earnestly request your kind intervention to:
1. Expeditiously process and finalize my application ({ref_text}).
2. Provide written communication detailing the current status and immediate resolution steps.
3. Disburse the eligible statutory entitlement / service benefit without further delay.

Thanking you.

Yours faithfully,
{payload.citizen_name}
(Lodged via NagrikMitra AI CPGRAMS Assist)"""

    # Record grievance to DB
    case_token = f"GRV-{datetime.now().year}-{uuid.uuid4().hex[:5].upper()}"
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO grievance_cases (
        token_id, department, scheme_name, issue_type, description,
        ref_number, days_pending, suggested_action, draft_letter
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        case_token,
        payload.department,
        payload.scheme_name,
        "Delayed Service Delivery",
        payload.issue_summary,
        payload.ref_number,
        payload.days_pending,
        "Lodge on pgportal.gov.in",
        letter
    ))
    conn.commit()
    conn.close()

    return {
        "case_token": case_token,
        "formatted_draft": letter,
        "portal_url": "https://pgportal.gov.in",
        "instructions": [
            "1. Copy the formatted grievance draft text above.",
            "2. Open the official CPGRAMS portal: https://pgportal.gov.in",
            "3. Click on 'Lodge Public Grievance' and select the Ministry / Department.",
            "4. Paste the draft text into the description field and upload any existing acknowledgement slip.",
            "5. Submit to receive your official DARPG tracking registration number."
        ]
    }
