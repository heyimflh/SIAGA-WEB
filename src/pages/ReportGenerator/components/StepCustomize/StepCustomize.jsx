import { FileText, MapPin, Image, Table, PenTool, Check } from 'lucide-react';
import { REPORT_BLOCKS } from '../../report-logic.js';
import './StepCustomize.css';

const ICONS = {
 'file-text': FileText,
 'map-pin': MapPin,
 'image': Image,
 'table': Table,
 'pen-tool': PenTool,
};

function StepCustomize({ checkboxState, onToggle, previewPages, totalPages, onBack, onNext, canProceed, projectImages }) {
 return (
 <div className="step-customize">
 <div className="step-customize__layout">
 <div className="step-customize__blocks-panel">
 <div className="step-customize__header">
 <span className="step-customize__step-label">STEP 02</span>
 <h2 className="step-customize__title">Customize Isi Laporan</h2>
 <p className="step-customize__subtitle">
 Pilih bagian yang ingin dimasukkan ke dalam laporan inspeksi.
 </p>
 </div>

 <div className="step-customize__blocks">
 {REPORT_BLOCKS.map((block) => {
 const Icon = ICONS[block.icon] || FileText;
 const isChecked = checkboxState[block.id];

 return (
 <label
 key={block.id}
 className={`step-customize__block ${isChecked ? 'step-customize__block--selected' : ''}`}
 htmlFor={`report-block-${block.id}`}
 >
 <input
 type="checkbox"
 id={`report-block-${block.id}`}
 checked={isChecked}
 onChange={() => onToggle(block.id)}
 className="step-customize__checkbox-input"
 aria-checked={isChecked}
 />
 <div className="step-customize__block-check">
 {isChecked && <Check size={12} />}
 </div>
 <div className="step-customize__block-icon">
 <Icon size={20} />
 </div>
 <div className="step-customize__block-info">
 <span className="step-customize__block-title">{block.title}</span>
 <span className="step-customize__block-desc">{block.description}</span>
 </div>
 <span className="step-customize__block-pages">
 {block.estimatedPages} hal
 </span>
 </label>
 );
 })}
 </div>

 {!canProceed && (
 <p className="step-customize__warning">Pilih minimal satu bagian laporan.</p>
 )}

 <div className="step-customize__nav">
 <button className="step-customize__btn-back" onClick={onBack} type="button">
 ← Kembali
 </button>
 <button
 className="step-customize__btn-next"
 onClick={onNext}
 disabled={!canProceed}
 type="button"
 >
 Generate Report →
 </button>
 </div>
 </div>

 <div className="step-customize__preview-panel">
 <div className="step-customize__preview-header">
 <span className="step-customize__preview-label">Preview Dokumen</span>
 <span className="step-customize__preview-count">{totalPages} halaman</span>
 </div>

 <div className="step-customize__preview-stack">
 {previewPages.length === 0 ? (
 <div className="step-customize__preview-empty">
 <p>Pilih minimal satu bagian</p>
 </div>
 ) : (
 previewPages.map((page, idx) => {

 let pageImage = null;
 if (page.id === 'cover' && projectImages?.coverImage) pageImage = projectImages.coverImage;
 else if (page.id === 'map' && projectImages?.mapPreviewImage) pageImage = projectImages.mapPreviewImage;
 else if (page.id === 'gallery' && projectImages?.galleryImages?.[0]) pageImage = projectImages.galleryImages[0];

 return (
 <div
 key={page.id}
 className="step-customize__preview-page"
 style={{ '--page-index': idx }}
 >
 <div className="step-customize__page-header">
 <div className="step-customize__page-logo">SIAGA</div>
 <div className="step-customize__page-line" />
 </div>
 <div className="step-customize__page-content">
 <span className="step-customize__page-title">{page.title}</span>
 {pageImage ? (
 <img
 src={pageImage}
 alt={`Preview ${page.title}`}
 className="step-customize__page-image"
 loading="lazy"
 onError={(e) => { e.target.style.display = 'none'; }}
 />
 ) : page.id === 'table' ? (
 <div className="step-customize__page-table-mock">
 <div className="step-customize__page-table-row step-customize__page-table-row--header">
 <span>ID</span><span>Location</span><span>Severity</span>
 </div>
 <div className="step-customize__page-table-row"><span>FDG-001</span><span>Pier 3</span><span className="step-customize__sev--high">High</span></div>
 <div className="step-customize__page-table-row"><span>FDG-002</span><span>Cable</span><span className="step-customize__sev--med">Med</span></div>
 <div className="step-customize__page-table-row"><span>FDG-003</span><span>Joint</span><span className="step-customize__sev--low">Low</span></div>
 </div>
 ) : page.id === 'signature' ? (
 <div className="step-customize__page-sig-mock">
 <div className="step-customize__page-sig-badge">✓ Verified</div>
 <div className="step-customize__page-sig-line" />
 <span className="step-customize__page-sig-name">Pilot Digital Signature</span>
 </div>
 ) : (
 <div className="step-customize__page-placeholder" />
 )}
 </div>
 <div className="step-customize__page-footer">
 <span>Page {idx + 1}</span>
 </div>
 </div>
 );
 })
 )}
 </div>
 </div>
 </div>
 </div>
 );
}

export default StepCustomize;
