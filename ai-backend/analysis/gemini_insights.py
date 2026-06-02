"""
Gemini AI Insights Generator
==============================
Menggunakan Google Gemini API untuk menghasilkan narrative insights
dari data analisis konsentrasi.

Setup:
    1. Dapatkan API key dari https://aistudio.google.com/apikey
    2. Set environment variable GEMINI_API_KEY=your_key_here
    3. Atau buat file .env di root ai-backend/

Catatan:
    - Menggunakan model gemini-2.0-flash (gratis)
    - Rate limit free tier: 15 requests/minute
"""

import json
import os
from typing import Optional

# ============================================================
# Gemini Client Setup
# ============================================================

_gemini_client = None


def _get_gemini_client():
    """Lazy-init Gemini client."""
    global _gemini_client
    if _gemini_client is not None:
        return _gemini_client

    api_key = os.environ.get("GEMINI_API_KEY", "")

    if not api_key:
        # Try loading from .env file
        env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
        if os.path.exists(env_path):
            with open(env_path, "r") as f:
                for line in f:
                    line = line.strip()
                    if line.startswith("GEMINI_API_KEY="):
                        api_key = line.split("=", 1)[1].strip().strip('"').strip("'")
                        break

    if not api_key:
        print("⚠️ [Gemini] GEMINI_API_KEY not set. AI insights will be unavailable.")
        return None

    try:
        from google import genai

        client = genai.Client(api_key=api_key)
        _gemini_client = client
        print("✅ [Gemini] Client initialized successfully.")
        return client
    except ImportError:
        print("⚠️ [Gemini] google-genai package not installed. Run: pip install google-genai")
        return None
    except Exception as e:
        print(f"⚠️ [Gemini] Error initializing client: {e}")
        return None


# ============================================================
# Insights Generation
# ============================================================

def generate_concentration_insights(
    analysis_data: dict,
    video_titles: Optional[list[str]] = None,
    mata_kuliah: Optional[str] = None,
) -> dict:
    """
    Kirim structured analysis data ke Gemini dan dapatkan narrative insights.

    Params:
        analysis_data : dict dari analyze_session()
        video_titles  : list judul video/materi
        mata_kuliah   : nama mata kuliah (opsional)

    Returns dict:
        summary       : str - ringkasan konsentrasi
        strengths     : list[str] - hal-hal positif
        improvements  : list[str] - saran perbaikan
        patterns      : list[str] - pola yang terdeteksi
        tips          : list[str] - tips personalized
        generated     : bool - True jika berhasil di-generate oleh AI
    """
    client = _get_gemini_client()

    if client is None:
        return _generate_fallback_insights(analysis_data)

    try:
        prompt = _build_prompt(analysis_data, video_titles, mata_kuliah)
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )

        # Parse JSON response
        response_text = response.text.strip()

        # Remove markdown code fences if present
        if response_text.startswith("```"):
            lines = response_text.split("\n")
            lines = [l for l in lines if not l.strip().startswith("```")]
            response_text = "\n".join(lines)

        insights = json.loads(response_text)

        # Validate structure
        result = {
            "summary": insights.get("summary", ""),
            "strengths": insights.get("strengths", []),
            "improvements": insights.get("improvements", []),
            "patterns": insights.get("patterns", []),
            "tips": insights.get("tips", []),
            "generated": True,
        }

        print("✅ [Gemini] Insights generated successfully.")
        return result

    except json.JSONDecodeError as e:
        print(f"⚠️ [Gemini] Failed to parse response as JSON: {e}")
        # Try to extract text anyway
        return {
            "summary": response_text if response_text else "Analisis tidak tersedia.",
            "strengths": [],
            "improvements": [],
            "patterns": [],
            "tips": [],
            "generated": True,
        }
    except Exception as e:
        print(f"⚠️ [Gemini] Error generating insights: {e}")
        return _generate_fallback_insights(analysis_data)


def _build_prompt(
    analysis_data: dict,
    video_titles: Optional[list[str]] = None,
    mata_kuliah: Optional[str] = None,
) -> str:
    """Build the prompt for Gemini."""
    overall = analysis_data.get("overall", {})
    per_video = analysis_data.get("per_video", [])
    eeg = analysis_data.get("eeg_analysis", {})
    session_summary = analysis_data.get("session_summary", {})

    concentration = overall.get("concentration_percentage", 0)
    eye_score = overall.get("eye_tracking_score", 0)
    eeg_score = overall.get("eeg_score", 0)
    confidence = overall.get("confidence_level", "low")
    breakdown = overall.get("breakdown", {})
    face_verification_ratio = overall.get("face_verification_ratio")

    # Build per-video summary
    video_summaries = []
    for v in per_video:
        et = v.get("eye_tracking", {})
        video_summaries.append(
            f"- {v.get('video_title', 'Unknown')}: "
            f"Focus {et.get('focus_percentage', 0):.1f}%, "
            f"Stability {et.get('pupil_stability_score', 0):.1f}%, "
            f"Duration {et.get('duration_seconds', 0):.0f}s"
        )

    video_list = "\n".join(video_summaries) if video_summaries else "Tidak ada data per-video."

    context = f"Mata Kuliah: {mata_kuliah}" if mata_kuliah else ""

    prompt = f"""Kamu adalah AI asisten analitik pendidikan bernama NeuroAI. 
Tugasmu menganalisis data konsentrasi mahasiswa saat menonton video kuliah.

KONTEKS:
Mahasiswa menjalankan satu session belajar di platform NeuroAI.
{context}
Session terdiri dari menonton {session_summary.get('total_videos', 0)} video materi, 
masing-masing diikuti dengan penilaian rating.
Data direkam menggunakan:
- Eye Tracking (MediaPipe + WebGazer): mendeteksi arah pandang dan fokus mata
- EEG (Muse headband / simulasi): mengukur gelombang otak

DATA ANALISIS:
- Skor Konsentrasi Keseluruhan: {concentration:.1f}%
  - Eye Tracking Score: {eye_score:.1f}%  
  - EEG Score: {eeg_score:.1f}%
  - Confidence Level: {confidence}
  
- Detail Face Verification:
  - Match Ratio: {f"{face_verification_ratio:.1f}%" if face_verification_ratio is not None else "Tidak ada data"} (Tingkat kehadiran wajah asli pengguna di depan kamera)
  
- Detail Eye Tracking:
  - Focus Percentage: {breakdown.get('focus_percentage', 0):.1f}%
  - Pupil Stability: {breakdown.get('pupil_stability', 0):.1f}%

- Detail EEG:
  - Attention Index: {breakdown.get('attention_index', 0):.1f}%
  - EEG Quality: {breakdown.get('eeg_quality', 'unknown')}
  - Mode: {eeg.get('is_mock', False) and 'Simulasi' or 'Real'}
  - Band Powers: {json.dumps(eeg.get('band_powers', {}))}

- Per-Video:
{video_list}

- Session Summary:
  - Total Durasi: {session_summary.get('total_duration_seconds', 0):.0f} detik
  - Total Data Points (Eye): {session_summary.get('total_data_points', 0)}
  - Total Samples (EEG): {session_summary.get('eeg_samples', 0)}

INSTRUKSI:
Berikan analisis dalam format JSON MURNI (tanpa markdown, tanpa backtick) dengan structure berikut:
{{
  "summary": "Ringkasan singkat 2-3 kalimat tentang konsentrasi mahasiswa selama session ini dalam bahasa Indonesia.",
  "strengths": ["3-4 poin kekuatan/hal positif dari konsentrasi mahasiswa"],
  "improvements": ["3-4 saran perbaikan yang spesifik dan actionable"],
  "patterns": ["2-3 pola yang terdeteksi dari data, misalnya kapan fokus menurun"],
  "tips": ["3-4 tips personalized berdasarkan data untuk meningkatkan konsentrasi di session berikutnya"]
}}

PENTING:
- Gunakan bahasa Indonesia yang natural dan mudah dipahami
- Berikan insight yang bermakna, bukan generik
- Jika Match Ratio Face Verification rendah (<70%), peringatkan pengguna bahwa mereka terdeteksi sering meninggalkan layar atau tertutup wajahnya.
- Jika data EEG adalah simulasi, jangan terlalu bergantung pada data EEG
- Sesuaikan analisis berdasarkan persentase konsentrasi yang ada
- Respond dengan JSON MURNI saja, tanpa penjelasan tambahan"""

    return prompt


# ============================================================
# Fallback Insights (tanpa Gemini)
# ============================================================

def _generate_fallback_insights(analysis_data: dict) -> dict:
    """
    Generate basic insights tanpa AI jika Gemini tidak tersedia.
    """
    overall = analysis_data.get("overall", {})
    concentration = overall.get("concentration_percentage", 0)
    breakdown = overall.get("breakdown", {})
    focus_pct = breakdown.get("focus_percentage", 0)
    stability = breakdown.get("pupil_stability", 0)

    # Determine level
    if concentration >= 80:
        level = "sangat baik"
        emoji = "🌟"
    elif concentration >= 60:
        level = "baik"
        emoji = "👍"
    elif concentration >= 40:
        level = "cukup"
        emoji = "📊"
    else:
        level = "perlu ditingkatkan"
        emoji = "⚠️"

    summary = (
        f"{emoji} Konsentrasi Anda selama session ini berada di level {level} "
        f"dengan skor {concentration:.1f}%. "
        f"Fokus mata terdeteksi {focus_pct:.1f}% dari total waktu menonton."
    )

    strengths = []
    improvements = []
    patterns = []
    tips = []
    
    face_ratio = overall.get("face_verification_ratio")
    
    if face_ratio is not None and face_ratio < 70:
        improvements.append(f"Wajah Anda tidak terdeteksi sebagian besar waktu ({face_ratio:.1f}%). Pastikan Anda selalu berada di depan kamera.")
        patterns.append("Terdeteksi banyak momen di mana layar ditinggalkan kosong.")

    if focus_pct >= 70:
        strengths.append("Fokus mata Anda konsisten dan menunjukkan perhatian yang baik terhadap materi video.")
    if stability >= 70:
        strengths.append("Stabilitas pergerakan pupil mata sangat baik, menandakan konsentrasi yang steady.")
    if concentration >= 60:
        strengths.append("Skor konsentrasi keseluruhan berada di atas rata-rata.")

    if not strengths:
        strengths.append("Anda telah menyelesaikan session belajar ini, yang merupakan langkah positif.")

    if focus_pct < 60:
        improvements.append("Coba kurangi distraksi di sekitar Anda saat menonton video kuliah.")
    if stability < 60:
        improvements.append("Perhatikan posisi duduk dan jarak layar agar mata lebih stabil.")
    if concentration < 70:
        improvements.append("Pertimbangkan untuk istirahat sejenak setiap 20-30 menit untuk menjaga fokus.")

    if not improvements:
        improvements.append("Terus pertahankan pola belajar yang sudah baik ini.")

    patterns.append(f"Fokus mata Anda aktif selama {focus_pct:.1f}% dari total waktu menonton.")
    tips.append("Pastikan pencahayaan ruangan cukup untuk mengurangi kelelahan mata.")
    tips.append("Gunakan teknik Pomodoro (25 menit fokus, 5 menit istirahat) untuk session berikutnya.")

    return {
        "summary": summary,
        "strengths": strengths,
        "improvements": improvements,
        "patterns": patterns,
        "tips": tips,
        "generated": False,
    }
