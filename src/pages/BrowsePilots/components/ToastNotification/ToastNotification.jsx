import { useEffect } from 'react';
import { X } from 'lucide-react';
import './ToastNotification.css';

export default function ToastNotification({ message, onDismiss }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onDismiss, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className="pilots-toast" role="alert">
      <span className="pilots-toast__message">{message}</span>
      <button className="pilots-toast__close" onClick={onDismiss} aria-label="Tutup notifikasi">
        <X size={14} />
      </button>
    </div>
  );
}
