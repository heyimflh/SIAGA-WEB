import { CheckCircle2 } from 'lucide-react';

function MilestoneNode({ milestoneKey, label, icon: Icon, status, date, isLast }) {
 const statusClass = `milestone-node--${status}`;

 return (
 <li className={`milestone-node ${statusClass}`} data-milestone={milestoneKey}>
 {!isLast && (
 <div
 className={`milestone-node__connector milestone-node__connector--${status}`}
 aria-hidden="true"
 />
 )}

 <div className="milestone-node__circle" aria-hidden="true">
 {status === 'completed' ? (
 <CheckCircle2 size={20} className="milestone-node__icon milestone-node__icon--check" />
 ) : (
 <Icon size={18} className="milestone-node__icon" />
 )}
 </div>


 <div className="milestone-node__info">
 <span className="milestone-node__label">{label}</span>
 {date && <span className="milestone-node__date">{date}</span>}
 </div>
 </li>
 );
}

export default MilestoneNode;
