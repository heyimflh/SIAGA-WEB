import { Inbox } from 'lucide-react';
import ActivityItem from './ActivityItem';
import './RecentActivityFeed.css';

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
