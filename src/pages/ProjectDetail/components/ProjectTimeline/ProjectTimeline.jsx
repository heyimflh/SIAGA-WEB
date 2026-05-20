import { Check, Circle, Clock } from 'lucide-react';
import { formatTanggalIndonesia } from '../../project-logic.js';
import './ProjectTimeline.css';

export default function ProjectTimeline({ milestones }) {
  if (!milestones || milestones.length === 0) return null;

  const getIcon = (status) => {
    if (status === 'completed') return <Check size={16} />;
    if (status === 'in_progress') return <Clock size={16} />;
    return <Circle size={16} />;
  };

  return (
    <div className="pd-timeline" aria-label="Project timeline">
      <h2 className="pd-timeline__title">Project Timeline</h2>
      <p className="pd-timeline__subtitle">Lacak progres proyek inspeksi dari publikasi hingga laporan siap.</p>

      <div className="pd-timeline__track">
        {milestones.map((m, i) => (
          <div key={i} className={`pd-timeline__item pd-timeline__item--${m.status}`}>
            <div className="pd-timeline__icon">{getIcon(m.status)}</div>
            <div className="pd-timeline__label">{m.label}</div>
            <div className="pd-timeline__date">{m.date ? formatTanggalIndonesia(m.date) : '-'}</div>
            {i < milestones.length - 1 && <div className="pd-timeline__connector" />}
          </div>
        ))}
      </div>
    </div>
  );
}
