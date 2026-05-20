import { useNavigate } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import './NotFoundState.css';

export default function NotFoundState({ dashboardPath }) {
  const navigate = useNavigate();

  return (
    <div className="pd-not-found">
      <div className="pd-not-found__card">
        <SearchX size={48} className="pd-not-found__icon" />
        <h2 className="pd-not-found__title">Proyek tidak ditemukan</h2>
        <p className="pd-not-found__desc">Proyek yang Anda cari tidak tersedia atau telah dihapus.</p>
        <button className="pd-not-found__btn" onClick={() => navigate(dashboardPath)}>
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}
