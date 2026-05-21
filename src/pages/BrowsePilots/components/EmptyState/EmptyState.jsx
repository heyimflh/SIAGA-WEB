import { SearchX } from 'lucide-react';
import './EmptyState.css';

const SUGGESTED_CHIPS = ['Infrastruktur', 'Pemetaan', 'Jawa Barat', 'Verified', 'Rating 4+'];

export default function EmptyState({ query, onReset }) {
 return (
 <div className="pilots-empty">
 <SearchX size={48} className="pilots-empty__icon" />
 <h3 className="pilots-empty__title">
 {query
 ? `Tidak ada pilot yang cocok dengan pencarian "${query}".`
 : 'Tidak ada pilot yang cocok dengan kriteria filter Anda.'}
 </h3>
 <p className="pilots-empty__helper">
 Coba perluas filter atau gunakan kata kunci yang berbeda.
 </p>
 <button className="pilots-empty__reset" onClick={onReset}>
 Reset Filter
 </button>
 <div className="pilots-empty__suggestions">
 {SUGGESTED_CHIPS.map((chip) => (
 <span key={chip} className="pilots-empty__chip">{chip}</span>
 ))}
 </div>
 </div>
 );
}
