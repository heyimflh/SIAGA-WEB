import { useNavigate } from 'react-router-dom';
import { MapPin, Building2 } from 'lucide-react';
import { getStatusBadgeVisual, formatCompactRupiah } from '../../project-logic.js';
import './RelatedProjects.css';

export default function RelatedProjects({ projects }) {
  const navigate = useNavigate();

  if (!projects || projects.length === 0) return null;

  return (
    <div className="pd-related">
      <h2 className="pd-related__title">Related Missions</h2>
      <p className="pd-related__subtitle">Proyek terkait yang mungkin menarik untuk Anda.</p>

      <div className="pd-related__grid">
        {projects.map((p) => {
          const badge = getStatusBadgeVisual(p.status);
          return (
            <div
              key={p.id}
              className="pd-related__card"
              onClick={() => navigate(`/project/${p.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/project/${p.id}`); }}
            >
              <div className="pd-related__card-header">
                <span className="pd-related__badge" style={{ '--badge-color': badge.color }}>{badge.label}</span>
                <span className="pd-related__infra"><Building2 size={12} /> {p.jenis_infrastruktur}</span>
              </div>
              <h4 className="pd-related__card-title">{p.nama}</h4>
              <div className="pd-related__card-meta">
                <span><MapPin size={13} /> {p.lokasi.kota}, {p.lokasi.provinsi}</span>
                <span className="pd-related__card-price">{formatCompactRupiah(p.nilai_kontrak)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
