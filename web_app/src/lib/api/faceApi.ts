/**
 * Face Recognition API Client
 * =============================
 * Komunikasi dengan NeuroAI AI Backend - Face Recognition Module
 */

const API_BASE =
  process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://127.0.0.1:8000';
const FACE_API = `${API_BASE}/face`;

export interface FaceResult {
  name: string;
  confidence: number;
  is_known: boolean;
  location: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface VerifyResponse {
  faces_detected: number;
  recognized_faces: FaceResult[];
  is_verified: boolean;
}

export interface FaceListResponse {
  total_faces: number;
  names: string[];
  last_saved: string | null;
}

export const faceApi = {
  /**
   * Daftarkan wajah baru dengan upload foto.
   * @param name - Nama orang
   * @param imageFile - File gambar (jpg/png)
   */
  registerFace: async (
    name: string,
    imageFile: File,
  ): Promise<{ status: string; name: string; message: string }> => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('file', imageFile);

      const res = await fetch(`${FACE_API}/register`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        return {
          status: 'error',
          name,
          message: err.detail || 'Register failed',
        };
      }

      return await res.json();
    } catch (e) {
      console.warn('[Face] Register error:', e);
      return { status: 'error', name, message: 'Backend tidak tersedia' };
    }
  },

  /**
   * Verifikasi wajah dari base64 encoded image.
   * Digunakan untuk cek identitas saat mulai session.
   * @param imageBase64 - Base64 string dari frame webcam (tanpa prefix data:image/...)
   * @param tolerance - Toleransi pencocokan (default 0.6, lebih rendah = lebih ketat)
   */
  verifyFace: async (
    imageBase64: string,
    tolerance: number = 0.6,
  ): Promise<VerifyResponse> => {
    try {
      const res = await fetch(`${FACE_API}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_base64: imageBase64,
          tolerance,
        }),
      });

      if (!res.ok) {
        return { faces_detected: 0, recognized_faces: [], is_verified: false };
      }

      return await res.json();
    } catch (e) {
      console.warn('[Face] Verify error:', e);
      return { faces_detected: 0, recognized_faces: [], is_verified: false };
    }
  },

  /**
   * Ambil daftar semua wajah yang terdaftar.
   */
  listFaces: async (): Promise<FaceListResponse> => {
    try {
      const res = await fetch(`${FACE_API}/list`);
      return await res.json();
    } catch (e) {
      console.warn('[Face] List error:', e);
      return { total_faces: 0, names: [], last_saved: null };
    }
  },

  /**
   * Hapus wajah berdasarkan nama.
   */
  deleteFace: async (
    name: string,
  ): Promise<{ status: string; name: string; message: string }> => {
    try {
      const res = await fetch(`${FACE_API}/${encodeURIComponent(name)}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const err = await res.json();
        return {
          status: 'error',
          name,
          message: err.detail || 'Delete failed',
        };
      }

      return await res.json();
    } catch (e) {
      console.warn('[Face] Delete error:', e);
      return { status: 'error', name, message: 'Backend tidak tersedia' };
    }
  },

  /**
   * Cek status module face recognition.
   */
  getStatus: async (): Promise<{
    face_recognition_available: boolean;
    total_registered_faces: number;
    registered_names: string[];
  }> => {
    try {
      const res = await fetch(`${FACE_API}/status`);
      return await res.json();
    } catch (e) {
      console.warn('[Face] Status error:', e);
      return {
        face_recognition_available: false,
        total_registered_faces: 0,
        registered_names: [],
      };
    }
  },

  /**
   * Helper: Capture frame dari video element dan convert ke base64.
   * @param videoElement - HTML Video element dari webcam
   * @returns base64 string (tanpa prefix)
   */
  captureFrameAsBase64: (videoElement: HTMLVideoElement): string => {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    ctx.drawImage(videoElement, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    // Remove "data:image/jpeg;base64," prefix
    return dataUrl.split(',')[1] || '';
  },
};
