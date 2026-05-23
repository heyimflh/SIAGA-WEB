import { Loader } from 'lucide-react';

export default function MapLoadingFallback() {
 return (
 <div className="map-loading-fallback">
 <div className="map-loading-fallback__grid" />
 <div className="map-loading-fallback__content">
 <Loader size={32} className="map-loading-fallback__spinner" />
 <p className="map-loading-fallback__text">Memuat peta…</p>
 </div>

 <style>{`
 .map-loading-fallback {
 position: absolute;
 inset: 0;
 background: #020B16;
 display: flex;
 align-items: center;
 justify-content: center;
 z-index: 5;
 }
 .map-loading-fallback__grid {
 position: absolute;
 inset: 0;
 background-image:
 linear-gradient(rgba(0, 210, 255, 0.04) 1px, transparent 1px),
 linear-gradient(90deg, rgba(0, 210, 255, 0.04) 1px, transparent 1px);
 background-size: 60px 60px;
 opacity: 0.6;
 }
 .map-loading-fallback__content {
 position: relative;
 display: flex;
 flex-direction: column;
 align-items: center;
 gap: 16px;
 }
 .map-loading-fallback__spinner {
 color: #00D2FF;
 animation: mapSpin 1.5s linear infinite;
 }
 @keyframes mapSpin {
 from { transform: rotate(0deg); }
 to { transform: rotate(360deg); }
 }
 .map-loading-fallback__text {
 font-size: 13px;
 font-weight: 500;
 color: rgba(220, 240, 255, 0.6);
 margin: 0;
 }
 `}</style>
 </div>
 );
}
