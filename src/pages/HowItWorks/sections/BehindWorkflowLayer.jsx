import SupportingSectionHeader from '../../SupportingPages/SupportingSectionHeader';
import { trustLayerCards } from '../data/timeline-data';
import './BehindWorkflowLayer.css';

const iconMap = {
 Shield: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
 Lock: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
 Database: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
 FileText: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
};

export default function BehindWorkflowLayer() {
 return (
 <section className="bwl">
 <div className="bwl__container">
 <SupportingSectionHeader
 eyebrow="TRUST LAYER"
 title="Apa yang Terjadi di Balik SIAGA?"
 subtitle="Setiap langkah workflow didukung oleh lapisan keamanan, verifikasi, dan otomasi yang menjaga kualitas inspeksi."
 />

 <div className="bwl__grid">
 {trustLayerCards.map((card) => (
 <div key={card.id} className="bwl__card">
 <div className="bwl__card-icon">
 {iconMap[card.icon]}
 </div>
 <h3 className="bwl__card-title">{card.title}</h3>
 <p className="bwl__card-desc">{card.description}</p>
 </div>
 ))}
 </div>
 </div>
 </section>
 );
}
