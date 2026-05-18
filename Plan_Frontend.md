# SIAGA — Master Frontend Implementation Plan
## 8 Halaman | Full Visual Excellence

---

## 🌐 GLOBAL DESIGN SYSTEM (Berlaku Semua Halaman)

**Tech Stack:**
- Framework: React + Vite
- 3D: Three.js + React Three Fiber + Drei
- Animation: GSAP + ScrollTrigger + Framer Motion
- Maps: Mapbox GL JS
- Charts: Recharts
- Styling: Tailwind CSS + Custom CSS Variables
- Icons: Lucide React + custom SVG

**Design Tokens:**
```
--color-primary: #0A192F (Deep Space Navy)
--color-accent: #00D2FF (Electric Cyan)
--color-surface: #F4F7F6 (Light Gray)
--color-danger: #FF4C4C (Alert Red)
--color-success: #00C48C (Emerald)
--font-display: Montserrat
--font-body: Inter
```

**Global Elements yang muncul di semua halaman:**
- Navbar sticky dengan backdrop blur + logo SIAGA glowing cyan
- Custom cursor titik cyan yang membesar saat hover link
- Page transition: fade + slight upward slide antar halaman
- Scrollbar custom tipis berwarna cyan

---

## 🏠 HALAMAN 1 — LANDING PAGE
### "Kesan Pertama & WOW Factor"

### Above the Fold — Hero Section

**Background:** Canvas Three.js fullscreen gelap navy (#0A192F) dengan partikel kecil berterbangan seperti sinyal GPS — 200 partikel putih/cyan bergerak pelan secara random.

**3D Drone Model:**
- Model: Animated Drone by hartwelkisaka (Sketchfab, free, animasi 3 jenis)
- Posisi: tengah-kanan layar, scale besar, mengambang naik-turun (floating animation loop)
- Baling-baling berputar terus (spin animation pada propeller mesh)
- Saat cursor didekatkan, drone sedikit rotate mengikuti mouse (mouse parallax)
- Efek: bloom/glow pada LED drone (emissive material cyan)
- Implementasi: `<Canvas>` React Three Fiber + useGLTF + OrbitControls disabled + custom mouse tracker

**Teks Hero:**
- H1: "Infrastruktur Anda Selalu dalam Pengawasan yang Siap dan Waspada" — muncul per kata dengan stagger animation (GSAP)
- Subtitle muncul slide-up setelah H1 selesai
- Dua CTA button muncul terakhir dengan bounce-in

**CTA Buttons:**
- `[Hire a Pilot]` — solid cyan, hover: glow effect menyebar
- `[Join as Pilot]` — outline cyan, hover: fill dari kiri ke kanan (liquid fill effect)

---

### Section 2 — Stats Bar

Horizontal strip gelap dengan 4 angka yang count-up saat masuk viewport:
- 500+ Pilot Tersertifikasi | 1.200+ Menara Terinspeksi | 47 Kota | 99.8% Uptime

---

### Section 3 — Problem & Solution (Storytelling)

Split layout: kiri teks masalah (merah/warning), kanan solusi SIAGA (cyan/hijau). ScrollTriggered: dua sisi slide masuk dari luar saat user scroll ke sini.

**3D Model Tambahan:** Model menara SUTET/transmission tower 3D kecil di pojok section ini (search Sketchfab: "transmission tower" CC Attribution). Drone kecil animasi terbang di sekitar menara. Ini langsung menggambarkan use case tanpa perlu banyak teks.

---

### Section 4 — How It Works Preview (teaser)

3 card dengan ikon animated (Lottie atau CSS animation):
1. Post Project → ikon peta dengan pin muncul
2. Select Pilot → ikon orang dengan badge verified
3. Get Report → ikon dokumen dengan tanda centang

Setiap card hover: terangkat + border cyan menyala.

---

### Section 5 — Trust & Partners

Logo-logo mitra/klien potensial (PLN, Pertamina, Jasa Marga) dalam grayscale, hover jadi berwarna. Marquee scroll otomatis kiri ke kanan.

---

### Section 6 — Final CTA

Full-width section dengan background sedikit lebih terang dari navy. Teks besar: "Mulai Inspeksi Pertama Anda Hari Ini" + satu CTA button besar. Background ada subtle animated gradient cyan yang bergerak pelan.

---

## ⚙️ HALAMAN 2 — HOW IT WORKS
### "Storytelling & Clarity"

### Hero Mini

Header sederhana: judul halaman + breadcrumb. Background navy dengan mesh gradient subtle.

---

### Main Section — Vertical Timeline Interaktif

Bukan list biasa. Timeline vertikal di tengah layar, setiap step muncul saat user scroll:

**Step 1 — Post Your Project**
- Kiri: ilustrasi form dengan peta interaktif mini (static screenshot Mapbox dengan styling dark)
- Kanan: teks penjelasan
- Ikon step: angka 01 dalam lingkaran cyan berdenyut saat active
- Animasi: slide masuk dari kiri

**Step 2 — Review Pilot Bids**
- Kanan: card komparatif pilot dengan badge SIAGA Verified
- Kiri: teks penjelasan
- Animasi: slide masuk dari kanan

**Step 3 — Monitor in Real-Time**
- Kiri: mini mockup dashboard monitoring dengan status bar hijau/merah animated
- Animasi: fade + scale up

**Step 4 — One-Click Report**
- Kanan: animasi drone kecil terbang + PDF keluar dari bawah drone (CSS keyframe)
- Ini visual paling kuat di halaman ini

---

### Section Bawah — Video / Demo Reel

Embed video loop (atau GIF berkualitas tinggi) yang menunjukkan alur platform. Kalau belum ada video asli, bisa pakai placeholder dengan efek "glassmorphism play button" di atas thumbnail drone udara.

---

## 🔐 HALAMAN 3 — LOGIN / REGISTER
### "Konsistensi Brand"

### Layout

Split screen 50/50:
- Kiri: Background navy gelap + 3D drone model kecil mengambang + teks tagline SIAGA + logo besar
- Kanan: Form area dengan background sedikit lebih terang (surface color)

**3D di sisi kiri:** Gunakan model drone yang sama dari landing page, tapi lebih kecil dan dengan environment sederhana. Baling-baling tetap berputar pelan. Efek sangat premium karena form page biasanya membosankan — ini langsung beda.

---

### Form Area (Kanan)

- Tab switcher: `[Masuk sebagai Perusahaan]` `[Masuk sebagai Pilot]`
- Saat tab berganti: form fields berubah dengan animasi smooth slide
- Input field: border bottom-only style, saat focus border menjadi cyan dengan glow tipis
- Checkbox "Ingat Saya" dengan custom checkbox animation
- Button submit: gradient cyan, loading state menampilkan spinner ikon drone berputar kecil
- Atau Register: form 2-step dengan stepper visual di atas

---

### Register Flow

- Step 1: Pilih role (card besar: Perusahaan vs Pilot) — hover effect card terangkat
- Step 2: Isi data sesuai role
- Step 3: Verifikasi (upload SIDOPI untuk pilot)

---

## 🗺️ HALAMAN 4 — JOB RADAR
### "Visual Geospasial Memukau"

### Layout

Fullscreen. Sidebar kiri 320px + Peta fullscreen kanan (atau bisa toggle fullscreen map).

---

### Peta Mapbox — The Star of the Show

**Style:** `mapbox://styles/mapbox/dark-v11` — dark map sangat premium

**Terrain 3D:** `map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })` — peta Indonesia menjadi timbul/relief 3D. Satu line of code, efeknya luar biasa.

**Sky Layer:** `map.setFog()` — menambahkan efek atmosfer di horizon peta. Makin jauh makin biru/kabut. Ini fitur Mapbox premium yang gratis diaktifkan.

**Custom Pins (Proyek Aktif):**
- Pin berbentuk ikon drone SVG kecil berwarna cyan
- Pulse animation: lingkaran cyan mengembang dan memudar berulang di sekitar pin (seperti radar)
- Pin merah untuk proyek urgent/kritis
- Pin abu-abu untuk proyek yang sudah terisi

**Popup saat klik pin:**
- Card glassmorphism (blur + transparansi) muncul di atas peta
- Berisi: nama proyek, jenis infrastruktur, nilai kontrak, deadline, jumlah bidder
- Tombol `[Lihat Detail]` dan `[Bid Sekarang]`

**Fly-to Animation:** Saat klik pin, kamera peta smooth zoom dan tilt ke lokasi tersebut dengan animasi 1.5 detik. Sangat sinematik.

**Line Route:** Kalau ada beberapa proyek satu area, tampilkan garis koneksi tipis cyan antar pin (seperti flight route map).

---

### Sidebar Kiri — Filter & List

- Header: "SIAGA Job Radar" + badge jumlah proyek aktif (berdenyut)
- Filter: Jenis Infrastruktur (toggle chips), Nilai Proyek (range slider), Lokasi (search)
- List proyek: card kecil scrollable, hover highlight pin di peta
- Sorting: Terbaru | Nilai Tertinggi | Deadline Terdekat

---

### Stats Mini di Atas Peta

Floating bar transparan: "47 Proyek Aktif | 12 Bidding Terbuka | 3 Urgent" — count up saat load.

---

## 📊 HALAMAN 5 — CLIENT DASHBOARD
### "Data Visualization Premium"

### Layout

Sidebar navigasi kiri (fixed) + main content area kanan.

**Sidebar:**
- Logo SIAGA kecil di atas
- Avatar + nama perusahaan
- Menu items dengan ikon Lucide + active state garis cyan di kiri
- Background navy, text putih/abu

---

### Main Content — Overview Cards (Top Row)

4 metric cards glassmorphism:
- Proyek Aktif: angka besar + trend arrow
- Total Aset Terinspeksi: dengan progress bar cyan
- Budget Terpakai: donut chart mini (Recharts)
- Proyek Selesai Bulan Ini: angka + badge hijau

---

### Section — Asset Monitoring Map

Mini Mapbox map (bukan fullscreen) dengan pin aset milik perusahaan ini:
- Hijau = Aman, Kuning = Perlu Perhatian, Merah = Kritis (berdenyut)
- Klik pin → drawer/panel muncul dari kanan berisi detail aset + foto preview

---

### Section — Project Timeline

Timeline visual horizontal: proyek berjalan dari kiri (start) ke kanan (end). Setiap milestone (posting → bidding → inspeksi → laporan) ditandai dengan titik. Progress bar mengisi sesuai status aktual. Sangat premium dibanding tabel biasa.

---

### Section — Bidding Review Table

Tabel komparatif penawaran pilot:
- Kolom: Nama Pilot | Badge SIAGA | Rating | Harga | Estimasi | Portofolio
- Row hover: highlight cyan tipis
- Sort dan filter per kolom
- Button `[Pilih Pilot]` per row → konfirmasi modal dengan animasi

---

### Section — Recent Activity Feed

Timeline vertikal kecil di kanan: aktivitas terbaru (pilot mengupload foto, proyek selesai, laporan tersedia). Setiap item dengan ikon + timestamp. Auto-refresh visual (pulse saat ada item baru).

---

## 📄 HALAMAN 6 — REPORT GENERATOR
### "Momen WOW Tertinggi"

> Ini halaman yang HARUS sempurna. Juri akan melihat ini paling lama.

---

### Step 1 — Pilih Proyek

Dropdown bergaya premium: pilih proyek yang sudah selesai upload. Card preview proyek muncul di bawah dropdown dengan info singkat.

---

### Step 2 — Customize Report

Checkbox pilihan konten laporan:
- ☑ Cover Page dengan Logo Klien
- ☑ Peta Area Inspeksi + Koordinat GPS
- ☑ Galeri Foto Kerusakan
- ☑ Tabel Kondisi Aset
- ☑ Tanda Tangan Digital Pilot

Preview thumbnail PDF berubah real-time sesuai pilihan (bisa di-fake dengan conditional rendering).

---

### Step 3 — THE BIG BUTTON

Tombol besar di tengah layar: `[ SIAGA: Generate Inspection Report ]`
- Warna: gradient cyan ke biru
- Size: sangat besar, jadi focal point halaman
- Hover: glow menyebar + drone icon berputar di dalam button
- Shadow: cyan glow di bawah button

---

### Step 4 — Loading Animation (INI MOMEN WOW)

Saat button diklik, overlay muncul fullscreen dengan:

Animasi drone 3D (Three.js atau Lottie): drone terbang dari kiri ke kanan sambil "menscan" area

Progress bar dengan tahapan:
```
[████░░░░░░] 40% — Compiling GPS coordinates...
[███████░░░] 70% — Rendering orthomosaic data...
[█████████░] 90% — Encrypting report...
[██████████] 100% — Report Ready!
```

Setiap tahap muncul dengan fade. Teks teknis berganti-ganti = kesan sophisticated sangat tinggi.

Konfeti/particle burst cyan saat 100% complete.

---

### Step 5 — Download Ready

Card hasil muncul dengan animasi bounce-in:
- Preview thumbnail halaman pertama PDF
- Ukuran file, timestamp, ID laporan unik
- Tombol `[ Download PDF]` dan `[👁 Preview]`

---

## 💰 HALAMAN 7 — PRICING PAGE
### "Kredibilitas Marketplace & Business Model"

### Hero Mini

Judul + subtitle. Background ada subtle dot-grid pattern berwarna navy (seperti graph paper gelap — kesan teknis/profesional).

---

### Pricing Cards — 3 Tier

Layout: 3 kartu berdampingan. Kartu tengah (paling populer) lebih besar dan punya efek khusus.

**Tier 1 — Basic (Perusahaan Kecil)**
- Card: border navy tipis, background surface
- Fitur: daftar dengan ikon centang hijau

**Tier 2 — Professional (PALING POPULER) ← kartu tengah**
- Card: border cyan glowing, background navy gelap
- Badge "Most Popular" di atas kartu dengan background cyan
- Scale sedikit lebih besar dari dua card lain
- Efek: shining light yang bergerak dari kiri ke kanan (shimmer effect) setiap 3 detik
- Harga lebih besar dan menonjol

**Tier 3 — Enterprise (BUMN/Korporat)**
- Card: border emas/amber premium
- Label "Custom Pricing" bukan angka tetap
- CTA: "Hubungi Sales" bukan "Subscribe"

---

### Section — Commission Model

Visual infografis: bagaimana 7% commission fee bekerja. Diagram alur uang: Klien → Escrow SIAGA → (7% SIAGA + 93% Pilot). Diagram animated dengan angka yang mengalir.

---

### Section — FAQ Accordion

10 pertanyaan umum. Setiap item: klik header → konten expand dengan smooth animation. Desain clean, border bawah tipis antar item.

---

### Section — Trust Badges

Baris ikon keamanan: AES-256 Encrypted | SIDOPI Verified | Escrow Protected | Two-Way Rating. Setiap badge dalam card kecil abu-abu.

---

## 👨‍✈️ HALAMAN 8 — BROWSE PILOTS
### "Ekosistem & Kelengkapan Platform"

### Hero

Judul "Temukan Pilot Terbaik untuk Proyek Anda" + search bar besar di tengah (search by nama, lokasi, spesialisasi).

---

### Filter Bar (Horizontal)

Row filter chips di bawah search:
- Spesialisasi: Infrastruktur | FPV | Pemetaan | Fotografi
- Lokasi: dropdown provinsi
- Rating: bintang minimum (toggle)
- Badge: SIAGA Verified only (toggle)

---

### Grid Pilot Cards

Grid 3 kolom, card per pilot:

**Setiap Card berisi:**
- Avatar foto pilot dengan border cyan kalau SIAGA Verified
- Nama + badge verifikasi
- Kota asal + rating bintang
- 3 tag spesialisasi (chip kecil)
- Statistik kecil: Proyek Selesai | Response Rate | Drone Type
- Portofolio preview: 3 foto thumbnail kecil dari inspeksi sebelumnya
- CTA: `[Lihat Profil]` dan `[Invite to Project]`

Hover effect card: Terangkat + shadow cyan + foto portofolio slide carousel otomatis.

---

### Pilot Profile Modal/Page

Saat klik profil pilot, drawer besar dari kanan muncul (atau halaman baru):
- Cover: foto hero dari salah satu hasil inspeksi
- Info lengkap: bio, drone yang dimiliki, sertifikasi, area operasi di mini Mapbox map
- Galeri portofolio: grid foto yang bisa diklik lightbox
- Review dari klien sebelumnya
- Tombol `[Hire This Pilot]` sticky di bawah

---

### Section Bawah — CTA Join as Pilot

Untuk pilot yang belum daftar. Card dengan background navy + drone 3D kecil + teks ajakan + tombol `[Daftar Sebagai Pilot]`.

---

## 🚀 PRIORITY ORDER IMPLEMENTASI

Kalau waktu terbatas untuk SEFEST 2026, kerjakan urutan ini:

1. **Landing Page** — kesan pertama juri, harus sempurna
2. **Report Generator** — momen WOW demo live, harus 100% polish
3. **Job Radar** — visual paling unik (Mapbox 3D terrain)
4. **Client Dashboard** — data visualization untuk meyakinkan juri
5. **Browse Pilots** — kelengkapan ekosistem platform
6. **Pricing Page** — business model clarity
7. **How It Works** — storytelling supporting
8. **Login/Register** — bisa dibuat terakhir karena paling standard

> Mau mulai dari halaman mana? Gue bisa langsung buatkan kode HTML/React-nya halaman per halaman!