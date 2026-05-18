# Requirements Document

## Introduction

Fitur **job-radar-page** menambahkan halaman dedicated full-screen **SIAGA Job Radar** untuk Persona B: **Rizky, 23 tahun, Pilot UAV Bersertifikat SIDOPI**.

Halaman ini adalah pengalaman geospasial interaktif utama bagi pilot setelah login. Job Radar Page menampilkan peta Mapbox 3D terrain Indonesia dengan pin proyek inspeksi aktif, sidebar filter dan list proyek, Radar HUD, mission cards, pin popup, serta project detail drawer.

Halaman ini **berbeda** dari JobRadarSection teaser di landing page. JobRadarSection landing page hanya berfungsi sebagai preview/marketing section, sedangkan halaman ini adalah full-page product experience yang diakses dari route:

```text
/dashboard/pilot/job-radar
```

setelah autentikasi.

Halaman ini harus terasa seperti:

```text
SIAGA Pilot Radar Command Center
```

Bukan sekadar halaman Mapbox biasa.

Target utama UI/UX:

```text
premium, modern, glassmorphism, dark-cyan radar, informatif, cinematic, aerospace-tech, dan selaras dengan landing page/login/register/client-dashboard SIAGA.
```

Karena target SEFEST 2026 berfokus pada demo frontend, halaman ini **tidak memakai backend nyata**. Semua data proyek berasal dari `mock-data.js` sebagai single source of truth, sehingga jumlah pin, list proyek, dan stats selalu konsisten.

---

## Product Goal

Sebagai pilot UAV, user harus bisa:

1. Melihat peluang proyek inspeksi aktif di peta Indonesia.
2. Memfilter proyek berdasarkan jenis infrastruktur, nilai proyek, lokasi, dan status.
3. Melihat status proyek secara visual melalui pin radar.
4. Membuka popup detail singkat dari pin.
5. Membuka detail drawer untuk informasi proyek yang lebih lengkap.
6. Melihat project list dalam bentuk mission cards.
7. Menggunakan halaman dengan nyaman di desktop, tablet, dan mobile.
8. Merasakan pengalaman UI premium yang konsisten dengan brand SIAGA.

---

## Glossary

- **SIAGA**: Sistem Inspeksi Aerial Geospasial Andalan.
- **Job_Radar_Page**: Halaman full-screen pada route `/dashboard/pilot/job-radar`.
- **Pilot**: Role pengguna pilot UAV/agensi drone. Auth session memiliki `role === "pilot"`.
- **Client**: Role pengguna perusahaan/BUMN pemilik aset. Auth session memiliki `role === "client"`.
- **Auth_Session_Mock**: Penyimpanan client-side hasil fitur auth-pages yang menandai user sebagai logged in beserta role-nya.
- **ProtectedRoute**: Komponen route guard existing di `src/auth/ProtectedRoute.jsx`.
- **Design_Tokens**: Variabel CSS existing SIAGA, termasuk `--color-primary`, `--color-accent`, `--color-surface`, `--color-danger`, `--color-success`, `--color-warning`, font Montserrat, dan font Inter.
- **Mapbox_Token**: Token publik Mapbox GL JS yang tersedia di `.env` sebagai `VITE_MAPBOX_TOKEN`.
- **Radar_Map**: Instance Mapbox GL JS fullscreen dengan style dark-v11, terrain 3D, fog, dan custom project pins.
- **Radar_Sidebar**: Panel kiri desktop berisi header, filter, sort, dan project list.
- **Mobile_Bottom_Sheet**: Versi mobile dari sidebar yang muncul dari bawah layar.
- **Sidebar_Toggle**: Tombol untuk collapse/expand Radar_Sidebar.
- **Project_Pin**: Marker custom SVG pada Radar_Map yang merepresentasikan proyek inspeksi.
- **Pin_Status**: Status proyek: `open`, `urgent`, `deadline_dekat`, atau `closed`.
- **Pin_Cluster**: Pengelompokan Project_Pin yang berdekatan saat zoom rendah.
- **Line_Route**: Garis koneksi tipis cyan antar pin dalam radius tertentu.
- **Pin_Popup**: Card glassmorphism yang muncul setelah user klik pin atau mission card.
- **Fly_To_Animation**: Animasi kamera Mapbox menuju lokasi proyek.
- **Radar_HUD**: Overlay glassmorphism di atas map yang menampilkan title dan stats utama.
- **Filter_Section**: Area filter proyek.
- **Infrastructure_Chip**: Toggle chip untuk jenis infrastruktur.
- **Value_Range_Slider**: Slider min-max untuk nilai proyek.
- **Location_Search**: Input autocomplete lokasi.
- **Status_Toggle**: Toggle antara â€œBidding Terbukaâ€ dan â€œSemuaâ€.
- **Project_Card / Mission_Card**: Card proyek pada sidebar/bottom sheet yang dibuat seperti peluang misi.
- **Sort_Control**: Kontrol pengurutan proyek.
- **Project_Detail_Drawer**: Drawer kanan desktop atau bottom sheet detail mobile yang menampilkan detail proyek.
- **Mock_Data_Module**: File `mock-data.js` sebagai single source of truth.
- **Page_Transition**: Animasi fade + slide-up existing yang membungkus route.
- **Toast_Notification**: Feedback ringan untuk action placeholder seperti â€œBid Sekarangâ€.

---

## Requirements

### Requirement 1: Routing dan Role Gating

**User Story:**  
Sebagai pilot yang sudah login, saya ingin halaman Job Radar hanya dapat diakses oleh akun dengan role pilot, sehingga pengalaman halaman sesuai dengan kebutuhan saya dan tidak terekspos kepada role lain.

#### Acceptance Criteria

1. THE Job_Radar_Page SHALL ter-render pada route `/dashboard/pilot/job-radar`.
2. THE Job_Radar_Page SHALL dibungkus oleh ProtectedRoute existing dengan parameter `requestedRole="pilot"`.
3. WHEN Auth_Session_Mock memiliki `role === "pilot"` dan user mengakses `/dashboard/pilot/job-radar`, THE Job_Radar_Page SHALL ter-render.
4. IF Auth_Session_Mock kosong saat user mencoba mengakses `/dashboard/pilot/job-radar`, THEN THE ProtectedRoute SHALL redirect user ke `/login`.
5. IF Auth_Session_Mock memiliki `role === "client"` saat user mencoba mengakses `/dashboard/pilot/job-radar`, THEN THE ProtectedRoute SHALL redirect user ke `/dashboard/client`.
6. WHEN role mismatch terjadi, THE app SHOULD menampilkan feedback singkat seperti â€œAnda tidak memiliki akses ke halaman tersebutâ€ sebelum redirect jika sistem toast tersedia.
7. WHEN Job_Radar_Page di-mount setelah melewati ProtectedRoute, THE Page_Transition SHALL menjalankan animasi fade + slide-up dengan durasi antara 300ms dan 600ms.
8. WHEN user refresh halaman `/dashboard/pilot/job-radar` dengan session valid role pilot, THE Job_Radar_Page SHALL tetap ter-render tanpa flash ke `/login`.
9. THE Job_Radar_Page SHALL NOT melakukan request API real karena halaman masih berbasis frontend prototype.

---

### Requirement 2: Layout Fullscreen â€” Radar Sidebar dan Map

**User Story:**  
Sebagai pilot, saya ingin layout fullscreen dengan sidebar filter di kiri dan peta besar di kanan, sehingga saya dapat melihat proyek secara geospasial sambil tetap mengatur filter dengan cepat.

#### Acceptance Criteria

1. THE Job_Radar_Page SHALL menampilkan layout fullscreen `100vw Ã— 100vh`.
2. THE Job_Radar_Page SHALL tidak memiliki page-level vertical scroll pada desktop.
3. THE Radar_Sidebar SHALL ditempatkan di kiri dengan lebar 320px pada viewport >= 1280px.
4. THE Radar_Map SHALL mengisi seluruh sisa ruang di kanan Radar_Sidebar pada viewport >= 1280px.
5. THE Radar_Sidebar SHALL terbuka secara default pada viewport >= 1280px.
6. THE Job_Radar_Page SHALL menampilkan Sidebar_Toggle di tepi Radar_Sidebar.
7. WHEN user mengklik Sidebar_Toggle saat Radar_Sidebar terbuka, THE Radar_Sidebar SHALL collapse dengan animasi slide-out durasi 200msâ€“400ms.
8. WHEN Radar_Sidebar collapsed, THE Radar_Map SHALL expand ke fullscreen.
9. WHEN user mengklik Sidebar_Toggle saat Radar_Sidebar tertutup, THE Radar_Sidebar SHALL expand dengan animasi slide-in durasi 200msâ€“400ms.
10. WHEN Radar_Sidebar berubah ukuran, THE Radar_Map SHALL memanggil `map.resize()` setelah transisi selesai.
11. THE Job_Radar_Page SHALL mempertahankan custom cursor cyan existing.
12. THE Job_Radar_Page SHALL menggunakan font dan warna dari Design_Tokens SIAGA.
13. THE desktop layout SHALL feel like a premium radar command center, not a generic admin map layout.

---

### Requirement 3: Mapbox 3D Terrain dan Visual Map Premium

**User Story:**  
Sebagai pilot, saya ingin peta Indonesia terlihat sinematik dengan terrain 3D dan efek atmosfer, sehingga pengalaman mencari proyek terasa profesional dan futuristik.

#### Acceptance Criteria

1. THE Radar_Map SHALL me-render Mapbox GL JS map.
2. THE Radar_Map SHALL membaca token dari `import.meta.env.VITE_MAPBOX_TOKEN`.
3. THE Radar_Map SHALL menggunakan style `mapbox://styles/mapbox/dark-v11`.
4. THE Radar_Map SHALL mengaktifkan terrain 3D dengan source `mapbox-dem`.
5. THE terrain exaggeration SHOULD bernilai sekitar `1.5`.
6. THE Radar_Map SHALL mengaktifkan fog/atmosphere menggunakan `map.setFog()`.
7. THE Radar_Map SHALL memiliki initial view centered pada Indonesia.
8. THE initial center SHOULD berada sekitar longitude `118` dan latitude `-2.5`.
9. THE initial zoom SHOULD berada sekitar `5`.
10. THE Radar_Map SHALL di-load menggunakan React `lazy()` + Suspense.
11. WHILE Radar_Map belum selesai dimuat, THE Job_Radar_Page SHALL menampilkan MapLoadingFallback premium.
12. THE MapLoadingFallback SHALL menggunakan dark navy background, subtle radar grid, spinner cyan, dan teks â€œMemuat petaâ€¦â€.
13. IF Mapbox gagal dimuat karena token invalid, network error, atau library error, THEN THE Job_Radar_Page SHALL menampilkan MapErrorFallback.
14. THE MapErrorFallback SHALL menampilkan pesan â€œPeta tidak tersedia saat iniâ€.
15. THE MapErrorFallback SHALL tetap menampilkan fallback list proyek berbasis teks.
16. THE Radar_Map SHALL menyediakan TerrainToggle untuk enable/disable terrain 3D.
17. IF DEM terrain gagal dimuat, THE Radar_Map SHALL fallback ke flat map tanpa crash.
18. THE Radar_Map SHALL avoid default ugly Mapbox controls if custom-styled controls are available.
19. THE map visual SHALL feel cinematic, dark, and premium.

---

### Requirement 4: Project Pins, Status Visual, Cluster, dan Route Lines

**User Story:**  
Sebagai pilot, saya ingin melihat proyek sebagai pin radar dengan warna berbeda sesuai status, sehingga saya langsung tahu proyek mana yang terbuka, urgent, dekat deadline, atau tertutup.

#### Acceptance Criteria

1. THE Radar_Map SHALL menampilkan satu Project_Pin untuk setiap proyek dari Mock_Data_Module yang lolos filter.
2. THE Project_Pin SHALL berbentuk custom SVG drone/radar marker, bukan marker default Mapbox.
3. THE Project_Pin dengan status `open` SHALL berwarna cyan `--color-accent`.
4. THE Project_Pin dengan status `open` SHALL menjalankan pulse animation cyan berdurasi 1.5sâ€“2.5s.
5. THE Project_Pin dengan status `urgent` SHALL berwarna `--color-danger`.
6. THE Project_Pin dengan status `urgent` SHALL menjalankan pulse animation merah lebih cepat, sekitar 1sâ€“1.5s.
7. THE Project_Pin dengan status `deadline_dekat` SHALL berwarna `--color-warning`.
8. THE Project_Pin dengan status `deadline_dekat` SHALL tidak menjalankan pulse animation.
9. THE Project_Pin dengan status `closed` SHALL berwarna abu-abu dan opacity 0.5â€“0.7.
10. THE Project_Pin dengan status `closed` SHALL tidak menjalankan pulse animation.
11. WHEN user hover ProjectCard terkait, THE Project_Pin SHALL membesar scale 1.3â€“1.5x dan menampilkan glow cyan.
12. WHEN hover berakhir, THE Project_Pin SHALL kembali ke ukuran normal.
13. WHEN zoom level rendah, THE Radar_Map SHALL mengelompokkan pin berdekatan menjadi Pin_Cluster.
14. THE Pin_Cluster SHALL berupa lingkaran premium dengan angka jumlah proyek di dalamnya.
15. WHEN user mengklik Pin_Cluster, THE Radar_Map SHALL zoom in ke area cluster.
16. THE Radar_Map SHALL menampilkan Line_Route tipis cyan yang menghubungkan proyek dalam radius sekitar 100km.
17. THE Line_Route SHALL memiliki opacity rendah agar tidak mengganggu map.
18. THE Project_Pin SHALL memiliki `aria-label` berisi nama proyek, status, dan lokasi.

---

### Requirement 5: Pin Popup dan Fly-To Animation

**User Story:**  
Sebagai pilot, saya ingin mengklik pin dan melihat detail singkat dalam popup premium, sehingga saya bisa menilai proyek dengan cepat sebelum membuka detail penuh.

#### Acceptance Criteria

1. WHEN user mengklik Project_Pin, THE Radar_Map SHALL menjalankan Fly_To_Animation menuju lokasi pin.
2. THE Fly_To_Animation SHALL berupa smooth zoom + tilt dengan durasi sekitar 1.5 detik.
3. THE Fly_To_Animation SHALL menggunakan easing yang smooth.
4. THE Pin_Popup SHALL muncul setelah Fly_To_Animation selesai, bukan bersamaan di awal.
5. THE Pin_Popup SHALL menggunakan glassmorphism dark/cyan style.
6. THE Pin_Popup SHALL memiliki background semi-transparan dark navy dengan blur 8pxâ€“16px.
7. THE Pin_Popup SHALL memiliki border cyan halus dan border-radius 22pxâ€“28px.
8. THE Pin_Popup SHALL menampilkan nama proyek.
9. THE Pin_Popup SHALL menampilkan jenis infrastruktur.
10. THE Pin_Popup SHALL menampilkan nilai kontrak dalam format Rupiah.
11. THE Pin_Popup SHALL menampilkan deadline dalam format tanggal Indonesia.
12. THE Pin_Popup SHALL menampilkan jumlah bidder.
13. THE Pin_Popup SHALL menampilkan status badge.
14. THE Pin_Popup SHALL menampilkan tombol â€œLihat Detailâ€.
15. THE Pin_Popup SHALL menampilkan tombol â€œBid Sekarangâ€.
16. WHEN user mengklik â€œBid Sekarangâ€, THE Job_Radar_Page SHALL menampilkan Toast_Notification placeholder bahwa fitur bidding akan tersedia di versi berikutnya.
17. WHEN user mengklik â€œLihat Detailâ€, THE Job_Radar_Page SHALL membuka Project_Detail_Drawer.
18. WHEN user mengklik area peta di luar Pin_Popup atau tombol close, THE Pin_Popup SHALL tertutup.
19. THE Job_Radar_Page SHALL memastikan tidak ada dua Pin_Popup terbuka bersamaan.
20. THE Pin_Popup SHALL menggunakan `role="dialog"` dan `aria-labelledby`.
21. WHEN Fly_To_Animation selesai, THE Job_Radar_Page SHALL mengumumkan ke screen reader melalui `aria-live="polite"`.

---

### Requirement 6: Radar Sidebar â€” Header dan Filter Section

**User Story:**  
Sebagai pilot, saya ingin filter proyek berdasarkan jenis infrastruktur, nilai proyek, lokasi, dan status bidding, sehingga saya bisa menemukan proyek yang paling sesuai dengan kapabilitas saya.

#### Acceptance Criteria

1. THE Radar_Sidebar SHALL tampil sebagai dark glass command panel.
2. THE Radar_Sidebar SHALL memiliki background dark navy glassmorphism.
3. THE Radar_Sidebar SHALL memiliki cyan border halus, subtle grid, dan soft glow.
4. THE SidebarHeader SHALL menampilkan â€œSIAGA Job Radarâ€.
5. THE SidebarHeader SHALL menampilkan subtitle seperti â€œLive Project Discoveryâ€.
6. THE SidebarHeader SHALL menampilkan badge jumlah proyek aktif.
7. THE badge jumlah proyek aktif SHOULD memiliki pulse animation subtle.
8. THE Filter_Section SHALL menampilkan Infrastructure_Chip.
9. THE Infrastructure_Chip options SHALL mencakup SUTET, Jembatan, Kilang, Solar Panel, Bendungan, dan Tower.
10. WHEN user mengaktifkan satu atau lebih Infrastructure_Chip, THE Job_Radar_Page SHALL menampilkan proyek yang cocok dengan salah satu chip aktif.
11. WHEN tidak ada Infrastructure_Chip aktif, THE Job_Radar_Page SHALL menampilkan semua proyek sesuai filter lain.
12. THE Filter_Section SHALL menampilkan Value_Range_Slider.
13. THE Value_Range_Slider SHALL memiliki label â€œNilai Proyekâ€.
14. THE Value_Range_Slider SHALL memiliki range Rp 0 sampai Rp 2.500.000.000.
15. THE Value_Range_Slider SHALL memiliki step Rp 50.000.000.
16. WHEN user mengubah Value_Range_Slider, THE Job_Radar_Page SHALL menampilkan proyek dalam range nilai tersebut.
17. THE Filter_Section SHALL menampilkan Location_Search.
18. THE Location_Search SHALL menyediakan autocomplete kota/provinsi dari Mock_Data_Module.
19. WHEN user memilih lokasi, THE Job_Radar_Page SHALL memfilter proyek berdasarkan kota/provinsi tersebut.
20. THE Filter_Section SHALL menampilkan Status_Toggle.
21. THE Status_Toggle SHALL memiliki opsi â€œBidding Terbukaâ€ dan â€œSemuaâ€.
22. WHEN Status_Toggle adalah â€œBidding Terbukaâ€, THE Job_Radar_Page SHALL menampilkan proyek dengan status `open`, `urgent`, dan `deadline_dekat`.
23. WHEN Status_Toggle adalah â€œSemuaâ€, THE Job_Radar_Page SHALL menampilkan semua status termasuk `closed`.
24. WHEN beberapa filter aktif bersamaan, THE Job_Radar_Page SHALL menerapkan AND logic antar kategori filter.
25. THE Infrastructure_Chip filtering SHALL menggunakan OR logic dalam kategori infrastruktur.
26. THE Filter_Section SHALL mempertahankan state selama session berlangsung.
27. THE Filter_Section SHALL menampilkan Reset Filter button ketika ada filter aktif.
28. THE filter UI SHALL look premium, compact, and glassmorphism.

---

### Requirement 7: Project List, Sorting, dan Mission Cards

**User Story:**  
Sebagai pilot, saya ingin melihat proyek sebagai mission cards yang informatif dan bisa diurutkan, sehingga saya bisa memilih peluang bidding dengan cepat.

#### Acceptance Criteria

1. THE Radar_Sidebar SHALL menampilkan Project_List scrollable di bawah Filter_Section.
2. THE Project_Card SHALL tampil sebagai Mission_Card, bukan card list biasa.
3. THE Mission_Card SHALL menampilkan status badge.
4. THE Mission_Card SHALL menampilkan jenis infrastruktur.
5. THE Mission_Card SHALL menampilkan nama proyek.
6. THE Mission_Card SHALL menampilkan lokasi singkat.
7. THE Mission_Card SHALL menampilkan nilai kontrak dalam format Rupiah compact.
8. THE Mission_Card SHALL menampilkan deadline.
9. THE Mission_Card SHALL menampilkan jumlah bidder.
10. THE Mission_Card SHALL menampilkan tombol â€œLihat Detailâ€.
11. THE Mission_Card SHALL menampilkan tombol â€œBid Sekarangâ€.
12. THE Mission_Card SHALL memiliki hierarchy visual: status â†’ nama proyek â†’ lokasi â†’ nilai/deadline/bidder â†’ CTA.
13. THE Mission_Card SHALL menggunakan glassmorphism dark panel.
14. THE Mission_Card SHALL memiliki hover glow cyan.
15. THE Mission_Card SHALL memiliki selected/highlight state saat pin terkait diklik.
16. THE Project_List SHALL menampilkan Sort_Control di atas list.
17. THE Sort_Control SHALL memiliki opsi â€œTerbaruâ€, â€œNilai Tertinggiâ€, dan â€œDeadline Terdekatâ€.
18. WHEN user memilih sort option, THE Project_List SHALL diurutkan sesuai kriteria.
19. THE Project_List SHALL hanya menampilkan proyek yang lolos seluruh filter.
20. THE jumlah Mission_Card visible SHALL selalu sama dengan jumlah Project_Pin visible di map.
21. IF tidak ada proyek yang cocok dengan filter, THE Project_List SHALL menampilkan empty state.
22. Empty state SHALL menampilkan teks â€œTidak ada proyek yang cocok dengan filterâ€.
23. Empty state SHALL menampilkan saran untuk reset/perluas filter.
24. Empty state SHALL menampilkan tombol â€œReset Filterâ€.
25. WHEN user klik Reset Filter, semua filter SHALL kembali ke default.
26. THE Project_Card SHALL memiliki `role="button"` atau elemen interaktif setara.
27. THE Project_Card SHALL memiliki `aria-label` berisi nama proyek dan lokasi.
28. ON mobile, THE Mission_Card SHALL tetap compact dan readable dalam bottom sheet.

---

### Requirement 8: Bidirectional Interaction antara Sidebar dan Map

**User Story:**  
Sebagai pilot, saya ingin sidebar dan map saling terhubung, sehingga saya bisa berpindah dari daftar ke peta atau dari peta ke daftar dengan intuitif.

#### Acceptance Criteria

1. WHEN user hover Mission_Card, THE Project_Pin terkait SHALL membesar dan glow.
2. WHEN user hover keluar dari Mission_Card, THE Project_Pin terkait SHALL kembali normal.
3. WHEN user klik Mission_Card, THE Radar_Map SHALL menjalankan Fly_To_Animation ke pin terkait.
4. WHEN Fly_To_Animation dari Mission_Card selesai, THE Pin_Popup SHALL terbuka.
5. WHEN user klik Project_Pin, THE Radar_Sidebar SHALL scroll ke Mission_Card terkait.
6. WHEN user klik Project_Pin, THE Mission_Card terkait SHALL mendapat temporary highlight selama sekitar 3 detik.
7. WHEN filter berubah, THE Radar_Map SHALL memperbarui Project_Pin visible secara real-time.
8. WHEN filter berubah, THE Radar_Sidebar SHALL memperbarui Mission_Card visible secara real-time.
9. WHEN filter berubah, THE Radar_HUD SHALL memperbarui stats visible secara real-time.
10. WHEN Sidebar_Toggle mengubah sidebar, THE Radar_Map SHALL memanggil `map.resize()`.
11. THE jumlah Mission_Card visible SHALL selalu sama dengan jumlah Project_Pin visible.
12. THE interactions SHALL remain stable even if popup is open and user clicks another pin.
13. IF popup is open and user clicks another pin, THE old popup SHALL close before new Fly_To_Animation starts.

---

### Requirement 9: Radar HUD

**User Story:**  
Sebagai pilot, saya ingin melihat ringkasan proyek secara real-time di atas map tanpa membuka sidebar, sehingga saya langsung paham kondisi peluang bidding saat ini.

#### Acceptance Criteria

1. THE Radar_HUD SHALL tampil sebagai overlay glassmorphism di atas Radar_Map.
2. THE Radar_HUD SHALL menggantikan konsep Floating_Stats_Bar biasa.
3. THE Radar_HUD SHALL menampilkan title â€œSIAGA Job Radarâ€.
4. THE Radar_HUD SHALL menampilkan subtitle seperti â€œLive Project Discovery for Certified UAV Pilotsâ€.
5. THE Radar_HUD SHALL menampilkan stats utama: Proyek Aktif, Bidding Terbuka, dan Urgent.
6. THE stats pada Radar_HUD SHALL dihitung dari filteredProjects visible.
7. WHEN filter berubah, THE Radar_HUD stats SHALL update sesuai proyek visible.
8. THE Radar_HUD SHALL menampilkan live badge atau updated indicator jika tersedia.
9. THE Radar_HUD SHALL menggunakan glassmorphism dark/cyan style.
10. THE Radar_HUD SHALL memiliki z-index di atas map tapi di bawah Pin_Popup dan Project_Detail_Drawer.
11. THE Radar_HUD SHALL tidak menghalangi interaksi map pada area non-interactive.
12. THE Radar_HUD SHALL menggunakan `pointer-events: none` pada container utama jika tidak ada kontrol interaktif.
13. ON mobile, THE Radar_HUD SHALL berubah menjadi compact floating pill.
14. ON mobile, THE Radar_HUD SHALL tetap readable di viewport 320px.
15. THE Radar_HUD SHALL not feel like a generic stats strip; it must feel like a radar command HUD.

---

### Requirement 10: Mock Data Module dan Konsistensi Data

**User Story:**  
Sebagai developer, saya ingin seluruh data proyek berasal dari satu modul mock data, sehingga angka stats, jumlah card, dan jumlah pin selalu konsisten.

#### Acceptance Criteria

1. THE Job_Radar_Page SHALL membaca seluruh data proyek dari `src/pages/JobRadar/mock-data.js`.
2. THE Job_Radar_Page SHALL tidak melakukan panggilan HTTP/API real.
3. THE Mock_Data_Module SHALL mengekspor array proyek dengan jumlah 15â€“20 item.
4. Setiap project SHALL memiliki field `id`.
5. Setiap project SHALL memiliki field `nama`.
6. Setiap project SHALL memiliki field `jenis_infrastruktur`.
7. Setiap project SHALL memiliki field `nilai_kontrak` bertipe number dalam Rupiah.
8. Setiap project SHALL memiliki field `lokasi`.
9. `lokasi` SHALL memiliki `lat`, `lng`, `kota`, dan `provinsi`.
10. Setiap project SHALL memiliki field `deadline` dalam ISO date string.
11. Setiap project SHALL memiliki field `status`.
12. Setiap project SHALL memiliki field `jumlah_bidder`.
13. Optional field `deskripsi` SHOULD tersedia untuk detail drawer.
14. Optional field `client_nama` SHOULD tersedia untuk detail drawer.
15. `jenis_infrastruktur` SHALL salah satu dari SUTET, Jembatan, Kilang, Solar Panel, Bendungan, Tower.
16. `status` SHALL salah satu dari `open`, `urgent`, `deadline_dekat`, `closed`.
17. Mock data SHALL tersebar minimal di Jawa, Sumatera, Kalimantan, Sulawesi, dan Papua.
18. Mock data SHALL memiliki minimal 2 proyek `urgent`.
19. Mock data SHALL memiliki minimal 2 proyek `closed`.
20. Mock data SHALL memiliki minimal 2 proyek `deadline_dekat`.
21. Mock data SHALL memiliki variasi nilai kontrak dari Rp 50.000.000 hingga Rp 2.000.000.000.
22. Mock data SHALL mencakup minimal 4 dari 6 kategori infrastruktur.
23. THE Mock_Data_Module SHOULD mengekspor helper `computeStatsFromSource()`.
24. THE Job_Radar_Page SHALL menjamin displayed count = filtered data count = visible pins count.
25. THE Radar_HUD, Radar_Sidebar, Radar_Map, dan Mobile_Bottom_Sheet SHALL menggunakan data dari source yang sama.
26. THE Job_Radar_Page SHALL not hardcode count terpisah di komponen UI.

---

### Requirement 11: Performance dan Lazy Loading

**User Story:**  
Sebagai pilot dengan koneksi terbatas, saya ingin sidebar dan list proyek tetap bisa digunakan tanpa menunggu map berat selesai dimuat.

#### Acceptance Criteria

1. THE Radar_Map SHALL di-load menggunakan React `lazy()` + Suspense.
2. THE Mapbox GL JS bundle SHALL tidak masuk initial chunk utama halaman jika memungkinkan.
3. THE Radar_Sidebar SHALL dapat di-scroll dan diinteract sebelum Radar_Map selesai dimuat.
4. THE Filter_Section SHALL dapat digunakan sebelum Radar_Map selesai dimuat.
5. THE Project_List SHALL dapat ditampilkan sebelum Radar_Map selesai dimuat.
6. THE Radar_HUD SHOULD menampilkan stats dari mock data sebelum map selesai dimuat.
7. THE Project_Pin rendering SHALL tetap smooth dengan 20 pin aktif.
8. THE pulse animation SHALL menggunakan CSS transform/opacity agar performant.
9. THE TerrainToggle SHALL memungkinkan user disable terrain 3D.
10. THE Pin_Cluster SHALL digunakan untuk mengurangi marker overload pada zoom rendah.
11. THE map resize SHALL di-debounce ketika layout berubah.
12. THE page SHALL avoid unnecessary re-render of markers when filters have not changed.
13. THE loading experience SHALL not show skeleton â†’ blank â†’ content.
14. THE loading state SHALL transition smoothly into loaded content.

---

### Requirement 12: Responsive Behavior

**User Story:**  
Sebagai pilot yang mengecek job radar dari laptop, tablet, atau HP di lapangan, saya ingin halaman tetap nyaman digunakan di semua ukuran layar dengan map sebagai fokus utama.

#### Acceptance Criteria

1. ON viewport width >= 1280px, THE Job_Radar_Page SHALL menampilkan Radar_Sidebar terbuka 320px dan Radar_Map di sisa ruang.
2. ON viewport width >= 1280px, THE Radar_HUD SHALL tampil full.
3. ON viewport width >= 1280px, THE Project_Detail_Drawer SHALL slide dari kanan.
4. ON viewport width 768pxâ€“1279px, THE Radar_Sidebar SHALL collapsed secara default.
5. ON viewport width 768pxâ€“1279px, THE Radar_Sidebar SHALL dapat dibuka sebagai overlay dari kiri.
6. ON viewport width 768pxâ€“1279px, THE Radar_Map SHALL mengisi 100% lebar viewport secara default.
7. ON viewport width 768pxâ€“1279px, THE Radar_HUD SHALL tampil compact.
8. ON viewport width < 768px, THE desktop Radar_Sidebar SHALL tidak dipakai.
9. ON viewport width < 768px, THE Mobile_Bottom_Sheet SHALL digunakan.
10. ON viewport width < 768px, THE Radar_Map SHALL tetap fullscreen di belakang bottom sheet.
11. THE Mobile_Bottom_Sheet SHALL memiliki collapsed state.
12. THE collapsed state SHALL memiliki tinggi sekitar 60â€“80px.
13. THE collapsed state SHALL menampilkan drag handle, jumlah proyek, dan quick status.
14. THE Mobile_Bottom_Sheet SHALL memiliki expanded state.
15. THE expanded state SHALL memiliki tinggi 60â€“70% viewport.
16. THE expanded state SHALL menampilkan filter dan project list.
17. THE Mobile_Bottom_Sheet SHALL memiliki internal scroll.
18. THE page SHALL tidak memiliki horizontal scroll pada viewport >= 320px.
19. WHEN user resize window, THE Radar_Map SHALL memanggil `map.resize()`.
20. THE layout SHALL menyesuaikan tanpa crash atau visual glitch.
21. ON mobile, Mission_Cards SHALL tetap readable dan touch-friendly.
22. ON mobile, Pin_Popup SHALL tidak keluar viewport.
23. ON mobile, Project_Detail_Drawer SHALL berubah menjadi detail bottom sheet.
24. THE responsive design SHALL not look like squeezed desktop layout.

---

### Requirement 13: Accessibility

**User Story:**  
Sebagai pengguna keyboard atau screen reader, saya ingin bisa menggunakan filter, project list, popup, drawer, dan kontrol map dengan aksesibilitas yang baik.

#### Acceptance Criteria

1. THE Radar_Sidebar SHALL dapat dinavigasi menggunakan keyboard.
2. THE Infrastructure_Chip SHALL memiliki `role="checkbox"` atau `role="switch"`.
3. THE Infrastructure_Chip SHALL memiliki `aria-checked`.
4. THE Value_Range_Slider SHALL memiliki `role="slider"`.
5. THE Value_Range_Slider SHALL memiliki `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, dan `aria-label`.
6. THE Location_Search SHALL memiliki label atau `aria-label`.
7. THE Status_Toggle SHALL keyboard accessible.
8. THE Project_Card SHALL memiliki `role="button"` atau elemen button asli.
9. THE Project_Card SHALL memiliki `aria-label` yang menyebutkan nama proyek dan lokasi.
10. THE Project_Pin SHALL memiliki `aria-label`.
11. THE Pin_Popup SHALL memiliki `role="dialog"`.
12. THE Pin_Popup SHALL memiliki `aria-labelledby`.
13. THE Project_Detail_Drawer SHALL mengelola focus saat terbuka.
14. THE Project_Detail_Drawer SHALL dapat ditutup dengan Escape.
15. THE Mobile_Bottom_Sheet SHOULD dapat ditutup/collapse dengan Escape jika focus berada di dalamnya.
16. THE Sidebar_Toggle SHALL memiliki `aria-expanded`.
17. THE Sidebar_Toggle SHALL memiliki `aria-label` deskriptif.
18. THE Sort_Control SHALL keyboard navigable.
19. THE Sort_Control SHALL memiliki `aria-label` opsi aktif.
20. THE Job_Radar_Page SHALL memiliki visible focus indicator cyan pada semua elemen interaktif.
21. THE Job_Radar_Page SHALL memiliki `aria-live="polite"` region untuk pengumuman Fly_To_Animation selesai.
22. THE Toast_Notification SHALL diumumkan dengan aria-live jika memungkinkan.
23. THE page SHOULD pass basic automated a11y checks with no critical violations.

---

### Requirement 14: Error Handling dan Edge Cases

**User Story:**  
Sebagai pilot, saya ingin halaman tetap memberi feedback jika peta, filter, atau data gagal dimuat, sehingga saya tidak melihat halaman blank.

#### Acceptance Criteria

1. IF Mapbox token invalid, THE MapErrorFallback SHALL muncul.
2. IF Mapbox network error, THE MapErrorFallback SHALL muncul.
3. IF Mapbox lazy chunk gagal dimuat, THE MapErrorFallback SHALL muncul dengan retry option jika memungkinkan.
4. IF terrain DEM gagal, THE Radar_Map SHALL fallback ke flat map tanpa crash.
5. IF Mock_Data_Module gagal import, THE page-level error boundary SHALL menampilkan generic error.
6. IF semua filter menghasilkan 0 proyek, THE sidebar/bottom sheet SHALL menampilkan empty state.
7. IF semua filter menghasilkan 0 proyek, THE map SHALL tampil bersih tanpa pin.
8. IF semua filter menghasilkan 0 proyek, THE Radar_HUD SHALL menampilkan angka 0.
9. Empty state SHALL menyediakan tombol Reset Filter.
10. WHEN user klik Reset Filter, THE page SHALL kembali ke default filter state.
11. IF popup terbuka dan user klik pin lain, THE old popup SHALL close sebelum popup baru dibuka.
12. IF window resize terjadi saat animation berjalan, THE map resize SHALL tidak menyebabkan crash.
13. IF Detail Drawer gagal render, THE system SHALL menampilkan fallback card/text dasar.
14. IF Error UI gagal render, THE system SHOULD memiliki fallback plain text.
15. THE page SHALL never fail silently into blank area if a component fails.
16. THE error fallback UI SHALL use visual style consistent with SIAGA.
17. THE error fallback copy SHALL be clear and not technical.

---

### Requirement 15: Visual Cohesion dengan SIAGA Brand

**User Story:**  
Sebagai pengguna SIAGA, saya ingin Job Radar Page terasa sebagai bagian dari ekosistem SIAGA yang sama dengan landing page, login/register, dan client dashboard.

#### Acceptance Criteria

1. THE Job_Radar_Page SHALL menggunakan visual style yang selaras dengan SIAGA.
2. THE Job_Radar_Page SHALL menggunakan Montserrat untuk heading/display.
3. THE Job_Radar_Page SHALL menggunakan Inter untuk body/metadata.
4. THE Job_Radar_Page SHALL menggunakan dark navy, cyan, blue, success green, warning yellow, dan danger red sesuai Design_Tokens.
5. THE Radar_Sidebar SHALL tampil sebagai dark glass panel, bukan solid admin sidebar.
6. THE Radar_HUD SHALL tampil sebagai radar command HUD, bukan stats strip generic.
7. THE Mission_Card SHALL memiliki rounded corners, glass background, subtle border, dan hover glow.
8. THE Pin_Popup SHALL memiliki dark glassmorphism dan cyan border.
9. THE Project_Detail_Drawer SHALL memiliki visual style yang sama dengan popup dan sidebar.
10. THE Mobile_Bottom_Sheet SHALL memiliki dark glassmorphism dengan drag handle premium.
11. THE page SHALL include subtle grid/radar line/glow effects.
12. THE page SHALL avoid generic Mapbox dashboard appearance.
13. THE UI SHALL feel premium, modern, aerospace-tech, and cinematic.
14. THE visual density SHALL remain balanced, not cluttered.
15. THE spacing SHALL be consistent between sidebar, HUD, popup, drawer, and bottom sheet.
16. THE page SHALL not introduce random colors outside the SIAGA palette.
17. THE final result SHALL feel like a continuation of landing page SIAGA.

---

### Requirement 16: Premium Mission Discovery UX

**User Story:**  
Sebagai pilot, saya ingin proyek terasa seperti misi inspeksi profesional yang bisa saya pilih, bukan sekadar item list biasa.

#### Acceptance Criteria

1. THE Project_Card SHALL be styled as Mission_Card.
2. THE Mission_Card SHALL use mission-oriented copy and hierarchy.
3. THE Mission_Card SHALL show status badge prominently.
4. THE Mission_Card SHALL show contract value prominently.
5. THE Mission_Card SHALL show deadline clearly.
6. THE Mission_Card SHALL show bidder count clearly.
7. THE Mission_Card SHALL show location clearly.
8. THE Mission_Card SHALL show infrastructure type.
9. THE Mission_Card SHALL include â€œLihat Detailâ€.
10. THE Mission_Card SHALL include â€œBid Sekarangâ€.
11. THE â€œBid Sekarangâ€ button SHALL show placeholder toast.
12. THE â€œLihat Detailâ€ button SHALL open Project_Detail_Drawer.
13. THE Mission_Card hover state SHALL highlight the related pin.
14. THE Mission_Card selected state SHALL be visually obvious.
15. THE Mission_Card SHALL remain compact enough for sidebar.
16. THE Mission_Card SHALL remain readable on mobile bottom sheet.
17. THE Mission_Card SHALL not look like a generic admin list row.
18. THE Mission_Card SHALL help pilot quickly decide if a project is worth bidding.

---

### Requirement 17: Project Detail Drawer

**User Story:**  
Sebagai pilot, saya ingin membuka detail proyek tanpa meninggalkan halaman radar, sehingga saya tetap bisa melihat konteks map sambil menilai proyek.

#### Acceptance Criteria

1. WHEN user klik â€œLihat Detailâ€ dari Pin_Popup, THE Project_Detail_Drawer SHALL terbuka.
2. WHEN user klik â€œLihat Detailâ€ dari Mission_Card, THE Project_Detail_Drawer SHALL terbuka.
3. ON desktop, THE Project_Detail_Drawer SHALL slide dari kanan.
4. ON desktop, THE Project_Detail_Drawer SHOULD memiliki width sekitar 380pxâ€“460px.
5. ON mobile, THE Project_Detail_Drawer SHALL menjadi bottom sheet detail.
6. THE Project_Detail_Drawer SHALL menampilkan nama proyek.
7. THE Project_Detail_Drawer SHALL menampilkan status.
8. THE Project_Detail_Drawer SHALL menampilkan jenis infrastruktur.
9. THE Project_Detail_Drawer SHALL menampilkan lokasi lengkap.
10. THE Project_Detail_Drawer SHALL menampilkan nilai kontrak.
11. THE Project_Detail_Drawer SHALL menampilkan deadline.
12. THE Project_Detail_Drawer SHALL menampilkan jumlah bidder.
13. THE Project_Detail_Drawer SHALL menampilkan client name jika tersedia.
14. THE Project_Detail_Drawer SHALL menampilkan deskripsi proyek jika tersedia.
15. THE Project_Detail_Drawer SHALL menampilkan CTA â€œBid Sekarangâ€.
16. THE â€œBid Sekarangâ€ CTA SHALL menampilkan placeholder toast.
17. THE Project_Detail_Drawer SHALL dapat ditutup dengan close button.
18. THE Project_Detail_Drawer SHALL dapat ditutup dengan Escape.
19. THE Project_Detail_Drawer SHALL tidak merusak selected pin atau filter state.
20. THE Project_Detail_Drawer SHALL mengambil data dari project object yang sama dari Mock_Data_Module.
21. THE Project_Detail_Drawer SHALL use glassmorphism style consistent with sidebar and popup.
22. THE Project_Detail_Drawer SHALL not block the entire map unnecessarily on desktop.

---

### Requirement 18: UI/UX Premium Polish dan Demo Readiness

**User Story:**  
Sebagai tim SIAGA yang akan mempresentasikan demo frontend SEFEST, saya ingin halaman ini terlihat sangat matang secara UI/UX, sehingga juri langsung menangkap kualitas desain dan value proposition SIAGA.

#### Acceptance Criteria

1. THE Job_Radar_Page SHALL be visually demo-ready.
2. THE page SHALL look premium at 1440px desktop.
3. THE page SHALL remain usable at 1280px laptop.
4. THE page SHALL remain usable at 1024px tablet landscape.
5. THE page SHALL remain usable at 768px tablet portrait.
6. THE page SHALL remain usable at 430px mobile.
7. THE page SHALL remain usable at 390px mobile.
8. THE page SHALL remain usable at 360px mobile.
9. THE page SHALL remain usable at 320px mobile.
10. THE page SHALL not have horizontal overflow on any tested viewport.
11. THE Radar_Sidebar SHALL not feel too heavy or generic.
12. THE Radar_HUD SHALL not block important map content.
13. THE Mobile_Bottom_Sheet SHALL not cover the whole map unless expanded intentionally.
14. THE Mission_Cards SHALL not be visually cramped.
15. THE Pin_Popup SHALL not be clipped by viewport.
16. THE Project_Detail_Drawer SHALL feel polished and intentional.
17. THE LoadingFallback SHALL look premium, not default.
18. THE ErrorFallback SHALL look premium and informative.
19. THE page SHALL use subtle transitions and microinteractions.
20. THE page SHALL avoid excessive animation that distracts from the map.
21. THE page SHALL maintain data consistency across HUD, sidebar, and map.
22. THE page SHALL be ready for screenshot/video demo.
23. THE page SHALL clearly communicate â€œreal-time project discovery for certified UAV pilotsâ€.
24. THE final result SHALL feel like â€œSIAGA Pilot Radar Command Centerâ€.

---

# Non-Functional Requirements

## Performance

1. Mapbox SHALL be lazy-loaded.
2. Sidebar SHALL be interactive before map loaded.
3. Marker animation SHALL be performant.
4. Resize SHALL be debounced.
5. Terrain SHALL be toggleable.
6. DOM marker count SHALL be controlled with clustering.

## Maintainability

1. Filtering logic SHALL be in pure functions.
2. Mock data SHALL be isolated.
3. UI components SHALL be modular.
4. CSS SHALL be component-scoped or follow existing project convention.
5. Data formatting helpers SHALL be centralized.

## Visual Consistency

1. Use SIAGA design tokens.
2. Use Montserrat + Inter.
3. Use glassmorphism consistently.
4. Avoid generic UI styles.
5. Keep landing page/auth/client dashboard visual language.

## Accessibility

1. Keyboard navigation required.
2. ARIA labels required.
3. Focus states required.
4. Dialog semantics required.
5. No critical a11y violations.

---

# Final Success Definition

Job Radar Page dianggap berhasil jika:

```text
Pilot bisa membuka /dashboard/pilot/job-radar,
melihat peta Indonesia 3D,
memfilter proyek,
melihat mission cards,
klik card/pin,
melihat popup,
membuka detail drawer,
dan merasakan pengalaman radar proyek yang premium, modern, glassmorphism, dan selaras dengan SIAGA.
```

Halaman ini harus terasa seperti:

```text
produk SaaS drone inspection marketplace yang siap dipresentasikan,
bukan sekadar demo Mapbox atau admin page biasa.
```
