import { MapPinOff, RefreshCw } from 'lucide-react';

/**
 * MapErrorFallback — Shown when Mapbox fails to load.
 * Displays friendly message + optional retry.
 */
export default function MapErrorFallback({ onRetry }) {
  return (
    <div className="map-error-fallback">
      <div className="map-error-fallback__grid" />
      <div className="map-error-fallback__content">
        <MapPinOff size={40} className="map-error-fallback__icon" />
        <h3 className="map-error-fallback__title">Peta tidak tersedia saat ini</h3>
        <p className="map-error-fallback__text">
          Terjadi kesalahan saat memuat peta. Pastikan koneksi internet stabil.
        </p>
        {onRetry && (
          <button className="map-error-fallback__retry" onClick={onRetry}>
            <RefreshCw size={14} />
            Coba Lagi
          </button>
        )}
      </div>

      <style>{`
        .map-error-fallback {
          position: absolute;
          inset: 0;
          background: #020B16;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
        }
        .map-error-fallback__grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0, 210, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 210, 255, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          opacity: 0.5;
        }
        .map-error-fallback__content {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
          padding: 24px;
        }
        .map-error-fallback__icon {
          color: rgba(0, 210, 255, 0.4);
        }
        .map-error-fallback__title {
          font-family: 'Montserrat', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: rgba(245, 252, 255, 0.9);
          margin: 0;
        }
        .map-error-fallback__text {
          font-size: 13px;
          color: rgba(220, 240, 255, 0.55);
          margin: 0;
          max-width: 300px;
        }
        .map-error-fallback__retry {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          padding: 10px 20px;
          font-size: 13px;
          font-weight: 600;
          color: #00D2FF;
          background: rgba(0, 210, 255, 0.1);
          border: 1px solid rgba(0, 210, 255, 0.25);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .map-error-fallback__retry:hover {
          background: rgba(0, 210, 255, 0.18);
          border-color: rgba(0, 210, 255, 0.4);
        }
      `}</style>
    </div>
  );
}
