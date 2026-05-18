import CountUp from 'react-countup';
import './FloatingStatsBar.css';

/**
 * FloatingStatsBar — Glassmorphism strip floating above the map showing project stats.
 * Displays: [N] Proyek Aktif, [M] Bidding Terbuka, [K] Urgent with count-up animation.
 *
 * Props:
 *   stats: { aktif: number, open: number, urgent: number }
 *   animate: boolean (trigger count-up on first render)
 *
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8
 */
export default function FloatingStatsBar({ stats = { aktif: 0, open: 0, urgent: 0 }, animate = true }) {
  return (
    <div className="floating-stats-bar" aria-label="Statistik proyek">
      <div className="floating-stats-bar__content">
        {/* Proyek Aktif */}
        <div className="floating-stats-bar__item">
          <span className="floating-stats-bar__number floating-stats-bar__number--aktif">
            {animate ? (
              <CountUp end={stats.aktif} duration={1.2} preserveValue={true} useEasing={true} />
            ) : (
              stats.aktif
            )}
          </span>
          <span className="floating-stats-bar__label">Proyek Aktif</span>
        </div>

        {/* Separator */}
        <span className="floating-stats-bar__separator" aria-hidden="true" />

        {/* Bidding Terbuka */}
        <div className="floating-stats-bar__item">
          <span className="floating-stats-bar__number floating-stats-bar__number--open">
            {animate ? (
              <CountUp end={stats.open} duration={1.2} preserveValue={true} useEasing={true} />
            ) : (
              stats.open
            )}
          </span>
          <span className="floating-stats-bar__label">Bidding Terbuka</span>
        </div>

        {/* Separator */}
        <span className="floating-stats-bar__separator" aria-hidden="true" />

        {/* Urgent */}
        <div className="floating-stats-bar__item">
          <span className="floating-stats-bar__number floating-stats-bar__number--urgent">
            {animate ? (
              <CountUp end={stats.urgent} duration={1.2} preserveValue={true} useEasing={true} />
            ) : (
              stats.urgent
            )}
          </span>
          <span className="floating-stats-bar__label">Urgent</span>
        </div>
      </div>
    </div>
  );
}
