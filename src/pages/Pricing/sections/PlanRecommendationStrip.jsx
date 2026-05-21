import { Link } from 'react-router-dom';
import { planRecommendations } from '../data/pricing-data';
import './PlanRecommendationStrip.css';

export default function PlanRecommendationStrip() {
 return (
 <section className="prs">
 <div className="prs__container">
 <h2 className="prs__title">Pilih Paket Berdasarkan Kebutuhan Anda</h2>
 <div className="prs__grid">
 {planRecommendations.map((rec) => (
 <div key={rec.id} className="prs__card">
 <span className="prs__question">{rec.question}</span>
 <span className="prs__plan">→ {rec.plan}</span>
 <p className="prs__copy">{rec.copy}</p>
 <Link to={rec.cta.href} className="prs__cta">{rec.cta.text}</Link>
 </div>
 ))}
 </div>
 </div>
 </section>
 );
}
