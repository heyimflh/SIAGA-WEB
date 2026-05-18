/**
 * RecentActivityFeed — Section E (timeline vertikal aktivitas terbaru).
 *
 * Renders `<aside aria-label="Aktivitas terbaru">` dengan 8-12 ActivityItem.
 * Max-height + internal scroll vertikal saat melebihi tinggi container.
 * Layout responsive:
 *   - ≥1280px: kolom kanan grid Main Content (sticky top: 80px)
 *   - <1280px: stacked di bawah BiddingReviewTable
 *
 * Empty state: activities kosong → "Belum ada aktivitas terbaru"
 *
 * Spec: .kiro/specs/client-dashboard
 * Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 13.3, 15.4
 */

import { Inbox } from 'lucide-react';
import ActivityItem from './ActivityItem';
import './RecentActivityFeed.css';

/**
 * @param {{ activities: Array<{ id: string, type: string, description: string, timestamp: string, is_new: boolean }> }} props
 */
function RecentActivityFeed({ activities = [] }) {
  if (activities.length === 0) {
    return (
      <aside className="activity-feed" aria-label="Aktivitas terbaru">
        <h2 className="activity-feed__title">Aktivitas Terbaru</h2>
        <div className="activity-feed__empty">
          <Inbox size={40} aria-hidden="true" />
          <p>Belum ada aktivitas terbaru</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="activity-feed" aria-label="Aktivitas terbaru">
      <h2 className="activity-feed__title">Aktivitas Terbaru</h2>
      <ol className="activity-feed__list">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </ol>
    </aside>
  );
}

export default RecentActivityFeed;
