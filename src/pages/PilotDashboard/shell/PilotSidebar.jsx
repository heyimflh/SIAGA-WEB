/**
 * PilotSidebar — Cockpit Navigation for Pilot Dashboard.
 *
 * Three variants: full (desktop), icon (tablet), drawer (mobile).
 * Feature: pilot-dashboard
 * Validates: Requirements 3
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
 LayoutDashboard,
 Radar,
 Send,
 FolderOpen,
 Upload,
 Wallet,
 Settings,
 LogOut,
 Search,
 ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../../auth/AuthContext';
import './PilotSidebar.css';

const PILOT_MENU = [
 { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard/pilot', active: true },
 { id: 'job-radar', label: 'Job Radar', icon: Radar, to: '/dashboard/pilot/job-radar', disabled: false },
 { id: 'bid-saya', label: 'Bid Saya', icon: Send, to: '#', disabled: true },
 { id: 'proyek-aktif', label: 'Proyek Aktif', icon: FolderOpen, to: '#', disabled: true },
 { id: 'workspace', label: 'Workspace', icon: Upload, to: '#', disabled: true },
 { id: 'earnings', label: 'Earnings', icon: Wallet, to: '#', disabled: true },
 { id: 'pengaturan', label: 'Pengaturan', icon: Settings, to: '#', disabled: true },
];

function PilotSidebar({ pilotName, avatarUrl, isVerified, variant = 'full', drawerOpen, onDrawerClose }) {
 const { logout } = useAuth();
 const navigate = useNavigate();
 const [logoutError, setLogoutError] = useState('');

 const isIconOnly = variant === 'icon';
 const isDrawer = variant === 'drawer';

 async function handleLogout() {
 setLogoutError('');
 try {
 logout();
 navigate('/login', { replace: true });
 } catch {
 setLogoutError('Logout gagal, silakan coba lagi');
 }
 }

 const sidebarClass = [
 'pilot-sidebar',
 `pilot-sidebar--${variant}`,
 isDrawer && drawerOpen ? 'pilot-sidebar--open' : '',
 ].filter(Boolean).join(' ');

 return (
 <div className={sidebarClass}>
 {/* Close button for drawer */}
 {isDrawer && drawerOpen && (
 <button
 type="button"
 className="pilot-sidebar__close-btn"
 onClick={onDrawerClose}
 aria-label="Tutup navigasi"
 >
 ×
 </button>
 )}

 {/* Logo */}
 <div className="pilot-sidebar__logo">
 <img src="/images/logo/siaga-icon.png" alt="SIAGA" className="pilot-sidebar__logo-img" />
 {!isIconOnly && <span className="pilot-sidebar__logo-text">SIAGA</span>}
 </div>

 {/* Pilot Identity Block */}
 {!isIconOnly && (
 <div className="pilot-sidebar__identity">
 <div className={`pilot-sidebar__avatar-wrap ${isVerified ? 'pilot-sidebar__avatar-wrap--verified' : ''}`}>
 <img src={avatarUrl} alt={pilotName} className="pilot-sidebar__avatar-img" />
 </div>
 <div className="pilot-sidebar__identity-info">
 <span className="pilot-sidebar__pilot-name">{pilotName}</span>
 {isVerified && (
 <span className="pilot-sidebar__verified-badge">
 <ShieldCheck size={12} aria-hidden="true" />
 SIDOPI Verified
 </span>
 )}
 <span className="pilot-sidebar__status-pill">Available for Mission</span>
 </div>
 </div>
 )}

 {/* CTA: Cari Proyek */}
 <Link
 to="/dashboard/pilot/job-radar"
 className="pilot-sidebar__cta-btn"
 title={isIconOnly ? 'Cari Proyek' : undefined}
 >
 <Search size={18} aria-hidden="true" />
 {!isIconOnly && <span>Cari Proyek</span>}
 </Link>

 {/* Navigation */}
 <nav aria-label="Navigasi pilot" className="pilot-sidebar__nav">
 <ul className="pilot-sidebar__menu" role="list">
 {PILOT_MENU.map((item) => {
 const IconComp = item.icon;
 if (item.active) {
 return (
 <li key={item.id} className="pilot-sidebar__menu-item">
 <Link
 to={item.to}
 className="pilot-sidebar__menu-link pilot-sidebar__menu-link--active"
 aria-current="page"
 title={isIconOnly ? item.label : undefined}
 >
 <IconComp size={20} aria-hidden="true" />
 {!isIconOnly && <span className="pilot-sidebar__menu-label">{item.label}</span>}
 </Link>
 </li>
 );
 }
 if (item.disabled) {
 return (
 <li key={item.id} className="pilot-sidebar__menu-item">
 <button
 type="button"
 className="pilot-sidebar__menu-link pilot-sidebar__menu-link--disabled"
 disabled
 title="Segera tersedia"
 aria-disabled="true"
 >
 <IconComp size={20} aria-hidden="true" />
 {!isIconOnly && <span className="pilot-sidebar__menu-label">{item.label}</span>}
 </button>
 </li>
 );
 }
 return (
 <li key={item.id} className="pilot-sidebar__menu-item">
 <Link
 to={item.to}
 className="pilot-sidebar__menu-link"
 title={isIconOnly ? item.label : undefined}
 >
 <IconComp size={20} aria-hidden="true" />
 {!isIconOnly && <span className="pilot-sidebar__menu-label">{item.label}</span>}
 </Link>
 </li>
 );
 })}
 </ul>
 </nav>

 {/* Spacer */}
 <div className="pilot-sidebar__spacer" />

 {/* Footer — Logout */}
 <div className="pilot-sidebar__footer">
 {logoutError && (
 <p className="pilot-sidebar__logout-error" role="alert">{logoutError}</p>
 )}
 <button
 type="button"
 className="pilot-sidebar__logout-btn"
 onClick={handleLogout}
 title={isIconOnly ? 'Logout' : undefined}
 >
 <LogOut size={20} aria-hidden="true" />
 {!isIconOnly && <span>Logout</span>}
 </button>
 </div>
 </div>
 );
}

export default PilotSidebar;
