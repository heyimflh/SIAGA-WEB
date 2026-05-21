import { CheckCircle, X } from 'lucide-react';
import './ToastNotification.css';

export default function ToastNotification({ message, onClose }) {
 return (
 <div className="pd-toast" role="status" aria-live="polite">
 <CheckCircle size={18} className="pd-toast__icon" />
 <span className="pd-toast__message">{message}</span>
 <button className="pd-toast__close" onClick={onClose} aria-label="Tutup notifikasi">
 <X size={16} />
 </button>
 </div>
 );
}
