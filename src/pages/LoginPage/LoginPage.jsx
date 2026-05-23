import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout.jsx';
import RoleTabSwitcher from './RoleTabSwitcher.jsx';
import LoginForm from './LoginForm.jsx';
import './LoginPage.css';

export default function LoginPage() {
 const [role, setRole] = useState('client');

 return (
 <AuthLayout>
 <div className="login-page-premium">
 <div className="login-card">
 <div className="login-card__badge">
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
 </svg>
 <span>Secure Access</span>
 </div>


 <h2 className="login-card__heading">
 Masuk ke Akun SIAGA
 </h2>

 <p className="login-card__subheading">
 Akses dashboard inspeksi aerial Anda dengan aman dan cepat.
 </p>


 <RoleTabSwitcher role={role} onChange={setRole} />

 <LoginForm role={role} />

 <p className="login-card__register-link">
 Belum punya akun? <Link to="/register">Daftar</Link>
 </p>
 </div>
 </div>
 </AuthLayout>
 );
}
