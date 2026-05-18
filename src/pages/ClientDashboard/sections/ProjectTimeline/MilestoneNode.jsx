/**
 * MilestoneNode — satu node milestone pada timeline horizontal.
 *
 * Spec: .kiro/specs/client-dashboard
 * Validates: Requirements 6.5, 6.6, 6.7, 6.8, 6.9, 6.10
 *
 * Props:
 *   - milestoneKey: string (key milestone, e.g. 'posted')
 *   - label: string (display label)
 *   - icon: React component (Lucide icon)
 *   - status: 'completed' | 'in_progress' | 'upcoming'
 *   - date: string (tanggal milestone)
 *   - isLast: boolean (apakah milestone terakhir, untuk hide connector)
 */

import { CheckCircle2 } from 'lucide-react';

/**
 * @param {{
 *   milestoneKey: string,
 *   label: string,
 *   icon: import('lucide-react').LucideIcon,
 *   status: 'completed' | 'in_progress' | 'upcoming',
 *   date: string,
 *   isLast: boolean
 * }} props
 */
function MilestoneNode({ milestoneKey, label, icon: Icon, status, date, isLast }) {
  const statusClass = `milestone-node--${status}`;

  return (
    <li className={`milestone-node ${statusClass}`} data-milestone={milestoneKey}>
      {/* Connector line (progress bar between nodes) */}
      {!isLast && (
        <div
          className={`milestone-node__connector milestone-node__connector--${status}`}
          aria-hidden="true"
        />
      )}

      {/* Node circle with icon */}
      <div className="milestone-node__circle" aria-hidden="true">
        {status === 'completed' ? (
          <CheckCircle2 size={20} className="milestone-node__icon milestone-node__icon--check" />
        ) : (
          <Icon size={18} className="milestone-node__icon" />
        )}
      </div>

      {/* Label and date */}
      <div className="milestone-node__info">
        <span className="milestone-node__label">{label}</span>
        {date && <span className="milestone-node__date">{date}</span>}
      </div>
    </li>
  );
}

export default MilestoneNode;
