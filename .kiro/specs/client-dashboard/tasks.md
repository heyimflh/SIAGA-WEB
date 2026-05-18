# Implementation Plan: client-dashboard

## Overview

Implementasi fitur client-dashboard dilakukan secara incremental dengan urutan: setup struktur folder & dependency Recharts → modul mock-data + pure utils (selectors, formatters, filters, sort, project resolver) yang dilengkapi property tests → layout shell (Sidebar, Topbar, DashboardShell + alias CSS variable) → tujuh section konten satu per satu (Overview → Map → Timeline → Bidding → Activity → Quick Stats) → Coming Soon page → wiring di `App.jsx` dengan `<ProtectedRoute requestedRole="client">` + `<PageTransition>`.

Pure logic (filter chips, sort, project resolver, format Rupiah, map filter) dikerjakan duluan agar 6 correctness properties dari design dapat memverifikasi invariants sebelum komponen UI dirakit. Komponen UI (sections + shell) memakai layer pure ini sehingga edge case empty state / threshold / monotonicity tertangkap di level test logic.

Stack: React 19 + Vite + react-router-dom + Framer Motion + Mapbox GL JS + react-countup + Lucide React (semua sudah terpasang). Tambahan tunggal: `recharts` untuk donut chart Budget Terpakai.

## Tasks

- [x] 1. Setup folder struktur, dependency Recharts, dan alias CSS variable dashboard
  - [x] 1.1 Install `recharts` sebagai dependency dan buat struktur folder `src/pages/ClientDashboard/` dengan sub-folder `shell/`, `sections/{OverviewCards,AssetMonitoringMap,ProjectTimeline,BiddingReviewTable,RecentActivityFeed,QuickStatsFooter}/`, dan `utils/`
    - Tambahkan `recharts` ke `dependencies` di `package.json` (versi ≥ 2.13.0 yang compatible dengan React 19)
    - Buat file kosong dengan default export placeholder agar import di task berikutnya tidak breaking: `ClientDashboardPage.jsx`, `CreateProjectComingSoon.jsx`, `mock-data.js`, dan stub komponen utama setiap section
    - Tambahkan `.dashboard-shell` scope CSS yang mendefinisikan alias `--color-primary: var(--brand-navy)`, `--color-accent: var(--brand-cyan)`, `--color-surface: #F4F7F6`, `--color-warning: <kuning sesuai existing tokens>` di `ClientDashboardPage.css`
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.6, 14.7_

- [x] 2. Implement Mock Data Module (single source of truth)
  - [x] 2.1 Implement `src/pages/ClientDashboard/mock-data.js` dengan `Object.freeze` dan field lengkap sesuai shape design
    - Field minimum: `perusahaan`, `overview_metrics`, `assets` (7 entries mix `aman`/`perlu_perhatian`/`kritis`), `proyek_aktif` (3 entries dengan `milestones` lengkap 5 key per project), `bids` (5-7 entries per project_id), `activities` (10 entries dengan timestamp ISO), `quick_stats`, `notifications`
    - Mapping email Pak Hendra: `perusahaan.email` cocok dengan email session yang dipakai login mock auth-pages
    - Setiap project's `milestones` mengikuti invariant: paling banyak satu `in_progress`; sebelumnya `completed`; sesudahnya `upcoming`
    - Setiap asset memiliki `id`, `nama`, `kategori`, `lat`, `lng`, `status`, `inspeksi_terakhir`, `foto_url`
    - Setiap bid memiliki `pilot_id`, `project_id`, `pilot_nama`, `pilot_avatar`, `siaga_verified`, `rating` (0..5), `harga`, `estimasi_hari`, `drone_type`, `portfolio_thumbs`
    - _Requirements: 10.1, 10.2, 10.3_

- [x] 3. Implement pure utils — selectors, formatters, filters, sort, project resolver
  - [x] 3.1 Implement `src/pages/ClientDashboard/utils/storage.js` — `safeReadLocalStorage(key)` dan `safeWriteLocalStorage(key, value)` yang membungkus try/catch
    - Read failure → return `null`; Write failure → `console.warn` lalu swallow tanpa throw
    - _Requirements: 6.4a, 16.1, 16.1a_

  - [x] 3.2 Implement `src/pages/ClientDashboard/utils/formatRupiah.js` — `formatRupiah(n)` dan `parseRupiah(str)` round-trip safe
    - `formatRupiah(0) === 'Rp 0'`; `formatRupiah(1000000) === 'Rp 1.000.000'`; gunakan separator titik untuk locale id-ID
    - `parseRupiah('Rp 1.000.000') === 1000000`; toleran terhadap whitespace
    - _Requirements: 4.5, 9.2, 10.9_

  - [x] 3.3 Implement `src/pages/ClientDashboard/utils/formatDate.js` dan `relativeTime.js`
    - `formatIndonesianDate(date)` → `"Senin, 15 Januari 2026"` via `Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })`
    - `relativeTime(timestampISO, now)` → `"5 menit lalu"`, `"2 jam lalu"`, `"kemarin"`, dst.
    - _Requirements: 3.3, 8.2_

  - [x] 3.4 Implement `src/pages/ClientDashboard/utils/selectors.js` — pure derivations dari mock-data
    - Export: `selectAssetCount`, `selectKritisCount`, `selectPerluPerhatianCount`, `selectActiveProjectCount`, `selectBidsForProject(data, projectId)`, `selectCompanyByEmail(data, email)`
    - _Requirements: 10.4, 10.5, 10.6, 10.7, 10.8, 10.9_

  - [x] 3.5 Implement `src/pages/ClientDashboard/utils/bids.js` — `applyChips(bids, { siagaVerifiedOnly, ratingMin4 })` dan `applySort(bids, sort)` plus pre-filter threshold rating ≥ 2
    - Export `ELIGIBLE_THRESHOLD = 2`; `eligibleBids(bids) = bids.filter(b => b.rating >= ELIGIBLE_THRESHOLD)`
    - `applyChips` AND-composition; `applySort` stable dengan tie-break pada `pilot_id.localeCompare`
    - _Requirements: 7.2a, 7.5, 7.6, 7.8, 7.9, 7.10_

  - [x] 3.6 Implement `src/pages/ClientDashboard/utils/mapFilter.js` — `filterAssets(assets, filterValue)` dan `getDisabledFilterOptions(assets)`
    - `filterAssets(assets, 'all')` mengembalikan `assets`; selain `'all'` mengembalikan asset dengan `status === filterValue`
    - `getDisabledFilterOptions(assets)` mengembalikan array status yang TIDAK ada di `assets` (untuk disable opsi filter)
    - _Requirements: 5.10, 5.10a_

  - [x] 3.7 Implement `src/pages/ClientDashboard/utils/projectResolver.js` — `resolveInitialProjectId(mockData, stored)`
    - Jika `proyek_aktif.length === 0` → `null`; jika `stored` ada di list → `stored`; selain itu → `proyek_aktif[0].id`
    - _Requirements: 6.3, 6.4b, 6.4c, 15.1_

  - [x]* 3.8 Write property test `src/pages/ClientDashboard/utils/bids.threshold.property.test.js`
    - **Property 1: Bidding rating threshold tidak dapat dilanggar**
    - **Validates: Requirements 7.2a**
    - Tag: `// Feature: client-dashboard, Property 1: Bidding rating threshold tidak dapat dilanggar`
    - Generator `bidArb` dengan `rating: fc.double({ min: 0, max: 5, noNaN: true })`; assert hasil `applyChips(eligibleBids(bids), chips)` tidak pernah mengandung `rating < 2`

  - [x]* 3.9 Write property test `src/pages/ClientDashboard/utils/bids.chips.property.test.js`
    - **Property 2: Bidding filter chips bersifat AND dan monotonic**
    - **Validates: Requirements 7.8, 7.9, 7.10**
    - Assert `length` monotonic decreasing saat menambahkan chip; assert membership (`siaga_verified === true` saat `siagaVerifiedOnly`; `rating >= 4` saat `ratingMin4`)

  - [x]* 3.10 Write property test `src/pages/ClientDashboard/utils/bids.sort.property.test.js`
    - **Property 3: Bidding sort menghasilkan permutation yang ter-urut**
    - **Validates: Requirements 7.5, 7.6**
    - Assert multiset equality (sama hasil sebelum vs sesudah sort) dan ordering adjacent untuk setiap kombinasi `key × direction`

  - [x]* 3.11 Write property test `src/pages/ClientDashboard/utils/projectResolver.property.test.js`
    - **Property 4: Project resolver memberikan id valid atau null**
    - **Validates: Requirements 6.3, 6.4b, 6.4c, 15.1**
    - Generator: `proyek_aktif` array (mungkin kosong) × `stored` (valid id / stale id / null)

  - [x]* 3.12 Write property test `src/pages/ClientDashboard/utils/formatRupiah.roundTrip.property.test.js`
    - **Property 5: Format Rupiah round-trip**
    - **Validates: Requirements 4.5, 9.2, 10.9**
    - `fc.integer({ min: 0, max: 1_000_000_000 })`; assert `parseRupiah(formatRupiah(n)) === n`

  - [x]* 3.13 Write property test `src/pages/ClientDashboard/utils/mapFilter.property.test.js`
    - **Property 6: Map filter monotonicity dan visible-set membership**
    - **Validates: Requirements 5.10, 5.10a**
    - Assert membership (`status === f` saat `f !== 'all'`); assert `disabled === true ⟺ tidak ada asset dengan status tersebut`

- [x] 4. Checkpoint — Pure logic layer complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement Dashboard Shell — Sidebar, Topbar, DashboardShell layout
  - [x] 5.1 Implement `src/pages/ClientDashboard/shell/DashboardShell.jsx` + `.css` — grid CSS responsive
    - ≥1280px: `grid-template-columns: minmax(240px, 280px) 1fr; grid-template-rows: 64px 1fr; grid-template-areas: "sidebar topbar" "sidebar main"`
    - 768-1279px: kolom kiri 64px (icon-only sidebar)
    - <768px: kolom tunggal, sidebar sebagai drawer
    - Render `<aside>` Sidebar, `<header>` Topbar, `<main>` Main Content Area dengan background `--color-surface`
    - `<main>` scrollable vertikal; sidebar tetap fixed
    - _Requirements: 2.1, 3.6, 3.7, 3.8, 12.1, 12.2, 12.3, 12.6, 13.2_

  - [x] 5.2 Implement `src/pages/ClientDashboard/shell/Sidebar.jsx` + `.css` — tiga variant (full / icon / drawer)
    - Konstanta `SIDEBAR_MENU` sesuai design (Dashboard, Proyek, Asset Map, Bidding, Laporan, Pengaturan); item selain Dashboard di-render `<button disabled>` dengan tooltip "Segera tersedia"
    - Atas-ke-bawah: logo SIAGA kecil, identity block (avatar inisial + companyName + badge "Client"), tombol primary "Buat Proyek Baru" (gradient cyan, `<Link to="/dashboard/client/create-project">`), `<nav aria-label="Navigasi utama">` 6 menu, spacer, tombol Logout di footer
    - Active state pada item Dashboard: `aria-current="page"` + style border-left 3px `--color-accent` + background `rgba(0,210,255,0.10)` (8-15% opacity)
    - Background `--color-primary`; tidak boleh memperkenalkan warna di luar Design_Tokens
    - Logout handler: `logout()` → verify `sessionStorage.getItem('siaga_auth') === null` → `navigate('/login')`; jika gagal tampilkan inline error "Logout gagal, silakan coba lagi" tanpa navigate
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11, 2.12, 2.13, 13.1, 13.4, 13.5, 13.6, 13.6a, 16.1, 16.1a, 16.2, 16.3, 16.3a_

  - [x] 5.3 Implement `src/pages/ClientDashboard/shell/Topbar.jsx` + `.css`
    - Hamburger icon (`aria-label="Buka navigasi"`) hanya tampil pada `<768px`
    - Greeting `<h1>Halo, {companyName}</h1>` + tanggal Indonesia via `formatIndonesianDate(new Date())`
    - `NotificationBell` button (`aria-label="Notifikasi (N belum dibaca)"`); badge angka HANYA jika `unreadCount > 0`
    - `ProfileButton` icon-only di sisi paling kanan (`aria-label="Menu profil"`)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.4a, 3.5, 12.4, 13.7_

  - [x]* 5.4 Write component tests untuk Sidebar dan Topbar
    - Sidebar: tombol "Buat Proyek Baru" navigates ke `/dashboard/client/create-project` (Req 2.10); Logout removes `siaga_auth` dan navigates ke `/login` (Req 16.1, 16.2); item Dashboard aktif punya `aria-current="page"` (Req 13.5)
    - Topbar: badge tidak render saat `unreadCount === 0` (Req 3.4a); greeting menampilkan companyName dari mock-data (Req 3.2)
    - _Requirements: 2.10, 3.2, 3.4a, 13.5, 16.1, 16.2_

- [x] 6. Implement Section A — Overview Cards
  - [x] 6.1 Implement `src/pages/ClientDashboard/sections/OverviewCards/OverviewCards.jsx` + `OverviewCard.jsx` + `.css`
    - Render 4 instance `OverviewCard` dengan variant: `proyek-aktif`, `aset-terinspeksi`, `budget`, `proyek-selesai`
    - Grid responsive: 4 kolom ≥1280px, 2 kolom 768-1279px, 1 kolom <768px
    - Style glassmorphism (background semi-transparan + backdrop blur tipis)
    - Hover effect: `transform: translateY(-6px)` durasi 200ms (range -4..-8px, 150-300ms)
    - Variant `proyek-aktif`: label, angka utama, ikon, indikator tren arrow + persentase
    - Variant `aset-terinspeksi`: angka + progress bar `--color-accent` proporsional terhadap `target_tahunan`
    - Variant `budget`: angka format Rupiah + slot untuk `BudgetDonut` (di-mount oleh task 6.2)
    - Variant `proyek-selesai`: angka + badge `--color-success` "+N vs bulan lalu"
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10_

  - [x] 6.2 Implement count-up viewport-triggered + `BudgetDonut.jsx` lazy + chart skeleton
    - Pakai `useVisibility` (existing `src/hooks/useVisibility.js`) untuk gating animasi count-up
    - `react-countup`: `<CountUp end={visible ? value : 0} duration={1.0} preserveValue start={0} />` — durasi dalam range 0.8-1.5s; final value === source value (round-trip)
    - `BudgetDonut.jsx` (Recharts): di-`lazy()` import; render hanya saat parent OverviewCard visible AND mock-data ready
    - `<Suspense fallback={<ChartSkeleton width={140} height={140} />}>` membungkus `BudgetDonut`; skeleton tetap tampil sampai chart benar-benar render visualnya
    - Implementasi `ChartSkeleton.jsx` shared dengan dimensi tetap untuk hindari layout shift
    - _Requirements: 4.11, 4.12, 11.2, 11.3, 11.5, 11.5a, 11.5b, 15.7, 15.7a_

  - [x]* 6.3 Write unit test untuk OverviewCard count-up final value
    - Mount `<OverviewCard variant="proyek-aktif" data={{ primaryValue: 42 }}>`, simulasikan visible, await final text via `screen.findByText('42')` dengan timeout 2000ms
    - Validates Requirement 4.12 (round-trip property: angka final = nilai sumber)
    - _Requirements: 4.12_

- [x] 7. Implement Section B — Asset Monitoring Map (lazy-loaded + error boundary)
  - [x] 7.1 Implement `src/pages/ClientDashboard/sections/AssetMonitoringMap/AssetMapFallback.jsx` — tiga variant `loading`, `error`, `bare`
    - `loading`: div `--color-primary` + spinner kecil + teks "Memuat peta…"
    - `error`: pesan "Peta tidak tersedia saat ini" + list teks aset (nama + status); render dibungkus internal try/catch yang fallback ke variant `bare`
    - `bare`: `<div>Peta tidak dapat dimuat</div>` minimal HTML statis
    - _Requirements: 5.17, 5.18, 15.5, 15.5a_

  - [x] 7.2 Implement `src/pages/ClientDashboard/sections/AssetMonitoringMap/AssetMapErrorBoundary.jsx` — class component dengan `componentDidCatch`
    - Tangkap chunk-load error, error inisialisasi Mapbox, runtime error Mapbox; render `<AssetMapFallback variant="error" assets={...} />`
    - _Requirements: 5.18, 15.5_

  - [x] 7.3 Implement `src/pages/ClientDashboard/sections/AssetMonitoringMap/AssetMonitoringMap.jsx` — Mapbox map init + custom markers
    - `mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN`; style `mapbox://styles/mapbox/dark-v11`; tinggi container 520px (range 480-560px)
    - Custom HTML marker per asset: class `.asset-pin asset-pin--{status}`; status `aman` → hijau `--color-success`, `perlu_perhatian` → kuning `--color-warning`, `kritis` → merah `--color-danger` + class `.asset-pin--pulse`
    - CSS pulse `@keyframes asset-pulse` durasi siklus 1.6s (range 1.2-2s); pause pada `prefers-reduced-motion: reduce`
    - Marker `aria-label="Aset {nama}, status {status}"` dengan `role="button"`
    - Filter visibility via `el.style.display` (tidak remove/add marker)
    - Default file export untuk `React.lazy()` consumption
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 13.7_

  - [x] 7.4 Implement `MapLegend.jsx`, `MapFilter.jsx`, `MapFloatingStats.jsx`
    - `MapLegend`: pojok kiri atas, 3 indikator (Aman/Perlu Perhatian/Kritis)
    - `MapFilter`: grup tombol toggle (Semua / Kritis Saja / Perlu Perhatian Saja); opsi tanpa data ter-disable via `getDisabledFilterOptions`
    - `MapFloatingStats`: strip transparan "[N] Aset Termonitor | [M] Kritis | [K] Perlu Perhatian" dengan nilai dari selectors (konsistensi cross-section by construction)
    - Filter state per-session (in-memory only, tidak ke localStorage); persist saat user scroll keluar dan kembali
    - _Requirements: 5.8, 5.9, 5.10, 5.10a, 5.11, 5.12, 10.4, 10.5, 10.6_

  - [x] 7.5 Implement `AssetDetailDrawer.jsx` — slide-in dari kanan via Framer Motion
    - Variants `{ hidden: { x: '100%' }, visible: { x: 0 } }` durasi 280ms easeOut (range 200-400ms)
    - Konten: foto aset, nama, lokasi, status terakhir inspeksi, tanggal inspeksi terakhir, link "Lihat Detail", link "Generate Report"
    - On open: focus pertama focusable element; on Escape close; click overlay backdrop close
    - Slide-out kembali ke kanan saat close
    - _Requirements: 5.13, 5.14, 5.15, 13.10, 13.11_

  - [x] 7.6 Wire `AssetMonitoringMap` ke `ClientDashboardPage` dengan `React.lazy` + `<Suspense>` + `<AssetMapErrorBoundary>`
    - `const AssetMonitoringMap = lazy(() => import('./sections/AssetMonitoringMap'))`
    - Bungkus dengan `<AssetMapErrorBoundary fallback={<AssetMapFallback variant="error" assets={assets} />}><Suspense fallback={<AssetMapFallback variant="loading" />}>...`
    - Memastikan Section_Overview_Cards tetap interactive tanpa menunggu Map selesai dimuat
    - Empty state: jika `assets` kosong, render peta kosong + overlay teks "Belum ada aset terdaftar"
    - _Requirements: 5.16, 5.17, 5.18, 11.1, 11.6, 15.2_

  - [x]* 7.7 Write component tests untuk AssetMonitoringMap (mock `mapbox-gl`)
    - `vi.mock('mapbox-gl', () => ({ default: { accessToken: '', Map: vi.fn(() => mockMap), Marker: vi.fn(() => mockMarker) } }))`
    - Assert `Marker` constructor dipanggil sesuai `assets.length`; opsi MapFilter tanpa data ter-disable; AssetDetailDrawer Escape menutup drawer; focus berpindah ke first focusable on open
    - _Requirements: 5.4, 5.10a, 13.10, 13.11_

- [x] 8. Implement Section C — Project Timeline
  - [x] 8.1 Implement `src/pages/ClientDashboard/sections/ProjectTimeline/ProjectSelector.jsx`
    - ≥1280px: `<div role="tablist">` dengan tabs; <1280px: `<select>` untuk simplicity mobile
    - Default selection via `resolveInitialProjectId(mockData, safeReadLocalStorage('siaga.client.lastSelectedProjectId'))`
    - On select: dispatch perubahan `selectedProjectId` ke parent + `safeWriteLocalStorage('siaga.client.lastSelectedProjectId', id)`
    - Persist pilihan: lintas-session (localStorage) dan dalam-session (state)
    - _Requirements: 6.2, 6.3, 6.4, 6.4a, 6.4b, 6.4c, 13.4_

  - [x] 8.2 Implement `MilestoneNode.jsx` + `ProjectTimeline.jsx` + `.css` — timeline horizontal dengan 5 milestone
    - Konstanta `MILESTONES = [posted, bidding_open, pilot_selected, inspection_in_progress, report_ready]` dengan icon Lucide
    - Render `<ol role="list">` 5 `MilestoneNode` berderet
    - Status `completed`: ikon centang `--color-success`
    - Status `in_progress`: pulse animation `--color-accent` durasi siklus 1.6s
    - Status `upcoming`: opacity tereduksi tanpa animasi
    - Garis penghubung horizontal sebagai progress bar `--color-accent` mengisi sesuai status
    - Re-render full timeline saat `selectedProjectId` berubah
    - Empty state: jika `proyek_aktif` kosong → ikon + "Belum ada proyek aktif" + tombol "Buat Proyek Baru" → `/dashboard/client/create-project`
    - _Requirements: 6.1, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10, 6.11, 15.1_

  - [x]* 8.3 Write unit test untuk ProjectTimeline + ProjectSelector
    - Stored stale id pada localStorage → fallback ke proyek pertama default (Req 6.4c)
    - Memilih proyek pada selector menulis ke localStorage (Req 6.4a)
    - Empty state render saat `proyek_aktif` kosong (Req 15.1)
    - _Requirements: 6.4a, 6.4c, 15.1_

- [x] 9. Implement Section D — Bidding Review Table
  - [x] 9.1 Implement `src/pages/ClientDashboard/sections/BiddingReviewTable/BidFilterChips.jsx` dan kontrol sort
    - Dua chip: "SIAGA Verified Only" dan "Rating Min 4 Bintang"; klik toggle state
    - Kontrol sort per kolom dengan `aria-sort` (`ascending`/`descending`/`none`)
    - _Requirements: 7.5, 7.6, 7.7, 7.8, 7.9, 7.10, 13.9_

  - [x] 9.2 Implement `BidRow.jsx` + `BiddingReviewTable.jsx` + `.css` — `<table>` semantic dengan kolom lengkap
    - Kolom: Avatar Pilot, Nama Pilot, Badge SIAGA Verified, Rating (bintang + numerik), Harga Bid (format Rupiah), Estimasi Hari, Drone Type, Aksi
    - `<thead>` dengan `<th scope="col">` per header
    - Pre-filter: `bids` selalu di-filter via `eligibleBids()` (rating ≥ 2) sebelum chips/sort
    - Pipeline: `eligibleBids → applyChips(bidFilters) → applySort(bidSort)`
    - Hover row: highlight `--color-accent` opacity 8% (range 5-12%)
    - Empty state Requirement 7.14: `bids.length === 0` → ikon + "Belum ada penawaran masuk untuk proyek ini" + tombol opsional "Promosikan Proyek"
    - Empty state Requirement 7.10a: `eligibleBids.length > 0` tapi hasil chips kosong → pesan + ringkasan filter aktif + tombol "Reset Filter"
    - <768px responsive: stacked card via CSS `display: block` + `data-label` per `<td>`
    - _Requirements: 7.1, 7.2, 7.2a, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10, 7.10a, 7.14, 12.5, 13.8_

  - [x] 9.3 Implement `PilotProfileDrawer.jsx` dan `PilotSelectionModal.jsx`
    - `PilotProfileDrawer`: slide-in dari kanan saat tombol "Lihat Profil" diklik; struktur drawer mirip `AssetDetailDrawer` (focus trap, Escape close)
    - `PilotSelectionModal`: `createPortal(document.body)`; animasi scale-in 200ms (range 150-300ms); konten ringkasan pilot terpilih + peringatan + tombol "Batal" + "Konfirmasi Pilihan"; focus trap; Escape close
    - _Requirements: 7.11, 7.12, 7.13, 13.10, 13.11_

  - [x]* 9.4 Write unit test untuk BiddingReviewTable
    - Threshold rating < 2 selalu di-hide regardless dari chip state (Req 7.2a)
    - Empty state `7.14` (no bids) berbeda dari `7.10a` (no match after filter): pesan dan tombol berbeda
    - Hover row class assertion (Req 7.4)
    - `PilotSelectionModal` Escape close + focus trap (Req 13.10, 13.11)
    - _Requirements: 7.2a, 7.4, 7.10a, 7.14, 13.10, 13.11_

- [x] 10. Implement Section E — Recent Activity Feed dan Section F — Quick Stats Footer
  - [x] 10.1 Implement `src/pages/ClientDashboard/sections/RecentActivityFeed/ActivityItem.jsx` + `RecentActivityFeed.jsx` + `.css`
    - `<aside aria-label="Aktivitas terbaru">` dengan timeline vertikal 8-12 `ActivityItem`
    - `ActivityItem`: ikon Lucide sesuai `type` + deskripsi + timestamp relatif via `relativeTime()`
    - Max-height + internal scroll vertikal saat melebihi tinggi container
    - Item dengan `is_new === true` mendapat class `.activity-item--new` yang menjalankan pulse animation 1 siklus (1.4s) lalu `animationend` listener menghapus class
    - Layout responsive: ≥1280px placement di kolom kanan grid Main Content (sticky `top: 80px`); <1280px stacked di bawah `BiddingReviewTable`
    - Empty state: `activities` kosong → "Belum ada aktivitas terbaru"
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 13.3, 15.4_

  - [x] 10.2 Implement `src/pages/ClientDashboard/sections/QuickStatsFooter/QuickStatsFooter.jsx` + `.css`
    - Strip horizontal di paling bawah Main Content dengan 3 statistik berdampingan
    - Statistik 1: "Total Hemat dari Inspeksi Konvensional: [Rupiah]" via `formatRupiah`
    - Statistik 2: "Total Pilot Bekerja Sama: [N]"
    - Statistik 3: "Rata-rata Waktu Bidding: [X] hari"
    - Pakai `useVisibility` untuk trigger count-up; durasi 1.0s (range 0.8-1.5s)
    - Skip count-up jika value `=== 0`: render "0" langsung
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.5a, 11.4_

  - [x]* 10.3 Write unit test untuk RecentActivityFeed dan QuickStatsFooter
    - Empty state activities (Req 15.4); QuickStats value 0 → tidak run count-up + render "0" langsung (Req 9.5a)
    - _Requirements: 9.5a, 15.4_

- [x] 11. Implement ClientDashboardPage compose + state machine drawer + DashboardErrorBoundary
  - [x] 11.1 Implement `src/pages/ClientDashboard/ClientDashboardPage.jsx` compose semua section
    - State: `selectedProjectId`, `mapFilter`, `bidFilters`, `bidSort`, `drawer` (single-drawer state machine `{ kind: 'asset'|'pilot'|'pilot-confirm'|null, payload }`)
    - Resolve session → companyName via `selectCompanyByEmail(mockData, session.email)` dengan fallback ke `session.email`
    - `useEffect` write-back: setiap perubahan `selectedProjectId` ditulis ke localStorage via `safeWriteLocalStorage`
    - Compose: `<DashboardShell session companyName notifUnread={mockData.notifications.unread_count}>` berisi `<OverviewCards>`, `<AssetMonitoringMap />` (lazy), `<ProjectTimeline>`, `<BiddingReviewTable>`, `<RecentActivityFeed>`, `<QuickStatsFooter>`
    - Grid Main Content ≥1280px: `grid-template-columns: minmax(0, 1fr) 320px` dengan kolom kanan sticky untuk `RecentActivityFeed`
    - Tidak ada panggilan HTTP/API real
    - _Requirements: 1.1, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1, 10.1, 10.2, 12.6_

  - [x] 11.2 Implement `DashboardErrorBoundary.jsx` membungkus `ClientDashboardPage` di dalam `<PageTransition>`
    - On error caught: render fallback plain DOM "Terjadi kesalahan memuat dashboard" + tombol reload; TIDAK menjalankan animasi exit (animasi PageTransition diabaikan saat error)
    - _Requirements: 1.6a_

  - [x] 11.3 Implement `src/pages/ClientDashboard/CreateProjectComingSoon.jsx` + `.css`
    - Dibungkus `<DashboardShell>` agar konsistensi visual (cursor, font, transition)
    - Konten: ikon konstruksi/drone (Lucide `Construction`), `<h1>Buat Proyek Baru</h1>`, subtitle "Wizard 4-step akan segera tersedia", tombol "Kembali ke Dashboard" → `<Link to="/dashboard/client">`
    - Sidebar item active: null (tidak ada item Create Project di menu)
    - _Requirements: 17.2, 17.3_

- [x] 12. Wire routing di `App.jsx` dan integrasi konsistensi visual
  - [x] 12.1 Update `src/App.jsx` — tambah route `/dashboard/client` dan `/dashboard/client/create-project`
    - `/dashboard/client` → `<ProtectedRoute requestedRole="client"><PageTransition><DashboardErrorBoundary><ClientDashboardPage /></DashboardErrorBoundary></PageTransition></ProtectedRoute>`
    - `/dashboard/client/create-project` → `<ProtectedRoute requestedRole="client"><PageTransition><CreateProjectComingSoon /></PageTransition></ProtectedRoute>`
    - Hapus pemakaian `ClientDashboard` placeholder di route `/dashboard/client` (replace dengan `ClientDashboardPage`)
    - Pertahankan `<CustomCursor>` di level App agar custom cursor cyan tetap aktif
    - PageTransition memakai variants existing dari `src/components/PageTransition.jsx` tanpa modifikasi (durasi konsisten dengan auth-pages)
    - _Requirements: 1.1, 1.2, 1.3, 1.6, 14.5, 14.8, 17.1, 17.5_

  - [x] 12.2 Implement security on logout — pastikan tidak ada data sensitif yang ter-render setelah navigate ke `/login`
    - Verify pada Sidebar logout: setelah `logout()`, navigate ke `/login` me-unmount `ClientDashboardPage` sehingga DOM bersih dari nama perusahaan, daftar aset, bid pilot
    - _Requirements: 16.4, 16.5_

  - [x]* 12.3 Write integration test smoke `app.smoke.test.jsx` (extend existing)
    - Login client → `/dashboard/client` render shell + 7 sections (Req 1.1, 1.3)
    - No session ke `/dashboard/client` → redirect ke `/login` (Req 1.4)
    - Pilot session ke `/dashboard/client` → redirect ke `/dashboard/pilot` (Req 1.5)
    - Refresh `/dashboard/client` dengan session valid → tidak flash ke `/login` (Req 1.7)
    - Pilot session ke `/dashboard/client/create-project` → redirect ke `/dashboard/pilot` (Req 17.4)
    - Logout → `/login` + DOM bersih dari nama perusahaan (Req 16.2, 16.5)
    - Back button setelah logout → tetap di `/login` (Req 16.4)
    - _Requirements: 1.1, 1.3, 1.4, 1.5, 1.7, 16.2, 16.4, 16.5, 17.4_

  - [x]* 12.4 Write a11y test `src/pages/ClientDashboard/clientDashboard.a11y.test.jsx`
    - Pakai `vitest-axe`; assert no violations pada full ClientDashboardPage rendered dengan mock client session
    - Keyboard tab traversal: Sidebar items focusable (Req 13.4); focus indicator visible (Req 13.6); `<table>` punya `<th scope="col">` (Req 13.8); kontrol sort punya `aria-sort` (Req 13.9); drawer focus trap + Escape close (Req 13.10, 13.11)
    - Snapshot Coming Soon page untuk verifikasi struktur visual
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.6a, 13.7, 13.8, 13.9, 13.10, 13.11_

- [x] 13. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Sub-tasks bertanda `*` adalah test (property/unit/integration/a11y) yang opsional dan dapat dilewati untuk MVP demo cepat. Core implementation (no `*`) wajib dijalankan agar fitur berfungsi sesuai requirement.
- Setiap task merujuk ke klausa requirement granular (bukan hanya nomor user story) untuk traceability menuju acceptance criteria.
- Property tests memvalidasi 6 correctness properties dari design (P1-P6); P7 di-reuse dari spec auth-pages dan tidak ditulis ulang. Tag setiap property test dengan `// Feature: client-dashboard, Property {N}: {text}`.
- Pure utils (selectors, bids, mapFilter, projectResolver, formatRupiah) dikerjakan duluan agar PBT bisa berjalan terisolasi sebelum komponen UI dirakit.
- Mapbox GL JS dan Recharts adalah dependency berat yang di-code-split via `React.lazy()` agar Section_Overview_Cards tetap interactive tanpa menunggu chunk besar.
- `mock-data.js` adalah single source of truth — di-`Object.freeze` untuk menjamin invariant cross-section by construction (bukan property test runtime).
- Custom cursor cyan, Page_Transition, dan ProtectedRoute existing dari spec auth-pages di-reuse 1:1 tanpa modifikasi.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1", "3.1", "3.2", "3.3"] },
    { "id": 2, "tasks": ["3.4", "3.5", "3.6", "3.7"] },
    { "id": 3, "tasks": ["3.8", "3.9", "3.10", "3.11", "3.12", "3.13", "5.1", "7.1"] },
    { "id": 4, "tasks": ["5.2", "5.3", "7.2", "7.4", "8.1", "9.1", "10.1", "10.2", "11.3"] },
    { "id": 5, "tasks": ["6.1", "7.3", "8.2", "9.2"] },
    { "id": 6, "tasks": ["6.2", "7.5", "9.3"] },
    { "id": 7, "tasks": ["5.4", "6.3", "7.6", "8.3", "9.4", "10.3", "11.1"] },
    { "id": 8, "tasks": ["11.2", "12.2"] },
    { "id": 9, "tasks": ["12.1"] },
    { "id": 10, "tasks": ["12.3", "12.4"] }
  ]
}
```
