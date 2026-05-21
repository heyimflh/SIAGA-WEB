import { useState, useEffect } from 'react';

const typeConfig = {
 new: { color: '#0062D6', label: 'Baru' },
 urgent: { color: '#F59E0B', label: 'Urgent' },
 accepted: { color: '#10B981', label: 'Diterima' },
 completed: { color: '#8B5CF6', label: 'Selesai' },
};

export default function LiveAlertCard({ alerts }) {
 const [visibleIndex, setVisibleIndex] = useState(0);

 useEffect(() => {
 const interval = setInterval(() => {
 setVisibleIndex((prev) => (prev + 1) % alerts.length);
 }, 4000);
 return () => clearInterval(interval);
 }, [alerts.length]);

 const currentAlert = alerts[visibleIndex];
 const config = typeConfig[currentAlert.type] || typeConfig.new;

 return (
 <div className="live-alert-card">
 <div className="live-alert-card__header">
 <div className="live-alert-card__header-left">
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
 <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
 </svg>
 <span>Live Activity</span>
 </div>
 <div className="live-alert-card__counter">
 {visibleIndex + 1}/{alerts.length}
 </div>
 </div>
 <div className="live-alert-card__body" key={currentAlert.id}>
 <div className="live-alert-card__type-badge" style={{ '--alert-color': config.color }}>
 <span className="live-alert-card__type-dot"></span>
 {config.label}
 </div>
 <p className="live-alert-card__message">{currentAlert.message}</p>
 <span className="live-alert-card__time">{currentAlert.time}</span>
 </div>
 <div className="live-alert-card__progress">
 <div className="live-alert-card__progress-bar" key={visibleIndex}></div>
 </div>
 </div>
 );
}
