"""
EEG Recording Module
=====================
Port dari Flask EEG backend ke FastAPI router.
Menggunakan Lab Streaming Layer (LSL) untuk membaca data dari Muse EEG headband.

Endpoints:
    POST /eeg/start   - Mulai perekaman EEG
    POST /eeg/marker  - Set marker pada data EEG
    POST /eeg/stop    - Stop perekaman EEG
    GET  /eeg/status  - Cek status perekaman
"""

import csv
import os
import threading
import time
from datetime import datetime

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

# ============================================================
# Global State with Thread Synchronization
# ============================================================
state_lock = threading.Lock()
is_recording_event = threading.Event()
recording_thread: threading.Thread | None = None
current_marker = "Idle"
current_filename = ""
recording_mode = "None"  # "Real", "Mock", or "None"

# Perekaman recordings directory
RECORDINGS_DIR = os.path.join(os.path.dirname(__file__), "recordings")
os.makedirs(RECORDINGS_DIR, exist_ok=True)


# ============================================================
# Pydantic Models
# ============================================================
class MarkerRequest(BaseModel):
    label: str = "Unknown"


class StartResponse(BaseModel):
    status: str
    file: str = ""


class StopResponse(BaseModel):
    status: str
    file: str = ""


class StatusResponse(BaseModel):
    is_recording: bool
    current_marker: str
    current_file: str
    recording_mode: str = "None"


# ============================================================
# LSL Stream Functions
# ============================================================
def find_muse_stream():
    """Mencari stream EEG dari Muse via LSL. Timeout 5 detik."""
    try:
        from pylsl import StreamInlet, resolve_byprop

        print("🔵 [EEG] Mencari sinyal Muse...")
        streams = resolve_byprop("type", "EEG", timeout=5)
        if len(streams) == 0:
            return None
        print("✅ [EEG] Muse Ditemukan & Terhubung!")
        return StreamInlet(streams[0])
    except ImportError:
        print("⚠️ [EEG] pylsl tidak terinstall. EEG recording tidak tersedia.")
        return None
    except Exception as e:
        print(f"⚠️ [EEG] Error mencari stream: {e}")
        return None


def record_loop(filename: str):
    """
    Loop utama perekaman EEG.
    - Mencari stream Muse LSL asli.
    - Jika tidak ditemukan dalam 3 detik, fallback ke SIMULASI EEG (Mock Mode)
      agar aplikasi dapat ditest secara end-to-end tanpa alat fisik.
    """
    global recording_mode

    print(f"🔴 [EEG] MEMULAI PEREKAMAN KE FILE: {filename}")
    
    import random
    import math

    with open(filename, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(
            ["Timestamp", "TP9", "AF7", "AF8", "TP10", "Right AUX", "Marker"]
        )
        f.flush()

        inlet = None
        attempt = 0
        use_mock = False

        while is_recording_event.is_set():
            # 1. Coba koneksi LSL
            if inlet is None and not use_mock:
                inlet = find_muse_stream()
                if inlet is None:
                    attempt += 1
                    if attempt >= 3:  # Coba 3 kali (sekitar 3 detik)
                        print("⚠️ [EEG] Muse LSL tidak ditemukan.")
                        print("🔄 [EEG] Beralih ke SIMULASI EEG (Mock Mode) untuk testing...")
                        use_mock = True
                        with state_lock:
                            recording_mode = "Mock"
                    else:
                        time.sleep(1)
                        continue
                else:
                    with state_lock:
                        recording_mode = "Real"

            # 2. Tarik Data
            if use_mock:
                # Simulasi rate ~256 Hz (kita tulis per 100ms berisi 25 samples)
                time.sleep(0.1)
                rows = []
                base_time = time.time()
                with state_lock:
                    marker = current_marker
                for i in range(25):
                    t = base_time - (25 - i) * 0.004
                    # Buat sinyal sinusoidal + noise acak (10-100 uV)
                    tp9 = 50.0 + 8.0 * math.sin(t * 2 * math.pi * 10) + random.uniform(-1.5, 1.5)
                    af7 = 44.0 + 12.0 * math.sin(t * 2 * math.pi * 8) + random.uniform(-1.5, 1.5)
                    af8 = 46.0 + 10.0 * math.sin(t * 2 * math.pi * 12) + random.uniform(-1.5, 1.5)
                    tp10 = 52.0 + 7.0 * math.sin(t * 2 * math.pi * 10) + random.uniform(-1.5, 1.5)
                    aux = 20.0 + random.uniform(-0.5, 0.5)
                    
                    rows.append([t, tp9, af7, af8, tp10, aux, marker])
                
                try:
                    writer.writerows(rows)
                    f.flush()
                    os.fsync(f.fileno())
                except Exception as e:
                    print(f"⚠️ [EEG] Error menulis simulasi: {e}")
            else:
                # Real LSL mode
                try:
                    chunk, timestamps = inlet.pull_chunk(timeout=1.0, max_samples=32)

                    if timestamps:
                        rows = []
                        with state_lock:
                            marker = current_marker
                        for i in range(len(timestamps)):
                            row = [timestamps[i]] + chunk[i] + [marker]
                            rows.append(row)

                        writer.writerows(rows)
                        f.flush()
                        os.fsync(f.fileno())

                except Exception as e:
                    print(f"⚠️ [EEG] Koneksi LSL terputus: {e}")
                    print("🔄 [EEG] Mencoba menyambung ulang...")
                    inlet = None
                    with state_lock:
                        recording_mode = "None"
                    attempt = 0

    print("⏹️ [EEG] Perekaman Selesai.")
    with state_lock:
        recording_mode = "None"


# ============================================================
# API Endpoints
# ============================================================
@router.post("/start", response_model=StartResponse)
async def start_recording():
    """Mulai perekaman EEG ke file CSV."""
    global recording_thread, current_filename, current_marker

    if not is_recording_event.is_set():
        is_recording_event.set()
        with state_lock:
            current_marker = "Focus_Session_Start"
            timestamp_str = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
            current_filename = os.path.join(RECORDINGS_DIR, f"EEG_{timestamp_str}.csv")
            filename = current_filename

        recording_thread = threading.Thread(
            target=record_loop, args=(filename,)
        )
        recording_thread.start()

        return StartResponse(status="started", file=filename)

    with state_lock:
        filename = current_filename
    return StartResponse(status="already_running", file=filename)


@router.post("/marker")
async def set_marker(request: MarkerRequest):
    """Set marker pada data EEG yang sedang direkam."""
    global current_marker
    with state_lock:
        current_marker = request.label.replace(" ", "_")
        marker = current_marker
    print(f"📍 [EEG MARKER] {marker}")
    return {"status": "ok", "marker": marker}


@router.post("/stop", response_model=StopResponse)
async def stop_recording():
    """Stop perekaman EEG."""
    global recording_thread

    if is_recording_event.is_set():
        is_recording_event.clear()
        if recording_thread:
            recording_thread.join(timeout=5)
            recording_thread = None
        with state_lock:
            filename = current_filename
        return StopResponse(status="saved", file=filename)

    return StopResponse(status="not_running")


@router.get("/status", response_model=StatusResponse)
async def get_status():
    """Cek status perekaman EEG."""
    with state_lock:
        return StatusResponse(
            is_recording=is_recording_event.is_set(),
            current_marker=current_marker,
            current_file=current_filename,
            recording_mode=recording_mode,
        )
