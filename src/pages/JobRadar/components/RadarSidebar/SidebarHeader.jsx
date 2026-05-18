import { Radio } from 'lucide-react';

/**
 * SidebarHeader — SIAGA Job Radar branding and live stats badge.
 */
export default function SidebarHeader({ stats }) {
  return (
    <div className="sidebar-header">
      <div className="sidebar-header__brand">
        <div className="sidebar-header__icon">
          <Radio size={20} />
        </div>
        <div className="sidebar-header__text">
          <h1 className="sidebar-header__title">SIAGA Job Radar</h1>
          <p className="sidebar-header__subtitle">Live Project Discovery</p>
        </div>
      </div>
      <div className="sidebar-header__badge">
        <span className="sidebar-header__pulse" />
        <span className="sidebar-header__count">{stats.aktif} proyek aktif</span>
      </div>
      <p className="sidebar-header__helper">
        Temukan misi inspeksi UAV aktif di seluruh Indonesia.
      </p>
    </div>
  );
}
