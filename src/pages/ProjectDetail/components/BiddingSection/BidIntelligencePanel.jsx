import { Users, ShieldCheck, TrendingDown, Zap, Star } from 'lucide-react';
import { getBidIntelligenceMetrics, formatRupiah } from '../../project-logic.js';
import BidTable from './BidTable.jsx';
import BidCardMobile from './BidCardMobile.jsx';

export default function BidIntelligencePanel({ project, isClosed, onSelectPilot, onViewProfile }) {
  if (isClosed) {
    return (
      <div className="pd-bid-intel">
        <h2 className="pd-bid-intel__title">Bid Intelligence</h2>
        <p className="pd-bid-intel__closed">Bidding telah selesai untuk proyek ini.</p>
      </div>
    );
  }

  const metrics = getBidIntelligenceMetrics(project);

  return (
    <div className="pd-bid-intel">
      <h2 className="pd-bid-intel__title">Bid Intelligence</h2>
      <p className="pd-bid-intel__subtitle">Ringkasan penawaran pilot untuk proyek ini.</p>

      <div className="pd-bid-intel__metrics">
        <div className="pd-bid-intel__metric">
          <Users size={18} />
          <span className="pd-bid-intel__metric-value">{metrics.total}</span>
          <span className="pd-bid-intel__metric-label">Total Penawaran</span>
        </div>
        <div className="pd-bid-intel__metric">
          <ShieldCheck size={18} />
          <span className="pd-bid-intel__metric-value">{metrics.verified}</span>
          <span className="pd-bid-intel__metric-label">SIAGA Verified</span>
        </div>
        <div className="pd-bid-intel__metric">
          <TrendingDown size={18} />
          <span className="pd-bid-intel__metric-value">{formatRupiah(metrics.lowestPrice)}</span>
          <span className="pd-bid-intel__metric-label">Harga Terendah</span>
        </div>
        <div className="pd-bid-intel__metric">
          <Zap size={18} />
          <span className="pd-bid-intel__metric-value">{metrics.fastestDays} hari</span>
          <span className="pd-bid-intel__metric-label">Estimasi Tercepat</span>
        </div>
        <div className="pd-bid-intel__metric">
          <Star size={18} />
          <span className="pd-bid-intel__metric-value">{metrics.highestRating}</span>
          <span className="pd-bid-intel__metric-label">Rating Tertinggi</span>
        </div>
      </div>

      <div className="pd-bid-intel__table-desktop">
        <BidTable bids={project.bids} onSelectPilot={onSelectPilot} onViewProfile={onViewProfile} />
      </div>
      <div className="pd-bid-intel__cards-mobile">
        <BidCardMobile bids={project.bids} onSelectPilot={onSelectPilot} onViewProfile={onViewProfile} />
      </div>
    </div>
  );
}
