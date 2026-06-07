"""
Concentration Analysis Engine
==============================
Mengolah data mentah Eye Tracking (CSV) dan EEG (CSV) menjadi
concentration metrics yang bermakna.

Alur:
  1. Parse CSV → DataFrame
  2. Hitung per-metric (focus %, gaze distribution, pupil stability, EEG bands)
  3. Gabungkan menjadi composite concentration score

Context:
  - User memilih mata kuliah → materi → session dimulai
  - Session = kalibrasi → nonton video 1 → rate → video 2 → rate → ... → selesai
  - Analisis ini berjalan post-session (setelah semua video selesai)
"""

import math
import os
from typing import Optional

import numpy as np
import pandas as pd


# ============================================================
# Eye Tracking Analysis
# ============================================================

def analyze_eye_tracking_csv(file_path: str) -> dict:
    """
    Analisis file CSV eye tracking dan hitung concentration metrics.

    CSV columns expected:
        timestamp, video_time, left_pupil_x, left_pupil_y,
        right_pupil_x, right_pupil_y, is_focused, gaze_direction,
        screen_x, screen_y, screen_region

    Returns dict:
        focus_percentage      : float (0-100)
        gaze_distribution     : dict {direction: percentage}
        pupil_stability_score : float (0-100)
        total_data_points     : int
        focus_timeline        : list of {video_time, is_focused}
        avg_screen_region     : dict {region: percentage}
        duration_seconds      : float
    """
    if not file_path or not os.path.exists(file_path):
        return _empty_eye_tracking_result()

    try:
        df = pd.read_csv(file_path)
    except Exception as e:
        print(f"⚠️ [Analysis] Error reading eye tracking CSV: {e}")
        return _empty_eye_tracking_result()

    if df.empty or len(df) < 2:
        return _empty_eye_tracking_result()

    total_points = len(df)

    # 1. Focus Percentage
    focus_percentage = 0.0
    if "is_focused" in df.columns:
        # Convert to string, lowercase, then check against true/1
        focused_mask = df["is_focused"].astype(str).str.lower().isin(['true', '1', 't', 'yes', 'y'])
        focused_count = focused_mask.sum()
        if total_points > 0:
            focus_percentage = (focused_count / total_points) * 100

    # 2. Gaze Direction Distribution
    gaze_distribution = {}
    if "gaze_direction" in df.columns:
        gaze_counts = df["gaze_direction"].value_counts(normalize=True) * 100
        gaze_distribution = gaze_counts.to_dict()
        # Normalize keys
        normalized_gaze = {}
        for key, value in gaze_distribution.items():
            normalized_key = str(key).strip().lower()
            normalized_gaze[normalized_key] = round(value, 2)
        gaze_distribution = normalized_gaze

    # 3. Pupil Stability Score
    pupil_stability_score = _calculate_pupil_stability(df)

    # 4. Focus Timeline (sampled every ~5 seconds for chart)
    focus_timeline = _build_focus_timeline(df)

    # 5. Screen Region Distribution
    screen_region_dist = {}
    if "screen_region" in df.columns:
        region_counts = df["screen_region"].dropna().value_counts(normalize=True) * 100
        screen_region_dist = {str(k): round(v, 2) for k, v in region_counts.to_dict().items()}

    # 6. Duration
    duration_seconds = 0.0
    if "video_time" in df.columns:
        vt = pd.to_numeric(df["video_time"], errors="coerce").dropna()
        if len(vt) > 1:
            duration_seconds = float(vt.max() - vt.min())

    return {
        "focus_percentage": round(focus_percentage, 2),
        "gaze_distribution": gaze_distribution,
        "pupil_stability_score": round(pupil_stability_score, 2),
        "total_data_points": total_points,
        "focus_timeline": focus_timeline,
        "screen_region_distribution": screen_region_dist,
        "duration_seconds": round(duration_seconds, 2),
    }


def _calculate_pupil_stability(df: pd.DataFrame) -> float:
    """
    Hitung stabilitas pupil berdasarkan standard deviation pergerakan.
    Semakin kecil std dev → semakin stabil → skor lebih tinggi.
    Returns 0-100 score.
    """
    stability_scores = []

    for side in ["left", "right"]:
        x_col = f"{side}_pupil_x"
        y_col = f"{side}_pupil_y"

        if x_col not in df.columns or y_col not in df.columns:
            continue

        x = pd.to_numeric(df[x_col], errors="coerce").dropna()
        y = pd.to_numeric(df[y_col], errors="coerce").dropna()

        if len(x) < 2 or len(y) < 2:
            continue

        # Hitung frame-to-frame differences
        dx = x.diff().dropna()
        dy = y.diff().dropna()

        # RMS of movement
        movements = np.sqrt(dx**2 + dy**2)
        avg_movement = float(movements.mean())

        # Convert to 0-100 score (smaller movement = higher score)
        # Because we sample every 1 second, natural head movement over 1s can be large.
        # We increase the max threshold to 0.20 (20% of frame shift)
        score = max(0, min(100, (1 - avg_movement / 0.20) * 100))
        stability_scores.append(score)

    if not stability_scores:
        return 50.0  # Default moderate score

    return float(np.mean(stability_scores))


def _build_focus_timeline(df: pd.DataFrame, interval_seconds: float = 5.0) -> list:
    """
    Build a sampled focus timeline for charting.
    Groups data into intervals and calculates focus ratio per interval.
    """
    if "video_time" not in df.columns or "is_focused" not in df.columns:
        return []

    df_copy = df[["video_time", "is_focused"]].copy()
    df_copy["video_time"] = pd.to_numeric(df_copy["video_time"], errors="coerce")
    df_copy["is_focused"] = pd.to_numeric(df_copy["is_focused"], errors="coerce")
    df_copy = df_copy.dropna()

    if df_copy.empty:
        return []

    max_time = df_copy["video_time"].max()
    timeline = []

    t = 0.0
    while t <= max_time:
        window = df_copy[
            (df_copy["video_time"] >= t) & (df_copy["video_time"] < t + interval_seconds)
        ]
        if len(window) > 0:
            focus_ratio = float(window["is_focused"].mean())
            timeline.append({
                "video_time": round(t, 1),
                "focus_ratio": round(focus_ratio, 3),
            })
        t += interval_seconds

    return timeline


def _empty_eye_tracking_result() -> dict:
    """Return empty result structure for eye tracking."""
    return {
        "focus_percentage": 0.0,
        "gaze_distribution": {},
        "pupil_stability_score": 0.0,
        "total_data_points": 0,
        "focus_timeline": [],
        "screen_region_distribution": {},
        "duration_seconds": 0.0,
    }


# ============================================================
# EEG Analysis
# ============================================================

def analyze_eeg_csv(file_path: str) -> dict:
    """
    Analisis file CSV EEG dan hitung concentration metrics.

    CSV columns expected:
        Timestamp, TP9, AF7, AF8, TP10, Right AUX, Marker

    Returns dict:
        attention_index    : float (0-100)
        relaxation_index   : float (0-100)
        band_powers        : dict {delta, theta, alpha, beta, gamma}
        eeg_quality        : str (good, moderate, poor)
        is_mock            : bool
        total_samples      : int
        duration_seconds   : float
        marker_events      : list of {timestamp, marker}
    """
    if not file_path or not os.path.exists(file_path):
        return _empty_eeg_result()

    try:
        df = pd.read_csv(file_path)
    except Exception as e:
        print(f"⚠️ [Analysis] Error reading EEG CSV: {e}")
        return _empty_eeg_result()

    if df.empty or len(df) < 10:
        return _empty_eeg_result()

    # EEG channels
    eeg_channels = ["TP9", "AF7", "AF8", "TP10"]
    available_channels = [ch for ch in eeg_channels if ch in df.columns]

    if not available_channels:
        return _empty_eeg_result()

    # Convert to numeric
    for ch in available_channels:
        df[ch] = pd.to_numeric(df[ch], errors="coerce")

    df_clean = df.dropna(subset=available_channels)

    if len(df_clean) < 10:
        return _empty_eeg_result()

    total_samples = len(df_clean)

    # Detect if mock mode (check for very regular sinusoidal patterns)
    is_mock = _detect_mock_eeg(df_clean, available_channels)

    # Calculate band powers using FFT
    band_powers = _calculate_band_powers(df_clean, available_channels)

    # Attention Index: beta / (alpha + theta) ratio, scaled to 0-100
    attention_index = _calculate_attention_index(band_powers)

    # Relaxation Index: alpha / (beta + theta) ratio, scaled to 0-100
    relaxation_index = _calculate_relaxation_index(band_powers)

    # EEG Quality assessment
    eeg_quality = _assess_eeg_quality(df_clean, available_channels)

    # Duration
    duration_seconds = 0.0
    if "Timestamp" in df_clean.columns:
        ts = pd.to_numeric(df_clean["Timestamp"], errors="coerce").dropna()
        if len(ts) > 1:
            duration_seconds = float(ts.max() - ts.min())

    # Marker events
    marker_events = _extract_markers(df_clean)

    return {
        "attention_index": round(attention_index, 2),
        "relaxation_index": round(relaxation_index, 2),
        "band_powers": {k: round(v, 4) for k, v in band_powers.items()},
        "eeg_quality": eeg_quality,
        "is_mock": is_mock,
        "total_samples": total_samples,
        "duration_seconds": round(duration_seconds, 2),
        "marker_events": marker_events,
    }


def _calculate_band_powers(df: pd.DataFrame, channels: list, sample_rate: float = 256.0) -> dict:
    """
    Hitung power spectral density untuk masing-masing band EEG
    menggunakan FFT.

    Bands:
        delta : 0.5 - 4 Hz   (deep sleep)
        theta : 4 - 8 Hz     (drowsiness, meditation)
        alpha : 8 - 13 Hz    (relaxed, calm)
        beta  : 13 - 30 Hz   (active thinking, focus)
        gamma : 30 - 50 Hz   (high-level processing)
    """
    bands = {
        "delta": (0.5, 4),
        "theta": (4, 8),
        "alpha": (8, 13),
        "beta": (13, 30),
        "gamma": (30, 50),
    }

    total_power = {band: 0.0 for band in bands}

    for ch in channels:
        signal = df[ch].values
        n = len(signal)

        if n < 64:  # Minimum samples for meaningful FFT
            continue

        # Remove DC offset
        signal = signal - np.mean(signal)

        # Apply Hanning window to reduce spectral leakage
        window = np.hanning(n)
        signal = signal * window

        # FFT
        fft_vals = np.fft.rfft(signal)
        fft_freqs = np.fft.rfftfreq(n, d=1.0 / sample_rate)
        psd = np.abs(fft_vals) ** 2 / n

        # Calculate power per band
        for band_name, (low, high) in bands.items():
            idx = np.where((fft_freqs >= low) & (fft_freqs <= high))[0]
            if len(idx) > 0:
                total_power[band_name] += float(np.mean(psd[idx]))

    # Average across channels
    n_channels = len(channels) if channels else 1
    for band in total_power:
        total_power[band] /= n_channels

    # Normalize so total = 1
    power_sum = sum(total_power.values())
    if power_sum > 0:
        for band in total_power:
            total_power[band] /= power_sum

    return total_power


def _calculate_attention_index(band_powers: dict) -> float:
    """
    Attention Index = (beta + gamma) / (alpha + theta) → scaled to 0-100.
    Higher high-frequency bands relative to low-frequency = more attention.
    """
    beta = band_powers.get("beta", 0)
    gamma = band_powers.get("gamma", 0)
    alpha = band_powers.get("alpha", 0)
    theta = band_powers.get("theta", 0)

    denominator = alpha + theta
    if denominator < 1e-10:
        return 50.0

    ratio = (beta + gamma) / denominator
    # Typical ratio range: 0.3 - 5.0
    # Map to 0-100 (scale adjusted to be more forgiving for real EEG)
    score = min(100, max(0, (ratio / 3.0) * 100))
    return score


def _calculate_relaxation_index(band_powers: dict) -> float:
    """
    Relaxation Index = alpha / (beta + theta) → scaled to 0-100.
    Higher alpha relative to beta+theta = more relaxed.
    """
    alpha = band_powers.get("alpha", 0)
    beta = band_powers.get("beta", 0)
    theta = band_powers.get("theta", 0)

    denominator = beta + theta
    if denominator < 1e-10:
        return 50.0

    ratio = alpha / denominator
    score = min(100, max(0, (ratio / 2.0) * 100))
    return score


def _detect_mock_eeg(df: pd.DataFrame, channels: list) -> bool:
    """
    Deteksi apakah data EEG berasal dari simulasi (mock mode).
    Mock data memiliki pola sinusoidal yang sangat regular.
    """
    if not channels:
        return False

    ch = channels[0]
    signal = df[ch].values

    if len(signal) < 100:
        return False

    # Check autocorrelation — mock data akan punya autocorrelation tinggi
    # karena sinusoidal murni
    signal_centered = signal - np.mean(signal)
    norm = np.sum(signal_centered ** 2)
    if norm < 1e-10:
        return True  # Constant signal = likely mock

    autocorr = np.correlate(signal_centered[:200], signal_centered[:200], mode="full")
    autocorr = autocorr / norm

    # Mock data biasanya punya peak autocorrelation > 0.9 di lag tertentu
    peaks = autocorr[len(autocorr) // 2 + 10:]  # Skip first few lags
    if len(peaks) > 0 and np.max(peaks) > 0.85:
        return True

    return False


def _assess_eeg_quality(df: pd.DataFrame, channels: list) -> str:
    """
    Assess kualitas sinyal EEG.
    Returns: 'good', 'moderate', atau 'poor'.
    """
    if not channels:
        return "poor"

    quality_scores = []
    for ch in channels:
        signal = df[ch].values
        std = np.std(signal)

        # Sinyal EEG valid biasanya memiliki std 5-100 uV
        if 5 < std < 100:
            quality_scores.append(1.0)
        elif 1 < std < 200:
            quality_scores.append(0.5)
        else:
            quality_scores.append(0.0)

    avg_quality = np.mean(quality_scores) if quality_scores else 0

    if avg_quality >= 0.8:
        return "good"
    elif avg_quality >= 0.4:
        return "moderate"
    else:
        return "poor"


def _extract_markers(df: pd.DataFrame) -> list:
    """Extract unique marker events from EEG data."""
    if "Marker" not in df.columns or "Timestamp" not in df.columns:
        return []

    markers = []
    seen = set()
    for _, row in df.iterrows():
        marker = str(row.get("Marker", "")).strip()
        if marker and marker != "Idle" and marker not in seen:
            seen.add(marker)
            markers.append({
                "timestamp": float(row["Timestamp"]) if pd.notna(row["Timestamp"]) else 0,
                "marker": marker,
            })

    return markers


def _empty_eeg_result() -> dict:
    """Return empty result structure for EEG."""
    return {
        "attention_index": 0.0,
        "relaxation_index": 0.0,
        "band_powers": {"delta": 0, "theta": 0, "alpha": 0, "beta": 0, "gamma": 0},
        "eeg_quality": "unavailable",
        "is_mock": False,
        "total_samples": 0,
        "duration_seconds": 0.0,
        "marker_events": [],
    }


# ============================================================
# Composite Concentration Score
# ============================================================

def calculate_concentration_score(
    eye_data: dict,
    eeg_data: dict,
    eye_weight: float = 0.6,
    eeg_weight: float = 0.4,
) -> dict:
    """
    Hitung composite concentration score dari data Eye Tracking dan EEG.

    Weights:
        Eye Tracking: 60% (focus_percentage + pupil_stability)
        EEG: 40% (attention_index)

    Returns dict:
        concentration_percentage : float (0-100)
        eye_tracking_score       : float (0-100)
        eeg_score                : float (0-100)
        confidence_level         : str (high, medium, low)
        breakdown                : dict detail
    """
    # Eye Tracking Score: weighted combination of focus + stability
    focus_pct = eye_data.get("focus_percentage", 0)
    stability = eye_data.get("pupil_stability_score", 0)
    et_data_points = eye_data.get("total_data_points", 0)

    # Focus contributes 70%, stability 30% of the eye tracking score
    eye_tracking_score = (focus_pct * 0.7) + (stability * 0.3)

    # EEG Score: primarily attention_index
    attention = eeg_data.get("attention_index", 0)
    eeg_quality = eeg_data.get("eeg_quality", "unavailable")
    eeg_samples = eeg_data.get("total_samples", 0)
    is_mock = eeg_data.get("is_mock", False)

    eeg_score = attention

    # Adjust weights if EEG data is unavailable or mock
    actual_eye_weight = eye_weight
    actual_eeg_weight = eeg_weight

    if eeg_quality == "unavailable" or eeg_samples == 0:
        actual_eye_weight = 1.0
        actual_eeg_weight = 0.0
    elif is_mock:
        # Reduce EEG weight for mock data
        actual_eye_weight = 0.75
        actual_eeg_weight = 0.25
    elif eeg_quality == "poor":
        actual_eye_weight = 0.7
        actual_eeg_weight = 0.3

    # Composite score
    concentration_pct = (eye_tracking_score * actual_eye_weight) + (eeg_score * actual_eeg_weight)
    concentration_pct = max(0, min(100, concentration_pct))

    # Confidence level
    confidence = _assess_confidence(et_data_points, eeg_samples, eeg_quality, is_mock)

    return {
        "concentration_percentage": round(concentration_pct, 2),
        "eye_tracking_score": round(eye_tracking_score, 2),
        "eeg_score": round(eeg_score, 2),
        "confidence_level": confidence,
        "weights_used": {
            "eye_tracking": round(actual_eye_weight, 2),
            "eeg": round(actual_eeg_weight, 2),
        },
        "breakdown": {
            "focus_percentage": round(focus_pct, 2),
            "pupil_stability": round(stability, 2),
            "attention_index": round(attention, 2),
            "eeg_quality": eeg_quality,
            "is_mock_eeg": is_mock,
        },
    }


def _assess_confidence(
    et_data_points: int,
    eeg_samples: int,
    eeg_quality: str,
    is_mock: bool,
) -> str:
    """
    Assess confidence level of the analysis.
    Returns: 'high', 'medium', atau 'low'.
    """
    score = 0

    # Eye tracking data sufficiency
    if et_data_points > 100:
        score += 3
    elif et_data_points > 30:
        score += 2
    elif et_data_points > 0:
        score += 1

    # EEG data sufficiency
    if eeg_samples > 5000:
        score += 3
    elif eeg_samples > 1000:
        score += 2
    elif eeg_samples > 0:
        score += 1

    # EEG quality
    if eeg_quality == "good" and not is_mock:
        score += 2
    elif eeg_quality == "moderate":
        score += 1

    # Mock penalty
    if is_mock:
        score -= 1

    if score >= 6:
        return "high"
    elif score >= 3:
        return "medium"
    else:
        return "low"


# ============================================================
# Full Session Analysis (per-session, post-session)
# ============================================================

def analyze_session(
    eye_tracking_files: list[str],
    eeg_file: Optional[str] = None,
    video_titles: Optional[list[str]] = None,
) -> dict:
    """
    Analisis lengkap satu session (bisa beberapa video/materi).

    Params:
        eye_tracking_files : list path CSV eye tracking (satu per video)
        eeg_file           : path CSV EEG (satu per session)
        video_titles       : judul video/materi yang terkait

    Returns dict:
        overall        : composite concentration metrics
        per_video      : list of per-video analysis
        eeg_analysis   : EEG analysis result
        session_summary: ringkasan session
    """
    per_video_results = []
    all_eye_data = []

    titles = video_titles or [f"Video {i+1}" for i in range(len(eye_tracking_files))]

    for i, et_file in enumerate(eye_tracking_files):
        title = titles[i] if i < len(titles) else f"Video {i+1}"
        eye_result = analyze_eye_tracking_csv(et_file)
        per_video_results.append({
            "video_title": title,
            "eye_tracking": eye_result,
        })
        all_eye_data.append(eye_result)

    # EEG analysis (satu untuk seluruh session)
    eeg_result = analyze_eeg_csv(eeg_file) if eeg_file else _empty_eeg_result()

    # Aggregate eye tracking across all videos
    aggregated_eye = _aggregate_eye_tracking(all_eye_data)

    # Overall concentration score
    overall = calculate_concentration_score(aggregated_eye, eeg_result)

    # Session summary
    total_duration = sum(d.get("duration_seconds", 0) for d in all_eye_data)
    total_data_points = sum(d.get("total_data_points", 0) for d in all_eye_data)

    session_summary = {
        "total_videos": len(eye_tracking_files),
        "total_duration_seconds": round(total_duration, 2),
        "total_data_points": total_data_points,
        "eeg_samples": eeg_result.get("total_samples", 0),
        "eeg_mode": "Mock" if eeg_result.get("is_mock") else ("Real" if eeg_result.get("total_samples", 0) > 0 else "Unavailable"),
    }

    return {
        "overall": overall,
        "per_video": per_video_results,
        "eeg_analysis": eeg_result,
        "session_summary": session_summary,
    }


def _aggregate_eye_tracking(results: list[dict]) -> dict:
    """Aggregate multiple eye tracking results into one."""
    if not results:
        return _empty_eye_tracking_result()

    valid_results = [r for r in results if r.get("total_data_points", 0) > 0]
    if not valid_results:
        return _empty_eye_tracking_result()

    # Weighted average by data points
    total_points = sum(r["total_data_points"] for r in valid_results)

    if total_points == 0:
        return _empty_eye_tracking_result()

    weighted_focus = sum(
        r["focus_percentage"] * r["total_data_points"] for r in valid_results
    ) / total_points

    weighted_stability = sum(
        r["pupil_stability_score"] * r["total_data_points"] for r in valid_results
    ) / total_points

    # Merge gaze distributions
    merged_gaze = {}
    for r in valid_results:
        weight = r["total_data_points"] / total_points
        for direction, pct in r.get("gaze_distribution", {}).items():
            merged_gaze[direction] = merged_gaze.get(direction, 0) + pct * weight

    # Merge timelines
    all_timelines = []
    for r in valid_results:
        all_timelines.extend(r.get("focus_timeline", []))

    total_duration = sum(r.get("duration_seconds", 0) for r in valid_results)

    return {
        "focus_percentage": round(weighted_focus, 2),
        "gaze_distribution": {k: round(v, 2) for k, v in merged_gaze.items()},
        "pupil_stability_score": round(weighted_stability, 2),
        "total_data_points": total_points,
        "focus_timeline": all_timelines,
        "screen_region_distribution": {},
        "duration_seconds": round(total_duration, 2),
    }
