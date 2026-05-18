/**
 * AssetDetailDrawer — slide-in panel dari kanan menampilkan detail aset.
 *
 * Spec: .kiro/specs/client-dashboard
 * Requirements: 5.13, 5.14, 5.15, 13.10, 13.11
 *
 * Props:
 *   asset: object | null — aset yang dipilih (dari mock-data.assets[])
 *   isOpen: boolean — apakah drawer terbuka
 *   onClose: () => void — callback untuk menutup drawer
 *
 * Behavior:
 *   - Slide-in dari kanan via Framer Motion `motion.aside` + AnimatePresence
 *   - Variants: hidden { x: '100%' } → visible { x: 0 }, durasi 280ms easeOut
 *   - On open: focus pertama focusable element
 *   - On Escape: close
 *   - Click overlay backdrop: close
 *   - Slide-out kembali ke kanan saat close
 */

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

/**
 * Map status value to human-readable label in Indonesian.
 */
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

  // Focus first focusable element on open; restore focus on close (Requirement 13.10)
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

  // Listen for Escape key to close (Requirement 13.11)
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

  // Focus trap: keep focus within drawer (Requirement 13.10)
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
          {/* Overlay backdrop — click to close (Requirement 5.15) */}
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

          {/* Drawer panel */}
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
            {/* Header with close button */}
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

            {/* Asset photo */}
            <div className="asset-detail-drawer__photo">
              <img
                src={asset.foto_url}
                alt={`Foto aset ${asset.nama}`}
                className="asset-detail-drawer__img"
              />
            </div>

            {/* Asset info */}
            <div className="asset-detail-drawer__content">
              {/* Nama aset */}
              <h3 className="asset-detail-drawer__name">{asset.nama}</h3>

              {/* Lokasi */}
              <div className="asset-detail-drawer__info-row">
                <MapPin size={16} className="asset-detail-drawer__icon" />
                <span className="asset-detail-drawer__label">Lokasi:</span>
                <span className="asset-detail-drawer__value">
                  {asset.lat.toFixed(4)}, {asset.lng.toFixed(4)}
                </span>
              </div>

              {/* Status terakhir inspeksi */}
              <div className="asset-detail-drawer__info-row">
                <Shield size={16} className="asset-detail-drawer__icon" />
                <span className="asset-detail-drawer__label">Status:</span>
                <span
                  className={`asset-detail-drawer__status asset-detail-drawer__status--${asset.status}`}
                >
                  {getStatusLabel(asset.status)}
                </span>
              </div>

              {/* Tanggal inspeksi terakhir */}
              <div className="asset-detail-drawer__info-row">
                <Calendar size={16} className="asset-detail-drawer__icon" />
                <span className="asset-detail-drawer__label">Inspeksi Terakhir:</span>
                <span className="asset-detail-drawer__value">
                  {asset.inspeksi_terakhir?.tanggal || '-'}
                </span>
              </div>

              {/* Pilot inspeksi terakhir */}
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

            {/* Action links */}
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
