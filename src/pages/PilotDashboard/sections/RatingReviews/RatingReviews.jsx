/**
 * RatingReviews — Pilot Reputation Panel section.
 * Feature: pilot-dashboard
 * Validates: Requirements 12
 */

import { Star } from 'lucide-react';
import './RatingReviews.css';

function RatingBreakdown({ reviews }) {
 const breakdown = [5, 4, 3, 2, 1].map((star) => {
 const count = reviews.filter((r) => r.rating === star).length;
 const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
 return { star, count, pct };
 });

 return (
 <div className="rating-breakdown">
 {breakdown.map((b) => (
 <div key={b.star} className="rating-breakdown__row" aria-label={`${b.star} bintang: ${b.count} review`}>
 <span className="rating-breakdown__star">{b.star}★</span>
 <div className="rating-breakdown__bar">
 <div className="rating-breakdown__fill" style={{ width: `${b.pct}%` }} />
 </div>
 <span className="rating-breakdown__count">{b.count}</span>
 </div>
 ))}
 </div>
 );
}

function ReviewEntry({ review }) {
 return (
 <article className="review-entry">
 <div className="review-entry__header">
 <img src={review.client_avatar} alt={review.client_nama} className="review-entry__avatar" />
 <div>
 <span className="review-entry__name">{review.client_nama}</span>
 <span className="review-entry__stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
 </div>
 <span className="review-entry__date">{review.tanggal}</span>
 </div>
 <p className="review-entry__text">{review.teks}</p>
 </article>
 );
}

function RatingReviews({ ratingAvg, totalReviews, reviews }) {
 return (
 <section className="rating-reviews" id="section-reviews" aria-label="Rating & Review Klien">
 <div className="rating-reviews__header">
 <span className="rating-reviews__label">PILOT REPUTATION</span>
 <h3 className="rating-reviews__title">Rating & Review Klien</h3>
 <p className="rating-reviews__subtitle">Lihat reputasi Anda berdasarkan penilaian client setelah proyek selesai.</p>
 </div>

 <div className="rating-reviews__content">
 <div className="rating-reviews__summary">
 <div className="rating-reviews__big-rating">
 <span className="rating-reviews__avg">{ratingAvg}</span>
 <Star size={28} className="rating-reviews__star-icon" aria-hidden="true" />
 </div>
 <span className="rating-reviews__total">{totalReviews} review</span>
 {ratingAvg >= 4.5 && (
 <span className="rating-reviews__badge">Top Rated Infrastructure Pilot</span>
 )}
 <RatingBreakdown reviews={reviews} />
 </div>

 <div className="rating-reviews__list">
 {reviews.length === 0 ? (
 <div className="rating-reviews__empty">
 <p>Belum ada review. Selesaikan proyek pertama Anda!</p>
 </div>
 ) : (
 reviews.slice(0, 3).map((r) => <ReviewEntry key={r.id} review={r} />)
 )}
 </div>
 </div>
 </section>
 );
}

export default RatingReviews;
