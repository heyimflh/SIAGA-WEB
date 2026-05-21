/**
 * StepDownload — Step 5: Download Ready + PDF Preview Modal.
 */

import { useEffect, useRef } from 'react';
import { Download, Eye, RefreshCw, Shield, FileText, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { REPORT_BLOCKS } from '../../report-logic.js';
import './StepDownload.css';

function StepDownload({
 project,
 reportId,
 timestamp,
 previewPages,
 totalPages,
 isModalOpen,
 modalCurrentPage,
 onDownload,
 onPreview,
 onCloseModal,
 onModalPageChange,
 onReset,
 projectImages,
 inspectionData,
 isGeneratingPdf,
}) {
 const previewBtnRef = useRef(null);
 const modalRef = useRef(null);

 // Format timestamp
 const formattedTime = timestamp
 ? new Date(timestamp).toLocaleString('id-ID', {
 day: 'numeric', month: 'short', year: 'numeric',
 hour: '2-digit', minute: '2-digit',
 })
 : '';

 // Fake file size
 const fileSize = `${(1.8 + Math.random() * 1.2).toFixed(1)} MB`;

 // Focus trap for modal
 useEffect(() => {
 if (!isModalOpen) return;

 const handleKeyDown = (e) => {
 if (e.key === 'Escape') {
 onCloseModal();
 return;
 }
 if (e.key === 'Tab' && modalRef.current) {
 const focusable = modalRef.current.querySelectorAll(
 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
 );
 const first = focusable[0];
 const last = focusable[focusable.length - 1];
 if (e.shiftKey && document.activeElement === first) {
 e.preventDefault();
 last?.focus();
 } else if (!e.shiftKey && document.activeElement === last) {
 e.preventDefault();
 first?.focus();
 }
 }
 };

 document.addEventListener('keydown', handleKeyDown);
 return () => document.removeEventListener('keydown', handleKeyDown);
 }, [isModalOpen, onCloseModal]);

 // Return focus after modal close
 useEffect(() => {
 if (!isModalOpen && previewBtnRef.current) {
 previewBtnRef.current.focus();
 }
 }, [isModalOpen]);

 return (
 <div className="step-download">
 {/* Download Card */}
 <div className="step-download__card">
 <div className="step-download__badge">
 <Shield size={14} />
 <span>Verified SIAGA Report</span>
 </div>

 <h2 className="step-download__title">Report Ready!</h2>

 {/* Cover image thumbnail */}
 {projectImages?.coverImage ? (
 <div className="step-download__thumbnail step-download__thumbnail--image">
 <img
 src={projectImages.coverImage}
 alt={`Cover laporan ${project?.nama || ''}`}
 loading="lazy"
 onError={(e) => { e.target.style.display = 'none'; }}
 />
 <div className="step-download__thumb-overlay">
 <span className="step-download__thumb-brand">SIAGA REPORT</span>
 </div>
 </div>
 ) : (
 <div className="step-download__thumbnail">
 <div className="step-download__thumb-header">SIAGA</div>
 <div className="step-download__thumb-content">
 <div className="step-download__thumb-line" />
 <div className="step-download__thumb-line step-download__thumb-line--short" />
 <div className="step-download__thumb-block" />
 </div>
 </div>
 )}

 {/* Report info */}
 <div className="step-download__info">
 <div className="step-download__info-row">
 <span className="step-download__info-label">Project</span>
 <span className="step-download__info-value">{project?.nama || 'N/A'}</span>
 </div>
 <div className="step-download__info-row">
 <span className="step-download__info-label">Report ID</span>
 <span className="step-download__info-value step-download__info-value--mono">{reportId}</span>
 </div>
 <div className="step-download__info-row">
 <span className="step-download__info-label">Generated</span>
 <span className="step-download__info-value">{formattedTime}</span>
 </div>
 <div className="step-download__info-row">
 <span className="step-download__info-label">Size</span>
 <span className="step-download__info-value">{fileSize}</span>
 </div>
 {inspectionData && (
 <>
 <div className="step-download__info-row">
 <span className="step-download__info-label">Health Index</span>
 <span className="step-download__info-value">{inspectionData.assetHealthIndex}</span>
 </div>
 <div className="step-download__info-row">
 <span className="step-download__info-label">Risk Level</span>
 <span className="step-download__info-value">{inspectionData.riskLevel}</span>
 </div>
 <div className="step-download__info-row">
 <span className="step-download__info-label">Coverage</span>
 <span className="step-download__info-value">{inspectionData.coveragePercentage}%</span>
 </div>
 <div className="step-download__info-row">
 <span className="step-download__info-label">Total Findings</span>
 <span className="step-download__info-value">{inspectionData.criticalFindings + inspectionData.moderateFindings + inspectionData.safePoints}</span>
 </div>
 </>
 )}
 </div>

 {/* Included sections */}
 <div className="step-download__sections">
 <span className="step-download__sections-label">Included:</span>
 <div className="step-download__sections-chips">
 {previewPages.map((page) => (
 <span key={page.id} className="step-download__section-chip">
 {page.title.split(' ')[0]}
 </span>
 ))}
 </div>
 </div>

 {/* Actions */}
 <div className="step-download__actions">
 <button
 className="step-download__btn-primary"
 onClick={onDownload}
 disabled={isGeneratingPdf}
 type="button"
 aria-label={isGeneratingPdf ? 'Menyiapkan PDF...' : 'Download PDF laporan inspeksi'}
 >
 <Download size={18} />
 {isGeneratingPdf ? 'Menyiapkan PDF...' : 'Download PDF'}
 </button>
 <button
 className="step-download__btn-secondary"
 onClick={onPreview}
 ref={previewBtnRef}
 type="button"
 >
 <Eye size={16} />
 Preview Report
 </button>
 <button className="step-download__btn-ghost" onClick={onReset} type="button">
 <RefreshCw size={14} />
 Generate Lagi
 </button>
 </div>
 </div>

 {/* PDF Preview Modal */}
 {isModalOpen && (
 <div className="step-download__modal-backdrop" onClick={onCloseModal}>
 <div
 className="step-download__modal"
 ref={modalRef}
 role="dialog"
 aria-modal="true"
 aria-label="Preview laporan PDF"
 onClick={(e) => e.stopPropagation()}
 >
 <button
 className="step-download__modal-close"
 onClick={onCloseModal}
 aria-label="Tutup preview"
 type="button"
 >
 <X size={20} />
 </button>

 {/* Page content */}
 <div className="step-download__modal-page">
 <div className="step-download__modal-page-header">
 <span className="step-download__modal-logo">SIAGA</span>
 <span className="step-download__modal-page-title">
 {previewPages[modalCurrentPage]?.title || ''}
 </span>
 </div>
 <div className="step-download__modal-page-body">
 {(() => {
 const currentPage = previewPages[modalCurrentPage];
 let img = null;
 if (currentPage?.id === 'cover') img = projectImages?.coverImage;
 else if (currentPage?.id === 'map') img = projectImages?.mapPreviewImage;
 else if (currentPage?.id === 'gallery') img = projectImages?.galleryImages?.[0];

 if (img) {
 return (
 <img
 src={img}
 alt={`Preview ${currentPage?.title || ''}`}
 className="step-download__modal-page-image"
 loading="lazy"
 onError={(e) => { e.target.style.display = 'none'; }}
 />
 );
 }
 return <div className="step-download__modal-placeholder" />;
 })()}
 {/* Show findings info for table page */}
 {previewPages[modalCurrentPage]?.id === 'table' && inspectionData && (
 <div className="step-download__modal-findings">
 <p><strong>Critical:</strong> {inspectionData.criticalFindings} | <strong>Moderate:</strong> {inspectionData.moderateFindings} | <strong>Safe:</strong> {inspectionData.safePoints}</p>
 </div>
 )}
 {previewPages[modalCurrentPage]?.id === 'signature' && inspectionData && (
 <div className="step-download__modal-findings">
 <p><strong>Pilot:</strong> {inspectionData.pilotSignature}</p>
 <p><strong>Status:</strong> Verified ✓</p>
 </div>
 )}
 </div>
 </div>

 {/* Navigation */}
 <div className="step-download__modal-nav">
 <button
 className="step-download__modal-nav-btn"
 onClick={() => onModalPageChange(Math.max(0, modalCurrentPage - 1))}
 disabled={modalCurrentPage === 0}
 type="button"
 aria-label="Halaman sebelumnya"
 >
 <ChevronLeft size={18} />
 </button>
 <span className="step-download__modal-indicator">
 Halaman {modalCurrentPage + 1} dari {previewPages.length}
 </span>
 <button
 className="step-download__modal-nav-btn"
 onClick={() => onModalPageChange(Math.min(previewPages.length - 1, modalCurrentPage + 1))}
 disabled={modalCurrentPage === previewPages.length - 1}
 type="button"
 aria-label="Halaman berikutnya"
 >
 <ChevronRight size={18} />
 </button>
 </div>

 <button className="step-download__modal-download" onClick={onDownload} type="button">
 <Download size={16} />
 Download
 </button>
 </div>
 </div>
 )}
 </div>
 );
}

export default StepDownload;
