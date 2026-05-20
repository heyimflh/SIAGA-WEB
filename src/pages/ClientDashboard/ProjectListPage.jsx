/**
 * ProjectListPage — Daftar semua proyek inspeksi client.
 *
 * Route: /dashboard/client/projects
 * Role: client only
 *
 * Menampilkan semua proyek dari project-detail-data dalam grid card
 * dengan cover image, status badge, dan overview singkat.
 * Klik card → navigasi ke /project/:projectId
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Wallet, Search, Filter } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { ROUTES } from '../../routes/appRoutes';
import { getProjectImage } from '../ProjectDetail/project-images.js';
import projectDetailData from '../ProjectDetail/project-detail-data.js';
import DashboardShell from './shell/DashboardShell';
import mockData from './mock-data.js';
import { selectCompanyByEmail } from './utils/selectors.js';
import './ProjectListPage.css';

const STATUS_MAP = {
  urgent: { label: 'Urgent', className: 'project-card__badge--urgent' },
  deadline_dekat: { label: 'Deadline Dekat', className: 'project-card__badge--warning' },
  open: { label: 'Open', className: 'project-card__badge--open' },
  closed: { label: 'Selesai', className: 'project-card__badge--closed' },
};

const INFRA_FILTERS = [
  'Semua',
  'SUTET',
  'Jembatan',
  'Kilang',
  'Solar Panel',
  'Bendungan',
  'Tower',
];

function formatRupiah(num) {
  if (!num) return '-';
  if (num >= 1000000000) return `Rp ${(num / 1000000000).toFixed(1)}M`;
  if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(0)}jt`;
  return `Rp ${num.toLocaleString('id-ID')}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ProjectListPage() {
  const { session } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');

  // Resolve company name from session email (same logic as ClientDashboardPage)
  const company = selectCompanyByEmail(mockData, session?.email);
  const companyName = company.nama || session?.email || 'Client';

  const filteredProjects = useMemo(() => {
    let result = [...projectDetailData];

    // Filter by infrastructure type
    if (activeFilter !== 'Semua') {
      result = result.filter((p) => p.jenis_infrastruktur === activeFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.nama.toLowerCase().includes(q) ||
          p.lokasi.kota.toLowerCase().includes(q) ||
          p.lokasi.provinsi.toLowerCase().includes(q) ||
          p.client_nama.toLowerCase().includes(q)
      );
    }

    return result;
  }, [searchQuery, activeFilter]);

  const stats = useMemo(() => {
    const total = projectDetailData.length;
    const aktif = projectDetailData.filter((p) => p.status !== 'closed').length;
    const selesai = projectDetailData.filter((p) => p.status === 'closed').length;
    return { total, aktif, selesai };
  }, []);

  return (
    <DashboardShell
      session={session}
      mockData={mockData}
      companyName={companyName}
      notifUnread={mockData.notifications.unread_count}
    >
      <div className="project-list">
        {/* Header */}
        <div className="project-list__header">
          <div className="project-list__header-text">
            <h1 className="project-list__title">Proyek Inspeksi</h1>
            <p className="project-list__subtitle">
              Kelola dan pantau seluruh proyek inspeksi aerial Anda
            </p>
          </div>
          <div className="project-list__stats">
            <div className="project-list__stat">
              <span className="project-list__stat-value">{stats.total}</span>
              <span className="project-list__stat-label">Total</span>
            </div>
            <div className="project-list__stat">
              <span className="project-list__stat-value project-list__stat-value--active">{stats.aktif}</span>
              <span className="project-list__stat-label">Aktif</span>
            </div>
            <div className="project-list__stat">
              <span className="project-list__stat-value project-list__stat-value--done">{stats.selesai}</span>
              <span className="project-list__stat-label">Selesai</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="project-list__toolbar">
          <div className="project-list__search">
            <Search size={18} className="project-list__search-icon" />
            <input
              type="text"
              placeholder="Cari proyek, lokasi, atau client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="project-list__search-input"
            />
          </div>
          <div className="project-list__filters">
            <Filter size={16} className="project-list__filter-icon" />
            {INFRA_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`project-list__filter-chip ${activeFilter === filter ? 'project-list__filter-chip--active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="project-list__results">
          Menampilkan {filteredProjects.length} dari {projectDetailData.length} proyek
        </p>

        {/* Project Grid */}
        <div className="project-list__grid">
          {filteredProjects.map((project) => {
            const image = getProjectImage(project.jenis_infrastruktur);
            const statusInfo = STATUS_MAP[project.status] || STATUS_MAP.open;

            return (
              <Link
                key={project.id}
                to={ROUTES.projectDetail(project.id)}
                className="project-card"
              >
                {/* Cover Image */}
                <div className="project-card__image">
                  <img src={image.src} alt={image.alt} loading="lazy" />
                  <div className="project-card__image-overlay" />
                  <span className={`project-card__badge ${statusInfo.className}`}>
                    {statusInfo.label}
                  </span>
                  <span className="project-card__type-tag">
                    {project.jenis_infrastruktur}
                  </span>
                </div>

                {/* Content */}
                <div className="project-card__content">
                  <h3 className="project-card__name">{project.nama}</h3>
                  <p className="project-card__desc">{project.deskripsi}</p>

                  <div className="project-card__meta">
                    <span className="project-card__meta-item">
                      <MapPin size={14} />
                      {project.lokasi.kota}, {project.lokasi.provinsi}
                    </span>
                    <span className="project-card__meta-item">
                      <Calendar size={14} />
                      {formatDate(project.deadline)}
                    </span>
                  </div>

                  <div className="project-card__footer">
                    <span className="project-card__budget">
                      <Wallet size={14} />
                      {formatRupiah(project.nilai_kontrak)}
                    </span>
                    <span className="project-card__bidders">
                      <Users size={14} />
                      {project.jumlah_bidder} bidder
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="project-list__empty">
            <Search size={48} />
            <h3>Tidak ada proyek ditemukan</h3>
            <p>Coba ubah filter atau kata kunci pencarian Anda</p>
            <button
              type="button"
              className="project-list__reset-btn"
              onClick={() => { setSearchQuery(''); setActiveFilter('Semua'); }}
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
