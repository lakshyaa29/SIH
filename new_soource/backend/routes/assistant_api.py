"""
NagrikMitra AI - Assistant & Eligibility API Endpoints
Conversational dialogue, intent resolution, follow-up questionnaires, and multi-factor eligibility scoring.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import uuid
from datetime import datetime
from ..database import get_db
from ..rag_engine import (
    detect_intent,
    get_questions_for_intent,
    retrieve_relevant_services,
    generate_grounded_response,
    evaluate_full_profile
)
from .services_api import parse_service_row

router = APIRouter(prefix="/api/assistant", tags=["Assistant"])

class ChatRequest(BaseModel):
    message: str
    intent: Optional[str] = None
    answers: Optional[Dict[str, Any]] = {}
    pending_questions: Optional[List[Dict[str, Any]]] = None

class EligibilityRequest(BaseModel):
    age: Optional[int] = 25
    gender: Optional[str] = "Any"
    state: Optional[str] = "Maharashtra"
    caste_category: Optional[str] = "General / OBC"
    education: Optional[str] = "Undergraduate"
    occupation: Optional[str] = "Student"
    income: Optional[str] = "₹1.5 Lakh – ₹2.5 Lakh"
    land_holding: Optional[str] = "None"
    disability_status: Optional[str] = "No"

@router.post("/chat")
def handle_chat_message(payload: ChatRequest):
    text = payload.message.strip()
    intent = payload.intent
    answers = payload.answers or {}
    
    # 1. First user message: Detect Intent
    if not intent:
        intent_res = detect_intent(text)
        if not intent_res["key"]:
            return {
                "type": "fallback",
                "message": "I could not confidently identify a specific government service category from your description. Please describe your situation with details like your occupation (e.g., student, farmer, shopkeeper), requirement (e.g., scholarship, medical aid, pension), or select one of the suggested categories below.",
                "suggestions": [
                    "I am a student looking for higher education scholarships",
                    "I am a farmer needing crop insurance and income support",
                    "I want to apply for senior citizen pension",
                    "I need cashless hospitalisation assistance under Ayushman Bharat",
                    "My government application is delayed and I want to file a grievance"
                ]
            }
            
        intent_key = intent_res["key"]
        questions = get_questions_for_intent(intent_key)
        
        # Log activity
        return {
            "type": "intent_detected",
            "intent": intent_key,
            "intent_label": intent_res["label"],
            "confidence": intent_res["confidence"],
            "initial_message": f"I understand you are inquiring about **{intent_res['label']}**. To recommend the exact official scheme with 100% verified eligibility, please answer a few quick questions:",
            "questions": questions,
            "current_question": questions[0] if questions else None,
            "question_index": 0,
            "total_questions": len(questions)
        }

    # 2. Processing Follow-up Questions & Final Retrieval
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM services WHERE is_active = 1")
    rows = cursor.fetchall()
    conn.close()
    
    all_services = [parse_service_row(r) for r in rows]
    matches = retrieve_relevant_services(intent, answers, all_services)
    
    if not matches:
        return {
            "type": "no_match",
            "message": "No verified service in our database closely matched all criteria. We recommend exploring the national MyScheme portal or India.gov.in directory.",
            "official_portals": [
                {"name": "MyScheme", "url": "https://www.myscheme.gov.in"},
                {"name": "National Portal of India", "url": "https://www.india.gov.in"}
            ]
        }

    top_match = matches[0]
    top_service = top_match["service"]
    grounded_reasons = generate_grounded_response(top_service, answers)
    
    token_id = f"NM-{datetime.now().year}-{uuid.uuid4().hex[:6].upper()}"
    
    # Save conversation record to activity
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO activity_history (user_token, action_type, title, details)
    VALUES (?, ?, ?, ?)
    """, (
        token_id,
        "Recommendation Generated",
        f"Matched: {top_service['service_name']}",
        f"Intent: {intent} | Match: {top_match['score']}%"
    ))
    conn.commit()
    conn.close()

    return {
        "type": "result",
        "token_id": token_id,
        "timestamp": datetime.now().strftime("%d %b %Y, %I:%M %p"),
        "top_match": {
            "service": top_service,
            "score": top_match["score"],
            "grounded_reasons": grounded_reasons,
            "action_plan": [
                {
                    "step": 1,
                    "title": "Verify Eligibility Criteria",
                    "details": top_service["eligibility"][0] if top_service["eligibility"] else "Confirm basic residency and applicant criteria."
                },
                {
                    "step": 2,
                    "title": "Assemble Verified Documents",
                    "details": f"Gather mandatory proofs: {', '.join(top_service['required_documents'][:3])}."
                },
                {
                    "step": 3,
                    "title": "Access Official Portal",
                    "details": f"Visit {top_service['official_url']} (Verified Official Government Domain)."
                },
                {
                    "step": 4,
                    "title": "Submit Application & Save Reference",
                    "details": top_service["application_steps"][0] if top_service["application_steps"] else "Fill the digital application and note your Application ID."
                },
                {
                    "step": 5,
                    "title": "Track Status & Direct Benefit Transfer",
                    "details": "Monitor periodic status via the official portal or your NagrikMitra citizen dashboard."
                }
            ]
        },
        "alternate_matches": [
            {
                "service": m["service"],
                "score": m["score"]
            }
            for m in matches[1:]
        ]
    }

@router.post("/evaluate-eligibility")
def evaluate_eligibility(payload: EligibilityRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM services WHERE is_active = 1")
    rows = cursor.fetchall()
    conn.close()
    
    all_services = [parse_service_row(r) for r in rows]
    profile = payload.model_dump()
    results = evaluate_full_profile(profile, all_services)
    
    return {
        "profile": profile,
        "total_evaluated": len(results),
        "qualifying_count": len([r for r in results if r["match_percentage"] >= 65]),
        "recommendations": results
    }
