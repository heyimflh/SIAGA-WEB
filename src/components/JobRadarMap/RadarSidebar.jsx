import { useState } from 'react';

export default function RadarSidebar({ pins, activePin, onPinSelect, onReset }) {
 const [filter, setFilter] = useState('all');

 const filteredPins = filter === 'all'
 ? pins
 : filter === 'urgent'
 ? pins.filter(p => p.status === 'urgent')
 : pins.filter(p => p.status === 'active');

 const urgentCount = pins.filter(p => p.status === 'urgent').length;
 const activeCount = pins.filter(p => p.status === 'active').length;

 return (
 <div className="radar-sidebar">
 {/* Header */}
 <div className="radar-sidebar__header">
 <div className="radar-sidebar__title-group">
 <div className="radar-sidebar__icon-wrap">
 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="12" cy="12" r="10"/>
 <circle cx="12" cy="12" r="6"/>
 <circle cx="12" cy="12" r="2"/>
 </svg>
 <span className="radar-sidebar__icon-ping"></span>
 </div>
 <div>
 <h3 className="radar-sidebar__title">Job Radar</h3>
 <p className="radar-sidebar__meta">
 <span className="radar-sidebar__meta-dot"></span>
 {pins.length} proyek terdeteksi
 </p>
 </div>
 </div>
 <button className="radar-sidebar__reset" onClick={onReset} title="Reset view" aria-label="Reset map view">
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
 <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
 <path d="M3 3v5h5"/>
 </svg>
 </button>
 </div>

 {/* Filter tabs */}
 <div className="radar-sidebar__filters">
 <button
 className={`radar-filter ${filter === 'all' ? 'radar-filter--active' : ''}`}
 onClick={() => setFilter('all')}
 >
 <span className="radar-filter__label">Semua</span>
 <span className="radar-filter__badge">{pins.length}</span>
 </button>
 <button
 className={`radar-filter radar-filter--urgent-type ${filter === 'urgent' ? 'radar-filter--active' : ''}`}
 onClick={() => setFilter('urgent')}
 >
 <span className="radar-filter__label">Urgent</span>
 <span className="radar-filter__badge">{urgentCount}</span>
 </button>
 <button
 className={`radar-filter ${filter === 'active' ? 'radar-filter--active' : ''}`}
 onClick={() => setFilter('active')}
 >
 <span className="radar-filter__label">Aktif</span>
 <span className="radar-filter__badge">{activeCount}</span>
 </button>
 </div>

 {/* Pin list */}
 <div className="radar-sidebar__list" data-lenis-prevent>
 {filteredPins.map((pin) => (
 <button
 key={pin.id}
 className={`radar-card ${activePin?.id === pin.id ? 'radar-card--selected' : ''} radar-card--${pin.status}`}
 onClick={() => onPinSelect(pin)}
 >
 <div className="radar-card__left">
 <div className={`radar-card__indicator radar-card__indicator--${pin.status}`}>
 <span className="radar-card__indicator-dot"></span>
 </div>
 </div>
 <div className="radar-card__body">
 <div className="radar-card__top">
 <h4 className="radar-card__title">{pin.title}</h4>
 <span className={`radar-card__badge radar-card__badge--${pin.status}`}>
 {pin.status === 'urgent' ? 'URGENT' : 'ACTIVE'}
 </span>
 </div>
 <div className="radar-card__info">
 <span className="radar-card__location">
 <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
 <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
 <circle cx="12" cy="10" r="3"/>
 </svg>
 {pin.location}
 </span>
 <span className="radar-card__time">{pin.postedAgo}</span>
 </div>
 <div className="radar-card__bottom">
 <span className="radar-card__budget">{pin.budget}</span>
 <span className="radar-card__deadline">
 <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
 <circle cx="12" cy="12" r="10"/>
 <polyline points="12,6 12,12 16,14"/>
 </svg>
 {pin.deadline}
 </span>
 </div>
 </div>
 <div className="radar-card__arrow">
 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
 <path d="M9 18l6-6-6-6"/>
 </svg>
 </div>
 </button>
 ))}
 </div>

 {/* Footer */}
 <div className="radar-sidebar__footer">
 <button className="radar-sidebar__cta">
 <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
 <circle cx="11" cy="11" r="8"/>
 <path d="m21 21-4.3-4.3"/>
 </svg>
 Jelajahi Semua Proyek
 </button>
 </div>
 </div>
 );
}
