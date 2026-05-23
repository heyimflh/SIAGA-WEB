import { useEffect } from 'react';
import { Info } from 'lucide-react';
import './ToastNotification.css';

export default function ToastNotification({ message, onDismiss }) {
 useEffect(() => {
 if (!message) return;
 const timer = setTimeout(() => {
 onDismiss();
 }, 4000);
 return () => clearTimeout(timer);
 }, [message, onDismiss]);

 if (!message) return null;

 return (
 <div className="job-radar-toast" role="alert" aria-live="polite">
 <div className="job-radar-toast__card">
 <Info size={16} className="job-radar-toast__icon" />
 <span className="job-radar-toast__text">{message}</span>
 <button
 className="job-radar-toast__close"
 onClick={onDismiss}
 aria-label="Tutup notifikasi"
 >
 x
 </button>
 </div>
 </div>
 );
}
