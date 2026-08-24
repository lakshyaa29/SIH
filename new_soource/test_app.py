"""
NagrikMitra AI - End-to-End Automated Verification Test Suite
"""

import sys
import io

# Set UTF-8 encoding for standard output on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from fastapi.testclient import TestClient
from backend.app import app

client = TestClient(app)

def test_suite():
    print("\n[1/7] Testing Health Check Endpoint...")
    res = client.get("/api/health")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    data = res.json()
    assert data["status"] == "healthy"
    print(f"[PASS] Health Check Passed: {data}")

    print("\n[2/7] Testing Services Catalog & Filtering...")
    res = client.get("/api/services")
    assert res.status_code == 200
    data = res.json()
    assert data["count"] >= 20, f"Expected >= 20 schemes, found {data['count']}"
    print(f"[PASS] Services catalog loaded with {data['count']} government schemes.")

    # Search filter test
    res_search = client.get("/api/services?q=scholarship")
    assert res_search.status_code == 200
    search_data = res_search.json()
    assert search_data["count"] >= 1
    print(f"[PASS] Search filter for 'scholarship' returned {search_data['count']} match(es).")

    print("\n[3/7] Testing AI Assistant Intent Detection...")
    chat_payload = {"message": "I am a college student from Maharashtra seeking financial scholarship aid."}
    res_chat = client.post("/api/assistant/chat", json=chat_payload)
    assert res_chat.status_code == 200
    chat_data = res_chat.json()
    assert chat_data["type"] == "intent_detected"
    assert chat_data["intent"] == "Education"
    print(f"[PASS] Intent Detection Passed: {chat_data['intent_label']} (Confidence: {chat_data['confidence']}%)")

    print("\n[4/7] Testing AI Assistant Grounded RAG Retrieval...")
    rag_payload = {
        "message": "CompleteProfileRetrieval",
        "intent": "Education",
        "answers": {
            "state": "Maharashtra",
            "level": "Undergraduate (Degree / Diploma)",
            "income": "₹1.5 Lakh – ₹2.5 Lakh"
        }
    }
    res_rag = client.post("/api/assistant/chat", json=rag_payload)
    assert res_rag.status_code == 200
    rag_data = res_rag.json()
    assert rag_data["type"] == "result"
    top_svc = rag_data["top_match"]["service"]
    score = rag_data["top_match"]["score"]
    token = rag_data["token_id"]
    print(f"[PASS] Grounded Match: {top_svc['service_name']} (Match: {score}%, Token: {token})")
    print(f"  Grounded Reasons: {rag_data['top_match']['grounded_reasons']}")

    print("\n[5/7] Testing Multi-Factor Eligibility Calculator...")
    elig_payload = {
        "age": 24,
        "gender": "Female",
        "state": "Maharashtra",
        "caste_category": "General / OBC",
        "education": "Undergraduate",
        "occupation": "Student",
        "income": "Below ₹1.5 Lakh",
        "land_holding": "None",
        "disability_status": "No"
    }
    res_elig = client.post("/api/assistant/evaluate-eligibility", json=elig_payload)
    assert res_elig.status_code == 200
    elig_data = res_elig.json()
    assert elig_data["qualifying_count"] >= 1
    print(f"[PASS] Eligibility evaluation evaluated {elig_data['total_evaluated']} schemes, {elig_data['qualifying_count']} high qualification matches found.")

    print("\n[6/7] Testing CPGRAMS Grievance Diagnostic & Petition Drafter...")
    gr_payload = {
        "description": "I applied for my scholarship 45 days ago on NSP but disbursal is stuck without update.",
        "department": "Department of Higher Education",
        "ref_number": "MH2026-NSP-8821",
        "days_pending": 45
    }
    res_gr = client.post("/api/grievance/analyze", json=gr_payload)
    assert res_gr.status_code == 200
    gr_data = res_gr.json()
    assert gr_data["is_delayed"] == True
    print(f"[PASS] Grievance delay flagged: {gr_data['urgency']}")

    res_draft = client.post("/api/grievance/draft", json={
        "citizen_name": "Ramesh Kumar",
        "contact_number": "9876543210",
        "department": gr_data["suggested_department"],
        "scheme_name": "National Scholarship Portal",
        "ref_number": "MH2026-NSP-8821",
        "days_pending": 45,
        "issue_summary": gr_payload["description"]
    })
    assert res_draft.status_code == 200
    draft_data = res_draft.json()
    assert "CPGRAMS" in draft_data["formatted_draft"]
    print(f"[PASS] Formatted Petition generated with Case Reference: {draft_data['case_token']}")

    print("\n[7/7] Testing Citizen Dashboard & Admin Verification...")
    res_save = client.post("/api/dashboard/saved", json={
        "service_id": "nsp-scholarship",
        "status": "Applied",
        "notes": "College verification pending"
    })
    assert res_save.status_code == 200
    print(f"[PASS] Saved service status recorded in database.")

    res_verify = client.post("/api/services/nsp-scholarship/verify")
    assert res_verify.status_code == 200
    print(f"[PASS] Scheme re-verified with timestamp: {res_verify.json()['last_verified']}")

    print("\n" + "=" * 65)
    print("  ALL 7 END-TO-END AUTOMATED TESTS PASSED SUCCESSFULLY! (100%)")
    print("=" * 65 + "\n")

if __name__ == "__main__":
    test_suite()
