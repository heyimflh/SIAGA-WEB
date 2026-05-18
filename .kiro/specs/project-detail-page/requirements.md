# Requirements Document

## Introduction

Fitur **project-detail-page** menambahkan halaman detail proyek pada route `/project/:projectId` yang dapat diakses oleh KEDUA persona — Persona A "Client" (Pak Hendra, melihat detail proyek miliknya) DAN Persona B "Pilot" (Rizky, melihat detail proyek yang ingin di-bid). Halaman ini menutup gap navigasi dari dua halaman utama yang sudah ada: tombol "Lihat Detail" di Job Radar Pin_Popup dan link proyek di Client Dashboard saat ini belum punya tujuan — halaman ini menjadi destinasi keduanya.

Halaman ini menampilkan informasi lengkap proyek inspeksi: scope, peta area inspeksi (Mapbox polygon), spesifikasi teknis, timeline milestone, dan bidding section. Konten ditampilkan secara **role-aware** melalui conditional rendering dalam satu halaman tunggal — Client melihat detail bid lengkap dan bisa memilih pilot, sementara Pilot melihat jumlah bidder tanpa harga kompetitor dan bisa submit bid sendiri.

Karena target SEFEST 2026 berfokus pada demo frontend, tidak ada backend nyata: data proyek diambil dari Mock_Data_Module (shared atau extended dari Job Radar), bidding form melakukan mock submit, dan seluruh interaksi bersifat client-side.

## Glossary

- **SIAGA**: Nama platform — Sistem Inspeksi Aerial Geospasial Andalan.
- **Project_Detail_Page**: Halaman pada route `/project/:projectId` yang merupakan subjek utama spec ini.
- **Client**: Role pengguna mewakili perusahaan/BUMN pemilik aset infrastruktur. Auth_Session_Mock dengan `role === "client"`.
- **Pilot**: Role pengguna mewakili pilot UAV/agensi drone. Auth_Session_Mock dengan `role === "pilot"`.
- **Auth_Session_Mock**: Penyimpanan client-side hasil fitur auth-pages yang menandai user sebagai logged in beserta role-nya.
- **ProtectedRoute**: Komponen route guard existing di `src/auth/ProtectedRoute.jsx` yang melakukan role gating.
- **Design_Tokens**: Variabel CSS existing — `--color-primary` (#0A192F), `--color-accent` (#00D2FF), `--color-surface` (#F4F7F6), `--color-danger` (#FF4C4C), `--color-success` (#00C48C), `--color-warning` (kuning), font Montserrat (display), font Inter (body).
- **Mock_Data_Module**: File mock data yang menjadi single source of truth untuk data proyek, shared atau extended dari Job Radar mock-data.
- **Project_Hero_Section**: Banner atas halaman dengan background navy gradient, judul proyek, badge status, dan info ringkas.
- **Project_Status_Badge**: Badge visual yang menunjukkan status proyek (open, urgent, in_progress, completed, expired).
- **Project_Scope_Section**: Section deskripsi proyek, jenis infrastruktur, luas area, deliverables, dan spesifikasi teknis ringkas.
- **Inspection_Area_Map**: Section peta Mapbox yang menampilkan polygon area inspeksi dan marker titik inspeksi.
- **Project_Timeline_Section**: Timeline horizontal 5 milestone yang menunjukkan progres proyek.
- **Project_Milestone**: Salah satu dari lima milestone — `posted`, `bidding_open`, `pilot_selected`, `inspection_in_progress`, `report_ready`.
- **Bidding_Section**: Section yang menampilkan konten berbeda per role — tabel bidder untuk Client, form bid untuk Pilot.
- **Bid_Table**: Tabel komparatif penawaran pilot yang ditampilkan untuk Client.
- **Bid_Form**: Form sederhana untuk Pilot mengajukan penawaran.
- **Bid_Summary_Card**: Card ringkasan bid yang sudah dikirim oleh Pilot.
- **Technical_Specs_Section**: Section card/table detail spesifikasi teknis proyek.
- **Client_Info_Section**: Card info perusahaan yang memposting proyek, visible untuk Pilot.
- **Related_Projects_Section**: Section 3 card proyek serupa, visible untuk Pilot.
- **Pilot_Selection_Modal**: Modal konfirmasi yang muncul saat Client mengklik "Pilih Pilot".
- **Pilot_Profile_Drawer**: Panel slide-in yang menampilkan profil lengkap pilot.
- **Toast_Notification**: Feedback ringan untuk aksi seperti submit bid.
- **Page_Transition**: Animasi fade + slide-up existing yang membungkus route.
- **Breadcrumb**: Navigasi hierarkis di atas halaman: Dashboard > Proyek > [Nama Proyek].
- **Mapbox_Token**: Token publik Mapbox GL JS yang tersedia di `.env` sebagai `VITE_MAPBOX_TOKEN`.
- **Viewport_Trigger**: Mekanisme (Intersection Observer) yang men-trigger animasi/render saat elemen masuk viewport.
- **Not_Found_State**: State halaman ketika projectId tidak ditemukan di Mock_Data_Module.

## Requirements

### Requirement 1: Routing, Akses, dan Role-Aware Rendering

**User Story:** Sebagai pengguna SIAGA yang sudah login (baik Client maupun Pilot), saya ingin mengakses halaman detail proyek melalui URL `/project/:projectId`, sehingga saya bisa melihat informasi lengkap proyek dari link di Job Radar atau Client Dashboard.

#### Acceptance Criteria

1. THE Project_Detail_Page SHALL ter-render pada route `/project/:projectId`.
2. THE Project_Detail_Page SHALL dapat diakses oleh user dengan Auth_Session_Mock role "client" maupun "pilot".
3. IF Auth_Session_Mock kosong saat user mencoba mengakses `/project/:projectId`, THEN THE app SHALL me-redirect user ke `/login`.
4. WHEN Project_Detail_Page di-mount, THE halaman SHALL membaca `projectId` dari URL params dan mencocokkannya dengan data pada Mock_Data_Module.
5. IF projectId dari URL tidak ditemukan pada Mock_Data_Module, THEN THE Project_Detail_Page SHALL menampilkan Not_Found_State berisi pesan "Proyek tidak ditemukan" dan tombol "Kembali ke Dashboard".
6. WHEN user mengklik tombol "Kembali ke Dashboard" pada Not_Found_State, THE app SHALL navigasi ke `/dashboard/client` jika role "client" atau `/dashboard/pilot` jika role "pilot".
7. THE Project_Detail_Page SHALL menampilkan konten yang berbeda berdasarkan role user melalui conditional rendering dalam satu komponen halaman tunggal.
8. WHEN Project_Detail_Page di-mount setelah navigasi, THE Page_Transition SHALL menjalankan animasi fade + slide-up dengan durasi antara 300ms dan 600ms.
9. THE Project_Detail_Page SHALL mempertahankan custom cursor cyan existing.
10. THE Project_Detail_Page SHALL menggunakan font dan warna dari Design_Tokens SIAGA.

### Requirement 2: Project Hero Section

**User Story:** Sebagai pengguna (Client atau Pilot), saya ingin melihat ringkasan proyek yang jelas dan menarik di bagian atas halaman, sehingga saya langsung tahu proyek apa ini, statusnya, dan aksi apa yang bisa saya lakukan.

#### Acceptance Criteria

1. THE Project_Hero_Section SHALL menampilkan banner dengan background navy gradient menggunakan `--color-primary`.
2. THE Project_Hero_Section SHALL menampilkan judul proyek sebagai heading H1 dengan font Montserrat.
3. THE Project_Hero_Section SHALL menampilkan Project_Status_Badge dengan warna sesuai status: `open` menggunakan `--color-accent`, `urgent` menggunakan `--color-danger`, `in_progress` menggunakan `--color-warning`, `completed` menggunakan `--color-success`, `expired` menggunakan warna abu-abu.
4. THE Project_Hero_Section SHALL menampilkan info ringkas: jenis infrastruktur dengan ikon, lokasi (kota dan provinsi), dan deadline dalam format tanggal Indonesia.
5. WHERE Auth_Session_Mock memiliki role "client", THE Project_Hero_Section SHALL menampilkan nilai kontrak dalam format Rupiah.
6. WHERE Auth_Session_Mock memiliki role "pilot" DAN status proyek bukan "completed" dengan pilot tersebut terpilih, THE Project_Hero_Section SHALL TIDAK menampilkan nilai kontrak.
7. THE Project_Hero_Section SHALL menampilkan Breadcrumb dengan format "Dashboard > Proyek > [Nama Proyek]".
8. WHEN user mengklik "Dashboard" pada Breadcrumb, THE app SHALL navigasi ke `/dashboard/client` jika role "client" atau `/dashboard/pilot` jika role "pilot".
9. WHERE Auth_Session_Mock memiliki role "client" DAN status proyek "completed", THE Project_Hero_Section SHALL menampilkan tombol aksi utama "Generate Report".
10. WHERE Auth_Session_Mock memiliki role "client" DAN status proyek "open" atau "urgent" atau "deadline_dekat", THE Project_Hero_Section SHALL menampilkan tombol aksi utama "Lihat Bidding" yang men-scroll ke Bidding_Section.
11. WHERE Auth_Session_Mock memiliki role "pilot" DAN status proyek "open" atau "urgent" atau "deadline_dekat" DAN pilot belum mengajukan bid, THE Project_Hero_Section SHALL menampilkan tombol aksi utama "Bid Sekarang" yang men-scroll ke Bidding_Section.
12. WHERE Auth_Session_Mock memiliki role "pilot" DAN pilot sudah mengajukan bid untuk proyek ini, THE Project_Hero_Section SHALL menampilkan tombol non-aktif "Bid Terkirim ✓" dengan style disabled.
13. WHEN deadline proyek sudah lewat (tanggal hari ini melewati field `deadline`) DAN status proyek masih "open", THE Project_Status_Badge SHALL menampilkan label "Expired" dengan warna abu-abu.
14. THE Project_Hero_Section SHALL menampilkan data yang identik dengan data proyek pada Mock_Data_Module untuk projectId yang sama (round-trip property: data ditampilkan = data sumber).

### Requirement 3: Project Scope dan Description

**User Story:** Sebagai pengguna (Client atau Pilot), saya ingin melihat deskripsi lengkap proyek beserta scope pekerjaan, sehingga saya memahami apa yang dibutuhkan sebelum mengambil keputusan (Client: memilih pilot, Pilot: mengajukan bid).

#### Acceptance Criteria

1. THE Project_Scope_Section SHALL menampilkan deskripsi proyek lengkap dari field `deskripsi` pada Mock_Data_Module.
2. THE Project_Scope_Section SHALL menampilkan jenis infrastruktur dengan ikon yang sesuai kategori (SUTET, Jembatan, Kilang, Solar Panel, Bendungan, Tower).
3. THE Project_Scope_Section SHALL menampilkan luas area inspeksi dalam satuan km² dari field `luas_area` pada Mock_Data_Module.
4. THE Project_Scope_Section SHALL menampilkan jumlah titik inspeksi yang dibutuhkan dari field `jumlah_titik_inspeksi` pada Mock_Data_Module.
5. THE Project_Scope_Section SHALL menampilkan daftar deliverables yang diharapkan (mis. foto RAW, video 4K, orthomosaic, point cloud) dari field `deliverables` pada Mock_Data_Module.
6. THE Project_Scope_Section SHALL menampilkan ringkasan spesifikasi teknis: resolusi minimum foto dan format output dari field `spesifikasi_teknis` pada Mock_Data_Module.
7. THE Project_Scope_Section SHALL menggunakan layout card atau panel dengan background `--color-surface` dan border radius konsisten dengan design system.

### Requirement 4: Peta Area Inspeksi

**User Story:** Sebagai pengguna (Client atau Pilot), saya ingin melihat peta interaktif yang menunjukkan area inspeksi secara visual, sehingga saya memahami cakupan geografis proyek dan lokasi titik-titik inspeksi spesifik.

#### Acceptance Criteria

1. THE Inspection_Area_Map SHALL me-render Mapbox GL JS map menggunakan Mapbox_Token dari `import.meta.env.VITE_MAPBOX_TOKEN`.
2. THE Inspection_Area_Map SHALL menggunakan style `mapbox://styles/mapbox/dark-v11`.
3. THE Inspection_Area_Map SHALL memiliki tinggi container 400px.
4. THE Inspection_Area_Map SHALL menampilkan polygon/area yang di-highlight dengan fill semi-transparan `--color-accent` dan stroke solid `--color-accent` untuk menunjukkan zona inspeksi.
5. THE Inspection_Area_Map SHALL menampilkan marker pada titik-titik inspeksi spesifik di dalam area polygon dari field `titik_inspeksi` pada Mock_Data_Module.
6. THE Inspection_Area_Map SHALL mengatur zoom level secara otomatis agar bounding box area inspeksi fit di dalam viewport peta.
7. THE Inspection_Area_Map SHALL menampilkan koordinat GPS area (batas bounding box) di bawah peta dalam format derajat desimal.
8. THE Inspection_Area_Map SHALL di-load secara lazy menggunakan React `lazy()` + Suspense.
9. WHILE Inspection_Area_Map belum selesai dimuat, THE section SHALL menampilkan fallback placeholder berupa div berwarna `--color-primary` dengan spinner dan teks "Memuat peta area inspeksi…".
10. IF Mapbox gagal dimuat, THEN THE Inspection_Area_Map SHALL menampilkan pesan "Peta tidak tersedia" beserta daftar koordinat titik inspeksi dalam format teks.

### Requirement 5: Timeline Proyek

**User Story:** Sebagai pengguna (Client atau Pilot), saya ingin melihat progres proyek dalam bentuk timeline horizontal, sehingga saya langsung tahu di tahap mana proyek berada saat ini.

#### Acceptance Criteria

1. THE Project_Timeline_Section SHALL menampilkan timeline horizontal dengan lima Project_Milestone berurutan: "Posted", "Bidding Open", "Pilot Selected", "Inspection In Progress", "Report Ready".
2. THE Project_Milestone SHALL menampilkan titik dengan ikon, label milestone, dan tanggal dari field `milestones` pada Mock_Data_Module.
3. THE Project_Milestone dengan status `completed` SHALL menampilkan ikon centang berwarna `--color-success` dan garis penghubung terisi `--color-accent`.
4. THE Project_Milestone dengan status `in_progress` SHALL menjalankan pulse animation `--color-accent` pada titiknya dengan durasi siklus antara 1.2s dan 2s.
5. THE Project_Milestone dengan status `upcoming` SHALL menampilkan titik dengan opacity tereduksi antara 0.3 dan 0.5 dan garis penghubung berwarna abu netral.
6. THE Project_Timeline_Section SHALL menggunakan style visual yang konsisten dengan Section_Project_Timeline pada Client Dashboard (same design language).
7. THE status milestone yang ditampilkan SHALL konsisten dengan Project_Status_Badge di Hero Section (round-trip property: jika badge "in_progress" maka minimal satu milestone berstatus "in_progress").

### Requirement 6: Bidding Section — Client View

**User Story:** Sebagai Pak Hendra (Client), saya ingin melihat tabel komparatif semua penawaran pilot untuk proyek saya, sehingga saya bisa membandingkan dan memilih pilot terbaik berdasarkan harga, rating, dan kapabilitas.

#### Acceptance Criteria

1. WHERE Auth_Session_Mock memiliki role "client", THE Bidding_Section SHALL menampilkan Bid_Table dengan kolom berurutan: "Avatar", "Nama Pilot", "Badge SIAGA Verified", "Rating", "Harga Bid", "Estimasi Hari", "Drone Type", "Aksi".
2. THE Bid_Table SHALL menampilkan seluruh bid untuk projectId terkait dari Mock_Data_Module.
3. THE Bid_Table SHALL menampilkan kolom "Harga Bid" dalam format Rupiah dan kolom "Rating" sebagai bintang dengan nilai numerik.
4. WHEN user mengarahkan kursor ke baris Bid_Table, THE baris SHALL menerapkan highlight background `--color-accent` dengan opacity antara 5% dan 12%.
5. THE Bid_Table SHALL menyediakan tombol "Pilih Pilot" per baris yang membuka Pilot_Selection_Modal.
6. THE Pilot_Selection_Modal SHALL menampilkan ringkasan pilot terpilih, peringatan konfirmasi, tombol "Batal", dan tombol "Konfirmasi Pilihan".
7. WHEN user mengklik "Konfirmasi Pilihan" pada Pilot_Selection_Modal, THE modal SHALL menutup dan menampilkan Toast_Notification "Pilot berhasil dipilih!" (mock action).
8. THE Bid_Table SHALL menyediakan tombol "Lihat Profil" per baris yang membuka Pilot_Profile_Drawer dari sisi kanan layar.
9. THE Pilot_Profile_Drawer SHALL menampilkan: avatar, nama pilot, badge SIAGA Verified, rating, drone yang dimiliki, jumlah proyek selesai, dan area operasi.
10. WHERE status proyek "completed" atau "closed", THE Bidding_Section untuk Client SHALL TIDAK menampilkan Bid_Table dan SHALL menampilkan pesan "Bidding telah selesai untuk proyek ini".

### Requirement 7: Bidding Section — Pilot View

**User Story:** Sebagai Rizky (Pilot), saya ingin melihat jumlah kompetitor dan mengajukan penawaran saya melalui form sederhana, sehingga saya bisa berpartisipasi dalam bidding tanpa mengetahui harga kompetitor.

#### Acceptance Criteria

1. WHERE Auth_Session_Mock memiliki role "pilot", THE Bidding_Section SHALL menampilkan informasi "[N] pilot sudah mengajukan bid" dengan N diambil dari field `jumlah_bidder` pada Mock_Data_Module.
2. WHERE Auth_Session_Mock memiliki role "pilot", THE Bidding_Section SHALL TIDAK menampilkan harga bid, nama, atau detail kompetitor lain.
3. WHERE Auth_Session_Mock memiliki role "pilot" DAN pilot belum mengajukan bid DAN status proyek "open" atau "urgent" atau "deadline_dekat", THE Bidding_Section SHALL menampilkan Bid_Form.
4. THE Bid_Form SHALL menampilkan field input: "Harga Penawaran (Rp)" bertipe number, "Estimasi Hari Pengerjaan" bertipe number, "Catatan Teknis" bertipe textarea (opsional), dan "Drone yang akan digunakan" bertipe dropdown.
5. THE Bid_Form SHALL menampilkan tombol "Kirim Penawaran" dengan background gradient `--color-accent`.
6. WHEN user men-submit Bid_Form dengan field "Harga Penawaran" kosong atau bernilai 0, THE Bid_Form SHALL menampilkan pesan error "Harga penawaran wajib diisi".
7. WHEN user men-submit Bid_Form dengan field "Estimasi Hari" kosong atau bernilai 0, THE Bid_Form SHALL menampilkan pesan error "Estimasi hari wajib diisi".
8. WHEN user men-submit Bid_Form dengan seluruh field wajib valid, THE Bid_Form SHALL menampilkan loading state selama 800ms kemudian menampilkan Toast_Notification "Penawaran berhasil dikirim!".
9. WHEN mock submit bid berhasil, THE Bidding_Section SHALL mengganti Bid_Form dengan Bid_Summary_Card yang menampilkan ringkasan bid yang baru dikirim beserta badge "Bid Terkirim".
10. WHEN mock submit bid berhasil, THE Project_Hero_Section SHALL memperbarui tombol aksi menjadi "Bid Terkirim ✓" dengan style disabled.
11. WHERE pilot sudah mengajukan bid sebelumnya (state tersimpan dalam session), THE Bidding_Section SHALL menampilkan Bid_Summary_Card dan TIDAK menampilkan Bid_Form.
12. WHERE status proyek "completed" atau "closed", THE Bidding_Section untuk Pilot SHALL menampilkan pesan "Bidding telah ditutup untuk proyek ini" dan TIDAK menampilkan Bid_Form.
13. WHEN deadline proyek sudah lewat DAN status masih "open", THE Bid_Form SHALL disabled dan menampilkan pesan "Proyek sudah melewati deadline, bidding tidak tersedia".
14. THE Bidding_Section SHALL menjamin bahwa role "pilot" TIDAK pernah melihat harga bid pilot lain dalam kondisi apapun (correctness property: role-aware data isolation).

### Requirement 8: Spesifikasi Teknis Detail

**User Story:** Sebagai Pilot, saya ingin melihat spesifikasi teknis lengkap proyek sebelum mengajukan bid, sehingga saya bisa menilai apakah peralatan dan kapabilitas saya memenuhi persyaratan.

#### Acceptance Criteria

1. THE Technical_Specs_Section SHALL menampilkan card atau table dengan detail teknis dari field `spesifikasi_teknis` pada Mock_Data_Module.
2. THE Technical_Specs_Section SHALL menampilkan: resolusi foto minimum, format output (RAW, TIFF, MP4, LAS), standar yang harus dipenuhi (ISO, SNI), peralatan minimum (tipe drone, sensor), kondisi cuaca yang diizinkan, dan jam operasional penerbangan.
3. THE Technical_Specs_Section SHALL menggunakan layout grid atau table yang mudah di-scan secara visual dengan label di kiri dan nilai di kanan.
4. THE Technical_Specs_Section SHALL menggunakan ikon Lucide React yang relevan untuk setiap kategori spesifikasi.
5. THE Technical_Specs_Section SHALL visible untuk kedua role (Client dan Pilot).

### Requirement 9: Client Info Section (Pilot View)

**User Story:** Sebagai Rizky (Pilot), saya ingin melihat informasi perusahaan yang memposting proyek, sehingga saya bisa menilai kredibilitas client sebelum mengajukan bid.

#### Acceptance Criteria

1. WHERE Auth_Session_Mock memiliki role "pilot", THE Client_Info_Section SHALL ditampilkan.
2. WHERE Auth_Session_Mock memiliki role "client", THE Client_Info_Section SHALL TIDAK ditampilkan.
3. THE Client_Info_Section SHALL menampilkan card berisi: nama perusahaan dari field `client_nama` pada Mock_Data_Module, rating sebagai client (bintang), jumlah proyek selesai di SIAGA, member since (tahun bergabung), dan badge "Verified Company".
4. THE Client_Info_Section SHALL menggunakan style card dengan background `--color-surface` dan border radius konsisten.
5. THE Client_Info_Section SHALL menampilkan data dari field `client_info` pada Mock_Data_Module yang di-extend untuk halaman ini.

### Requirement 10: Related Projects (Pilot View)

**User Story:** Sebagai Rizky (Pilot), saya ingin melihat proyek serupa yang tersedia, sehingga saya bisa menemukan peluang bidding lain yang relevan dengan kapabilitas saya.

#### Acceptance Criteria

1. WHERE Auth_Session_Mock memiliki role "pilot", THE Related_Projects_Section SHALL ditampilkan.
2. WHERE Auth_Session_Mock memiliki role "client", THE Related_Projects_Section SHALL TIDAK ditampilkan.
3. THE Related_Projects_Section SHALL menampilkan maksimal 3 card proyek yang memiliki `jenis_infrastruktur` sama dengan proyek saat ini dari Mock_Data_Module.
4. IF tidak ada proyek lain dengan jenis infrastruktur sama, THE Related_Projects_Section SHALL menampilkan proyek dengan lokasi terdekat (provinsi sama) sebagai fallback.
5. THE Related_Projects_Section SHALL TIDAK menampilkan proyek yang sedang dilihat saat ini (exclude current projectId).
6. THE card proyek pada Related_Projects_Section SHALL menampilkan: nama proyek, jenis infrastruktur, lokasi, nilai kontrak dalam format Rupiah compact, dan status badge.
7. WHEN user mengklik card pada Related_Projects_Section, THE app SHALL navigasi ke `/project/:otherId` untuk proyek tersebut.
8. THE Related_Projects_Section SHALL menggunakan style card yang konsisten dengan Mission_Card pada Job Radar (glassmorphism dark panel, hover glow cyan).

### Requirement 11: Mock Data Module dan Konsistensi Data

**User Story:** Sebagai developer, saya ingin data proyek detail berasal dari satu modul mock data yang konsisten dengan Job Radar dan Client Dashboard, sehingga projectId yang diklik di halaman lain menampilkan data yang sama di halaman detail.

#### Acceptance Criteria

1. THE Project_Detail_Page SHALL membaca data proyek dari Mock_Data_Module yang shared atau extended dari `src/pages/JobRadar/mock-data.js`.
2. THE Project_Detail_Page SHALL TIDAK melakukan panggilan HTTP/API real.
3. THE Mock_Data_Module untuk Project_Detail_Page SHALL meng-extend setiap project entry dengan field tambahan: `luas_area` (number, km²), `jumlah_titik_inspeksi` (number), `deliverables` (array string), `spesifikasi_teknis` (object), `polygon_area` (array koordinat untuk Mapbox polygon), `titik_inspeksi` (array {lat, lng, label}), `milestones` (object 5 milestone dengan status dan date), `client_info` (object dengan rating, proyek_selesai, member_since, verified), dan `bids` (array bid entries untuk proyek ini).
4. THE field `id` pada Mock_Data_Module SHALL digunakan sebagai `projectId` pada URL dan sebagai key pencocokan data.
5. THE data yang ditampilkan pada Project_Detail_Page SHALL identik dengan data pada Mock_Data_Module untuk projectId yang sama (round-trip property: displayed data = source data).
6. THE jumlah bidder yang ditampilkan pada Bidding_Section SHALL konsisten dengan panjang array `bids` untuk proyek tersebut pada Mock_Data_Module.
7. THE Project_Detail_Page SHALL menjamin bahwa navigasi dari Job Radar Pin_Popup "Lihat Detail" dengan projectId tertentu menampilkan data proyek yang sama dengan yang ditampilkan di pin tersebut.

### Requirement 12: Performance dan Lazy Loading

**User Story:** Sebagai pengguna dengan koneksi terbatas, saya ingin halaman detail proyek tetap responsif dan section atas bisa digunakan tanpa menunggu peta berat selesai dimuat.

#### Acceptance Criteria

1. THE Inspection_Area_Map SHALL di-load secara lazy menggunakan React `lazy()` + Suspense agar bundle Mapbox GL JS tidak masuk initial chunk halaman.
2. THE section di bawah fold (Inspection_Area_Map, Technical_Specs_Section, Related_Projects_Section) SHALL menggunakan Viewport_Trigger untuk men-trigger render atau animasi hanya saat masuk viewport.
3. THE Project_Hero_Section dan Project_Scope_Section SHALL ter-render dan dapat di-interact tanpa menunggu Inspection_Area_Map selesai dimuat.
4. THE halaman SHALL menampilkan loading skeleton pada section yang belum siap, tanpa layout shift signifikan saat konten muncul.
5. THE pulse animation pada Project_Milestone SHALL menggunakan CSS transform dan opacity agar performant.
6. THE Project_Detail_Page SHALL avoid unnecessary re-render ketika state bid berubah — hanya Bidding_Section yang perlu re-render.

### Requirement 13: Responsive Behavior

**User Story:** Sebagai pengguna yang mengakses halaman dari berbagai perangkat, saya ingin layout halaman detail proyek tetap usable di desktop, tablet, dan mobile.

#### Acceptance Criteria

1. THE Project_Detail_Page SHALL menggunakan pendekatan desktop-first dengan graceful degradation untuk tablet dan mobile.
2. ON viewport width >= 1280px, THE halaman SHALL menampilkan layout full-width dengan section berderet vertikal dan Bidding_Section menggunakan tabel.
3. ON viewport width antara 768px dan 1279px, THE Inspection_Area_Map SHALL menyesuaikan tinggi menjadi 300px dan Bid_Table SHALL dapat di-scroll horizontal.
4. ON viewport width < 768px, THE Inspection_Area_Map SHALL menyesuaikan tinggi menjadi 250px.
5. ON viewport width < 768px, THE Bid_Table SHALL dialihkan ke layout card stack (satu card per bid) alih-alih tabel horizontal.
6. ON viewport width < 768px, THE Related_Projects_Section SHALL menampilkan card dalam layout stacked vertikal alih-alih grid horizontal.
7. ON viewport width >= 320px, THE Project_Detail_Page SHALL memastikan tidak ada horizontal scroll pada level halaman.
8. THE Breadcrumb SHALL tetap visible dan readable pada semua breakpoint.
9. THE Project_Hero_Section SHALL menyesuaikan padding dan font size pada mobile agar tetap readable tanpa overflow.

### Requirement 14: Accessibility

**User Story:** Sebagai pengguna yang memakai keyboard atau screen reader, saya ingin dapat menavigasi seluruh section halaman detail proyek tanpa hambatan.

#### Acceptance Criteria

1. THE Project_Detail_Page SHALL menggunakan semantic HTML: `<main>`, `<section>`, `<nav>` untuk Breadcrumb, `<h1>` untuk judul proyek, `<h2>` untuk judul section.
2. THE Breadcrumb SHALL menggunakan elemen `<nav>` dengan `aria-label="Breadcrumb"`.
3. THE Project_Status_Badge SHALL memiliki `aria-label` yang menyebutkan status proyek secara deskriptif.
4. THE Inspection_Area_Map SHALL memiliki `aria-label="Peta area inspeksi proyek"` dan role `img` sebagai fallback jika peta tidak interaktif.
5. THE Bid_Form SHALL memberi setiap input field elemen `<label>` yang terhubung melalui atribut `htmlFor` ke `id` input terkait.
6. WHEN sebuah field pada Bid_Form menampilkan pesan error, THE field SHALL memiliki `aria-invalid="true"` dan pesan error terhubung melalui `aria-describedby`.
7. THE Pilot_Selection_Modal SHALL mengelola focus trap saat terbuka dan mengembalikan focus ke tombol trigger saat ditutup.
8. THE Pilot_Selection_Modal SHALL dapat ditutup dengan tombol Escape.
9. THE Pilot_Profile_Drawer SHALL mengelola focus saat terbuka dan dapat ditutup dengan Escape.
10. THE Project_Detail_Page SHALL memiliki visible focus indicator `--color-accent` pada semua elemen interaktif yang menerima fokus keyboard.
11. THE Toast_Notification SHALL diumumkan melalui `aria-live="polite"`.
12. THE Project_Timeline_Section SHALL memiliki `aria-label` yang mendeskripsikan progres proyek secara ringkas untuk screen reader.

### Requirement 15: Edge Cases dan Error Handling

**User Story:** Sebagai pengguna, saya ingin halaman tetap memberikan feedback yang jelas dalam situasi tidak normal, sehingga saya tidak melihat halaman blank atau error yang membingungkan.

#### Acceptance Criteria

1. IF projectId pada URL tidak valid atau tidak ditemukan pada Mock_Data_Module, THEN THE Project_Detail_Page SHALL menampilkan Not_Found_State dengan ilustrasi, pesan "Proyek tidak ditemukan", dan tombol "Kembali ke Dashboard".
2. WHEN status proyek "completed", THE Bidding_Section SHALL hidden dan tombol "Generate Report" SHALL visible pada Hero Section (Client only).
3. WHEN deadline proyek sudah lewat DAN status masih "open", THE Project_Status_Badge SHALL menampilkan "Expired" dan THE Bid_Form SHALL disabled dengan pesan penjelasan.
4. WHERE pilot sudah mengajukan bid (state tersimpan dalam session), THE Bid_Form SHALL TIDAK ditampilkan dan Bid_Summary_Card SHALL ditampilkan sebagai gantinya.
5. IF Mapbox gagal dimuat pada Inspection_Area_Map, THEN THE section SHALL menampilkan fallback teks koordinat tanpa mem-crash halaman keseluruhan.
6. WHEN user navigasi ke `/project/:projectId` dengan projectId yang berbeda (mis. dari Related_Projects_Section), THE Project_Detail_Page SHALL me-reset seluruh state lokal dan me-render ulang dengan data proyek baru.
7. THE Project_Detail_Page SHALL membungkus seluruh halaman dalam error boundary yang menampilkan pesan error generik dan tombol "Muat Ulang" jika terjadi exception tak terduga.
8. WHILE Bid_Form sedang dalam loading state submit, THE tombol "Kirim Penawaran" SHALL disabled dan menampilkan spinner, mencegah double-submit.

### Requirement 16: Visual Konsistensi dan Brand

**User Story:** Sebagai pengguna SIAGA, saya ingin halaman detail proyek terasa satu kesatuan dengan halaman lain (Job Radar, Client Dashboard, Auth Pages), sehingga pengalaman visual konsisten dan profesional.

#### Acceptance Criteria

1. THE Project_Detail_Page SHALL TIDAK memperkenalkan warna atau font di luar Design_Tokens existing.
2. THE Project_Detail_Page SHALL menggunakan font Montserrat untuk seluruh heading dan font Inter untuk seluruh body/label/input.
3. THE Project_Detail_Page SHALL menggunakan `--color-accent` (#00D2FF) sebagai warna highlight untuk tombol utama, badge aktif, focus state, dan elemen interaktif.
4. THE glassmorphism style pada card dan section SHALL konsisten dengan style yang digunakan pada Client Dashboard dan Job Radar (background semi-transparan, blur, border halus).
5. THE hover effect pada card dan tombol SHALL konsisten: transform translateY negatif antara -4px dan -8px dengan transisi 150ms-300ms.
6. THE Project_Detail_Page SHALL mempertahankan scrollbar custom tipis berwarna cyan yang sudah ada di halaman lain.
7. THE page transition masuk ke halaman ini SHALL menggunakan animasi fade + slide-up yang sama dengan halaman lain (300ms-600ms).
