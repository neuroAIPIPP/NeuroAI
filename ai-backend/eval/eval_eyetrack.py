import os
import sys
import csv
import random

# Add parent dir to path so we can import analysis module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from analysis.concentration import analyze_eye_tracking_csv

EVAL_DIR = os.path.dirname(__file__)

def generate_mock_eyetracking(filename, state):
    """
    Generate mock Eye Tracking CSV.
    - STABLE: Pupil coordinates are tightly clustered in the center.
    - ERRATIC: Pupil coordinates are jumping everywhere (high variance), lots of unfocused flags.
    """
    filepath = os.path.join(EVAL_DIR, filename)
    
    with open(filepath, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(["timestamp", "video_time", "left_pupil_x", "left_pupil_y", 
                         "right_pupil_x", "right_pupil_y", "is_focused", "gaze_direction"])
        
        # 100 data points
        for i in range(100):
            timestamp = 1600000000000 + (i * 1000)
            vtime = i
            
            if state == "STABLE":
                # Center of screen (0.5, 0.5) +/- small noise
                lx = 0.5 + random.uniform(-0.01, 0.01)
                ly = 0.5 + random.uniform(-0.01, 0.01)
                is_foc = "true"
                gaze = "CENTER"
            else:
                # Erratic movements (0.0 to 1.0)
                lx = random.uniform(0.0, 1.0)
                ly = random.uniform(0.0, 1.0)
                # 50% chance of being labeled unfocused by frontend heuristics
                is_foc = "true" if random.random() > 0.5 else "false"
                gaze = random.choice(["LEFT", "RIGHT", "UP", "DOWN", "CENTER"])
                
            writer.writerow([timestamp, vtime, lx, ly, lx, ly, is_foc, gaze])
            
    return filepath

def run_evaluation():
    print("="*50)
    print("👁️  EVALUASI AKURASI ALGORITMA EYE TRACKING")
    print("="*50)
    
    # 1. Test Stable Focus
    stable_file = generate_mock_eyetracking("mock_stable_gaze.csv", "STABLE")
    print(f"\n[+] Menganalisis Sinyal Tatapan Stabil...")
    res_stable = analyze_eye_tracking_csv(stable_file)
    print(f"    -> Score Stabilitas: {res_stable['pupil_stability_score']:.2f}%")
    print(f"    -> Persentase Fokus: {res_stable['focus_percentage']:.2f}%")
    if res_stable['pupil_stability_score'] > 70 and res_stable['focus_percentage'] > 80:
        print("    -> ✅ VALID: Skor stabilitas tinggi sesuai ekspektasi.")
    else:
        print("    -> ❌ GAGAL: Skor tidak sesuai.")

    # 2. Test Erratic Focus
    erratic_file = generate_mock_eyetracking("mock_erratic_gaze.csv", "ERRATIC")
    print(f"\n[+] Menganalisis Sinyal Tatapan Liar (Distracted)...")
    res_erratic = analyze_eye_tracking_csv(erratic_file)
    print(f"    -> Score Stabilitas: {res_erratic['pupil_stability_score']:.2f}%")
    print(f"    -> Persentase Fokus: {res_erratic['focus_percentage']:.2f}%")
    if res_erratic['pupil_stability_score'] < 50:
        print("    -> ✅ VALID: Skor stabilitas rendah mendeteksi distraksi.")
    else:
        print("    -> ❌ GAGAL: Skor tidak sesuai.")
        
    print("\n" + "="*50)

if __name__ == "__main__":
    run_evaluation()
