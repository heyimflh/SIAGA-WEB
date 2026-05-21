/**
 * MapFilter — Grup tombol toggle untuk filter status aset pada peta.
 *
 * Spec: .kiro/specs/client-dashboard
 * Requirements: 5.9, 5.10, 5.10a, 5.11
 *
 * Opsi:
 * - "Semua" (value: 'all') — selalu enabled
 * - "Kritis Saja" (value: 'kritis') — disabled jika tidak ada aset kritis
 * - "Perlu Perhatian Saja" (value: 'perlu_perhatian') — disabled jika tidak ada aset perlu_perhatian
 *
 * Filter state dikelola per-session (in-memory only, tidak ke localStorage).
 * State persist saat user scroll keluar dan kembali karena dikelola oleh
 * parent component (ClientDashboardPage) yang tetap mounted.
 *
 * Props:
 * activeFilter: 'all' | 'kritis' | 'perlu_perhatian'
 * disabledOptions: Array<'aman' | 'perlu_perhatian' | 'kritis'>
 * onFilterChange: (filterValue: string) => void
 */

import './MapFilter.css';

const FILTER_OPTIONS = [
 { value: 'all', label: 'Semua' },
 { value: 'kritis', label: 'Kritis Saja' },
 { value: 'perlu_perhatian', label: 'Perlu Perhatian Saja' },
];

function MapFilter({ activeFilter, disabledOptions = [], onFilterChange }) {
 return (
 <div className="map-filter" role="group" aria-label="Filter status aset">
 {FILTER_OPTIONS.map((option) => {
 const isDisabled = disabledOptions.includes(option.value);
 const isActive = activeFilter === option.value;

 return (
 <button
 key={option.value}
 type="button"
 className={`map-filter__btn${isActive ? ' map-filter__btn--active' : ''}`}
 disabled={isDisabled}
 aria-pressed={isActive}
 onClick={() => onFilterChange(option.value)}
 >
 {option.label}
 </button>
 );
 })}
 </div>
 );
}

export default MapFilter;
