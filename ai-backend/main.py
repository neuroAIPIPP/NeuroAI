"""
NeuroAI Unified AI Backend
===========================
FastAPI gateway yang menyatukan semua modul AI:
- EEG Recording (Muse via LSL)
- Eye Tracking Data Receiver
- Face Recognition (Verification & Detection)

Jalankan:
    uvicorn main:app --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from analysis.router import router as analysis_router
from eeg.router import router as eeg_router
from eye_tracking.router import router as eye_tracking_router
from face_module.router import router as face_recognition_router

app = FastAPI(
    title="NeuroAI AI Backend",
    description="Unified backend for EEG, Eye Tracking, and Face Recognition",
    version="1.0.0",
)

# CORS - Allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(eeg_router, prefix="/eeg", tags=["EEG"])
app.include_router(eye_tracking_router, prefix="/eye-tracking", tags=["Eye Tracking"])
app.include_router(face_recognition_router, prefix="/face", tags=["Face Recognition"])
app.include_router(analysis_router, prefix="/analysis", tags=["Analysis"])


@app.get("/")
async def root():
    return {
        "service": "NeuroAI AI Backend",
        "version": "1.0.0",
        "modules": {
            "eeg": "/eeg",
            "eye_tracking": "/eye-tracking",
            "face_recognition": "/face",
            "analysis": "/analysis",
        },
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.on_event("shutdown")
def on_shutdown():
    from eye_tracking.router import cleanup_active_sessions
    cleanup_active_sessions()
