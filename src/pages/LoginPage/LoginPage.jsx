import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout.jsx';
import RoleTabSwitcher from './RoleTabSwitcher.jsx';
import LoginForm from './LoginForm.jsx';
import './LoginPage.css';

/**
 * LoginPage — Premium Glassmorphism Login Page
 *
 * Internal state:
 * - role: 'client' | 'pilot' (defaults to 'client' per Req 4.2)
 *
 * Structure:
 * <AuthLayout>
 * Glass Auth Card:
 * - Secure Access badge
 * - Heading
 * - Subheading
 * - RoleTabSwitcher (segmented control)
 * - LoginForm (email, password, remember, submit)
 * - Register link
 * </AuthLayout>
 *
 * Requirements: 1.8, 2.1–2.11
 */
export default function LoginPage() {
 const [role, setRole] = useState('client');

 return (
 <AuthLayout>
 <div className="login-page-premium">
 {/* Glass Auth Card */}
 <div className="login-card">
 {/* Secure badge */}
 <div className="login-card__badge">
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
 </svg>
 <span>Secure Access</span>
 </div>

 {/* Heading */}
 <h2 className="login-card__heading">
 Masuk ke Akun SIAGA
 </h2>

 {/* Subheading */}
 <p className="login-card__subheading">
 Akses dashboard inspeksi aerial Anda dengan aman dan cepat.
 </p>

 {/* Role Toggle */}
 <RoleTabSwitcher role={role} onChange={setRole} />

 {/* Login Form */}
 <LoginForm role={role} />

 {/* Register link */}
 <p className="login-card__register-link">
 Belum punya akun? <Link to="/register">Daftar</Link>
 </p>
 </div>
 </div>
 </AuthLayout>
 );
}
