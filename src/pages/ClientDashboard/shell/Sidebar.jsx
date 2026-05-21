/**
 * Sidebar — navigasi vertikal kiri dengan tiga variant (full / icon / drawer).
 *
 * Props:
 * companyName — nama perusahaan (resolved dari session.email + mockData)
 * variant — 'full' | 'icon' | 'drawer'
 * drawerOpen — boolean (hanya relevan untuk variant drawer)
 * onDrawerClose — callback tutup drawer
 * onLogout — async callback logout
 *
 * Main navigation component supporting full, icon-only, and drawer display modes.
 * Spec: .kiro/specs/client-dashboard
 */

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
 LayoutDashboard,
 FolderKanban,
 Map,
 Gavel,
 FileText,
 Settings,
 LogOut,
 Plus,
} from 'lucide-react';
import { useAuth } from '../../../auth/AuthContext';
import './Sidebar.css';

/**
 * Konstanta menu sidebar sesuai design.
 */
const SIDEBAR_MENU = [
 { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard/client', exact: true },
 { id: 'proyek', label: 'Proyek', icon: FolderKanban, to: '/dashboard/client/projects' },
 { id: 'asset-map', label: 'Asset Map', icon: Map, to: '/dashboard/client/asset-map' },
 { id: 'bidding', label: 'Bidding', icon: Gavel, to: '/dashboard/client/bidding' },
 { id: 'laporan', label: 'Laporan', icon: FileText, to: '/dashboard/client/report-generator' },
 { id: 'pengaturan', label: 'Pengaturan', icon: Settings, to: '/dashboard/client/settings' },
];

/**
 * Mengambil inisial dari nama perusahaan (maks 2 karakter).
 */
function getInitials(name) {
 if (!name) return '?';
 const parts = name.trim().split(/\s+/);
 if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
 return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function Sidebar({ companyName, variant = 'full', drawerOpen, onDrawerClose, onLogout }) {
 const { logout } = useAuth();
 const navigate = useNavigate();
 const location = useLocation();
 const [logoutError, setLogoutError] = useState('');

 const isIconOnly = variant === 'icon';
 const isDrawer = variant === 'drawer';

 // Determine which menu item is active based on current path
 function isItemActive(item) {
 if (item.exact) {
 return location.pathname === item.to;
 }
 return location.pathname.startsWith(item.to);
 }

 async function handleLogout() {
 setLogoutError('');
 try {
 logout();
 // Verify clearance before navigating
 if (window.sessionStorage.getItem('siaga_auth') !== null) {
 throw new Error('Logout failed: session still present');
 }
 // Use replace: true so dashboard is removed from history stack.
 // This ensures back button won't re-render sensitive data even momentarily.
 navigate('/login', { replace: true });
 } catch {
 setLogoutError('Logout gagal, silakan coba lagi');
 }
 }

 // Build class for the sidebar container
 const sidebarClass = [
 'sidebar',
 `sidebar--${variant}`,
 isDrawer && drawerOpen ? 'sidebar--open' : '',
 ].filter(Boolean).join(' ');

 return (
 <div className={sidebarClass}>
 {/* Logo SIAGA kecil */}
 <div className="sidebar__logo">
 <img
 src="/images/logo/siaga-icon.png"
 alt="SIAGA"
 className="sidebar__logo-img"
 />
 {!isIconOnly && <span className="sidebar__logo-text">SIAGA</span>}
 </div>

 {/* Identity block */}
 {!isIconOnly && (
 <div className="sidebar__identity">
 <div className="sidebar__avatar" aria-hidden="true">
 {getInitials(companyName)}
 </div>
 <div className="sidebar__identity-info">
 <span className="sidebar__company-name">{companyName}</span>
 <span className="sidebar__badge">Client</span>
 </div>
 </div>
 )}

 {/* Tombol "Buat Proyek Baru" */}
 <Link
 to="/dashboard/client/create-project"
 className="sidebar__create-btn"
 title={isIconOnly ? 'Buat Proyek Baru' : undefined}
 >
 <Plus size={18} aria-hidden="true" />
 {!isIconOnly && <span>Buat Proyek Baru</span>}
 </Link>

 {/* Navigasi utama */}
 <nav aria-label="Navigasi utama" className="sidebar__nav">
 <ul className="sidebar__menu" role="list">
 {SIDEBAR_MENU.map((item) => {
 const IconComponent = item.icon;
 const active = isItemActive(item);

 return (
 <li key={item.id} className="sidebar__menu-item">
 <Link
 to={item.to}
 className={`sidebar__menu-link ${active ? 'sidebar__menu-link--active' : ''}`}
 aria-current={active ? 'page' : undefined}
 title={isIconOnly ? item.label : undefined}
 >
 <IconComponent size={20} aria-hidden="true" />
 {!isIconOnly && <span className="sidebar__menu-label">{item.label}</span>}
 </Link>
 </li>
 );
 })}
 </ul>
 </nav>

 {/* Spacer */}
 <div className="sidebar__spacer" />

 {/* Footer — Logout */}
 <div className="sidebar__footer">
 {logoutError && (
 <p className="sidebar__logout-error" role="alert">
 {logoutError}
 </p>
 )}
 <button
 type="button"
 className="sidebar__logout-btn"
 onClick={handleLogout}
 title={isIconOnly ? 'Logout' : undefined}
 >
 <LogOut size={20} aria-hidden="true" />
 {!isIconOnly && <span>Logout</span>}
 </button>
 </div>

 {/* Close button for drawer variant (mobile) */}
 {isDrawer && drawerOpen && (
 <button
 type="button"
 className="sidebar__close-btn"
 onClick={onDrawerClose}
 aria-label="Tutup navigasi"
 >
 ×
 </button>
 )}
 </div>
 );
}

export default Sidebar;
