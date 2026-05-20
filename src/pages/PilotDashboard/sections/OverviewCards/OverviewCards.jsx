/**
 * OverviewCards — Mission Telemetry Cards section.
 * Feature: pilot-dashboard
 * Validates: Requirements 7
 */

import { Radar, FolderOpen, Wallet, Star } from 'lucide-react';
import { formatRupiah } from '../../utils/formatRupiah';
import './OverviewCards.css';

function OverviewCard({ icon: Icon, label, value, insight, accentClass }) {
  return (
    <div className={`overview-card ${accentClass || ''}`}>
      <div className="overview-card__accent-line" aria-hidden="true" />
      <div className="overview-card__icon-orb">
        <Icon size={22} aria-hidden="true" />
      </div>
      <div className="overview-card__content">
        <span className="overview-card__label">{label}</span>
        <span className="overview-card__value">{value}</span>
        {insight && <span className="overview-card__insight">{insight}</span>}
      </div>
    </div>
  );
}

function OverviewCards({ bidAktifCount, proyekBerjalanCount, totalEarnings, ratingAvg, totalReviews, urgentDeadlineCount }) {
  const earningsFormatted = formatRupiah(totalEarnings);
  const bidInsight = bidAktifCount > 0 ? `${bidAktifCount} menunggu respon client` : null;
  const proyekInsight = urgentDeadlineCount > 0 ? `${urgentDeadlineCount} deadline dekat` : null;

  return (
    <section className="overview-cards" id="section-overview" aria-label="Overview Cards">
      <OverviewCard
        icon={Radar}
        label="Bid Aktif"
        value={bidAktifCount}
        insight={bidInsight}
      />
      <OverviewCard
        icon={FolderOpen}
        label="Proyek Berjalan"
        value={proyekBerjalanCount}
        insight={proyekInsight}
      />
      <OverviewCard
        icon={Wallet}
        label="Total Earnings"
        value={earningsFormatted}
      />
      <OverviewCard
        icon={Star}
        label="Rating Saya"
        value={`${ratingAvg} ★`}
        insight={`${totalReviews} review`}
      />
    </section>
  );
}

export default OverviewCards;
