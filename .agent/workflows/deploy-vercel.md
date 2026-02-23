---
description: Cara Deploy Fullstack (Express + React) ke Vercel
---
// turbo-all
Berikut adalah langkah-langkah untuk mendeploy aplikasi ini ke Vercel agar backend dan frontend berjalan bersamaan:

### 1. Persiapan Database (PENTING)
Vercel tidak bisa mengakses `localhost`. Kamu **WAJIB** menggunakan database online (seperti Aiven, PlanetScale, atau Railway).
- Dapatkan link koneksi database cloud kamu.
- Pastikan tabel sudah dibuat di database cloud tersebut.

### 2. Push Kode Terbaru
Pastikan semua perubahan terbaru sudah di GitHub:
1. `git add .`
2. `git commit -m "build: finalize vercel config"`
3. `git push origin main`

### 3. Konfigurasi di Dashboard Vercel
Buka [Vercel Dashboard](https://vercel.com/dashboard) dan pilih project kamu:

**A. Settings > General**
- **Framework Preset:** `Other` (jangan pilih Vite).
- **Build Command:** `npm run vercel-build`
- **Output Directory:** `.` (Titik saja, kita atur lewat `vercel.json`).
- **Install Command:** `npm install`

**B. Settings > Environment Variables**
Masukkan semua isi dari file `.env` kamu di sini:
- `DB_HOST`: (host database online)
- `DB_USER`: (user database online)
- `DB_PASSWORD`: (password database online)
- `DB_NAME`: (nama database online)
- `DB_PORT`: `3306` (atau sesuai database cloud)
- `JWT_SECRET`: (bebas, contoh: `rahasia_banget`)
- `VITE_API_URL`: (Kosongkan saja atau isi `/api`)

### 4. Redeploy
1. Masuk ke tab **Deployments**.
2. Klik titik tiga pada deployment terakhir, pilih **Redeploy**.

---
Jika muncul "Cannot GET /", pastikan di folder `frontend` sudah ada file `dist` setelah proses build selesai.
