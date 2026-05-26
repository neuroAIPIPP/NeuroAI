"""
Face Recognition Module
========================
Port dari Streamlit monolith ke FastAPI REST API.
Menggunakan face_recognition + dlib + OpenCV untuk encoding dan verifikasi wajah.

Endpoints:
    POST /face/register  - Upload foto wajah referensi
    POST /face/verify    - Verifikasi wajah dari frame webcam (base64)
    GET  /face/list      - Daftar wajah terdaftar
    DELETE /face/{name}  - Hapus wajah dari daftar
    GET  /face/status    - Status module
"""

import base64
import json
import os
import pickle
import tempfile
from datetime import datetime
from typing import Optional

import cv2
import numpy as np
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel

router = APIRouter()

# ============================================================
# Model Directory
# ============================================================
MODEL_DIR = os.path.join(os.path.dirname(__file__), "saved_models")
os.makedirs(MODEL_DIR, exist_ok=True)


# ============================================================
# Pydantic Models
# ============================================================
class VerifyRequest(BaseModel):
    """Request verifikasi wajah dari base64 image."""

    image_base64: str
    tolerance: float = 0.6


class VerifyResponse(BaseModel):
    faces_detected: int
    recognized_faces: list[dict]
    is_verified: bool


class FaceListResponse(BaseModel):
    total_faces: int
    names: list[str]
    last_saved: Optional[str] = None


class RegisterResponse(BaseModel):
    status: str
    name: str
    message: str


class DeleteResponse(BaseModel):
    status: str
    name: str
    message: str


# ============================================================
# FaceRecognitionEngine (ported from Streamlit app)
# ============================================================
class FaceRecognitionEngine:
    """
    Engine pengenalan wajah yang dapat menyimpan/memuat model.
    Di-port dari class FaceRecognitionApp di project Face Recognition.
    """

    def __init__(self):
        self.known_face_encodings: list = []
        self.known_face_names: list[str] = []
        self.model_dir = MODEL_DIR
        self._load_saved_model()

    def _get_model_path(self, filename: str) -> str:
        return os.path.join(self.model_dir, filename)

    def save_model(self) -> bool:
        """Simpan model encoding wajah ke file pickle."""
        try:
            model_data = {
                "encodings": self.known_face_encodings,
                "names": self.known_face_names,
            }

            with open(self._get_model_path("face_encodings.pkl"), "wb") as f:
                pickle.dump(model_data, f)

            metadata = {
                "names": self.known_face_names,
                "total_faces": len(self.known_face_names),
                "last_saved": datetime.now().isoformat(),
            }
            with open(self._get_model_path("face_metadata.json"), "w") as f:
                json.dump(metadata, f, indent=2)

            print(f"[SAVE] [Face] Model disimpan: {len(self.known_face_names)} wajah")
            return True
        except Exception as e:
            print(f"[ERROR] [Face] Error simpan model: {e}")
            return False

    def _load_saved_model(self) -> bool:
        """Muat model encoding wajah dari file."""
        try:
            model_path = self._get_model_path("face_encodings.pkl")
            if os.path.exists(model_path):
                with open(model_path, "rb") as f:
                    model_data = pickle.load(f)
                self.known_face_encodings = model_data["encodings"]
                self.known_face_names = model_data["names"]
                print(
                    f"[SUCCESS] [Face] Model dimuat: {len(self.known_face_names)} wajah"
                )
                return True
            else:
                print("[INFO] [Face] Tidak ada model tersimpan")
                return False
        except Exception as e:
            print(f"[ERROR] [Face] Error muat model: {e}")
            return False

    def register_face(self, image_data: bytes, name: str) -> tuple[bool, str]:
        """
        Daftarkan wajah baru dari image bytes.
        Returns: (success, message)
        """
        try:
            import face_recognition

            # Decode image from bytes using OpenCV
            nparr = np.frombuffer(image_data, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if frame is None:
                return False, "Gagal memproses gambar"

            # Convert to RGB (required by face_recognition)
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            # Detect face locations first to ensure there is a face
            face_locations = face_recognition.face_locations(rgb_frame)
            if not face_locations:
                return False, "Tidak ada wajah terdeteksi dalam foto"

            # Extract encodings
            encodings = face_recognition.face_encodings(rgb_frame, face_locations)

            if not encodings:
                return False, "Tidak ada wajah terdeteksi dalam foto"

            # Cek duplikat nama
            if name in self.known_face_names:
                # Update encoding yang sudah ada
                idx = self.known_face_names.index(name)
                self.known_face_encodings[idx] = encodings[0]
                self.save_model()
                return True, f"Wajah '{name}' berhasil diperbarui"

            self.known_face_encodings.append(encodings[0])
            self.known_face_names.append(name)
            self.save_model()

            return True, f"Wajah '{name}' berhasil didaftarkan"

        except ImportError:
            return False, "Library face_recognition tidak terinstall"
        except Exception as e:
            return False, f"Error: {str(e)}"

    def verify_face(
        self, image_data: bytes, tolerance: float = 0.6
    ) -> tuple[int, list[dict]]:
        """
        Verifikasi wajah dari image bytes.
        Returns: (faces_detected, list of {name, confidence, location})
        """
        try:
            import face_recognition

            # Decode image
            nparr = np.frombuffer(image_data, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if frame is None:
                return 0, []

            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            # Detect faces
            face_locations = face_recognition.face_locations(rgb_frame)
            if not face_locations:
                return 0, []

            face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

            results = []
            for encoding, location in zip(face_encodings, face_locations):
                name = "Tidak Dikenal"
                confidence = 0.0

                if self.known_face_encodings:
                    # Hitung jarak (distance) ke semua wajah yang dikenal
                    distances = face_recognition.face_distance(
                        self.known_face_encodings, encoding
                    )
                    matches = face_recognition.compare_faces(
                        self.known_face_encodings, encoding, tolerance=tolerance
                    )

                    if True in matches:
                        best_idx = np.argmin(distances)
                        if matches[best_idx]:
                            name = self.known_face_names[best_idx]
                            confidence = float(1.0 - distances[best_idx])

                top, right, bottom, left = location
                results.append(
                    {
                        "name": name,
                        "confidence": round(confidence, 4),
                        "is_known": name != "Tidak Dikenal",
                        "location": {
                            "top": top,
                            "right": right,
                            "bottom": bottom,
                            "left": left,
                        },
                    }
                )

            return len(face_locations), results

        except ImportError:
            print("[WARNING] [Face] face_recognition library not installed")
            return 0, []
        except Exception as e:
            print(f"[ERROR] [Face] Verify error: {e}")
            return 0, []

    def delete_face(self, name: str) -> tuple[bool, str]:
        """Hapus wajah dari daftar."""
        if name in self.known_face_names:
            idx = self.known_face_names.index(name)
            self.known_face_names.pop(idx)
            self.known_face_encodings.pop(idx)
            self.save_model()
            return True, f"Wajah '{name}' berhasil dihapus"
        return False, f"Wajah '{name}' tidak ditemukan"

    def get_metadata(self) -> dict:
        """Ambil metadata model."""
        metadata_path = self._get_model_path("face_metadata.json")
        if os.path.exists(metadata_path):
            with open(metadata_path, "r") as f:
                return json.load(f)
        return {
            "names": self.known_face_names,
            "total_faces": len(self.known_face_names),
            "last_saved": None,
        }


# ============================================================
# Initialize Engine
# ============================================================
engine = FaceRecognitionEngine()


# ============================================================
# API Endpoints
# ============================================================
@router.post("/register", response_model=RegisterResponse)
async def register_face(name: str = Form(...), file: UploadFile = File(...)):
    """
    Daftarkan wajah baru.
    - Upload foto wajah (jpg/png)
    - Berikan nama untuk wajah tersebut
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File harus berupa gambar")

    image_data = await file.read()
    success, message = engine.register_face(image_data, name)

    if not success:
        raise HTTPException(status_code=400, detail=message)

    return RegisterResponse(status="success", name=name, message=message)


@router.post("/verify", response_model=VerifyResponse)
async def verify_face(request: VerifyRequest):
    """
    Verifikasi wajah dari base64 image.
    Digunakan oleh frontend untuk verifikasi identitas saat session.
    """
    try:
        # Decode base64
        image_data = base64.b64decode(request.image_base64)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid base64 image data")

    faces_detected, results = engine.verify_face(image_data, request.tolerance)

    is_verified = any(r["is_known"] for r in results)

    return VerifyResponse(
        faces_detected=faces_detected,
        recognized_faces=results,
        is_verified=is_verified,
    )


@router.get("/list", response_model=FaceListResponse)
async def list_faces():
    """Daftar semua wajah yang terdaftar."""
    metadata = engine.get_metadata()
    return FaceListResponse(
        total_faces=metadata.get("total_faces", 0),
        names=metadata.get("names", []),
        last_saved=metadata.get("last_saved"),
    )


@router.delete("/{name}", response_model=DeleteResponse)
async def delete_face(name: str):
    """Hapus wajah dari daftar berdasarkan nama."""
    success, message = engine.delete_face(name)
    if not success:
        raise HTTPException(status_code=404, detail=message)

    return DeleteResponse(status="success", name=name, message=message)


@router.get("/status")
async def get_status():
    """Status module face recognition."""
    try:
        import face_recognition  # noqa: F401

        fr_available = True
    except ImportError:
        fr_available = False

    return {
        "face_recognition_available": fr_available,
        "total_registered_faces": len(engine.known_face_names),
        "registered_names": engine.known_face_names,
    }
