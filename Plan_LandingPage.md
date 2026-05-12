Tentu! Ini adalah versi *master plan* SIAGA yang sudah diperbarui secara menyeluruh. Saya telah memasukkan semua perbaikan token warna, penyesuaian kontras *background*, pembaruan tipografi menjadi lebih modern (menggunakan Plus Jakarta Sans), serta penambahan sistem *border* untuk efek *glassmorphism* dan elevasi *card* yang lebih premium.

Berikut adalah *full plan* revisinya:

# 🌟 SIAGA — MASTER FRONTEND PLANNING: LANDING PAGE

## "Light Mode Edition — Bersih, Premium, Powerful"

---

## 🎨 FILOSOFI DESAIN LIGHT MODE

Bukan light mode yang biasa — bukan putih polos membosankan. Inspirasinya adalah **Apple.com**, **Linear.app**, dan **Vercel.com**: putih bersih dengan aksen warna yang kuat, tipografi besar dan berani, dan elemen 3D yang kontras dramatis di atas background terang. Kesannya: **korporat premium, tech-grade, terpercaya** — sangat cocok untuk platform B2B inspeksi infrastruktur kritis.

---

## 🎨 DESIGN SYSTEM — LIGHT MODE TOKEN

```
── BACKGROUNDS & SURFACES ───────────────────────────
--bg-primary:       #FBFDFF   (putih bersih dengan hint biru sangat tipis)
--bg-secondary:     #F1F5F9   (abu biru tegas untuk pemisah section)
--bg-surface:       #FFFFFF   (putih murni KHUSUS untuk card, popup, sidebar agar pop-out)
--bg-overlay:       rgba(251,253,255,0.85)

── BRAND COLORS ─────────────────────────────────────
--brand-navy:       #0A2540   (navy tua — primary text)
--brand-blue:       #0062D6   (biru SIAGA — CTA, accent, sedikit digelapkan agar kontras di light mode)
--brand-cyan:       #00B4D8   (cyan — KHUSUS highlight, border, 3D emissive, bukan untuk teks)
--brand-sky:        #E8F4FD   (biru muda — bg accent)

── TEXT ─────────────────────────────────────────────
--text-primary:     #0A2540
--text-secondary:   #4A6885
--text-tertiary:    #8BA3BE
--text-inverse:     #FFFFFF

── STATUS ───────────────────────────────────────────
--color-danger:     #E53935
--color-success:    #00897B
--color-warning:    #F57C00

── SHADOWS ──────────────────────────────────────────
--shadow-sm:   0 2px 8px rgba(10,37,64,0.06)
--shadow-md:   0 8px 32px rgba(10,37,64,0.10)
--shadow-lg:   0 24px 64px rgba(10,37,64,0.14)
--shadow-blue: 0 8px 32px rgba(0,98,214,0.25)

── BORDERS & GLASSMORPHISM ──────────────────────────
--border-light:     rgba(10,37,64,0.06)
--border-focus:     rgba(0,98,214,0.30)
--glass-border:     inset 0 0 0 1px rgba(255,255,255,0.6)

── TYPOGRAPHY ───────────────────────────────────────
--font-display: 'Plus Jakarta Sans', sans-serif
--font-body:    'Inter', sans-serif

── BORDER RADIUS ────────────────────────────────────
--radius-sm: 6px  | --radius-md: 12px
--radius-lg: 20px | --radius-xl: 32px

```

---

## ⚙️ TECH STACK

```
Core 3D      : Three.js + React Three Fiber + @react-three/drei
Scroll       : GSAP ScrollTrigger + Lenis (smooth scroll)
Animation    : GSAP + Framer Motion
Maps         : Mapbox GL JS (satellite-streets-v12)
Post FX      : @react-three/postprocessing (Bloom subtle, SSAO)
Icons        : Lucide React (100% bebas hak cipta)
Build        : Vite + React

```

---

## 🔒 NAVBAR

**Behavior:**

* Di paling atas: `background: transparent`
* Setelah scroll 60px: `background: var(--bg-overlay)` + `backdrop-filter: blur(16px)` + `border-bottom: 1px solid var(--border-light)` + `box-shadow: var(--shadow-sm)`
* Transisi smooth 0.3 detik

**Konten:**

* Logo: Wordmark "SIAGA" Plus Jakarta Sans ExtraBold navy + ikon SVG drone minimalis custom di sampingnya
* Nav links: Inter Medium 14px, `--text-secondary`, hover → `--text-primary` + underline slide `--brand-blue`
* CTA kanan: `[Masuk]` outline tipis + `[Daftar]` background `--brand-blue` solid

**Animasi masuk:** Slide dari `translateY(-100%) → 0`, delay 1.8 detik setelah hero text selesai.

**Custom cursor:**

* Dot `8px` solid `--brand-blue`, lag `lerp`
* Hover link/button → expand `32px` semi-transparan
* Hover drone 3D → lingkaran outline + teks `"EXPLORE"`

---

## 🌤️ SECTION 1 — HERO "ABOVE THE FOLD"

*100vh. Kesan pertama yang menentukan.*

**Background:**

```css
background:
  radial-gradient(ellipse 800px 600px at 70% 40%,
    rgba(0,180,216,0.06) 0%, transparent 70%),
  radial-gradient(ellipse 600px 400px at 10% 80%,
    rgba(0,98,214,0.05) 0%, transparent 60%),
  var(--bg-primary);

/* Grid line teknis sangat tipis */
background-image:
  linear-gradient(var(--border-light) 1px, transparent 1px),
  linear-gradient(90deg, var(--border-light) 1px, transparent 1px);
background-size: 60px 60px;

```

**Layer Partikel (Three.js — 150 titik):**

* Warna: `rgba(0,98,214,0.15)` biru + `rgba(0,180,216,0.12)` cyan
* Ukuran: 1px, bergerak sangat pelan (noise drift)
* Mouse parallax: field bergeser berlawanan kursor, speed 0.015
* Konsentrasi lebih padat di area drone (kanan layar)

**3D Drone Model (React Three Fiber):**

```jsx
<Environment preset="apartment" />
<ambientLight intensity={1.2} color="#ffffff" />
<directionalLight position={[5,10,5]} intensity={2.5} castShadow />
<pointLight position={[0,-3,2]} intensity={0.8} color="#00B4D8" />
<pointLight position={[-5,2,0]} intensity={0.6} color="#E8F4FD" />

```

Behavior drone:

```javascript
useFrame(({ clock, mouse }) => {
  drone.position.y = Math.sin(clock.elapsedTime * 0.6) * 0.12
  drone.rotation.z = Math.sin(clock.elapsedTime * 0.4) * 0.03
  drone.rotation.y = THREE.MathUtils.lerp(drone.rotation.y, mouse.x * 0.25, 0.04)
  drone.rotation.x = THREE.MathUtils.lerp(drone.rotation.x, -mouse.y * 0.12, 0.04)
  propellers.forEach(p => p.rotation.y += 0.35)
})

```

Post-processing light mode:

* SSAO: shadow realistis di celah-celah drone
* Bloom sangat subtle: hanya LED/aksen cyan (threshold 0.95, strength 0.3)
* Vignette sangat ringan: offset 0.6, darkness 0.3
* Shadow plane ellipse di bawah drone (opacity 0.06) — efek foto produk

**Teks Hero (kiri layar, max-width 52%):**

```
[ ✦ Platform Inspeksi Drone #1 Indonesia ]   ← chip border biru, bg biru muda

Infrastruktur                                ← 64px Plus Jakarta Sans ExtraBold
Anda Selalu                                  ← letter-spacing -0.02em
dalam Pengawasan.                            ← kata "Pengawasan" + underline
                                               gradient biru-cyan
Sistem B2B marketplace inspeksi aerial       ← 18px Inter Regular
untuk infrastruktur kritis — menara          ← warna --text-secondary
SUTET, jembatan, dan kilang minyak.

[ 🚀 Hire a Pilot ]  [ Bergabung sebagai Pilot → ]

```

**Urutan animasi masuk (GSAP Timeline):**

```
t=0.0s → Background grid fade in (1.5s)
t=0.4s → Label chip bounce in dari bawah
t=0.7s → H1 "Infrastruktur" per kata slide dari bawah, stagger 0.08s
t=1.1s → H1 "Anda Selalu"
t=1.4s → H1 "dalam Pengawasan." + underline draw kiri ke kanan
t=1.8s → Subtitle fade + slide up (y: 20px → 0)
t=2.0s → Garis tipis biru draw (width: 0 → 120px)
t=2.2s → Dua CTA button bounce in (spring easing)
t=2.5s → Drone model fade in + scale 0.85 → 1.0 + float start
t=2.8s → Partikel mulai drift
t=3.0s → Scroll indicator muncul pojok kiri bawah

```

**CTA Styling:**

```css
/* Primary */
.btn-primary {
  background: var(--brand-blue);
  color: white;
  padding: 16px 32px;
  border-radius: 10px;
  box-shadow: var(--shadow-blue);
}
.btn-primary:hover {
  background: #0052b4;
  box-shadow: 0 12px 32px rgba(0,98,214,0.40);
  transform: translateY(-2px);
}

/* Secondary — liquid fill */
.btn-secondary {
  border: 1.5px solid rgba(0,98,214,0.40);
  color: var(--brand-blue);
  overflow: hidden;
  position: relative;
}
.btn-secondary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,98,214,0.06);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}
.btn-secondary:hover::before { transform: translateX(0); }

```

---

## 📊 SECTION 2 — STATS BAR

*Background: `--bg-secondary` (#F1F5F9)*

```
┌──────────────────────────────────────────────────────┐
│   500+            1.200+           47          99.8% │
│   Pilot           Menara           Kota        Uptime │
│   Tersertifikasi  Terinspeksi      Aktif       Platform│
└──────────────────────────────────────────────────────┘

```

```css
.stat-number {
  font: 800 48px 'Plus Jakarta Sans';
  color: var(--text-primary);
  letter-spacing: -0.03em;
}
.stat-label {
  font: 500 13px Inter;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

```

Count-up: `react-countup` + `enableScrollSpy: true`, easing `easeOutExpo`, durasi 2 detik. Pemisah: garis vertikal `1px solid var(--border-light)`, tinggi 48px.

---

## 🛠️ UPDATED PLAN: SECTION 3 — THE DRONE ANATOMY (SEQUENCE EDITION)

**Core Technology:** HTML5 Canvas + GSAP ScrollTrigger + Observer

**Assets:** 240 Optimized Frames (JPG)

**Duration:** `end: "+=600%"` (Kita butuh scroll yang lebih panjang agar transisinya terasa mewah/tidak terburu-buru).

---

### 🟢 FASE 0: The Pinned Canvas (Setup)

* **Background:** `#FBFDFF` (Bersih, Technical White).
* **Canvas:** Fixed di tengah layar. Gambar pertama (Frame 1) di-render sebagai "Hero State".
* **Initial UI:** Di sisi kiri muncul teks besar yang elegan:
`<h1>Precision Reimagined.</h1>`
`<span>Scroll to dissect the future of flight.</span>`

---

### 🔵 FASE 1: The Great Disruption (0% → 40% Scroll)

* **Animation:** Gambar bergerak dari **Frame 1 ke Frame 80** (Proses drone meledak/terbongkar).
* **GSAP Logic:** `scrub: 1.5` (Memberikan efek *inertia* yang halus saat user berhenti men-scroll).
* **UI Interaction:**
* Teks utama perlahan *fade out* dan *slide up*.
* Garis-garis **SVG Path** (Callout Lines) mulai muncul secara organik saat komponen berpisah.
* **Label Teknis** muncul di ujung garis (Contoh: "Carbon Fiber Shell", "High-Torque Motors").



---

### 🟡 FASE 2: The Deep Anatomy / Highlight (40% → 75% Scroll)

* **Animation:** Gambar bergerak dari **Frame 81 ke Frame 130** (Detail internal: GPS, Board, Kamera).
* **Special Effect:** Saat scroll berada di area ini, background sedikit menggelap (`#FBFDFF` → `#F1F4F8`) untuk memfokuskan mata pada komponen internal yang terekspos.
* **Technical Callouts (Floating UI):**
Di sisi kanan/kiri, muncul teks spek secara bertahap (*staggered*):
1. **45MP Full-Frame Sensor** (Muncul saat gimbal terekspos penuh).
2. **Dual-Antenna RTK** (Muncul saat modul GPS bulat di atas terangkat).
3. **Core Processors** (Muncul saat main board hitam terlihat).


* **Interactive Spot:** Garis-garis callout memiliki efek "glow" kecil berwarna `--brand-blue` yang berdenyut pelan.

---

### 🔴 FASE 3: Solidification & Power Up (75% → 100% Scroll)

* **Animation:** Gambar bergerak dari **Frame 131 ke Frame 160** (Drone menyatu kembali).
* **Momentum:** Gerakan menyatu dibuat lebih cepat di akhir untuk memberikan kesan "snap" (presisi).
* **The "Reveal":** Begitu drone utuh kembali (Frame 160), lampu LED pada drone (dalam gambar) diberikan efek **CSS Filter Drop-shadow (Cyan)** agar terlihat seolah-olah drone baru saja dinyalakan.
* **Final UI:** Teks "Ready for Deployment" muncul di tengah dengan tombol **[Explore More Features]**.

---

### 🧠 STRATEGI KODING (GSAP SNIPPET)

Agar performanya "Awwwards Winning", gunakan logika **Preload & Draw**:

```javascript
// Logika Mapping Frame ke Scroll
let drone = { frame: 0 };
let images = []; // Array berisi 160 objek Image()

// GSAP ScrollTrigger
gsap.to(drone, {
    frame: 159, // Frame terakhir
    snap: "frame",
    ease: "none",
    scrollTrigger: {
        trigger: ".section-3",
        start: "top top",
        end: "+=600%",
        pin: true, // Tahan section agar tidak bergeser saat animasi jalan
        scrub: 1.2,
    },
    onUpdate: () => renderCanvas(drone.frame) // Gambar ke canvas setiap update
});

// Syncronizing Labels dengan Frame tertentu
gsap.from(".label-camera", {
    opacity: 0,
    x: -20,
    scrollTrigger: {
        trigger: ".section-3",
        start: "30% top", // Muncul saat scroll sudah 30%
        end: "50% top",
        scrub: true
    }
});

```

---

## ⚠️ SECTION 4 — PROBLEM vs SOLUTION

*Background: `--bg-secondary` (#F1F5F9). Scroll-triggered, 2 kolom.*

**Kiri — MASALAH:**

```css
.problem-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-left: 4px solid var(--color-danger);
  border-radius: 16px;
  padding: 40px;
  box-shadow: var(--shadow-sm);
}

```

List masalah muncul stagger saat scroll:

```
47%    Risiko kecelakaan kerja pada
       inspeksi manual ketinggian

3-6    Bulan durasi tender
bulan  konvensional berjalan

∅      Laporan tidak terstandarisasi,
       tidak bisa dibandingkan antar vendor

∅      Nol visibilitas real-time kondisi
       aset pasca-inspeksi

```

**Kanan — SOLUSI SIAGA:**

```css
.solution-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-left: 4px solid var(--brand-blue);
  border-radius: 16px;
  padding: 40px;
  box-shadow: var(--shadow-sm);
}

```

Muncul sinkron dengan masalah di kiri:

```
✅  Zero Risiko Kecelakaan
    Inspeksi 100% dari darat —
    drone yang bekerja di ketinggian

✅  48 Jam dari Posting ke Pilot
    Sistem bidding real-time,
    tidak ada birokrasi manual

✅  One-Click Inspection Report
    PDF profesional otomatis,
    siap presentasi boardroom

✅  Live Asset Monitoring Dashboard
    Real-time kondisi aset pasca-inspeksi

```

**Divider tengah:** Garis `2px solid var(--border-light)`, tumbuh dari atas ke bawah seiring scroll (`scaleY: 0 → 1`). Di titik tengah: lingkaran kecil badge `vs` navy.

**Mini 3D scene pojok kanan bawah:** Canvas kecil 200×200px, menara SUTET mini + drone kecil loop animation, background transparan, border-radius `--radius-xl`.

---

## 🗺️ SECTION 5 — JOB RADAR MAP PREVIEW

*Background: `--bg-primary`. Full-width, height 85vh.*

**Mapbox Configuration:**

```javascript
const map = new mapboxgl.Map({
  style: 'mapbox://styles/mapbox/satellite-streets-v12', // citra satelit real
  center: [118.0, -2.5],   // center Indonesia
  zoom: 4.5,
  pitch: 50,               // tilt 3D perspective
  bearing: -8,
  antialias: true
})

map.on('load', () => {
  // Terrain 3D — gunung Indonesia timbul!
  map.addSource('mapbox-dem', {
    type: 'raster-dem',
    url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
    tileSize: 512
  })
  map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.8 })

  // Sky layer — langit biru cerah
  map.addLayer({
    id: 'sky', type: 'sky',
    paint: {
      'sky-type': 'atmosphere',
      'sky-atmosphere-sun': [0.0, 90.0],
      'sky-atmosphere-sun-intensity': 15,
      'sky-atmosphere-color': 'rgba(135, 206, 235, 1.0)'
    }
  })
})

```

**Custom Drone Pins:**

```css
.drone-pin {
  width: 36px; height: 36px;
  background: var(--brand-blue);
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0,98,214,0.40);
}
.drone-pin.urgent { background: var(--color-danger); }
.pulse-ring {
  position: absolute;
  width: 36px; height: 36px;
  border: 2px solid var(--brand-blue);
  border-radius: 50%;
  animation: pulse 2s ease-out infinite;
}
@keyframes pulse {
  0%   { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2.5); opacity: 0; }
}

```

**Popup Hover (Glassmorphism Light):**

```css
.mapbox-popup {
  background: var(--bg-surface);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-light);
  box-shadow: var(--glass-border), var(--shadow-md);
  border-radius: 16px;
  padding: 20px;
  min-width: 240px;
}

```

**Sidebar kiri (glassmorphism, absolute):**

```css
.radar-sidebar {
  position: absolute; left: 20px; top: 20px;
  width: 280px;
  background: var(--bg-surface);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-light);
  box-shadow: var(--glass-border), var(--shadow-md);
  border-radius: 20px;
  padding: 24px;
  z-index: 10;
}

```

**Scroll-triggered masuk:** Map fade in + `flyTo` animate zoom 3 → 4.5 + pitch 0 → 50. Sidebar slide dari kiri. Pins muncul stagger `translateY(-20px) → 0` + opacity.

---

## ⚡ SECTION 6 — HOW IT WORKS (Pinned Scroll Storytelling)

*Background: `--bg-secondary`. GSAP `pin: true`, `end: "+=400%"`, 4 step.*

**Progress indicator top:**

```
Step 1 ●────────────○────────────○────────────○ Step 4
[Post Project] [Select Pilot] [Monitor] [Report]

```

Progress bar mengisi biru seiring scroll.

**Step 1 — Post Project (0–25%):**
Kanan: mockup form card + mini Mapbox static, form fields highlight stagger.
Kiri: teks step "01 — Post Your Project" + 3 bullet fitur.

**Step 2 — Select Pilot (25–50%):**
Kanan: 3 card pilot muncul dari bawah, card tengah highlighted `box-shadow: 0 0 0 3px var(--brand-blue)`. Badge "SIAGA Verified ✓" animasi stamp (scale 0 → 1, rotate -15deg → 0, bounce).
Kiri: teks tentang seleksi transparan + rating system.

**Step 3 — Real-Time Monitoring (50–75%):**
Kanan: mini dashboard card — status bar hijau, progress "Foto terupload: 47/120" mengisi pelan, timestamp berdetik.
Kiri: teks visibilitas real-time.

**Step 4 — One-Click Report (75–100%):**
Kanan: tombol `[Generate Report]` ditekan (scale 0.95 → 1.0), progress bar mengisi, PDF card muncul bounce dari bawah.
Kiri: big impact text:

```
Dari 2 bulan
menjadi 30 detik.

Laporan inspeksi profesional
siap download dalam hitungan detik.

```

---

## 🏭 SECTION 7 — SEKTOR & KREDIBILITAS ✅ SEFEST 2026 COMPLIANT

*Background: `--bg-primary` (#FBFDFF). Sepenuhnya bebas hak cipta.*

### Heading:

```
Dirancang untuk Sektor
Infrastruktur Kritis Indonesia.
────────────────────────────────────────────────────────
Solusi inspeksi aerial yang menjawab kebutuhan nyata
dari industri-industri paling vital di negeri ini.

```

---

### Sub-Section A — Metric Bar (4 angka count-up)

Bukan logo perusahaan — data konkret lebih persuasif dan aman:

```
┌─────────────────────────────────────────────────────────┐
│  500+              99.2%           47           <30 det │
│  Pilot             Akurasi         Kota         Waktu   │
│  Bersertifikat     Data Inspeksi   Terjangkau   Laporan │
└─────────────────────────────────────────────────────────┘

```

```css
.metric-bar {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  box-shadow: var(--glass-border), var(--shadow-sm);
  border-radius: 20px;
  padding: 40px 48px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.metric-number {
  font: 800 52px 'Plus Jakarta Sans';
  color: var(--brand-blue);
  letter-spacing: -0.04em;
}
.metric-suffix {
  font: 700 32px 'Plus Jakarta Sans';
  color: var(--brand-cyan);
}
.metric-label {
  font: 500 12px Inter;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: 6px;
}

```

Count-up animation saat masuk viewport, easing `easeOutExpo`.

---

### Sub-Section B — Testimonial Card (Persona Fiktif Realistis)

3 karakter fiktif yang representatif, rotate otomatis setiap 4 detik dengan crossfade:

```
┌────────────────────────────────────────────────────────────────────┐
│  ┌────┐                                                            │
│  │ BS │  Ir. Budi Santoso, M.T.                                   │
│  └────┘  Manajer Pemeliharaan Jaringan — PT Transmisi Nusantara   │
│          ★★★★★                                                    │
│                                                                    │
│  "Waktu inspeksi tower kami turun dari 3 hari menjadi             │
│   4 jam per site. SIAGA benar-benar mengubah operasional          │
│   pemeliharaan jaringan kami secara menyeluruh."                  │
└────────────────────────────────────────────────────────────────────┘

```

**3 persona fiktif:**

```
Persona 1:
  Avatar   : Monogram "BS" — bg var(--brand-blue), text putih
  Nama     : Ir. Budi Santoso, M.T.
  Jabatan  : Manajer Pemeliharaan Jaringan
  Perusahaan: PT Transmisi Nusantara (fiktif)
  Quote    : "Waktu inspeksi tower kami turun dari 3 hari menjadi
              4 jam per site. SIAGA benar-benar mengubah operasional
              pemeliharaan kami secara menyeluruh."

Persona 2:
  Avatar   : Monogram "DR" — bg #00897B (hijau teal), text putih
  Nama     : Dewi Rahayu, S.T.
  Jabatan  : HSE Supervisor
  Perusahaan: Energi Lepas Pantai Nasional (fiktif)
  Quote    : "Zero accident selama 8 bulan berturut-turut sejak
              menggunakan SIAGA. Platform ini mengubah cara kami
              melihat dan mengelola risiko inspeksi."

Persona 3:
  Avatar   : Monogram "RF" — bg var(--brand-navy), text putih
  Nama     : Dr. Rizky Firmansyah
  Jabatan  : Kepala Divisi Infrastruktur
  Perusahaan: Lembaga Riset Teknik Sipil Indonesia (fiktif)
  Quote    : "Akurasi data konsisten di 99.2% — jauh melampaui
              metode konvensional. Laporan SIAGA sudah bisa
              langsung kami jadikan referensi teknis resmi."

```

**Styling monogram avatar:**

```css
.avatar-monogram {
  width: 52px; height: 52px;
  border-radius: 50%;
  background: var(--brand-blue);
  color: white;
  font: 700 18px 'Plus Jakarta Sans';
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

```

**Styling testimonial card:**

```css
.testimonial-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  box-shadow: var(--glass-border), var(--shadow-md);
  border-radius: 20px;
  padding: 36px 40px;
  max-width: 680px;
  margin: 0 auto 48px;
  position: relative;
}
/* Quote mark dekoratif */
.testimonial-card::before {
  content: '"';
  position: absolute;
  top: 20px; left: 32px;
  font: 900 80px 'Plus Jakarta Sans';
  color: rgba(0,98,214,0.08);
  line-height: 1;
}

```

**Dot indicator auto-rotate:**

```
● ○ ○   ← 3 dot di bawah card, dot aktif biru solid

```

---

### Sub-Section C — Dual Marquee Sektor Industri

**Heading marquee:**

```
Menjangkau seluruh sektor infrastruktur kritis ↓

```

**Row 1 (bergerak kiri → ):**

```
⚡ Transmisi Listrik  |  🛢️ Migas & Energi  |  🛣️ Jalan Tol & Jembatan  
|  🏗️ Konstruksi Tinggi  |  🌊 Bendungan & Irigasi  |  ⚡ Transmisi Listrik ...

```

**Row 2 (bergerak kanan ← ):**

```
🔥 Jaringan Gas Bumi  |  🏛️ Infrastruktur Publik  |  🌍 Penanggulangan Bencana  
|  ⚗️ Industri Petrokimia  |  🏘️ Kawasan Industri  |  🔥 Jaringan Gas Bumi ...

```

Semua ikon dari **Lucide React** — bebas hak cipta 100%.

**Styling tiap item sektor:**

```css
.sector-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 999px;          /* pill shape */
  box-shadow: var(--shadow-sm);
  font: 500 14px Inter;
  color: var(--text-secondary);
  white-space: nowrap;
  transition: all 0.25s;
}
.sector-item .icon {
  color: var(--brand-blue);
  width: 18px; height: 18px;
}
.sector-item:hover {
  border-color: var(--brand-blue);
  color: var(--text-primary);
  transform: scale(1.04);
  box-shadow: 0 4px 16px rgba(0,98,214,0.15);
}

```

**Gradient fade tepi:**

```css
.marquee-wrapper {
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 8%,
    black 92%,
    transparent 100%
  );
}

```

**Kecepatan marquee:**

* Row 1: 35 detik per loop (CSS `animation: marquee-left 35s linear infinite`)
* Row 2: 28 detik per loop (berbeda agar tidak monoton)
* Hover pada salah satu item: `animation-play-state: paused` (marquee berhenti saat hover)

---

### Layout Final Section 7:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│    Dirancang untuk Sektor                                       │
│    Infrastruktur Kritis Indonesia.          ← heading besar     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  500+      │   99.2%    │      47      │    <30 det     │   │
│  │  Pilot     │  Akurasi   │     Kota     │   Waktu Lap.   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                    ← Metric Bar (count-up) →                   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  "BS"  Ir. Budi Santoso, M.T.              ★★★★★        │   │
│  │        "Waktu inspeksi tower kami turun..."             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                    ● ○ ○   ← dot indicator                     │
│                                                                 │
│  ← ⚡ Transmisi  🛢️ Migas  🛣️ Jalan Tol  🏗️ Konstruksi  🌊 Air │
│  → 🔥 Gas Bumi  🏛️ Publik  🌍 Bencana  ⚗️ Petrokimia  🏘️ Kawasan│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

```

---

## 🎯 SECTION 8 — FINAL CTA

*Satu-satunya section dark di seluruh landing page — kontras dramatis yang disengaja.*

```css
.final-cta {
  background: linear-gradient(135deg,
    #0A2540 0%, #0D3060 50%, #0A2540 100%);
  /* + animated aurora blob: 3 blob warna bergerak sangat pelan */
}

```

**Konten:**

```
Platform Inspeksi Drone B2B
Terdepan di Indonesia.
────────────────────────────────────────
Mulai Inspeksi Pertama Anda Hari Ini.

Gratis mendaftar. Tidak perlu kartu kredit.
500+ pilot tersertifikasi siap ditugaskan.

[ 🚀  Daftar Gratis Sekarang ]
    Sudah punya akun? Masuk di sini →

```

```css
.cta-button-final {
  background: white;
  color: var(--brand-blue);
  font: 700 18px Inter;
  padding: 20px 48px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.20);
}
.cta-button-final:hover {
  background: #F0F8FF;
  transform: translateY(-3px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.25);
}

```

Footer langsung di bawah: background sedikit lebih gelap dari navy, teks `rgba(255,255,255,0.5)`, logo SIAGA putih.

---

## 📐 SECTION COLOR RHYTHM

```
Section 1 — Hero           : #FBFDFF  (putih bersih)
Section 2 — Stats          : #F1F5F9  (abu biru tegas)
Section 3 — Drone Anatomy  : #FBFDFF  (putih bersih)
Section 4 — Problem/Sol    : #F1F5F9  (abu biru tegas)
Section 5 — Maps           : #FBFDFF  (putih — peta jadi hero)
Section 6 — How It Works   : #F1F5F9  (abu biru tegas)
Section 7 — Sektor         : #FBFDFF  (putih bersih)
Section 8 — Final CTA      : #0A2540  (navy tua — dark! satu-satunya)

```

Alternating rhythm menciptakan visual flow yang natural — mata tidak lelah.

---

## 🎞️ PERFORMANCE STRATEGY

```
✓ Three.js hero canvas: load segera (above the fold)
✓ Three.js anatomy: Suspense lazy load
  → fallback: skeleton glow CSS animated berbentuk drone
✓ Mapbox: IntersectionObserver, load 300px sebelum viewport
✓ Marquee: CSS animation murni, zero JS, zero CPU overhead
✓ Monogram avatar: SVG inline, zero HTTP request
✓ GSAP ScrollTrigger: batch semua trigger
✓ will-change: transform pada semua elemen animasi
✓ GLB drone: compress dengan gltf-transform (target <3MB)
✓ Font: preload Plus Jakarta Sans ExtraBold + Inter Regular saja
✓ prefers-reduced-motion: disable semua GSAP animation → static
✓ Mobile (<768px): disable SSAO + Bloom, simplify partikel 50 titik

```

---

# 📁 SIAGA — COMPLETE FILE STRUCTURE

## Landing Page Web Design · SEFEST 2026

> **Stack:** Vite + React · Three.js / R3F · GSAP · Mapbox GL JS · Framer Motion

---

```
siaga/
│
├── public/                                ← Aset statis (tidak diproses Vite)
│   │
│   ├── models/                            ← 3D Models
│   │   ├── drone.glb                      ← Model drone utama (hero + anatomy)
│   │   └── tower.glb                      ← Menara SUTET mini (section 4)
│   │
│   ├── images/
│   │   │
│   │   ├── logo/
│   │   │   ├── siaga-wordmark.svg         ← Teks "SIAGA" saja (navbar, footer)
│   │   │   ├── siaga-icon.svg             ← Ikon drone SVG minimal (navbar mobile)
│   │   │   └── siaga-full.svg             ← Kombinasi icon + wordmark (hero, OG)
│   │   │
│   │   ├── sectors/                       ← ⭐ GANTI dari /partners/ — ikon sektor industri
│   │   │   ├── sector-transmisi.svg       ← ⚡ Transmisi Listrik
│   │   │   ├── sector-migas.svg           ← 🛢️ Migas & Energi
│   │   │   ├── sector-tol.svg             ← 🛣️ Jalan Tol & Jembatan
│   │   │   ├── sector-konstruksi.svg      ← 🏗️ Konstruksi Besar
│   │   │   ├── sector-bendungan.svg       ← 🌊 Bendungan & Irigasi
│   │   │   ├── sector-gas.svg             ← 🔥 Distribusi Gas Bumi
│   │   │   ├── sector-publik.svg          ← 🏛️ Infrastruktur Publik
│   │   │   ├── sector-bencana.svg         ← 🌍 Kebencanaan & SAR
│   │   │   ├── sector-industri.svg        ← ⚗️ Kawasan Industri
│   │   │   └── sector-properti.svg        ← 🏘️ Properti & Perumahan
│   │   │
│   │   ├── avatars/                       ← ⭐ GANTI dari /testimonials/ — ilustrasi fiktif
│   │   │   ├── avatar-engineer.svg        ← Persona 1: Ir. Budi Santoso (Engineer)
│   │   │   ├── avatar-hse.svg             ← Persona 2: Dewi Rahayu (HSE Supervisor)
│   │   │   └── avatar-researcher.svg      ← Persona 3: Dr. Rizky Firmansyah (Peneliti)
│   │   │
│   │   ├── mockups/
│   │   │   ├── report-preview.png         ← PDF thumbnail Section 6 Step 4
│   │   │   ├── dashboard-preview.png      ← Screenshot dashboard (Section 6 Step 3)
│   │   │   └── form-preview.png           ← Mockup form posting (Section 6 Step 1)
│   │   │
│   │   └── og/
│   │       └── og-image.png               ← Open Graph 1200×630px (social share)
│   │
│   ├── fonts/                             ← Font lokal (opsional, jika tidak pakai CDN)
│   │   ├── Plus-Jakarta-Sans-ExtraBold.woff2
│   │   └── Inter-Regular.woff2
│   │
│   └── favicon.ico                        ← Favicon (convert dari siaga-icon.svg)
│
│
├── src/                                   ← Source code utama
│   │
│   ├── components/
│   │   └── landing/
│   │       │
│   │       ├── Navbar/
│   │       │   ├── Navbar.jsx             ← Komponen navbar utama
│   │       │   ├── Navbar.css             ← Styling navbar + glassmorphism
│   │       │   └── NavLinks.jsx           ← Link items + active state
│   │       │
│   │       ├── Hero/                      ← SECTION 1
│   │       │   ├── HeroSection.jsx        ← Wrapper + layout section
│   │       │   ├── DroneScene.jsx         ← R3F canvas: drone, partikel, lighting
│   │       │   ├── HeroText.jsx           ← GSAP stagger text animation
│   │       │   ├── HeroBackground.jsx     ← Grid pattern + mesh gradient CSS
│   │       │   ├── HeroCTA.jsx            ← Tombol "Hire a Pilot" + "Bergabung"
│   │       │   ├── ScrollIndicator.jsx    ← Animasi scroll indicator bawah
│   │       │   └── Hero.css              ← Styling spesifik hero section
│   │       │
│   │       ├── Stats/                     ← SECTION 2
│   │       │   ├── StatsBar.jsx           ← 4 angka + count-up animation
│   │       │   ├── StatItem.jsx           ← Komponen satu stat (angka + label)
│   │       │   └── Stats.css
│   │       │
│   │       ├── DroneAnatomy/              ← SECTION 3 (paling kompleks)
│   │       │   ├── AnatomySection.jsx     ← Wrapper + GSAP pin setup
│   │       │   ├── AnatomyScene.jsx       ← Three.js exploded view + scrub
│   │       │   ├── AnatomyText.jsx        ← Teks per fase yang crossfade
│   │       │   ├── CalloutLines.jsx       ← SVG overlay garis label komponen
│   │       │   ├── AnatomyPhases.js       ← Data: posisi target per komponen per fase
│   │       │   └── Anatomy.css
│   │       │
│   │       ├── ProblemSolution/           ← SECTION 4
│   │       │   ├── ProblemSolutionSection.jsx   ← Wrapper + layout 2 kolom
│   │       │   ├── ProblemCard.jsx        ← Kartu merah — masalah konvensional
│   │       │   ├── SolutionCard.jsx       ← Kartu biru — solusi SIAGA
│   │       │   ├── VsDivider.jsx          ← Garis tengah + lingkaran "vs"
│   │       │   ├── TowerMiniScene.jsx     ← Mini Three.js canvas 200×200px
│   │       │   ├── problemData.js         ← Data list masalah (4 item)
│   │       │   ├── solutionData.js        ← Data list solusi (4 item)
│   │       │   └── ProblemSolution.css
│   │       │
│   │       ├── JobRadarMap/               ← SECTION 5
│   │       │   ├── JobRadarSection.jsx    ← Wrapper section + layout
│   │       │   ├── MapboxPreview.jsx      ← Mapbox GL JS — satellite-streets + terrain 3D
│   │       │   ├── DronePin.jsx           ← Custom marker + pulse animation
│   │       │   ├── RadarSidebar.jsx       ← Panel kiri (glassmorphism)
│   │       │   ├── MapPopup.jsx           ← Popup hover setiap pin
│   │       │   ├── mapConfig.js           ← Token Mapbox + konfigurasi peta
│   │       │   ├── pinData.js             ← Data lokasi pins (lat/lng + status)
│   │       │   └── JobRadar.css
│   │       │
│   │       ├── HowItWorks/               ← SECTION 6
│   │       │   ├── HowItWorksSection.jsx  ← Wrapper + GSAP pin setup (400% scroll)
│   │       │   ├── StepProgress.jsx       ← Progress bar atas (Step 1–4)
│   │       │   ├── StepOne.jsx            ← Post Project — mockup form + mini map
│   │       │   ├── StepTwo.jsx            ← Select Pilot — 3 pilot card + badge
│   │       │   ├── StepThree.jsx          ← Real-Time Monitor — dashboard card
│   │       │   ├── StepFour.jsx           ← One-Click Report — PDF card animation
│   │       │   ├── stepsData.js           ← Data teks + config per step
│   │       │   └── HowItWorks.css
│   │       │
│   │       ├── Trust/                     ← SECTION 7 ⭐ (DIREVISI)
│   │       │   ├── TrustSection.jsx       ← Wrapper section keseluruhan
│   │       │   ├── MetricBar.jsx          ← 4 angka besar: pilot, akurasi, kota, waktu
│   │       │   ├── TestimonialCard.jsx    ← Card testimoni rotate 4 detik + crossfade
│   │       │   ├── SectorMarquee.jsx      ← Dual marquee sektor industri (bukan logo)
│   │       │   ├── MarqueeRow.jsx         ← Satu baris marquee (reusable)
│   │       │   ├── SectorItem.jsx         ← Satu item sektor: ikon SVG + label teks
│   │       │   ├── testimonialData.js     ← Data 3 persona fiktif + kutipan
│   │       │   ├── sectorData.js          ← Data 10 sektor industri + path SVG
│   │       │   └── Trust.css
│   │       │
│   │       ├── FinalCTA/                  ← SECTION 8
│   │       │   ├── FinalCTASection.jsx    ← Dark section — aurora background
│   │       │   ├── AuroraBackground.jsx   ← 3 blob animasi pelan (CSS keyframes)
│   │       │   ├── CTAButtons.jsx         ← Tombol putih + link masuk
│   │       │   └── FinalCTA.css
│   │       │
│   │       └── Footer/
│   │           ├── Footer.jsx             ← Logo SIAGA putih + copyright + 4 link
│   │           └── Footer.css
│   │
│   ├── shared/                            ← Komponen reusable lintas section
│   │   ├── CustomCursor.jsx               ← Dot cursor + drag state + hover expand
│   │   ├── SectionWrapper.jsx             ← Wrapper umum (padding, snap, ref)
│   │   ├── AnimatedNumber.jsx             ← Count-up generic (pakai useCountUp)
│   │   ├── ChipBadge.jsx                  ← Label chip kecil (✦ Platform Inspeksi...)
│   │   └── GradientText.jsx               ← Teks dengan gradient fill biru-cyan
│   │
│   ├── hooks/                             ← Custom React Hooks
│   │   ├── useMouseParallax.js            ← Posisi mouse → parallax object
│   │   ├── useScrollProgress.js           ← Progress scroll 0–1 per section
│   │   ├── useCountUp.js                  ← Count-up animation dengan IntersectionObserver
│   │   ├── useGSAPReveal.js               ← Reusable GSAP ScrollTrigger reveal
│   │   └── useReducedMotion.js            ← Deteksi prefers-reduced-motion
│   │
│   ├── three/                             ← Three.js / R3F utilities & shared
│   │   ├── DroneModel.jsx                 ← Load + cache drone.glb (reused di hero & anatomy)
│   │   ├── TowerModel.jsx                 ← Load tower.glb (section 4 mini scene)
│   │   ├── ParticleField.jsx              ← 150 partikel biru tipis (hero)
│   │   ├── DroneControls.jsx              ← OrbitControls wrapper + mouse parallax
│   │   ├── LightSetup.jsx                 ← Preset lighting light mode (ambien, dir, point)
│   │   └── shaders/
│   │       ├── gradientShader.glsl        ← Custom GLSL gradient background
│   │       └── particleShader.glsl        ← Shader partikel custom (opsional)
│   │
│   ├── styles/
│   │   ├── tokens.css                     ← Design tokens: semua CSS variables
│   │   ├── globals.css                    ← Reset + base styles + font-face
│   │   ├── animations.css                 ← Keyframes CSS global (aurora, pulse, float)
│   │   └── utilities.css                  ← Class utility (visually-hidden, etc.)
│   │
│   ├── data/                              ← Data statis global (jika tidak di komponen)
│   │   ├── sectors.js                     ← Master data sektor industri
│   │   ├── testimonials.js                ← Master data testimoni persona fiktif
│   │   ├── stats.js                       ← Data angka statistik platform
│   │   └── mapPins.js                     ← Data lokasi pins peta Indonesia
│   │
│   ├── utils/
│   │   ├── gsapConfig.js                  ← GSAP plugin register + default easing
│   │   ├── mapboxConfig.js                ← Token Mapbox + helper init map
│   │   ├── lerp.js                        ← Linear interpolation helper
│   │   └── clamp.js                       ← Clamp number helper
│   │
│   ├── App.jsx                            ← Root component
│   ├── main.jsx                           ← Entry point Vite
│   └── LandingPage.jsx                    ← Compose semua section (urutan 1–8)
│
├── .env                                   ← VITE_MAPBOX_TOKEN=pk.ey..xxx (jangan di-commit!)
├── .env.example                           ← Template .env (aman di-commit)
├── .gitignore
├── index.html                             ← HTML root — preload font, OG meta tags
├── vite.config.js                         ← Konfigurasi Vite
└── package.json

```

---

## ✅ URUTAN IMPLEMENTASI

```
Hari 1  → Setup Vite + React + semua library
          Design tokens CSS, font, custom cursor

Hari 2  → Hero: Three.js canvas + drone model
          + lighting + partikel + floating animation

Hari 3  → Hero: GSAP text stagger + CTA buttons
          + scroll indicator + mouse parallax

Hari 4  → Drone Anatomy: Three.js exploded view
          + GSAP ScrollTrigger scrub (paling kompleks)

Hari 5  → Mapbox Job Radar: satellite-streets
          + terrain 3D + sky layer + custom pins

Hari 6  → Problem/Solution + Stats Bar
          + mini tower 3D scene

Hari 7  → How It Works: 4-step pinned scroll

Hari 8  → Section 7 Sektor & Kredibilitas:
          MetricBar + Testimonial rotate
          + Dual Marquee sektor industri

Hari 9  → Final CTA dark section + Footer
          Full polish: timing, responsive,
          performance, Suspense fallback

```

---

**Section 7 sekarang 100% compliant SEFEST 2026** — zero logo pihak ketiga, zero foto orang asli, semua aset bebas hak cipta, dan secara desain justru **lebih kuat** dari versi logo mitra karena data konkret + testimonial realistis + marquee sektor industri yang bergerak dinamis jauh lebih impresif ke juri! 🚀