import { ShieldCheck, Star } from 'lucide-react';
import { formatRupiah } from '../../project-logic.js';

export default function BidCardMobile({ bids, onSelectPilot, onViewProfile }) {
 if (!bids || bids.length === 0) return null;

 return (
 <div className="pd-bid-cards">
 {bids.map((bid) => (
 <div key={bid.id} className="pd-bid-card">
 <div className="pd-bid-card__header">
 <div className="pd-bid-card__avatar">
 {bid.pilot_avatar ? (
 <img src={bid.pilot_avatar} alt={bid.pilot_nama} />
 ) : (
 <span>{bid.pilot_nama.charAt(0)}</span>
 )}
 </div>
 <div className="pd-bid-card__info">
 <span className="pd-bid-card__name">{bid.pilot_nama}</span>
 <span className="pd-bid-card__rating"><Star size={12} /> {bid.pilot_rating}</span>
 </div>
 {bid.pilot_verified && <ShieldCheck size={18} className="pd-bid-card__verified" />}
 </div>
 <div className="pd-bid-card__details">
 <span className="pd-bid-card__price">{formatRupiah(bid.harga_bid)}</span>
 <span className="pd-bid-card__est">{bid.estimasi_hari} hari</span>
 </div>
 <div className="pd-bid-card__drone">{bid.drone_type}</div>
 <div className="pd-bid-card__actions">
 <button className="pd-bid-table__btn pd-bid-table__btn--secondary" onClick={() => onViewProfile(bid.pilot_id)}>Lihat Profil</button>
 <button className="pd-bid-table__btn pd-bid-table__btn--primary" onClick={() => onSelectPilot(bid.pilot_id)}>Pilih Pilot</button>
 </div>
 </div>
 ))}
 </div>
 );
}
