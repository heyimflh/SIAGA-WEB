/**
 * Sidebar — navigasi vertikal kiri dengan tiga variant (full / icon / drawer).
 *
 * Props:
 *   companyName  — nama perusahaan (resolved dari session.email + mockData)
 *   variant      — 'full' | 'icon' | 'drawer'
 *   drawerOpen   — boolean (hanya relevan untuk variant drawer)
 *   onDrawerClose — callback tutup drawer
 *   onLogout     — async callback logout
 *
 * Requirements: 2.1-2.13, 13.1, 13.4-13.6a, 16.1-16.3a
 * Spec: .kiro/specs/client-dashboard
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
 * Item selain Dashboard di-render sebagai <button disabled> dengan tooltip.
 */
const SIDEBAR_MENU = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard/client', active: true },
  { id: 'proyek', label: 'Proyek', icon: FolderKanban, to: '#', disabled: true },
  { id: 'asset-map', label: 'Asset Map', icon: Map, to: '#', disabled: true },
  { id: 'bidding', label: 'Bidding', icon: Gavel, to: '#', disabled: true },
  { id: 'laporan', label: 'Laporan', icon: FileText, to: '#', disabled: true },
  { id: 'pengaturan', label: 'Pengaturan', icon: Settings, to: '#', disabled: true },
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
  const [logoutError, setLogoutError] = useState('');

  const isIconOnly = variant === 'icon';
  const isDrawer = variant === 'drawer';

  async function handleLogout() {
    setLogoutError('');
    try {
      logout();
      // Verify clearance before navigating (Req 16.1a)
      if (window.sessionStorage.getItem('siaga_auth') !== null) {
        throw new Error('Logout failed: session still present');
      }
      // Use replace: true so dashboard is removed from history stack (Req 16.4, 16.5)
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
      {/* Logo SIAGA kecil (Req 2.3) */}
      <div className="sidebar__logo">
        <img
          src="/images/logo/siaga-icon.png"
          alt="SIAGA"
          className="sidebar__logo-img"
        />
        {!isIconOnly && <span className="sidebar__logo-text">SIAGA</span>}
      </div>

      {/* Identity block (Req 2.4) */}
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

      {/* Tombol "Buat Proyek Baru" (Req 2.9, 2.10) */}
      <Link
        to="/dashboard/client/create-project"
        className="sidebar__create-btn"
        title={isIconOnly ? 'Buat Proyek Baru' : undefined}
      >
        <Plus size={18} aria-hidden="true" />
        {!isIconOnly && <span>Buat Proyek Baru</span>}
      </Link>

      {/* Navigasi utama (Req 2.5, 2.6, 13.1) */}
      <nav aria-label="Navigasi utama" className="sidebar__nav">
        <ul className="sidebar__menu" role="list">
          {SIDEBAR_MENU.map((item) => {
            const IconComponent = item.icon;

            if (item.active) {
              // Dashboard — active item (Req 2.7, 2.8, 13.5)
              return (
                <li key={item.id} className="sidebar__menu-item">
                  <Link
                    to={item.to}
                    className="sidebar__menu-link sidebar__menu-link--active"
                    aria-current="page"
                    title={isIconOnly ? item.label : undefined}
                  >
                    <IconComponent size={20} aria-hidden="true" />
                    {!isIconOnly && <span className="sidebar__menu-label">{item.label}</span>}
                  </Link>
                </li>
              );
            }

            // Disabled items (Req 2.5 — "Segera tersedia" tooltip)
            return (
              <li key={item.id} className="sidebar__menu-item">
                <button
                  type="button"
                  className="sidebar__menu-link sidebar__menu-link--disabled"
                  disabled
                  title="Segera tersedia"
                  aria-disabled="true"
                >
                  <IconComponent size={20} aria-hidden="true" />
                  {!isIconOnly && <span className="sidebar__menu-label">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Spacer */}
      <div className="sidebar__spacer" />

      {/* Footer — Logout (Req 2.11, 2.12, 16.1-16.3a) */}
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
