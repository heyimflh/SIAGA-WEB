Siap! Saya baca kedua dokumenmu dengan teliti. Berikut PRD yang sudah diperbarui dengan brand **SIAGA**:

---

# 📋 PRODUCT REQUIREMENTS DOCUMENT
**SIAGA** — Sistem Inspeksi Aerial Geospasial Andalan
**Version:** 2.0 — SEFEST 2026 Competition Draft
**Focus:** SDG 9 (Industry, Innovation & Infrastructure) × Gen-Z TechPreneur
**Status:** Final for Submission

---

## 1. Executive Summary

SIAGA adalah **B2B Service Marketplace** berbasis web yang menghubungkan perusahaan dan instansi pemilik aset infrastruktur kritis — menara transmisi SUTET, jembatan, kilang minyak — dengan pilot UAV/Drone profesional berlisensi dari generasi muda Indonesia.

Platform ini bukan sekadar job board. SIAGA adalah ekosistem inspeksi digital end-to-end: dari posting proyek, seleksi pilot berbasis sertifikasi, penerbangan di lapangan, hingga otomatisasi laporan PDF — semua dalam satu platform yang aman dan terukur.

**Tagline:** *"Infrastruktur Anda Selalu dalam Pengawasan yang Siap dan Waspada."*

**Keselarasan dengan SDG 9:**
- **Target 9.1** — Memastikan infrastruktur yang tangguh dan berkelanjutan melalui pemantauan berbasis teknologi tinggi.
- **Target 9.5** — Mendorong inovasi dan meningkatkan kapasitas teknologi nasional melalui pemberdayaan pilot drone Gen-Z.
- **Target 9.b** — Mendukung pengembangan teknologi domestik di sektor industri dan manufaktur.

---

## 2. Problem Statement

### Sisi Demand — Perusahaan & Instansi

| Masalah | Dampak Nyata |
|---|---|
| Inspeksi manual (panjat tiang, tali pengaman) | Risiko kecelakaan kerja dan korban jiwa |
| Proses tender konvensional lambat dan birokratis | Keterlambatan deteksi kerusakan aset kritis |
| Tidak ada standar format laporan inspeksi | Data tidak konsisten, sulit diaudit |
| Biaya inspeksi konvensional sangat tinggi | Pemeliharaan aset tidak rutin dilakukan |

### Sisi Supply — Pilot Drone Gen-Z

| Masalah | Dampak Nyata |
|---|---|
| Tidak ada platform B2B terpercaya untuk pilot muda | Potensi besar terbengkalai, penghasilan tidak stabil |
| Sulit membuktikan kredibilitas kepada BUMN | Sertifikat SIDOPI tidak tervalidasi secara digital |
| Tidak ada sistem pembayaran yang menjamin keamanan | Risiko tidak dibayar setelah pekerjaan selesai |

**Root Cause:** Tidak ada jembatan digital yang menjembatani kebutuhan industri dengan kapabilitas inovator muda secara terstruktur, aman, dan terverifikasi.

---

## 3. User Personas

### Persona A — The Client (Instansi/BUMN)
**"Pak Hendra, 45 tahun — Manajer Pemeliharaan Aset, PT PLN (Persero)"**

- **Konteks:** Bertanggung jawab atas ratusan menara SUTET di Jawa Barat. Wajib melakukan inspeksi berkala untuk memenuhi standar K3 dan regulasi ESDM.
- **Goals:** Menemukan pilot tersertifikasi dengan cepat, memantau progres inspeksi secara real-time, mendapatkan laporan siap presentasi.
- **Pain Points:** Proses tender memakan 3–6 bulan, tidak ada visibilitas progres saat pilot di lapangan, format laporan tidak standar.
- **Kebutuhan di Platform SIAGA:**
  - Form pembuatan proyek dengan peta interaktif (marking area inspeksi)
  - Dashboard monitoring progress + indikator kondisi aset (Hijau/Kuning/Merah)
  - One-Click PDF Report Generator yang siap presentasi
  - Riwayat semua proyek dan invoice dalam satu tempat

### Persona B — The Provider (Pilot Gen-Z)
**"Rizky, 23 tahun — Lulusan Teknik Geodesi, Pilot UAV Bersertifikat SIDOPI"**

- **Konteks:** Memiliki drone DJI Matrice 300 dan sertifikat SIDOPI aktif. Sudah punya portofolio foto inspeksi, tapi kesulitan mendapatkan klien korporat.
- **Goals:** Menemukan proyek skala industri yang sepadan dengan kapabilitasnya, mendapatkan bayaran yang adil dengan sistem transparan.
- **Pain Points:** Tidak punya jaringan ke BUMN, takut tidak dibayar, tidak tahu harga pasar yang wajar.
- **Kebutuhan di Platform SIAGA:**
  - SIAGA Job Radar — peta interaktif proyek yang tersedia di seluruh Indonesia
  - Sistem bidding transparan dan kompetitif
  - Workspace upload file besar (foto RAW, orthomosaic, video 4K)
  - Escrow system — jaminan pembayaran sebelum pekerjaan dimulai

---

## 4. Core Features & Killer Feature

### A. Landing Page & Role-Based Authentication
- **Hero Section:** Headline *"Solusi Pantauan Langit untuk Keamanan Infrastruktur Nasional"*, video loop drone inspeksi, CTA ganda: **[Hire a Pilot]** & **[Join as Pilot]**
- **Brand Identity:** Nama SIAGA ditampilkan dengan tagline kepanjangannya — *Sistem Inspeksi Aerial Geospasial Andalan* — untuk langsung membangun kepercayaan.
- **Role-Based Login:** Pengguna memilih masuk sebagai Perusahaan atau Pilot/Agensi — antarmuka dan dashboard otomatis menyesuaikan peran.

### B. Client Area — Dashboard Perusahaan

**1. Create Project (Job Posting Wizard)**
- Step 1 → Deskripsi proyek & jenis infrastruktur
- Step 2 → Marking area inspeksi di peta interaktif (Mapbox/Google Maps API)
- Step 3 → Spesifikasi teknis (resolusi foto, format output, deadline)
- Step 4 → Review & Publish

**2. Bidding Review Dashboard**
Tabel komparatif penawaran pilot: harga, estimasi waktu, rating, badge verifikasi SIDOPI, dan riwayat proyek. Filter & sort tersedia.

**3. Asset Monitoring Dashboard**
- Progress bar inspeksi real-time
- Indikator warna kondisi aset: **Aman / Perlu Perhatian / Kritis**
- Peta titik kerusakan yang dapat di-zoom dan diklik untuk detail foto

### C. Provider Area — Dashboard Pilot

**1. SIAGA Job Radar**
Peta geospasial full-screen menampilkan pin proyek inspeksi aktif di seluruh Indonesia. Filter berdasarkan: nilai proyek, jenis infrastruktur, lokasi, dan status bidding.

**2. Proposal Submission**
Form sederhana: harga penawaran, timeline pengerjaan, catatan teknis. Pilot bisa melihat jumlah pesaing tanpa melihat nilai bid kompetitor.

**3. Workspace / Upload Area**
Zona upload file besar: foto RAW, video 4K, orthomosaic (.tif), point cloud (.las). Dilengkapi progress bar dan preview thumbnail.

### D. THE KILLER FEATURE — SIAGA One-Click Report Generator

Ini adalah fitur *"WOW"* yang membedakan SIAGA dari kompetitor.

Setelah pilot mengupload semua file ke Workspace:
1. Client membuka Asset Monitoring Dashboard
2. Mengklik tombol **[ SIAGA: Generate Inspection Report ]**
3. Muncul animasi loading modern (progress bar, ikon drone berputar, teks *"Compiling geospatial data..."*)
4. Dalam beberapa detik, **laporan PDF profesional siap diunduh**, berisi:
   - Cover page dengan logo klien & SIAGA
   - Peta area inspeksi + koordinat GPS titik kerusakan
   - Galeri foto kerusakan berurutan
   - Tabel ringkasan kondisi aset (Kritis/Aman)
   - Tanda tangan digital pilot & timestamp

> **Mengapa ini "killer"?** Mengubah tugas yang biasanya membutuhkan 2–3 hari kerja tim teknis menjadi **satu klik, di bawah 30 detik.** Nilai yang dirasakan langsung terasa oleh juri.

---

## 5. UI/UX & Design Guidelines

### Color Palette

| Token | Hex | Penggunaan |
|---|---|---|
| `--color-primary` | `#0A192F` | Deep Space Navy — Background utama, navbar, sidebar |
| `--color-accent` | `#00D2FF` | Electric Cyan — CTA button, badge, highlight, garis aktif |
| `--color-surface` | `#F4F7F6` | Light Gray — Background dashboard & card |
| `--color-danger` | `#FF4C4C` | Alert Red — Indikator aset kritis |
| `--color-success` | `#00C48C` | Emerald — Indikator aset aman |

### Typography
- **Display/Heading:** Montserrat — tegas, modern, berkarakter industri
- **Body/Label:** Inter — bersih, sangat mudah dibaca untuk data-heavy dashboard
- **Hierarki:** H1 48px / H2 32px / H3 24px / Body 16px / Caption 12px

### UX Principles
- **Wizard Navigation:** Semua form kompleks dipecah menjadi 3–4 langkah dengan stepper visual.
- **Progressive Disclosure:** Informasi teknis hanya tampil saat user klik "Detail".
- **Responsive Priority:** Desktop-first untuk dashboard, mobile-ready untuk notifikasi dan SIAGA Job Radar.
- **Micro-interactions:** Loading animasi pada Report Generator, hover state pada peta, transisi smooth antar step.

---

## 6. Business & Trust Framework

### Model Bisnis

| Stream | Mekanisme |
|---|---|
| Commission Fee | Take-rate 7% dari nilai kontrak proyek yang selesai |
| Premium Dashboard | Langganan bulanan untuk Advanced Analytics (prediksi kerusakan berbasis AI) |
| Verified Agency | Biaya listing prioritas untuk agensi drone di halaman teratas SIAGA Job Radar |

### Keamanan Data
- **End-to-End Encryption:** Semua file foto, video, dan koordinat GPS dienkripsi AES-256.
- **Automatic Watermarking:** Preview hasil inspeksi memiliki watermark hingga pembayaran selesai.
- **RBAC:** Koordinat presisi titik kerusakan hanya bisa diakses akun dengan izin proyek aktif.

### Verifikasi & Trust System
- **SIAGA Verified Pilot Badge:** Pilot wajib upload sertifikat SIDOPI untuk mendapat badge kepercayaan.
- **Two-Way Rating System:** Client menilai pilot, pilot menilai client — membangun reputasi komunitas.
- **Escrow System:** Dana ditampung SIAGA, dicairkan hanya setelah client menyetujui hasil kerja.

---

## 7. Kesesuaian Kriteria Penilaian SEFEST 2026

| Kriteria | Bobot | Bagaimana SIAGA Memenuhinya |
|---|---|---|
| UI/UX & Usability | 30% | Dua dashboard role-based yang distinct, wizard form 4-step, palet Navy + Cyan kontras tinggi untuk data-heavy dashboard |
| Kreativitas & Inovasi | 25% | Kombinasi marketplace + SIAGA Job Radar (geospasial) yang jarang di kompetisi serupa, ditambah One-Click Report Generator 2 hari → 30 detik |
| SDG & Relevansi Tema | 20% | Keselarasan eksplisit SDG 9.1, 9.5, 9.b. Solusi konkret untuk PLN, Pertamina dengan dampak nyata: keselamatan kerja + efisiensi operasional |
| Kualitas Proposal | 5% | PRD standar industri: problem-solution fit, personas riset, user journey end-to-end, business model realistis |

> **Catatan Strategis untuk Tim:** Saat presentasi kepada juri, demonstrasikan **SIAGA One-Click Report Generator** secara live — ini adalah momen WOW tertinggi yang akan diingat. Pastikan animasi loading dan output PDF terlihat premium dan polish.

---

Perubahan yang aku lakukan dari PRD sebelumnya:
- Semua penyebutan **SkyInspect** → diganti **SIAGA**
- Tagline diperbarui sesuai makna nama SIAGA
- **Job Radar** → **SIAGA Job Radar**
- **Report Generator** → **SIAGA One-Click Report Generator**
- Kepanjangan SIAGA (*Sistem Inspeksi Aerial Geospasial Andalan*) dimasukkan ke bagian Landing Page sebagai elemen brand yang kuat
- **Verified Pilot Badge** → **SIAGA Verified Pilot Badge**

Mau dilanjutkan diskusi ke bagian mana? Misalnya brainstorm layout per halaman, alur user journey yang lebih detail, atau strategi presentasi ke juri? 🚀