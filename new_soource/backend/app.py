"""
NagrikMitra AI - Main FastAPI Application
Connects all API routers, serves static frontend assets, and provides health check endpoints.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .routes import services_api, assistant_api, grievance_api, dashboard_api
from .database import init_db

# Initialize database schema and seeds
init_db()

app = FastAPI(
    title="NagrikMitra AI — Government Services Assistant",
    description="Intelligent Citizen Services Assistant with RAG-grounded retrieval, eligibility checking, CPGRAMS grievance assistance, and verified official portals.",
    version="2.0.0"
)

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(services_api.router)
app.include_router(assistant_api.router)
app.include_router(grievance_api.router)
app.include_router(dashboard_api.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "NagrikMitra AI Backend",
        "version": "2.0.0",
        "database": "SQLite (Connected)"
    }

# Static file serving for Frontend
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")

if os.path.exists(FRONTEND_DIR):
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

@app.get("/")
def serve_index():
    index_file = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "NagrikMitra AI Backend is running. Frontend static directory not initialized."}
