import { ShieldCheck, Star } from 'lucide-react';
import { formatRupiah } from '../../project-logic.js';
import './BidTable.css';

export default function BidTable({ bids, onSelectPilot, onViewProfile }) {
  if (!bids || bids.length === 0) return <p className="pd-bid-table__empty">Belum ada penawaran.</p>;

  return (
    <div className="pd-bid-table-wrapper">
      <table className="pd-bid-table">
        <thead>
          <tr>
            <th>Pilot</th>
            <th>Verified</th>
            <th>Rating</th>
            <th>Harga Bid</th>
            <th>Estimasi</th>
            <th>Drone</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {bids.map((bid) => (
            <tr key={bid.id}>
              <td className="pd-bid-table__pilot">
                <div className="pd-bid-table__avatar">
                  {bid.pilot_avatar ? (
                    <img src={bid.pilot_avatar} alt={bid.pilot_nama} />
                  ) : (
                    <span>{bid.pilot_nama.charAt(0)}</span>
                  )}
                </div>
                <span>{bid.pilot_nama}</span>
              </td>
              <td>{bid.pilot_verified ? <ShieldCheck size={16} className="pd-bid-table__verified" /> : '-'}</td>
              <td><Star size={14} className="pd-bid-table__star" /> {bid.pilot_rating}</td>
              <td className="pd-bid-table__price">{formatRupiah(bid.harga_bid)}</td>
              <td>{bid.estimasi_hari} hari</td>
              <td className="pd-bid-table__drone">{bid.drone_type}</td>
              <td className="pd-bid-table__actions">
                <button className="pd-bid-table__btn pd-bid-table__btn--primary" onClick={() => onSelectPilot(bid.pilot_id)}>Pilih</button>
                <button className="pd-bid-table__btn pd-bid-table__btn--secondary" onClick={() => onViewProfile(bid.pilot_id)}>Profil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
