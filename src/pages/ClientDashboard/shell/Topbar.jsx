import { Bell, User, Menu } from 'lucide-react';
import { formatIndonesianDate } from '../utils/formatDate.js';
import './Topbar.css';

function Topbar({ companyName, todayDate, unreadCount, onSidebarToggle, showHamburger }) {
 const formattedDate = todayDate || formatIndonesianDate(new Date());

 return (
 <div className="topbar">
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


 <div className="topbar__greeting">
 <h1 className="topbar__greeting-title">Halo, {companyName}</h1>
 <span className="topbar__greeting-date">{formattedDate}</span>
 </div>

 <div className="topbar__spacer" />

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
