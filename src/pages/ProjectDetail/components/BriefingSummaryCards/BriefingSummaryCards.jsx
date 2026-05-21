import { Calendar, Map, Target, Users, Banknote } from 'lucide-react';
import { getBriefingSummary } from '../../project-logic.js';
import './BriefingSummaryCards.css';

const iconMap = {
 calendar: Calendar,
 map: Map,
 target: Target,
 users: Users,
 banknote: Banknote,
};

export default function BriefingSummaryCards({ project, role }) {
 const items = getBriefingSummary(project, role);

 return (
 <div className="pd-summary-cards">
 {items.map((item) => {
 const Icon = iconMap[item.icon] || Target;
 return (
 <div key={item.id} className="pd-summary-card">
 <div className="pd-summary-card__icon">
 <Icon size={20} />
 </div>
 <div className="pd-summary-card__content">
 <span className="pd-summary-card__label">{item.label}</span>
 <span className="pd-summary-card__value">{item.value}</span>
 </div>
 </div>
 );
 })}
 </div>
 );
}
