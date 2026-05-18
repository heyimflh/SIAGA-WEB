import { useEffect } from 'react';
import { Info } from 'lucide-react';
import './ToastNotification.css';

/**
 * ToastNotification — Glass toast for placeholder feedback.
 * Auto-dismisses after 4 seconds.
 */
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
    <div className="toast-notification" role="alert" aria-live="polite">
      <div className="toast-notification__card">
        <Info size={16} className="toast-notification__icon" />
        <span className="toast-notification__text">{message}</span>
        <button
          className="toast-notification__close"
          onClick={onDismiss}
          aria-label="Tutup notifikasi"
        >
          ×
        </button>
      </div>
    </div>
  );
}
