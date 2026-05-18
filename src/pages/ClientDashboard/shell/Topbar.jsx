/**
 * Topbar — header horizontal di atas Main_Content_Area.
 *
 * Berisi greeting personal, tanggal Indonesia, ikon notifikasi (badge),
 * dan ikon profil.
 *
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.4a, 3.5, 12.4, 13.7
 * Spec: .kiro/specs/client-dashboard
 */

import { Bell, User, Menu } from 'lucide-react';
import { formatIndonesianDate } from '../utils/formatDate.js';
import './Topbar.css';

function Topbar({ companyName, todayDate, unreadCount, onSidebarToggle, showHamburger }) {
  const formattedDate = todayDate || formatIndonesianDate(new Date());

  return (
    <div className="topbar">
      {/* Hamburger — hanya tampil pada <768px (Req 12.4) */}
      {showHamburger && (
        <button
          className="topbar__hamburger"
          onClick={onSidebarToggle}
          aria-label="Buka navigasi"
          type="button"
        >
          <Menu size={22} aria-hidden="true" />
        </button>
      )}

      {/* Greeting block (Req 3.2, 3.3) */}
      <div className="topbar__greeting">
        <h1 className="topbar__greeting-title">Halo, {companyName}</h1>
        <span className="topbar__greeting-date">{formattedDate}</span>
      </div>

      {/* Spacer */}
      <div className="topbar__spacer" />

      {/* Notification Bell (Req 3.4, 3.4a) */}
      <button
        className="topbar__notification"
        type="button"
        aria-label={`Notifikasi (${unreadCount} belum dibaca)`}
      >
        <Bell size={20} aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="topbar__notification-badge">{unreadCount}</span>
        )}
      </button>

      {/* Profile Button (Req 3.5) */}
      <button
        className="topbar__profile"
        type="button"
        aria-label="Menu profil"
      >
        <User size={20} aria-hidden="true" />
      </button>
    </div>
  );
}

export default Topbar;
