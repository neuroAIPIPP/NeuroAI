/**
 * EEG API Client
 * ===============
 * Komunikasi dengan NeuroAI AI Backend - EEG Module
 * Port dari neuroApi.ts di project EEG standalone
 */

const API_BASE =
  process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://127.0.0.1:8000';
const EEG_API = `${API_BASE}/eeg`;

export const eegApi = {
  /**
   * Mulai perekaman EEG.
   * Backend akan mencari stream Muse via LSL dan mulai recording ke CSV.
   */
  startSession: async (): Promise<{ status: string; file: string }> => {
    try {
      const res = await fetch(`${EEG_API}/start`, { method: 'POST' });
      return await res.json();
    } catch (e) {
      console.warn('[EEG] Backend Python offline:', e);
      return { status: 'error', file: '' };
    }
  },

  /**
   * Set marker pada data EEG yang sedang direkam.
   * Contoh label: "Video_1_Start", "Focus_Session", "Survey_Start"
   */
  setMarker: async (
    label: string,
  ): Promise<{ status: string; marker: string }> => {
    try {
      const res = await fetch(`${EEG_API}/marker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: label.replace(/\s+/g, '_') }),
      });
      return await res.json();
    } catch (e) {
      console.warn('[EEG] Gagal kirim marker:', e);
      return { status: 'error', marker: '' };
    }
  },

  /**
   * Stop perekaman EEG dan simpan file CSV.
   */
  stopSession: async (): Promise<{ status: string; file: string }> => {
    try {
      const res = await fetch(`${EEG_API}/stop`, { method: 'POST' });
      return await res.json();
    } catch (e) {
      console.warn('[EEG] Gagal stop recording:', e);
      return { status: 'error', file: '' };
    }
  },

  /**
   * Cek status perekaman EEG.
   */
  getStatus: async (): Promise<{
    is_recording: boolean;
    current_marker: string;
    current_file: string;
    recording_mode: string | null;
  }> => {
    try {
      const res = await fetch(`${EEG_API}/status`);
      return await res.json();
    } catch (e) {
      console.warn('[EEG] Gagal cek status:', e);
      return {
        is_recording: false,
        current_marker: '',
        current_file: '',
        recording_mode: null,
      };
    }
  },
};
