import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Shield, Calendar, ExternalLink, FileText } from 'lucide-react';
import './AssetDetailDrawer.css';

const drawerVariants = {
 hidden: { x: '100%' },
 visible: { x: 0 },
};

const overlayVariants = {
 hidden: { opacity: 0 },
 visible: { opacity: 1 },
};

const TRANSITION = {
 duration: 0.28,
 ease: 'easeOut',
};

function getStatusLabel(status) {
 switch (status) {
 case 'aman':
 return 'Aman';
 case 'perlu_perhatian':
 return 'Perlu Perhatian';
 case 'kritis':
 return 'Kritis';
 default:
 return status || '-';
 }
}

function AssetDetailDrawer({ asset, isOpen, onClose }) {
 const drawerRef = useRef(null);
 const previousFocusRef = useRef(null);

 useEffect(() => {
 if (isOpen && drawerRef.current) {
 previousFocusRef.current = document.activeElement;
 const timer = setTimeout(() => {
 const firstFocusable = drawerRef.current?.querySelector(
 'button, a, [tabindex]:not([tabindex="-1"])'
 );
 if (firstFocusable) {
 firstFocusable.focus();
 }
 }, 50);
 return () => clearTimeout(timer);
 } else if (!isOpen && previousFocusRef.current) {
 previousFocusRef.current.focus();
 previousFocusRef.current = null;
 }
 }, [isOpen]);

 useEffect(() => {
 if (!isOpen) return;

 function handleEscape(e) {
 if (e.key === 'Escape') {
 e.preventDefault();
 onClose();
 }
 }

 document.addEventListener('keydown', handleEscape);
 return () => document.removeEventListener('keydown', handleEscape);
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

 return (
 <AnimatePresence>
 {isOpen && asset && (
 <>
 <motion.div
 className="asset-drawer-overlay"
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
 className="asset-detail-drawer"
 role="dialog"
 aria-modal="true"
 aria-label={`Detail aset: ${asset.nama}`}
 variants={drawerVariants}
 initial="hidden"
 animate="visible"
 exit="hidden"
 transition={TRANSITION}
 onKeyDown={handleKeyDown}
 >
 <div className="asset-detail-drawer__header">
 <h2 className="asset-detail-drawer__title">Detail Aset</h2>
 <button
 className="asset-detail-drawer__close"
 onClick={onClose}
 aria-label="Tutup detail aset"
 type="button"
 >
 <X size={20} />
 </button>
 </div>

 <div className="asset-detail-drawer__photo">
 <img
 src={asset.foto_url}
 alt={`Foto aset ${asset.nama}`}
 className="asset-detail-drawer__img"
 />
 </div>


 <div className="asset-detail-drawer__content">

 <h3 className="asset-detail-drawer__name">{asset.nama}</h3>

 <div className="asset-detail-drawer__info-row">
 <MapPin size={16} className="asset-detail-drawer__icon" />
 <span className="asset-detail-drawer__label">Lokasi:</span>
 <span className="asset-detail-drawer__value">
 {asset.lat.toFixed(4)}, {asset.lng.toFixed(4)}
 </span>
 </div>


 <div className="asset-detail-drawer__info-row">
 <Shield size={16} className="asset-detail-drawer__icon" />
 <span className="asset-detail-drawer__label">Status:</span>
 <span
 className={`asset-detail-drawer__status asset-detail-drawer__status--${asset.status}`}
 >
 {getStatusLabel(asset.status)}
 </span>
 </div>


 <div className="asset-detail-drawer__info-row">
 <Calendar size={16} className="asset-detail-drawer__icon" />
 <span className="asset-detail-drawer__label">Inspeksi Terakhir:</span>
 <span className="asset-detail-drawer__value">
 {asset.inspeksi_terakhir?.tanggal || '-'}
 </span>
 </div>


 {asset.inspeksi_terakhir?.pilot_nama && (
 <div className="asset-detail-drawer__info-row">
 <span className="asset-detail-drawer__label" style={{ marginLeft: '24px' }}>
 Pilot:
 </span>
 <span className="asset-detail-drawer__value">
 {asset.inspeksi_terakhir.pilot_nama}
 </span>
 </div>
 )}
 </div>


 <div className="asset-detail-drawer__actions">
 <a
 href={`#/assets/${asset.id}`}
 className="asset-detail-drawer__link asset-detail-drawer__link--primary"
 >
 <ExternalLink size={16} />
 <span>Lihat Detail</span>
 </a>
 <a
 href={`#/assets/${asset.id}/report`}
 className="asset-detail-drawer__link asset-detail-drawer__link--secondary"
 >
 <FileText size={16} />
 <span>Generate Report</span>
 </a>
 </div>
 </motion.aside>
 </>
 )}
 </AnimatePresence>
 );
}

export default AssetDetailDrawer;
