"""
NagrikMitra AI - Services API Endpoints
CRUD operations, search filters, categorization, and verification audit trails.
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List
import json
from datetime import datetime
from ..database import get_db, PLATFORMS

router = APIRouter(prefix="/api", tags=["Services"])

class ServiceCreateUpdate(BaseModel):
    id: Optional[str] = None
    service_name: str
    category: str
    ministry: Optional[str] = ""
    description: str
    states: Optional[List[str]] = ["All"]
    eligibility: Optional[List[str]] = []
    required_documents: Optional[List[str]] = []
    application_steps: Optional[List[str]] = []
    official_url: str
    source_name: str
    confidence: Optional[str] = "High"
    keywords: Optional[List[str]] = []

def parse_service_row(row):
    if not row:
        return None
    d = dict(row)
    for field in ["states", "eligibility", "required_documents", "application_steps", "keywords"]:
        val = d.get(field)
        if isinstance(val, str):
            try:
                d[field] = json.loads(val)
            except:
                d[field] = [val] if val else []
        elif val is None:
            d[field] = []
    return d

@router.get("/services")
def list_services(
    q: Optional[str] = None,
    category: Optional[str] = None,
    state: Optional[str] = None,
    confidence: Optional[str] = None
):
    conn = get_db()
    cursor = conn.cursor()
    
    query = "SELECT * FROM services WHERE is_active = 1"
    params = []
    
    if category and category != "All":
        query += " AND category = ?"
        params.append(category)
        
    if confidence and confidence != "All":
        query += " AND confidence = ?"
        params.append(confidence)
        
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    
    services = [parse_service_row(r) for r in rows]
    
    if q and q.strip():
        search_term = q.strip().lower()
        filtered = []
        for s in services:
            full_text = (
                s["service_name"] + " " +
                s["category"] + " " +
                s.get("ministry", "") + " " +
                s["description"] + " " +
                " ".join(s.get("keywords", [])) + " " +
                " ".join(s.get("eligibility", []))
            ).lower()
            if search_term in full_text:
                filtered.append(s)
        services = filtered

    if state and state != "All" and state != "Other":
        services = [
            s for s in services
            if "All" in s.get("states", ["All"]) or state in s.get("states", [])
        ]
        
    return {
        "count": len(services),
        "services": services
    }

@router.get("/services/{service_id}")
def get_service(service_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM services WHERE id = ?", (service_id,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=404, detail="Service not found")
        
    return parse_service_row(row)

@router.post("/services")
def create_service(payload: ServiceCreateUpdate):
    conn = get_db()
    cursor = conn.cursor()
    
    svc_id = payload.id or f"svc-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    today = datetime.now().strftime("%Y-%m-%d")
    
    cursor.execute("""
    INSERT INTO services (
        id, service_name, category, ministry, description, states,
        eligibility, required_documents, application_steps,
        official_url, source_name, last_verified, confidence, keywords
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        svc_id,
        payload.service_name,
        payload.category,
        payload.ministry or "",
        payload.description,
        json.dumps(payload.states),
        json.dumps(payload.eligibility),
        json.dumps(payload.required_documents),
        json.dumps(payload.application_steps),
        payload.official_url,
        payload.source_name,
        today,
        payload.confidence or "High",
        json.dumps(payload.keywords or [payload.service_name.lower()])
    ))
    
    cursor.execute("""
    INSERT INTO verification_logs (service_id, verified_by, verification_date, status, notes)
    VALUES (?, ?, ?, ?, ?)
    """, (svc_id, "Admin Portal", today, "Verified", "Initial scheme registration"))
    
    conn.commit()
    conn.close()
    return {"status": "created", "id": svc_id}

@router.put("/services/{service_id}")
def update_service(service_id: str, payload: ServiceCreateUpdate):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id FROM services WHERE id = ?", (service_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Service not found")
        
    cursor.execute("""
    UPDATE services SET
        service_name = ?,
        category = ?,
        ministry = ?,
        description = ?,
        states = ?,
        eligibility = ?,
        required_documents = ?,
        application_steps = ?,
        official_url = ?,
        source_name = ?,
        confidence = ?,
        keywords = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    """, (
        payload.service_name,
        payload.category,
        payload.ministry or "",
        payload.description,
        json.dumps(payload.states),
        json.dumps(payload.eligibility),
        json.dumps(payload.required_documents),
        json.dumps(payload.application_steps),
        payload.official_url,
        payload.source_name,
        payload.confidence or "High",
        json.dumps(payload.keywords or []),
        service_id
    ))
    
    conn.commit()
    conn.close()
    return {"status": "updated", "id": service_id}

@router.delete("/services/{service_id}")
def delete_service(service_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM services WHERE id = ?", (service_id,))
    conn.commit()
    conn.close()
    return {"status": "deleted", "id": service_id}

@router.post("/services/{service_id}/verify")
def verify_service(service_id: str, verified_by: Optional[str] = "Official Portal Audit"):
    conn = get_db()
    cursor = conn.cursor()
    today = datetime.now().strftime("%Y-%m-%d")
    
    cursor.execute("""
    UPDATE services SET last_verified = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    """, (today, service_id))
    
    cursor.execute("""
    INSERT INTO verification_logs (service_id, verified_by, verification_date, status, notes)
    VALUES (?, ?, ?, ?, ?)
    """, (service_id, verified_by, today, "Verified", "Portal URL and guidelines re-verified against official gazette / portal"))
    
    conn.commit()
    conn.close()
    return {"status": "verified", "last_verified": today}

@router.get("/categories")
def get_categories():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT category, COUNT(*) as count FROM services WHERE is_active = 1 GROUP BY category")
    rows = cursor.fetchall()
    conn.close()
    return [{"category": r["category"], "count": r["count"]} for r in rows]

@router.get("/platforms")
def get_platforms():
    return PLATFORMS

@router.get("/admin/logs")
def get_verification_logs():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT v.*, s.service_name
    FROM verification_logs v
    LEFT JOIN services s ON v.service_id = s.id
    ORDER BY v.id DESC LIMIT 30
    """)
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]
