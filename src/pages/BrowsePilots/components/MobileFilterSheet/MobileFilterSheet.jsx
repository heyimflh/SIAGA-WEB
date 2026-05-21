import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { SPECIALIZATION_OPTIONS, RATING_OPTIONS, PROVINCE_OPTIONS } from '../../mock-data.js';
import './MobileFilterSheet.css';

export default function MobileFilterSheet({ isOpen, filters, onChange, onApply, onReset, onClose }) {
 const sheetRef = useRef(null);

 useEffect(() => {
 if (isOpen) {
 document.body.style.overflow = 'hidden';
 sheetRef.current?.focus();
 } else {
 document.body.style.overflow = '';
 }
 return () => { document.body.style.overflow = ''; };
 }, [isOpen]);

 useEffect(() => {
 const handleKey = (e) => {
 if (e.key === 'Escape' && isOpen) onClose();
 };
 document.addEventListener('keydown', handleKey);
 return () => document.removeEventListener('keydown', handleKey);
 }, [isOpen, onClose]);

 if (!isOpen) return null;

 const toggleSpec = (spec) => {
 const current = filters.specializations || [];
 const next = current.includes(spec)
 ? current.filter((s) => s !== spec)
 : [...current, spec];
 onChange({ ...filters, specializations: next });
 };

 return (
 <div className="mobile-filter-overlay" onClick={onClose}>
 <div
 ref={sheetRef}
 className="mobile-filter-sheet"
 role="dialog"
 aria-modal="true"
 aria-label="Filter pilot"
 tabIndex={-1}
 onClick={(e) => e.stopPropagation()}
 >
 <div className="mobile-filter-sheet__header">
 <h3>Filter Pilot</h3>
 <button className="mobile-filter-sheet__close" onClick={onClose} aria-label="Tutup filter">
 <X size={20} />
 </button>
 </div>

 <div className="mobile-filter-sheet__body">
 <div className="mobile-filter-sheet__section">
 <h4>Spesialisasi</h4>
 <div className="mobile-filter-sheet__chips">
 {SPECIALIZATION_OPTIONS.map((spec) => (
 <button
 key={spec}
 className={`pilots-filter-chip ${filters.specializations.includes(spec) ? 'pilots-filter-chip--active' : ''}`}
 onClick={() => toggleSpec(spec)}
 >
 {spec}
 </button>
 ))}
 </div>
 </div>

 <div className="mobile-filter-sheet__section">
 <h4>Provinsi</h4>
 <select
 className="mobile-filter-sheet__select"
 value={filters.province || ''}
 onChange={(e) => onChange({ ...filters, province: e.target.value || null })}
 >
 <option value="">Semua Provinsi</option>
 {PROVINCE_OPTIONS.map((p) => (
 <option key={p} value={p}>{p}</option>
 ))}
 </select>
 </div>

 <div className="mobile-filter-sheet__section">
 <h4>Rating Minimum</h4>
 <div className="mobile-filter-sheet__chips">
 {RATING_OPTIONS.map((opt) => (
 <button
 key={opt.value}
 className={`pilots-filter-chip ${filters.minRating === opt.value ? 'pilots-filter-chip--active' : ''}`}
 onClick={() => onChange({ ...filters, minRating: filters.minRating === opt.value ? null : opt.value })}
 >
 {opt.label}
 </button>
 ))}
 </div>
 </div>

 <div className="mobile-filter-sheet__section">
 <h4>SIAGA Verified</h4>
 <button
 className={`pilots-filter-chip ${filters.verifiedOnly ? 'pilots-filter-chip--active' : ''}`}
 onClick={() => onChange({ ...filters, verifiedOnly: !filters.verifiedOnly })}
 >
 Verified Only
 </button>
 </div>
 </div>

 <div className="mobile-filter-sheet__footer">
 <button className="mobile-filter-sheet__reset" onClick={onReset}>Reset</button>
 <button className="mobile-filter-sheet__apply" onClick={onApply}>Terapkan Filter</button>
 </div>
 </div>
 </div>
 );
}
