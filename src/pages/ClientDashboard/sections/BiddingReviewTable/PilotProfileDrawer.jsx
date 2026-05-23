import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShieldCheck, Clock, Plane } from 'lucide-react';
import { formatRupiah } from '../../utils/formatRupiah.js';

const drawerVariants = {
 hidden: { x: '100%' },
 visible: { x: 0 },
};

const overlayVariants = {
 hidden: { opacity: 0 },
 visible: { opacity: 1 },
};

function PilotProfileDrawer({ pilot, isOpen, onClose }) {
 const drawerRef = useRef(null);
 const previousFocusRef = useRef(null);

 useEffect(() => {
 if (isOpen && drawerRef.current) {
 previousFocusRef.current = document.activeElement;
 const firstFocusable = drawerRef.current.querySelector(
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
 if (e.key !== 'Tab' || !drawerRef.current) return;

 const focusableElements = drawerRef.current.querySelectorAll(
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

 const drawerContent = (
 <AnimatePresence>
 {isOpen && (
 <>
 <motion.div
 className="client-pilot-drawer-overlay pilot-drawer-overlay"
 variants={overlayVariants}
 initial="hidden"
 animate="visible"
 exit="hidden"
 transition={{ duration: 0.2 }}
 onClick={onClose}
 aria-hidden="true"
 />

 <motion.aside
 ref={drawerRef}
 className="client-pilot-drawer pilot-drawer"
 role="dialog"
 aria-modal="true"
 aria-label={`Profil pilot ${pilot.pilot_nama}`}
 variants={drawerVariants}
 initial="hidden"
 animate="visible"
 exit="hidden"
 transition={{ duration: 0.28, ease: 'easeOut' }}
 onKeyDown={handleKeyDown}
 >
 <div className="pilot-drawer__header">
 <h2 className="pilot-drawer__title">Profil Pilot</h2>
 <button
 type="button"
 className="pilot-drawer__close"
 onClick={onClose}
 aria-label="Tutup profil pilot"
 >
 <X size={20} aria-hidden="true" />
 </button>
 </div>

 <div className="pilot-drawer__content">
 <div className="pilot-drawer__identity">
 <img
 src={pilot.pilot_avatar}
 alt={`Foto ${pilot.pilot_nama}`}
 className="pilot-drawer__avatar"
 />
 <div className="pilot-drawer__name-block">
 <h3 className="pilot-drawer__name">{pilot.pilot_nama}</h3>
 {pilot.siaga_verified && (
 <span className="pilot-drawer__verified">
 <ShieldCheck size={14} aria-hidden="true" />
 <span>SIAGA Verified</span>
 </span>
 )}
 </div>
 </div>

 <div className="pilot-drawer__stats">
 <div className="pilot-drawer__stat">
 <Star size={16} aria-hidden="true" className="pilot-drawer__stat-icon" />
 <span className="pilot-drawer__stat-label">Rating</span>
 <span className="pilot-drawer__stat-value">{pilot.rating.toFixed(1)} / 5.0</span>
 </div>
 <div className="pilot-drawer__stat">
 <Clock size={16} aria-hidden="true" className="pilot-drawer__stat-icon" />
 <span className="pilot-drawer__stat-label">Estimasi</span>
 <span className="pilot-drawer__stat-value">{pilot.estimasi_hari} hari</span>
 </div>
 <div className="pilot-drawer__stat">
 <Plane size={16} aria-hidden="true" className="pilot-drawer__stat-icon" />
 <span className="pilot-drawer__stat-label">Drone</span>
 <span className="pilot-drawer__stat-value">{pilot.drone_type}</span>
 </div>
 </div>

 <div className="pilot-drawer__section">
 <h4 className="pilot-drawer__section-title">Harga Penawaran</h4>
 <p className="pilot-drawer__price">{formatRupiah(pilot.harga)}</p>
 </div>


 {pilot.portfolio_thumbs && pilot.portfolio_thumbs.length > 0 && (
 <div className="pilot-drawer__section">
 <h4 className="pilot-drawer__section-title">Portfolio</h4>
 <div className="pilot-drawer__portfolio">
 {pilot.portfolio_thumbs.map((thumb, idx) => (
 <img
 key={idx}
 src={thumb}
 alt={`Portfolio ${pilot.pilot_nama} ${idx + 1}`}
 className="pilot-drawer__portfolio-img"
 loading="lazy"
 />
 ))}
 </div>
 </div>
 )}
 </div>
 </motion.aside>
 </>
 )}
 </AnimatePresence>
 );

 return createPortal(drawerContent, document.body);
}

export default PilotProfileDrawer;
