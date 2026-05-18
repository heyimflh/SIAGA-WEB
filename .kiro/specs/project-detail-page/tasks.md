# Implementation Plan: Project Detail Page

## Overview

Implementasi fitur **project-detail-page** dilakukan secara incremental — dimulai dari data layer dan pure logic, kemudian komponen-komponen UI dari atas ke bawah (Hero → Scope → Map → Timeline → Bidding → Specs → Client Info → Related Projects), dan diakhiri dengan wiring, responsive behavior, accessibility, dan error handling.

Halaman ini bukan sekadar halaman detail biasa, tetapi harus terasa seperti:

```text
SIAGA Project Intelligence Briefing
```

Target visual:

```text
premium, informatif, role-aware, glassmorphism, dark-cyan accent, aerospace-tech, professional, dan selaras dengan Job Radar / Client Dashboard / Auth Pages SIAGA
```

Urutan implementasi:

```text
folder structure + route setup
→ extended mock data module (single source of truth)
→ pure logic layer (project-logic.js)
→ property-based tests (fast-check)
→ ProjectDetailPage shell + state management
→ NotFoundState + Error Boundary
→ Breadcrumb
→ ProjectHero (role-aware CTA)
→ ProjectScope
→ InspectionAreaMap (lazy loaded + Mapbox)
→ ProjectTimeline
→ BiddingSection (Client: BidTable + Modal + Drawer, Pilot: BidForm + Summary)
→ TechnicalSpecs
→ ClientInfoSection (Pilot only)
→ RelatedProjects (Pilot only)
→ ToastNotification
→ responsive behavior
→ accessibility polish
→ final wiring + integration
→ final QA checkpoint
```

Stack:

```text
React 19 + Vite + react-router-dom + Framer Motion + Mapbox GL JS + Lucide React + fast-check + Vitest
```

Core principles:

- `project-detail-data.js` extends Job Radar `mock-data.js` — single source of truth.
- `project-logic.js` berisi pure functions yang testable dengan fast-check.
- InspectionAreaMap harus lazy-loaded dengan `React.lazy()` + `Suspense`.
- Hero dan Scope section harus interaktif sebelum Mapbox selesai load.
- Conditional rendering berdasarkan role — satu halaman, dua tampilan.
- UI harus selaras dengan SIAGA Design Tokens (tidak ada warna/font baru).
- Bid state disimpan di sessionStorage keyed `siaga_bid_{projectId}`.

---

## Tasks

- [ ] 1. Set up project structure, route, and mock data
  - [ ] 1.1 Create directory structure and route registration
    - Create folder `src/pages/ProjectDetail/` with sub-folders: `components/Breadcrumb`, `components/ProjectHero`, `components/ProjectScope`, `components/InspectionAreaMap`, `components/ProjectTimeline`, `components/BiddingSection`, `components/TechnicalSpecs`, `components/ClientInfoSection`, `components/RelatedProjects`, `components/NotFoundState`, `components/ToastNotification`, and `__tests__/`
    - Create placeholder `ProjectDetailPage.jsx` and `ProjectDetailPage.css`
    - Register route `/project/:projectId` in `App.jsx` wrapped with `ProtectedRoute` that accepts both "client" and "pilot" roles
    - Ensure `ProtectedRoute` supports multi-role access (update if needed to accept array or "any" mode)
    - Wrap route with `PageTransition` for fade + slide-up animation
    - _Requirements: 1.1, 1.2, 1.3, 1.8_

  - [ ] 1.2 Create extended mock data module (`project-detail-data.js`)
    - Import base project data from `src/pages/JobRadar/mock-data.js`
    - Extend each project entry with additional fields: `luas_area`, `jumlah_titik_inspeksi`, `deliverables`, `spesifikasi_teknis`, `polygon_area`, `titik_inspeksi`, `milestones`, `client_info`, `bids`
    - Ensure `id` field is used as `projectId` key for URL matching
    - Ensure `jumlah_bidder` equals `bids.length` for each project
    - Ensure `polygon_area` has at least 3 coordinate pairs per project
    - Ensure `lokasi.lat` is between -11 and 6, `lokasi.lng` between 95 and 141 (Indonesia bounds)
    - Include at least 4-5 projects with varied statuses (open, urgent, in_progress, completed) and varied `jenis_infrastruktur`
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

  - [ ] 1.3 Implement pure logic module (`project-logic.js`)
    - Implement `getProjectById(projects, projectId)` — returns project or null
    - Implement `getProjectStatus(project, today)` — returns derived status, handles expired deadline
    - Implement `getStatusBadgeVisual(status)` — maps status to color/label/cssClass
    - Implement `getRoleVisibility(role, projectStatus, hasBid)` — returns RoleVisibility object
    - Implement `getRelatedProjects(currentProject, allProjects)` — max 3, exclude current, same infra then fallback to same provinsi
    - Implement `validateBidForm(formData)` — returns { ok, errors }
    - Implement `isDeadlinePassed(deadline, today)` — boolean
    - Implement `formatTanggalIndonesia(dateString)` — e.g. "15 Maret 2026"
    - Implement `getHeroCTA(role, projectStatus, hasBid)` — returns CTA config or null
    - Implement `getDashboardPath(role)` — returns dashboard route string
    - Implement `isMilestoneConsistent(projectStatus, milestones)` — validates milestone/status consistency
    - _Requirements: 1.4, 1.5, 1.7, 2.3, 2.13, 5.7, 7.6, 7.7, 10.3, 10.4, 10.5_

- [ ] 2. Property-based tests for pure logic layer
  - [ ]* 2.1 Write property test: Project lookup is total and correct
    - **Property 1: Project lookup is total and correct**
    - Test that `getProjectById` returns correct project for valid IDs and null for invalid IDs
    - Use `fc.constantFrom(...validIds)` for valid cases and `fc.string()` for invalid cases
    - **Validates: Requirements 1.4, 1.5, 11.4**

  - [ ]* 2.2 Write property test: Status badge visual mapping is deterministic and total
    - **Property 2: Status badge visual mapping is deterministic and total**
    - Test that `getStatusBadgeVisual` returns correct visual config for all valid statuses
    - Use `fc.constantFrom('open', 'urgent', 'deadline_dekat', 'in_progress', 'completed', 'expired')`
    - **Validates: Requirements 2.3, 2.13**

  - [ ]* 2.3 Write property test: Role-aware data isolation
    - **Property 3: Role-aware data isolation — Pilot never sees bid prices**
    - Test that `getRoleVisibility('pilot', status, hasBid)` always returns `showBidTable: false`
    - Generate projects with bids + role='pilot', assert no price leaks in visibility config
    - **Validates: Requirements 7.2, 7.14**

  - [ ]* 2.4 Write property test: Role visibility is consistent and exhaustive
    - **Property 4: Role visibility is consistent and exhaustive**
    - Test all combinations of role × status × hasBid produce correct RoleVisibility
    - Use `fc.constantFrom('client', 'pilot')` × `fc.constantFrom(...statuses)` × `fc.boolean()`
    - **Validates: Requirements 1.7, 2.5, 2.6, 6.10, 7.3, 7.11, 7.12, 9.1, 9.2, 10.1, 10.2**

  - [ ]* 2.5 Write property test: Derived status correctly handles expired deadline
    - **Property 5: Derived status correctly handles expired deadline**
    - Test that deadline < today AND status 'open' → returns 'expired', otherwise returns original status
    - Use `fc.date()` for today, generate projects with various deadlines
    - **Validates: Requirements 2.13, 15.3**

  - [ ]* 2.6 Write property test: Bid form validation
    - **Property 6: Bid form validation rejects invalid inputs and accepts valid ones**
    - Test that `validateBidForm` returns ok:true iff harga > 0 AND estimasiHari > 0
    - Use `fc.record({ harga: fc.oneof(fc.constant(0), fc.nat()), estimasiHari: fc.oneof(fc.constant(0), fc.nat()) })`
    - **Validates: Requirements 7.6, 7.7**

  - [ ]* 2.7 Write property test: Related projects filtering
    - **Property 7: Related projects filtering excludes current and matches criteria**
    - Test max 3 results, current project excluded, matches infra type or fallback to provinsi
    - Generate project arrays with varying infra types and provinces
    - **Validates: Requirements 10.3, 10.4, 10.5**

  - [ ]* 2.8 Write property test: Hero CTA deterministic
    - **Property 8: Hero CTA is deterministic based on role + status + hasBid**
    - Test all combinations produce exactly one correct CTA config
    - **Validates: Requirements 2.9, 2.10, 2.11, 2.12**

  - [ ]* 2.9 Write property test: Milestone consistency
    - **Property 9: Milestone consistency with project status**
    - Test that in_progress status implies at least one in_progress milestone
    - Generate milestone objects with various status combinations
    - **Validates: Requirements 5.7**

  - [ ]* 2.10 Write property test: Mock data schema validation
    - **Property 10: Mock data schema validation**
    - Validate every project in actual mock data array has correct types and constraints
    - **Validates: Requirements 11.3, 11.5, 11.6**

- [ ] 3. Checkpoint - Core logic verified
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Implement page shell and error states
  - [ ] 4.1 Implement NotFoundState component
    - Create `NotFoundState.jsx` and `NotFoundState.css`
    - Display illustration/icon, "Proyek tidak ditemukan" message, and "Kembali ke Dashboard" button
    - Button navigates to role-appropriate dashboard using `getDashboardPath(role)`
    - Style with glassmorphism dark panel consistent with SIAGA design
    - _Requirements: 1.5, 1.6, 15.1_

  - [ ] 4.2 Implement ProjectDetailPage shell with state management
    - Read `projectId` from `useParams()` and `role` from `useAuth()`
    - Lookup project using `getProjectById`, compute derived status with `getProjectStatus`
    - Determine role visibility with `getRoleVisibility`
    - Manage state: project, isNotFound, bidFormData, bidFormErrors, isBidSubmitting, hasBid, submittedBid, selectedPilotId, isModalOpen, isDrawerOpen, drawerPilotId, toastMessage
    - Check sessionStorage for existing bid (`siaga_bid_{projectId}`)
    - Reset all local state when `projectId` changes via `useEffect([projectId])`
    - Wrap page in error boundary that shows generic error + "Muat Ulang" button
    - Render NotFoundState when project not found
    - _Requirements: 1.4, 1.5, 1.7, 1.9, 1.10, 12.6, 15.6, 15.7_

  - [ ] 4.3 Implement ToastNotification component
    - Create `ToastNotification.jsx` and `ToastNotification.css`
    - Glass style with cyan accent, rounded 18-22px
    - Auto dismiss after 3-5 seconds
    - Add `aria-live="polite"` for screen reader announcement
    - _Requirements: 7.8, 14.11_

- [ ] 5. Implement hero and navigation components
  - [ ] 5.1 Implement Breadcrumb component
    - Create `Breadcrumb.jsx` and `Breadcrumb.css`
    - Format: "Dashboard > Proyek > [Nama Proyek]"
    - Use `<nav aria-label="Breadcrumb">` semantic element
    - "Dashboard" links to role-appropriate dashboard path
    - "Proyek" is non-clickable label, current project name is bold non-clickable
    - Ensure readable on all breakpoints
    - _Requirements: 2.7, 2.8, 13.8, 14.2_

  - [ ] 5.2 Implement ProjectHero component
    - Create `ProjectHero.jsx` and `ProjectHero.css`
    - Background: navy gradient using `--color-primary`
    - H1 title with Montserrat 700/800 font
    - Project_Status_Badge with color mapped by status (open→accent, urgent→danger, in_progress→warning, completed→success, expired→grey)
    - Add `aria-label` to status badge describing status
    - Info row: infrastructure icon + location (kota, provinsi) + deadline in Indonesian format
    - Contract value visible for Client only (hidden for Pilot)
    - Role-aware CTA button using `getHeroCTA` logic
    - CTA "Lihat Bidding" / "Bid Sekarang" scrolls to Bidding_Section
    - CTA "Bid Terkirim ✓" shows disabled style when pilot has bid
    - Responsive: reduce padding and font size on mobile
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.9, 2.10, 2.11, 2.12, 2.13, 2.14, 13.9, 14.3_

- [ ] 6. Implement content sections
  - [ ] 6.1 Implement ProjectScope component
    - Create `ProjectScope.jsx` and `ProjectScope.css`
    - Display: deskripsi lengkap, jenis infrastruktur + icon, luas area (km²), jumlah titik inspeksi, deliverables list (chips/tags), ringkasan spesifikasi teknis
    - Card layout with `--color-surface` background and consistent border radius
    - Use Lucide React icons for infrastructure categories
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [ ] 6.2 Implement InspectionAreaMap with lazy loading
    - Create `InspectionAreaMap/index.js` (lazy export), `InspectionAreaMap.jsx`, `InspectionAreaMap.css`, `MapLoadingFallback.jsx`, `MapErrorFallback.jsx`
    - Use `React.lazy()` + `Suspense` for the map component
    - MapLoadingFallback: div with `--color-primary` background, spinner, "Memuat peta area inspeksi…" text
    - MapErrorFallback: "Peta tidak tersedia" message + text list of coordinates
    - Mapbox settings: token from `import.meta.env.VITE_MAPBOX_TOKEN`, style `dark-v11`, container 400px height
    - Render polygon with semi-transparent `--color-accent` fill and solid stroke
    - Render markers at each `titik_inspeksi` point
    - Auto-fit bounds to polygon bounding box
    - Display GPS coordinates below map
    - Wrap in error boundary to catch Mapbox failures
    - Responsive: 300px tablet, 250px mobile
    - Add `aria-label="Peta area inspeksi proyek"`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 12.1, 12.3, 13.3, 13.4, 14.4, 15.5_

  - [ ] 6.3 Implement ProjectTimeline component
    - Create `ProjectTimeline.jsx` and `ProjectTimeline.css`
    - Horizontal timeline with 5 milestones: Posted, Bidding Open, Pilot Selected, Inspection In Progress, Report Ready
    - Each milestone shows: icon, label, date from mock data
    - Completed: checkmark icon, `--color-success`, filled connector `--color-accent`
    - In progress: pulse animation `--color-accent`, duration 1.2s-2s (CSS transform + opacity for performance)
    - Upcoming: reduced opacity 0.3-0.5, grey connector
    - Style consistent with Client Dashboard timeline design language
    - Add `aria-label` describing progress for screen reader
    - Use Viewport_Trigger (Intersection Observer) for animation trigger
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 12.2, 12.5, 14.12_

  - [ ] 6.4 Implement TechnicalSpecs component
    - Create `TechnicalSpecs.jsx` and `TechnicalSpecs.css`
    - Grid/table layout with Lucide icons per category
    - Display: resolusi foto, format output, standar (ISO/SNI), peralatan minimum, kondisi cuaca, jam operasional
    - Label left, value right layout for easy scanning
    - Visible for both roles
    - Use Viewport_Trigger for render/animation on scroll
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 12.2_

- [ ] 7. Checkpoint - Core sections implemented
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement Bidding Section (role-aware)
  - [ ] 8.1 Implement BiddingSection container and BidTable (Client view)
    - Create `BiddingSection.jsx`, `BiddingSection.css`, `BidTable.jsx`, `BidTable.css`
    - BiddingSection: conditional rendering based on role and status
    - Client view: render BidTable with columns — Avatar, Nama Pilot, Badge SIAGA Verified, Rating (stars + numeric), Harga Bid (Rupiah), Estimasi Hari, Drone Type, Aksi
    - Row hover: highlight `--color-accent` at 8% opacity
    - "Pilih Pilot" button per row opens PilotSelectionModal
    - "Lihat Profil" button per row opens PilotProfileDrawer
    - If status completed/closed: show "Bidding telah selesai untuk proyek ini" message
    - Responsive: table scrollable on tablet, card stack on mobile (<768px)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.10, 13.3, 13.5_

  - [ ] 8.2 Implement PilotSelectionModal
    - Create `PilotSelectionModal.jsx` and `PilotSelectionModal.css`
    - Display: pilot name + avatar, confirmation warning, "Batal" button, "Konfirmasi Pilihan" button
    - On confirm: close modal + show Toast "Pilot berhasil dipilih!"
    - Focus trap while open, Escape closes, returns focus to trigger button
    - _Requirements: 6.5, 6.6, 6.7, 14.7, 14.8_

  - [ ] 8.3 Implement PilotProfileDrawer
    - Create `PilotProfileDrawer.jsx` and `PilotProfileDrawer.css`
    - Slide from right side
    - Display: avatar large, nama pilot, badge SIAGA Verified, rating, drone owned, jumlah proyek selesai, area operasi
    - Focus management on open, Escape closes, overlay click closes
    - _Requirements: 6.8, 6.9, 14.9_

  - [ ] 8.4 Implement BidForm (Pilot view)
    - Create `BidForm.jsx` and `BidForm.css`
    - Fields: Harga Penawaran (Rp) number, Estimasi Hari number, Catatan Teknis textarea (optional), Drone dropdown
    - Submit button with gradient `--color-accent`
    - Validation using `validateBidForm`: show inline errors per field
    - Each input has `<label htmlFor>`, errors use `aria-describedby` + `aria-invalid="true"`
    - Submit flow: validate → loading 800ms → save to sessionStorage → Toast → replace with BidSummaryCard → update hero CTA
    - Double-submit prevention: button disabled + spinner while submitting
    - Disabled state when deadline passed with message "Proyek sudah melewati deadline, bidding tidak tersedia"
    - _Requirements: 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10, 7.13, 14.5, 14.6, 15.8_

  - [ ] 8.5 Implement BidSummaryCard and Pilot bidding info
    - Create `BidSummaryCard.jsx`
    - Display summary of submitted bid with "Bid Terkirim" badge
    - Show "[N] pilot sudah mengajukan bid" info (from `jumlah_bidder`)
    - Never show bid prices/names/details of other pilots
    - Show "Bidding telah ditutup" message when status completed/closed
    - _Requirements: 7.1, 7.2, 7.9, 7.11, 7.12, 7.14_

- [ ] 9. Implement pilot-only sections
  - [ ] 9.1 Implement ClientInfoSection (Pilot only)
    - Create `ClientInfoSection.jsx` and `ClientInfoSection.css`
    - Card with: nama perusahaan, rating (stars), jumlah proyek selesai, member since (year), badge "Verified Company"
    - Style: `--color-surface` background, consistent border radius
    - Only rendered when role === 'pilot'
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ] 9.2 Implement RelatedProjects section (Pilot only)
    - Create `RelatedProjects.jsx` and `RelatedProjects.css`
    - Use `getRelatedProjects` to get max 3 related projects
    - Card style: glassmorphism dark panel, hover glow cyan (consistent with Job Radar Mission Cards)
    - Each card shows: nama, jenis infrastruktur, lokasi, nilai kontrak compact (Rupiah), status badge
    - Click navigates to `/project/:otherId`
    - Only rendered when role === 'pilot'
    - Responsive: grid on desktop/tablet, stacked vertical on mobile
    - Use Viewport_Trigger for animation on scroll
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 12.2, 13.6_

- [ ] 10. Checkpoint - All sections implemented
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Wiring, responsive, accessibility, and visual polish
  - [ ] 11.1 Wire all components together in ProjectDetailPage
    - Assemble all components in correct order in `ProjectDetailPage.jsx`
    - Connect state management: bid form handlers, modal/drawer open/close, toast triggers
    - Implement scroll-to-section for CTA buttons (smooth scroll to Bidding_Section)
    - Ensure Viewport_Trigger (Intersection Observer) is applied to below-fold sections
    - Ensure only BiddingSection re-renders when bid state changes (avoid unnecessary re-renders)
    - Verify navigation from Job Radar "Lihat Detail" and Client Dashboard links work correctly
    - _Requirements: 1.4, 1.7, 11.7, 12.2, 12.3, 12.6, 15.6_

  - [ ] 11.2 Implement responsive behavior across all breakpoints
    - Desktop >= 1280px: full-width layout, sections stacked vertically, Bid_Table as table
    - Tablet 768px-1279px: map 300px, Bid_Table horizontally scrollable, reduced padding
    - Mobile < 768px: map 250px, Bid_Table → card stack, Related Projects stacked, timeline compact
    - Ensure no horizontal scroll at any viewport >= 320px
    - Breadcrumb readable on all breakpoints
    - Hero section adjusts padding/font on mobile
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9_

  - [ ] 11.3 Implement accessibility requirements
    - Semantic HTML: `<main>`, `<section>`, `<nav>`, `<h1>`, `<h2>` structure
    - Breadcrumb: `<nav aria-label="Breadcrumb">`
    - Status badge: `aria-label` with descriptive status
    - Map: `aria-label="Peta area inspeksi proyek"`, `role="img"` fallback
    - Bid form: all inputs have `<label htmlFor>`, errors use `aria-describedby` + `aria-invalid`
    - Modal: focus trap, Escape closes, returns focus to trigger
    - Drawer: focus management, Escape closes
    - Toast: `aria-live="polite"`
    - Timeline: `aria-label` describing progress
    - Visible focus indicator `--color-accent` on all interactive elements
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8, 14.9, 14.10, 14.11, 14.12_

  - [ ] 11.4 Apply visual consistency and brand polish
    - Verify all colors use Design_Tokens only (no new colors/fonts)
    - Font Montserrat for headings, Inter for body/labels/inputs
    - `--color-accent` for highlights, buttons, badges, focus states
    - Glassmorphism cards consistent with Client Dashboard and Job Radar
    - Hover effects: translateY -4px to -8px, transition 150ms-300ms
    - Custom scrollbar cyan (existing)
    - Page transition fade + slide-up on mount (300ms-600ms)
    - Custom cursor cyan maintained
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7, 1.8, 1.9, 1.10_

- [ ] 12. Final checkpoint - Full integration verified
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- The pure logic layer (`project-logic.js`) is the primary PBT target — UI components are tested via example-based integration tests
- Reuse `formatRupiah` and `formatCompactRupiah` from Job Radar `filters.js`
- Reuse `PageTransition` wrapper and `CustomCursor` (already global)
- `ProtectedRoute` may need update to support multi-role access
- Bid state persists in sessionStorage keyed as `siaga_bid_{projectId}`

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["1.3"] },
    { "id": 3, "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "2.7", "2.8", "2.9", "2.10"] },
    { "id": 4, "tasks": ["4.1", "4.3", "5.1"] },
    { "id": 5, "tasks": ["4.2", "5.2"] },
    { "id": 6, "tasks": ["6.1", "6.2", "6.3", "6.4"] },
    { "id": 7, "tasks": ["8.1", "8.4", "8.5"] },
    { "id": 8, "tasks": ["8.2", "8.3", "9.1", "9.2"] },
    { "id": 9, "tasks": ["11.1"] },
    { "id": 10, "tasks": ["11.2", "11.3", "11.4"] }
  ]
}
```
