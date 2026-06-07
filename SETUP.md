# NeuroAI — Setup Guide untuk Kolaborator

## Prasyarat

- **Python 3.11** (wajib, karena dlib binary hanya tersedia untuk 3.11)
- **Node.js 18+** (untuk web_app)
- **Git** (sudah pull repo)

---

## 1. Setup AI Backend (Python/FastAPI)

Buka terminal, masuk ke folder `ai-backend`:

```bash
cd NeuroAI/ai-backend
```

### a. Buat Virtual Environment

```bash
python -m venv venv
```

### b. Aktifkan Virtual Environment

**Windows (CMD / PowerShell):**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

### c. Install dlib (khusus Windows)

File `dlib-19.24.1-cp311-cp311-win_amd64.whl` sudah ada di repo.
Install manual dulu sebelum requirements:

```bash
pip install dlib-19.24.1-cp311-cp311-win_amd64.whl
```

> **Jika file .whl tidak ada di repo**, download dari:
> https://github.com/z-mahmud22/Dlib_Windows_Python3.x/raw/main/dlib-19.24.1-cp311-cp311-win_amd64.whl

### d. Install Semua Dependencies

```bash
pip install -r requirements.txt
```

### e. Setup File .env (untuk Gemini AI)

```bash
copy .env.example .env
```

Lalu edit file `.env` dan masukkan Gemini API key:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Cara dapat API key gratis:**
> 1. Buka https://aistudio.google.com/apikey
> 2. Login Google → Klik "Create API Key"
> 3. Copy key → paste ke file .env
>
> **Catatan:** Tanpa API key, backend tetap jalan, tapi AI insights
> tidak akan di-generate oleh Gemini (menggunakan fallback analysis).

### f. Jalankan Backend

```bash
uvicorn main:app --reload
```

Backend akan berjalan di `http://localhost:8000`.
Cek docs API di `http://localhost:8000/docs`.

---

## 2. Setup Web App (Next.js)

Buka terminal baru, masuk ke folder `web_app`:

```bash
cd NeuroAI/web_app
```

### a. Install Dependencies

```bash
npm install
```

### b. Setup Environment Variables

Pastikan file `.env` sudah ada di folder `web_app/` dengan konfigurasi
database (Supabase) dan auth. Minta ke team lead jika belum punya.

### c. Generate Prisma Client

```bash
npx prisma generate
```

### d. Jalankan Web App

```bash
npm run dev
```

Web app akan berjalan di `http://localhost:3000`.

---

## Troubleshooting

### "ModuleNotFoundError: No module named 'face_recognition'"
→ Pastikan dlib sudah terinstall dulu, baru `pip install -r requirements.txt`.

### "face_recognition gagal install"
→ Pastikan Python versi 3.11 (bukan 3.12 atau 3.13). Cek: `python --version`

### "GEMINI_API_KEY not set"
→ Buat file `.env` dari `.env.example` dan isi API key.
→ Backend tetap jalan tanpa key, hanya AI insights yang tidak tersedia.

### "Analysis backend unreachable" di web app
→ Pastikan FastAPI backend sudah jalan di port 8000.
→ Jalankan: `uvicorn main:app --reload` di folder ai-backend.

### Error saat `pip install scipy`
→ Coba: `pip install --upgrade pip` dulu, lalu ulangi.

### "prisma generate" error
→ Pastikan Node.js sudah terinstall.
→ Coba: `npx prisma generate --no-engine` jika error engine.
