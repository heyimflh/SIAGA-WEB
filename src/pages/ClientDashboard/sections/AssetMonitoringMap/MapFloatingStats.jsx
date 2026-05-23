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
