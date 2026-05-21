/**
 * PilotMissionHeader — Premium opening banner for Pilot Dashboard.
 * Feature: pilot-dashboard
 * Validates: Requirements 5
 */

import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Radio, Zap, Clock, Search } from 'lucide-react';
import './PilotMissionHeader.css';

function PilotMissionHeader({ pilotProfile, activeMissionCount, pendingBidCount, nextDeadline }) {
 const navigate = useNavigate();

 return (
 <section className="pilot-mission-header" aria-label="Mission Header">
 <div className="pilot-mission-header__bg-accent" aria-hidden="true" />
 <div className="pilot-mission-header__content">
 <div className="pilot-mission-header__text">
 <h2 className="pilot-mission-header__greeting">
 Selamat bertugas, {pilotProfile.nama}
 </h2>
 <p className="pilot-mission-header__summary">
 {activeMissionCount > 0
 ? `${activeMissionCount} misi inspeksi aktif menunggu update hari ini.`
 : 'Belum ada misi aktif. Cari proyek baru di Job Radar!'}
 </p>
 </div>

 <div className="pilot-mission-header__badges">
 {pilotProfile.is_verified && (
 <span className="pilot-mission-header__badge">
 <ShieldCheck size={14} aria-hidden="true" />
 SIDOPI Verified
 </span>
 )}
 <span className="pilot-mission-header__badge">
 <Radio size={14} aria-hidden="true" />
 {pilotProfile.drone_type}
 </span>
 <span className="pilot-mission-header__badge">
 <Zap size={14} aria-hidden="true" />
 {pilotProfile.response_rate} Response Rate
 </span>
 {nextDeadline && (
 <span className="pilot-mission-header__badge pilot-mission-header__badge--deadline">
 <Clock size={14} aria-hidden="true" />
 Next Deadline: {nextDeadline}
 </span>
 )}
 </div>

 <button
 className="pilot-mission-header__cta"
 onClick={() => navigate('/dashboard/pilot/job-radar')}
 type="button"
 >
 <Search size={16} aria-hidden="true" />
 Cari Proyek Baru
 </button>
 </div>
 </section>
 );
}

export default PilotMissionHeader;
