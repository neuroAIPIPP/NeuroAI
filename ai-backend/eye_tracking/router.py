"""
Eye Tracking Data Receiver Module
===================================
Backend webhook/API untuk menerima dan menyimpan data eye tracking
dari frontend (MediaPipe + WebGazer).

Endpoints:
    POST /eye-tracking/data       - Terima data tracking per-frame
    POST /eye-tracking/batch      - Terima batch data sekaligus
    POST /eye-tracking/session/start - Mulai session baru
    POST /eye-tracking/session/stop  - Stop session & simpan
    GET  /eye-tracking/session/{id}  - Ambil data session
    GET  /eye-tracking/status        - Status module
"""

import csv
import os
import json
from datetime import datetime
from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

# ============================================================
# Direktori penyimpanan
# ============================================================
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True)

# ============================================================
# In-memory session state
# ============================================================
active_sessions: dict[str, dict] = {}


# ============================================================
# Pydantic Models
# ============================================================
class EyeTrackingDataPoint(BaseModel):
    """Single data point dari frontend eye tracking."""

    timestamp: float  # Unix timestamp atau elapsed ms
    video_time: float = 0.0  # Posisi video saat data diambil

    # MediaPipe pupil coordinates (normalized 0-1)
    left_pupil_x: Optional[float] = None
    left_pupil_y: Optional[float] = None
    right_pupil_x: Optional[float] = None
    right_pupil_y: Optional[float] = None

    # Gaze analysis
    is_focused: bool = False
    gaze_direction: str = "center"  # center, left, right, up, down

    # WebGazer screen coordinates (pixels)
    screen_x: Optional[float] = None
    screen_y: Optional[float] = None
    screen_region: Optional[str] = None  # top-left, center, bottom-right, etc.


class BatchDataRequest(BaseModel):
    """Batch data dari frontend."""

    session_id: str
    data_points: list[EyeTrackingDataPoint]


class SessionStartRequest(BaseModel):
    """Request untuk mulai session."""

    user_id: Optional[str] = None
    video_title: str = ""
    mode: str = "combined"  # mediapipe, webgazer, combined


class SessionStartResponse(BaseModel):
    session_id: str
    status: str
    file_path: str


class SessionStopRequest(BaseModel):
    session_id: str


class SessionStopResponse(BaseModel):
    session_id: str
    status: str
    total_data_points: int
    file_path: str


# ============================================================
# Helper Functions
# ============================================================
def generate_session_id() -> str:
    """Generate unique session ID."""
    return datetime.now().strftime("ET_%Y%m%d_%H%M%S")


def get_csv_writer(session_id: str):
    """Get or create CSV writer for a session."""
    session = active_sessions.get(session_id)
    if session and "writer" in session:
        return session["writer"], session["file"]
    return None, None


# ============================================================
# API Endpoints
# ============================================================
@router.post("/session/start", response_model=SessionStartResponse)
async def start_session(request: SessionStartRequest):
    """Mulai session eye tracking baru, buat file CSV."""
    session_id = generate_session_id()
    filename = os.path.join(DATA_DIR, f"{session_id}.csv")

    file_handle = open(filename, "w", newline="")
    writer = csv.writer(file_handle)
    writer.writerow(
        [
            "timestamp",
            "video_time",
            "left_pupil_x",
            "left_pupil_y",
            "right_pupil_x",
            "right_pupil_y",
            "is_focused",
            "gaze_direction",
            "screen_x",
            "screen_y",
            "screen_region",
        ]
    )
    file_handle.flush()

    active_sessions[session_id] = {
        "file": file_handle,
        "writer": writer,
        "filename": filename,
        "user_id": request.user_id,
        "video_title": request.video_title,
        "mode": request.mode,
        "start_time": datetime.now().isoformat(),
        "data_count": 0,
    }

    print(f"👁️ [Eye Tracking] Session started: {session_id}")
    return SessionStartResponse(
        session_id=session_id, status="started", file_path=filename
    )


@router.post("/data")
async def receive_data(session_id: str, data: EyeTrackingDataPoint):
    """Terima satu data point eye tracking."""
    session = active_sessions.get(session_id)
    if not session:
        return {"status": "error", "message": f"Session {session_id} not found"}

    writer = session["writer"]
    writer.writerow(
        [
            data.timestamp,
            data.video_time,
            data.left_pupil_x,
            data.left_pupil_y,
            data.right_pupil_x,
            data.right_pupil_y,
            1 if data.is_focused else 0,
            data.gaze_direction,
            data.screen_x,
            data.screen_y,
            data.screen_region,
        ]
    )
    session["file"].flush()
    session["data_count"] += 1

    return {"status": "ok", "data_count": session["data_count"]}


@router.post("/batch")
async def receive_batch(request: BatchDataRequest):
    """Terima batch data points sekaligus (lebih efisien)."""
    session = active_sessions.get(request.session_id)
    if not session:
        return {
            "status": "error",
            "message": f"Session {request.session_id} not found",
        }

    writer = session["writer"]
    for data in request.data_points:
        writer.writerow(
            [
                data.timestamp,
                data.video_time,
                data.left_pupil_x,
                data.left_pupil_y,
                data.right_pupil_x,
                data.right_pupil_y,
                1 if data.is_focused else 0,
                data.gaze_direction,
                data.screen_x,
                data.screen_y,
                data.screen_region,
            ]
        )
    session["file"].flush()
    session["data_count"] += len(request.data_points)

    print(
        f"👁️ [Eye Tracking] Batch received: {len(request.data_points)} points (total: {session['data_count']})"
    )
    return {
        "status": "ok",
        "received": len(request.data_points),
        "total": session["data_count"],
    }


@router.post("/session/stop", response_model=SessionStopResponse)
async def stop_session(request: SessionStopRequest):
    """Stop session eye tracking dan tutup file CSV."""
    session = active_sessions.get(request.session_id)
    if not session:
        return SessionStopResponse(
            session_id=request.session_id,
            status="not_found",
            total_data_points=0,
            file_path="",
        )

    # Tutup file
    session["file"].close()
    total = session["data_count"]
    filename = session["filename"]

    # Simpan metadata session
    metadata = {
        "session_id": request.session_id,
        "user_id": session.get("user_id"),
        "video_title": session.get("video_title"),
        "mode": session.get("mode"),
        "start_time": session.get("start_time"),
        "end_time": datetime.now().isoformat(),
        "total_data_points": total,
        "csv_file": filename,
    }
    metadata_file = filename.replace(".csv", "_metadata.json")
    with open(metadata_file, "w") as f:
        json.dump(metadata, f, indent=2)

    # Cleanup
    del active_sessions[request.session_id]

    print(
        f"👁️ [Eye Tracking] Session stopped: {request.session_id} ({total} data points)"
    )
    return SessionStopResponse(
        session_id=request.session_id,
        status="saved",
        total_data_points=total,
        file_path=filename,
    )


@router.get("/status")
async def get_status():
    """Status module eye tracking."""
    return {
        "active_sessions": len(active_sessions),
        "sessions": [
            {
                "id": sid,
                "data_count": s["data_count"],
                "video_title": s.get("video_title"),
                "start_time": s.get("start_time"),
            }
            for sid, s in active_sessions.items()
        ],
    }
