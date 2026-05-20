# Implementation Plan: Project Detail Page

## Overview

Implementasi fitur **project-detail-page** dilakukan secara incremental, tetapi dengan prioritas utama pada **UI DESIGN dan UX premium**.

Halaman ini bukan sekadar halaman detail proyek biasa. Halaman ini harus terasa seperti:

```text
SIAGA Project Intelligence Briefing
```

atau secara visual:

```text
Premium Project Intelligence Briefing Dashboard
```

Target visual:

```text
premium, informatif, role-aware, glassmorphism, clean, aerospace-tech, soft-blue, dark-cyan accent, modern, professional, dan selaras dengan Landing Page, Job Radar Page, Client Dashboard, Login, dan Register SIAGA.
```

Urutan implementasi:

```text
folder structure + route setup
→ extended mock data module
→ pure logic layer
→ property/unit tests
→ ProjectDetailPage shell
→ global page background + visual foundation
→ Breadcrumb
→ Project Briefing Hero
→ Briefing Summary Cards
→ Sticky Section Navigator
→ Mission Scope Card
→ Premium Inspection Area Stage
→ Glass Project Timeline
→ Bid Intelligence Panel / Bid Command Panel
→ Spec Matrix
→ Verified Client Card
→ Related Mission Cards
→ Sticky Bottom CTA
→ Toast / NotFound / Error State
→ responsive UI polish
→ accessibility polish
→ final visual consistency pass
→ final QA
```

Stack:

```text
React 19 + Vite + react-router-dom + Framer Motion + Mapbox GL JS + Lucide React + fast-check + Vitest
```

Core principles:

- `project-detail-data.js` extends Job Radar `mock-data.js`.
- `project-logic.js` contains pure functions that are testable.
- `InspectionAreaMap` must be lazy-loaded using `React.lazy()` + `Suspense`.
- Hero, Summary, and Scope must render before Mapbox finishes loading.
- One page supports two roles: Client and Pilot.
- Pilot must never see competitor bid prices, competitor names, or competitor bid details.
- UI must be premium and cohesive with the SIAGA ecosystem.
- Bid state is saved in sessionStorage using key `siaga_bid_{projectId}`.
- Mobile must be intentionally designed, not desktop squeezed into a small screen.
- No horizontal overflow at viewport 320px and above.

---

## Tasks

---

- [ ] 1. Setup project structure, route, and foundation files

  - [ ] 1.1 Create ProjectDetail folder structure

    Create folder:

    ```text
    src/pages/ProjectDetail/
    ```

    Create files:

    ```text
    src/pages/ProjectDetail/ProjectDetailPage.jsx
    src/pages/ProjectDetail/ProjectDetailPage.css
    src/pages/ProjectDetail/project-detail-data.js
    src/pages/ProjectDetail/project-logic.js
    ```

    Create test folder:

    ```text
    src/pages/ProjectDetail/__tests__/
    ```

    Create test files:

    ```text
    project-logic.property.test.js
    project-detail.unit.test.js
    project-detail.integration.test.jsx
    project-detail.a11y.test.jsx
    ```

    _Requirements: 1, 2, 15_

  - [ ] 1.2 Create component folder structure

    Create folders and files:

    ```text
    src/pages/ProjectDetail/components/Breadcrumb/
    ├── Breadcrumb.jsx
    └── Breadcrumb.css

    src/pages/ProjectDetail/components/ProjectHero/
    ├── ProjectHero.jsx
    └── ProjectHero.css

    src/pages/ProjectDetail/components/BriefingSummaryCards/
    ├── BriefingSummaryCards.jsx
    └── BriefingSummaryCards.css

    src/pages/ProjectDetail/components/StickySectionNavigator/
    ├── StickySectionNavigator.jsx
    └── StickySectionNavigator.css

    src/pages/ProjectDetail/components/ProjectScope/
    ├── ProjectScope.jsx
    └── ProjectScope.css

    src/pages/ProjectDetail/components/InspectionAreaMap/
    ├── index.js
    ├── InspectionAreaMap.jsx
    ├── InspectionAreaMap.css
    ├── MapLoadingFallback.jsx
    └── MapErrorFallback.jsx

    src/pages/ProjectDetail/components/ProjectTimeline/
    ├── ProjectTimeline.jsx
    └── ProjectTimeline.css

    src/pages/ProjectDetail/components/BiddingSection/
    ├── BiddingSection.jsx
    ├── BiddingSection.css
    ├── BidIntelligencePanel.jsx
    ├── BidTable.jsx
    ├── BidTable.css
    ├── BidCardMobile.jsx
    ├── BidCommandPanel.jsx
    ├── BidForm.jsx
    ├── BidForm.css
    ├── BidSummaryCard.jsx
    ├── PilotSelectionModal.jsx
    ├── PilotSelectionModal.css
    ├── PilotProfileDrawer.jsx
    └── PilotProfileDrawer.css

    src/pages/ProjectDetail/components/TechnicalSpecs/
    ├── TechnicalSpecs.jsx
    └── TechnicalSpecs.css

    src/pages/ProjectDetail/components/ClientInfoSection/
    ├── ClientInfoSection.jsx
    └── ClientInfoSection.css

    src/pages/ProjectDetail/components/RelatedProjects/
    ├── RelatedProjects.jsx
    └── RelatedProjects.css

    src/pages/ProjectDetail/components/StickyBottomCTA/
    ├── StickyBottomCTA.jsx
    └── StickyBottomCTA.css

    src/pages/ProjectDetail/components/NotFoundState/
    ├── NotFoundState.jsx
    └── NotFoundState.css

    src/pages/ProjectDetail/components/ToastNotification/
    ├── ToastNotification.jsx
    └── ToastNotification.css
    ```

    _Requirements: 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14_

  - [ ] 1.3 Register route `/project/:projectId`

    - Add route in `App.jsx`.
    - Route path:

      ```text
      /project/:projectId
      ```

    - Wrap with `ProtectedRoute`.
    - Route must allow both roles:
      - `client`
      - `pilot`

    - If current `ProtectedRoute` only supports single role, update it carefully to support:
      - `requestedRole={["client", "pilot"]}`
      - or equivalent safe multi-role mode.

    - Do not break existing routes.
    - Wrap route with `PageTransition`.

    Example target:

    ```jsx
    <ProtectedRoute requestedRole={["client", "pilot"]}>
      <PageTransition routeKey="project-detail">
        <ProjectDetailPage />
      </PageTransition>
    </ProtectedRoute>
    ```

    _Requirements: 1_

  - [ ] 1.4 Ensure route integration does not break existing pages

    Verify:
    - Landing Page still works.
    - Job Radar Page still works.
    - Client Dashboard still works.
    - Login/Register still works.
    - ProtectedRoute existing behavior remains correct.

    _Requirements: 1, 19_

---

- [ ] 2. Create extended mock data module

  - [ ] 2.1 Implement `project-detail-data.js`

    Import base Job Radar data from:

    ```text
    src/pages/JobRadar/mock-data.js
    ```

    Extend project entries with detail fields:

    ```js
    {
      luas_area,
      jumlah_titik_inspeksi,
      deliverables,
      spesifikasi_teknis,
      polygon_area,
      titik_inspeksi,
      milestones,
      client_info,
      bids
    }
    ```

    Required behavior:
    - `id` is used as `projectId`.
    - `jumlah_bidder` must be consistent with `bids.length`.
    - `polygon_area` must contain at least 3 coordinate pairs.
    - `titik_inspeksi` must contain objects with `lat`, `lng`, and `label`.
    - Coordinates must be inside Indonesia bounds:
      - lat: -11 to 6
      - lng: 95 to 141

    _Requirements: 15_

  - [ ] 2.2 Add realistic demo data for UI richness

    Add enough data to make the page visually impressive:
    - 4–6 detailed projects minimum.
    - Varied status:
      - `open`
      - `urgent`
      - `deadline_dekat`
      - `in_progress`
      - `completed`
      - `closed`
    - Varied infrastructure:
      - SUTET
      - Jembatan
      - Kilang
      - Solar Panel
      - Bendungan
      - Tower
    - Each project should have meaningful:
      - description,
      - deliverables,
      - technical specs,
      - milestones,
      - client info,
      - bid entries.

    _Requirements: 15, 20_

  - [ ] 2.3 Add client info data

    Each detailed project should include:

    ```js
    client_info: {
      nama,
      rating,
      proyek_selesai,
      member_since,
      verified
    }
    ```

    This will be used for Pilot-only Verified Client Card.

    _Requirements: 14, 15_

  - [ ] 2.4 Add bid data for client view

    Each project with active bidding should include several bids:

    ```js
    bids: [
      {
        id,
        pilot_id,
        pilot_nama,
        pilot_avatar,
        pilot_verified,
        pilot_rating,
        harga_bid,
        estimasi_hari,
        drone_type,
        catatan
      }
    ]
    ```

    Data should be rich enough to showcase:
    - verified pilot,
    - rating,
    - bid price,
    - estimation,
    - drone type,
    - pilot profile drawer.

    _Requirements: 9, 10, 15_

  - [ ] 2.5 Ensure pilot privacy support

    Keep bid data in source, but UI/logic must ensure:
    - Client can see bid table.
    - Pilot cannot see competitor names.
    - Pilot cannot see competitor prices.
    - Pilot cannot see competitor bid details.

    _Requirements: 11, 15_

---

- [ ] 3. Implement pure logic layer in `project-logic.js`

  - [ ] 3.1 Implement core lookup and status functions

    Export:

    ```js
    getProjectById(projects, projectId)
    getProjectStatus(project, today = new Date())
    isDeadlinePassed(deadline, today = new Date())
    getStatusBadgeVisual(status)
    ```

    Rules:
    - Invalid projectId returns `null`.
    - If deadline has passed and status is `open`, derived status becomes `expired`.
    - Status visual mapping must be deterministic.

    _Requirements: 1, 3, 19_

  - [ ] 3.2 Implement role visibility logic

    Export:

    ```js
    getRoleVisibility(role, projectStatus, hasBid)
    getHeroCTA(role, projectStatus, hasBid)
    getDashboardPath(role)
    ```

    Rules:
    - Client can see contract value and bid table.
    - Pilot can see bid form, client info, and related projects.
    - Pilot never sees bid table.
    - Pilot never sees competitor prices.
    - CTA must be role-aware.

    _Requirements: 1, 3, 9, 11, 14_

  - [ ] 3.3 Implement bid form validation

    Export:

    ```js
    validateBidForm(formData)
    ```

    Valid iff:
    - `harga > 0`
    - `estimasiHari > 0`

    Error messages:
    - `Harga penawaran wajib diisi`
    - `Estimasi hari wajib diisi`

    _Requirements: 12_

  - [ ] 3.4 Implement related projects logic

    Export:

    ```js
    getRelatedProjects(currentProject, allProjects)
    ```

    Rules:
    - Exclude current project.
    - Prioritize same infrastructure type.
    - Fallback same province.
    - Max 3 projects.

    _Requirements: 14_

  - [ ] 3.5 Implement formatting helpers

    Export:

    ```js
    formatTanggalIndonesia(dateString)
    formatRupiah(value)
    formatCompactRupiah(value)
    ```

    Reuse existing formatter from Job Radar if already available and safe.

    _Requirements: 3, 9, 12, 14_

  - [ ] 3.6 Implement UI helper logic

    Export:

    ```js
    getBriefingSummary(project, role)
    getBidIntelligenceMetrics(project)
    isMilestoneConsistent(projectStatus, milestones)
    ```

    `getBidIntelligenceMetrics()` should return:
    - total penawaran,
    - SIAGA verified count,
    - harga terendah,
    - estimasi tercepat,
    - rating tertinggi.

    _Requirements: 4, 8, 9_

---

- [ ] 4. Write tests for pure logic

  - [ ] 4.1 Property test: project lookup is total and correct

    File:

    ```text
    src/pages/ProjectDetail/__tests__/project-logic.property.test.js
    ```

    Assert:
    - valid id returns correct project.
    - invalid id returns null.

    _Requirements: 1, 15_

  - [ ] 4.2 Property test: status badge visual mapping

    Test all statuses:

    ```text
    open
    urgent
    deadline_dekat
    in_progress
    completed
    closed
    expired
    ```

    Assert:
    - output exists,
    - deterministic,
    - has label/color/cssClass.

    _Requirements: 3, 8_

  - [ ] 4.3 Property test: role-aware data isolation

    Assert for role `pilot`:
    - `showBidTable === false`
    - competitor prices are not exposed through visibility config.
    - competitor names are not exposed through pilot view config.

    _Requirements: 11_

  - [ ] 4.4 Property test: role visibility exhaustive

    Test all combinations:

    ```text
    role × projectStatus × hasBid
    ```

    Assert all combinations return complete visibility object.

    _Requirements: 1, 3, 9, 11, 14_

  - [ ] 4.5 Property test: expired status handling

    If:

    ```text
    deadline < today AND status === open
    ```

    then status must be:

    ```text
    expired
    ```

    _Requirements: 3, 19_

  - [ ] 4.6 Property test: bid form validation

    Assert:
    - valid iff `harga > 0` and `estimasiHari > 0`.
    - invalid inputs return correct errors.

    _Requirements: 12_

  - [ ] 4.7 Property test: related project filtering

    Assert:
    - current project excluded.
    - max 3 results.
    - same infrastructure prioritized.
    - same province fallback works.

    _Requirements: 14_

  - [ ] 4.8 Property test: hero CTA deterministic

    For the same role/status/hasBid, CTA config must always be the same.

    _Requirements: 3_

  - [ ] 4.9 Property test: milestone consistency

    If derived status is `in_progress`, at least one milestone should be `in_progress`.

    _Requirements: 8_

  - [ ] 4.10 Property test: mock data schema validation

    Validate actual mock data:
    - required fields exist,
    - coordinates valid,
    - polygon valid,
    - bids valid,
    - milestones valid,
    - client info valid.

    _Requirements: 15_

---

- [ ] 5. Implement ProjectDetailPage shell and state management

  - [ ] 5.1 Implement base page shell

    File:

    ```text
    src/pages/ProjectDetail/ProjectDetailPage.jsx
    ```

    Responsibilities:
    - read `projectId` from `useParams()`.
    - read `role` from auth context.
    - load project from `project-detail-data.js`.
    - compute derived status.
    - compute role visibility.
    - compute hero CTA.
    - compute related projects.
    - read bid state from sessionStorage.
    - reset local state when `projectId` changes.

    _Requirements: 1, 15, 19_

  - [ ] 5.2 Implement state variables

    Required state:
    - `project`
    - `derivedStatus`
    - `roleVisibility`
    - `hasBid`
    - `submittedBid`
    - `bidFormData`
    - `bidFormErrors`
    - `isBidSubmitting`
    - `selectedPilotId`
    - `isSelectionModalOpen`
    - `isProfileDrawerOpen`
    - `drawerPilotId`
    - `toastMessage`
    - `activeSectionId`

    _Requirements: 1, 3, 5, 9, 10, 11, 12_

  - [ ] 5.3 Implement page-level error boundary

    If unexpected error happens:
    - show generic glass error card,
    - message clear,
    - button `Muat Ulang`.

    _Requirements: 19_

  - [ ] 5.4 Implement NotFoundState routing branch

    If project not found:
    - render NotFoundState.
    - do not render rest of page.
    - button returns to role dashboard.

    _Requirements: 1, 19_

  - [ ] 5.5 Implement global layout order

    Target render order:

    ```text
    Breadcrumb
    ProjectHero
    BriefingSummaryCards
    StickySectionNavigator
    ProjectScope
    InspectionAreaMap
    ProjectTimeline
    BiddingSection
    TechnicalSpecs
    ClientInfoSection
    RelatedProjects
    StickyBottomCTA
    ToastNotification
    ```

    Client-only / Pilot-only sections must respect role visibility.

    _Requirements: 1–20_

---

- [ ] 6. Implement premium page foundation CSS

  - [ ] 6.1 Implement `ProjectDetailPage.css`

    The page must use soft premium SIAGA background:

    ```css
    background:
      radial-gradient(circle at 12% 0%, rgba(16, 109, 255, 0.12), transparent 32%),
      radial-gradient(circle at 88% 12%, rgba(0, 210, 255, 0.10), transparent 28%),
      linear-gradient(135deg, #F4FAFF 0%, #EEF6FF 45%, #FFFFFF 100%);
    ```

    Add subtle grid pattern:
    - very low opacity,
    - no visual noise,
    - does not hurt readability.

    _Requirements: 2, 20_

  - [ ] 6.2 Implement content container

    Desktop:
    - max-width around 1180px–1280px.
    - centered.
    - padding top/bottom generous.
    - section gap 28px–40px.

    Mobile:
    - padding 16px–20px.
    - reduced gap.
    - no horizontal overflow.

    _Requirements: 2, 17_

  - [ ] 6.3 Add reusable visual utility classes if scoped

    If helpful inside ProjectDetail only, add:
    - `.project-detail-glass`
    - `.project-detail-section`
    - `.project-detail-card`
    - `.project-detail-pill`
    - `.project-detail-focus`

    Keep utilities scoped to ProjectDetail to avoid affecting other pages.

    _Requirements: 2, 20_

---

- [ ] 7. Implement Breadcrumb

  - [ ] 7.1 Create Breadcrumb component

    File:

    ```text
    components/Breadcrumb/Breadcrumb.jsx
    ```

    Content:

    ```text
    Dashboard > Proyek > [Nama Proyek]
    ```

    Dashboard link:
    - client → `/dashboard/client`
    - pilot → `/dashboard/pilot`

    _Requirements: 1, 18_

  - [ ] 7.2 Style Breadcrumb as premium glass pill

    File:

    ```text
    components/Breadcrumb/Breadcrumb.css
    ```

    Style:
    - glass white/soft blue.
    - rounded full or 18px.
    - compact.
    - readable.
    - current project name bold.
    - mobile truncation safe.

    _Requirements: 2, 3, 18_

---

- [ ] 8. Implement Project Briefing Hero

  - [ ] 8.1 Implement ProjectHero component

    File:

    ```text
    components/ProjectHero/ProjectHero.jsx
    ```

    Render:
    - status badge,
    - infrastructure badge,
    - H1 project name,
    - location,
    - deadline,
    - role-aware CTA,
    - contract value client-only,
    - hero summary area placeholder for summary panel if needed.

    _Requirements: 3_

  - [ ] 8.2 Style ProjectHero as premium briefing hero

    File:

    ```text
    components/ProjectHero/ProjectHero.css
    ```

    Style requirements:
    - large glass hero container.
    - soft blue/white gradient.
    - dark navy/cyan accent panel.
    - subtle radar/grid background.
    - rounded 32px.
    - strong shadow.
    - H1 visual impact.
    - CTA prominent.

    _Requirements: 2, 3, 20_

  - [ ] 8.3 Implement responsive hero layout

    Desktop:
    - split layout.
    - left: project identity.
    - right: briefing summary panel/cards.

    Tablet:
    - compact split or stacked.

    Mobile:
    - stacked.
    - H1 smaller.
    - CTA full-width if needed.
    - no horizontal overflow.

    _Requirements: 3, 17_

  - [ ] 8.4 Implement hero CTA behavior

    CTA actions:
    - `Bid Sekarang` → scroll to Bidding Section.
    - `Lihat Bidding` → scroll to Bidding Section.
    - `Generate Report` → placeholder toast unless report exists.
    - `Bid Terkirim ✓` → disabled.

    _Requirements: 3, 12_

---

- [ ] 9. Implement Briefing Summary Cards

  - [ ] 9.1 Create BriefingSummaryCards component

    File:

    ```text
    components/BriefingSummaryCards/BriefingSummaryCards.jsx
    ```

    Cards:
    - Deadline
    - Luas Area
    - Titik Inspeksi
    - Jumlah Bidder
    - Nilai Kontrak client-only
    - Status Bidding role-aware

    _Requirements: 4_

  - [ ] 9.2 Style Summary Cards as premium metric cards

    File:

    ```text
    components/BriefingSummaryCards/BriefingSummaryCards.css
    ```

    Style:
    - glass card.
    - icon container soft cyan.
    - label uppercase.
    - value prominent.
    - micro helper text.
    - soft hover lift.
    - no flat plain boxes.

    _Requirements: 2, 4, 20_

  - [ ] 9.3 Implement responsive summary grid

    Desktop:
    - inside hero right panel or compact grid.
    - 2x2 / 2x3 depending cards.

    Mobile:
    - 2 columns if enough width.
    - stack if too narrow.
    - no overflow at 320px.

    _Requirements: 4, 17_

---

- [ ] 10. Implement Sticky Section Navigator

  - [ ] 10.1 Create StickySectionNavigator component

    File:

    ```text
    components/StickySectionNavigator/StickySectionNavigator.jsx
    ```

    Sections:
    - Overview
    - Area Inspeksi
    - Timeline
    - Bidding
    - Specs

    Optional for pilot:
    - Client
    - Related

    _Requirements: 5_

  - [ ] 10.2 Add smooth scroll behavior

    When nav item clicked:
    - smooth scroll to corresponding section id.
    - update active section.

    _Requirements: 5_

  - [ ] 10.3 Add Intersection Observer for active section

    Track active section while scrolling.

    _Requirements: 5, 16_

  - [ ] 10.4 Style as sticky glass pill navigation

    File:

    ```text
    components/StickySectionNavigator/StickySectionNavigator.css
    ```

    Desktop:
    - sticky near top.
    - glass pill container.
    - active item cyan/navy.

    Mobile:
    - horizontal scroll pills.
    - scrollbar hidden or subtle.
    - no horizontal page overflow.

    _Requirements: 2, 5, 17, 20_

---

- [ ] 11. Implement Mission Scope Card

  - [ ] 11.1 Create ProjectScope component

    File:

    ```text
    components/ProjectScope/ProjectScope.jsx
    ```

    Content:
    - full description,
    - infrastructure type + icon,
    - luas area,
    - jumlah titik inspeksi,
    - deliverables chips,
    - key requirements preview.

    _Requirements: 6_

  - [ ] 11.2 Style ProjectScope as Mission Scope Card

    File:

    ```text
    components/ProjectScope/ProjectScope.css
    ```

    Style:
    - glass section card.
    - two-column desktop.
    - left: description + deliverables.
    - right: key requirements.
    - chips soft cyan.
    - icon metadata cards.
    - premium spacing.

    _Requirements: 2, 6, 20_

  - [ ] 11.3 Mobile ProjectScope layout

    Mobile:
    - stack content.
    - deliverables wrap.
    - key requirement cards full width.
    - no horizontal overflow.

    _Requirements: 6, 17_

---

- [ ] 12. Implement Premium Inspection Area Stage

  - [ ] 12.1 Implement lazy export

    File:

    ```text
    components/InspectionAreaMap/index.js
    ```

    Default export `InspectionAreaMap`.

    _Requirements: 7, 16_

  - [ ] 12.2 Implement InspectionAreaMap component

    File:

    ```text
    components/InspectionAreaMap/InspectionAreaMap.jsx
    ```

    Use Mapbox GL JS:
    - token from `import.meta.env.VITE_MAPBOX_TOKEN`.
    - style `mapbox://styles/mapbox/dark-v11`.
    - render polygon area.
    - render inspection point markers.
    - fit bounds to polygon.

    _Requirements: 7_

  - [ ] 12.3 Style InspectionAreaMap as Premium Inspection Area Stage

    File:

    ```text
    components/InspectionAreaMap/InspectionAreaMap.css
    ```

    Add:
    - outer glass card.
    - section header.
    - subtitle.
    - floating stat chips.
    - floating legend.
    - rounded map container.
    - cyan polygon glow.
    - coordinate strip.

    _Requirements: 2, 7, 20_

  - [ ] 12.4 Implement MapLoadingFallback

    File:

    ```text
    components/InspectionAreaMap/MapLoadingFallback.jsx
    ```

    Style:
    - dark navy card.
    - subtle radar grid.
    - cyan spinner.
    - text `Memuat peta area inspeksi…`.
    - same height as map container to prevent layout shift.

    _Requirements: 7, 16_

  - [ ] 12.5 Implement MapErrorFallback

    File:

    ```text
    components/InspectionAreaMap/MapErrorFallback.jsx
    ```

    Content:
    - `Peta tidak tersedia`.
    - friendly message.
    - coordinate list fallback.
    - no page crash.

    _Requirements: 7, 19_

  - [ ] 12.6 Implement responsive map heights

    - Desktop: around 420px.
    - Tablet: 300px–320px.
    - Mobile: around 250px.

    _Requirements: 7, 17_

---

- [ ] 13. Implement Glass Project Timeline

  - [ ] 13.1 Create ProjectTimeline component

    File:

    ```text
    components/ProjectTimeline/ProjectTimeline.jsx
    ```

    Milestones:
    - Posted
    - Bidding Open
    - Pilot Selected
    - Inspection In Progress
    - Report Ready

    _Requirements: 8_

  - [ ] 13.2 Style timeline as glass timeline card

    File:

    ```text
    components/ProjectTimeline/ProjectTimeline.css
    ```

    Desktop:
    - horizontal timeline.
    - completed: green/teal.
    - active: cyan glow + pulse.
    - upcoming: muted glass.
    - connector line shows progress.

    Mobile:
    - vertical timeline.
    - no horizontal overflow.

    _Requirements: 2, 8, 17, 20_

  - [ ] 13.3 Add timeline animation

    - Use transform/opacity.
    - Optional viewport trigger.
    - Avoid scroll jank.

    _Requirements: 8, 16_

---

- [ ] 14. Implement Bidding Section container

  - [ ] 14.1 Create BiddingSection component

    File:

    ```text
    components/BiddingSection/BiddingSection.jsx
    ```

    Conditional rendering:
    - Client → Bid Intelligence Panel.
    - Pilot → Bid Command Panel.
    - Closed/completed/expired → closed state.

    _Requirements: 9, 11, 12_

  - [ ] 14.2 Style BiddingSection as premium decision area

    File:

    ```text
    components/BiddingSection/BiddingSection.css
    ```

    Visual:
    - full-width glass section.
    - strong section heading.
    - dark/cyan accent.
    - high visual hierarchy.
    - no generic table/form look.

    _Requirements: 2, 9, 11, 20_

---

- [ ] 15. Implement Client View: Bid Intelligence Panel

  - [ ] 15.1 Create BidIntelligencePanel component

    File:

    ```text
    components/BiddingSection/BidIntelligencePanel.jsx
    ```

    Render:
    - title `Bid Intelligence`.
    - subtitle.
    - summary metric cards:
      - Total Penawaran
      - SIAGA Verified
      - Harga Terendah
      - Estimasi Tercepat
      - Rating Tertinggi

    _Requirements: 9_

  - [ ] 15.2 Implement BidTable desktop

    Files:

    ```text
    components/BiddingSection/BidTable.jsx
    components/BiddingSection/BidTable.css
    ```

    Columns:
    - Avatar
    - Nama Pilot
    - SIAGA Verified
    - Rating
    - Harga Bid
    - Estimasi Hari
    - Drone Type
    - Aksi

    Actions:
    - `Pilih Pilot`
    - `Lihat Profil`

    _Requirements: 9, 10_

  - [ ] 15.3 Style BidTable as premium table

    Table style:
    - glass wrapper.
    - muted header.
    - card-like rows.
    - hover cyan tint.
    - verified badge premium.
    - price bold.
    - CTA buttons clear.
    - not generic admin table.

    _Requirements: 9, 20_

  - [ ] 15.4 Implement BidCardMobile

    File:

    ```text
    components/BiddingSection/BidCardMobile.jsx
    ```

    Mobile card content:
    - pilot name,
    - verified badge,
    - rating,
    - price,
    - estimation,
    - drone type,
    - actions.

    Use card stack instead of horizontal table.

    _Requirements: 9, 17_

---

- [ ] 16. Implement Pilot Selection Modal and Pilot Profile Drawer

  - [ ] 16.1 Create PilotSelectionModal

    Files:

    ```text
    components/BiddingSection/PilotSelectionModal.jsx
    components/BiddingSection/PilotSelectionModal.css
    ```

    Content:
    - pilot avatar,
    - pilot name,
    - confirmation warning,
    - `Batal`,
    - `Konfirmasi Pilihan`.

    _Requirements: 10_

  - [ ] 16.2 Style PilotSelectionModal

    Style:
    - centered glass modal.
    - soft cyan accent.
    - clear primary/secondary buttons.
    - premium, not default modal.

    _Requirements: 10, 20_

  - [ ] 16.3 Implement modal accessibility

    - focus trap.
    - Escape closes.
    - return focus to trigger after close.

    _Requirements: 18_

  - [ ] 16.4 Create PilotProfileDrawer

    Files:

    ```text
    components/BiddingSection/PilotProfileDrawer.jsx
    components/BiddingSection/PilotProfileDrawer.css
    ```

    Content:
    - large avatar,
    - pilot name,
    - SIAGA Verified badge,
    - rating,
    - drone owned,
    - completed projects,
    - operating area.

    _Requirements: 10_

  - [ ] 16.5 Style PilotProfileDrawer

    Desktop:
    - right-side drawer.
    - dark glass panel.
    - premium profile hero.

    Mobile:
    - bottom sheet.
    - readable and touch-friendly.

    _Requirements: 10, 17, 20_

---

- [ ] 17. Implement Pilot View: Bid Command Panel

  - [ ] 17.1 Create BidCommandPanel component

    File:

    ```text
    components/BiddingSection/BidCommandPanel.jsx
    ```

    Content:
    - competitor count.
    - deadline reminder.
    - main requirement summary.
    - BidForm if open.
    - BidSummaryCard if submitted.
    - closed message if unavailable.

    _Requirements: 11, 12_

  - [ ] 17.2 Ensure pilot privacy

    Confirm Pilot View never renders:
    - competitor bid prices,
    - competitor names,
    - competitor bid details,
    - BidTable.

    _Requirements: 11_

  - [ ] 17.3 Style BidCommandPanel

    Style:
    - glass command panel.
    - clear context.
    - CTA visually strong.
    - not generic form page.

    _Requirements: 11, 20_

---

- [ ] 18. Implement Bid Form and Bid Summary

  - [ ] 18.1 Create BidForm component

    Files:

    ```text
    components/BiddingSection/BidForm.jsx
    components/BiddingSection/BidForm.css
    ```

    Fields:
    - Harga Penawaran (Rp)
    - Estimasi Hari Pengerjaan
    - Drone yang akan digunakan
    - Catatan Teknis

    _Requirements: 12_

  - [ ] 18.2 Style BidForm as premium glass form

    Style:
    - labels clear.
    - glass inputs.
    - cyan focus ring.
    - inline validation.
    - submit button cyan-blue gradient.
    - comfortable spacing.

    _Requirements: 12, 20_

  - [ ] 18.3 Implement BidForm validation

    Use `validateBidForm`.

    Show:
    - `Harga penawaran wajib diisi`
    - `Estimasi hari wajib diisi`

    Add:
    - `aria-invalid`
    - `aria-describedby`

    _Requirements: 12, 18_

  - [ ] 18.4 Implement submit flow

    Flow:
    - validate.
    - loading 800ms.
    - prevent double submit.
    - save to sessionStorage.
    - show toast.
    - replace with BidSummaryCard.
    - update hero CTA.

    _Requirements: 12_

  - [ ] 18.5 Create BidSummaryCard

    File:

    ```text
    components/BiddingSection/BidSummaryCard.jsx
    ```

    Content:
    - badge `Bid Terkirim`.
    - submitted price.
    - estimation.
    - drone type.
    - technical note if available.
    - calm success message.

    _Requirements: 12_

  - [ ] 18.6 Style BidSummaryCard

    Style:
    - success accent.
    - glass card.
    - calm confirmation state.
    - not overdramatic.

    _Requirements: 12, 20_

---

- [ ] 19. Implement Technical Specs as Spec Matrix

  - [ ] 19.1 Create TechnicalSpecs component

    File:

    ```text
    components/TechnicalSpecs/TechnicalSpecs.jsx
    ```

    Render:
    - Resolusi Foto
    - Format Output
    - Standar
    - Peralatan Minimum
    - Kondisi Cuaca
    - Jam Operasional

    _Requirements: 13_

  - [ ] 19.2 Style TechnicalSpecs as Spec Matrix

    File:

    ```text
    components/TechnicalSpecs/TechnicalSpecs.css
    ```

    Style:
    - grid cards.
    - Lucide icons.
    - label + value.
    - glass border.
    - subtle hover.
    - no plain table.

    _Requirements: 13, 20_

  - [ ] 19.3 Implement responsive specs layout

    Desktop:
    - 2-column or 3-column grid.

    Mobile:
    - stacked cards.
    - optional accordion if content long.

    _Requirements: 13, 17_

---

- [ ] 20. Implement Pilot-only Client Info and Related Projects

  - [ ] 20.1 Create ClientInfoSection

    Files:

    ```text
    components/ClientInfoSection/ClientInfoSection.jsx
    components/ClientInfoSection/ClientInfoSection.css
    ```

    Visible only for Pilot.

    Content:
    - company name.
    - rating.
    - completed projects.
    - member since.
    - Verified Company badge.

    _Requirements: 14_

  - [ ] 20.2 Style ClientInfoSection as Verified Client Card

    Style:
    - glass card.
    - trust badge.
    - soft cyan/blue accent.
    - premium trust section.

    _Requirements: 14, 20_

  - [ ] 20.3 Create RelatedProjects component

    Files:

    ```text
    components/RelatedProjects/RelatedProjects.jsx
    components/RelatedProjects/RelatedProjects.css
    ```

    Visible only for Pilot.

    Render max 3 related project cards.

    _Requirements: 14_

  - [ ] 20.4 Style RelatedProjects as Related Mission Cards

    Cards should match Job Radar Mission Card language:
    - status badge.
    - infrastructure.
    - location.
    - compact value.
    - hover glow cyan.
    - click navigates to `/project/:otherId`.

    _Requirements: 14, 20_

  - [ ] 20.5 Implement responsive pilot-only sections

    Desktop:
    - Client Info and Related Projects can be 2-column.

    Mobile:
    - stacked.

    _Requirements: 14, 17_

---

- [ ] 21. Implement Sticky Bottom CTA for mobile

  - [ ] 21.1 Create StickyBottomCTA component

    Files:

    ```text
    components/StickyBottomCTA/StickyBottomCTA.jsx
    components/StickyBottomCTA/StickyBottomCTA.css
    ```

    Mobile-only.

    CTA examples:
    - Pilot: `Bid Sekarang`
    - Client: `Lihat Bidding`
    - Submitted: `Bid Terkirim ✓`

    _Requirements: 17_

  - [ ] 21.2 Style StickyBottomCTA

    Style:
    - glass bottom bar.
    - safe area padding.
    - cyan/blue CTA.
    - does not cover content awkwardly.
    - hidden when no action relevant.

    _Requirements: 17, 20_

---

- [ ] 22. Implement ToastNotification and NotFoundState

  - [ ] 22.1 Create ToastNotification

    Files:

    ```text
    components/ToastNotification/ToastNotification.jsx
    components/ToastNotification/ToastNotification.css
    ```

    Use for:
    - bid success.
    - pilot selected.
    - Generate Report placeholder.
    - mock error feedback.

    _Requirements: 12, 19_

  - [ ] 22.2 Style ToastNotification

    Style:
    - glass toast.
    - cyan/success accent.
    - rounded 18px–22px.
    - auto-dismiss 3–5 seconds.
    - `aria-live="polite"`.

    _Requirements: 18, 20_

  - [ ] 22.3 Create NotFoundState

    Files:

    ```text
    components/NotFoundState/NotFoundState.jsx
    components/NotFoundState/NotFoundState.css
    ```

    Content:
    - illustration/icon.
    - title `Proyek tidak ditemukan`.
    - description.
    - button `Kembali ke Dashboard`.

    _Requirements: 1, 19_

  - [ ] 22.4 Style NotFoundState

    Style:
    - centered glass card.
    - calm and premium.
    - no scary error design.
    - role-aware dashboard navigation.

    _Requirements: 19, 20_

---

- [ ] 23. Wire full interactions

  - [ ] 23.1 Wire Hero CTA scroll behavior

    - `Bid Sekarang` scrolls to Bidding Section.
    - `Lihat Bidding` scrolls to Bidding Section.
    - `Generate Report` shows toast placeholder.

    _Requirements: 3, 12_

  - [ ] 23.2 Wire StickySectionNavigator

    - Smooth scroll.
    - Active section tracking.
    - Mobile horizontal scroll.

    _Requirements: 5_

  - [ ] 23.3 Wire Client bidding actions

    - `Pilih Pilot` opens modal.
    - Confirm shows toast.
    - `Lihat Profil` opens drawer.
    - Drawer/modal close behavior works.

    _Requirements: 9, 10_

  - [ ] 23.4 Wire Pilot bid submit

    - Validate.
    - Loading state.
    - sessionStorage save.
    - toast.
    - BidSummaryCard.
    - Hero CTA update.

    _Requirements: 11, 12_

  - [ ] 23.5 Wire related project navigation

    - Clicking related card navigates to `/project/:otherId`.
    - State resets on projectId change.

    _Requirements: 14, 19_

---

- [ ] 24. Responsive UI implementation

  - [ ] 24.1 Desktop layout QA and CSS

    Desktop >=1280px:
    - Hero split layout.
    - Summary on right / compact grid.
    - sticky nav.
    - Map large.
    - Timeline horizontal.
    - BidTable desktop.
    - Specs matrix.
    - Client/Related section side-by-side if visible.

    _Requirements: 17, 20_

  - [ ] 24.2 Tablet layout QA and CSS

    Tablet 768px–1279px:
    - reduce padding.
    - hero compact.
    - summary cards 2-column.
    - sticky nav horizontal.
    - map 300px–320px.
    - bidding table scroll or card hybrid.
    - no overflow.

    _Requirements: 17_

  - [ ] 24.3 Mobile layout QA and CSS

    Mobile <768px:
    - hero stacked.
    - summary cards compact.
    - sticky nav horizontal pills.
    - map 250px.
    - timeline vertical.
    - BidTable becomes BidCardMobile.
    - BidForm full width.
    - specs stacked.
    - related projects stacked.
    - sticky bottom CTA safe.
    - no horizontal overflow at 320px.

    _Requirements: 17, 20_

  - [ ] 24.4 Test viewport widths

    Test manually:
    - 320px
    - 360px
    - 390px
    - 430px
    - 768px
    - 1024px
    - 1280px
    - 1440px

    _Requirements: 17, 20_

---

- [ ] 25. Accessibility implementation

  - [ ] 25.1 Semantic structure

    Ensure:
    - `<main>`
    - `<section>`
    - `<nav>`
    - `<h1>`
    - `<h2>`
    - `<h3>`

    _Requirements: 18_

  - [ ] 25.2 ARIA and labels

    Add:
    - Breadcrumb `aria-label="Breadcrumb"`.
    - status badge descriptive `aria-label`.
    - map `aria-label="Peta area inspeksi proyek"`.
    - timeline descriptive `aria-label`.
    - sticky section nav accessible labels.

    _Requirements: 18_

  - [ ] 25.3 Form accessibility

    BidForm:
    - labels connected with inputs.
    - errors use `aria-describedby`.
    - invalid fields use `aria-invalid`.

    _Requirements: 18_

  - [ ] 25.4 Modal/drawer accessibility

    Modal:
    - focus trap.
    - Escape closes.
    - return focus to trigger.

    Drawer:
    - focus management.
    - Escape closes.
    - overlay click closes.

    _Requirements: 18_

  - [ ] 25.5 Focus states

    Ensure all interactive elements have visible cyan focus state.

    _Requirements: 18, 20_

---

- [ ] 26. Error handling and edge cases

  - [ ] 26.1 Invalid projectId

    Show NotFoundState.

    _Requirements: 1, 19_

  - [ ] 26.2 Missing optional data

    Show fallback:

    ```text
    Tidak tersedia
    ```

    _Requirements: 19_

  - [ ] 26.3 Mapbox errors

    Show MapErrorFallback.
    Page must not crash.

    _Requirements: 7, 19_

  - [ ] 26.4 Bid submit mock failure

    Keep form visible.
    Show toast error.
    Prevent broken state.

    _Requirements: 12, 19_

  - [ ] 26.5 Expired deadline

    If deadline passed and status open:
    - derived status becomes expired.
    - Pilot BidForm disabled/unavailable.
    - Hero badge shows expired.

    _Requirements: 3, 11, 19_

  - [ ] 26.6 Related projects empty

    Hide section or show calm empty state.

    _Requirements: 14, 19_

---

- [ ] 27. UI/UX Premium Polish Wave

  - [ ] 27.1 Polish Project Briefing Hero

    Ensure hero:
    - has strong visual impact.
    - uses premium glass.
    - has clear role-aware CTA.
    - has status/infrastructure badges.
    - has subtle grid/radar effect.
    - does not feel like a normal detail header.

    _Requirements: 2, 3, 20_

  - [ ] 27.2 Polish Summary Cards

    Ensure:
    - compact.
    - informative.
    - icon-based.
    - not empty/flat.
    - responsive.

    _Requirements: 4, 20_

  - [ ] 27.3 Polish Sticky Section Navigator

    Ensure:
    - looks like premium glass nav.
    - active state obvious.
    - mobile horizontal scroll feels intentional.

    _Requirements: 5, 20_

  - [ ] 27.4 Polish Mission Scope Card

    Ensure:
    - description readable.
    - deliverables visible.
    - key requirements scannable.
    - card layout premium.

    _Requirements: 6, 20_

  - [ ] 27.5 Polish Inspection Area Stage

    Ensure:
    - not plain embedded map.
    - has floating legend.
    - has stat chips.
    - polygon/markers look premium.
    - loading fallback polished.

    _Requirements: 7, 20_

  - [ ] 27.6 Polish Timeline

    Ensure:
    - glass timeline card.
    - active milestone glow.
    - completed milestone teal/green.
    - mobile vertical clean.

    _Requirements: 8, 20_

  - [ ] 27.7 Polish Bid Intelligence Panel

    Ensure Client view:
    - decision-making feel.
    - summary metric cards.
    - premium bid table.
    - mobile bid cards.
    - modal/drawer polished.

    _Requirements: 9, 10, 20_

  - [ ] 27.8 Polish Bid Command Panel

    Ensure Pilot view:
    - professional bidding interface.
    - no competitor data leak.
    - clean form.
    - strong submit CTA.
    - calm bid summary.

    _Requirements: 11, 12, 20_

  - [ ] 27.9 Polish Spec Matrix

    Ensure:
    - no plain table.
    - icon cards.
    - clear labels.
    - responsive grid.

    _Requirements: 13, 20_

  - [ ] 27.10 Polish Client Info and Related Projects

    Ensure:
    - client trust card feels premium.
    - related project cards match Job Radar mission cards.
    - hover glow subtle.
    - mobile stacked.

    _Requirements: 14, 20_

  - [ ] 27.11 Polish mobile experience

    Ensure:
    - sticky CTA works.
    - no horizontal overflow.
    - table converted to cards.
    - forms readable.
    - nav usable.
    - map not too tall/short.

    _Requirements: 17, 20_

  - [ ] 27.12 Visual consistency pass

    Verify all sections:
    - match SIAGA Landing Page.
    - match Job Radar Page.
    - match Client Dashboard.
    - match Login/Register.
    - use Montserrat + Inter.
    - use glassmorphism.
    - use soft-blue/cyan/navy palette.
    - avoid random colors.
    - avoid generic admin design.

    _Requirements: 2, 20_

---

- [ ] 28. Testing and QA

  - [ ] 28.1 Run property tests

    Test:
    - project lookup.
    - status badge.
    - role isolation.
    - role visibility.
    - expired status.
    - bid validation.
    - related projects.
    - hero CTA.
    - milestone consistency.
    - mock data schema.

    _Requirements: 1, 3, 8, 11, 12, 14, 15, 19_

  - [ ] 28.2 Run unit tests

    Test:
    - formatTanggalIndonesia.
    - getDashboardPath.
    - validateBidForm.
    - getRelatedProjects edge cases.
    - sessionStorage bid read/write.
    - deadline boundary.

    _Requirements: 1, 12, 14, 19_

  - [ ] 28.3 Run integration tests

    Test:
    - valid route renders.
    - invalid id shows NotFoundState.
    - no session redirects login.
    - client sees BidTable.
    - pilot sees BidForm.
    - pilot does not see bid prices.
    - bid submit flow works.
    - modal opens.
    - drawer opens.
    - related navigation resets state.

    _Requirements: 1, 9, 10, 11, 12, 14, 19_

  - [ ] 28.4 Run accessibility tests

    Test:
    - no critical violations.
    - breadcrumb ARIA.
    - form labels.
    - modal focus trap.
    - drawer escape.
    - toast aria-live.
    - focus indicators.

    _Requirements: 18_

  - [ ] 28.5 Manual visual QA

    Check:
    - 320px
    - 360px
    - 390px
    - 430px
    - 768px
    - 1024px
    - 1280px
    - 1440px

    Verify:
    - no horizontal scroll.
    - hero readable.
    - summary cards not cramped.
    - sticky nav usable.
    - map responsive.
    - timeline readable.
    - BidTable becomes cards on mobile.
    - form readable.
    - sticky bottom CTA not blocking.
    - specs matrix responsive.
    - related cards stacked.
    - visual style consistent.

    _Requirements: 17, 20_

  - [ ] 28.6 Build test

    Run:
    - lint if available.
    - test if available.
    - production build.

    Fix:
    - missing imports.
    - broken CSS imports.
    - route errors.
    - build errors.
    - console fatal errors.

    _Requirements: All_

---

- [ ] 29. Final checkpoint

  - [ ] 29.1 Confirm functional completion

    Verify:
    - `/project/:projectId` works.
    - Client role works.
    - Pilot role works.
    - invalid id works.
    - Mapbox lazy loading works.
    - bid form works.
    - bid summary works.
    - client modal works.
    - pilot drawer works.
    - related navigation works.

  - [ ] 29.2 Confirm UI design completion

    Verify:
    - page feels like Project Intelligence Briefing.
    - hero is visually strong.
    - summary cards are premium.
    - map section is premium.
    - bidding section is decision-focused.
    - specs section is not table polos.
    - mobile is polished.
    - visual consistent with SIAGA ecosystem.

  - [ ] 29.3 Report summary in Indonesian

    Explain:
    - files created/changed.
    - components implemented.
    - how UI was improved.
    - how role-aware rendering works.
    - how data consistency is maintained.
    - how Mapbox lazy loading works.
    - how responsive behavior was handled.
    - tests/build result.
    - known limitations if any.

---

## Notes

- Prioritas utama spec ini adalah **UI DESIGN dan UX premium**.
- Jangan membuat halaman ini seperti detail page biasa.
- Jangan membuat Bidding Section seperti table admin polos.
- Jangan membuat Technical Specs sebagai table polos.
- Jangan menghilangkan privacy rule untuk Pilot.
- Jangan hardcode data di UI jika sudah ada di mock data.
- Jangan mengubah Landing Page, Job Radar Page, Client Dashboard, Login, atau Register kecuali benar-benar diperlukan untuk link/navigation.
- Jangan memperkenalkan warna/font baru yang tidak selaras dengan SIAGA.
- Gunakan glassmorphism, soft-blue, navy, cyan accent, rounded 24px–32px, dan shadow halus.
- Mobile harus dibuat intentional: card stack, sticky CTA, vertical timeline, bid cards.
- Mapbox harus lazy-loaded agar Hero/Summary/Scope tampil cepat.
- Bid state disimpan di sessionStorage dengan key `siaga_bid_{projectId}`.
- Pilot tidak boleh melihat harga bid kompetitor, nama kompetitor, atau detail bid kompetitor.

---

## Task Dependency Graph

```json
{
  "waves": [
    {
      "id": 0,
      "name": "Foundation",
      "tasks": ["1.1", "1.2", "1.3", "1.4"]
    },
    {
      "id": 1,
      "name": "Data and Logic",
      "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5", "3.1", "3.2", "3.3", "3.4", "3.5", "3.6"]
    },
    {
      "id": 2,
      "name": "Logic Tests",
      "tasks": ["4.1", "4.2", "4.3", "4.4", "4.5", "4.6", "4.7", "4.8", "4.9", "4.10"]
    },
    {
      "id": 3,
      "name": "Page Shell and Visual Foundation",
      "tasks": ["5.1", "5.2", "5.3", "5.4", "5.5", "6.1", "6.2", "6.3"]
    },
    {
      "id": 4,
      "name": "Top Experience",
      "tasks": ["7.1", "7.2", "8.1", "8.2", "8.3", "8.4", "9.1", "9.2", "9.3", "10.1", "10.2", "10.3", "10.4"]
    },
    {
      "id": 5,
      "name": "Core Content",
      "tasks": ["11.1", "11.2", "11.3", "12.1", "12.2", "12.3", "12.4", "12.5", "12.6", "13.1", "13.2", "13.3"]
    },
    {
      "id": 6,
      "name": "Bidding Experience",
      "tasks": ["14.1", "14.2", "15.1", "15.2", "15.3", "15.4", "16.1", "16.2", "16.3", "16.4", "16.5", "17.1", "17.2", "17.3", "18.1", "18.2", "18.3", "18.4", "18.5", "18.6"]
    },
    {
      "id": 7,
      "name": "Supporting Sections",
      "tasks": ["19.1", "19.2", "19.3", "20.1", "20.2", "20.3", "20.4", "20.5", "21.1", "21.2", "22.1", "22.2", "22.3", "22.4"]
    },
    {
      "id": 8,
      "name": "Interaction Wiring",
      "tasks": ["23.1", "23.2", "23.3", "23.4", "23.5"]
    },
    {
      "id": 9,
      "name": "Responsive and Accessibility",
      "tasks": ["24.1", "24.2", "24.3", "24.4", "25.1", "25.2", "25.3", "25.4", "25.5"]
    },
    {
      "id": 10,
      "name": "Error Handling",
      "tasks": ["26.1", "26.2", "26.3", "26.4", "26.5", "26.6"]
    },
    {
      "id": 11,
      "name": "UI/UX Premium Polish Wave",
      "tasks": ["27.1", "27.2", "27.3", "27.4", "27.5", "27.6", "27.7", "27.8", "27.9", "27.10", "27.11", "27.12"]
    },
    {
      "id": 12,
      "name": "Final QA",
      "tasks": ["28.1", "28.2", "28.3", "28.4", "28.5", "28.6", "29.1", "29.2", "29.3"]
    }
  ]
}
```

---

## MVP Fast Path

Jika ingin demo cepat, jalankan minimal:

```text
1 → 2 → 3 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14 → 15 → 17 → 18 → 19 → 21 → 22 → 23 → 24 → 27 → 28.5 → 28.6
```

Prioritas visual tertinggi:

```text
1. Project Briefing Hero
2. Briefing Summary Cards
3. Sticky Section Navigator
4. Mission Scope Card
5. Premium Inspection Area Stage
6. Glass Timeline
7. Bid Intelligence Panel
8. Bid Command Panel
9. Spec Matrix
10. Mobile Sticky CTA
11. Responsive polish
12. Visual consistency pass
```

---

## Final Direction

```text
Project Detail Page harus terasa seperti briefing intelijen proyek inspeksi drone:
premium, informatif, role-aware, glassmorphism, smooth, modern, dan sangat selaras dengan ekosistem SIAGA.
```