import React from 'react';
import {
 describe,
 test,
 expect,
 beforeEach,
 afterEach,
 vi,
} from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../components/AuthLayout.jsx', () => ({
 default: ({ children }) => (
 <div data-testid="auth-layout-mock">{children}</div>
 ),
}));


const navigateMock = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
 const actual = await importOriginal();
 return {
 ...actual,
 useNavigate: () => navigateMock,
 };
});

import RegisterPage from './RegisterPage.jsx';
import { AuthProvider } from '../../auth/AuthContext.jsx';


function renderRegisterAt(initialEntry) {
 return render(
 <MemoryRouter initialEntries={[initialEntry]}>
 <AuthProvider>
 <RegisterPage />
 </AuthProvider>
 </MemoryRouter>,
 );
}


const PILOT_VALID = {
 'Nama Lengkap': 'Budi Pilot',
 Email: 'budi@example.com',
 'Nomor Telepon': '081234567890',
 Password: 'rahasia12',
 'Konfirmasi Password': 'rahasia12',
};

function fillPilotStep2(values) {
 for (const [label, value] of Object.entries(values)) {
 const input = screen.getByLabelText(label);
 fireEvent.change(input, { target: { value } });
 }
}

beforeEach(() => {
 navigateMock.mockReset();

 window.sessionStorage.clear();
});

afterEach(() => {
 vi.useRealTimers();
 vi.restoreAllMocks();
});


describe('RegisterPage — query param routing', () => {
 test('?role=pilot mounts directly into Step 2 with pilot fields', () => {
 renderRegisterAt('/register?role=pilot');


 expect(
 screen.getByRole('heading', { name: /data pilot/i }),
 ).toBeInTheDocument();


 expect(screen.getByLabelText('Nama Lengkap')).toBeInTheDocument();
 expect(screen.getByLabelText('Email')).toBeInTheDocument();
 expect(screen.getByLabelText('Nomor Telepon')).toBeInTheDocument();
 expect(screen.getByLabelText('Password')).toBeInTheDocument();
 expect(screen.getByLabelText('Konfirmasi Password')).toBeInTheDocument();


 expect(
 screen.queryByRole('heading', { name: /pilih peran anda/i }),
 ).not.toBeInTheDocument();
 });


 test('?role=foo (invalid) keeps user on Step 1 with role cards visible', () => {
 renderRegisterAt('/register?role=foo');


 expect(
 screen.getByRole('heading', { name: /pilih peran anda/i }),
 ).toBeInTheDocument();


 expect(
 screen.getByRole('button', { name: /perusahaan/i }),
 ).toBeInTheDocument();
 expect(
 screen.getByRole('button', { name: /pilot \/ agensi/i }),
 ).toBeInTheDocument();


 expect(
 screen.queryByRole('heading', { name: /data pilot/i }),
 ).not.toBeInTheDocument();
 expect(
 screen.queryByRole('heading', { name: /data perusahaan/i }),
 ).not.toBeInTheDocument();
 });
});


describe('RegisterPage — Step 2 validation gating', () => {
 test('clicking Lanjut with invalid data shows errors and stays on Step 2', () => {
 renderRegisterAt('/register?role=pilot');


 expect(
 screen.getByRole('heading', { name: /data pilot/i }),
 ).toBeInTheDocument();


 fireEvent.change(screen.getByLabelText('Email'), {
 target: { value: 'not-an-email' },
 });
 fireEvent.change(screen.getByLabelText('Nomor Telepon'), {
 target: { value: '123' },
 });
 fireEvent.change(screen.getByLabelText('Password'), {
 target: { value: 'short' },
 });
 fireEvent.change(screen.getByLabelText('Konfirmasi Password'), {
 target: { value: 'different' },
 });

 fireEvent.click(screen.getByRole('button', { name: /lanjut/i }));


 expect(screen.getByText('Field ini wajib diisi')).toBeInTheDocument();
 expect(screen.getByText('Format email tidak valid')).toBeInTheDocument();
 expect(screen.getByText('Nomor telepon tidak valid')).toBeInTheDocument();
 expect(screen.getByText('Password minimal 8 karakter')).toBeInTheDocument();
 expect(
 screen.getByText('Konfirmasi password tidak cocok'),
 ).toBeInTheDocument();


 expect(
 screen.getByRole('heading', { name: /data pilot/i }),
 ).toBeInTheDocument();

 expect(
 screen.queryByLabelText(/syarat & ketentuan/i),
 ).not.toBeInTheDocument();
 expect(
 screen.queryByRole('button', { name: /^daftar$/i }),
 ).not.toBeInTheDocument();
 });
});


function advanceToStep3WithPilotReady() {

 fillPilotStep2(PILOT_VALID);
 fireEvent.click(screen.getByRole('button', { name: /lanjut/i }));


 const fileInput = document.getElementById('sidopi-file');
 expect(fileInput).not.toBeNull();

 const goodFile = new File(['%PDF-1.4 mock'], 'sidopi.pdf', {
 type: 'application/pdf',
 });
 fireEvent.change(fileInput, { target: { files: [goodFile] } });


 const termsBox = screen.getByLabelText(/syarat & ketentuan/i);
 fireEvent.click(termsBox);


 const submitBtn = screen.getByRole('button', { name: /^daftar$/i });
 expect(submitBtn).not.toBeDisabled();
 return submitBtn;
}


describe('RegisterPage — Step 3 submit', () => {
 test('successful submit navigates to /dashboard/pilot and calls login', async () => {
 vi.useFakeTimers();
 const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

 renderRegisterAt('/register?role=pilot');
 const submitBtn = advanceToStep3WithPilotReady();

 fireEvent.click(submitBtn);


 await act(async () => {
 await vi.advanceTimersByTimeAsync(800);
 });

 expect(navigateMock).toHaveBeenCalledTimes(1);
 expect(navigateMock).toHaveBeenCalledWith('/dashboard/pilot');


 const stored = window.sessionStorage.getItem('siaga_auth');
 expect(stored).not.toBeNull();
 const parsed = JSON.parse(stored);
 expect(parsed.role).toBe('pilot');
 expect(parsed.email).toBe(PILOT_VALID.Email);

 randomSpy.mockRestore();
 });


 test('failed submit surfaces banner and preserves Step 3 state', async () => {
 vi.useFakeTimers();
 const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.99);

 renderRegisterAt('/register?role=pilot');
 const submitBtn = advanceToStep3WithPilotReady();

 fireEvent.click(submitBtn);

 await act(async () => {
 await vi.advanceTimersByTimeAsync(800);
 });


 expect(
 screen.getByText('Pendaftaran gagal, silakan coba lagi'),
 ).toBeInTheDocument();


 expect(navigateMock).not.toHaveBeenCalled();


 expect(window.sessionStorage.getItem('siaga_auth')).toBeNull();


 expect(screen.getByLabelText(/syarat & ketentuan/i)).toBeInTheDocument();
 expect(screen.getByTestId('sidopi-file-info')).toBeInTheDocument();
 expect(screen.getByText('sidopi.pdf')).toBeInTheDocument();
 expect(
 screen.getByRole('button', { name: /^daftar$/i }),
 ).toBeInTheDocument();


 expect(screen.getByLabelText(/syarat & ketentuan/i)).toBeChecked();

 randomSpy.mockRestore();
 });
});
