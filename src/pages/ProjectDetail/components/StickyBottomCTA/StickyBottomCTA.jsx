import './StickyBottomCTA.css';

export default function StickyBottomCTA({ heroCTA, onCTAClick }) {

 if (heroCTA.disabled || heroCTA.action === 'none') return null;

 return (
 <div className="pd-sticky-cta">
 <button className="pd-sticky-cta__btn" onClick={onCTAClick}>
 {heroCTA.label}
 </button>
 </div>
 );
}
