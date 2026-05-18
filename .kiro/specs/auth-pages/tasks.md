# Implementation Plan: auth-pages

## Overview

Implementasi fitur auth-pages dilakukan secara incremental dengan urutan: setup routing & test infrastructure → pure logic layer (validators, reducer, route helpers) → UI shell & layout → halaman Login → halaman Register (Step 1 → 2 → 3) → dashboard placeholder & guard → wiring akhir di `App.jsx`.

Pure logic (validators, reducer, `pickRedirect`) dikerjakan duluan agar property-based tests bisa langsung memverifikasi 11 correctness properties dari design sebelum komponen UI dirakit. UI components mengkonsumsi pure layer ini sehingga sebagian besar bug auth tertangkap di level test logic, bukan di level browser.

Stack: React 19 + Vite 8 + Framer Motion (sudah ada). Tambahan: `react-router-dom@^6`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `fast-check`, `vitest-axe`.

## Tasks

- [x] 1. Setup routing dependency, test runner, dan struktur folder auth
  - [x] 1.1 Install `react-router-dom`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `fast-check`, `vitest-axe`, `jsdom` sebagai devDependencies dan tambah script `"test": "vitest run"` ke `package.json`
    - Buat `vitest.config.js` dengan `environment: 'jsdom'` dan `setupFiles` ke `src/test/setup.js`
    - Buat `src/test/setup.js` yang mengimpor `@testing-library/jest-dom/vitest`
    - _Requirements: 1.1, 1.2_
  - [x] 1.2 Buat struktur folder `src/auth/`, `src/pages/LoginPage/`, `src/pages/RegisterPage/`, `src/pages/DashboardPlaceholder/` dan file komponen kosong sesuai modul boundaries di design (placeholder default export)
    - Tujuan: file path eksis sehingga import di langkah berikutnya tidak breaking
    - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Implement pure logic layer — routes, validators, reducer
  - [x] 2.1 Implement `src/auth/routes.js` dengan konstanta path, `roleToDashboardPath(role)`, dan `pickRedirect(session, requestedRole)`
    - Export `ROUTES = { ROOT: '/', LOGIN: '/login', REGISTER: '/register', DASHBOARD_CLIENT: '/dashboard/client', DASHBOARD_PILOT: '/dashboard/pilot' }`
    - `roleToDashboardPath('client') === '/dashboard/client'`, `roleToDashboardPath('pilot') === '/dashboard/pilot'`
    - `pickRedirect`: null session → `'/login'`; matching role → `null`; mismatched role → `'/dashboard/' + session.role`
    - _Requirements: 1.1, 1.2, 1.3, 13.1, 13.2, 13.4, 13.5, 13.6_

  - [x] 2.2 Write property test `routes.pickRedirect.property.test.js` for `pickRedirect` totality and consistency
    - **Property 8: ProtectedRoute redirect logic is consistent**
    - **Validates: Requirements 13.4, 13.5, 13.6**
    - Generator: `fc.oneof(fc.constant(null), fc.record({ role: fc.constantFrom('client','pilot'), email: fc.string(), ts: fc.integer() }))` × `fc.constantFrom('client','pilot')`; min 100 runs

  - [x] 2.3 Implement `src/auth/validators.js` — email/password/phone/login/step2/sidopi/submitEnabled validators
    - Export `EMAIL_RE`, `PHONE_RE` (single source of truth)
    - `validateEmail`, `validatePassword`, `validatePhone`, `validateLogin`, `validateStep2(role, fields)`, `validateSidopiFile(file)`, `isSubmitEnabled(state)`
    - Pesan error harus persis: `"Email wajib diisi"`, `"Format email tidak valid"`, `"Password wajib diisi"`, `"Password minimal 8 karakter"`, `"Field ini wajib diisi"`, `"Konfirmasi password tidak cocok"`, `"Nomor telepon tidak valid"`, `"Format file harus PDF, JPG, atau PNG"`, `"Ukuran file maksimal 5 MB"`
    - `ALLOWED_MIME = ['application/pdf', 'image/jpeg', 'image/png']`; size limit `5 * 1024 * 1024`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 7.3, 7.4, 7.5, 7.6, 7.7, 8.3, 8.4, 8.6, 8.6a, 8.7, 11.2, 11.3_

  - [x] 2.4 Write property test `validators.login.property.test.js` for login validation
    - **Property 1: Login validation rejects invalid inputs and accepts valid ones**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**

  - [x] 2.5 Write property test `validators.step2.property.test.js` for Step 2 validation per role
    - **Property 2: Step 2 validation enforces all field rules per role**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7**

  - [x] 2.6 Write property test `validators.sidopi.property.test.js` for SIDOPI file validation
    - **Property 3: SIDOPI file validation accepts only allowed MIME and size**
    - **Validates: Requirements 8.3, 8.4, 11.2, 11.3**

  - [x] 2.7 Write property test `validators.submitEnabled.property.test.js` for Step 3 submit gating
    - **Property 4: Register submit gating depends on terms + role-specific verification**
    - **Validates: Requirements 8.6, 8.6a, 8.7**

  - [x] 2.8 Implement `src/pages/RegisterPage/registerReducer.js` — pure reducer with all actions
    - Initial state sesuai `RegisterFormState` shape di design
    - Actions: `SET_ROLE`, `SET_FIELD`, `SET_FILE`, `CLEAR_FILE`, `TOGGLE_TERMS`, `GO_TO_STEP`, `BACK`, `SET_ERRORS`, `CLEAR_ERROR`, `SUBMIT_START`, `SUBMIT_SUCCESS`, `SUBMIT_FAILURE`
    - Guards: `GO_TO_STEP(2)` ditolak saat `role === null`; `SET_ROLE` dengan role berbeda mereset `client`, `pilot`, `sidopiFile`; `SET_FIELD` membersihkan `stepErrors[fieldName]`; `SUBMIT_START` saat `isSubmitting === true` mengembalikan state apa adanya; `SUBMIT_FAILURE` mempertahankan semua field user data; `inFlight` flag drop aksi kedua dalam frame yang sama
    - _Requirements: 6.6, 7.8b, 7.9, 8.9, 9.1, 9.2, 9.3, 14.2, 14.4_

  - [x] 2.9 Write property test `registerReducer.preservation.property.test.js` for state preservation
    - **Property 5: Reducer preserves prior step data on BACK and forward navigation**
    - **Validates: Requirements 7.9, 8.9, 9.1, 9.3**

  - [x] 2.10 Write property test `registerReducer.roleChange.property.test.js` for role change clearing
    - **Property 6: Changing role clears role-specific fields**
    - **Validates: Requirement 9.2**

  - [x] 2.11 Write property test `reducer.submitGuard.property.test.js` for double-submit guard
    - **Property 9: Submit guard prevents double-trigger**
    - **Validates: Requirement 14.4**

  - [x] 2.12 Write property test `reducer.failurePreserve.property.test.js` for failure state preservation
    - **Property 10: Failed submit preserves Register form state**
    - **Validates: Requirement 14.2**

  - [x] 2.13 Write property test `reducer.errorClear.property.test.js` for inline error clearing on edit
    - **Property 11: Error clears on field re-edit**
    - **Validates: Requirement 5.6**

- [x] 3. Checkpoint — Pure logic layer complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement AuthContext, ProtectedRoute, dan dashboard placeholders
  - [x] 4.1 Implement `src/auth/AuthContext.jsx` provider dengan `useAuth()` hook, `login({ role, email })`, `logout()`, persisting ke `sessionStorage` key `siaga_auth`
    - On mount: hydrate state dari `sessionStorage.getItem('siaga_auth')`
    - `login`: `sessionStorage.setItem('siaga_auth', JSON.stringify({ role, email, ts: Date.now() }))` lalu update state
    - _Requirements: 4.9, 4.10, 8.8, 13.1, 13.2, 13.3_

  - [x] 4.2 Implement `src/auth/ProtectedRoute.jsx` yang pakai `pickRedirect` dan `<Navigate>` dari react-router-dom
    - Props: `{ requestedRole, children }`; render `children` jika `pickRedirect(session, requestedRole) === null`, else `<Navigate to={...} replace />`
    - _Requirements: 13.4, 13.5, 13.6_

  - [x] 4.3 Implement `src/pages/DashboardPlaceholder/ClientDashboard.jsx` dan `PilotDashboard.jsx` sebagai komponen placeholder sederhana
    - Render heading, label role, dan tombol logout (panggil `useAuth().logout()` lalu `navigate('/login')`)
    - _Requirements: 13.1, 13.2_

  - [x] 4.4 Write property test `auth.roundTrip.property.test.js` untuk role round-trip
    - **Property 7: Role round-trip from form to session to dashboard**
    - **Validates: Requirements 4.10, 13.1, 13.2, 13.3**
    - Mock `sessionStorage`, lakukan `login({role})` → baca via `useAuth` (atau langsung dari `sessionStorage`) → assert `roleToDashboardPath(readRole) === '/dashboard/' + role`

- [x] 5. Implement layout shell, page transition, dan lazy 3D scene
  - [x] 5.1 Implement `src/components/AuthLayout.jsx` + `AuthLayout.css` — split-screen 50/50 di `>=1024px`, stacked `<1024px`, hide drone area `<768px`
    - Panel kiri background `--color-primary`, panel kanan `--color-surface`
    - Render logo SIAGA, tagline, slot `<Suspense>` untuk drone scene
    - Pastikan custom cursor (existing `CustomCursor`) tetap aktif (jangan unmount)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.11, 3.1, 3.2, 3.3, 3.4_

  - [x] 5.2 Implement `src/components/AuthDroneScene.jsx` (lazy-loadable) yang reuse pattern `Scene.jsx` existing dengan `public/models/drone.glb`
    - Floating + propeller spin animation (no parallax mouse tracking)
    - File harus default-exported untuk dipakai dengan `React.lazy`
    - Tambah local `AuthDroneErrorBoundary` yang fallback ke `<DronePlaceholder />` div solid navy
    - _Requirements: 2.5, 2.6, 10.1, 10.2, 10.3_

  - [x] 5.3 Implement `src/components/PageTransition.jsx` dengan Framer Motion variants (initial fade+y:24 → animate y:0 dur 400ms → exit y:-16 dur 300ms)
    - Component menerima `children` dan key route untuk dipakai bersama `AnimatePresence mode="wait"`
    - _Requirements: 2.10_

- [x] 6. Implement Login Page
  - [x] 6.1 Implement `src/pages/LoginPage/RoleTabSwitcher.jsx` dengan WAI-ARIA tabs pattern
    - `role="tablist"`, tabs dengan `role="tab"`, `aria-selected`, `tabIndex` rotating
    - Keyboard: ArrowLeft/ArrowRight pindah tab, Enter/Space mengaktifkan, Tab keluar komponen
    - Animasi indicator slide 300ms
    - _Requirements: 4.1, 4.2, 4.3, 12.5_

  - [x] 6.2 Implement `src/pages/LoginPage/LoginForm.jsx` — controlled form (email, password, rememberMe), inline errors, focus state cyan, error banner global, submit handler dengan urutan eksak dari design
    - Submit order: validate → if errors return → if errors masih tampil return → if `isSubmitting` return → set submitting → 800ms mock delay → 95% sukses, 5% gagal acak → on success call `login({role,email})` + navigate, on failure set `errors.global` + reset submitting
    - Aria: `<label htmlFor>`, `aria-describedby` untuk pesan error, `aria-invalid` saat error
    - Input password `type="password"`; jangan pernah `console.log` password
    - _Requirements: 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 11.1, 11.4, 12.1, 12.2, 12.3, 12.4, 14.1, 14.3, 14.4_

  - [x] 6.3 Implement `src/pages/LoginPage/LoginPage.jsx` + `LoginPage.css` — wrapper yang merangkai `AuthLayout`, `RoleTabSwitcher`, dan `LoginForm`, plus link "Belum punya akun? Daftar" → `/register`
    - _Requirements: 1.8, 2.1–2.11_

  - [x] 6.4 Write integration test untuk `LoginPage` (render + fill + submit + assert navigate dan error banner)
    - Test: validation error tidak trigger loading; submit sukses memanggil `login` dan navigate; submit gagal menampilkan banner; double-click tidak men-trigger dua kali
    - _Requirements: 4.8, 4.9, 4.10, 5.7, 5.8, 5.9, 14.1, 14.3, 14.4_

  - [x] 6.5 Write console hygiene test untuk Login flow
    - Spy `console.log/info/warn/error`; jalankan login dengan password `"secret123!"`; assert tidak ada call yang argumennya mengandung substring tersebut
    - _Requirements: 11.1_

- [x] 7. Implement Register Page — Stepper, Step 1, Step 2, Step 3
  - [x] 7.1 Implement `src/pages/RegisterPage/RegisterStepper.jsx` — indikator 3 langkah, aktif `--color-accent`, non-aktif abu netral
    - _Requirements: 6.1, 6.5_

  - [x] 7.2 Implement `src/pages/RegisterPage/RoleSelector.jsx` (Step 1) — dua kartu `<button>`, hover translateY(-6px), klik dispatch `SET_ROLE` lalu `GO_TO_STEP(2)`
    - Read `?role=` dari `useSearchParams` dengan `useEffect(..., [])` saja (sekali saat mount); abaikan perubahan query setelahnya
    - Jika query `role` valid (`client`/`pilot`) dan `state.role === null`, auto-set role + advance Step 2; jika invalid, biarkan di Step 1
    - Keyboard: button native handle Enter/Space; tab order benar
    - _Requirements: 1.4, 1.5, 1.6, 1.7, 1.7a, 6.2, 6.3, 6.4, 6.6, 12.6_

  - [x] 7.3 Implement `src/pages/RegisterPage/DataEntryForm.jsx` (Step 2) — render fields per role, validasi via `validateStep2`, tombol "Lanjut" + "Kembali"
    - Field client: companyName, corporateEmail, phone, password, confirmPassword
    - Field pilot: fullName, email, phone, password, confirmPassword
    - Border bottom-only style; focus glow cyan; error border `--color-danger`
    - "Lanjut" dispatch persistence-then-`GO_TO_STEP(3)`; jika persistence gagal (try/catch) dispatch `SET_ERRORS({ global: 'Gagal menyimpan data, silakan coba lagi' })`, tidak transisi
    - "Kembali" dispatch `BACK` tanpa validasi
    - Concurrent guard: `inFlight` flag di reducer mengabaikan aksi kedua
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.8a, 7.8b, 7.9, 12.1, 12.2, 12.3, 12.4_

  - [x] 7.4 Implement `src/pages/RegisterPage/SidopiUpload.jsx` — dropzone HTML5 native, validasi via `validateSidopiFile`, info file + tombol Hapus, banner error di atas dropzone
    - File ditolak tidak masuk state; UI dropzone tetap aktif menerima file lain
    - Aria: input `<input type="file" accept=".pdf,.jpg,.jpeg,.png">` dengan label terhubung
    - _Requirements: 8.1, 8.3, 8.4, 8.5, 11.2, 11.3, 12.1, 12.2, 12.3_

  - [x] 7.5 Implement `src/pages/RegisterPage/VerificationStep.jsx` (Step 3) — render `SidopiUpload` ATAU `ClientSummary` berdasarkan role, plus `TermsCheckbox` dan tombol "Daftar" yang `disabled={!isSubmitEnabled(state)}`
    - Penting: untuk role client, `SidopiUpload` SAMA SEKALI tidak di-render (tidak hanya di-hide CSS)
    - Tombol "Kembali" dispatch `BACK` tanpa kehilangan data Step 2
    - Submit handler: dispatch `SUBMIT_START` (guarded oleh `isSubmitting`) → 800ms mock delay → 95% sukses panggil `login` + navigate ke dashboard sesuai role; 5% gagal dispatch `SUBMIT_FAILURE` + tampilkan banner global "Pendaftaran gagal, silakan coba lagi"
    - _Requirements: 8.2, 8.5, 8.6, 8.6a, 8.7, 8.8, 8.9, 14.2, 14.2a, 14.3, 14.4_

  - [x] 7.6 Implement `src/pages/RegisterPage/RegisterPage.jsx` + `RegisterPage.css` — wrapper yang merangkai `AuthLayout`, `RegisterStepper`, dan switcher Step 1/2/3 berdasarkan `state.step`, plus link "Sudah punya akun? Masuk" → `/login`
    - Pasang `useReducer(registerReducer, initialState)` di sini; lewatkan `state` dan `dispatch` ke child via props atau context lokal
    - _Requirements: 1.9, 2.1–2.11, 9.4 (refresh = remount = state awal)_

  - [x] 7.7 Write integration test untuk RegisterPage (Step 1 query param, Step 2 validation, Step 3 gating)
    - `/register?role=pilot` → Step 2 dengan field pilot; `?role=foo` → Step 1; submit Step 3 sukses → navigate ke `/dashboard/{role}`; failure → banner + state preserved
    - _Requirements: 1.6, 1.7, 1.7a, 7.8, 8.6, 8.7, 8.8, 14.2, 14.2a_

  - [x] 7.8 Write a11y test untuk LoginPage dan RegisterPage menggunakan `vitest-axe`
    - Assert no axe violations untuk Login, Register Step 1, Step 2 (client + pilot), Step 3 (client + pilot)
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [x] 8. Wire routing di `App.jsx` dan integrasi Hero CTA
  - [x] 8.1 Refactor `src/App.jsx` jadi root router: `<BrowserRouter><AuthProvider><AnimatePresence mode="wait"><Routes>...</Routes></AnimatePresence></AuthProvider></BrowserRouter>`
    - Routes: `/` → existing landing component; `/login` → `<PageTransition><LoginPage/></PageTransition>`; `/register` → `<PageTransition><RegisterPage/></PageTransition>`; `/dashboard/client` → `<ProtectedRoute requestedRole="client"><ClientDashboard/></ProtectedRoute>`; `/dashboard/pilot` → `<ProtectedRoute requestedRole="pilot"><PilotDashboard/></ProtectedRoute>`; `*` → `<Navigate to="/" />`
    - Pertahankan `CustomCursor` di level App agar aktif di semua route
    - _Requirements: 1.1, 1.2, 1.3, 2.10, 2.11, 13.1, 13.2, 13.4, 13.5, 13.6_

  - [x] 8.2 Update Hero CTA buttons di landing page existing — "Hire a Pilot" navigate ke `/register?role=client`, "Join as Pilot" navigate ke `/register?role=pilot`
    - Pakai `useNavigate` dari react-router-dom; ganti handler existing kalau ada
    - _Requirements: 1.4, 1.5_

  - [x] 8.3 Write smoke test memorial-router untuk wiring lengkap
    - `/login` render LoginPage; `/register?role=pilot` render Step 2 dengan field pilot; `/dashboard/client` tanpa session redirect ke `/login`; setelah login client manual → akses `/dashboard/pilot` redirect ke `/dashboard/client`
    - _Requirements: 1.1, 1.2, 1.6, 13.4, 13.5_

- [x] 9. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Sub-tasks bertanda `*` adalah test yang opsional dan dapat dilewati untuk MVP demo cepat. Core implementation (no `*`) wajib dijalankan agar fitur berfungsi.
- Setiap task merujuk kembali ke klausa requirement spesifik (bukan hanya nomor user story) untuk traceability.
- Property tests memvalidasi 11 correctness properties dari design; tag setiap test dengan `// Feature: auth-pages, Property {N}: {text}`.
- Reducer dan validators sebagai pure function dikerjakan duluan agar PBT bisa berjalan terisolasi tanpa render component.
- Sub-task 6.4, 6.5, 7.7, 7.8, dan 8.3 adalah integration/a11y/smoke tests — bukan PBT — sehingga ditandai opsional tapi tidak terikat numerasi Property.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "2.3", "2.8"] },
    { "id": 2, "tasks": ["2.2", "2.4", "2.5", "2.6", "2.7", "2.9", "2.10", "2.11", "2.12", "2.13", "4.1", "5.2", "5.3", "7.1"] },
    { "id": 3, "tasks": ["4.2", "4.3", "5.1", "6.1", "7.2", "7.4"] },
    { "id": 4, "tasks": ["4.4", "6.2", "7.3", "7.5"] },
    { "id": 5, "tasks": ["6.3", "7.6"] },
    { "id": 6, "tasks": ["6.4", "6.5", "7.7", "7.8", "8.1", "8.2"] },
    { "id": 7, "tasks": ["8.3"] }
  ]
}
```
