"""
NagrikMitra AI - Dashboard & Citizen Tracker API Endpoints
Application timeline tracking, saved services, document locker stats, and activity logging.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..database import get_db, PLATFORMS
from .services_api import parse_service_row

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

class SaveServiceRequest(BaseModel):
    service_id: str
    user_token: Optional[str] = "default_citizen"
    status: Optional[str] = "Saved"
    notes: Optional[str] = ""

class UpdateSavedStatusRequest(BaseModel):
    status: str
    notes: Optional[str] = ""

class LogActivityRequest(BaseModel):
    user_token: Optional[str] = "default_citizen"
    action_type: str
    title: str
    details: Optional[str] = ""

@router.get("/stats")
def get_dashboard_stats(user_token: Optional[str] = "default_citizen"):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) as total_services FROM services WHERE is_active = 1")
    total_services = cursor.fetchone()["total_services"]
    
    cursor.execute("SELECT COUNT(DISTINCT category) as total_categories FROM services WHERE is_active = 1")
    total_categories = cursor.fetchone()["total_categories"]
    
    cursor.execute("SELECT COUNT(*) as total_saved FROM saved_services WHERE user_token = ?", (user_token,))
    total_saved = cursor.fetchone()["total_saved"]
    
    cursor.execute("SELECT COUNT(*) as total_grievances FROM grievance_cases")
    total_grievances = cursor.fetchone()["total_grievances"]
    
    conn.close()
    
    return {
        "total_services": total_services,
        "total_categories": total_categories,
        "total_platforms": len(PLATFORMS),
        "total_saved": total_saved,
        "total_grievances": total_grievances,
        "verification_rate": "100% Sourced"
    }

@router.get("/saved")
def get_saved_services(user_token: Optional[str] = "default_citizen"):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("""
    SELECT ss.id as saved_id, ss.status, ss.notes, ss.saved_at, s.*
    FROM saved_services ss
    JOIN services s ON ss.service_id = s.id
    WHERE ss.user_token = ?
    ORDER BY ss.saved_at DESC
    """, (user_token,))
    
    rows = cursor.fetchall()
    conn.close()
    
    result = []
    for r in rows:
        d = parse_service_row(r)
        d["saved_id"] = r["saved_id"]
        d["application_status"] = r["status"]
        d["user_notes"] = r["notes"]
        d["saved_at"] = r["saved_at"]
        result.append(d)
        
    return result

@router.post("/saved")
def save_service(payload: SaveServiceRequest):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT service_name FROM services WHERE id = ?", (payload.service_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Service not found")
        
    svc_name = row["service_name"]
    
    cursor.execute("""
    INSERT INTO saved_services (service_id, user_token, status, notes)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(service_id, user_token) DO UPDATE SET
        status = excluded.status,
        notes = excluded.notes
    """, (payload.service_id, payload.user_token, payload.status, payload.notes))
    
    cursor.execute("""
    INSERT INTO activity_history (user_token, action_type, title, details)
    VALUES (?, ?, ?, ?)
    """, (payload.user_token, "Saved Service", f"Saved {svc_name}", f"Status set to {payload.status}"))
    
    conn.commit()
    conn.close()
    return {"status": "saved", "service_id": payload.service_id}

@router.put("/saved/{saved_id}")
def update_saved_service(saved_id: int, payload: UpdateSavedStatusRequest):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("""
    UPDATE saved_services
    SET status = ?, notes = ?
    WHERE id = ?
    """, (payload.status, payload.notes, saved_id))
    
    conn.commit()
    conn.close()
    return {"status": "updated", "saved_id": saved_id}

@router.delete("/saved/{saved_id}")
def delete_saved_service(saved_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM saved_services WHERE id = ?", (saved_id,))
    conn.commit()
    conn.close()
    return {"status": "removed", "saved_id": saved_id}

@router.get("/activity")
def get_activity_history(user_token: Optional[str] = "default_citizen"):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT * FROM activity_history
    WHERE user_token = ? OR user_token LIKE 'NM-%'
    ORDER BY created_at DESC LIMIT 20
    """, (user_token,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.post("/activity")
def log_activity(payload: LogActivityRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO activity_history (user_token, action_type, title, details)
    VALUES (?, ?, ?, ?)
    """, (payload.user_token, payload.action_type, payload.title, payload.details))
    conn.commit()
    conn.close()
    return {"status": "logged"}
