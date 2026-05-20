import { CheckCircle } from 'lucide-react';
import { formatRupiah } from '../../project-logic.js';

export default function BidSummaryCard({ bid }) {
  if (!bid) return null;

  return (
    <div className="pd-bid-summary">
      <div className="pd-bid-summary__badge">
        <CheckCircle size={18} /> Bid Terkirim
      </div>
      <div className="pd-bid-summary__details">
        <div className="pd-bid-summary__row">
          <span className="pd-bid-summary__label">Harga Penawaran</span>
          <span className="pd-bid-summary__value">{formatRupiah(Number(bid.harga))}</span>
        </div>
        <div className="pd-bid-summary__row">
          <span className="pd-bid-summary__label">Estimasi Hari</span>
          <span className="pd-bid-summary__value">{bid.estimasiHari} hari</span>
        </div>
        {bid.droneType && (
          <div className="pd-bid-summary__row">
            <span className="pd-bid-summary__label">Drone</span>
            <span className="pd-bid-summary__value">{bid.droneType}</span>
          </div>
        )}
        {bid.catatan && (
          <div className="pd-bid-summary__row">
            <span className="pd-bid-summary__label">Catatan</span>
            <span className="pd-bid-summary__value">{bid.catatan}</span>
          </div>
        )}
      </div>
    </div>
  );
}
