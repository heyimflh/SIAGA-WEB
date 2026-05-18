/**
 * MapLegend — Indikator tiga warna status di pojok kiri atas peta.
 *
 * Spec: .kiro/specs/client-dashboard
 * Requirements: 5.8
 *
 * Menampilkan tiga indikator warna beserta labelnya:
 *   - Aman (hijau / --color-success)
 *   - Perlu Perhatian (kuning / --color-warning)
 *   - Kritis (merah / --color-danger)
 *
 * Ditempatkan secara absolute di pojok kiri atas container peta.
 */

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
