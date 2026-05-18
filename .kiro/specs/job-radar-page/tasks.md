# Implementation Plan: Job Radar Page

## Overview

Implementasi fitur **job-radar-page** dilakukan secara incremental agar aman, testable, dan tetap fokus pada UI/UX premium.

Halaman ini bukan sekadar Mapbox page biasa, tetapi harus menjadi:

```text
SIAGA Pilot Radar Command Center
```

Target visual:

```text
premium, modern, glassmorphism, dark-cyan radar, aerospace-tech, informatif, cinematic, dan selaras dengan landing page/login/register/client-dashboard SIAGA.
```

Urutan implementasi:

```text
folder structure
→ mock-data.js single source of truth
→ pure filter/sort/stats logic
→ property/unit tests
→ fullscreen page shell
→ premium radar sidebar
→ mission cards
→ Mapbox lazy-loaded 3D terrain
→ custom drone pins + cluster + line routes
→ Radar HUD
→ Pin Popup
→ Project Detail Drawer
→ Mobile Bottom Sheet
→ bidirectional sidebar-map interaction
→ responsive behavior
→ accessibility
→ error handling
→ routing integration
→ UI/UX Premium Polish Wave
→ final QA
```

Stack:

```text
React 19 + Vite + react-router-dom + Framer Motion + Mapbox GL JS + react-countup + Lucide React + fast-check
```

Core principles:

- `mock-data.js` adalah single source of truth.
- `filters.js` berisi pure logic yang testable.
- RadarMap harus lazy-loaded dengan `React.lazy()` + `Suspense`.
- Sidebar/list/filter harus tetap interaktif sebelum Mapbox selesai load.
- UI harus selaras dengan SIAGA Design Tokens.
- Mobile tidak boleh memaksa layout desktop.
- Semua visual harus terasa premium dan tidak generic.

---

## Tasks

---

- [ ] 1. Setup folder struktur dan file stubs

  - [ ] 1.1 Buat struktur folder utama `src/pages/JobRadar/`

    - Buat folder:

      ```text
      src/pages/JobRadar/
      src/pages/JobRadar/components/
      src/pages/JobRadar/__tests__/
      ```

    - Buat file root:

      ```text
      JobRadarPage.jsx
      JobRadarPage.css
      mock-data.js
      filters.js
      ```

    - _Requirements: 1.1, 2.1, 10.1_

  - [ ] 1.2 Buat struktur komponen RadarSidebar

    - Buat folder dan file:

      ```text
      src/pages/JobRadar/components/RadarSidebar/
      ├── RadarSidebar.jsx
      ├── RadarSidebar.css
      ├── SidebarHeader.jsx
      ├── FilterSection.jsx
      ├── FilterSection.css
      ├── InfrastructureChips.jsx
      ├── ValueRangeSlider.jsx
      ├── LocationSearch.jsx
      ├── StatusToggle.jsx
      ├── ProjectList.jsx
      ├── ProjectList.css
      ├── ProjectCard.jsx
      ├── ProjectCard.css
      └── SortControl.jsx
      ```

    - Semua file berisi placeholder default export terlebih dahulu.

    - _Requirements: 6.1, 6.8, 7.1_

  - [ ] 1.3 Buat struktur komponen RadarMap

    - Buat folder dan file:

      ```text
      src/pages/JobRadar/components/RadarMap/
      ├── index.js
      ├── RadarMap.jsx
      ├── RadarMap.css
      ├── PinPopup.jsx
      ├── PinPopup.css
      ├── TerrainToggle.jsx
      ├── MapLoadingFallback.jsx
      ├── MapErrorBoundary.jsx
      └── MapErrorFallback.jsx
      ```

    - `index.js` harus default export RadarMap agar bisa dipakai oleh `React.lazy()`.

    - _Requirements: 3.1, 3.10, 5.1, 14.1_

  - [ ] 1.4 Buat struktur komponen UI premium tambahan

    - Buat folder dan file:

      ```text
      src/pages/JobRadar/components/RadarHUD/
      ├── RadarHUD.jsx
      └── RadarHUD.css

      src/pages/JobRadar/components/ProjectDetailDrawer/
      ├── ProjectDetailDrawer.jsx
      └── ProjectDetailDrawer.css

      src/pages/JobRadar/components/MobileBottomSheet/
      ├── MobileBottomSheet.jsx
      └── MobileBottomSheet.css

      src/pages/JobRadar/components/ToastNotification/
      ├── ToastNotification.jsx
      └── ToastNotification.css
      ```

    - _Requirements: 9.1, 12.9, 17.1, 18.1_

  - [ ] 1.5 Buat file test stubs

    - Buat file:

      ```text
      src/pages/JobRadar/__tests__/filters.property.test.js
      src/pages/JobRadar/__tests__/filters.unit.test.js
      src/pages/JobRadar/__tests__/jobRadar.integration.test.jsx
      src/pages/JobRadar/__tests__/jobRadar.a11y.test.jsx
      ```

    - _Requirements: 13.23, 18.21_

---

- [ ] 2. Implement Mock Data Module sebagai single source of truth

  - [ ] 2.1 Implement `src/pages/JobRadar/mock-data.js`

    - Buat array proyek berjumlah 15–20 item.
    - Setiap item wajib memiliki:

      ```js
      {
        id,
        nama,
        jenis_infrastruktur,
        nilai_kontrak,
        lokasi: { lat, lng, kota, provinsi },
        deadline,
        status,
        jumlah_bidder,
        deskripsi,
        client_nama
      }
      ```

    - `jenis_infrastruktur` harus salah satu dari:

      ```text
      SUTET, Jembatan, Kilang, Solar Panel, Bendungan, Tower
      ```

    - `status` harus salah satu dari:

      ```text
      open, urgent, deadline_dekat, closed
      ```

    - Sebaran geografis minimal mencakup:

      ```text
      Jawa, Sumatera, Kalimantan, Sulawesi, Papua
      ```

    - Variasi data:
      - minimal 2 proyek `urgent`
      - minimal 2 proyek `closed`
      - minimal 2 proyek `deadline_dekat`
      - sisanya `open`
      - nilai kontrak Rp 50.000.000 sampai Rp 2.000.000.000
      - minimal 4 dari 6 kategori infrastruktur muncul

    - Export default:

      ```js
      export default Object.freeze(projects)
      ```

    - _Requirements: 10.1–10.22_

  - [ ] 2.2 Tambahkan helper statistik di `mock-data.js`

    - Export named helper:

      ```js
      computeStatsFromSource(projects)
      getProjectById(id)
      getProjectLocations(projects)
      ```

    - `computeStatsFromSource()` harus menghitung:
      - aktif
      - open
      - urgent

    - Jangan hardcode count di UI.

    - _Requirements: 10.23–10.26_

  - [ ] 2.3 Tambahkan data yang mendukung detail drawer

    - Pastikan setiap project idealnya punya:
      - `deskripsi`
      - `client_nama`
      - `scope_pekerjaan` jika ingin lebih kaya
      - `estimasi_durasi` jika diperlukan
      - `dokumen_required` jika diperlukan

    - Data tambahan boleh optional, tapi drawer harus tetap aman jika field tidak ada.

    - _Requirements: 17.6–17.20_

---

- [ ] 3. Implement pure filter/sort/stats logic di `filters.js`

  - [ ] 3.1 Implement core pure functions

    - Export:

      ```js
      applyFilters(projects, filters)
      sortProjects(projects, sortBy)
      computeStats(projects)
      getLocationSuggestions(projects)
      formatRupiah(value)
      formatCompactRupiah(value)
      isWithinRange(project, range)
      matchesInfrastructure(project, activeChips)
      matchesLocation(project, location)
      matchesStatus(project, statusFilter)
      getStatusVisual(status)
      getActiveFilterCount(filters)
      resetFilters()
      ```

    - Rules:
      - AND antar kategori filter.
      - OR di dalam infrastructure chips.
      - `statusFilter = open` berarti status `open`, `urgent`, dan `deadline_dekat`.
      - `statusFilter = all` berarti semua status termasuk `closed`.
      - Sorting stable.
      - `computeStats()` harus berdasarkan visible/filtered projects.

    - _Requirements: 6.10–6.25, 7.17–7.20, 8.7–8.11, 9.6–9.7, 10.24_

  - [ ] 3.2 Implement formatter Rupiah

    - `formatRupiah(value)` output lengkap:

      ```text
      Rp 350.000.000
      ```

    - `formatCompactRupiah(value)` output compact:

      ```text
      Rp 350 jt
      Rp 1,2 M
      Rp 2 M
      ```

    - Formatter harus aman untuk:
      - 0
      - nilai besar
      - nilai negatif fallback
      - non-number fallback

    - _Requirements: 5.10, 7.7_

  - [ ] 3.3 Implement status visual mapping

    - `getStatusVisual(status)` harus return:

      ```js
      {
        color,
        pulse,
        opacity,
        pulseSpeed,
        label
      }
      ```

    - Mapping:
      - `open`: cyan + pulse
      - `urgent`: red + faster pulse
      - `deadline_dekat`: yellow + no pulse
      - `closed`: grey + no pulse + reduced opacity

    - _Requirements: 4.3–4.10_

---

- [ ] 4. Write property/unit tests untuk pure logic

  - [ ] 4.1 Property 1 — Status-to-visual mapping deterministic

    - File:

      ```text
      src/pages/JobRadar/__tests__/filters.property.test.js
      ```

    - Tag:

      ```js
      // Feature: job-radar-page, Property 1: Status-to-visual mapping is deterministic and correct
      ```

    - Generator:

      ```js
      fc.constantFrom('open', 'urgent', 'deadline_dekat', 'closed')
      ```

    - Assert:
      - mapping benar
      - return tidak undefined
      - output deterministic

    - _Requirements: 4.3–4.10_

  - [ ] 4.2 Property 2 — Combined filter AND/OR logic

    - Tag:

      ```js
      // Feature: job-radar-page, Property 2: Combined filter logic applies AND across categories and OR within infrastructure chips
      ```

    - Assert:
      - all returned projects satisfy active filters
      - empty chips berarti no infra filter
      - full value range tidak memfilter value
      - location null tidak memfilter location

    - _Requirements: 6.10–6.25_

  - [ ] 4.3 Property 3 — Sort ordering invariant

    - Tag:

      ```js
      // Feature: job-radar-page, Property 3: Sort ordering invariant
      ```

    - Criteria:
      - `nilai_tertinggi`: descending by nilai
      - `deadline_terdekat`: ascending by date
      - `terbaru`: descending by date
      - output length sama
      - stable sort jika nilai sama

    - _Requirements: 7.17–7.18_

  - [ ] 4.4 Property 4 — Data consistency invariant

    - Tag:

      ```js
      // Feature: job-radar-page, Property 4: Data consistency invariant — stats reflect filtered data
      ```

    - Assert:

      ```text
      stats.aktif === count status !== closed
      stats.open === count status === open
      stats.urgent === count status === urgent
      ```

    - _Requirements: 8.11, 9.6–9.7, 10.24_

  - [ ] 4.5 Property 5 — Rendering completeness

    - Render `ProjectCard` dan `PinPopup` dengan generated valid project.
    - Assert fields muncul:
      - nama
      - lokasi
      - nilai kontrak
      - deadline
      - bidder count
      - status

    - _Requirements: 5.8–5.15, 7.3–7.11_

  - [ ] 4.6 Property 6 — Mock data schema validation

    - Iterate semua project dari mock-data.
    - Assert:
      - field wajib ada
      - status valid
      - infra type valid
      - nilai_kontrak positive
      - lat/lng dalam bounding box Indonesia

    - Bounding box:

      ```text
      lat: -11 to 6
      lng: 95 to 141
      ```

    - _Requirements: 10.3–10.22_

  - [ ] 4.7 Property 7 — Radar HUD stats reflect visible projects

    - Assert:

      ```text
      RadarHUD stats === computeStats(filteredProjects)
      ```

    - _Requirements: 9.6–9.7_

  - [ ] 4.8 Property 8 — Detail drawer uses selected project data

    - Ketika detail drawer dibuka:
      - drawer project id sama dengan selected project id
      - content berasal dari project object yang sama

    - _Requirements: 17.20_

  - [ ] 4.9 Unit tests edge cases untuk `filters.js`

    - Test:
      - empty filters return all projects
      - one chip filter
      - multiple chip filter
      - value range boundary
      - location no match returns empty
      - status open/all
      - sort stable equal values
      - formatRupiah edge cases
      - getActiveFilterCount
      - resetFilters

    - _Requirements: 6, 7, 9, 10_

---

- [ ] 5. Implement `JobRadarPage` fullscreen shell

  - [ ] 5.1 Implement root page state owner

    - File:

      ```text
      src/pages/JobRadar/JobRadarPage.jsx
      ```

    - State:
      - filters
      - sortBy
      - sidebarOpen
      - bottomSheetState
      - selectedPinId
      - hoveredCardId
      - highlightedCardId
      - popupProject
      - detailProject
      - toastMessage
      - flyToTarget
      - mapReady

    - Compute:
      - `filteredProjects`
      - `sortedProjects`
      - `visibleStats`
      - `activeFilterCount`

    - _Requirements: 2.1–2.13, 8.1–8.13, 9.6–9.7_

  - [ ] 5.2 Implement fullscreen layout CSS

    - File:

      ```text
      src/pages/JobRadar/JobRadarPage.css
      ```

    - Desktop:
      - `100vw`
      - `100vh`
      - no page scroll
      - sidebar 320px
      - map sisa ruang

    - Add global background only if visible behind map/sidebar.
    - Preserve custom cursor cyan.

    - _Requirements: 2.1–2.13_

  - [ ] 5.3 Wire component placeholders

    - Render:
      - RadarSidebar
      - Suspense-wrapped RadarMap
      - RadarHUD
      - ProjectDetailDrawer
      - MobileBottomSheet
      - ToastNotification
      - aria-live region

    - _Requirements: 3.10, 9.1, 12.9, 17.1_

---

- [ ] 6. Implement Premium Radar Sidebar

  - [ ] 6.1 Implement `RadarSidebar.jsx` dan `RadarSidebar.css`

    - Sidebar harus tampil sebagai:

      ```text
      dark glass command panel
      ```

    - Style:
      - dark navy glass
      - cyan border
      - subtle radar grid
      - soft glow
      - internal scroll
      - no page scroll

    - Props:
      - isOpen
      - onToggle
      - filters
      - onFiltersChange
      - sortBy
      - onSortChange
      - projects
      - stats
      - hoveredCardId
      - highlightedCardId
      - onCardHover
      - onCardClick
      - onDetailClick
      - onBidClick
      - onResetFilters

    - _Requirements: 6.1–6.7, 15.5_

  - [ ] 6.2 Implement `SidebarHeader.jsx`

    - Render:
      - logo/mark SIAGA jika tersedia
      - title “SIAGA Job Radar”
      - subtitle “Live Project Discovery”
      - active project badge
      - pulse live indicator

    - Visual:
      - Montserrat bold
      - cyan accent
      - glass badge
      - premium spacing

    - _Requirements: 6.4–6.7_

  - [ ] 6.3 Implement `FilterSection.jsx` premium glass controls

    - Render:
      - InfrastructureChips
      - ValueRangeSlider
      - LocationSearch
      - StatusToggle
      - Reset Filter if active

    - UI:
      - group in dark glass panels
      - compact but readable
      - cyan focus ring
      - active states clear

    - _Requirements: 6.8–6.28_

  - [ ] 6.4 Implement `InfrastructureChips.jsx`

    - Options:
      - SUTET
      - Jembatan
      - Kilang
      - Solar Panel
      - Bendungan
      - Tower

    - Behavior:
      - multi-select
      - OR logic within chips
      - keyboard accessible
      - ARIA checked

    - _Requirements: 6.8–6.11, 13.2–13.3_

  - [ ] 6.5 Implement `ValueRangeSlider.jsx`

    - Range:
      - min Rp 0
      - max Rp 2.500.000.000
      - step Rp 50.000.000

    - UI:
      - premium custom slider
      - compact value labels
      - full keyboard/ARIA support

    - _Requirements: 6.12–6.16, 13.4–13.5_

  - [ ] 6.6 Implement `LocationSearch.jsx`

    - Autocomplete from mock data kota/provinsi.
    - No-match state.
    - Full width on mobile/bottom sheet.
    - Keyboard accessible.

    - _Requirements: 6.17–6.19, 13.6_

  - [ ] 6.7 Implement `StatusToggle.jsx`

    - Segmented control:
      - Bidding Terbuka
      - Semua

    - Active state:
      - cyan/glass
      - clear label

    - _Requirements: 6.20–6.23, 13.7_

---

- [ ] 7. Implement Project List dan Premium Mission Cards

  - [ ] 7.1 Implement `ProjectList.jsx`

    - Render:
      - SortControl
      - Mission Cards
      - Empty state

    - List harus internal scroll.
    - Jumlah card = filtered/sorted projects.
    - Empty state muncul jika 0 results.

    - _Requirements: 7.1, 7.19–7.25_

  - [ ] 7.2 Implement `SortControl.jsx`

    - Options:
      - Terbaru
      - Nilai Tertinggi
      - Deadline Terdekat

    - Style:
      - pill glass
      - compact
      - keyboard navigable
      - aria-label active sort

    - _Requirements: 7.16–7.18, 13.18–13.19_

  - [ ] 7.3 Implement `ProjectCard.jsx` sebagai Mission Card

    - Content:
      - status badge
      - infrastructure type
      - project name
      - location
      - contract value compact
      - deadline
      - bidder count
      - CTA Lihat Detail
      - CTA Bid Sekarang

    - Visual:
      - dark glass
      - cyan border
      - rounded 22px
      - hover glow
      - selected/highlight state
      - mission-oriented hierarchy

    - Behavior:
      - hover → onCardHover(project.id)
      - click card body → flyTo
      - Lihat Detail → open drawer
      - Bid Sekarang → toast

    - Accessibility:
      - role button or real button
      - aria-label

    - _Requirements: 7.2–7.28, 16.1–16.18_

  - [ ] 7.4 Implement empty state

    - Copy:

      ```text
      Tidak ada proyek yang cocok dengan filter.
      Coba reset filter atau perluas kriteria pencarian.
      ```

    - CTA:

      ```text
      Reset Filter
      ```

    - Style:
      - dark glass
      - icon search/filter
      - not scary/error-like

    - _Requirements: 7.21–7.25, 14.6–14.10_

---

- [ ] 8. Implement Radar HUD

  - [ ] 8.1 Implement `RadarHUD.jsx` dan `RadarHUD.css`

    - Replace old FloatingStatsBar concept.
    - Desktop content:
      - SIAGA Job Radar
      - Live Project Discovery for Certified UAV Pilots
      - Proyek Aktif
      - Bidding Terbuka
      - Urgent
      - optional live badge
      - optional active filter count

    - Mobile content:
      - compact pill
      - LIVE RADAR
      - project count
      - urgent count

    - _Requirements: 9.1–9.15_

  - [ ] 8.2 Implement count-up animation

    - Use `react-countup`.
    - Animate on first render.
    - Skip meaningless animation from 0 to 0.
    - Update stats when filter changes.
    - Avoid stale totals.

    - _Requirements: 9.5–9.7, 11.13–11.14_

  - [ ] 8.3 Ensure HUD does not block map interaction

    - Container:
      - `pointer-events: none`
    - Interactive children if any:
      - `pointer-events: auto`

    - _Requirements: 9.10–9.12_

---

- [ ] 9. Implement Map loading, error boundary, dan fallback states

  - [ ] 9.1 Implement `MapLoadingFallback.jsx`

    - Style:
      - dark navy
      - subtle radar grid
      - cyan spinner
      - text “Memuat peta…”
      - premium skeleton/glow

    - _Requirements: 3.11–3.12, 11.13–11.14_

  - [ ] 9.2 Implement `MapErrorBoundary.jsx`

    - Class component or functional equivalent with error boundary support.
    - Catch:
      - lazy chunk error
      - Mapbox init error
      - runtime map error

    - _Requirements: 14.1–14.5_

  - [ ] 9.3 Implement `MapErrorFallback.jsx`

    - Shows:
      - “Peta tidak tersedia saat ini”
      - friendly explanation
      - fallback list project text
      - optional retry button

    - Must still look premium.
    - Must not crash page.

    - _Requirements: 3.13–3.15, 14.1–14.17_

---

- [ ] 10. Implement Mapbox RadarMap

  - [ ] 10.1 Implement `RadarMap/index.js`

    - Default export RadarMap for React.lazy.

    - _Requirements: 3.10, 11.1_

  - [ ] 10.2 Implement Mapbox initialization in `RadarMap.jsx`

    - Use:

      ```js
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN
      ```

    - Style:

      ```text
      mapbox://styles/mapbox/dark-v11
      ```

    - Initial view:
      - center `[118, -2.5]`
      - zoom around `5`

    - _Requirements: 3.1–3.9_

  - [ ] 10.3 Implement terrain 3D and fog

    - Add `mapbox-dem`.
    - Enable terrain exaggeration around `1.5`.
    - Add fog via `map.setFog()`.
    - On DEM error, fallback flat map.

    - _Requirements: 3.4–3.7, 14.4_

  - [ ] 10.4 Implement TerrainToggle

    - User can enable/disable terrain 3D.
    - Style control as glass button.
    - Persist only in state, no need localStorage unless simple.

    - _Requirements: 3.16, 11.9_

  - [ ] 10.5 Implement ResizeObserver and resize handling

    - Observe map container size.
    - Debounce `map.resize()`.
    - Call after sidebar transition and viewport resize.

    - _Requirements: 2.10, 8.10, 12.19–12.20_

---

- [ ] 11. Implement custom Project Pins, Cluster, dan Line Routes

  - [ ] 11.1 Implement custom drone/radar SVG pins

    - No default Mapbox markers.
    - Status visual:
      - open cyan pulse
      - urgent red faster pulse
      - deadline_dekat yellow no pulse
      - closed grey reduced opacity

    - Add aria-label.

    - _Requirements: 4.1–4.10, 4.18_

  - [ ] 11.2 Implement pin hover/highlight state

    - When hovered from card:
      - scale 1.3–1.5
      - cyan glow
      - z-index above others

    - _Requirements: 4.11–4.12, 8.1–8.2_

  - [ ] 11.3 Implement pin click handler

    - Click pin:
      - set selected project
      - trigger flyTo
      - scroll sidebar/card
      - highlight related Mission Card

    - _Requirements: 5.1–5.4, 8.5–8.6_

  - [ ] 11.4 Implement pin clustering

    - At zoom low, cluster nearby pins.
    - Cluster circle shows number.
    - Click cluster zooms into area.

    - _Requirements: 4.13–4.15, 11.10_

  - [ ] 11.5 Implement Line Routes

    - Connect projects within 100km radius.
    - Use thin cyan line.
    - Low opacity.
    - Do not overwhelm map.

    - _Requirements: 4.16–4.17_

---

- [ ] 12. Implement Fly-To Animation dan Pin Popup

  - [ ] 12.1 Implement flyTo flow

    - Trigger from:
      - pin click
      - Mission Card click

    - Behavior:
      - smooth zoom + tilt
      - duration around 1.5s
      - popup opens after animation completes

    - _Requirements: 5.1–5.4, 8.3–8.4_

  - [ ] 12.2 Implement `PinPopup.jsx` dan `PinPopup.css`

    - Content:
      - project name
      - status badge
      - infrastructure type
      - location
      - contract value
      - deadline
      - bidder count
      - Lihat Detail
      - Bid Sekarang

    - Style:
      - dark glass
      - cyan border
      - rounded 24px
      - compact but readable

    - _Requirements: 5.5–5.15_

  - [ ] 12.3 Implement popup actions

    - Bid Sekarang:
      - show toast placeholder

    - Lihat Detail:
      - open ProjectDetailDrawer

    - Close:
      - close button
      - click outside map area

    - Only one popup open at a time.

    - _Requirements: 5.16–5.20, 14.11–14.12_

  - [ ] 12.4 Implement screen reader announcement

    - Add `aria-live="polite"` region.
    - Announce when flyTo completes.

    - _Requirements: 5.21, 13.21_

---

- [ ] 13. Implement Project Detail Drawer

  - [ ] 13.1 Implement `ProjectDetailDrawer.jsx` dan CSS

    - Desktop:
      - right side drawer
      - width 380–460px
      - dark glass
      - cyan border
      - map remains visible behind

    - Mobile:
      - detail bottom sheet
      - 65–75vh

    - _Requirements: 17.1–17.5_

  - [ ] 13.2 Render full project detail content

    - Show:
      - nama proyek
      - status
      - jenis infrastruktur
      - lokasi lengkap
      - nilai kontrak
      - deadline
      - jumlah bidder
      - client_nama
      - deskripsi
      - CTA Bid Sekarang

    - Data must come from selected project object.

    - _Requirements: 17.6–17.21_

  - [ ] 13.3 Implement drawer interactions

    - Open from:
      - PinPopup Lihat Detail
      - Mission Card Lihat Detail

    - Close from:
      - close button
      - Escape
      - overlay click

    - Manage focus when open.
    - Do not reset filters/map state.

    - _Requirements: 17.17–17.22, 13.13–13.15_

  - [ ] 13.4 Implement drawer fallback

    - If drawer content fails:
      - show basic fallback text/card
      - never blank

    - _Requirements: 14.13–14.15_

---

- [ ] 14. Implement Mobile Bottom Sheet

  - [ ] 14.1 Implement `MobileBottomSheet.jsx` dan CSS

    - Used only under 768px.
    - Replaces desktop sidebar.
    - Map remains fullscreen behind.

    - _Requirements: 12.8–12.10_

  - [ ] 14.2 Implement collapsed state

    - Height:
      - 60–80px

    - Content:
      - drag handle
      - total visible projects
      - urgent count
      - hint: swipe/tap untuk filter

    - _Requirements: 12.11–12.13_

  - [ ] 14.3 Implement expanded state

    - Height:
      - 60–70vh

    - Content:
      - header
      - quick stats
      - FilterSection
      - SortControl
      - Mission Card list

    - Internal scroll.
    - No horizontal overflow.

    - _Requirements: 12.14–12.18_

  - [ ] 14.4 Implement bottom sheet interactions

    - Tap handle toggles collapsed/expanded.
    - Optional drag/swipe if feasible.
    - Escape collapses if focus inside.
    - Clicking Mission Card triggers flyTo and can collapse sheet if needed.

    - _Requirements: 12.17, 13.15_

  - [ ] 14.5 Polish mobile visual

    - Dark glassmorphism.
    - Rounded top corners 28–32px.
    - Clear drag handle.
    - Mission cards readable at 320px.
    - Map remains visible.

    - _Requirements: 15.10, 18.6–18.16_

---

- [ ] 15. Implement Toast Notification

  - [ ] 15.1 Implement `ToastNotification.jsx` dan CSS

    - Reusable toast.
    - Style:
      - glass
      - cyan accent
      - rounded 18–22px
      - soft shadow
      - slide/fade animation

    - Auto dismiss 3–5 seconds.

    - _Requirements: 5.16, 18.19_

  - [ ] 15.2 Wire toast actions

    - Show toast for:
      - Bid Sekarang placeholder
      - Reset Filter success if needed
      - Detail opened if needed
      - Map error retry if needed

    - _Requirements: 5.16, 14.17_

---

- [ ] 16. Wire bidirectional sidebar-map interaction

  - [ ] 16.1 Wire card hover to pin highlight

    - MissionCard hover:
      - set hoveredCardId
      - RadarMap pin highlights

    - _Requirements: 8.1–8.2_

  - [ ] 16.2 Wire card click to flyTo + popup

    - MissionCard click:
      - set flyToTarget
      - trigger RadarMap flyTo
      - open popup after flyTo complete

    - _Requirements: 8.3–8.4_

  - [ ] 16.3 Wire pin click to sidebar card scroll/highlight

    - Pin click:
      - set selected project
      - scroll related card into view
      - highlight card for 3 seconds
      - trigger popup

    - _Requirements: 8.5–8.6_

  - [ ] 16.4 Wire filter change to map/list/HUD

    - Filter update must update:
      - visible pins
      - mission cards
      - RadarHUD stats
      - bottom sheet counts

    - _Requirements: 8.7–8.11, 9.6–9.7_

  - [ ] 16.5 Handle popup switching

    - If popup open and another pin clicked:
      - close old popup
      - start new flyTo
      - open new popup after animation

    - _Requirements: 8.12–8.13, 14.11_

---

- [ ] 17. Implement responsive behavior

  - [ ] 17.1 Desktop >= 1280px

    - Sidebar open by default.
    - Map fills remaining width.
    - RadarHUD full.
    - Detail drawer from right.
    - No page-level scroll.

    - _Requirements: 12.1–12.3_

  - [ ] 17.2 Tablet 768px–1279px

    - Sidebar collapsed by default.
    - Sidebar opens as overlay.
    - Map full width.
    - HUD compact.
    - Drawer narrower.

    - _Requirements: 12.4–12.7_

  - [ ] 17.3 Mobile < 768px

    - Desktop sidebar hidden.
    - MobileBottomSheet enabled.
    - Map fullscreen behind.
    - HUD compact pill.
    - Detail drawer becomes bottom sheet.
    - Mission cards compact.

    - _Requirements: 12.8–12.18, 12.21–12.24_

  - [ ] 17.4 No horizontal overflow QA

    - Test widths:
      - 320px
      - 360px
      - 390px
      - 430px
      - 768px
      - 1024px
      - 1280px
      - 1440px

    - Ensure:
      - no horizontal scroll
      - no clipped popup
      - bottom sheet fits
      - HUD readable
      - filters usable

    - _Requirements: 12.18, 18.2–18.10_

---

- [ ] 18. Implement accessibility

  - [ ] 18.1 Keyboard navigation

    - Ensure Tab reaches:
      - sidebar toggle
      - chips
      - slider
      - location search
      - status toggle
      - sort control
      - mission cards
      - popup buttons
      - drawer buttons
      - bottom sheet controls

    - _Requirements: 13.1_

  - [ ] 18.2 ARIA roles and labels

    - Chips:
      - `role="checkbox"` or `switch`
      - `aria-checked`

    - Slider:
      - `role="slider"`
      - `aria-valuemin`
      - `aria-valuemax`
      - `aria-valuenow`
      - `aria-label`

    - ProjectCard:
      - role button or actual button
      - aria-label name + location

    - Pins:
      - aria-label name + status + location

    - Popup:
      - role dialog
      - aria-labelledby

    - Sidebar toggle:
      - aria-expanded
      - aria-label

    - _Requirements: 13.2–13.20_

  - [ ] 18.3 Focus and Escape behavior

    - Focus indicator cyan visible.
    - Drawer traps focus.
    - Escape closes:
      - popup
      - drawer
      - bottom sheet expanded/collapsed if appropriate

    - _Requirements: 13.13–13.20_

  - [ ] 18.4 Aria live regions

    - FlyTo completion announcement.
    - Toast notification announcement.

    - _Requirements: 13.21–13.22_

---

- [ ] 19. Wire routing di `App.jsx`

  - [ ] 19.1 Add route `/dashboard/pilot/job-radar`

    - Route:

      ```jsx
      <ProtectedRoute requestedRole="pilot">
        <PageTransition routeKey="job-radar">
          <JobRadarPage />
        </PageTransition>
      </ProtectedRoute>
      ```

    - `JobRadarPage` boleh direct import.
    - RadarMap lazy-loaded internal only.

    - _Requirements: 1.1–1.8_

  - [ ] 19.2 Ensure role gating behavior

    - Pilot session → render page.
    - No session → redirect `/login`.
    - Client session → redirect `/dashboard/client`.
    - Refresh with valid session → no flash to login.

    - _Requirements: 1.3–1.8_

  - [ ] 19.3 Add link/navigation from Pilot Dashboard if exists

    - If pilot dashboard/sidebar exists, add menu:
      - Job Radar
      - route `/dashboard/pilot/job-radar`

    - Keep UI consistent.

    - _Requirements: 1.1_

---

- [ ] 20. Implement error handling and edge cases

  - [ ] 20.1 Mapbox failures

    - Token invalid → MapErrorFallback.
    - Network error → MapErrorFallback.
    - Lazy chunk error → MapErrorFallback with retry if possible.

    - _Requirements: 14.1–14.3_

  - [ ] 20.2 Terrain fallback

    - DEM error → disable terrain.
    - Show no scary error unless necessary.

    - _Requirements: 14.4_

  - [ ] 20.3 Empty filter state

    - 0 projects:
      - sidebar/bottom sheet empty state
      - clean map no pins
      - HUD stats 0
      - reset filter button

    - _Requirements: 14.6–14.10_

  - [ ] 20.4 Resize and transition edge cases

    - Desktop ↔ tablet ↔ mobile resize.
    - Popup open during resize.
    - Drawer open during resize.
    - Bottom sheet state during resize.
    - Map resize safe.

    - _Requirements: 12.19–12.20, 14.12_

  - [ ] 20.5 Fallback for UI failure

    - If detail drawer fails:
      - show basic fallback text/card

    - If fancy error UI fails:
      - plain text fallback

    - Never silent blank.

    - _Requirements: 14.13–14.15_

---

- [ ] 21. UI/UX Premium Polish Wave

  - [ ] 21.1 Polish Radar Sidebar as dark glass command panel

    - Add:
      - dark glass background
      - cyan border
      - subtle grid
      - soft glow
      - premium header
      - polished filter controls
      - no generic admin feel

    - _Requirements: 15.5, 18.11_

  - [ ] 21.2 Polish Mission Cards

    - Ensure:
      - strong hierarchy
      - status badge visible
      - contract value prominent
      - CTA buttons premium
      - hover glow
      - selected state clear
      - compact but readable

    - _Requirements: 16.1–16.18, 18.14_

  - [ ] 21.3 Polish Radar HUD

    - Make it feel like real command HUD.
    - Desktop full HUD.
    - Mobile compact pill.
    - Avoid blocking map.

    - _Requirements: 9.1–9.15, 18.12_

  - [ ] 21.4 Polish Pin Popup

    - Make popup a mission preview card.
    - Ensure:
      - not clipped
      - readable
      - CTA visible
      - glass style consistent

    - _Requirements: 5.5–5.20, 18.15_

  - [ ] 21.5 Polish Project Detail Drawer

    - Ensure:
      - desktop drawer feels premium
      - mobile detail bottom sheet works
      - content hierarchy clear
      - close behavior smooth

    - _Requirements: 17.1–17.22, 18.16_

  - [ ] 21.6 Polish Mobile Bottom Sheet

    - Ensure:
      - drag handle clear
      - collapsed summary useful
      - expanded filters usable
      - mission cards readable
      - map remains main focus

    - _Requirements: 12.9–12.18, 18.13_

  - [ ] 21.7 Visual consistency pass

    - Match SIAGA:
      - Montserrat + Inter
      - dark navy/cyan palette
      - glassmorphism
      - rounded 24–32px
      - subtle shadow
      - premium aerospace-tech feel
      - custom cursor cyan

    - Avoid:
      - default Mapbox look
      - generic admin panel
      - random colors
      - harsh shadows
      - cluttered UI

    - _Requirements: 15.1–15.17, 18.1–18.24_

  - [ ] 21.8 Animation/microinteraction pass

    - Add subtle:
      - hover lift
      - glow
      - fade in
      - slide drawer
      - toast transition
      - skeleton fade
      - popup transition

    - Avoid excessive animation.

    - _Requirements: 18.19–18.20_

---

- [ ] 22. Final tests and integration QA

  - [ ] 22.1 Run property tests

    - Run:
      - filters.property.test.js
      - filters.unit.test.js

    - Ensure all correctness properties pass.

    - _Requirements: 10.24, 18.21_

  - [ ] 22.2 Write integration test smoke

    - Test:
      - pilot can access `/dashboard/pilot/job-radar`
      - no session redirects to `/login`
      - client redirects to `/dashboard/client`
      - filter updates list/HUD
      - reset filter works
      - toast appears on Bid Sekarang

    - _Requirements: 1.1–1.8, 8.7–8.11_

  - [ ] 22.3 Write a11y test

    - Use `vitest-axe` if installed.
    - Assert no critical violations.
    - Check keyboard traversal.

    - _Requirements: 13.1–13.23_

  - [ ] 22.4 Manual responsive QA

    - Check:
      - 320px
      - 360px
      - 390px
      - 430px
      - 768px
      - 1024px
      - 1280px
      - 1440px

    - Verify:
      - no horizontal overflow
      - bottom sheet usable
      - HUD readable
      - popup not clipped
      - drawer usable
      - mission cards readable

    - _Requirements: 12.18, 18.2–18.10_

  - [ ] 22.5 Manual visual QA

    - Verify:
      - UI feels premium
      - not generic Mapbox demo
      - sidebar glassy
      - cards polished
      - HUD cinematic
      - mobile intentional
      - visual consistent with SIAGA landing/auth/client dashboard

    - _Requirements: 15.1–15.17, 18.1–18.24_

  - [ ] 22.6 Final build test

    - Run:
      - lint if available
      - tests if available
      - production build

    - Fix:
      - build errors
      - missing imports
      - unused fatal issues
      - CSS overflow problems

    - _Requirements: All_

---

- [ ] 23. Final checkpoint

  - [ ] 23.1 Confirm all core tasks completed

    - Verify:
      - route works
      - map loads
      - fallback works
      - filter works
      - sort works
      - cards/pins/HUD consistent
      - detail drawer works
      - mobile bottom sheet works
      - role gating works

  - [ ] 23.2 Report summary in Indonesian

    - Jelaskan:
      - file/komponen yang dibuat
      - fitur utama yang selesai
      - UI/UX polish yang diterapkan
      - responsive behavior
      - testing yang dijalankan
      - known limitations jika ada

---

## Notes

- Core implementation wajib dikerjakan.
- Property/unit/integration/a11y tests boleh diprioritaskan setelah core UI selesai jika target demo sangat cepat, tetapi pure logic tests tetap sangat disarankan.
- `mock-data.js` harus tetap single source of truth.
- Jangan hardcode angka di HUD/sidebar/map.
- RadarMap harus lazy-loaded.
- Sidebar/list/filter harus tetap interaktif walaupun map belum selesai load.
- UI harus mengutamakan demo quality: premium, modern, glassmorphism, cinematic.
- Jangan membuat halaman terasa seperti dashboard Mapbox generic.
- Jangan membuat mobile layout sekadar desktop yang diperkecil.
- Preserve ProtectedRoute, PageTransition, AuthContext, custom cursor, dan design tokens existing.
- “Bid Sekarang” masih placeholder toast untuk demo frontend.
- Detail drawer harus tetap mengambil data dari mock project yang sama.
- Semua visual harus selaras dengan SIAGA landing page, login/register, dan client dashboard.

---

## Task Dependency Graph

```json
{
  "waves": [
    {
      "id": 0,
      "name": "Foundation",
      "tasks": ["1.1", "1.2", "1.3", "1.4", "1.5"]
    },
    {
      "id": 1,
      "name": "Data and Pure Logic",
      "tasks": ["2.1", "2.2", "2.3", "3.1", "3.2", "3.3"]
    },
    {
      "id": 2,
      "name": "Logic Tests",
      "tasks": ["4.1", "4.2", "4.3", "4.4", "4.5", "4.6", "4.7", "4.8", "4.9"]
    },
    {
      "id": 3,
      "name": "Page Shell and Sidebar",
      "tasks": ["5.1", "5.2", "5.3", "6.1", "6.2", "6.3", "6.4", "6.5", "6.6", "6.7"]
    },
    {
      "id": 4,
      "name": "Mission Cards and HUD",
      "tasks": ["7.1", "7.2", "7.3", "7.4", "8.1", "8.2", "8.3"]
    },
    {
      "id": 5,
      "name": "Mapbox Core",
      "tasks": ["9.1", "9.2", "9.3", "10.1", "10.2", "10.3", "10.4", "10.5"]
    },
    {
      "id": 6,
      "name": "Map Interactions",
      "tasks": ["11.1", "11.2", "11.3", "11.4", "11.5", "12.1", "12.2", "12.3", "12.4"]
    },
    {
      "id": 7,
      "name": "Drawer, Mobile, Toast",
      "tasks": ["13.1", "13.2", "13.3", "13.4", "14.1", "14.2", "14.3", "14.4", "14.5", "15.1", "15.2"]
    },
    {
      "id": 8,
      "name": "Wiring and Responsive",
      "tasks": ["16.1", "16.2", "16.3", "16.4", "16.5", "17.1", "17.2", "17.3", "17.4"]
    },
    {
      "id": 9,
      "name": "Accessibility and Routing",
      "tasks": ["18.1", "18.2", "18.3", "18.4", "19.1", "19.2", "19.3"]
    },
    {
      "id": 10,
      "name": "Error Handling",
      "tasks": ["20.1", "20.2", "20.3", "20.4", "20.5"]
    },
    {
      "id": 11,
      "name": "UI/UX Premium Polish Wave",
      "tasks": ["21.1", "21.2", "21.3", "21.4", "21.5", "21.6", "21.7", "21.8"]
    },
    {
      "id": 12,
      "name": "Final QA",
      "tasks": ["22.1", "22.2", "22.3", "22.4", "22.5", "22.6", "23.1", "23.2"]
    }
  ]
}
```

---

## MVP Fast Path

Jika ingin demo cepat, jalankan minimal:

```text
1 → 2 → 3 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 16 → 17 → 19 → 21 → 22.4 → 22.5 → 22.6
```

Testing lengkap tetap disarankan, tetapi untuk UI demo, prioritas tertinggi:

```text
premium sidebar
mission cards
Radar HUD
Mapbox 3D map
pin interaction
detail drawer
mobile bottom sheet
responsive QA
```

---

## Final Direction

```text
Job Radar Page harus terasa seperti radar misi inspeksi UAV premium milik SIAGA:
dark, glassy, real-time, informatif, cinematic, dan sangat selaras dengan brand utama SIAGA.
```