import os
import sys
import csv
import math
import random

# Add parent dir to path so we can import analysis module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from analysis.concentration import analyze_eeg_csv

EVAL_DIR = os.path.dirname(__file__)

def generate_mock_eeg(filename, state):
    """
    Generate mock EEG data with specific dominant frequencies to simulate focus states.
    - HIGH_FOCUS: High Beta (13-30 Hz)
    - LOW_FOCUS: High Alpha (8-13 Hz) & Theta (4-8 Hz)
    """
    filepath = os.path.join(EVAL_DIR, filename)
    
    # Muse format usually has 5 columns (TP9, AF7, AF8, TP10, Right AUX) + timestamp
    # We will just write a simple CSV that the analysis script can read
    with open(filepath, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(["timestamps", "TP9", "AF7", "AF8", "TP10", "Right AUX"])
        
        # Generate 10 seconds of data at 256 Hz
        fs = 256
        duration = 10
        for i in range(fs * duration):
            t = i / fs
            timestamp = 1600000000.0 + t
            
            # Base noise
            base = random.uniform(-10, 10)
            
            if state == "HIGH_FOCUS":
                # High amplitude Beta (20Hz), Low Alpha
                signal = math.sin(2 * math.pi * 20 * t) * 50 + math.sin(2 * math.pi * 10 * t) * 5 + base
            else:
                # High amplitude Alpha (10Hz) and Theta (6Hz), Low Beta
                signal = math.sin(2 * math.pi * 10 * t) * 50 + math.sin(2 * math.pi * 6 * t) * 40 + math.sin(2 * math.pi * 20 * t) * 5 + base
                
            writer.writerow([timestamp, signal, signal, signal, signal, 0])
            
    return filepath

def run_evaluation():
    print("="*50)
    print("🧠 EVALUASI AKURASI ALGORITMA EEG")
    print("="*50)
    
    # 1. Test High Focus
    high_focus_file = generate_mock_eeg("mock_high_focus.csv", "HIGH_FOCUS")
    print(f"\n[+] Menganalisis Sinyal High Focus (Dominan Beta)...")
    res_high = analyze_eeg_csv(high_focus_file)
    print(f"    -> Score Konsentrasi: {res_high['attention_index']:.2f}%")
    if res_high['attention_index'] > 60:
        print("    -> ✅ VALID: Skor tinggi sesuai ekspektasi.")
    else:
        print("    -> ❌ GAGAL: Skor terlalu rendah untuk High Focus.")

    # 2. Test Low Focus
    low_focus_file = generate_mock_eeg("mock_low_focus.csv", "LOW_FOCUS")
    print(f"\n[+] Menganalisis Sinyal Low Focus (Dominan Alpha/Theta)...")
    res_low = analyze_eeg_csv(low_focus_file)
    print(f"    -> Score Konsentrasi: {res_low['attention_index']:.2f}%")
    if res_low['attention_index'] < 50:
        print("    -> ✅ VALID: Skor rendah sesuai ekspektasi.")
    else:
        print("    -> ❌ GAGAL: Skor terlalu tinggi untuk Low Focus.")
        
    print("\n" + "="*50)

if __name__ == "__main__":
    run_evaluation()
