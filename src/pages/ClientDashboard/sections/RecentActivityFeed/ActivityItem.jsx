import { useRef, useEffect, useCallback } from 'react';
import {
 Gavel,
 AlertTriangle,
 FileCheck2,
 Upload,
 CheckCircle2,
} from 'lucide-react';
import { relativeTime } from '../../utils/relativeTime.js';

const ICON_MAP = {
 bid_received: Gavel,
 asset_alert: AlertTriangle,
 report_ready: FileCheck2,
 pilot_uploaded: Upload,
 project_completed: CheckCircle2,
};

function ActivityItem({ activity }) {
 const itemRef = useRef(null);
 const Icon = ICON_MAP[activity.type] || Gavel;

 const handleAnimationEnd = useCallback(() => {
 if (itemRef.current) {
 itemRef.current.classList.remove('activity-item--new');
 }
 }, []);

 useEffect(() => {
 const el = itemRef.current;
 if (!el || !activity.is_new) return;

 el.addEventListener('animationend', handleAnimationEnd);
 return () => {
 el.removeEventListener('animationend', handleAnimationEnd);
 };
 }, [activity.is_new, handleAnimationEnd]);

 return (
 <li
 ref={itemRef}
 className={`activity-item${activity.is_new ? ' activity-item--new' : ''}`}
 >
 <span className={`activity-item__icon activity-item__icon--${activity.type}`}>
 <Icon size={16} aria-hidden="true" />
 </span>
 <div className="activity-item__content">
 <p className="activity-item__description">{activity.description}</p>
 <time className="activity-item__time" dateTime={activity.timestamp}>
 {relativeTime(activity.timestamp)}
 </time>
 </div>
 </li>
 );
}

export default ActivityItem;
