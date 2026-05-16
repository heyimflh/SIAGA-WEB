# 🛒 SIAGA — MARKETPLACE SECTIONS BLUEPRINT

> **Status:** Planning · Tidak mengubah section existing · Murni tambahan
> **Tujuan:** Memperkuat positioning landing page sebagai **B2B Service Marketplace** (bukan vendor jasa drone biasa)
> **Scope:** 7 section baru disisipkan di antara section yang sudah ada

---

## 📌 KONTEKS & FILOSOFI

Landing page SIAGA versi sekarang sudah punya pondasi visual yang kuat — Hero, StatsBar, ProblemSolution, JobRadarMap, HowItWorks, SektorKredibilitas, FinalCTA. Tapi positioning-nya **terlalu condong ke sisi client (perusahaan)** dan belum menampilkan elemen-elemen klasik yang membuat marketplace 2-sided "terasa hidup": face talent, project liquidity, trust mechanism, dan pricing transparency.

Blueprint ini menambahkan 7 section baru yang menjawab gap tersebut, tanpa mengubah 1 section existing pun.

### Prinsip Desain

1. **Two-sided Storytelling** — Setiap section harus jelas posisi-nya: untuk client, untuk pilot, atau untuk keduanya.
2. **Liquidity Proof** — Tunjukkan angka konkret (X pilot, Y proyek, Z bid) di setiap kesempatan.
3. **Trust as Pillar** — Marketplace = trust. Setiap mekanisme keamanan harus dramatis dan visible.
4. **Reuse Design Token** — Pakai `--bg-primary`, `--bg-secondary`, `--brand-blue`, `--brand-cyan`, dll yang sudah ada di Plan_LandingPage.md.
5. **Color Rhythm** — Tetap alternating `#FBFDFF` ↔ `#F1F5F9`, satu-satunya dark section adalah FinalCTA existing.

---

## 🗺️ FINAL SECTION FLOW (existing + sisipan)

```
1.  Hero                          ← existing (tetap)
2.  StatsBar                      ← existing
3.  ★ A. Dual Audience            ← BARU [Tier 1]
4.  ProblemSolution               ← existing
5.  ★ G. Comparison Table         ← BARU [Tier 3]
6.  JobRadarMap                   ← existing
7.  ★ C. Live Projects            ← BARU [Tier 1]
8.  ★ B. Featured Pilots          ← BARU [Tier 1]
9.  ★ D. Service Categories       ← BARU [Tier 2]
10. HowItWorks                    ← existing
11. ★ E. Trust & Safety           ← BARU [Tier 2]
12. SektorKredibilitas            ← existing
13. ★ F. Pricing & Komisi         ← BARU [Tier 2]
14. FinalCTA                      ← existing
15. Footer                        ← existing
```

**Background Color Rhythm:**
```
Hero (#FBFDFF) → Stats (#F1F5F9) → ★A (#FBFDFF) → Problem (#F1F5F9)
→ ★G (#FBFDFF) → JobRadar (#FBFDFF) → ★C (#F1F5F9) → ★B (#FBFDFF)
→ ★D (#F1F5F9) → HowItWorks (#F1F5F9) → ★E (#FBFDFF)
→ Sektor (#FBFDFF) → ★F (#F1F5F9) → FinalCTA (#0A2540 dark)
```

---

# ★ SECTION A — DUAL AUDIENCE

> *"Satu Platform, Dua Sisi"* — Hook awal yang langsung menegaskan SIAGA sebagai marketplace 2-sided.

### Posisi
Antara `StatsBar` dan `ProblemSolution`.

### Tujuan
Detik ke-5 user buka web, mereka harus paham: **"Ini bukan vendor drone. Ini marketplace yang nyambungin 2 pihak."**

### Layout — Split-Screen Statis (Opsi Default)

```
┌─────────────────────────┬─────────────────────────┐
│  Panel Kiri (light)     │  Panel Kanan (dark hint)│
│                         │                         │
│  [Icon Building 48px]   │  [Icon Drone 48px]      │
│                         │                         │
│  [ FOR ENTERPRISE ]     │  [ FOR PILOTS ]         │
│                         │                         │
│  Posting Sekali.        │  Drone Anda Layak       │
│  Dapat Pilot Terbaik    │  Dapat Proyek           │
│  dalam 48 Jam.          │  Korporat.              │
│                         │                         │
│  ✓ Akses 500+ pilot     │  ✓ Akses proyek BUMN    │
│  ✓ Bidding kompetitif   │  ✓ Pembayaran dijamin   │
│  ✓ Escrow payment       │  ✓ Bangun portofolio    │
│  ✓ Laporan PDF 1-klik   │  ✓ Komisi hanya 7%      │
│                         │                         │
│  [Posting Proyek →]     │  [Daftar Sebagai Pilot→]│
│                         │                         │
│  ─────────────────      │  ─────────────────      │
│  📊 47 proyek aktif     │  ⚡ Pilot pertama bid   │
│     minggu ini          │     rata-rata 3 jam     │
└─────────────────────────┴─────────────────────────┘
```

### Detail Visual
- Panel kiri bg: `--bg-primary` dengan grid pattern subtle biru
- Panel kanan bg: gradient sangat halus dari `--brand-sky` ke `--bg-primary` dengan hint cluster pin di pojok
- Border vertikal pemisah: 1px `--border-light` dengan center node berbentuk circle yang memuat ikon "↔" handshake
- Hover panel: panel di-hover `scale: 1.02`, panel sebelah `scale: 0.97` + opacity 0.85

### Animasi Masuk
- Center node "↔" muncul dengan scale 0 → 1.2 → 1.0 (bounce)
- Panel kiri: slide dari `translateX(-40px) → 0`
- Panel kanan: slide dari `translateX(40px) → 0`
- Bullet items: stagger fade-up 80ms
- Mini-stat di footer panel: count-up

### Copy Direction (Indonesian)
Tegas, lurus, tanpa filler. Avoid kata "kami" — selalu "Anda".

---

# ★ SECTION B — FEATURED PILOTS

> *"500+ Pilot Bersertifikat. Inilah Sebagiannya."*

### Posisi
Setelah `Live Projects` (Section C), sebelum `Service Categories` (Section D).

### Tujuan
Marketplace = wajah. Tanpa face talent, marketplace terasa kosong. Ini DNA-nya — Toptal, Fiverr, Upwork semua nampang talent di homepage.

### Layout

```
┌───────────────────────────────────────────────────┐
│  [HEADING]                                        │
│  500+ Pilot Bersertifikat.                        │
│  Inilah Sebagiannya.                              │
│                                                   │
│  [Filter: All | SUTET | Migas | Konstruksi | +]  │
│                                                   │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐            │
│  │P1 │ │P2 │ │P3 │ │P4 │ │P5 │ │P6 │ ...        │
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘            │
│         ← horizontal scroll / drag →              │
│                                                   │
│  [ Lihat Semua Pilot → ]                          │
└───────────────────────────────────────────────────┘
```

### Anatomi Pilot Card

```
┌─────────────────────────┐
│  [Avatar 80×80]    ✓    │  ← badge SIAGA Verified
│                         │     pojok kanan atas
│  Rizky Pratama          │
│  Surabaya, Jawa Timur   │
│  ─────────────────      │
│  ⚡ Tower SUTET          │  ← chip spesialisasi
│  🛢️ Migas              │     (max 2 chip)
│  ─────────────────      │
│  ★ 4.95 · 127 misi      │  ← rating + missions
│  🚁 DJI Matrice 300 RTK │  ← drone equipment
│  💰 Mulai Rp 5jt        │  ← starting price
│                         │
│  [ Lihat Profil → ]     │
└─────────────────────────┘
```

### 8 Pilot Persona (Fiktif Realistis)

| # | Nama | Lokasi | Spesialisasi | Drone | Rating | Misi | Mulai |
|---|---|---|---|---|---|---|---|
| 1 | Rizky Pratama | Surabaya | SUTET, Migas | DJI Matrice 300 RTK | 4.95 | 127 | Rp 5jt |
| 2 | Andi Maulana | Bandung | Konstruksi, Survey | DJI Phantom 4 RTK | 4.88 | 89 | Rp 4jt |
| 3 | Dewi Lestari | Jakarta | Solar Farm, Building | DJI Mavic 3 Enterprise | 4.92 | 113 | Rp 3,5jt |
| 4 | Fajar Nugroho | Balikpapan | Migas Offshore | Autel EVO Max 4T | 4.97 | 156 | Rp 8jt |
| 5 | Bayu Saputra | Semarang | Jembatan, Tol | DJI Matrice 30T | 4.85 | 74 | Rp 4,5jt |
| 6 | Sari Handayani | Medan | Bendungan, Irigasi | DJI Mavic 3 Pro | 4.90 | 102 | Rp 4jt |
| 7 | Reza Firmansyah | Makassar | Mining, Quarry | DJI Matrice 300 RTK | 4.93 | 138 | Rp 6jt |
| 8 | Ahmad Wijaya | Pekanbaru | SUTET, BTS Tower | DJI Phantom 4 RTK | 4.86 | 91 | Rp 4,5jt |

### Detail Visual
- Avatar: pakai monogram bergaya (mirip pola di SektorKredibilitas) atau illustration avatar netral. **Hindari foto stock** — terlalu obvious.
- Badge SIAGA Verified: cyan glow `box-shadow: 0 0 12px rgba(0,180,216,0.4)` + ✓ icon
- Card hover: lift `translateY(-8px)` + border glow biru + foto sedikit zoom (1.05)
- Filter chip aktif: bg `--brand-blue`, text white. Inactive: outline `--border-light`

### Animasi
- Saat scroll masuk viewport: cards stagger fade-up 100ms each
- Filter klik: cards yang tidak match fade-out → cards yang match fade-in (FLIP animation)
- Horizontal scroll: smooth, dengan gradient mask di kiri-kanan

---

# ★ SECTION C — LIVE PROJECTS

> *"Live: 47 Proyek Aktif Mencari Pilot"* — Bukti likuiditas sisi demand.

### Posisi
**Extension** dari `JobRadarMap`, di bawahnya tapi masih dalam satu rhythm visual. Atau section terpisah dengan bg `--bg-secondary` (rekomendasi: terpisah, biar transition lebih clean).

### Tujuan
Section A bilang "ada 2 sisi". Section B nampang sisi supply (pilot). Section C nampang sisi demand (proyek). Trifecta lengkap.

### Layout

```
┌───────────────────────────────────────────────────┐
│  [LIVE indicator]  ●  47 Proyek Aktif Mencari    │
│                       Pilot                        │
│                                                   │
│  ┌──────────────────┐ ┌──────────────────┐       │
│  │ Project Card 1   │ │ Project Card 2   │       │
│  └──────────────────┘ └──────────────────┘       │
│  ┌──────────────────┐ ┌──────────────────┐       │
│  │ Project Card 3   │ │ Project Card 4   │       │
│  └──────────────────┘ └──────────────────┘       │
│                                                   │
│  [ Lihat Semua Proyek Aktif → ]                  │
└───────────────────────────────────────────────────┘
```

### Anatomi Project Card

```
┌──────────────────────────────────┐
│  ⚡ Inspeksi 24 Tower SUTET      │  ← icon + judul
│  Bandung Selatan, Jawa Barat     │  ← lokasi
│  ─────────────────────────       │
│                                  │
│  💰  Rp 8jt – Rp 15jt           │  ← budget range
│  👥  12 pilot bidding            │  ← bid count
│  ⏱️   Tutup 3 hari lagi         │  ← deadline (pulsing)
│                                  │
│  [ Lihat Detail → ]              │
└──────────────────────────────────┘
```

### 4 Project Persona

```
1. ⚡ Inspeksi 24 Tower SUTET — Bandung Selatan
   Rp 8-15jt | 12 bid | tutup 3 hari

2. 🛢️ Survey Topografi Kilang Minyak — Cilacap
   Rp 25-40jt | 7 bid | tutup 5 hari

3. 🌉 Inspeksi Jembatan Suramadu — Surabaya
   Rp 18-30jt | 9 bid | tutup 2 hari

4. 📡 Monitoring Konstruksi Tower BTS — Lampung
   Rp 5-9jt | 4 bid | tutup 7 hari
```

### Detail Visual
- "47 Proyek Aktif" → count-up + dot live pulse di sebelahnya (warna `--color-success`)
- Deadline countdown: berdetik realtime (mock saja — set dari client time)
- Card hover: ada glow border `--brand-blue`, deadline berubah warna jadi `--color-warning` jika <24 jam
- Background section: `--bg-secondary` dengan grid pattern halus

### Animasi
- Counter "47" count-up dari 0
- Cards stagger fade-up
- Deadline timer: real `setInterval` decrement (atau static format kalau mau hemat resource)

---

# ★ SECTION D — SERVICE CATEGORIES

> *"Inspeksi Apa yang Anda Butuhkan?"* — Entry point per use-case.

### Posisi
Setelah `Featured Pilots`, sebelum `HowItWorks`.

### Tujuan
- Beda dengan SektorKredibilitas marquee (yang sifatnya brand-level)
- Section ini action-level: klik card → langsung mulai posting proyek di kategori itu

### Layout — Grid 3×2

```
┌───────────────────────────────────────────────────┐
│  [HEADING]                                        │
│  Inspeksi Apa yang Anda Butuhkan?                 │
│                                                   │
│  ┌────────┐ ┌────────┐ ┌────────┐                │
│  │  Cat1  │ │  Cat2  │ │  Cat3  │                │
│  ├────────┤ ├────────┤ ├────────┤                │
│  │  Cat4  │ │  Cat5  │ │  Cat6  │                │
│  └────────┘ └────────┘ └────────┘                │
└───────────────────────────────────────────────────┘
```

### Anatomi Category Card

```
┌──────────────────────────┐
│  ┌──────────────────┐    │
│  │ [Foto/Ilustrasi] │    │  ← bisa pakai foto dari
│  │   180×120 px     │    │     /drone-anatomy yang ada,
│  └──────────────────┘    │     atau ilustrasi custom
│                          │
│  Tower SUTET             │  ← nama kategori
│  & Transmisi Listrik     │
│  ──────────────────      │
│  Inspeksi konduktor,     │  ← deskripsi 2 baris
│  isolator, klem & spacer.│
│                          │
│  142 pilot tersedia ·    │  ← liquidity proof
│  mulai Rp 5jt            │
│                          │
│  [ Posting Inspeksi → ]  │
└──────────────────────────┘
```

### 6 Kategori

| # | Nama | Deskripsi | Pilot | Mulai |
|---|---|---|---|---|
| 1 | **Tower SUTET & Transmisi** | Inspeksi konduktor, isolator, klem | 142 | Rp 5jt |
| 2 | **Jembatan & Jalan Tol** | Inspeksi struktur, ekspansion joint, drainase | 87 | Rp 7jt |
| 3 | **Pipa Migas & Kilang** | Survey pipeline, leak detection, thermal | 64 | Rp 12jt |
| 4 | **Solar Panel Farm** | Thermal scan panel, anomali shading | 51 | Rp 4jt |
| 5 | **Konstruksi Tinggi & Crane** | Progress monitoring, quality check | 113 | Rp 4,5jt |
| 6 | **Bendungan & Irigasi** | Inspeksi bendung, saluran, struktur beton | 78 | Rp 6jt |

### Detail Visual
- Card: glassmorphism light ringan, border `--border-light`, radius `--radius-lg`
- Hover: ilustrasi zoom 1.05, accent border glow biru, "→" slide masuk dari kanan
- "X pilot tersedia" angka count-up saat masuk viewport
- Background section: `--bg-secondary`

---

# ★ SECTION E — TRUST & SAFETY

> *"Marketplace Aman, dengan Empat Lapis Jaminan."*

### Posisi
Setelah `HowItWorks`, sebelum `SektorKredibilitas`.

### Tujuan
Section pembeda terbesar SIAGA vs tender konvensional dan vs job board lain. PRD sudah punya semua framework — section ini menjadikannya visible & dramatis.

### Layout — 4 Pilar Berdampingan

```
┌───────────────────────────────────────────────────┐
│  [HEADING]                                        │
│  Marketplace Aman, dengan                         │
│  Empat Lapis Jaminan.                             │
│                                                   │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │
│  │ Pillar │ │ Pillar │ │ Pillar │ │ Pillar │    │
│  │   1    │ │   2    │ │   3    │ │   4    │    │
│  └────────┘ └────────┘ └────────┘ └────────┘    │
│                                                   │
└───────────────────────────────────────────────────┘
```

### 4 Pilar — Detail

#### Pilar 1: Escrow Payment
- **Icon:** vault / lock with money
- **Headline:** "Dana Aman di Escrow"
- **Body:** "Pembayaran ditahan SIAGA sampai laporan inspeksi disetujui. Pilot terjamin dibayar, perusahaan terjamin hasil sesuai."
- **Mini visual:** animasi step horizontal `Client → SIAGA Hold → Pilot Work → Approve → Pilot Receive`
- **Border-top color:** `--brand-blue`

#### Pilar 2: SIAGA Verified Pilot
- **Icon:** shield with checkmark
- **Headline:** "Setiap Pilot Tervalidasi"
- **Body:** "Sertifikat SIDOPI, lisensi drone, dan riwayat pekerjaan kami verifikasi manual. Hanya pilot bersertifikat aktif yang bisa bid."
- **Mini visual:** card pilot dengan badge ✓ stamping animation
- **Border-top color:** `--brand-cyan`

#### Pilar 3: Two-Way Rating
- **Icon:** dua arrow circular
- **Headline:** "Reputasi Dua Arah"
- **Body:** "Perusahaan menilai pilot, pilot menilai perusahaan. Setiap proyek selesai membentuk track record digital yang transparan."
- **Mini visual:** 5-star rating animation di kedua sisi
- **Border-top color:** `--color-success`

#### Pilar 4: End-to-End Encryption
- **Icon:** lock with binary
- **Headline:** "Data Terenkripsi AES-256"
- **Body:** "Foto, video, dan koordinat GPS aset Anda dienkripsi tingkat militer. Watermark otomatis sampai pembayaran selesai."
- **Mini visual:** data block dengan animasi enkripsi (text → garbled)
- **Border-top color:** `--brand-navy`

### Detail Visual
- Card: glassmorphism light, border-top 3px dengan accent color masing-masing
- Background: `--bg-primary`
- Mini visual di atas tiap card: ukuran fix 100×60px, animasi loop subtle
- Hover: card lift, border-top glow

---

# ★ SECTION F — PRICING & KOMISI TRANSPARAN

> *"Posting GRATIS. Bayar hanya saat proyek selesai."*

### Posisi
Sebelum `FinalCTA`, setelah `SektorKredibilitas`.

### Tujuan
Last objection killer sebelum CTA. B2B procurement tidak akan klik daftar tanpa tahu biaya. Tampil transparan = membangun trust + memvalidasi profesionalitas.

### Layout — Dua Card Bersisian

```
┌─────────────────────────┬─────────────────────────┐
│   UNTUK PERUSAHAAN      │   UNTUK PILOT           │
│                         │                         │
│   Posting GRATIS        │   Daftar GRATIS         │
│   Bayar saat selesai    │   Komisi platform 7%    │
│                         │   Anda simpan 93%       │
│                         │                         │
│   [Tier comparison]     │   [Tier comparison]     │
│                         │                         │
│   [CTA Posting Proyek]  │   [CTA Daftar Pilot]    │
└─────────────────────────┴─────────────────────────┘

[Toggle: Monthly | Yearly (-20%)]   ← optional

❌ Tidak ada biaya posting
❌ Tidak ada biaya bid
❌ Tidak ada biaya tersembunyi
❌ Tidak ada biaya pembatalan
```

### Tier — Untuk Perusahaan

| Fitur | **Free** | **Pro** ⭐ | **Enterprise** |
|---|---|---|---|
| Posting proyek | ✓ Unlimited | ✓ Unlimited | ✓ Unlimited |
| Verified pilot access | ✓ | ✓ | ✓ |
| Live monitoring | Basic | Advanced | Advanced + AI |
| One-Click PDF Report | ✓ | ✓ branded | ✓ custom branded |
| API integration | — | — | ✓ |
| Dedicated success manager | — | — | ✓ |
| **Harga** | **Rp 0** | **Rp 2,5jt/bln** | **Custom** |

### Tier — Untuk Pilot

| Fitur | **Free** | **Verified+** ⭐ | **Agency** |
|---|---|---|---|
| Bid proyek | ✓ Unlimited | ✓ Unlimited | ✓ Unlimited |
| Komisi platform | 7% | 5% | 3% |
| Verified badge | — | ✓ Verified+ | ✓ Agency |
| Priority listing | — | ✓ | ✓ Top |
| Multi-pilot management | — | — | ✓ |
| **Harga** | **Rp 0** | **Rp 99rb/bln** | **Rp 499rb/bln** |

### Detail Visual
- Tier tengah (Pro / Verified+): border `--brand-blue` 2px, badge "PALING POPULER" floating di atas
- Section "Apa yang TIDAK kami biayakan": grid 4 negative chip dengan ❌ icon — strategy negative framing
- Background section: `--bg-secondary`

### Catatan Strategis
Kalau angka pricing belum final dari tim bisnis, gunakan placeholder "Coming Soon — Free for Beta Users" + tetap tampilkan **transparansi komisi 7%**. Yang penting prinsipnya jelas.

---

# ★ SECTION G — COMPARISON TABLE

> *"Tiga Cara Mendapatkan Pilot Drone. Hanya Satu yang Layak untuk Infrastruktur Anda."*

### Posisi
Setelah `ProblemSolution`, sebelum `JobRadarMap`. Mengalir natural sebagai extension narasi "industri lama → solusi baru → bukti perbandingan".

### Tujuan
Killer differentiator section. Menjawab langsung pertanyaan defensif: "kenapa nggak pakai tender biasa atau job board sebelah?". Dan ini menggetarkan juri SEFEST.

### Layout — Tabel 4 Kolom

```
┌─────────────────────────────────────────────────────────┐
│  [HEADING]                                              │
│  Tiga Cara Mendapatkan Pilot Drone.                     │
│  Hanya Satu yang Layak untuk Infrastruktur Anda.        │
│                                                         │
│  ┌─────────┬────────┬────────┬──────────┐              │
│  │         │ Tender │ Job    │  SIAGA   │              │
│  │Kriteria │ Manual │ Board  │  ⭐       │              │
│  ├─────────┼────────┼────────┼──────────┤              │
│  │ ... 8 baris ...                       │              │
│  └─────────┴────────┴────────┴──────────┘              │
│                                                         │
│  [ Mulai Inspeksi Pertama Anda → ]                      │
└─────────────────────────────────────────────────────────┘
```

### Isi Tabel (8 Baris)

| Kriteria | Tender Manual | Job Board Biasa | **SIAGA** ⭐ |
|---|---|---|---|
| Waktu posting → bid pertama | 3-6 bulan | 1-2 minggu | **48 jam ⚡** |
| Verifikasi pilot | Manual document | Self-declared | **Tervalidasi ✓** |
| Jaminan pembayaran | ❌ | ❌ | **Escrow ✓** |
| Format laporan | Beda-beda | Beda-beda | **Standarisasi ✓** |
| Live monitoring | ❌ | ❌ | **✓** |
| Auto-generate PDF report | ❌ | ❌ | **<30 detik ⚡** |
| Dispute resolution | Hukum formal | Email support | **In-platform** |
| Two-way rating | ❌ | Satu arah | **✓** |

### Detail Visual — Yang Bikin Section Ini Premium

#### Kolom SIAGA Stand-Out
- Background: gradient cyan-blue `linear-gradient(180deg, rgba(0,180,216,0.05), rgba(0,98,214,0.08))`
- Border: 2px solid `--brand-blue` + glow `0 0 32px rgba(0,98,214,0.15)`
- Header: badge "⭐ RECOMMENDED" floating di atasnya
- Cell: ikon ✓ semua hijau (`--color-success`), font weight tegas
- Cell tender/job board: ikon ❌ merah muted (`--color-danger` opacity 0.6), font reguler

#### Animasi Reveal
- Header kolom muncul stagger 150ms dari kiri
- Tiap baris muncul satu per satu top-down (stagger 100ms)
- Cell SIAGA di tiap baris: subtle scale bounce `1.0 → 1.05 → 1.0` supaya mata tertarik
- Total durasi reveal: ~1.8 detik

#### Mobile Adaptation
Tabel 4 kolom di mobile bermasalah. Solusi:
- Mobile: ubah jadi 3 card vertikal stack
- Card SIAGA paling atas, paling besar, dengan semua kriteria langsung visible
- Card "Tender Manual" dan "Job Board Biasa" jadi accordion collapse: "Lihat perbandingan dengan Tender Manual"

### Copy Direction — Hindari Kesombongan
- ❌ "Kami yang terbaik"
- ✓ "Bandingkan sendiri — putuskan dengan data, bukan asumsi."
- Footer table: "Data perbandingan berdasarkan rata-rata industri inspeksi infrastruktur Indonesia 2024."
- Pakai adjective objektif ("manual", "self-declared", "tervalidasi"), bukan emosional ("ribet", "ngak aman")

### Risiko Section Ini
Comparison table = ego risk. Kalau angkanya tidak presisi atau klaim overreach, juri/user bisa challenge balik. Mitigasi:
1. Pakai range, bukan absolut
2. Pakai adjective objektif
3. Hindari klaim yang tidak bisa dibuktikan — jangan cantumkan sertifikasi formal yang belum dimiliki

---

## 🎨 DESIGN TOKEN — REUSE FROM EXISTING

Semua section baru WAJIB pakai token yang sudah ada di Plan_LandingPage.md. Tidak boleh introduce token baru kecuali sangat perlu.

```css
/* Reuse */
--bg-primary:       #FBFDFF
--bg-secondary:     #F1F5F9
--bg-surface:       #FFFFFF
--brand-navy:       #0A2540
--brand-blue:       #0062D6
--brand-cyan:       #00B4D8
--brand-sky:        #E8F4FD
--text-primary:     #0A2540
--text-secondary:   #4A6885
--color-danger:     #E53935
--color-success:    #00897B
--shadow-sm/md/lg
--border-light:     rgba(10,37,64,0.06)
```

---

## 📱 RESPONSIVE STRATEGY

| Section | Desktop (>1024px) | Tablet (768-1024px) | Mobile (<768px) |
|---|---|---|---|
| A. Dual Audience | Split 50/50 | Split 50/50 ringkas | Stack vertikal |
| B. Featured Pilots | Horizontal scroll 6 visible | Scroll 4 visible | Scroll 1.5 visible |
| C. Live Projects | Grid 2×2 | Grid 2×2 | Stack vertikal |
| D. Service Categories | Grid 3×2 | Grid 2×3 | Stack vertikal |
| E. Trust & Safety | 4 col berdampingan | 2×2 | Stack vertikal |
| F. Pricing | 2 card berdampingan | 2 card berdampingan | Stack vertikal |
| G. Comparison Table | Tabel 4 kolom | Tabel 4 kolom (scroll) | 3 card vertikal + accordion |

---

## 🚀 IMPLEMENTATION PRIORITY

### Phase 1 — Tier 1 (Quick Win, Highest Impact)
Kalau timeline mepet, bangun ini dulu:
1. **A. Dual Audience** — paling impactful untuk shifting persepsi
2. **B. Featured Pilots** — DNA marketplace
3. **C. Live Projects** — bukti likuiditas

### Phase 2 — Tier 2 (Depth & Trust)
4. **D. Service Categories** — entry point per use-case
5. **E. Trust & Safety** — close trust objection
6. **F. Pricing & Komisi** — close pricing objection

### Phase 3 — Tier 3 (Killer Differentiator)
7. **G. Comparison Table** — head-to-head kompetitor

### Estimasi (per section, full polish dengan animasi)
- Section sederhana (D, F): 1 hari
- Section sedang (A, C, E, G): 1.5-2 hari
- Section kompleks (B): 2-3 hari (karena interaksi filter + horizontal scroll)
- **Total estimasi 7 section penuh:** ~12-15 hari kerja (1 developer fokus)

---

## 📂 FILE STRUCTURE (Saran)

Setiap section dibuat sebagai komponen terpisah, mirroring pattern yang sudah ada:

```
src/components/
├── DualAudience/
│   ├── DualAudience.jsx
│   └── DualAudience.css
├── FeaturedPilots/
│   ├── FeaturedPilots.jsx
│   ├── FeaturedPilots.css
│   └── pilots-data.js
├── LiveProjects/
│   ├── LiveProjects.jsx
│   ├── LiveProjects.css
│   └── projects-data.js
├── ServiceCategories/
│   ├── ServiceCategories.jsx
│   └── ServiceCategories.css
├── TrustSafety/
│   ├── TrustSafety.jsx
│   └── TrustSafety.css
├── Pricing/
│   ├── Pricing.jsx
│   └── Pricing.css
└── ComparisonTable/
    ├── ComparisonTable.jsx
    └── ComparisonTable.css
```

App.jsx update (sketch — TIDAK dieksekusi sekarang):
```jsx
<Hero />
<StatsBar />
<DualAudience />              {/* ← BARU */}
<ProblemSolution />
<ComparisonTable />           {/* ← BARU */}
<JobRadarSection />
<LiveProjects />              {/* ← BARU */}
<FeaturedPilots />            {/* ← BARU */}
<ServiceCategories />         {/* ← BARU */}
<HowItWorks />
<TrustSafety />               {/* ← BARU */}
<SektorKredibilitas />
<Pricing />                   {/* ← BARU */}
<ClosingSection>
  <FinalCTA />
  <Footer />
</ClosingSection>
```

---

## ✅ COMPLIANCE CHECKLIST

Sebelum mulai coding tiap section:

- [ ] Tidak menyentuh file existing (Hero, StatsBar, ProblemSolution, JobRadarMap, HowItWorks, SektorKredibilitas, FinalCTA, Footer)
- [ ] Pakai design token existing (Plan_LandingPage.md)
- [ ] Konsisten dengan color rhythm `#FBFDFF` ↔ `#F1F5F9`
- [ ] Animasi pakai GSAP + ScrollTrigger (pattern yang sudah ada)
- [ ] Typography: Plus Jakarta Sans (display) + Inter (body)
- [ ] Icons: Lucide React only
- [ ] Responsive di 3 breakpoints minimum
- [ ] Hormati `prefers-reduced-motion`
- [ ] Persona/data fiktif konsisten dengan SektorKredibilitas existing

---

*Document version: 1.0*
*Last updated: planning phase — execution belum dimulai*
*Status: ready untuk eksekusi kapan pun siap*
