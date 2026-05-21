import './ClosingSection.css';

function ClosingSection({ children }) {
 return (
 <div className="closing-section">
 {/* Shared aurora glow across CTA + Footer */}
 <div className="closing-section__aurora" aria-hidden="true" />
 {/* Noise texture */}
 <div className="closing-section__noise" aria-hidden="true" />
 {/* Top highlight edge */}
 <div className="closing-section__highlight" aria-hidden="true" />
 {children}
 </div>
 );
}

export default ClosingSection;
