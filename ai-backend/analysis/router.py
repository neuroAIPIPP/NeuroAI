"""
Analysis API Router
====================
FastAPI endpoints untuk menjalankan analisis konsentrasi.

Endpoints:
    POST /analysis/analyze          - Analisis session berdasarkan file paths
    POST /analysis/eye-tracking     - Analisis file eye tracking CSV saja
    POST /analysis/eeg              - Analisis file EEG CSV saja
    GET  /analysis/status           - Status module
"""

from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel

from .concentration import (
    analyze_eeg_csv,
    analyze_eye_tracking_csv,
    analyze_session,
    calculate_concentration_score,
)
from .gemini_insights import generate_concentration_insights

router = APIRouter()


# ============================================================
# Pydantic Models
# ============================================================


class AnalyzeSessionRequest(BaseModel):
    """Request untuk analisis full session."""

    eye_tracking_files: list[str] = []  # List of CSV file paths
    eeg_file: Optional[str] = None  # Single EEG CSV file path
    video_titles: Optional[list[str]] = None  # Video/materi titles
    mata_kuliah: Optional[str] = None  # Nama mata kuliah
    generate_ai_insights: bool = True  # Whether to call Gemini
    face_verification_ratio: Optional[float] = None  # % of time face is verified


class AnalyzeSingleFileRequest(BaseModel):
    """Request untuk analisis single file."""

    file_path: str


class AnalyzeSessionResponse(BaseModel):
    """Full analysis response."""

    status: str
    overall: dict
    per_video: list
    eeg_analysis: dict
    session_summary: dict
    ai_insights: Optional[dict] = None


# ============================================================
# API Endpoints
# ============================================================


@router.post("/analyze", response_model=AnalyzeSessionResponse)
async def analyze_full_session(request: AnalyzeSessionRequest):
    """
    Analisis lengkap satu session.
    Menerima file paths CSV eye tracking + EEG, mengembalikan concentration metrics + AI insights.
    """
    # Run core analysis
    analysis_result = analyze_session(
        eye_tracking_files=request.eye_tracking_files,
        eeg_file=request.eeg_file,
        video_titles=request.video_titles,
    )

    # Generate AI insights (optional)
    ai_insights = None
    if request.generate_ai_insights:
        # Menambahkan face verification ratio ke dalam hasil analysis_result
        # agar bisa dibaca oleh prompt AI
        if request.face_verification_ratio is not None:
            analysis_result["overall"]["face_verification_ratio"] = request.face_verification_ratio

        ai_insights = generate_concentration_insights(
            analysis_data=analysis_result,
            video_titles=request.video_titles,
            mata_kuliah=request.mata_kuliah,
        )

    return AnalyzeSessionResponse(
        status="success",
        overall=analysis_result["overall"],
        per_video=analysis_result["per_video"],
        eeg_analysis=analysis_result["eeg_analysis"],
        session_summary=analysis_result["session_summary"],
        ai_insights=ai_insights,
    )


@router.post("/eye-tracking")
async def analyze_eye_tracking(request: AnalyzeSingleFileRequest):
    """Analisis file eye tracking CSV saja."""
    result = analyze_eye_tracking_csv(request.file_path)
    return {"status": "success", "analysis": result}


@router.post("/eeg")
async def analyze_eeg(request: AnalyzeSingleFileRequest):
    """Analisis file EEG CSV saja."""
    result = analyze_eeg_csv(request.file_path)
    return {"status": "success", "analysis": result}


@router.get("/status")
async def get_status():
    """Status module analysis."""
    from .gemini_insights import _get_gemini_client

    gemini_available = _get_gemini_client() is not None

    return {
        "module": "Analysis",
        "status": "ready",
        "gemini_available": gemini_available,
        "supported_analyses": [
            "eye_tracking",
            "eeg",
            "concentration_score",
            "ai_insights",
        ],
    }
