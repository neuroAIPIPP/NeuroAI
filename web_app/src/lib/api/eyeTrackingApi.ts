/**
 * Eye Tracking API Client
 * =========================
 * Komunikasi dengan NeuroAI AI Backend - Eye Tracking Module
 * Mengirim data eye tracking dari frontend ke backend untuk penyimpanan.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://127.0.0.1:8000';
const ET_API = `${API_BASE}/eye-tracking`;

export interface EyeTrackingDataPoint {
  timestamp: number;
  video_time: number;
  left_pupil_x: number | null;
  left_pupil_y: number | null;
  right_pupil_x: number | null;
  right_pupil_y: number | null;
  is_focused: boolean;
  gaze_direction: string;
  screen_x: number | null;
  screen_y: number | null;
  screen_region: string | null;
}

export interface SessionStartResponse {
  session_id: string;
  status: string;
  file_path: string;
}

export interface SessionStopResponse {
  session_id: string;
  status: string;
  total_data_points: number;
  file_path: string;
}

export const eyeTrackingApi = {
  /**
   * Mulai session eye tracking baru di backend.
   */
  startSession: async (
    videoTitle: string,
    mode: string = 'combined',
    userId?: string,
  ): Promise<SessionStartResponse> => {
    try {
      const res = await fetch(`${ET_API}/session/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_title: videoTitle,
          mode,
          user_id: userId || null,
        }),
      });
      return await res.json();
    } catch (e) {
      console.warn('[Eye Tracking] Start session error:', e);
      return { session_id: '', status: 'error', file_path: '' };
    }
  },

  /**
   * Kirim satu data point eye tracking.
   */
  sendData: async (
    sessionId: string,
    data: EyeTrackingDataPoint,
  ): Promise<{ status: string; data_count: number }> => {
    try {
      const res = await fetch(`${ET_API}/data?session_id=${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      console.warn('[Eye Tracking] Send data error:', e);
      return { status: 'error', data_count: 0 };
    }
  },

  /**
   * Kirim batch data points sekaligus (lebih efisien).
   * Disarankan: kumpulkan 10-30 data points, lalu kirim batch.
   */
  sendBatch: async (
    sessionId: string,
    dataPoints: EyeTrackingDataPoint[],
  ): Promise<{ status: string; received: number; total: number }> => {
    try {
      const res = await fetch(`${ET_API}/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          data_points: dataPoints,
        }),
      });
      return await res.json();
    } catch (e) {
      console.warn('[Eye Tracking] Batch send error:', e);
      return { status: 'error', received: 0, total: 0 };
    }
  },

  /**
   * Stop session eye tracking dan simpan data.
   */
  stopSession: async (sessionId: string): Promise<SessionStopResponse> => {
    try {
      const res = await fetch(`${ET_API}/session/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      });
      return await res.json();
    } catch (e) {
      console.warn('[Eye Tracking] Stop session error:', e);
      return {
        session_id: sessionId,
        status: 'error',
        total_data_points: 0,
        file_path: '',
      };
    }
  },

  /**
   * Cek status module eye tracking.
   */
  getStatus: async () => {
    try {
      const res = await fetch(`${ET_API}/status`);
      return await res.json();
    } catch (e) {
      console.warn('[Eye Tracking] Status error:', e);
      return { active_sessions: 0, sessions: [] };
    }
  },
};
