/**
 * BidRow.jsx — Single row in the Bidding Review Table (Section D).
 *
 * Spec: .kiro/specs/client-dashboard
 * Validates: Requirements 7.1, 7.3, 7.4, 7.11, 7.12, 12.5
 *
 * Renders one bid as a `<tr>` with columns:
 *   Avatar Pilot | Nama Pilot | Badge SIAGA Verified | Rating | Harga Bid | Estimasi Hari | Drone Type | Aksi
 *
 * Each `<td>` carries `data-label` for responsive stacked card layout (<768px).
 */

import { ShieldCheck, Star, Eye, UserCheck } from 'lucide-react';
import { formatRupiah } from '../../utils/formatRupiah.js';

/**
 * Renders star rating as filled/empty stars + numeric value.
 * @param {{ rating: number }} props
 */
function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        size={14}
        aria-hidden="true"
        className={i <= fullStars ? 'bid-star bid-star--filled' : 'bid-star'}
        fill={i <= fullStars ? 'currentColor' : 'none'}
      />
    );
  }

  return (
    <span className="bid-rating">
      <span className="bid-rating__stars" aria-hidden="true">{stars}</span>
      <span className="bid-rating__value">{rating.toFixed(1)}</span>
    </span>
  );
}

/**
 * BidRow — renders a single bid entry as a table row.
 *
 * Props:
 *   - bid: object from mock-data bids array
 *   - onViewProfile: (bid) => void — opens PilotProfileDrawer
 *   - onSelectPilot: (bid) => void — opens PilotSelectionModal
 */
function BidRow({ bid, onViewProfile, onSelectPilot }) {
  return (
    <tr className="bid-row">
      <td className="bid-row__cell bid-row__cell--avatar" data-label="Avatar">
        <img
          src={bid.pilot_avatar}
          alt=""
          className="bid-row__avatar"
          loading="lazy"
        />
      </td>

      <td className="bid-row__cell bid-row__cell--nama" data-label="Nama Pilot">
        <span className="bid-row__nama">{bid.pilot_nama}</span>
      </td>

      <td className="bid-row__cell bid-row__cell--verified" data-label="SIAGA Verified">
        {bid.siaga_verified ? (
          <span className="bid-badge bid-badge--verified" aria-label="SIAGA Verified">
            <ShieldCheck size={16} aria-hidden="true" />
            <span>Verified</span>
          </span>
        ) : (
          <span className="bid-badge bid-badge--unverified" aria-label="Belum Verified">
            —
          </span>
        )}
      </td>

      <td className="bid-row__cell bid-row__cell--rating" data-label="Rating">
        <StarRating rating={bid.rating} />
      </td>

      <td className="bid-row__cell bid-row__cell--harga" data-label="Harga Bid">
        <span className="bid-row__harga">{formatRupiah(bid.harga)}</span>
      </td>

      <td className="bid-row__cell bid-row__cell--estimasi" data-label="Estimasi Hari">
        <span>{bid.estimasi_hari} hari</span>
      </td>

      <td className="bid-row__cell bid-row__cell--drone" data-label="Drone Type">
        <span className="bid-row__drone">{bid.drone_type}</span>
      </td>

      <td className="bid-row__cell bid-row__cell--aksi" data-label="Aksi">
        <div className="bid-row__actions">
          <button
            type="button"
            className="bid-action-btn bid-action-btn--profile"
            onClick={() => onViewProfile(bid)}
            aria-label={`Lihat profil ${bid.pilot_nama}`}
          >
            <Eye size={14} aria-hidden="true" />
            <span>Lihat Profil</span>
          </button>
          <button
            type="button"
            className="bid-action-btn bid-action-btn--select"
            onClick={() => onSelectPilot(bid)}
            aria-label={`Pilih pilot ${bid.pilot_nama}`}
          >
            <UserCheck size={14} aria-hidden="true" />
            <span>Pilih Pilot</span>
          </button>
        </div>
      </td>
    </tr>
  );
}

export default BidRow;
