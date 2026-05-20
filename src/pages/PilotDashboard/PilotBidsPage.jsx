/**
 * PilotBidsPage — Full page view for route `/dashboard/pilot/bids`.
 *
 * Displays all pilot bids with status filtering and detailed bid cards.
 * Feature: pilot-dashboard
 */

import { useState, useMemo } from 'react';
import { mockData } from './mock-data.js';
import PilotDashboardShell from './shell/PilotDashboardShell.jsx';
import {
  Gavel,
  MapPin,
  Calendar,
  Clock,
  Filter,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import './PilotBidsPage.css';

const STATUS_CONFIG = {
  pending: { label: 'Pending', icon: AlertCircle, className: 'bid-status--pending' },
  diterima: { label: 'Diterima', icon: CheckCircle2, className: 'bid-status--accepted' },
  ditolak: { label: 'Ditolak', icon: XCircle, className: 'bid-status--rejected' },
};

const FILTER_OPTIONS = [
  { value: 'all', label: 'Semua' },
  { value: 'pending', label: 'Pending' },
  { value: 'diterima', label: 'Diterima' },
  { value: 'ditolak', label: 'Ditolak' },
];

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

function PilotBidsPage() {
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredBids = useMemo(() => {
    if (statusFilter === 'all') return mockData.bids;
    return mockData.bids.filter((bid) => bid.status === statusFilter);
  }, [statusFilter]);

  const stats = useMemo(() => ({
    total: mockData.bids.length,
    pending: mockData.bids.filter((b) => b.status === 'pending').length,
    diterima: mockData.bids.filter((b) => b.status === 'diterima').length,
    ditolak: mockData.bids.filter((b) => b.status === 'ditolak').length,
  }), []);

  return (
    <div className="pilot-bids-page">
      <PilotDashboardShell
        pilotProfile={mockData.pilot_profile}
        notifUnread={mockData.notifications.unread_count}
        activeMissionCount={mockData.proyek_berjalan.length}
      >
        {/* Page Header */}
        <div className="bids-page__header">
          <div className="bids-page__title-row">
            <Gavel size={28} className="bids-page__icon" />
            <div>
              <h1 className="bids-page__title">Bid Saya</h1>
              <p className="bids-page__subtitle">Kelola semua penawaran proyek inspeksi drone</p>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="bids-page__stats">
          <div className="bids-stat-card">
            <span className="bids-stat-card__value">{stats.total}</span>
            <span className="bids-stat-card__label">Total Bid</span>
          </div>
          <div className="bids-stat-card bids-stat-card--pending">
            <span className="bids-stat-card__value">{stats.pending}</span>
            <span className="bids-stat-card__label">Pending</span>
          </div>
          <div className="bids-stat-card bids-stat-card--accepted">
            <span className="bids-stat-card__value">{stats.diterima}</span>
            <span className="bids-stat-card__label">Diterima</span>
          </div>
          <div className="bids-stat-card bids-stat-card--rejected">
            <span className="bids-stat-card__value">{stats.ditolak}</span>
            <span className="bids-stat-card__label">Ditolak</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bids-page__filter-bar">
          <Filter size={18} className="bids-page__filter-icon" />
          <span className="bids-page__filter-label">Filter:</span>
          <div className="bids-page__filter-buttons">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`bids-filter-btn ${statusFilter === opt.value ? 'bids-filter-btn--active' : ''}`}
                onClick={() => setStatusFilter(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bids List */}
        <div className="bids-page__list">
          {filteredBids.length === 0 ? (
            <div className="bids-page__empty">
              <Gavel size={48} />
              <p>Tidak ada bid dengan status ini</p>
            </div>
          ) : (
            filteredBids.map((bid) => {
              const statusConf = STATUS_CONFIG[bid.status];
              const StatusIcon = statusConf.icon;
              return (
                <div key={bid.id} className="bid-card">
                  <div className="bid-card__header">
                    <h3 className="bid-card__project-name">{bid.nama_proyek}</h3>
                    <span className={`bid-status ${statusConf.className}`}>
                      <StatusIcon size={14} />
                      {statusConf.label}
                    </span>
                  </div>
                  <div className="bid-card__meta">
                    <span className="bid-card__meta-item">
                      <MapPin size={14} />
                      {bid.lokasi}
                    </span>
                    <span className="bid-card__meta-item">
                      <Calendar size={14} />
                      {bid.tanggal_submit}
                    </span>
                    <span className="bid-card__meta-item bid-card__meta-item--type">
                      {bid.jenis_infrastruktur}
                    </span>
                  </div>
                  <div className="bid-card__footer">
                    <div className="bid-card__amount">
                      <TrendingUp size={16} />
                      <span className="bid-card__amount-value">{formatCurrency(bid.harga_bid)}</span>
                    </div>
                    <div className="bid-card__duration">
                      <Clock size={14} />
                      <span>{bid.estimasi_hari} hari</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </PilotDashboardShell>
    </div>
  );
}

export default PilotBidsPage;
