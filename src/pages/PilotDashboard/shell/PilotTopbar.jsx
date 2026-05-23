import { Bell, User, Menu } from 'lucide-react';
import { formatIndonesianDate } from '../utils/formatDate.js';
import './PilotTopbar.css';

function PilotTopbar({ pilotName, unreadCount, activeMissionCount, onHamburgerClick, showHamburger }) {
 const formattedDate = formatIndonesianDate(new Date());

 return (
 <div className="pilot-topbar">
 {showHamburger && (
 <button
 className="pilot-topbar__hamburger"
 onClick={onHamburgerClick}
 aria-label="Buka navigasi"
 type="button"
 >
 <Menu size={22} aria-hidden="true" />
 </button>
 )}

 <div className="pilot-topbar__greeting">
 <h1 className="pilot-topbar__greeting-title">Halo, {pilotName}</h1>
 <span className="pilot-topbar__greeting-date">{formattedDate}</span>
 </div>

 {activeMissionCount > 0 && (
 <span className="pilot-topbar__status-pill">
 {activeMissionCount} misi aktif
 </span>
 )}

 <div className="pilot-topbar__spacer" />

 <button
 className="pilot-topbar__notification"
 type="button"
 aria-label={`Notifikasi (${unreadCount} belum dibaca)`}
 >
 <Bell size={20} aria-hidden="true" />
 {unreadCount > 0 && (
 <span className="pilot-topbar__notification-badge">{unreadCount}</span>
 )}
 </button>

 <button
 className="pilot-topbar__profile"
 type="button"
 aria-label="Menu profil"
 >
 <User size={20} aria-hidden="true" />
 </button>
 </div>
 );
}

export default PilotTopbar;
