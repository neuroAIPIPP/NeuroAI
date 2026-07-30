export const GLOSSARY = {
  concentrationScore:
    'Skor gabungan dari Eye Tracking (60%) dan EEG (40%) yang mengukur tingkat konsentrasi keseluruhan selama session.',
  focusPercentage:
    'Persentase waktu di mana arah pandangan mata terdeteksi mengarah ke layar saat menonton video.',
  gazeDistribution:
    'Distribusi arah pandangan mata selama session (center, left, right, up, down) dalam persentase.',
  cognitivePhases:
    'Pembagian session menjadi 4 fase waktu (Awal, Pertengahan, Lanjut, Akhir) untuk melihat tren perubahan fokus.',
  bandPowerDelta:
    'Gelombang Delta (0.5–4 Hz): Terkait dengan tidur nyenyak. Dominasi saat session bisa menandakan kantuk berat.',
  bandPowerTheta:
    'Gelombang Theta (4–8 Hz): Terkait dengan mengantuk atau melamun. Meningkat saat pikiran melayang.',
  bandPowerAlpha:
    'Gelombang Alpha (8–13 Hz): Terkait dengan ketenangan dan relaksasi. Tinggi saat rileks dengan mata terbuka.',
  bandPowerBeta:
    'Gelombang Beta (13–30 Hz): Terkait dengan fokus aktif dan berpikir logis. Dominan saat berkonsentrasi.',
  bandPowerGamma:
    'Gelombang Gamma (30–50 Hz): Terkait dengan pemrosesan kognitif tingkat tinggi dan pembelajaran aktif.',
  eegMode:
    '"Real" = data dari headband Muse S asli. "Simulated" = data buatan untuk testing, tidak merefleksikan otak sebenarnya.',
  signalQuality:
    'Kualitas sinyal EEG: Good (standar deviasi 5–100µV), Moderate (1–200µV), atau Poor (di luar rentang).',
  focusTimeline:
    'Grafik persentase fokus mata sepanjang waktu session, diambil setiap 5 detik berdasarkan data eye tracking.',
  eyeTrackingScore:
    'Skor gabungan dari persentase fokus mata (70%) dan stabilitas pupil (30%).',
  eegScore:
    'Skor dari rasio gelombang Beta+Gamma terhadap Alpha+Theta otak (Attention Index), diskala 0–100%.',
  pupilStability:
    'Mengukur seberapa stabil pergerakan pupil mata antar frame. Sedikit gerakan acak = skor tinggi.',
  confidenceLevel:
    'Tingkat keandalan analisis: ditentukan oleh jumlah data, kualitas sinyal EEG, dan apakah EEG real/simulasi.',
} as const;
