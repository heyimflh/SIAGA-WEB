import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';

vi.mock('./components/AuthDroneScene', () => ({
 default: () => <div data-testid="mock-drone-scene" />,

 AuthDroneErrorBoundary: ({ children }) => <>{children}</>,
}));

import AuthProvider from './auth/AuthContext.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx';
import ClientDashboard from './pages/DashboardPlaceholder/ClientDashboard.jsx';
import PilotDashboard from './pages/DashboardPlaceholder/PilotDashboard.jsx';

const SESSION_KEY = 'siaga_auth';


function TestApp({ initialEntries }) {
 return (
 <MemoryRouter initialEntries={initialEntries}>
 <AuthProvider>
 <Routes>
 <Route path="/login" element={<LoginPage />} />
 <Route path="/register" element={<RegisterPage />} />
 <Route
 path="/dashboard/client"
 element={
 <ProtectedRoute requestedRole="client">
 <ClientDashboard />
 </ProtectedRoute>
 }
 />
 <Route
 path="/dashboard/pilot"
 element={
 <ProtectedRoute requestedRole="pilot">
 <PilotDashboard />
 </ProtectedRoute>
 }
 />
 <Route path="*" element={<Navigate to="/login" replace />} />
 </Routes>
 </AuthProvider>
 </MemoryRouter>
 );
}

beforeEach(() => {


 if (typeof window !== 'undefined' && window.sessionStorage) {
 window.sessionStorage.clear();
 }
});

afterEach(() => {
 cleanup();
 if (typeof window !== 'undefined' && window.sessionStorage) {
 window.sessionStorage.clear();
 }
 vi.restoreAllMocks();
});

describe('App router smoke test (memory-router)', () => {


 it('/login renders LoginPage', () => {
 render(<TestApp initialEntries={['/login']} />);


 expect(
 screen.getByRole('heading', { name: /masuk ke akun siaga/i }),
 ).toBeInTheDocument();
 });


 it('/register?role=pilot renders Step 2 with pilot fields', () => {
 render(<TestApp initialEntries={['/register?role=pilot']} />);


 expect(
 screen.getByRole('heading', { name: /data pilot/i }),
 ).toBeInTheDocument();


 expect(screen.getByLabelText('Nama Lengkap')).toBeInTheDocument();
 expect(screen.getByLabelText('Email')).toBeInTheDocument();
 expect(screen.getByLabelText('Nomor Telepon')).toBeInTheDocument();
 expect(screen.getByLabelText('Password')).toBeInTheDocument();
 expect(screen.getByLabelText('Konfirmasi Password')).toBeInTheDocument();
 });


 it('/dashboard/client without a session redirects to /login', () => {
 render(<TestApp initialEntries={['/dashboard/client']} />);


 expect(
 screen.getByRole('heading', { name: /masuk ke akun siaga/i }),
 ).toBeInTheDocument();


 expect(
 screen.queryByRole('heading', { name: /client dashboard/i }),
 ).not.toBeInTheDocument();
 });


 it('/dashboard/pilot while logged in as client redirects to /dashboard/client', () => {


 window.sessionStorage.setItem(
 SESSION_KEY,
 JSON.stringify({
 role: 'client',
 email: 'client@example.com',
 ts: Date.now(),
 }),
 );

 render(<TestApp initialEntries={['/dashboard/pilot']} />);


 expect(
 screen.getByRole('heading', { name: /client dashboard/i }),
 ).toBeInTheDocument();


 expect(
 screen.queryByRole('heading', { name: /pilot dashboard/i }),
 ).not.toBeInTheDocument();
 expect(
 screen.queryByRole('heading', { name: /masuk ke akun siaga/i }),
 ).not.toBeInTheDocument();
 });
});
