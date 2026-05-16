Sudah saya riset referensinya. Meskipun kedua website tidak bisa diakses langsung, saya sudah memahami karakteristik desain dari kedua referensi tersebut berdasarkan penelusuran — **eatnaked.co** dikenal dengan pendekatan **scrollytelling organik, whitespace besar, sticky visual + text reveal**, sementara **chainzoku.io** terkenal dengan **sticky horizontal step panel, dark tech aesthetic, progress indicator, dan cinematic transitions**.

referensi website yang harus di adaptasi (Amati, Tiru, dan Modifikasi) ke web SIAGA : https://eatnaked.co/ dan https://chainzoku.io/?ref=godly

Saya akan adaptasi keduanya ke light mode SIAGA. Berikut planning detailnya:

---

# 📐 PLANNING DETAIL — HALAMAN 2: HOW IT WORKS
### SIAGA — Sistem Inspeksi Aerial Geospasial Andalan
**Light Mode | Adaptasi: eatnaked.co × chainzoku.io**

---

## 🎨 ADAPTASI REFERENSI → SIAGA

| Elemen | Dari eatnaked.co | Dari chainzoku.io | Adaptasi SIAGA Light Mode |
|---|---|---|---|
| Layout filosofi | Whitespace besar, breathable | Dense, dark, tech-heavy | Airy layout dengan aksen teknis |
| Storytelling | Organic scroll reveal per section | Sticky step-by-step panel | Sticky visual + scrolling text steps |
| Typography | Oversized headline, editorial | Monospace/technical labels | Montserrat besar + Inter label teknis |
| Visual utama | Fullscreen photo/illustration | 3D/mockup pinned | Mockup dashboard pinned di kanan |
| Transisi | Soft fade + slide organik | Hard cut + dramatic zoom | Smooth fade + subtle slide |
| Progress | Tidak ada | Numbered step indicator vertikal | Step tracker vertikal di kiri |
| Warna BG | Cream/white bersih | Dark navy dominan | `#F4F7F6` + aksen `#0A192F` & `#00D2FF` |

---

## 🏗️ STRUKTUR HALAMAN (TOP TO BOTTOM)

```
┌─────────────────────────────────────┐
│  SECTION 0 — Mini Hero              │
├─────────────────────────────────────┤
│  SECTION 1 — STICKY SCROLLYTELLING  │
│  (Core Section, ~400vh tinggi)      │
│                                     │
│  [Step 1] Post Project              │
│  [Step 2] Review Pilot Bids         │
│  [Step 3] Monitor Real-Time         │
│  [Step 4] One-Click Report          │
├─────────────────────────────────────┤
│  SECTION 2 — Connector Bridge       │
├─────────────────────────────────────┤
│  SECTION 3 — Demo Reel              │
├─────────────────────────────────────┤
│  SECTION 4 — Final CTA              │
└─────────────────────────────────────┘
```

---

## SECTION 0 — MINI HERO

**Tinggi:** `100vh` → lalu langsung masuk ke sticky section

**Layout:** Centered, full width

**Background:** `#F4F7F6` (Light Gray) — bersih, breathable ala eatnaked.co

**Konten:**
```
[Label chip kecil]  ✦  CARA KERJA PLATFORM
        
  [H1 — Montserrat Bold, 72px]
  Dari Proyek Posting  
  Hingga Laporan Siap  
  — Dalam Satu Ekosistem.

  [Subtitle — Inter Regular, 18px, warna #6B7280]
  Empat langkah sederhana yang menghubungkan perusahaan,
  pilot, dan data inspeksi secara digital end-to-end.

  [Scroll hint — animated bouncing arrow ke bawah]
  ↓ Scroll untuk menjelajahi
```

**Animasi masuk:**
- Label chip: `fade + scale dari 0.8 → 1` saat load
- H1: Setiap baris muncul stagger 150ms dengan `clip-path: inset(0 0 100% 0) → inset(0 0 0% 0)` (text reveal dari bawah, ala eatnaked.co)
- Subtitle: `fade-in + translateY(20px → 0)` setelah H1 selesai
- Scroll hint: `bounce animation` loop

**Elemen dekoratif:**
- Dua garis tipis `#00D2FF` opacity 15% diagonal di background (subtle, tech feel)
- Dot grid pattern sangat halus di pojok kanan atas (seperti graph paper)

---

## SECTION 1 — STICKY SCROLLYTELLING (CORE)

> **Terinspirasi chainzoku.io:** Panel visual sticky di satu sisi + teks step berganti di sisi lain saat scroll

**Tinggi container:** `500vh` (cukup lambat dan dramatis saat di-scroll)

**Implementasi teknis:**
```css
.sticky-container {
  height: 500vh;
}
.sticky-panel {
  position: sticky;
  top: 0;
  height: 100vh;
  display: grid;
  grid-template-columns: 120px 1fr 1fr;
  /* [Step Tracker] [Visual Mockup] [Text Content] */
}
```

---

### 🔲 KOLOM KIRI — STEP TRACKER (120px)

**Terinspirasi chainzoku.io:** Vertical numbered progress indicator

```
  ●  ← titik aktif (filled cyan #00D2FF, ukuran 12px)
  │
  │  ← garis vertikal tipis (#E5E7EB)
  │
  ○  ← titik tidak aktif (outline gray)
  │
  ○
  │
  ○
```

- Nomor step: `01` `02` `03` `04` dalam font monospace, 11px, warna abu muted
- Label mini step di samping titik: "Post" / "Select" / "Monitor" / "Report" — Inter 10px uppercase tracking-widest
- Garis pengisi: `height` berubah dengan `scaleY` sesuai scroll progress (GSAP ScrollTrigger scrub)
- Titik aktif: pulse animation `box-shadow: 0 0 0 4px rgba(0,210,255,0.2)`

---

### 🖥️ KOLOM TENGAH — VISUAL MOCKUP (sticky, berubah per step)

**Lebar:** ~55% viewport — dominan secara visual

**Background area visual:** `#0A192F` (Deep Space Navy) — satu-satunya elemen gelap di halaman, menciptakan kontras dramatis di tengah halaman light mode. Terinspirasi eatnaked.co yang berani kontras warna.

**Bentuk container:** Rounded corner `border-radius: 24px`, dengan subtle shadow

**Transisi antar step:** Crossfade + subtle scale `1.02 → 1.00` (bukan slide, jadi seamless dan sinematik)

---

**VISUAL STEP 1 — Post Your Project**

Mockup: Browser window frame (dark) menampilkan **4-step project wizard SIAGA**

```
┌──────────────────────────────────┐
│  ● ● ●  siaga.id/post-project   │
├──────────────────────────────────┤
│                                  │
│  [Stepper: ①②③④]               │
│                                  │
│  📍 Marking Area Inspeksi        │
│                                  │
│  [Mini Mapbox dark screenshot]   │
│  [Pin cyan bergerak/animated]    │
│                                  │
│  [Form fields: Nama Proyek,      │
│   Jenis Infrastruktur]           │
│                                  │
│  [Button: Lanjut →]             │
└──────────────────────────────────┘
```

Animasi dalam mockup:
- Pin peta berdenyut (CSS pulse)
- Cursor animasi bergerak ke field lalu klik button (menunjukkan interaksi)

---

**VISUAL STEP 2 — Review Pilot Bids**

Mockup: **Bidding Review Dashboard** — tabel komparatif 3 pilot

```
┌──────────────────────────────────┐
│  ● ● ●  siaga.id/bids/proj-01   │
├──────────────────────────────────┤
│  3 Penawaran Masuk               │
│                                  │
│  ┌──────────────────────────┐    │
│  │ 🟢 Rizky A.  ★4.9  VERIFIED  │ ←highlighted
│  │ Rp 8.500.000 · 5 hari   │    │
│  │ [Lihat] [PILIH PILOT ✓] │    │
│  └──────────────────────────┘    │
│  ┌──────────────────────────┐    │
│  │ Ahmad S.   ★4.7          │    │
│  │ Rp 9.200.000 · 6 hari   │    │
│  └──────────────────────────┘    │
└──────────────────────────────────┘
```

Animasi: Row pertama highlight dengan border cyan glow, tombol "PILIH PILOT" pulse

---

**VISUAL STEP 3 — Monitor Real-Time**

Mockup: **Asset Monitoring Dashboard** dengan peta mini + status kondisi aset

```
┌──────────────────────────────────┐
│  ● ● ●  siaga.id/monitor/aset   │
├──────────────────────────────────┤
│  MENARA SUTET — JAWA BARAT      │
│                                  │
│  [Mini Map gelap: 3 pin]         │
│  🟢 Aman  🟡 Perhatian  🔴 Kritis │
│                                  │
│  Progress Inspeksi:              │
│  [████████░░] 78%               │
│   ↑ animasi bar mengisi          │
│                                  │
│  📸 Foto terbaru: 2 menit lalu   │
└──────────────────────────────────┘
```

Animasi: Progress bar mengisi otomatis (loop), pin merah berdenyut

---

**VISUAL STEP 4 — One-Click Report**

Mockup: **Report Generator page** + PDF preview muncul

```
┌──────────────────────────────────┐
│  ● ● ●  siaga.id/report-gen     │
├──────────────────────────────────┤
│                                  │
│  [ SIAGA: Generate Report  🚁 ]  │
│   ← tombol besar cyan glowing    │
│                                  │
│  ┌────────────────────────────┐  │
│  │  📄 LAPORAN INSPEKSI SIAGA │  │
│  │  ──────────────────────── │  │
│  │  📍 GPS Koordinat: ✓       │  │
│  │  📸 Galeri Foto: ✓         │  │
│  │  📊 Tabel Kondisi: ✓       │  │
│  │  ✍️  Tanda Tangan: ✓       │  │
│  │                            │  │
│  │  [⬇ Download PDF]          │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

Animasi: PDF card slide-up dengan bounce, checklist item muncul satu per satu

---

### 📝 KOLOM KANAN — TEXT CONTENT (berubah per step)

**Terinspirasi eatnaked.co:** Large editorial typography, whitespace, sangat breathable

**Setiap step memiliki struktur teks:**

```
[Label kecil monospace, cyan]
01 / POSTING PROYEK

[Headline Montserrat Bold, 42px, #0A192F]
Deskripsikan Proyek  
Anda dalam  
4 Langkah Mudah.

[Body Inter Regular, 17px, #374151, line-height 1.8]
Tidak ada form rumit, tidak ada tender 
berbulan-bulan. Tandai area inspeksi 
langsung di peta, tentukan spesifikasi 
teknis, dan proyek Anda langsung 
terekspos ke ratusan pilot tersertifikasi.

[Feature pills — 3 chip kecil]
[📍 Peta Interaktif] [📋 Form 4 Step] [⚡ Publish Instan]
```

**Animasi text per step:**
- Saat step aktif: `opacity: 0 → 1` + `translateY(24px → 0)`, duration 400ms ease-out
- Saat step tidak aktif: `opacity: 0 + translateY(-12px)`, dengan delay sedikit

---

### 🔄 LOGIKA SCROLL → STEP TRIGGER

```javascript
// GSAP ScrollTrigger — scrub linked ke scroll position

ScrollTrigger.create({
  trigger: ".sticky-container",
  start: "top top",
  end: "bottom bottom",
  scrub: true,
  onUpdate: (self) => {
    const progress = self.progress; // 0 to 1
    const step = Math.floor(progress * 4); // 0,1,2,3
    activateStep(step); // switch visual + text
  }
});
```

Setiap 25% scroll = 1 step berganti (total 4 step × 500vh = 125vh per step)

---

## SECTION 2 — CONNECTOR BRIDGE

**Tinggi:** Auto (sekitar 200px)

**Tujuan:** Transisi visual setelah scrollytelling berakhir — "napas" sebelum demo reel

**Layout:** Full width, centered

**Background:** Gradient dari `#F4F7F6` → `#FFFFFF`

**Konten:**

```
[Garis horizontal tipis cyan di tengah, lebar 80px]

[Teks kecil Inter, 14px, gray]
— Semua langkah ini terintegrasi dalam satu platform —

[3 ikon kecil berjajar: 🏢 Perusahaan  ←→  🚁 Pilot  ←→  📊 Data]
dengan garis koneksi animasi (dash-offset animation berjalan)
```

---

## SECTION 3 — DEMO REEL / VIDEO SHOWCASE

**Tinggi:** `100vh`

**Terinspirasi eatnaked.co:** Fullscreen media dengan whitespace, tidak cluttered

**Layout:**
```
┌─────────────────────────────────────────────────┐
│                                                 │
│   Lihat SIAGA Bekerja                           │
│   dalam 60 Detik.                               │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │                                         │    │
│  │         [VIDEO PLAYER]                  │    │
│  │   Background: aerial drone footage      │    │
│  │   Play button: glassmorphism circle     │    │
│  │                                         │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  "Platform pertama di Indonesia yang            │
│   mengubah inspeksi infrastruktur menjadi       │
│   ekosistem digital terverifikasi."             │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Detail video player:**
- Thumbnail: foto aerial menara SUTET dari atas (Unsplash free — keyword: "aerial power lines")
- Play button: lingkaran putih dengan `backdrop-filter: blur(10px)`, ikon play segitiga navy
- Hover: Play button scale 1.1 + subtle glow
- Border radius container: 20px dengan shadow sedang

**Fallback (jika belum ada video):**
- Autoplay GIF/loop video pendek 5 detik menunjukkan mockup platform
- Atau: screenshot collage animasi 3 panel mockup berbeda

---

## SECTION 4 — FINAL CTA

**Tinggi:** Auto (sekitar 400px)

**Background:** `#0A192F` (Deep Space Navy) — dark block di akhir halaman light, dramatis

**Layout:** Centered

```
[Teks kecil cyan uppercase tracking-wide]
SIAP MEMULAI?

[H2 Montserrat Bold, 52px, white]
Infrastruktur Anda  
Layak Mendapat  
Pengawasan Terbaik.

[Dua CTA button berdampingan]
[🏢 Hire a Pilot →]        [🚁 Join as Pilot →]
  Background cyan            Outline white/cyan

[Teks kecil di bawah, Inter 13px, gray-400]
Sudah bergabung? — Login ke Dashboard →
```

**Background decorative:**
- Partikel kecil putih opacity 20% mengambang pelan (50 partikel — lebih sedikit dari Landing Page)
- Atau: Subtle grid lines putih opacity 5%

---

## 🎬 RINGKASAN ANIMASI & INTERAKSI

| Elemen | Animasi | Library | Trigger |
|---|---|---|---|
| H1 Section 0 | Text clip-path reveal, stagger | GSAP | Page load |
| Step tracker garis | scaleY 0→1 | GSAP ScrollTrigger scrub | Scroll |
| Titik aktif | Pulse glow | CSS keyframe | JS class toggle |
| Visual mockup crossfade | opacity + scale | GSAP | Scroll step change |
| Animasi dalam mockup | Loop CSS animations | CSS | Always running |
| Teks per step | fade + translateY | Framer Motion | Scroll step change |
| Feature pills | stagger bounce-in | GSAP | Step activate |
| Video play button | scale + glow on hover | CSS transition | Hover |
| Final CTA masuk | fade + slide up | GSAP ScrollTrigger | Viewport enter |

---

## 📱 RESPONSIVE BEHAVIOR

| Breakpoint | Perubahan Layout |
|---|---|
| **Desktop (>1280px)** | 3 kolom: [Tracker 120px] [Visual 55%] [Text 40%] |
| **Laptop (1024-1280px)** | 2 kolom: Visual kiri 50% + Text kanan 50%, tracker jadi top bar |
| **Tablet (768-1024px)** | Stack vertikal: Visual penuh → Text di bawah, scroll normal |
| **Mobile (<768px)** | Full stack, sticky dinonaktifkan, step muncul satu per satu scroll biasa |

---

## 🎨 COLOR USAGE SUMMARY (Light Mode)

```
Background utama:     #F4F7F6  (Light Gray)
Background mockup:    #0A192F  (Navy — kontras elemen)
Teks headline:        #0A192F
Teks body:            #374151
Label/caption:        #6B7280
Aksen aktif:          #00D2FF  (Cyan)
Success indicator:    #00C48C
Danger indicator:     #FF4C4C
Border subtle:        #E5E7EB
```

---

## ✅ PRIORITY IMPLEMENTATION CHECKLIST

```
[ ] Section 0 — Mini Hero + text reveal animation
[ ] Sticky container setup (position: sticky + height: 500vh)
[ ] Step tracker kolom kiri + scroll-linked progress
[ ] 4 mockup visual (bisa start dengan static screenshot dulu)
[ ] Text content per step + fade transition
[ ] Scroll logic (GSAP ScrollTrigger atau IntersectionObserver)
[ ] Section 3 — Video/demo placeholder
[ ] Section 4 — Dark CTA block
[ ] Responsive breakpoints
[ ] Polish: micro-animations dalam setiap mockup
```

---

Mau langsung lanjut ke **build React/HTML-nya** untuk halaman ini, atau ada bagian yang ingin direvisi dulu dari planning ini?