import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act, cleanup, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('../../components/AuthLayout.jsx', () => ({
 default: ({ children }) => <div data-testid="mock-auth-layout">{children}</div>,
}));

import LoginPage from './LoginPage.jsx';
import { AuthProvider } from '../../auth/AuthContext.jsx';


function renderLoginPage() {
 return render(
 <AuthProvider>
 <MemoryRouter initialEntries={['/login']}>
 <Routes>
 <Route path="/login" element={<LoginPage />} />
 <Route
 path="/dashboard/client"
 element={<div data-testid="dashboard-client">Client Dashboard</div>}
 />
 <Route
 path="/dashboard/pilot"
 element={<div data-testid="dashboard-pilot">Pilot Dashboard</div>}
 />
 </Routes>
 </MemoryRouter>
 </AuthProvider>
 );
}


function fillCredentials({ email, password }) {
 const emailInput = screen.getByLabelText('Email');
 const passwordInput = screen.getByLabelText('Password');
 fireEvent.change(emailInput, { target: { value: email } });
 fireEvent.change(passwordInput, { target: { value: password } });
}

function getSubmitButton() {
 return screen.getByRole('button', { name: /masuk|memproses/i });
}

describe('LoginPage integration', () => {
 beforeEach(() => {

 if (typeof window !== 'undefined' && window.sessionStorage) {
 window.sessionStorage.clear();
 }


 vi.useFakeTimers({ shouldAdvanceTime: true });
 });

 afterEach(() => {
 vi.useRealTimers();
 vi.restoreAllMocks();
 cleanup();
 });

 it('shows validation errors on empty submit and does NOT enter loading state', async () => {
 renderLoginPage();

 const submitBtn = getSubmitButton();

 fireEvent.click(submitBtn);

 expect(screen.getByText('Email wajib diisi')).toBeInTheDocument();
 expect(screen.getByText('Password wajib diisi')).toBeInTheDocument();

 expect(submitBtn).not.toBeDisabled();
 expect(submitBtn).not.toHaveAttribute('aria-busy', 'true');
 expect(submitBtn).toHaveTextContent('Masuk');

 expect(screen.queryByTestId('dashboard-client')).not.toBeInTheDocument();
 expect(screen.queryByTestId('dashboard-pilot')).not.toBeInTheDocument();

 expect(screen.queryByText('Login gagal, silakan coba lagi')).not.toBeInTheDocument();
 });

 it('submits valid credentials, calls login and navigates to /dashboard/client', async () => {

 vi.spyOn(Math, 'random').mockReturnValue(0.9);

 renderLoginPage();

 fillCredentials({ email: 'user@example.com', password: 'secret123' });

 fireEvent.click(getSubmitButton());

 const loadingBtn = screen.getByRole('button', { name: /memproses/i });
 expect(loadingBtn).toBeDisabled();
 expect(loadingBtn).toHaveAttribute('aria-busy', 'true');

 await act(async () => {
 await vi.advanceTimersByTimeAsync(800);
 });

 await waitFor(() => {
 expect(screen.getByTestId('dashboard-client')).toBeInTheDocument();
 });

 const raw = window.sessionStorage.getItem('siaga_auth');
 expect(raw).not.toBeNull();
 const parsed = JSON.parse(raw);
 expect(parsed.role).toBe('client');
 expect(parsed.email).toBe('user@example.com');
 });

 it('shows the global error banner and resets loading on submit failure', async () => {

 vi.spyOn(Math, 'random').mockReturnValue(0.01);

 renderLoginPage();

 fillCredentials({ email: 'user@example.com', password: 'secret123' });

 fireEvent.click(getSubmitButton());

 expect(screen.getByRole('button', { name: /memproses/i })).toBeDisabled();

 await act(async () => {
 await vi.advanceTimersByTimeAsync(800);
 });

 await waitFor(() => {
 expect(screen.getByText('Login gagal, silakan coba lagi')).toBeInTheDocument();
 });

 const submitBtn = screen.getByRole('button', { name: /masuk/i });
 expect(submitBtn).not.toBeDisabled();
 expect(submitBtn).not.toHaveAttribute('aria-busy', 'true');

 expect(window.sessionStorage.getItem('siaga_auth')).toBeNull();

 expect(screen.queryByTestId('dashboard-client')).not.toBeInTheDocument();
 });

 it('double-click on submit only triggers a single login attempt', async () => {
 renderLoginPage();

 fillCredentials({ email: 'user@example.com', password: 'secret123' });

 const submitBtn = getSubmitButton();

 const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

 vi.spyOn(Math, 'random').mockReturnValue(0.9);

 await act(async () => {
 fireEvent.click(submitBtn);
 });
 await act(async () => {
 fireEvent.click(submitBtn);
 });

 const submitDelayCalls = setTimeoutSpy.mock.calls.filter(
 ([, delay]) => delay === 800
 );
 expect(submitDelayCalls).toHaveLength(1);

 await act(async () => {
 await vi.advanceTimersByTimeAsync(800);
 });

 await waitFor(() => {
 expect(screen.getByTestId('dashboard-client')).toBeInTheDocument();
 });

 const raw = window.sessionStorage.getItem('siaga_auth');
 expect(raw).not.toBeNull();
 const parsed = JSON.parse(raw);
 expect(parsed.email).toBe('user@example.com');
 expect(parsed.role).toBe('client');
 });
});
