import './ClosingSection.css';

function ClosingSection({ children }) {
 return (
 <div className="closing-section">
 <div className="closing-section__aurora" aria-hidden="true" />
 <div className="closing-section__noise" aria-hidden="true" />
 <div className="closing-section__highlight" aria-hidden="true" />
 {children}
 </div>
 );
}

export default ClosingSection;
