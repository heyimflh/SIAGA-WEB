/**
 * ActivityItem — satu entri pada timeline aktivitas terbaru.
 *
 * Menampilkan ikon Lucide sesuai tipe aktivitas, deskripsi singkat,
 * dan timestamp relatif. Item dengan `is_new === true` mendapat class
 * `.activity-item--new` yang menjalankan pulse animation 1 siklus (1.4s)
 * lalu listener `animationend` menghapus class.
 *
 * Spec: .kiro/specs/client-dashboard
 * Validates: Requirements 8.2, 8.4
 */

import { useRef, useEffect, useCallback } from 'react';
import {
 Gavel,
 AlertTriangle,
 FileCheck2,
 Upload,
 CheckCircle2,
} from 'lucide-react';
import { relativeTime } from '../../utils/relativeTime.js';

/**
 * Map activity type → Lucide icon component.
 */
const ICON_MAP = {
 bid_received: Gavel,
 asset_alert: AlertTriangle,
 report_ready: FileCheck2,
 pilot_uploaded: Upload,
 project_completed: CheckCircle2,
};

/**
 * @param {{ activity: { id: string, type: string, description: string, timestamp: string, is_new: boolean } }} props
 */
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
