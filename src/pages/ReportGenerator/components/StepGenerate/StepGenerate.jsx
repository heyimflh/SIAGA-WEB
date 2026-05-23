import { useState, useRef } from 'react';
import { Zap, FileText, Layers, Monitor } from 'lucide-react';
import './StepGenerate.css';

function StepGenerate({ project, previewPages, totalPages, onBack, onGenerate, ariaLabel }) {
 const [isClicked, setIsClicked] = useState(false);
 const debounceRef = useRef(null);

 const handleClick = () => {
 if (isClicked) return;
 setIsClicked(true);
 debounceRef.current = setTimeout(() => setIsClicked(false), 1000);
 onGenerate();
 };

 const summaryItems = [
 { icon: FileText, label: 'Project', value: project?.nama || 'N/A' },
 { icon: Layers, label: 'Sections', value: `${previewPages.length} selected` },
 { icon: FileText, label: 'Pages', value: `${totalPages} halaman` },
 { icon: Monitor, label: 'Output', value: 'PDF' },
 { icon: Zap, label: 'Status', value: 'Ready to Generate' },
 ];

 return (
 <div className="step-generate">
 <div className="step-generate__header">
 <span className="step-generate__step-label">STEP 03</span>
 <h2 className="step-generate__title">Generate Report</h2>
 </div>


 <div className="step-generate__summary">
 {summaryItems.map((item) => (
 <div key={item.label} className="step-generate__pill">
 <item.icon size={14} className="step-generate__pill-icon" />
 <span className="step-generate__pill-label">{item.label}:</span>
 <span className="step-generate__pill-value">{item.value}</span>
 </div>
 ))}
 </div>

 <div className="step-generate__button-area">
 <button
 className="step-generate__big-button"
 onClick={handleClick}
 disabled={isClicked}
 aria-label={ariaLabel}
 type="button"
 >
 <span className="step-generate__big-button-pulse" />
 <Zap size={24} className="step-generate__big-button-icon" />
 <span className="step-generate__big-button-text">
 SIAGA: Generate Inspection Report
 </span>
 </button>
 <p className="step-generate__hint">
 Laporan akan di-generate dalam hitungan detik.
 </p>
 </div>

 <div className="step-generate__nav">
 <button className="step-generate__btn-back" onClick={onBack} type="button">
 ← Kembali
 </button>
 </div>
 </div>
 );
}

export default StepGenerate;
