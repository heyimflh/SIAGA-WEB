import { AlertTriangle } from 'lucide-react';
import './InspectionAreaMap.css';

export function MapErrorFallback({ inspectionPoints }) {
 return (
 <div className="pd-map-error" role="alert">
 <AlertTriangle size={32} className="pd-map-error__icon" />
 <h3 className="pd-map-error__title">Peta tidak tersedia</h3>
 <p className="pd-map-error__desc">Gagal memuat peta. Berikut koordinat titik inspeksi:</p>
 {inspectionPoints && inspectionPoints.length > 0 && (
 <ul className="pd-map-error__coords">
 {inspectionPoints.slice(0, 8).map((pt, i) => (
 <li key={i}>{pt.label}: {pt.lat.toFixed(4)}, {pt.lng.toFixed(4)}</li>
 ))}
 </ul>
 )}
 </div>
 );
}
