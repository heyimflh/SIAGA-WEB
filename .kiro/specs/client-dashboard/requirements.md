# Requirements Document

## Introduction

Fitur **client-dashboard** menambahkan halaman utama area authenticated untuk Persona A (Client — perwakilan perusahaan/BUMN pemilik aset infrastruktur kritis, diwakili oleh Pak Hendra, Manajer Pemeliharaan Aset PT PLN). Halaman ini menggantikan placeholder `/dashboard/client` yang saat ini disediakan oleh fitur auth-pages, dan menjadi command center bagi Client untuk: melihat ringkasan portofolio proyek (overview cards), memantau kondisi aset secara geospasial (Asset Monitoring Map berbasis Mapbox), mengikuti progres proyek aktif lewat timeline visual, mereview penawaran pilot (Bidding Review Table), dan melacak aktivitas terbaru (Activity Feed).

Halaman ini dibangun sebagai **single page overview** — seluruh section A sampai G ditampilkan dalam satu scroll vertikal pada route `/dashboard/client`, bukan sebagai sub-routes. Tombol "Buat Proyek Baru" hanya placeholder yang me-navigate ke `/dashboard/client/create-project` (Coming Soon page sederhana); wizard 4-step Create Project dibangun di spec terpisah berikutnya.

Karena target SEFEST 2026 berfokus pada demo frontend, tidak ada API backend nyata: seluruh data (proyek, aset, bidder, aktivitas) di-define dalam file `mock-data.js` ter-isolated agar mudah di-replace dengan API real nanti. Halaman wajib menjaga konsistensi visual ketat dengan landing page dan auth-pages existing (Design_Tokens, font Montserrat + Inter, custom cursor cyan, page transition fade + slide-up) dan menerapkan role gating melalui ProtectedRoute yang sudah ada dari fitur auth-pages.

## Glossary

- **SIAGA**: Nama platform — Sistem Inspeksi Aerial Geospasial Andalan.
- **Client_Dashboard**: Halaman pada route `/dashboard/client` yang merupakan subjek utama spec ini.
- **Client**: Role pengguna mewakili perusahaan/BUMN pemilik aset infrastruktur. Auth_Session_Mock dengan `role === "client"`.
- **Pilot**: Role pengguna mewakili pilot UAV/agensi drone. Auth_Session_Mock dengan `role === "pilot"`.
- **Auth_Session_Mock**: Penyimpanan client-side hasil fitur auth-pages yang menandai user sebagai logged in beserta role-nya.
- **ProtectedRoute**: Komponen route guard existing di `src/auth/ProtectedRoute.jsx` yang melakukan role gating.
- **Design_Tokens**: Variabel CSS existing — `--color-primary` (#0A192F), `--color-accent` (#00D2FF), `--color-surface` (#F4F7F6), `--color-danger` (#FF4C4C), `--color-success` (#00C48C), `--color-warning` (kuning untuk status "Perlu Perhatian"), font Montserrat (display), font Inter (body).
- **Dashboard_Layout_Shell**: Wadah layout halaman yang terdiri dari Sidebar, Topbar, dan Main_Content_Area.
- **Sidebar**: Panel navigasi vertikal kiri fixed dengan lebar antara 240px dan 280px, background `--color-primary`.
- **Sidebar_Menu_Item**: Salah satu item menu pada Sidebar — Dashboard, Proyek, Asset Map, Bidding, Laporan, Pengaturan.
- **Topbar**: Header horizontal di atas Main_Content_Area berisi greeting, tanggal, ikon notifikasi, dan ikon profile.
- **Main_Content_Area**: Area scrollable di kanan Sidebar yang memuat Section_Overview_Cards sampai Section_Quick_Stats_Footer.
- **Section_Overview_Cards**: Section A — empat metric card glassmorphism di baris atas Main_Content_Area.
- **Overview_Card**: Salah satu dari empat card pada Section_Overview_Cards (Proyek Aktif, Total Aset Terinspeksi, Budget Terpakai, Proyek Selesai Bulan Ini).
- **Section_Asset_Monitoring_Map**: Section B — mini Mapbox map menampilkan pin aset perusahaan.
- **Asset_Pin**: Marker custom pada Section_Asset_Monitoring_Map yang merepresentasikan satu aset.
- **Asset_Status**: Salah satu dari tiga nilai — `aman` (hijau), `perlu_perhatian` (kuning), `kritis` (merah dengan pulse animation).
- **Asset_Detail_Drawer**: Panel slide-in dari kanan yang muncul saat Asset_Pin diklik.
- **Map_Legend**: Indikator tiga warna status di pojok atas Section_Asset_Monitoring_Map.
- **Map_Filter**: Toggle filter status pada Section_Asset_Monitoring_Map dengan opsi "Semua", "Kritis Saja", "Perlu Perhatian Saja".
- **Map_Floating_Stats**: Strip transparan di atas peta menampilkan jumlah aset termonitor, kritis, dan perlu perhatian.
- **Section_Project_Timeline**: Section C — timeline horizontal dengan 5 milestone untuk satu proyek aktif.
- **Project_Milestone**: Salah satu dari lima milestone — `posted`, `bidding_open`, `pilot_selected`, `inspection_in_progress`, `report_ready`.
- **Project_Selector**: Tab atau dropdown pada Section_Project_Timeline untuk memilih proyek mana yang ditampilkan timeline-nya.
- **Section_Bidding_Review_Table**: Section D — tabel penawaran pilot untuk proyek dalam tahap bidding.
- **Bid_Row**: Satu baris pada Section_Bidding_Review_Table yang merepresentasikan penawaran satu pilot.
- **Bid_Sort_Key**: Salah satu kolom yang dapat di-sort — `harga`, `rating`, `estimasi_hari`.
- **Bid_Filter_Chip**: Filter chip di atas Section_Bidding_Review_Table — `siaga_verified_only`, `rating_min_4`.
- **Pilot_Profile_Drawer**: Panel slide-in yang menampilkan profil lengkap pilot saat tombol "Lihat Profil" di Bid_Row diklik.
- **Pilot_Selection_Modal**: Modal konfirmasi yang muncul saat tombol "Pilih Pilot" di Bid_Row diklik.
- **Section_Recent_Activity_Feed**: Section E — timeline vertikal aktivitas terbaru (8-12 item).
- **Activity_Item**: Satu entri pada Section_Recent_Activity_Feed dengan ikon, deskripsi, dan timestamp relatif.
- **Section_Quick_Stats_Footer**: Section F — strip horizontal di bagian bawah dengan 3 angka count-up.
- **Mock_Data_Module**: File `mock-data.js` yang menjadi single source of truth untuk seluruh data dummy halaman ini.
- **Mapbox_Token**: Token publik Mapbox GL JS yang sudah tersedia di `.env` dan dipakai oleh JobRadarSection landing page.
- **Page_Transition**: Animasi fade + slide-up existing yang membungkus route, durasi 300ms-600ms.
- **Viewport_Trigger**: Mekanisme (Intersection Observer atau ScrollTrigger) yang men-trigger animasi/render hanya ketika elemen masuk viewport.

## Requirements

### Requirement 1: Routing dan Role Gating

**User Story:** Sebagai Pak Hendra (Client) yang sudah login, saya ingin halaman Client_Dashboard hanya bisa diakses oleh akun dengan role "client", sehingga data perusahaan saya tidak terekspos ke pengguna lain dan saya tidak melihat dashboard pilot yang tidak relevan.

#### Acceptance Criteria

1. THE Client_Dashboard SHALL ter-render pada route `/dashboard/client`.
2. THE Client_Dashboard SHALL dibungkus oleh ProtectedRoute existing dengan parameter `requestedRole="client"`.
3. WHEN Auth_Session_Mock memiliki `role === "client"` dan user mengakses `/dashboard/client`, THE Client_Dashboard SHALL ter-render.
4. IF Auth_Session_Mock kosong saat user mencoba mengakses `/dashboard/client`, THEN THE ProtectedRoute SHALL me-redirect user ke `/login`.
5. IF Auth_Session_Mock memiliki `role === "pilot"` saat user mencoba mengakses `/dashboard/client`, THEN THE ProtectedRoute SHALL me-redirect user ke `/dashboard/pilot`.
6. WHEN Client_Dashboard di-mount setelah berhasil melewati ProtectedRoute, THE Page_Transition SHALL menjalankan animasi fade + slide-up dengan durasi antara 300ms dan 600ms.
6a. IF Client_Dashboard mengalami error render (mis. exception pada salah satu section) saat di-mount, THEN THE Page_Transition SHALL dibatalkan atau diabaikan dan THE Client_Dashboard SHALL menampilkan error state segera tanpa menunggu animasi selesai.
7. WHEN user me-refresh halaman pada `/dashboard/client` dengan Auth_Session_Mock yang valid, THE Client_Dashboard SHALL kembali ter-render tanpa flash kembali ke `/login`.

### Requirement 2: Layout Shell — Sidebar Navigasi

**User Story:** Sebagai Client, saya ingin sidebar navigasi yang konsisten di kiri layar, sehingga saya dapat berpindah antar area dashboard dengan cepat dan tahu di mana posisi saya saat ini.

#### Acceptance Criteria

1. THE Dashboard_Layout_Shell SHALL menampilkan Sidebar di sisi kiri layar dengan posisi fixed dan lebar antara 240px dan 280px pada viewport >= 1280px.
2. THE Sidebar SHALL menggunakan background warna `--color-primary` (#0A192F).
3. THE Sidebar SHALL menampilkan logo SIAGA berukuran kecil di area paling atas.
4. THE Sidebar SHALL menampilkan blok identitas user di bawah logo, berisi avatar, nama perusahaan dari Auth_Session_Mock, dan badge role bertuliskan "Client".
5. THE Sidebar SHALL menampilkan enam Sidebar_Menu_Item secara berurutan: Dashboard, Proyek, Asset Map, Bidding, Laporan, Pengaturan.
6. THE Sidebar_Menu_Item SHALL memiliki ikon dari pustaka Lucide React di sisi kiri label.
7. WHEN Client_Dashboard ter-render, THE Sidebar_Menu_Item "Dashboard" SHALL berada dalam state aktif.
8. THE Sidebar_Menu_Item dalam state aktif SHALL menampilkan garis vertikal `--color-accent` setebal antara 2px dan 4px di tepi kiri item dan background tipis `--color-accent` dengan opacity antara 8% dan 15%.
9. THE Sidebar SHALL menampilkan tombol "Buat Proyek Baru" dengan background gradient menggunakan `--color-accent` di area menu utama.
10. WHEN user mengklik tombol "Buat Proyek Baru", THE Client_Dashboard SHALL navigasi ke route `/dashboard/client/create-project`.
11. THE Sidebar SHALL menampilkan tombol "Logout" di area paling bawah Sidebar.
12. WHEN user mengklik tombol "Logout", THE Client_Dashboard SHALL menghapus Auth_Session_Mock dan navigasi ke `/login` dengan animasi Page_Transition.
13. THE Client_Dashboard SHALL TIDAK memperkenalkan warna atau font di luar Design_Tokens existing.

### Requirement 3: Layout Shell — Topbar dan Main Content Area

**User Story:** Sebagai Client, saya ingin sapaan personal dan akses cepat ke notifikasi di bagian atas, sehingga saya merasa platform mengenali saya dan saya bisa segera melihat update penting.

#### Acceptance Criteria

1. THE Dashboard_Layout_Shell SHALL menampilkan Topbar di bagian atas Main_Content_Area.
2. THE Topbar SHALL menampilkan greeting bertuliskan "Halo, [Nama Perusahaan]" yang diambil dari Auth_Session_Mock.
3. THE Topbar SHALL menampilkan tanggal hari ini dalam format lokal Indonesia (mis. "Senin, 15 Januari 2026") di sisi kanan greeting atau di bawahnya.
4. THE Topbar SHALL menampilkan ikon notifikasi dengan badge angka yang menunjukkan jumlah notifikasi belum dibaca dari Mock_Data_Module.
4a. IF jumlah notifikasi belum dibaca bernilai 0, THEN THE Topbar SHALL TIDAK me-render badge angka pada ikon notifikasi.
5. THE Topbar SHALL menampilkan ikon profile di sisi paling kanan.
6. THE Main_Content_Area SHALL menggunakan background warna `--color-surface` (#F4F7F6).
7. THE Main_Content_Area SHALL dapat di-scroll secara vertikal saat konten melebihi tinggi viewport.
8. WHILE user men-scroll Main_Content_Area, THE Sidebar SHALL TIDAK ikut bergerak (Sidebar tetap fixed).

### Requirement 4: Section A — Overview Cards

**User Story:** Sebagai Pak Hendra, saya ingin empat metric card di baris atas yang merangkum status portofolio proyek saya, sehingga dalam tiga detik pertama saya tahu kondisi keseluruhan tanpa harus mencari di mana-mana.

#### Acceptance Criteria

1. THE Section_Overview_Cards SHALL menampilkan empat Overview_Card pada baris paling atas Main_Content_Area.
2. THE Overview_Card SHALL menggunakan style glassmorphism dengan background semi-transparan dan blur tipis di atas Main_Content_Area.
3. THE Overview_Card pertama SHALL menampilkan label "Proyek Aktif", angka utama, ikon proyek, dan indikator tren berupa arrow naik/turun beserta persentase perubahan terhadap bulan lalu.
4. THE Overview_Card kedua SHALL menampilkan label "Total Aset Terinspeksi", angka utama, dan progress bar berwarna `--color-accent` yang mengisi proporsional terhadap target tahunan dari Mock_Data_Module.
5. THE Overview_Card ketiga SHALL menampilkan label "Budget Terpakai", angka utama dalam format Rupiah, dan donut chart Recharts yang menunjukkan persentase budget terpakai vs sisa budget.
6. THE Overview_Card keempat SHALL menampilkan label "Proyek Selesai Bulan Ini", angka utama, dan badge berwarna `--color-success` (#00C48C) yang memuat selisih jumlah dibanding bulan lalu (mis. "+3 vs bulan lalu").
7. ON viewport width >= 1280px, THE Section_Overview_Cards SHALL menggunakan grid 4 kolom sejajar.
8. ON viewport width antara 768px dan 1279px, THE Section_Overview_Cards SHALL menggunakan grid 2 kolom dengan total 2 baris.
9. ON viewport width < 768px, THE Section_Overview_Cards SHALL menggunakan grid 1 kolom dengan card stacked vertikal.
10. WHEN user mengarahkan kursor ke Overview_Card, THE Overview_Card SHALL menerapkan efek terangkat berupa transform translateY antara -4px dan -8px dengan durasi transisi antara 150ms dan 300ms.
11. WHEN Overview_Card pertama kali masuk viewport, THE angka utama SHALL menjalankan animasi count-up dari 0 ke nilai final dengan durasi antara 800ms dan 1500ms.
12. THE animasi count-up SHALL berakhir tepat pada nilai numerik yang berasal dari Mock_Data_Module (round-trip property: angka final yang ditampilkan sama persis dengan nilai sumber).

### Requirement 5: Section B — Asset Monitoring Map

**User Story:** Sebagai Pak Hendra, saya ingin peta interaktif yang menampilkan seluruh aset perusahaan saya dengan status kondisinya, sehingga saya dapat dengan cepat mengidentifikasi aset yang butuh perhatian segera.

#### Acceptance Criteria

1. THE Section_Asset_Monitoring_Map SHALL me-render Mapbox GL JS map menggunakan Mapbox_Token yang dibaca dari `import.meta.env.VITE_MAPBOX_TOKEN`.
2. THE Section_Asset_Monitoring_Map SHALL menggunakan style `mapbox://styles/mapbox/dark-v11`.
3. THE Section_Asset_Monitoring_Map SHALL memiliki tinggi container antara 480px dan 560px (bukan fullscreen).
4. THE Section_Asset_Monitoring_Map SHALL menampilkan satu Asset_Pin untuk setiap aset pada Mock_Data_Module, dengan jumlah aset antara 5 dan 10.
5. THE Asset_Pin dengan Asset_Status `aman` SHALL berwarna `--color-success` (#00C48C).
6. THE Asset_Pin dengan Asset_Status `perlu_perhatian` SHALL berwarna kuning yang sudah didefinisikan di Design_Tokens (mis. `--color-warning`).
7. THE Asset_Pin dengan Asset_Status `kritis` SHALL berwarna `--color-danger` (#FF4C4C) dan menjalankan pulse animation berupa lingkaran yang mengembang dan memudar berulang dengan durasi siklus antara 1.2s dan 2s.
8. THE Section_Asset_Monitoring_Map SHALL menampilkan Map_Legend di pojok kiri atas peta yang berisi tiga indikator warna beserta labelnya: "Aman", "Perlu Perhatian", "Kritis".
9. THE Section_Asset_Monitoring_Map SHALL menampilkan Map_Filter sebagai grup tombol toggle dengan opsi: "Semua", "Kritis Saja", "Perlu Perhatian Saja".
10. WHEN user mengklik salah satu opsi Map_Filter, THE Section_Asset_Monitoring_Map SHALL menampilkan hanya Asset_Pin yang Asset_Status-nya cocok dengan filter aktif (atau seluruh pin jika filter "Semua" aktif).
10a. IF tidak ada Asset_Pin pada Mock_Data_Module yang Asset_Status-nya cocok dengan opsi Map_Filter tertentu (mis. tidak ada aset `kritis`), THEN THE Map_Filter SHALL menonaktifkan atau menyembunyikan opsi tersebut sehingga user tidak dapat memilih filter yang akan menghasilkan peta kosong.
11. WHILE user men-scroll Main_Content_Area menjauh dari Section_Asset_Monitoring_Map dan kemudian kembali, THE Map_Filter SHALL mempertahankan opsi yang sebelumnya aktif (state filter persistent dalam session).
12. THE Section_Asset_Monitoring_Map SHALL menampilkan Map_Floating_Stats di atas peta dengan teks "[N] Aset Termonitor | [M] Kritis | [K] Perlu Perhatian", dengan N, M, K diambil dari Mock_Data_Module.
13. WHEN user mengklik Asset_Pin, THE Asset_Detail_Drawer SHALL slide-in dari sisi kanan layar dengan animasi durasi antara 200ms dan 400ms.
14. THE Asset_Detail_Drawer SHALL menampilkan: foto aset, nama aset, lokasi, status terakhir inspeksi, tanggal inspeksi terakhir, link "Lihat Detail", dan link "Generate Report".
15. WHEN user mengklik tombol close pada Asset_Detail_Drawer atau mengklik area di luar drawer, THE Asset_Detail_Drawer SHALL slide-out kembali ke kanan.
16. THE Section_Asset_Monitoring_Map SHALL di-load dengan React Suspense agar tidak memblokir render section lain.
17. WHILE Mapbox GL JS belum selesai dimuat, THE Section_Asset_Monitoring_Map SHALL menampilkan fallback placeholder berupa div berwarna `--color-primary` dengan spinner kecil dan teks "Memuat peta…".
18. IF Mapbox GL JS gagal dimuat (mis. token invalid, network error), THEN THE Section_Asset_Monitoring_Map SHALL menampilkan pesan error "Peta tidak tersedia saat ini" beserta daftar fallback teks aset (nama + status) tanpa mem-crash halaman.

### Requirement 6: Section C — Project Timeline

**User Story:** Sebagai Pak Hendra, saya ingin melihat progres proyek aktif saya dalam bentuk timeline horizontal premium, sehingga saya bisa langsung tahu di tahap mana proyek berada tanpa membaca tabel.

#### Acceptance Criteria

1. THE Section_Project_Timeline SHALL menampilkan timeline horizontal untuk satu proyek aktif yang dipilih.
2. THE Section_Project_Timeline SHALL menampilkan Project_Selector berupa tab atau dropdown yang berisi daftar proyek aktif dari Mock_Data_Module.
3. THE Project_Selector SHALL secara default memilih proyek pertama pada list `proyek_aktif` di Mock_Data_Module saat halaman pertama dimuat.
4. WHILE user berada pada session yang sama dan men-scroll keluar lalu kembali ke Section_Project_Timeline, THE Project_Selector SHALL mempertahankan proyek yang sebelumnya dipilih (tab persistent dalam session).
4a. WHEN user memilih sebuah proyek pada Project_Selector, THE Client_Dashboard SHALL menyimpan ID proyek terpilih ke browser storage (mis. `localStorage` dengan key `siaga.client.lastSelectedProjectId`) sehingga pilihan dipertahankan lintas sesi.
4b. WHEN Client_Dashboard di-mount dan terdapat ID proyek tersimpan pada browser storage yang masih ada di `Mock_Data_Module.proyek_aktif`, THE Project_Selector SHALL memilih proyek tersebut alih-alih proyek pertama default.
4c. IF ID proyek tersimpan pada browser storage tidak lagi ada pada `Mock_Data_Module.proyek_aktif`, THEN THE Project_Selector SHALL fallback ke proyek pertama default sesuai poin 3.
5. THE Section_Project_Timeline SHALL menampilkan lima Project_Milestone berderet horizontal dengan urutan: "Posted", "Bidding Open", "Pilot Selected", "Inspection In Progress", "Report Ready".
6. THE Project_Milestone SHALL menampilkan titik dengan ikon Lucide, label milestone, tanggal, dan status (`completed`, `in_progress`, `upcoming`).
7. THE Section_Project_Timeline SHALL menampilkan garis penghubung horizontal antar Project_Milestone yang berfungsi sebagai progress bar berwarna `--color-accent` dan mengisi sesuai status milestone aktual.
8. THE Project_Milestone dengan status `in_progress` SHALL menjalankan pulse animation `--color-accent` pada titiknya dengan durasi siklus antara 1.2s dan 2s.
9. THE Project_Milestone dengan status `completed` SHALL menampilkan ikon centang berwarna `--color-success`.
10. THE Project_Milestone dengan status `upcoming` SHALL menampilkan titik dengan opacity tereduksi dan tanpa animasi.
11. WHEN user memilih proyek lain melalui Project_Selector, THE Section_Project_Timeline SHALL memperbarui seluruh Project_Milestone, tanggal, dan progress bar sesuai data proyek terpilih.

### Requirement 7: Section D — Bidding Review Table

**User Story:** Sebagai Pak Hendra, saya ingin tabel komparatif yang membandingkan penawaran beberapa pilot untuk proyek saya yang sedang dalam tahap bidding, sehingga saya bisa memilih pilot terbaik dengan kriteria yang transparan.

#### Acceptance Criteria

1. THE Section_Bidding_Review_Table SHALL menampilkan tabel dengan kolom berurutan: "Avatar Pilot", "Nama Pilot", "Badge SIAGA Verified", "Rating", "Harga Bid", "Estimasi Hari", "Drone Type", "Aksi".
2. THE Section_Bidding_Review_Table SHALL menampilkan antara 5 dan 7 Bid_Row yang dibaca dari Mock_Data_Module.
2a. THE Section_Bidding_Review_Table SHALL menerapkan threshold rating minimum 2 bintang sebagai filter dasar — Bid_Row dengan `rating < 2` SHALL TIDAK pernah ditampilkan, terlepas dari status Bid_Filter_Chip.
3. THE Bid_Row SHALL menampilkan kolom "Harga Bid" dalam format Rupiah dan kolom "Rating" sebagai bintang dengan nilai numerik di sebelahnya.
4. WHEN user mengarahkan kursor ke Bid_Row, THE Bid_Row SHALL menerapkan highlight background `--color-accent` dengan opacity antara 5% dan 12%.
5. THE Section_Bidding_Review_Table SHALL menyediakan kontrol sort untuk Bid_Sort_Key dengan nilai `harga`, `rating`, dan `estimasi_hari`, masing-masing dapat diurutkan ascending atau descending.
6. WHEN user mengklik kontrol sort untuk salah satu Bid_Sort_Key, THE Section_Bidding_Review_Table SHALL mengurutkan Bid_Row sesuai kunci dan arah yang dipilih.
7. THE Section_Bidding_Review_Table SHALL menampilkan Bid_Filter_Chip di atas tabel dengan opsi "SIAGA Verified Only" dan "Rating Min 4 Bintang".
8. WHEN Bid_Filter_Chip "SIAGA Verified Only" diaktifkan, THE Section_Bidding_Review_Table SHALL menampilkan hanya Bid_Row yang `siaga_verified === true`.
9. WHEN Bid_Filter_Chip "Rating Min 4 Bintang" diaktifkan, THE Section_Bidding_Review_Table SHALL menampilkan hanya Bid_Row yang `rating >= 4`.
10. WHEN kedua Bid_Filter_Chip diaktifkan bersamaan, THE Section_Bidding_Review_Table SHALL menampilkan hanya Bid_Row yang memenuhi kedua kondisi (kombinasi AND).
10a. IF kombinasi Bid_Filter_Chip aktif menyebabkan tidak ada Bid_Row yang lolos filter (padahal data bid tersedia untuk proyek terpilih), THEN THE Section_Bidding_Review_Table SHALL menampilkan pesan "Tidak ada penawaran yang cocok dengan filter aktif" beserta ringkasan filter yang sedang diterapkan dan tombol "Reset Filter", BUKAN empty state Requirement 7.14.
11. THE Bid_Row SHALL menyediakan tombol "Lihat Profil" yang membuka Pilot_Profile_Drawer dari sisi kanan layar.
12. THE Bid_Row SHALL menyediakan tombol "Pilih Pilot" yang membuka Pilot_Selection_Modal dengan animasi scale-in durasi antara 150ms dan 300ms.
13. THE Pilot_Selection_Modal SHALL menampilkan ringkasan pilot terpilih, peringatan konfirmasi, tombol "Batal", dan tombol "Konfirmasi Pilihan".
14. IF tidak ada Bid_Row yang tersedia untuk proyek terpilih (mis. proyek baru tanpa bid), THEN THE Section_Bidding_Review_Table SHALL menampilkan empty state berisi ikon, teks "Belum ada penawaran masuk untuk proyek ini", dan tombol opsional "Promosikan Proyek".

### Requirement 8: Section E — Recent Activity Feed

**User Story:** Sebagai Pak Hendra, saya ingin feed aktivitas terbaru di sisi kanan dashboard, sehingga saya tetap update terhadap setiap perubahan tanpa harus berpindah halaman.

#### Acceptance Criteria

1. THE Section_Recent_Activity_Feed SHALL menampilkan timeline vertikal yang berisi antara 8 dan 12 Activity_Item dari Mock_Data_Module.
2. THE Activity_Item SHALL menampilkan ikon Lucide yang sesuai dengan tipe aktivitas, deskripsi singkat, dan timestamp relatif (mis. "5 menit lalu", "2 jam lalu").
3. THE Section_Recent_Activity_Feed SHALL memiliki max-height yang membatasi tinggi container dan menyediakan scroll vertikal internal saat jumlah Activity_Item melebihi tinggi tersebut.
4. WHEN sebuah Activity_Item baru ditambahkan ke daftar (simulasi mock), THE Activity_Item baru SHALL menjalankan pulse animation subtle pada ikonnya selama satu siklus.
5. ON viewport width >= 1280px, THE Section_Recent_Activity_Feed SHALL ditempatkan di sisi kanan grid Main_Content_Area dengan opsi sticky agar tetap terlihat saat user men-scroll bagian tabel.
6. ON viewport width < 1280px, THE Section_Recent_Activity_Feed SHALL ditempatkan secara stacked di bawah Section_Bidding_Review_Table.

### Requirement 9: Section F — Quick Stats Footer

**User Story:** Sebagai Pak Hendra, saya ingin melihat ringkasan dampak tahunan dari kerjasama saya dengan SIAGA di bagian bawah dashboard, sehingga saya merasa investasi saya terbukti secara angka.

#### Acceptance Criteria

1. THE Section_Quick_Stats_Footer SHALL menampilkan strip horizontal di bagian paling bawah Main_Content_Area dengan tiga statistik berdampingan.
2. THE Section_Quick_Stats_Footer SHALL menampilkan statistik pertama bertuliskan "Total Hemat dari Inspeksi Konvensional: [Rupiah]" dengan nilai dari Mock_Data_Module.
3. THE Section_Quick_Stats_Footer SHALL menampilkan statistik kedua bertuliskan "Total Pilot Bekerja Sama: [N]" dengan nilai dari Mock_Data_Module.
4. THE Section_Quick_Stats_Footer SHALL menampilkan statistik ketiga bertuliskan "Rata-rata Waktu Bidding: [X] hari" dengan nilai dari Mock_Data_Module.
5. WHEN Section_Quick_Stats_Footer pertama kali masuk viewport, THE tiga angka statistik SHALL menjalankan animasi count-up dari 0 ke nilai final dengan durasi antara 800ms dan 1500ms.
5a. IF salah satu nilai statistik bernilai 0, THEN THE animasi count-up untuk statistik tersebut SHALL TIDAK dijalankan dan THE angka SHALL ditampilkan langsung sebagai "0".

### Requirement 10: Mock Data Module dan Konsistensi Antar Section

**User Story:** Sebagai developer, saya ingin seluruh data dummy halaman terpusat dalam satu modul yang ter-isolated, sehingga ketika API real tersedia, saya cukup mengganti modul tersebut tanpa menyentuh komponen UI.

#### Acceptance Criteria

1. THE Client_Dashboard SHALL membaca seluruh data dinamis (proyek, aset, bidder, aktivitas, statistik) dari Mock_Data_Module pada path `src/pages/ClientDashboard/mock-data.js` (atau path equivalent yang tunggal).
2. THE Client_Dashboard SHALL TIDAK melakukan panggilan HTTP/API real ke endpoint manapun.
3. THE Mock_Data_Module SHALL mengekspor struktur data dengan field minimum: `perusahaan`, `overview_metrics`, `assets`, `proyek_aktif`, `bids`, `activities`, `quick_stats`.
4. THE jumlah aset pada `Mock_Data_Module.assets` SHALL identik dengan angka yang ditampilkan pada Map_Floating_Stats "[N] Aset Termonitor".
5. THE jumlah aset dengan `status === "kritis"` pada `Mock_Data_Module.assets` SHALL identik dengan angka "[M] Kritis" pada Map_Floating_Stats.
6. THE jumlah aset dengan `status === "perlu_perhatian"` pada `Mock_Data_Module.assets` SHALL identik dengan angka "[K] Perlu Perhatian" pada Map_Floating_Stats.
7. THE nilai pada Overview_Card "Total Aset Terinspeksi" SHALL konsisten dengan agregasi data aset pada `Mock_Data_Module.assets` (mis. `assets.length` atau field agregat yang sudah didefinisikan).
8. THE nilai pada Overview_Card "Proyek Aktif" SHALL konsisten dengan jumlah entri `Mock_Data_Module.proyek_aktif` yang berstatus aktif.
9. THE Client_Dashboard SHALL menjamin bahwa untuk setiap render halaman, angka pada Overview_Card, Map_Floating_Stats, dan Section_Quick_Stats_Footer berasal dari sumber tunggal yang konsisten (round-trip property: nilai yang ditampilkan = nilai pada Mock_Data_Module).

### Requirement 11: Performance — Lazy Loading dan Viewport-Triggered Rendering

**User Story:** Sebagai Pak Hendra yang membuka dashboard dari koneksi kantor, saya ingin halaman terasa ringan dan responsif, sehingga saya tidak menunggu lama hanya untuk melihat overview cards di bagian atas.

#### Acceptance Criteria

1. THE Section_Asset_Monitoring_Map SHALL di-load secara lazy menggunakan React `lazy()` + Suspense agar bundle Mapbox GL JS tidak masuk ke initial chunk halaman.
2. THE donut chart Recharts pada Overview_Card "Budget Terpakai" SHALL hanya melakukan render visual saat Overview_Card terkait masuk viewport (Viewport_Trigger), bukan pada saat halaman pertama mount.
3. THE animasi count-up pada Overview_Card SHALL hanya dijalankan saat Overview_Card masuk viewport.
4. THE animasi count-up pada Section_Quick_Stats_Footer SHALL hanya dijalankan saat Section_Quick_Stats_Footer masuk viewport.
5. WHILE Mock_Data_Module belum siap atau chart library belum termuat, THE Overview_Card dan section terkait SHALL menampilkan loading skeleton (placeholder shape berwarna abu netral) tanpa membiarkan layout mengalami layout shift signifikan.
5a. THE loading skeleton untuk chart SHALL tetap ditampilkan hingga chart benar-benar selesai render visualnya, terlepas dari status pemuatan dependensi (data + library) — skeleton tidak boleh hilang sebelum elemen chart aktual tampil.
5b. THE Client_Dashboard SHALL selalu menampilkan loading skeleton ketika konten belum siap, terlepas dari apakah sistem dapat menjamin tidak terjadi layout shift atau tidak.
6. THE Client_Dashboard SHALL menjamin bahwa Section_Overview_Cards tetap dapat di-interact (klik, hover) tanpa harus menunggu Section_Asset_Monitoring_Map selesai dimuat.

### Requirement 12: Responsive Behavior

**User Story:** Sebagai Pak Hendra yang sesekali mengecek dashboard dari tablet atau ponsel saat di lapangan, saya ingin layout halaman tetap usable di layar kecil tanpa elemen yang menutupi konten.

#### Acceptance Criteria

1. ON viewport width >= 1280px, THE Dashboard_Layout_Shell SHALL menampilkan Sidebar dalam bentuk full (lebar 240px-280px dengan label menu).
2. ON viewport width antara 768px dan 1279px, THE Sidebar SHALL collapse menjadi mode icon-only dengan lebar antara 64px dan 80px tanpa label menu.
3. ON viewport width < 768px, THE Sidebar SHALL TIDAK ditampilkan secara fixed dan SHALL diakses sebagai drawer yang dibuka/ditutup melalui ikon hamburger pada Topbar.
4. ON viewport width < 768px, THE Topbar SHALL menampilkan ikon hamburger untuk membuka Sidebar drawer.
5. ON viewport width < 768px, THE Section_Bidding_Review_Table SHALL dapat di-scroll horizontal di dalam container atau dialihkan ke layout card per Bid_Row.
6. ON viewport width >= 320px, THE Client_Dashboard SHALL memastikan tidak ada horizontal scroll pada level halaman (kecuali container tabel yang memang men-scroll horizontal sesuai poin 5).

### Requirement 13: Accessibility

**User Story:** Sebagai pengguna yang memakai keyboard atau screen reader, saya ingin dapat menavigasi seluruh fungsi Client_Dashboard tanpa hambatan, sehingga halaman ini dapat diakses oleh siapa pun.

#### Acceptance Criteria

1. THE Sidebar SHALL menggunakan elemen `<nav>` semantic dengan atribut `aria-label="Navigasi utama"`.
2. THE Main_Content_Area SHALL menggunakan elemen `<main>` semantic.
3. THE Section_Recent_Activity_Feed SHALL menggunakan elemen `<aside>` semantic dengan atribut `aria-label` deskriptif.
4. THE Sidebar_Menu_Item SHALL dapat di-focus dan diaktifkan menggunakan keyboard (Tab untuk fokus, Enter atau Space untuk aktivasi).
5. THE Sidebar_Menu_Item dalam state aktif SHALL memiliki atribut `aria-current="page"`.
6. WHEN sebuah elemen interaktif menerima focus keyboard, THE Client_Dashboard SHALL menampilkan focus indicator visual yang kontras (mis. outline atau border `--color-accent`).
6a. THE focus indicator SHALL TIDAK boleh dibuat invisible (mis. via `outline: none` tanpa pengganti); indicator wajib visibel dan kontras.
7. THE tombol berikon-saja (ikon notifikasi, ikon profile, tombol close drawer, ikon hamburger) SHALL memiliki atribut `aria-label` deskriptif yang menjelaskan fungsinya.
8. THE Section_Bidding_Review_Table SHALL menggunakan elemen `<table>` semantic dengan `<thead>` dan `<tbody>`, dan setiap header kolom menggunakan `<th>` dengan atribut `scope="col"`.
9. THE kontrol sort pada Section_Bidding_Review_Table SHALL menggunakan atribut `aria-sort` dengan nilai `ascending`, `descending`, atau `none` sesuai state.
10. WHEN Asset_Detail_Drawer atau Pilot_Profile_Drawer terbuka, THE focus keyboard SHALL berpindah ke elemen pertama yang dapat di-focus di dalam drawer.
11. WHEN drawer atau Pilot_Selection_Modal terbuka dan user menekan tombol Escape, THE drawer atau modal SHALL tertutup.

### Requirement 14: Brand Visual Consistency

**User Story:** Sebagai Pak Hendra, saya ingin halaman Client_Dashboard terasa satu kesatuan dengan landing page dan halaman login yang sudah saya lihat sebelumnya, sehingga saya yakin sedang berada di platform SIAGA yang sama.

#### Acceptance Criteria

1. THE Client_Dashboard SHALL menggunakan font Montserrat untuk seluruh heading (H1-H4) dan font Inter untuk seluruh body, label, tabel, dan input.
2. THE Client_Dashboard SHALL menggunakan `--color-accent` (#00D2FF) sebagai warna utama untuk highlight aktif, tombol primary, progress bar, dan focus indicator.
3. THE Client_Dashboard SHALL menggunakan `--color-success` (#00C48C) untuk indikator status "Aman" dan badge positif.
4. THE Client_Dashboard SHALL menggunakan `--color-danger` (#FF4C4C) untuk indikator status "Kritis" dan pesan error.
5. THE Client_Dashboard SHALL mempertahankan custom cursor cyan dari landing page tetap aktif di seluruh halaman dashboard.
6. THE Client_Dashboard SHALL TIDAK memperkenalkan warna baru di luar Design_Tokens existing.
6a. WHERE sebuah elemen menjalankan peran ganda visual (mis. status indikator vs tombol primary), THE Client_Dashboard SHALL tetap memakai `--color-danger` HANYA untuk error/critical state dan `--color-accent` HANYA untuk elemen interaktif/aktif, sehingga tidak terjadi tabrakan makna warna.
7. THE Client_Dashboard SHALL TIDAK memperkenalkan font keluarga baru di luar Montserrat dan Inter.
8. WHEN user navigasi masuk dan keluar dari Client_Dashboard, THE Page_Transition fade + slide-up SHALL dijalankan dengan parameter durasi yang konsisten dengan halaman auth-pages existing.

### Requirement 15: Edge Cases — Empty, Error, dan Loading State

**User Story:** Sebagai Client baru yang belum memiliki proyek, atau saat ada masalah loading, saya ingin halaman tetap memberikan pesan jelas, sehingga saya tahu langkah selanjutnya yang harus dilakukan.

#### Acceptance Criteria

1. IF `Mock_Data_Module.proyek_aktif` kosong (perusahaan baru tanpa proyek), THEN THE Section_Project_Timeline SHALL menampilkan empty state berisi ikon, teks "Belum ada proyek aktif", dan tombol "Buat Proyek Baru" yang me-navigate ke `/dashboard/client/create-project`.
2. IF `Mock_Data_Module.assets` kosong, THEN THE Section_Asset_Monitoring_Map SHALL menampilkan peta kosong (tanpa pin) dengan overlay teks "Belum ada aset terdaftar" di tengah peta.
3. IF `Mock_Data_Module.bids` kosong untuk proyek terpilih, THEN THE Section_Bidding_Review_Table SHALL menampilkan empty state sesuai Requirement 7.14.
4. IF `Mock_Data_Module.activities` kosong, THEN THE Section_Recent_Activity_Feed SHALL menampilkan teks "Belum ada aktivitas terbaru".
5. IF Mapbox GL JS gagal dimuat, THEN THE Section_Asset_Monitoring_Map SHALL menampilkan error state sesuai Requirement 5.18 tanpa mem-crash render section lain.
5a. IF UI error state pada Section_Asset_Monitoring_Map sendiri gagal di-render (mis. dependencies UI rusak), THEN THE Section_Asset_Monitoring_Map SHALL menyediakan fallback paling dasar berupa teks HTML statis "Peta tidak dapat dimuat" yang dijamin tampil tanpa bergantung pada library tambahan.
6. WHILE Section_Asset_Monitoring_Map dalam proses lazy loading, THE Section_Asset_Monitoring_Map SHALL menampilkan placeholder loading sesuai Requirement 5.17.
7. WHILE Recharts donut chart pada Overview_Card "Budget Terpakai" belum siap render, THE Overview_Card SHALL menampilkan loading skeleton yang dimensinya sama dengan area chart final agar tidak terjadi layout shift.
7a. THE loading skeleton chart SHALL tetap ditampilkan sampai SELURUH dependensi chart (data Mock_Data_Module dan library Recharts) siap dan chart aktual telah ter-render visualnya.
8. IF user dengan koneksi sangat lambat membuka halaman dan Mock_Data_Module belum termuat, THEN THE Client_Dashboard SHALL menampilkan loading skeleton untuk seluruh Section_Overview_Cards selama maksimal yang wajar tanpa menampilkan layout kosong putih.

### Requirement 16: Logout Flow

**User Story:** Sebagai Pak Hendra yang selesai bekerja, saya ingin tombol logout yang aman dan jelas, sehingga session saya benar-benar berakhir dan akun saya tidak bisa diakses dari komputer ini.

#### Acceptance Criteria

1. WHEN user mengklik tombol "Logout" pada Sidebar, THE Client_Dashboard SHALL menghapus seluruh isi Auth_Session_Mock.
1a. IF penghapusan Auth_Session_Mock gagal (mis. exception storage), THEN THE Client_Dashboard SHALL TIDAK navigasi ke `/login` dan SHALL mempertahankan user di halaman dashboard sembari menampilkan pesan error "Logout gagal, silakan coba lagi".
2. WHEN proses penghapusan Auth_Session_Mock selesai, THE Client_Dashboard SHALL navigasi ke route `/login`.
3. WHEN navigasi ke `/login` ter-trigger akibat logout, THE Page_Transition fade + slide-up SHALL dijalankan.
3a. IF navigasi ke `/login` gagal atau dibatalkan (mis. interrupted), THEN THE Page_Transition SHALL TIDAK dieksekusi.
4. IF user menekan tombol back browser setelah logout, THEN THE ProtectedRoute SHALL me-redirect kembali ke `/login` (Auth_Session_Mock kosong = tidak boleh akses dashboard).
5. THE Client_Dashboard SHALL menjamin bahwa setelah klik Logout, tidak ada data sensitif (nama perusahaan, daftar aset, bid pilot) yang masih ter-render pada DOM saat halaman `/login` aktif.

### Requirement 17: Placeholder Route Create Project

**User Story:** Sebagai Pak Hendra yang ingin membuat proyek baru, saya ingin tombol "Buat Proyek Baru" mengarahkan saya ke halaman yang jelas, walaupun fitur lengkapnya belum ada, sehingga saya tahu proses tersebut sedang dipersiapkan.

#### Acceptance Criteria

1. THE Client_Dashboard SHALL menambahkan route `/dashboard/client/create-project` di konfigurasi Auth_Router yang dibungkus oleh ProtectedRoute dengan `requestedRole="client"`.
2. THE route `/dashboard/client/create-project` SHALL me-render halaman "Coming Soon" sederhana dengan judul "Buat Proyek Baru", subtitle "Wizard 4-step akan segera tersedia", ikon konstruksi atau drone, dan tombol "Kembali ke Dashboard" yang me-navigate ke `/dashboard/client`.
3. THE halaman "Coming Soon" SHALL menggunakan Design_Tokens yang sama dengan Client_Dashboard (warna, font, cursor, page transition).
4. IF user dengan role "pilot" mencoba mengakses `/dashboard/client/create-project`, THEN THE ProtectedRoute SHALL menampilkan pesan "Akses ditolak — halaman ini hanya untuk akun Client" selama durasi singkat (antara 800ms dan 1500ms) atau mencatat upaya akses ke console developer, kemudian me-redirect ke `/dashboard/pilot`.
5. IF user tanpa Auth_Session_Mock mencoba mengakses `/dashboard/client/create-project`, THEN THE ProtectedRoute SHALL me-redirect ke `/login`.
