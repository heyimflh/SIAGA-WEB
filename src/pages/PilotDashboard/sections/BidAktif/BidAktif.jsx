/**
 * BidAktif — Mission Bid Pipeline section.
 * Feature: pilot-dashboard
 * Validates: Requirements 8
 */

import { useNavigate } from 'react-router-dom';
import { formatRupiah } from '../../utils/formatRupiah';
import { sortBids } from '../../utils/sortBids';
import './BidAktif.css';

const STATUS_MAP = {
 pending: { label: 'Pending', className: 'bid-entry__status--warning' },
 diterima: { label: 'Diterima', className: 'bid-entry__status--success' },
 ditolak: { label: 'Ditolak', className: 'bid-entry__status--danger' },
};

function BidEntry({ bid, onClick }) {
 const status = STATUS_MAP[bid.status] || STATUS_MAP.pending;
 return (
 <button
 className="bid-entry"
 onClick={() => onClick(bid.project_id)}
 type="button"
 aria-label={`Lihat detail proyek ${bid.nama_proyek}`}
 >
 <div className="bid-entry__main">
 <span className="bid-entry__project-name">{bid.nama_proyek}</span>
 <div className="bid-entry__meta">
 <span className="bid-entry__infra-badge">{bid.jenis_infrastruktur}</span>
 <span className="bid-entry__location">{bid.lokasi}</span>
 </div>
 </div>
 <div className="bid-entry__details">
 <span className="bid-entry__price">{formatRupiah(bid.harga_bid)}</span>
 <span className="bid-entry__days">{bid.estimasi_hari} hari</span>
 <span className={`bid-entry__status ${status.className}`}>{status.label}</span>
 </div>
 </button>
 );
}

function BidAktif({ bids, sortBy, onSortChange }) {
 const navigate = useNavigate();
 const sortedBids = sortBids(bids, sortBy);

 const handleBidClick = (projectId) => {
 navigate(`/project/${projectId}`);
 };

 return (
 <section className="bid-aktif" id="section-bid" aria-label="Penawaran Misi">
 <div className="bid-aktif__header">
 <div>
 <span className="bid-aktif__label">MISSION PIPELINE</span>
 <h3 className="bid-aktif__title">Penawaran Misi</h3>
 <p className="bid-aktif__subtitle">Pantau semua penawaran proyek yang sedang menunggu keputusan client.</p>
 </div>
 <div className="bid-aktif__sort" role="group" aria-label="Urutkan bid">
 <button
 type="button"
 className={`bid-aktif__sort-btn ${sortBy === 'terbaru' ? 'bid-aktif__sort-btn--active' : ''}`}
 onClick={() => onSortChange('terbaru')}
 >
 Terbaru
 </button>
 <button
 type="button"
 className={`bid-aktif__sort-btn ${sortBy === 'status' ? 'bid-aktif__sort-btn--active' : ''}`}
 onClick={() => onSortChange('status')}
 >
 Status
 </button>
 </div>
 </div>

 {sortedBids.length === 0 ? (
 <div className="bid-aktif__empty">
 <p>Belum ada bid aktif. Cari proyek di Job Radar!</p>
 <button
 type="button"
 className="bid-aktif__empty-cta"
 onClick={() => navigate('/dashboard/pilot/job-radar')}
 >
 Cari Proyek
 </button>
 </div>
 ) : (
 <div className="bid-aktif__list">
 {sortedBids.map((bid) => (
 <BidEntry key={bid.id} bid={bid} onClick={handleBidClick} />
 ))}
 </div>
 )}
 </section>
 );
}

export default BidAktif;
