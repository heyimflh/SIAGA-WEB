/**
 * MapFloatingStats — Strip transparan di atas peta menampilkan jumlah aset.
 *
 * Spec: .kiro/specs/client-dashboard
 * Requirements: 5.12, 10.4, 10.5, 10.6
 *
 * Menampilkan: "[N] Aset Termonitor | [M] Kritis | [K] Perlu Perhatian"
 * dengan N, M, K diambil dari selectors (konsistensi cross-section by construction).
 *
 * Props:
 *   mockData: object — full mock data module (passed through for selectors)
 */

import { selectAssetCount, selectKritisCount, selectPerluPerhatianCount } from '../../utils/selectors.js';
import './MapFloatingStats.css';

function MapFloatingStats({ mockData }) {
  const totalAssets = selectAssetCount(mockData);
  const kritisCount = selectKritisCount(mockData);
  const perluPerhatianCount = selectPerluPerhatianCount(mockData);

  return (
    <div className="map-floating-stats" aria-label="Statistik aset termonitor">
      <span className="map-floating-stats__item">
        <strong>{totalAssets}</strong> Aset Termonitor
      </span>
      <span className="map-floating-stats__separator" aria-hidden="true">|</span>
      <span className="map-floating-stats__item map-floating-stats__item--kritis">
        <strong>{kritisCount}</strong> Kritis
      </span>
      <span className="map-floating-stats__separator" aria-hidden="true">|</span>
      <span className="map-floating-stats__item map-floating-stats__item--perlu-perhatian">
        <strong>{perluPerhatianCount}</strong> Perlu Perhatian
      </span>
    </div>
  );
}

export default MapFloatingStats;
