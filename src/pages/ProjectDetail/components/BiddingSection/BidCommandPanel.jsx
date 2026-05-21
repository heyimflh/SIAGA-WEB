import { Users, Clock, AlertCircle } from 'lucide-react';
import { formatTanggalIndonesia } from '../../project-logic.js';
import BidForm from './BidForm.jsx';
import BidSummaryCard from './BidSummaryCard.jsx';

export default function BidCommandPanel({
 project, derivedStatus, hasBid, submittedBid,
 bidFormData, bidFormErrors, isBidSubmitting, isClosed,
 onBidFormChange, onBidSubmit,
}) {
 if (isClosed) {
 return (
 <div className="pd-bid-command">
 <h2 className="pd-bid-intel__title">Bid Command</h2>
 <p className="pd-bid-intel__closed">Bidding telah ditutup untuk proyek ini.</p>
 </div>
 );
 }

 return (
 <div className="pd-bid-command">
 <h2 className="pd-bid-intel__title">Bid Command</h2>
 <p className="pd-bid-intel__subtitle">Ajukan penawaran Anda untuk proyek ini.</p>

 <div className="pd-bid-command__context">
 <div className="pd-bid-command__info-item">
 <Users size={16} />
 <span>{project.jumlah_bidder} pilot sudah mengajukan bid</span>
 </div>
 <div className="pd-bid-command__info-item">
 <Clock size={16} />
 <span>Deadline: {formatTanggalIndonesia(project.deadline)}</span>
 </div>
 {derivedStatus === 'urgent' && (
 <div className="pd-bid-command__info-item pd-bid-command__info-item--urgent">
 <AlertCircle size={16} />
 <span>Proyek ini berstatus urgent</span>
 </div>
 )}
 </div>

 {hasBid ? (
 <BidSummaryCard bid={submittedBid} />
 ) : (
 <BidForm
 formData={bidFormData}
 errors={bidFormErrors}
 isSubmitting={isBidSubmitting}
 onChange={onBidFormChange}
 onSubmit={onBidSubmit}
 />
 )}
 </div>
 );
}
