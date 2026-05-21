/**
 * ToastNotification — Glass notification for success/error/info.
 */

import { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import './ToastNotification.css';

const ICONS = {
 success: CheckCircle,
 error: AlertCircle,
 info: Info,
};

function ToastNotification({ message, type = 'success', onClose }) {
 const Icon = ICONS[type] || Info;

 // Auto-dismiss after 4 seconds
 useEffect(() => {
 const timer = setTimeout(onClose, 4000);
 return () => clearTimeout(timer);
 }, [onClose]);

 return (
 <div
 className={`toast-notification toast-notification--${type}`}
 role={type === 'error' ? 'alert' : 'status'}
 aria-live="polite"
 >
 <Icon size={18} className="toast-notification__icon" />
 <span className="toast-notification__message">{message}</span>
 <button
 className="toast-notification__close"
 onClick={onClose}
 aria-label="Tutup notifikasi"
 type="button"
 >
 <X size={14} />
 </button>
 </div>
 );
}

export default ToastNotification;
