/**
 * StatusToggle — Segmented control for status filter.
 * Options: "Bidding Terbuka" (open) | "Semua" (all)
 */
export default function StatusToggle({ value, onChange }) {
 return (
 <div className="status-toggle" role="radiogroup" aria-label="Filter status proyek">
 <button
 className={`status-toggle__option ${value === 'open' ? 'status-toggle__option--active' : ''}`}
 onClick={() => onChange('open')}
 role="radio"
 aria-checked={value === 'open'}
 >
 Bidding Terbuka
 </button>
 <button
 className={`status-toggle__option ${value === 'all' ? 'status-toggle__option--active' : ''}`}
 onClick={() => onChange('all')}
 role="radio"
 aria-checked={value === 'all'}
 >
 Semua
 </button>
 </div>
 );
}
