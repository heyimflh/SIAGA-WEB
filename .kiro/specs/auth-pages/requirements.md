# Requirements Document

## Introduction

Fitur **auth-pages** menambahkan halaman Login dan Register ke platform SIAGA (Sistem Inspeksi Aerial Geospasial Andalan) sebagai jembatan dari landing page menuju area authenticated (Client Dashboard / Pilot Dashboard). Halaman ini melayani dua persona berbeda — Persona A "Client" (perwakilan perusahaan/BUMN pemilik aset infrastruktur) dan Persona B "Provider" (Pilot UAV bersertifikat SIDOPI) — dengan flow Register tiga langkah yang berbeda per role, termasuk upload sertifikat SIDOPI untuk verifikasi pilot.

Karena target SEFEST 2026 berfokus pada demo frontend, tidak ada backend nyata: validasi dilakukan client-side, autentikasi di-mock, dan submit sukses men-trigger transisi route ke dashboard placeholder. Halaman wajib menjaga konsistensi visual ketat dengan landing page existing (design tokens warna, font Montserrat + Inter, custom cursor cyan, page transition fade + slide-up, model 3D drone yang sama) dan memperkenalkan react-router-dom ke aplikasi yang saat ini single-page.

## Glossary

- **SIAGA**: Nama platform — Sistem Inspeksi Aerial Geospasial Andalan.
- **Auth_System**: Modul frontend yang membungkus halaman Login dan Register beserta state autentikasi mock.
- **Login_Page**: Halaman pada route `/login` yang berisi form Login dengan tab switcher role.
- **Register_Page**: Halaman pada route `/register` yang berisi flow registrasi 3-step.
- **Role_Tab_Switcher**: Komponen tab di Login_Page dengan dua opsi: "Masuk sebagai Perusahaan" dan "Masuk sebagai Pilot".
- **Role_Selector**: Komponen pemilih role pada Step 1 Register_Page (kartu Perusahaan vs kartu Pilot).
- **Register_Stepper**: Indikator visual progres 3 langkah pada Register_Page.
- **Client**: Role pengguna mewakili perusahaan/BUMN pemilik aset infrastruktur.
- **Pilot**: Role pengguna mewakili pilot UAV/agensi drone bersertifikat SIDOPI.
- **SIDOPI_Certificate**: Berkas sertifikat resmi pilot UAV Indonesia yang diunggah pada Step 3 Register_Page khusus role Pilot.
- **Auth_Form_Validator**: Sub-modul yang melakukan validasi client-side pada input form Login dan Register.
- **Auth_Router**: Konfigurasi react-router-dom yang mengelola route `/`, `/login`, `/register`, dan placeholder dashboard.
- **Hero_CTA**: Tombol pada Hero section landing page — "Hire a Pilot" dan "Join as Pilot".
- **Design_Tokens**: Variabel CSS yang sudah didefinisikan di landing page (`--color-primary` `#0A192F`, `--color-accent` `#00D2FF`, `--color-surface` `#F4F7F6`, font Montserrat dan Inter).
- **Drone_Model**: Berkas 3D `public/models/drone.glb` yang sudah dipakai di landing page.
- **Auth_Session_Mock**: Penyimpanan client-side (mis. `sessionStorage` atau React state global) yang menandai user sebagai "logged in" tanpa backend nyata.
- **Register_Form_State**: Data isian Register_Page yang dipertahankan saat user navigasi maju-mundur antar step.
- **Page_Transition**: Animasi fade + slide-up yang memutus mount/unmount antar route.

## Requirements

### Requirement 1: Routing dan Akses Halaman

**User Story:** Sebagai pengunjung landing page, saya ingin mengklik tombol CTA dan tiba di halaman Login atau Register yang sesuai, sehingga saya bisa melanjutkan onboarding tanpa kebingungan.

#### Acceptance Criteria

1. THE Auth_Router SHALL menyediakan route `/login` yang me-render Login_Page.
2. THE Auth_Router SHALL menyediakan route `/register` yang me-render Register_Page.
3. THE Auth_Router SHALL menyediakan route `/` yang me-render landing page existing tanpa mengubah perilakunya.
4. WHEN user mengklik Hero_CTA "Hire a Pilot", THE Auth_Router SHALL navigasi ke `/register?role=client`.
5. WHEN user mengklik Hero_CTA "Join as Pilot", THE Auth_Router SHALL navigasi ke `/register?role=pilot`.
6. WHEN Register_Page dimuat pertama kali dengan query parameter `role=client` atau `role=pilot`, THE Register_Page SHALL otomatis memilih role tersebut dan melanjutkan ke Step 2.
7. IF query parameter `role` bernilai selain `client` atau `pilot`, THEN THE Register_Page SHALL mengabaikan parameter dan menampilkan Step 1 Role_Selector.
7a. WHILE user sudah aktif berinteraksi pada Step 1 dan query parameter `role` di URL berubah, THE Register_Page SHALL mempertahankan pilihan user saat ini dan TIDAK otomatis berpindah step.
8. WHEN user berada di Login_Page dan mengklik link "Belum punya akun? Daftar", THE Auth_Router SHALL navigasi ke `/register`.
9. WHEN user berada di Register_Page dan mengklik link "Sudah punya akun? Masuk", THE Auth_Router SHALL navigasi ke `/login`.

### Requirement 2: Layout Split-Screen dan Visual Konsistensi

**User Story:** Sebagai pengguna SIAGA, saya ingin halaman Login/Register terasa satu kesatuan dengan landing page, sehingga saya yakin berada di platform yang sama dan bukan halaman pihak ketiga.

#### Acceptance Criteria

1. ON viewport width >= 1024px, THE Login_Page SHALL menampilkan layout split-screen dengan panel kiri 50% lebar dan panel kanan 50% lebar.
2. ON viewport width >= 1024px, THE Register_Page SHALL menampilkan layout split-screen dengan panel kiri 50% lebar dan panel kanan 50% lebar.
3. THE Login_Page panel kiri SHALL menggunakan background warna `--color-primary` (#0A192F).
4. THE Login_Page panel kanan SHALL menggunakan background warna `--color-surface` (#F4F7F6).
5. THE Login_Page panel kiri SHALL menampilkan logo SIAGA besar, tagline "Sistem Inspeksi Aerial Geospasial Andalan", dan instance Drone_Model 3D yang mengambang dengan baling-baling berputar.
6. THE Register_Page panel kiri SHALL menampilkan elemen visual yang setara dengan Login_Page panel kiri (logo, tagline, Drone_Model 3D).
7. THE Auth_System SHALL menggunakan font Montserrat untuk seluruh heading dan font Inter untuk seluruh body/label/input.
8. THE Auth_System SHALL menggunakan `--color-accent` (#00D2FF) sebagai warna highlight untuk focus state input, tombol submit gradient, dan elemen aktif Register_Stepper.
9. THE Auth_System SHALL TIDAK memperkenalkan warna atau font di luar Design_Tokens existing.
10. WHEN user navigasi dari `/` ke `/login` atau `/register`, THE Page_Transition SHALL menjalankan animasi fade + slide-up dengan durasi antara 300ms dan 600ms.
11. THE Auth_System SHALL mempertahankan custom cursor cyan dari landing page tetap aktif pada Login_Page dan Register_Page.

### Requirement 3: Responsive Behavior

**User Story:** Sebagai pengguna mobile/tablet, saya ingin halaman Login/Register tetap usable di layar kecil tanpa elemen 3D yang membebani performa atau menutupi form.

#### Acceptance Criteria

1. ON viewport width < 768px, THE Login_Page SHALL menampilkan layout stacked dengan panel form mengisi 100% lebar dan menyembunyikan instance Drone_Model 3D.
2. ON viewport width < 768px, THE Register_Page SHALL menampilkan layout stacked dengan panel form mengisi 100% lebar dan menyembunyikan instance Drone_Model 3D.
3. ON viewport width antara 768px dan 1023px, THE Auth_System SHALL menampilkan layout stacked dengan logo dan tagline tampil di atas form, dan Drone_Model 3D opsional ditampilkan dengan ukuran tereduksi.
4. ON viewport width >= 320px, THE Auth_System SHALL memastikan seluruh field form terlihat tanpa horizontal scroll.

### Requirement 4: Login Form — Tab Switcher dan Field

**User Story:** Sebagai Client atau Pilot terdaftar, saya ingin masuk dengan kredensial saya melalui tab role yang jelas, sehingga session yang terbentuk sesuai dengan peran saya.

#### Acceptance Criteria

1. THE Login_Page SHALL menampilkan Role_Tab_Switcher dengan dua tab: "Masuk sebagai Perusahaan" dan "Masuk sebagai Pilot".
2. THE Role_Tab_Switcher SHALL memiliki tab "Masuk sebagai Perusahaan" sebagai tab default aktif saat halaman pertama dimuat tanpa state sebelumnya.
3. WHEN user mengklik tab non-aktif pada Role_Tab_Switcher, THE Login_Page SHALL berpindah role aktif dengan animasi transisi field selama 200ms hingga 400ms.
4. THE Login_Page SHALL menampilkan input field "Email" dan "Password" dengan style border bottom-only.
5. WHEN sebuah input field menerima focus, THE Auth_System SHALL mengubah border bottom-nya menjadi `--color-accent` dengan efek glow tipis.
6. THE Login_Page SHALL menyediakan custom checkbox "Ingat Saya" yang dapat di-toggle dengan animasi.
7. THE Login_Page SHALL menyediakan tombol submit "Masuk" dengan background gradient menggunakan `--color-accent`.
8. WHEN user men-submit form Login dan validasi client-side berhasil, THE Login_Page SHALL menampilkan loading state berupa spinner ikon drone selama animasi transisi mock minimal 800ms.
9. WHEN proses mock authentication selesai, THE Auth_System SHALL menyimpan Auth_Session_Mock berisi role yang dipilih dan mengarahkan user ke route dashboard placeholder yang sesuai role.
10. THE Auth_System SHALL menjamin bahwa nilai role pada Auth_Session_Mock identik dengan tab role yang aktif pada Role_Tab_Switcher saat user men-submit form Login.

### Requirement 5: Login Form — Validasi Input

**User Story:** Sebagai pengguna yang salah mengisi form, saya ingin pesan error yang jelas dan spesifik per field, sehingga saya tahu apa yang harus diperbaiki.

#### Acceptance Criteria

1. WHEN user men-submit Login form dengan field Email kosong, THE Auth_Form_Validator SHALL menampilkan pesan error "Email wajib diisi" tepat di bawah field Email.
2. WHEN user men-submit Login form dengan field Email berisi string yang tidak cocok dengan pola email (regex memerlukan minimal satu karakter sebelum `@`, satu karakter setelah `@`, dan satu titik diikuti minimal dua karakter), THE Auth_Form_Validator SHALL menampilkan pesan error "Format email tidak valid".
3. WHEN user men-submit Login form dengan field Password kosong, THE Auth_Form_Validator SHALL menampilkan pesan error "Password wajib diisi" tepat di bawah field Password.
4. WHEN user men-submit Login form dengan Password yang panjangnya kurang dari 8 karakter, THE Auth_Form_Validator SHALL menampilkan pesan error "Password minimal 8 karakter".
5. WHILE field input dalam keadaan error, THE Auth_System SHALL mewarnai border bottom field tersebut dengan `--color-danger` (#FF4C4C).
6. WHEN user mulai mengetik kembali pada field yang sebelumnya error, THE Auth_Form_Validator SHALL menghapus pesan error tersebut.
7. THE Auth_Form_Validator SHALL menjalankan validasi seluruh field sebelum men-trigger loading state submit.
8. IF validasi seluruh field tidak lolos, THEN THE Login_Page SHALL TIDAK men-trigger loading state dan TIDAK navigasi ke dashboard.
9. WHILE pesan error masih tampil pada UI, THE Login_Page SHALL TIDAK men-trigger loading state submit meskipun nilai field saat ini sudah valid.

### Requirement 6: Register Flow — Step 1 Role Selection

**User Story:** Sebagai calon pengguna, saya ingin memilih peran saya (Perusahaan atau Pilot) di awal proses registrasi, sehingga form berikutnya menampilkan field yang relevan dengan saya.

#### Acceptance Criteria

1. THE Register_Page SHALL menampilkan Register_Stepper dengan tiga langkah berlabel "Pilih Peran", "Data Akun", dan "Verifikasi".
2. ON Step 1, THE Role_Selector SHALL menampilkan dua kartu besar berlabel "Perusahaan" dan "Pilot / Agensi" dengan ikon dan deskripsi singkat.
3. WHEN user mengarahkan kursor ke salah satu kartu Role_Selector, THE Role_Selector SHALL menerapkan efek hover berupa kartu terangkat (transform translateY negatif) dengan transisi.
4. WHEN user mengklik salah satu kartu Role_Selector, THE Register_Page SHALL menyimpan role tersebut ke Register_Form_State dan navigasi ke Step 2.
5. THE Register_Stepper SHALL menandai langkah aktif menggunakan `--color-accent` dan langkah belum-aktif menggunakan warna netral abu.
6. IF user belum memilih role pada Step 1, THEN THE Register_Page SHALL TIDAK mengizinkan navigasi ke Step 2.

### Requirement 7: Register Flow — Step 2 Data Entry

**User Story:** Sebagai calon Client atau Pilot, saya ingin mengisi data akun saya sesuai role yang saya pilih, sehingga akun saya dibuat dengan profil yang relevan.

#### Acceptance Criteria

1. WHERE role pada Register_Form_State bernilai "client", THE Register_Page Step 2 SHALL menampilkan field: "Nama Perusahaan", "Email Korporat", "Nomor Telepon", "Password", dan "Konfirmasi Password".
2. WHERE role pada Register_Form_State bernilai "pilot", THE Register_Page Step 2 SHALL menampilkan field: "Nama Lengkap", "Email", "Nomor Telepon", "Password", dan "Konfirmasi Password".
3. WHEN user men-submit Step 2 dengan field wajib kosong, THE Auth_Form_Validator SHALL menampilkan pesan "Field ini wajib diisi" pada masing-masing field kosong.
4. WHEN user men-submit Step 2 dengan field Password yang panjangnya kurang dari 8 karakter, THE Auth_Form_Validator SHALL menampilkan pesan error "Password minimal 8 karakter".
5. WHEN user men-submit Step 2 dengan field Email tidak valid sesuai aturan Requirement 5.2, THE Auth_Form_Validator SHALL menampilkan pesan error "Format email tidak valid".
6. IF nilai field "Konfirmasi Password" tidak identik dengan field "Password", THEN THE Auth_Form_Validator SHALL menampilkan pesan error "Konfirmasi password tidak cocok".
7. WHEN user men-submit Step 2 dengan field Nomor Telepon yang mengandung karakter non-digit selain karakter `+`, spasi, atau tanda hubung, THE Auth_Form_Validator SHALL menampilkan pesan error "Nomor telepon tidak valid".
8. WHEN seluruh field Step 2 lolos validasi dan user mengklik "Lanjut", THE Register_Page SHALL menyimpan data ke Register_Form_State terlebih dahulu dan, hanya setelah penyimpanan sukses, melakukan navigasi ke Step 3.
8a. IF penyimpanan data Step 2 ke Register_Form_State gagal, THEN THE Register_Page SHALL TIDAK navigasi ke Step 3 dan SHALL menampilkan pesan error "Gagal menyimpan data, silakan coba lagi".
8b. WHEN aksi "Lanjut" dan aksi "Kembali" dipicu pada Step 2 dalam frame waktu yang sama, THE Register_Page SHALL memberi prioritas pada aksi yang pertama tercatat di event loop dan mengabaikan aksi berikutnya hingga navigasi selesai.
9. WHEN user mengklik tombol "Kembali" pada Step 2, THE Register_Page SHALL navigasi ke Step 1 tanpa kehilangan data yang sudah diisi pada Step 2.

### Requirement 8: Register Flow — Step 3 Verifikasi dan Upload SIDOPI

**User Story:** Sebagai Pilot calon pengguna, saya ingin mengunggah sertifikat SIDOPI saya sebagai bukti kredensial, sehingga saya dapat diverifikasi sebagai SIAGA Verified Pilot.

#### Acceptance Criteria

1. WHERE role pada Register_Form_State bernilai "pilot", THE Register_Page Step 3 SHALL menampilkan area upload SIDOPI_Certificate dengan tombol pilih file dan zona drag-and-drop.
2. WHERE role pada Register_Form_State bernilai "client", THE Register_Page Step 3 SHALL menampilkan ringkasan data akun dan checkbox persetujuan Syarat & Ketentuan tanpa area upload.
3. WHEN user memilih atau menjatuhkan file dengan ekstensi selain `.pdf`, `.jpg`, atau `.png` pada area upload SIDOPI_Certificate, THE Auth_Form_Validator SHALL menolak file, TIDAK menambahkannya ke Register_Form_State, TIDAK menampilkan informasi file, dan menampilkan pesan error "Format file harus PDF, JPG, atau PNG".
4. WHEN user memilih atau menjatuhkan file berukuran lebih dari 5 MB pada area upload SIDOPI_Certificate, THE Auth_Form_Validator SHALL menolak file, TIDAK menambahkannya ke Register_Form_State, TIDAK menampilkan informasi file, dan menampilkan pesan error "Ukuran file maksimal 5 MB".
5. WHEN file SIDOPI_Certificate berhasil diterima, THE Register_Page Step 3 SHALL menampilkan nama file, ukuran file, dan tombol "Hapus" untuk membatalkan pilihan.
6. WHERE role bernilai "pilot", IF SIDOPI_Certificate belum dipilih, THEN THE Register_Page SHALL TIDAK mengaktifkan tombol "Daftar".
6a. WHERE role pada Register_Form_State bernilai "client", THE Register_Page SHALL TIDAK me-render area upload SIDOPI_Certificate dan TIDAK menerima file SIDOPI_Certificate dalam bentuk apapun.
7. IF user belum mencentang checkbox persetujuan Syarat & Ketentuan, THEN THE Register_Page SHALL TIDAK mengaktifkan tombol "Daftar".
8. WHEN user mengklik tombol "Daftar" yang aktif, THE Register_Page SHALL menampilkan loading state spinner ikon drone selama animasi mock minimal 800ms, kemudian menyimpan Auth_Session_Mock dengan role terkait dan navigasi ke route dashboard placeholder yang sesuai.
9. WHEN user mengklik tombol "Kembali" pada Step 3, THE Register_Page SHALL navigasi ke Step 2 tanpa kehilangan data yang sudah diisi pada Step 2.

### Requirement 9: State Preservation Antar Step

**User Story:** Sebagai pengguna yang melalui Register flow, saya ingin data yang sudah saya isi tetap ada saat saya menavigasi maju-mundur antar step, sehingga saya tidak perlu mengetik ulang.

#### Acceptance Criteria

1. WHEN user navigasi dari satu step ke step lain di dalam Register_Page, THE Register_Form_State SHALL mempertahankan seluruh nilai field yang sudah diisi sebelumnya.
2. WHEN user mengubah role pada Step 1 setelah sebelumnya sudah mengisi Step 2 dengan role berbeda, THE Register_Page SHALL mengosongkan field Step 2 dan field Step 3 yang spesifik per role.
3. WHEN komponen Register_Page mengalami re-render selama user masih berada di flow yang sama, THE Register_Form_State SHALL TIDAK kehilangan nilai field yang sudah diisi.
4. WHEN user me-refresh halaman pada Register_Page, THE Register_Page SHALL kembali ke Step 1 dengan Register_Form_State kosong (tidak ada persistensi storage di luar sesi runtime).

### Requirement 10: Performance dan Lazy Loading 3D

**User Story:** Sebagai pengguna dengan koneksi terbatas, saya ingin halaman Login/Register tetap responsif dan tidak menggantung menunggu aset berat, sehingga saya bisa segera berinteraksi dengan form.

#### Acceptance Criteria

1. THE Auth_System SHALL me-load Drone_Model dengan lazy loading menggunakan React Suspense.
2. WHILE Drone_Model belum selesai dimuat, gagal dimuat, atau belum mulai dimuat, THE Auth_System SHALL menampilkan fallback placeholder ringan (mis. div berwarna `--color-primary` atau spinner kecil) tanpa memblokir form area.
3. THE Auth_System SHALL menjadikan form area panel kanan dapat di-interact (klik, input fokus, ketik) tanpa harus menunggu Drone_Model selesai dimuat.

### Requirement 11: Keamanan Client-Side

**User Story:** Sebagai pengguna yang peduli privasi, saya ingin password dan file sertifikat saya ditangani dengan aman di sisi klien, sehingga tidak ada kebocoran data sensitif lewat console atau penyimpanan tidak sengaja.

#### Acceptance Criteria

1. THE Auth_System SHALL TIDAK memanggil `console.log` atau metode `console` lain dengan argumen yang berisi nilai field Password.
2. THE Auth_Form_Validator SHALL memvalidasi tipe MIME file SIDOPI_Certificate dan menolak file yang tipe MIME-nya bukan `application/pdf`, `image/jpeg`, atau `image/png`.
3. THE Auth_Form_Validator SHALL memvalidasi ukuran file SIDOPI_Certificate sebelum menambahkan file ke Register_Form_State.
4. THE Auth_System SHALL me-render input Password dengan tipe `password` agar nilai tidak tampak sebagai plain text di layar.

### Requirement 12: Accessibility

**User Story:** Sebagai pengguna yang memakai screen reader atau navigasi keyboard, saya ingin dapat mengisi form Login/Register tanpa hambatan, sehingga halaman ini dapat diakses oleh siapa pun.

#### Acceptance Criteria

1. THE Auth_System SHALL memberi setiap input field elemen `<label>` yang terhubung melalui atribut `htmlFor` ke `id` input terkait.
2. WHEN sebuah field menampilkan pesan error, THE Auth_System SHALL mengaitkan pesan error tersebut ke input melalui atribut `aria-describedby`.
3. WHEN sebuah field memasuki state error, THE Auth_System SHALL memberi atribut `aria-invalid="true"` pada input terkait.
4. THE Auth_System SHALL menyediakan focus indicator visual yang kontras (mis. outline atau border bottom glow cyan) pada setiap elemen interaktif yang menerima fokus keyboard.
5. THE Role_Tab_Switcher SHALL dapat dinavigasi menggunakan keyboard (Tab untuk masuk komponen, panah kiri/kanan untuk berpindah tab, Enter atau Space untuk mengaktifkan).
6. THE Role_Selector SHALL dapat dinavigasi menggunakan keyboard dengan Tab antar kartu dan Enter atau Space untuk memilih.

### Requirement 13: Role Gating Setelah Login/Register

**User Story:** Sebagai pengguna yang sudah login, saya ingin diarahkan ke dashboard yang sesuai dengan role saya dan tidak melihat dashboard role lain, sehingga pengalaman saya konsisten dan tidak membingungkan.

#### Acceptance Criteria

1. WHEN Auth_Session_Mock tersimpan dengan nilai role "client", THE Auth_Router SHALL mengarahkan user ke route placeholder `/dashboard/client`.
2. WHEN Auth_Session_Mock tersimpan dengan nilai role "pilot", THE Auth_Router SHALL mengarahkan user ke route placeholder `/dashboard/pilot`.
3. THE Auth_Session_Mock SHALL memiliki nilai role yang identik dengan role yang dipilih pada Login Role_Tab_Switcher atau Register Role_Selector saat sukses submit (round-trip property: role yang masuk ke Auth_Session_Mock = role yang dipakai routing dashboard).
4. IF Auth_Session_Mock kosong saat user mencoba mengakses `/dashboard/client` atau `/dashboard/pilot`, THEN THE Auth_Router SHALL me-redirect user ke `/login`.
5. WHERE Auth_Session_Mock memiliki role "client", IF user mencoba mengakses `/dashboard/pilot`, THEN THE Auth_Router SHALL me-redirect user ke `/dashboard/client`.
6. WHERE Auth_Session_Mock memiliki role "pilot", IF user mencoba mengakses `/dashboard/client`, THEN THE Auth_Router SHALL me-redirect user ke `/dashboard/pilot`.

### Requirement 14: Recovery dari Error Submit

**User Story:** Sebagai pengguna yang mengalami error saat submit, saya ingin dapat memperbaiki kesalahan tanpa kehilangan progress, sehingga saya tidak frustasi dan menyerah di tengah jalan.

#### Acceptance Criteria

1. IF mock submit Login gagal (mis. simulasi error acak demi demo), THEN THE Login_Page SHALL menampilkan pesan error global di atas form berbunyi "Login gagal, silakan coba lagi" dan menghentikan loading state.
2. IF mock submit Register gagal (mis. simulasi error acak demi demo), THEN THE Register_Page SHALL mempertahankan seluruh nilai Register_Form_State dan menghentikan loading state, terlepas dari apakah pesan error global berhasil ditampilkan atau tidak.
2a. IF mock submit Register gagal, THEN THE Register_Page SHALL berusaha menampilkan pesan error global "Pendaftaran gagal, silakan coba lagi" di atas form Step 3.
3. WHEN user menutup pesan error global atau mengklik tombol submit kembali setelah loading state berakhir, THE Auth_System SHALL menghapus pesan error dan mengizinkan submit ulang.
4. WHILE Auth_System sedang dalam loading state submit, THE Auth_System SHALL mengabaikan klik submit tambahan sehingga TIDAK men-trigger dua kali navigasi atau dua kali penyimpanan Auth_Session_Mock.
