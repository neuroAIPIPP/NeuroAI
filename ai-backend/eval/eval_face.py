import os
import sys
import numpy as np

# Add parent dir to path so we can import analysis module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from face_module.router import FaceRecognitionEngine

EVAL_DIR = os.path.dirname(__file__)

def run_evaluation():
    print("="*50)
    print("👤 EVALUASI AKURASI ALGORITMA FACE VERIFICATION")
    print("="*50)
    
    engine = FaceRecognitionEngine()
    
    # Check if user has provided test images
    img1_path = os.path.join(EVAL_DIR, "test_base.jpg")
    img2_path = os.path.join(EVAL_DIR, "test_match.jpg")
    img3_path = os.path.join(EVAL_DIR, "test_stranger.jpg")
    
    if not os.path.exists(img1_path) or not os.path.exists(img2_path) or not os.path.exists(img3_path):
        print("⚠️  GAMBAR TEST TIDAK DITEMUKAN!")
        print("Untuk menguji akurasi secara riil, silakan siapkan 3 gambar di folder `ai-backend/eval/`:")
        print(" 1. test_base.jpg     -> Foto wajah asli (Acuan)")
        print(" 2. test_match.jpg    -> Foto wajah asli dengan gaya berbeda (Harus Cocok)")
        print(" 3. test_stranger.jpg -> Foto wajah orang lain (Harus Ditolak)")
        print("\nMenjalankan simulasi engine...")
        return

    # Read bytes
    with open(img1_path, "rb") as f: img1_bytes = f.read()
    with open(img2_path, "rb") as f: img2_bytes = f.read()
    with open(img3_path, "rb") as f: img3_bytes = f.read()

    print("\n[+] Menguji Kasus POSITIF (Wajah Sama)...")
    # Register base
    success, msg = engine.register_face("test_user", img1_bytes)
    if not success:
        print(f"    -> ❌ GAGAL Registrasi: {msg}")
    else:
        # Verify
        faces_detected, results = engine.verify_face(img2_bytes)
        if faces_detected == 0 or not results:
            print("    -> ❌ GAGAL: Tidak ada wajah terdeteksi.")
        else:
            res_ver = results[0]
            print(f"    -> Confidence Score: {res_ver['confidence'] * 100:.2f}%")
            if res_ver['is_known']:
                print("    -> ✅ VALID: Wajah berhasil dikenali sebagai orang yang sama (True Positive).")
            else:
                print("    -> ❌ GAGAL: Wajah yang sama ditolak (False Negative).")

    print("\n[+] Menguji Kasus NEGATIF (Wajah Orang Lain)...")
    faces_detected_neg, results_neg = engine.verify_face(img3_bytes)
    if faces_detected_neg == 0 or not results_neg:
        print("    -> ❌ GAGAL: Tidak ada wajah terdeteksi.")
    else:
        res_neg = results_neg[0]
        print(f"    -> Confidence Score: {res_neg['confidence'] * 100:.2f}%")
        if not res_neg['is_known']:
            print("    -> ✅ VALID: Wajah orang lain berhasil ditolak (True Negative).")
        else:
            print("    -> ❌ GAGAL: Wajah orang lain salah dikenali (False Positive).")
            
    print("\n" + "="*50)

if __name__ == "__main__":
    run_evaluation()
