import './MapLegend.css';

const LEGEND_ITEMS = [
 { status: 'aman', label: 'Aman', colorVar: '--color-success' },
 { status: 'perlu_perhatian', label: 'Perlu Perhatian', colorVar: '--color-warning' },
 { status: 'kritis', label: 'Kritis', colorVar: '--color-danger' },
];

function MapLegend() {
 return (
 <div className="map-legend" aria-label="Legenda status aset">
 {LEGEND_ITEMS.map((item) => (
 <div key={item.status} className="map-legend__item">
 <span
 className={`map-legend__dot map-legend__dot--${item.status}`}
 aria-hidden="true"
 />
 <span className="map-legend__label">{item.label}</span>
 </div>
 ))}
 </div>
 );
}

export default MapLegend;
