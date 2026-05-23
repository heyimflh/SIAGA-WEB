import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldCheck, Star, UserCheck } from 'lucide-react';
import { formatRupiah } from '../../utils/formatRupiah.js';

const modalVariants = {
 hidden: { opacity: 0, scale: 0.9, x: '-50%', y: '-50%' },
 visible: { opacity: 1, scale: 1, x: '-50%', y: '-50%' },
};

const overlayVariants = {
 hidden: { opacity: 0 },
 visible: { opacity: 1 },
};

function PilotSelectionModal({ pilot, isOpen, onClose, onConfirm }) {
 const modalRef = useRef(null);
 const previousFocusRef = useRef(null);

 useEffect(() => {
 if (isOpen && modalRef.current) {
 previousFocusRef.current = document.activeElement;
 const firstFocusable = modalRef.current.querySelector(
 'button, a, [tabindex]:not([tabindex="-1"])'
 );
 if (firstFocusable) {
 firstFocusable.focus();
 }
 } else if (!isOpen && previousFocusRef.current) {
 previousFocusRef.current.focus();
 previousFocusRef.current = null;
 }
 }, [isOpen]);

 useEffect(() => {
 if (!isOpen) return;

 function handleKeyDown(e) {
 if (e.key === 'Escape') {
 e.preventDefault();
 onClose();
 }
 }

 document.addEventListener('keydown', handleKeyDown);
 return () => document.removeEventListener('keydown', handleKeyDown);
 }, [isOpen, onClose]);

 const handleKeyDown = useCallback(
 (e) => {
 if (e.key !== 'Tab' || !modalRef.current) return;

 const focusableElements = modalRef.current.querySelectorAll(
 'button, a, [tabindex]:not([tabindex="-1"]), input, select, textarea'
 );
 if (focusableElements.length === 0) return;

 const first = focusableElements[0];
 const last = focusableElements[focusableElements.length - 1];

 if (e.shiftKey && document.activeElement === first) {
 e.preventDefault();
 last.focus();
 } else if (!e.shiftKey && document.activeElement === last) {
 e.preventDefault();
 first.focus();
 }
 },
 []
 );

 useEffect(() => {
 if (isOpen) {
 document.body.style.overflow = 'hidden';
 } else {
 document.body.style.overflow = '';
 }
 return () => {
 document.body.style.overflow = '';
 };
 }, [isOpen]);

 if (!pilot) return null;

 const modalContent = (
 <AnimatePresence>
 {isOpen && (
 <>
 <motion.div
 className="pilot-modal-overlay"
 variants={overlayVariants}
 initial="hidden"
 animate="visible"
 exit="hidden"
 transition={{ duration: 0.15 }}
 onClick={onClose}
 aria-hidden="true"
 />

 <motion.div
 ref={modalRef}
 className="pilot-modal"
 role="dialog"
 aria-modal="true"
 aria-labelledby="pilot-modal-title"
 variants={modalVariants}
 initial="hidden"
 animate="visible"
 exit="hidden"
 transition={{ duration: 0.2, ease: 'easeOut' }}
 onKeyDown={handleKeyDown}
 >
 <div className="pilot-modal__header">
 <UserCheck size={24} className="pilot-modal__header-icon" aria-hidden="true" />
 <h2 id="pilot-modal-title" className="pilot-modal__title">
 Konfirmasi Pilihan Pilot
 </h2>
 </div>

 <div className="pilot-modal__summary">
 <img
 src={pilot.pilot_avatar}
 alt=""
 className="pilot-modal__avatar"
 />
 <div className="pilot-modal__info">
 <p className="pilot-modal__name">{pilot.pilot_nama}</p>
 <div className="pilot-modal__meta">
 {pilot.siaga_verified && (
 <span className="pilot-modal__badge">
 <ShieldCheck size={12} aria-hidden="true" />
 <span>Verified</span>
 </span>
 )}
 <span className="pilot-modal__rating">
 <Star size={12} aria-hidden="true" />
 <span>{pilot.rating.toFixed(1)}</span>
 </span>
 </div>
 <p className="pilot-modal__price">{formatRupiah(pilot.harga)}</p>
 <p className="pilot-modal__detail">
 {pilot.drone_type} &middot; {pilot.estimasi_hari} hari
 </p>
 </div>
 </div>


 <div className="pilot-modal__warning">
 <AlertTriangle size={18} className="pilot-modal__warning-icon" aria-hidden="true" />
 <p className="pilot-modal__warning-text">
 Setelah dikonfirmasi, pilot ini akan ditugaskan untuk proyek Anda.
 Pastikan Anda telah mereview profil dan penawaran pilot sebelum melanjutkan.
 </p>
 </div>

 <div className="pilot-modal__actions">
 <button
 type="button"
 className="pilot-modal__btn pilot-modal__btn--cancel"
 onClick={onClose}
 >
 Batal
 </button>
 <button
 type="button"
 className="pilot-modal__btn pilot-modal__btn--confirm"
 onClick={onConfirm}
 >
 Konfirmasi Pilihan
 </button>
 </div>
 </motion.div>
 </>
 )}
 </AnimatePresence>
 );

 return createPortal(modalContent, document.body);
}

export default PilotSelectionModal;
