import './InspectionAreaMap.css';

export function MapLoadingFallback() {
 return (
 <div className="pd-map-loading" aria-label="Memuat peta area inspeksi">
 <div className="pd-map-loading__grid" aria-hidden="true" />
 <div className="pd-map-loading__content">
 <div className="pd-map-loading__spinner" />
 <p className="pd-map-loading__text">Memuat peta area inspeksi…</p>
 </div>
 </div>
 );
}
