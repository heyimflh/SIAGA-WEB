# Requirements Document

## Introduction

Fitur **project-detail-page** menambahkan halaman detail proyek pada route:

```text
/project/:projectId
```

Halaman ini dapat diakses oleh dua persona utama SIAGA:

1. **Client** — perusahaan/BUMN/pemilik aset yang ingin melihat detail proyek, membandingkan bid pilot, dan memilih pilot terbaik.
2. **Pilot** — pilot UAV/agensi drone yang ingin memahami scope proyek dan mengajukan penawaran.

Halaman ini menutup gap navigasi dari dua halaman utama:

- Tombol **Lihat Detail** pada Job Radar Pin Popup.
- Link proyek pada Client Dashboard.

Halaman ini bukan sekadar halaman detail proyek biasa. Halaman ini harus terasa seperti:

```text
SIAGA Project Intelligence Briefing
```

atau secara UI:

```text
Premium Project Intelligence Briefing Dashboard
```

Target visual:

```text
premium, informatif, role-aware, glassmorphism, clean, aerospace-tech, soft-blue, dark-cyan accent, modern, professional, dan selaras dengan Landing Page, Job Radar Page, Client Dashboard, Login, dan Register SIAGA.
```

Karena target SEFEST 2026 berfokus pada demo frontend, halaman ini tidak memakai backend nyata. Data proyek diambil dari **Mock_Data_Module** yang shared/extended dari Job Radar mock data. Bidding form melakukan mock submit, dan seluruh interaksi bersifat client-side.

---

## Product Goal

Project Detail Page harus membantu pengguna memahami proyek secara cepat dan mengambil aksi yang tepat.

Untuk **Client**, halaman harus membantu:

- memahami detail proyek,
- melihat scope dan area inspeksi,
- memantau timeline proyek,
- membandingkan penawaran pilot,
- memilih pilot terbaik.

Untuk **Pilot**, halaman harus membantu:

- memahami kebutuhan proyek,
- melihat area dan titik inspeksi,
- mengecek spesifikasi teknis,
- menilai kredibilitas client,
- mengajukan bid dengan mudah.

Halaman ini harus menjadi bagian dari alur produk SIAGA:

```text
Landing Page → Job Radar / Client Dashboard → Project Detail → Bidding / Selection
```

---

## Glossary

- **SIAGA**: Sistem Inspeksi Aerial Geospasial Andalan.
- **Project_Detail_Page**: Halaman detail proyek pada route `/project/:projectId`.
- **Client**: Role pengguna perusahaan/BUMN/pemilik aset. Auth session memiliki `role === "client"`.
- **Pilot**: Role pengguna pilot UAV/agensi drone. Auth session memiliki `role === "pilot"`.
- **Auth_Session_Mock**: Penyimpanan client-side hasil auth-pages yang menandai user sebagai logged in beserta role.
- **ProtectedRoute**: Komponen route guard existing pada project.
- **Mock_Data_Module**: Modul mock data project detail yang shared atau extended dari `src/pages/JobRadar/mock-data.js`.
- **Project_Intelligence_Briefing**: Konsep visual halaman detail proyek yang terasa seperti briefing operasional profesional.
- **Project_Briefing_Hero**: Hero section premium berisi status, nama proyek, lokasi, deadline, dan CTA role-aware.
- **Briefing_Summary_Cards**: Ringkasan cepat proyek seperti deadline, area, titik inspeksi, bidder, dan status.
- **Sticky_Section_Navigator**: Navigasi sticky untuk lompat ke section Overview, Area Inspeksi, Timeline, Bidding, dan Specs.
- **Mission_Scope_Card**: Section scope proyek yang memuat deskripsi, deliverables, dan key requirements.
- **Inspection_Area_Stage**: Section Mapbox premium yang menampilkan polygon area inspeksi dan titik inspeksi.
- **Project_Timeline_Section**: Timeline milestone proyek.
- **Bidding_Section**: Section role-aware untuk bidding.
- **Bid_Intelligence_Panel**: Tampilan bidding untuk Client berisi summary metrics, bid table/card, modal pilih pilot, dan drawer profil pilot.
- **Bid_Command_Panel**: Tampilan bidding untuk Pilot berisi competitor count, deadline reminder, bid form, dan bid summary.
- **Bid_Table**: Tabel komparatif penawaran pilot untuk Client.
- **Bid_Card_Mobile**: Versi mobile dari Bid_Table.
- **Bid_Form**: Form untuk Pilot mengajukan penawaran.
- **Bid_Summary_Card**: Ringkasan bid yang sudah dikirim Pilot.
- **Pilot_Selection_Modal**: Modal konfirmasi saat Client memilih pilot.
- **Pilot_Profile_Drawer**: Drawer profil pilot untuk Client.
- **Technical_Specs_Section**: Section spesifikasi teknis proyek.
- **Spec_Matrix**: Tampilan Technical Specs berbentuk grid card dengan icon.
- **Client_Info_Section**: Card info perusahaan, hanya terlihat untuk Pilot.
- **Related_Projects_Section**: Card proyek terkait, hanya terlihat untuk Pilot.
- **Sticky_Bottom_CTA**: CTA mobile yang sticky di bawah layar.
- **Toast_Notification**: Feedback ringan untuk submit bid, pilih pilot, dan error ringan.
- **Inspection_Area_Map**: Mapbox map yang menampilkan polygon dan titik inspeksi.
- **Mapbox_Token**: Token publik Mapbox GL JS dari `import.meta.env.VITE_MAPBOX_TOKEN`.
- **Page_Transition**: Animasi fade + slide-up existing untuk route.
- **Design_Tokens**: Token warna dan typography SIAGA:
  - `--color-primary`
  - `--color-accent`
  - `--color-surface`
  - `--color-danger`
  - `--color-success`
  - `--color-warning`
  - Montserrat
  - Inter

---

## Requirements

---

## Requirement 1: Routing, Access, dan Role-Aware Rendering

**User Story:**  
Sebagai pengguna SIAGA yang sudah login, baik Client maupun Pilot, saya ingin dapat membuka detail proyek melalui `/project/:projectId`, sehingga saya bisa melihat informasi proyek sesuai role saya.

### Acceptance Criteria

1. THE Project_Detail_Page SHALL ter-render pada route `/project/:projectId`.
2. THE Project_Detail_Page SHALL dapat diakses oleh role `client` dan `pilot`.
3. IF Auth_Session_Mock kosong saat user mengakses `/project/:projectId`, THEN THE app SHALL redirect user ke `/login`.
4. WHEN Project_Detail_Page di-mount, THE page SHALL membaca `projectId` dari URL params.
5. THE Project_Detail_Page SHALL mencocokkan `projectId` dengan data pada Mock_Data_Module.
6. IF `projectId` tidak ditemukan pada Mock_Data_Module, THEN THE page SHALL menampilkan Not_Found_State.
7. THE Not_Found_State SHALL berisi pesan `Proyek tidak ditemukan`.
8. THE Not_Found_State SHALL menampilkan button `Kembali ke Dashboard`.
9. WHEN user klik `Kembali ke Dashboard`, THE app SHALL navigate ke `/dashboard/client` jika role client.
10. WHEN user klik `Kembali ke Dashboard`, THE app SHALL navigate ke `/dashboard/pilot` jika role pilot.
11. THE Project_Detail_Page SHALL menampilkan konten role-aware melalui conditional rendering dalam satu halaman tunggal.
12. THE Project_Detail_Page SHALL NOT membuat route terpisah untuk client/pilot view.
13. THE Project_Detail_Page SHALL dibungkus dengan Page_Transition existing.
14. WHEN page mounted, THE Page_Transition SHALL menjalankan fade + slide-up animation 300ms–600ms.
15. THE Project_Detail_Page SHALL mempertahankan custom cursor cyan existing jika custom cursor aktif pada aplikasi.
16. THE Project_Detail_Page SHALL menggunakan font dan warna dari SIAGA Design_Tokens.

---

## Requirement 2: Visual Cohesion dan Page Foundation

**User Story:**  
Sebagai pengguna SIAGA, saya ingin halaman detail proyek terlihat satu gaya dengan Landing Page, Job Radar, Client Dashboard, Login, dan Register, sehingga pengalaman produk terasa konsisten dan premium.

### Acceptance Criteria

1. THE Project_Detail_Page SHALL menggunakan konsep visual `SIAGA Project Intelligence Briefing`.
2. THE Project_Detail_Page SHALL terlihat seperti briefing dashboard premium, bukan halaman detail biasa.
3. THE page background SHALL menggunakan soft blue / white gradient, bukan putih polos.
4. THE page background SHOULD memiliki subtle grid/radar pattern.
5. THE page SHALL menggunakan glassmorphism cards secara konsisten.
6. THE page SHALL memakai rounded corners besar, sekitar 24px–32px untuk card utama.
7. THE page SHALL menggunakan shadow soft blue/cyan, bukan shadow hitam berat.
8. THE page SHALL menggunakan Montserrat untuk heading dan Inter untuk body/metadata.
9. THE page SHALL menggunakan primary navy, electric cyan, soft blue, success green, warning yellow, dan danger red sesuai SIAGA.
10. THE page SHALL avoid generic admin dashboard appearance.
11. THE page SHALL avoid plain white box styling without glass treatment.
12. THE page SHALL maintain balanced spacing and strong visual hierarchy.
13. THE page SHALL memiliki max-width content yang nyaman pada desktop, sekitar 1180px–1280px.
14. THE page SHALL memiliki section spacing konsisten, sekitar 28px–40px.
15. THE page SHALL terlihat premium di screenshot desktop 1440px dan tetap rapi di mobile 320px.

---

## Requirement 3: Project Briefing Hero

**User Story:**  
Sebagai pengguna, saya ingin melihat ringkasan proyek yang sangat jelas dan menarik di bagian atas halaman, sehingga saya langsung tahu proyek apa ini, statusnya, lokasinya, deadline-nya, dan aksi utama yang bisa saya lakukan.

### Acceptance Criteria

1. THE Project_Briefing_Hero SHALL menjadi visual anchor utama halaman.
2. THE Project_Briefing_Hero SHALL menggunakan layout premium glass card.
3. ON desktop, THE Project_Briefing_Hero SHALL menggunakan split layout:
   - kiri: project identity,
   - kanan: briefing summary panel.
4. THE Project_Briefing_Hero SHALL menampilkan Breadcrumb di atas atau di dalam area hero.
5. THE Project_Briefing_Hero SHALL menampilkan Project_Status_Badge.
6. THE Project_Status_Badge SHALL memiliki warna sesuai derived status:
   - `open` → cyan/accent,
   - `urgent` → danger red,
   - `deadline_dekat` → warning yellow,
   - `in_progress` → warning/cyan,
   - `completed` → success green,
   - `closed` → muted grey,
   - `expired` → grey.
7. THE Project_Briefing_Hero SHALL menampilkan badge jenis infrastruktur.
8. THE Project_Briefing_Hero SHALL menampilkan judul proyek sebagai H1.
9. THE H1 SHALL menggunakan font Montserrat 700/800.
10. THE Project_Briefing_Hero SHALL menampilkan lokasi kota dan provinsi.
11. THE Project_Briefing_Hero SHALL menampilkan deadline dalam format tanggal Indonesia.
12. THE Project_Briefing_Hero SHALL menampilkan CTA role-aware.
13. WHERE role is `client` AND status is `completed`, THE CTA SHALL be `Generate Report`.
14. WHERE role is `client` AND status is `open`, `urgent`, or `deadline_dekat`, THE CTA SHALL be `Lihat Bidding`.
15. WHERE role is `pilot` AND status is `open`, `urgent`, or `deadline_dekat` AND pilot has not submitted bid, THE CTA SHALL be `Bid Sekarang`.
16. WHERE role is `pilot` AND pilot has submitted bid, THE CTA SHALL be `Bid Terkirim ✓` disabled.
17. WHERE status is `closed`, `completed`, or `expired`, THE Pilot CTA SHALL indicate bidding is closed/unavailable.
18. WHEN CTA `Lihat Bidding` or `Bid Sekarang` clicked, THE page SHALL smooth-scroll to Bidding_Section.
19. WHERE role is `client`, THE Project_Briefing_Hero SHALL show contract value.
20. WHERE role is `pilot`, THE Project_Briefing_Hero SHALL NOT show competitor bid prices or sensitive bid data.
21. THE Project_Briefing_Hero SHALL include subtle radar/grid background and soft cyan accent.
22. ON mobile, THE Project_Briefing_Hero SHALL stack content and remain readable without horizontal overflow.

---

## Requirement 4: Briefing Summary Cards

**User Story:**  
Sebagai pengguna, saya ingin melihat ringkasan cepat proyek dalam bentuk card, sehingga saya bisa memahami proyek tanpa harus membaca seluruh halaman.

### Acceptance Criteria

1. THE Project_Detail_Page SHALL menampilkan Briefing_Summary_Cards di area hero atau tepat setelah hero.
2. THE Briefing_Summary_Cards SHALL menampilkan Deadline.
3. THE Briefing_Summary_Cards SHALL menampilkan Luas Area.
4. THE Briefing_Summary_Cards SHALL menampilkan Jumlah Titik Inspeksi.
5. THE Briefing_Summary_Cards SHALL menampilkan Jumlah Bidder.
6. WHERE role is `client`, THE Briefing_Summary_Cards MAY show Nilai Kontrak.
7. WHERE role is `pilot`, THE Briefing_Summary_Cards SHALL NOT reveal competitor bid prices.
8. THE Briefing_Summary_Cards SHALL menampilkan Status Bidding secara role-aware.
9. THE cards SHALL use glassmorphism style.
10. THE cards SHALL use icon container with soft cyan/blue background.
11. THE cards SHALL have uppercase small label.
12. THE cards SHALL have prominent value text.
13. THE cards SHALL include micro helper text if useful.
14. ON desktop, THE cards SHALL align neatly inside hero right panel or compact grid.
15. ON mobile, THE cards SHALL render as 2-column compact grid or stacked if needed.
16. THE cards SHALL not overflow at 320px viewport.

---

## Requirement 5: Sticky Section Navigator

**User Story:**  
Sebagai pengguna, saya ingin bisa berpindah antar section dengan cepat, sehingga halaman detail yang panjang tetap mudah dinavigasi.

### Acceptance Criteria

1. THE Project_Detail_Page SHALL include Sticky_Section_Navigator after hero/summary area.
2. THE Sticky_Section_Navigator SHALL contain section items:
   - Overview,
   - Area Inspeksi,
   - Timeline,
   - Bidding,
   - Specs.
3. THE Sticky_Section_Navigator MAY include Client/Related section for pilot if needed.
4. THE Sticky_Section_Navigator SHALL use glass pill/card style.
5. THE active section item SHALL be visually highlighted with cyan/navy accent.
6. WHEN user clicks a section item, THE page SHALL smooth-scroll to that section.
7. THE active section SHOULD update using Intersection Observer.
8. ON desktop, THE navigator SHALL be sticky near top of content.
9. ON mobile, THE navigator SHALL become horizontally scrollable pills.
10. THE navigator SHALL not create horizontal page overflow.
11. THE navigator SHALL be keyboard accessible.
12. THE navigator SHALL preserve readable labels at viewport 320px.

---

## Requirement 6: Mission Scope dan Deliverables

**User Story:**  
Sebagai pengguna, saya ingin memahami scope pekerjaan, deliverables, dan requirement utama proyek, sehingga saya bisa mengambil keputusan dengan lebih percaya diri.

### Acceptance Criteria

1. THE Project_Scope_Section SHALL be styled as `Mission Scope Card`.
2. THE Project_Scope_Section SHALL NOT be a plain paragraph block.
3. THE Project_Scope_Section SHALL display full project description from Mock_Data_Module.
4. THE Project_Scope_Section SHALL display jenis infrastruktur with relevant icon.
5. THE Project_Scope_Section SHALL display luas area in km².
6. THE Project_Scope_Section SHALL display jumlah titik inspeksi.
7. THE Project_Scope_Section SHALL display deliverables as chips/tags.
8. THE deliverables MAY include:
   - Foto RAW,
   - Video 4K,
   - Orthomosaic,
   - Point Cloud,
   - Thermal scan,
   - Laporan PDF.
9. THE Project_Scope_Section SHALL display key requirements preview.
10. THE key requirements SHALL include at least:
   - resolusi minimum,
   - format output,
   - peralatan minimum.
11. ON desktop, THE Project_Scope_Section SHOULD use two-column layout:
   - left: description + deliverables,
   - right: key requirements.
12. THE Project_Scope_Section SHALL use glassmorphism cards.
13. THE deliverable chips SHALL use soft cyan/blue visual style.
14. THE Project_Scope_Section SHALL remain readable on mobile.
15. THE Project_Scope_Section SHALL not overflow horizontally.

---

## Requirement 7: Premium Inspection Area Stage

**User Story:**  
Sebagai pengguna, saya ingin melihat area inspeksi dalam peta yang premium dan informatif, sehingga saya paham cakupan geografis proyek dan titik inspeksi yang harus dikerjakan.

### Acceptance Criteria

1. THE Inspection_Area_Map SHALL be presented as `Premium Inspection Area Stage`.
2. THE Inspection_Area_Map SHALL NOT look like a plain embedded map.
3. THE Inspection_Area_Map SHALL use Mapbox GL JS.
4. THE Inspection_Area_Map SHALL read token from `import.meta.env.VITE_MAPBOX_TOKEN`.
5. THE Inspection_Area_Map SHALL use style `mapbox://styles/mapbox/dark-v11`.
6. THE Inspection_Area_Map SHALL be lazy-loaded using `React.lazy()` + Suspense.
7. THE Inspection_Area_Map SHALL display polygon area from `polygon_area`.
8. THE polygon SHALL use cyan fill with 18%–22% opacity.
9. THE polygon SHALL use solid cyan stroke.
10. THE polygon SHOULD have subtle cyan glow if feasible.
11. THE Inspection_Area_Map SHALL display inspection point markers from `titik_inspeksi`.
12. THE markers SHALL use cyan dots with subtle pulse.
13. THE map SHALL auto-fit bounds to polygon area.
14. THE map stage SHALL display floating legend:
   - Polygon Area,
   - Inspection Point.
15. THE map stage SHALL display floating stat chips:
   - Luas Area,
   - Titik Inspeksi,
   - Koordinat/GPS if applicable.
16. THE map stage SHALL display coordinate strip below or inside map card.
17. THE map container height SHALL be around 420px on desktop.
18. THE map container height SHALL be around 300px–320px on tablet.
19. THE map container height SHALL be around 250px on mobile.
20. WHILE map is loading, THE section SHALL show premium MapLoadingFallback.
21. THE MapLoadingFallback SHALL include dark navy card, subtle radar grid, cyan spinner, and text `Memuat peta area inspeksi…`.
22. IF Mapbox fails, THEN THE section SHALL show MapErrorFallback.
23. THE MapErrorFallback SHALL show message `Peta tidak tersedia`.
24. THE MapErrorFallback SHALL show text list of inspection coordinates.
25. THE map failure SHALL NOT crash the whole page.

---

## Requirement 8: Project Timeline

**User Story:**  
Sebagai pengguna, saya ingin melihat progres proyek dalam bentuk timeline yang jelas dan indah, sehingga saya tahu proyek sedang berada di tahap apa.

### Acceptance Criteria

1. THE Project_Timeline_Section SHALL display five milestones:
   - Posted,
   - Bidding Open,
   - Pilot Selected,
   - Inspection In Progress,
   - Report Ready.
2. THE Project_Timeline_Section SHALL use glass timeline card style.
3. THE Project_Timeline_Section SHALL include title `Project Timeline`.
4. THE Project_Timeline_Section SHALL include subtitle explaining progress.
5. EACH milestone SHALL show icon, label, and date.
6. Milestone with `completed` status SHALL use checkmark icon and success green/teal.
7. Milestone with `in_progress` status SHALL use cyan glow and pulse animation.
8. Milestone with `upcoming` status SHALL use muted grey/glass style.
9. Connector line between milestones SHALL visually indicate progress.
10. ON desktop, THE timeline SHALL be horizontal.
11. ON mobile, THE timeline SHALL convert to vertical compact timeline.
12. THE timeline SHALL not overflow horizontally on mobile.
13. THE milestone status SHALL be consistent with derived project status.
14. IF project status is `in_progress`, THEN at least one milestone SHOULD have `in_progress`.
15. THE timeline SHALL use animation based on transform/opacity for performance.

---

## Requirement 9: Bidding Section — Client View / Bid Intelligence Panel

**User Story:**  
Sebagai Client, saya ingin melihat penawaran pilot dalam panel yang informatif dan mudah dibandingkan, sehingga saya bisa memilih pilot terbaik.

### Acceptance Criteria

1. WHERE role is `client`, THE Bidding_Section SHALL render Client View.
2. THE Client View SHALL be styled as `Bid Intelligence Panel`.
3. THE Bid_Intelligence_Panel SHALL include section header `Bid Intelligence`.
4. THE Bid_Intelligence_Panel SHALL include short summary subtitle.
5. THE Bid_Intelligence_Panel SHALL display summary metric cards:
   - Total Penawaran,
   - SIAGA Verified,
   - Harga Terendah,
   - Estimasi Tercepat,
   - Rating Tertinggi.
6. THE summary metrics SHALL be computed from project `bids`.
7. THE Client View SHALL display Bid_Table on desktop.
8. THE Bid_Table SHALL include columns:
   - Avatar,
   - Nama Pilot,
   - SIAGA Verified,
   - Rating,
   - Harga Bid,
   - Estimasi Hari,
   - Drone Type,
   - Aksi.
9. THE Bid_Table SHALL display Harga Bid in Rupiah format.
10. THE Bid_Table SHALL display rating as stars + numeric value.
11. THE Bid_Table row hover SHALL use cyan tint 5%–12%.
12. EACH row SHALL include button `Pilih Pilot`.
13. WHEN user clicks `Pilih Pilot`, THE Pilot_Selection_Modal SHALL open.
14. EACH row SHALL include button `Lihat Profil`.
15. WHEN user clicks `Lihat Profil`, THE Pilot_Profile_Drawer SHALL open.
16. WHERE project status is `completed` or `closed`, THE Client View SHALL NOT show active Bid_Table.
17. WHERE project status is `completed` or `closed`, THE Client View SHALL show message `Bidding telah selesai untuk proyek ini`.
18. ON mobile, THE Bid_Table SHALL convert to Bid_Card_Mobile stack.
19. THE mobile Bid_Card SHALL show pilot name, verified badge, rating, price, estimation, drone type, and actions.
20. THE Client View SHALL use glassmorphism and premium table/card styling.
21. THE Client View SHALL not look like generic admin table.

---

## Requirement 10: Pilot Selection Modal dan Pilot Profile Drawer

**User Story:**  
Sebagai Client, saya ingin melihat profil pilot dan mengonfirmasi pilihan dengan jelas, sehingga saya tidak salah memilih pilot.

### Acceptance Criteria

1. THE Pilot_Selection_Modal SHALL open when Client clicks `Pilih Pilot`.
2. THE Pilot_Selection_Modal SHALL show pilot avatar and pilot name.
3. THE Pilot_Selection_Modal SHALL show confirmation warning text.
4. THE Pilot_Selection_Modal SHALL show secondary button `Batal`.
5. THE Pilot_Selection_Modal SHALL show primary button `Konfirmasi Pilihan`.
6. WHEN user clicks `Konfirmasi Pilihan`, THE modal SHALL close.
7. WHEN user clicks `Konfirmasi Pilihan`, THE Toast_Notification SHALL show `Pilot berhasil dipilih!`.
8. THE Pilot_Selection_Modal SHALL use glassmorphism style.
9. THE Pilot_Selection_Modal SHALL trap focus while open.
10. THE Pilot_Selection_Modal SHALL close on Escape.
11. THE Pilot_Selection_Modal SHALL return focus to trigger button after close.
12. THE Pilot_Profile_Drawer SHALL open when Client clicks `Lihat Profil`.
13. THE Pilot_Profile_Drawer SHALL display:
   - avatar large,
   - nama pilot,
   - SIAGA Verified badge,
   - rating,
   - drone yang dimiliki,
   - jumlah proyek selesai,
   - area operasi.
14. THE Pilot_Profile_Drawer SHALL slide from right on desktop.
15. THE Pilot_Profile_Drawer SHALL become bottom sheet on mobile.
16. THE Pilot_Profile_Drawer SHALL use dark glass style.
17. THE Pilot_Profile_Drawer SHALL close on Escape.
18. THE Pilot_Profile_Drawer SHALL close on overlay click.
19. THE Pilot_Profile_Drawer SHALL manage focus on open.

---

## Requirement 11: Bidding Section — Pilot View / Bid Command Panel

**User Story:**  
Sebagai Pilot, saya ingin melihat informasi kompetisi secara aman dan mengajukan penawaran saya, tanpa melihat harga kompetitor lain.

### Acceptance Criteria

1. WHERE role is `pilot`, THE Bidding_Section SHALL render Pilot View.
2. THE Pilot View SHALL be styled as `Bid Command Panel`.
3. THE Bid_Command_Panel SHALL show competitor count:
   - `[N] pilot sudah mengajukan bid`.
4. THE N SHALL come from project `jumlah_bidder` or `bids.length` consistency.
5. THE Bid_Command_Panel SHALL show deadline reminder.
6. THE Bid_Command_Panel SHOULD show main requirement summary.
7. WHERE pilot has not submitted bid AND status is `open`, `urgent`, or `deadline_dekat`, THE Bid_Form SHALL be shown.
8. WHERE pilot has submitted bid, THE Bid_Summary_Card SHALL be shown.
9. WHERE status is `completed`, `closed`, or `expired`, THE Bid_Form SHALL not be shown.
10. WHERE status is `completed`, `closed`, or `expired`, THE Pilot View SHALL show message `Bidding telah ditutup untuk proyek ini`.
11. THE Pilot View SHALL NEVER show competitor bid prices.
12. THE Pilot View SHALL NEVER show competitor pilot names.
13. THE Pilot View SHALL NEVER show competitor bid details.
14. THE Pilot View SHALL not render Bid_Table.
15. THE Pilot View SHALL use glassmorphism card style.
16. THE Pilot View SHALL make primary action clear.
17. ON mobile, THE Bid_Command_Panel SHALL be full width and readable.

---

## Requirement 12: Bid Form dan Bid Summary

**User Story:**  
Sebagai Pilot, saya ingin mengirim penawaran dengan form yang mudah dipahami dan mendapat konfirmasi setelah berhasil.

### Acceptance Criteria

1. THE Bid_Form SHALL include input `Harga Penawaran (Rp)`.
2. THE `Harga Penawaran` field SHALL be required.
3. THE Bid_Form SHALL include input `Estimasi Hari Pengerjaan`.
4. THE `Estimasi Hari Pengerjaan` field SHALL be required.
5. THE Bid_Form SHALL include select `Drone yang akan digunakan`.
6. THE Bid_Form SHALL include textarea `Catatan Teknis`.
7. THE `Catatan Teknis` field SHALL be optional.
8. THE Bid_Form SHALL use glass input styling.
9. THE Bid_Form SHALL use clear labels.
10. THE submit button SHALL say `Kirim Penawaran`.
11. THE submit button SHALL use cyan-blue gradient.
12. WHEN user submits with empty or 0 harga, THE form SHALL show error `Harga penawaran wajib diisi`.
13. WHEN user submits with empty or 0 estimasiHari, THE form SHALL show error `Estimasi hari wajib diisi`.
14. WHEN form is valid, THE submit flow SHALL show loading state for around 800ms.
15. WHILE submitting, THE submit button SHALL be disabled.
16. WHILE submitting, THE submit button SHALL show spinner/loading indicator.
17. WHEN mock submit succeeds, THE bid SHALL be saved to sessionStorage with key based on projectId.
18. WHEN mock submit succeeds, THE Toast_Notification SHALL show `Penawaran berhasil dikirim!`.
19. WHEN mock submit succeeds, THE Bid_Form SHALL be replaced by Bid_Summary_Card.
20. WHEN mock submit succeeds, THE Hero CTA SHALL update to `Bid Terkirim ✓`.
21. THE Bid_Summary_Card SHALL show:
   - badge `Bid Terkirim`,
   - harga penawaran,
   - estimasi hari,
   - drone type,
   - catatan teknis if available.
22. THE Bid_Summary_Card SHALL use success accent and calm confirmation visual.
23. THE Bid_Form SHALL prevent double submit.
24. IF bid submit mock failure occurs, THE form SHALL remain visible and show toast/error feedback.

---

## Requirement 13: Technical Specs / Spec Matrix

**User Story:**  
Sebagai Pilot atau Client, saya ingin melihat spesifikasi teknis proyek dalam format yang mudah dipindai, sehingga saya bisa memahami requirement teknis tanpa membaca tabel panjang.

### Acceptance Criteria

1. THE Technical_Specs_Section SHALL be visible for both Client and Pilot.
2. THE Technical_Specs_Section SHALL be styled as `Spec Matrix`.
3. THE Spec_Matrix SHALL NOT be a plain table only.
4. THE Spec_Matrix SHALL display:
   - Resolusi Foto,
   - Format Output,
   - Standar,
   - Peralatan Minimum,
   - Kondisi Cuaca,
   - Jam Operasional.
5. EACH spec item SHALL use relevant Lucide icon.
6. EACH spec item SHALL have label and value.
7. EACH spec item SHALL use glass card style.
8. ON desktop, THE Spec_Matrix SHALL use 2-column or 3-column grid.
9. ON mobile, THE Spec_Matrix SHALL stack vertically or use accordion if needed.
10. THE Spec_Matrix SHALL remain readable at 320px.
11. THE Technical_Specs_Section SHALL use consistent spacing and typography.

---

## Requirement 14: Client Info dan Related Projects — Pilot Only

**User Story:**  
Sebagai Pilot, saya ingin melihat kredibilitas client dan proyek terkait lain, sehingga saya bisa menilai peluang kerja dengan lebih baik.

### Acceptance Criteria

1. WHERE role is `pilot`, THE Client_Info_Section SHALL be visible.
2. WHERE role is `client`, THE Client_Info_Section SHALL NOT be visible.
3. THE Client_Info_Section SHALL display:
   - nama perusahaan,
   - rating client,
   - jumlah proyek selesai,
   - member since,
   - Verified Company badge.
4. THE Client_Info_Section SHALL use `Verified Client Card` visual style.
5. THE Client_Info_Section SHALL use glass card style.
6. WHERE role is `pilot`, THE Related_Projects_Section SHALL be visible.
7. WHERE role is `client`, THE Related_Projects_Section SHALL NOT be visible.
8. THE Related_Projects_Section SHALL display maximum 3 related project cards.
9. THE related project logic SHALL prioritize same `jenis_infrastruktur`.
10. IF not enough same infrastructure projects exist, THEN fallback SHALL use same province.
11. THE Related_Projects_Section SHALL exclude current projectId.
12. EACH Related Project Card SHALL display:
   - nama proyek,
   - jenis infrastruktur,
   - lokasi,
   - nilai kontrak compact,
   - status badge.
13. WHEN user clicks related project card, THE app SHALL navigate to `/project/:otherId`.
14. THE Related Project Cards SHALL visually match Job Radar Mission Cards.
15. THE cards SHALL use hover glow cyan.
16. ON mobile, THE cards SHALL stack vertically.

---

## Requirement 15: Mock Data Module dan Konsistensi Data

**User Story:**  
Sebagai developer, saya ingin data project detail berasal dari satu sumber mock data yang konsisten dengan Job Radar dan Client Dashboard, sehingga data tidak bertabrakan ketika user berpindah halaman.

### Acceptance Criteria

1. THE Project_Detail_Page SHALL read data from Mock_Data_Module.
2. THE Mock_Data_Module SHOULD be shared or extended from `src/pages/JobRadar/mock-data.js`.
3. THE Project_Detail_Page SHALL NOT call real HTTP/API endpoints.
4. THE Mock_Data_Module SHALL use `id` field as projectId route key.
5. EACH project SHALL include base fields:
   - id,
   - nama,
   - jenis_infrastruktur,
   - nilai_kontrak,
   - lokasi,
   - deadline,
   - status,
   - jumlah_bidder,
   - deskripsi,
   - client_nama.
6. EACH project SHALL include extended fields:
   - luas_area,
   - jumlah_titik_inspeksi,
   - deliverables,
   - spesifikasi_teknis,
   - polygon_area,
   - titik_inspeksi,
   - milestones,
   - client_info,
   - bids.
7. THE `polygon_area` SHALL contain at least 3 coordinate pairs.
8. THE `titik_inspeksi` SHALL contain coordinate objects with lat, lng, and label.
9. THE coordinates SHALL be within Indonesia bounding box:
   - lat between -11 and 6,
   - lng between 95 and 141.
10. THE `jumlah_bidder` SHALL equal or remain consistent with `bids.length`.
11. THE Project_Detail_Page SHALL display data identical to source project data for matching projectId.
12. THE Project_Detail_Page SHALL ensure data from Job Radar `Lihat Detail` matches the project detail shown.
13. THE Project_Detail_Page SHALL ensure data from Client Dashboard project link matches the project detail shown.
14. THE Mock_Data_Module SHALL contain varied statuses:
   - open,
   - urgent,
   - deadline_dekat,
   - in_progress,
   - completed,
   - closed.
15. THE Mock_Data_Module SHALL contain varied infrastructure categories.
16. THE Mock_Data_Module SHALL provide enough bids to demonstrate Client Bid Intelligence Panel.
17. THE Mock_Data_Module SHALL provide enough data to demonstrate Pilot Bid Command Panel.
18. THE Mock_Data_Module SHALL provide complete data for visual demo quality.

---

## Requirement 16: Performance dan Lazy Loading

**User Story:**  
Sebagai pengguna dengan koneksi terbatas, saya ingin halaman tetap cepat dan section atas bisa dipakai tanpa menunggu Mapbox selesai dimuat.

### Acceptance Criteria

1. THE Inspection_Area_Map SHALL be lazy-loaded using React `lazy()` + Suspense.
2. THE Mapbox GL JS bundle SHALL NOT block initial render of Hero and Scope.
3. THE Project_Briefing_Hero SHALL render before Inspection_Area_Map finishes loading.
4. THE Briefing_Summary_Cards SHALL render before Inspection_Area_Map finishes loading.
5. THE Mission_Scope_Card SHALL render before Inspection_Area_Map finishes loading.
6. THE MapLoadingFallback SHALL preserve layout height to avoid layout shift.
7. THE map loading SHALL transition smoothly to loaded map.
8. THE section below fold MAY use Viewport_Trigger for animations or render optimization.
9. THE Project_Timeline pulse animation SHALL use transform/opacity.
10. THE page SHALL avoid unnecessary re-render when bid state changes.
11. WHEN bid state changes, only affected components SHOULD update.
12. THE page SHALL avoid skeleton → blank → content glitches.
13. THE page SHALL keep loading state visually premium.

---

## Requirement 17: Responsive Behavior dan Mobile UX

**User Story:**  
Sebagai pengguna yang membuka halaman dari desktop, tablet, atau HP, saya ingin layout tetap nyaman digunakan dan tidak terasa seperti desktop yang dipaksa mengecil.

### Acceptance Criteria

1. THE Project_Detail_Page SHALL be responsive at viewport widths:
   - 320px,
   - 360px,
   - 390px,
   - 430px,
   - 768px,
   - 1024px,
   - 1280px,
   - 1440px.
2. ON viewport >=1280px, THE page SHALL use premium desktop briefing layout.
3. ON viewport >=1280px, THE hero SHOULD use split layout.
4. ON viewport >=1280px, THE bidding client view SHALL use premium Bid_Table.
5. ON viewport 768px–1279px, THE layout SHALL adapt with reduced padding and compact grids.
6. ON viewport 768px–1279px, THE summary cards SHALL use 2-column grid if needed.
7. ON viewport <768px, THE hero SHALL stack vertically.
8. ON viewport <768px, THE summary cards SHALL use 2-column compact grid or stacked layout.
9. ON viewport <768px, THE Sticky_Section_Navigator SHALL be horizontally scrollable.
10. ON viewport <768px, THE Inspection_Area_Map SHALL use around 250px height.
11. ON viewport <768px, THE Project_Timeline SHALL become vertical.
12. ON viewport <768px, THE Bid_Table SHALL become Bid_Card_Mobile stack.
13. ON viewport <768px, THE Bid_Form SHALL be full width.
14. ON viewport <768px, THE Technical_Specs_Section SHALL stack or use accordion.
15. ON viewport <768px, THE Related_Projects_Section SHALL stack vertically.
16. ON viewport <768px, THE Sticky_Bottom_CTA SHALL appear when primary action is relevant.
17. THE Sticky_Bottom_CTA SHALL not cover important content awkwardly.
18. THE Sticky_Bottom_CTA SHALL respect mobile safe area.
19. THE page SHALL have no horizontal overflow at viewport >=320px.
20. THE page SHALL be readable at 320px.
21. THE page SHALL not use desktop table squeezed into mobile.

---

## Requirement 18: Accessibility

**User Story:**  
Sebagai pengguna keyboard atau screen reader, saya ingin dapat menavigasi seluruh halaman dengan jelas dan aman.

### Acceptance Criteria

1. THE Project_Detail_Page SHALL use semantic HTML:
   - `<main>`,
   - `<section>`,
   - `<nav>`,
   - `<h1>`,
   - `<h2>`,
   - `<h3>`.
2. THE Breadcrumb SHALL use `<nav aria-label="Breadcrumb">`.
3. THE Project_Status_Badge SHALL have descriptive `aria-label`.
4. THE Sticky_Section_Navigator SHALL be keyboard accessible.
5. THE Sticky_Section_Navigator SHALL indicate active section visually and accessibly.
6. THE Inspection_Area_Map SHALL have `aria-label="Peta area inspeksi proyek"`.
7. THE map fallback SHALL provide text coordinate list.
8. THE Project_Timeline_Section SHALL have descriptive `aria-label`.
9. THE Bid_Form SHALL use proper `<label htmlFor>` for each input.
10. THE Bid_Form errors SHALL use `aria-describedby`.
11. WHEN input has error, THE input SHALL use `aria-invalid="true"`.
12. THE Pilot_Selection_Modal SHALL trap focus while open.
13. THE Pilot_Selection_Modal SHALL close on Escape.
14. THE Pilot_Selection_Modal SHALL return focus to trigger after close.
15. THE Pilot_Profile_Drawer SHALL manage focus when open.
16. THE Pilot_Profile_Drawer SHALL close on Escape.
17. THE Toast_Notification SHALL use `aria-live="polite"`.
18. THE Sticky_Bottom_CTA SHALL be reachable by keyboard.
19. THE focus indicator SHALL be visible with cyan outline/glow.
20. THE tab order SHALL follow visual order.
21. THE page SHALL have no critical accessibility violations in automated checks.

---

## Requirement 19: Error Handling dan Edge Cases

**User Story:**  
Sebagai pengguna, saya ingin halaman tetap memberi feedback jelas saat terjadi kondisi tidak ideal, sehingga saya tidak melihat blank screen atau layout rusak.

### Acceptance Criteria

1. IF projectId is invalid, THE page SHALL show Not_Found_State.
2. IF optional data is missing, THE component SHALL show fallback text `Tidak tersedia`.
3. IF Mapbox fails to load, THE Inspection_Area_Map SHALL show MapErrorFallback.
4. IF Mapbox terrain/source fails, THE map SHALL degrade gracefully without crashing.
5. IF bid submit mock fails, THE Bid_Form SHALL remain visible.
6. IF bid submit mock fails, THE page SHALL show toast error feedback.
7. IF Related Projects result is empty, THE section MAY be hidden or show calm empty state.
8. IF Client Bid list is empty, THE Client View SHALL show empty bidding state.
9. IF Pilot already submitted bid, THE Bid_Form SHALL not be shown.
10. IF deadline passed and status open, THE derived status SHALL become expired.
11. IF status expired, THE Pilot Bid_Form SHALL be disabled or unavailable.
12. THE page SHALL never fail silently into blank area.
13. THE error fallback UI SHALL use SIAGA visual style.
14. THE error messages SHALL be clear and non-technical.
15. THE modal/drawer failure SHALL not crash the whole page.

---

## Requirement 20: UI/UX Demo Readiness

**User Story:**  
Sebagai tim SIAGA yang akan mempresentasikan demo frontend SEFEST, saya ingin halaman ini terlihat sangat matang secara UI/UX, sehingga juri langsung menangkap kualitas produk.

### Acceptance Criteria

1. THE Project_Detail_Page SHALL be visually demo-ready.
2. THE Project_Detail_Page SHALL look premium at desktop 1440px.
3. THE Project_Detail_Page SHALL remain usable at laptop 1280px.
4. THE Project_Detail_Page SHALL remain usable at tablet 1024px and 768px.
5. THE Project_Detail_Page SHALL remain usable at mobile 430px, 390px, 360px, and 320px.
6. THE Project_Briefing_Hero SHALL have strong visual impact.
7. THE Briefing_Summary_Cards SHALL make project information immediately scannable.
8. THE Sticky_Section_Navigator SHALL make long-page navigation easier.
9. THE Mission_Scope_Card SHALL feel premium and informative.
10. THE Inspection_Area_Stage SHALL look like premium geospatial visualization.
11. THE Project_Timeline_Section SHALL look polished and connected to Client Dashboard design language.
12. THE Bid_Intelligence_Panel SHALL feel like a decision-making panel, not generic table.
13. THE Bid_Command_Panel SHALL feel like a professional bidding interface.
14. THE Spec_Matrix SHALL look like modern technical requirement cards.
15. THE Client_Info_Section SHALL build trust for Pilot.
16. THE Related_Projects_Section SHALL visually match Job Radar Mission Cards.
17. THE mobile experience SHALL feel intentionally designed.
18. THE page SHALL avoid random colors outside SIAGA palette.
19. THE page SHALL avoid excessive animation.
20. THE page SHALL include subtle microinteractions:
   - hover lift,
   - glow,
   - fade/slide reveal,
   - button transition,
   - modal/drawer transition.
21. THE page SHALL be ready for screenshot/video demo.
22. THE page SHALL clearly communicate:
   - project scope,
   - inspection area,
   - status timeline,
   - bidding action,
   - technical requirements.
23. THE visual result SHALL feel like a continuation of SIAGA ecosystem.

---

# Non-Functional Requirements

## Performance

1. Mapbox SHALL be lazy-loaded.
2. Hero and top content SHALL render quickly.
3. Map loading SHALL not cause layout shift.
4. Animations SHALL use transform/opacity where possible.
5. Bidding state update SHALL not re-render unrelated heavy sections.
6. Section reveal animation SHALL not cause scroll jank.

## Maintainability

1. Project logic SHALL be placed in `project-logic.js`.
2. Project mock data SHALL be placed in `project-detail-data.js`.
3. UI components SHALL be modular.
4. CSS SHALL follow per-component structure.
5. Formatting helpers SHALL be centralized.
6. Role visibility logic SHALL not be scattered in many components.

## Visual Consistency

1. Use SIAGA color tokens.
2. Use Montserrat + Inter.
3. Use glassmorphism consistently.
4. Use rounded 24px–32px for major cards.
5. Use soft blue/cyan shadows.
6. Avoid generic admin styles.
7. Match Landing Page, Job Radar, Client Dashboard, Login, and Register.

## Security / Privacy in Demo Context

1. Pilot SHALL NOT see competitor bid prices.
2. Pilot SHALL NOT see competitor pilot names.
3. Pilot SHALL NOT see competitor bid details.
4. Client can see full bid data for their project.
5. No real backend/API call SHALL be made.
6. Mock data SHALL be client-side only for demo.

---

# Final Success Definition

Project Detail Page dianggap berhasil jika:

```text
User dapat membuka /project/:projectId,
melihat detail proyek dalam bentuk Project Intelligence Briefing,
memahami scope dan area inspeksi,
melihat timeline,
mengakses bidding sesuai role,
melihat spesifikasi teknis,
dan memakai halaman dengan nyaman di desktop, tablet, dan mobile.
```

UI dianggap berhasil jika halaman terasa:

```text
premium, informatif, glassmorphism, modern, aerospace-tech, role-aware, dan sangat selaras dengan ekosistem SIAGA.
```

Halaman tidak boleh terasa seperti:

```text
detail page biasa,
admin table polos,
form page generic,
atau dashboard template yang tidak nyambung dengan SIAGA.
```