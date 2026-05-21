/**
 * Topbar — header horizontal di atas Main_Content_Area.
 *
 * Berisi greeting personal, tanggal Indonesia, ikon notifikasi (badge),
 * dan ikon profil.
 *
 * Dashboard top bar featuring personalized greetings, current date, and notifications.
 * Spec: .kiro/specs/client-dashboard
 */

import { Bell, User, Menu } from 'lucide-react';
import { formatIndonesianDate } from '../utils/formatDate.js';
import './Topbar.css';

function Topbar({ companyName, todayDate, unreadCount, onSidebarToggle, showHamburger }) {
 const formattedDate = todayDate || formatIndonesianDate(new Date());

 return (
 <div className="topbar">
 {/* Hamburger — only visible on mobile screens */}
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

 {/* Greeting block */}
 <div className="topbar__greeting">
 <h1 className="topbar__greeting-title">Halo, {companyName}</h1>
 <span className="topbar__greeting-date">{formattedDate}</span>
 </div>

 {/* Spacer */}
 <div className="topbar__spacer" />

 {/* Notification Bell */}
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

 {/* Profile Button */}
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
