import { Activity, Radio, AlertTriangle } from 'lucide-react';
import './RadarHUD.css';

/**
 * RadarHUD — Premium floating HUD overlay above the map.
 * Shows live stats computed from filtered projects.
 * 
 * Desktop: full HUD with title + subtitle + stats
 * Mobile: compact pill
 */
export default function RadarHUD({ stats, activeFilterCount, isCompact }) {
  if (isCompact) {
    return (
      <div className="radar-hud radar-hud--compact" aria-label="Radar HUD ringkasan">
        <span className="radar-hud__live-dot" />
        <span className="radar-hud__compact-text">
          LIVE RADAR • {stats.aktif} Proyek • {stats.urgent} Urgent
        </span>
      </div>
    );
  }

  return (
    <div className="radar-hud" aria-label="Radar HUD statistik proyek">
      <div className="radar-hud__header">
        <div className="radar-hud__title-group">
          <h2 className="radar-hud__title">SIAGA Job Radar</h2>
          <p className="radar-hud__subtitle">Live Project Discovery for Certified UAV Pilots</p>
        </div>
        <div className="radar-hud__live">
          <span className="radar-hud__live-dot" />
          <span className="radar-hud__live-text">LIVE</span>
        </div>
      </div>

      <div className="radar-hud__stats">
        <div className="radar-hud__stat">
          <Activity size={14} className="radar-hud__stat-icon" />
          <span className="radar-hud__stat-value">{stats.aktif}</span>
          <span className="radar-hud__stat-label">Proyek Aktif</span>
        </div>
        <div className="radar-hud__divider" />
        <div className="radar-hud__stat">
          <Radio size={14} className="radar-hud__stat-icon" />
          <span className="radar-hud__stat-value">{stats.open}</span>
          <span className="radar-hud__stat-label">Bidding Terbuka</span>
        </div>
        <div className="radar-hud__divider" />
        <div className="radar-hud__stat radar-hud__stat--urgent">
          <AlertTriangle size={14} className="radar-hud__stat-icon" />
          <span className="radar-hud__stat-value">{stats.urgent}</span>
          <span className="radar-hud__stat-label">Urgent</span>
        </div>
        {activeFilterCount > 0 && (
          <>
            <div className="radar-hud__divider" />
            <div className="radar-hud__filter-badge">
              {activeFilterCount} filter aktif
            </div>
          </>
        )}
      </div>
    </div>
  );
}
