import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import './PilotSelectionModal.css';

export default function PilotSelectionModal({ pilot, onConfirm, onClose }) {
 const modalRef = useRef(null);
 const firstFocusRef = useRef(null);

 useEffect(() => {
 firstFocusRef.current?.focus();
 const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
 document.addEventListener('keydown', handleKey);
 return () => document.removeEventListener('keydown', handleKey);
 }, [onClose]);

 if (!pilot) return null;

 return (
 <div className="pd-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Konfirmasi pilih pilot">
 <div className="pd-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
 <div className="pd-modal__avatar">
 {pilot.pilot_avatar ? (
 <img src={pilot.pilot_avatar} alt={pilot.pilot_nama} />
 ) : (
 <span>{pilot.pilot_nama.charAt(0)}</span>
 )}
 </div>
 <h3 className="pd-modal__title">Pilih {pilot.pilot_nama}?</h3>
 <p className="pd-modal__warning">
 <AlertTriangle size={16} /> Tindakan ini akan memilih pilot untuk proyek ini.
 </p>
 <div className="pd-modal__actions">
 <button className="pd-modal__btn pd-modal__btn--secondary" onClick={onClose} ref={firstFocusRef}>Batal</button>
 <button className="pd-modal__btn pd-modal__btn--primary" onClick={onConfirm}>Konfirmasi Pilihan</button>
 </div>
 </div>
 </div>
 );
}
