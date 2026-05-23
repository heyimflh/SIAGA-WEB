import { useState, useMemo, useCallback } from 'react';
import {
 Star,
 ShieldCheck,
 Clock,
 Wallet,
 ArrowUpDown,
 ChevronDown,
 Search,
 Gavel,
 Users,
 TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { mockData } from './mock-data.js';
import { selectCompanyByEmail } from './utils/selectors.js';
import DashboardShell from './shell/DashboardShell';
import './BiddingPage.css';

function formatRupiah(num) {
 if (!num) return '-';
 if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(1)}jt`;
 return `Rp ${num.toLocaleString('id-ID')}`;
}

const SORT_OPTIONS = [
 { value: 'rating-desc', label: 'Rating Tertinggi' },
 { value: 'harga-asc', label: 'Harga Terendah' },
 { value: 'harga-desc', label: 'Harga Tertinggi' },
 { value: 'estimasi-asc', label: 'Tercepat' },
];

export default function BiddingPage() {
 const { session } = useAuth();
 const company = selectCompanyByEmail(mockData, session?.email);
 const companyName = company.nama || session?.email || 'Client';

 const projects = mockData.proyek_aktif;
 const allBids = mockData.bids;

 const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || null);
 const [sortBy, setSortBy] = useState('rating-desc');
 const [verifiedOnly, setVerifiedOnly] = useState(false);
 const [minRating4, setMinRating4] = useState(false);
 const [searchQuery, setSearchQuery] = useState('');
 const [expandedBid, setExpandedBid] = useState(null);

 const filteredBids = useMemo(() => {
 let result = allBids.filter((b) => b.project_id === selectedProjectId);

 result = result.filter((b) => b.rating >= 2);

 if (verifiedOnly) {
 result = result.filter((b) => b.siaga_verified);
 }
 if (minRating4) {
 result = result.filter((b) => b.rating >= 4.0);
 }
 if (searchQuery.trim()) {
 const q = searchQuery.toLowerCase();
 result = result.filter(
 (b) =>
 b.pilot_nama.toLowerCase().includes(q) ||
 b.drone_type.toLowerCase().includes(q)
 );
 }

 switch (sortBy) {
 case 'rating-desc':
 result.sort((a, b) => b.rating - a.rating);
 break;
 case 'harga-asc':
 result.sort((a, b) => a.harga - b.harga);
 break;
 case 'harga-desc':
 result.sort((a, b) => b.harga - a.harga);
 break;
 case 'estimasi-asc':
 result.sort((a, b) => a.estimasi_hari - b.estimasi_hari);
 break;
 default:
 break;
 }

 return result;
 }, [allBids, selectedProjectId, sortBy, verifiedOnly, minRating4, searchQuery]);

 const stats = useMemo(() => {
 const projectBids = allBids.filter((b) => b.project_id === selectedProjectId && b.rating >= 2);
 const totalBids = projectBids.length;
 const avgPrice = totalBids > 0
 ? projectBids.reduce((sum, b) => sum + b.harga, 0) / totalBids
 : 0;
 const verifiedCount = projectBids.filter((b) => b.siaga_verified).length;
 const avgRating = totalBids > 0
 ? (projectBids.reduce((sum, b) => sum + b.rating, 0) / totalBids).toFixed(1)
 : '0';
 return { totalBids, avgPrice, verifiedCount, avgRating };
 }, [allBids, selectedProjectId]);

 const handleToggleExpand = useCallback((pilotId) => {
 setExpandedBid((prev) => (prev === pilotId ? null : pilotId));
 }, []);

 return (
 <DashboardShell
 session={session}
 mockData={mockData}
 companyName={companyName}
 notifUnread={mockData.notifications.unread_count}
 >
 <div className="bidding-page">
 <div className="bidding-page__header">
 <div className="bidding-page__header-text">
 <h1 className="bidding-page__title">
 <Gavel size={22} />
 Review Penawaran
 </h1>
 <p className="bidding-page__subtitle">
 Bandingkan dan pilih pilot terbaik untuk proyek inspeksi Anda
 </p>
 </div>
 <div className="bidding-page__stats">
 <div className="bidding-stat">
 <Users size={16} className="bidding-stat__icon" />
 <div className="bidding-stat__info">
 <span className="bidding-stat__value">{stats.totalBids}</span>
 <span className="bidding-stat__label">Penawaran</span>
 </div>
 </div>
 <div className="bidding-stat">
 <Wallet size={16} className="bidding-stat__icon" />
 <div className="bidding-stat__info">
 <span className="bidding-stat__value">{formatRupiah(stats.avgPrice)}</span>
 <span className="bidding-stat__label">Rata-rata</span>
 </div>
 </div>
 <div className="bidding-stat">
 <ShieldCheck size={16} className="bidding-stat__icon bidding-stat__icon--verified" />
 <div className="bidding-stat__info">
 <span className="bidding-stat__value">{stats.verifiedCount}</span>
 <span className="bidding-stat__label">Verified</span>
 </div>
 </div>
 <div className="bidding-stat">
 <TrendingUp size={16} className="bidding-stat__icon bidding-stat__icon--rating" />
 <div className="bidding-stat__info">
 <span className="bidding-stat__value">{stats.avgRating}</span>
 <span className="bidding-stat__label">Avg Rating</span>
 </div>
 </div>
 </div>
 </div>

 <div className="bidding-page__tabs">
 {projects.map((project) => (
 <button
 key={project.id}
 type="button"
 className={`bidding-tab ${selectedProjectId === project.id ? 'bidding-tab--active' : ''}`}
 onClick={() => setSelectedProjectId(project.id)}
 >
 <span className="bidding-tab__name">{project.nama}</span>
 <span className="bidding-tab__count">
 {allBids.filter((b) => b.project_id === project.id && b.rating >= 2).length}
 </span>
 </button>
 ))}
 </div>

 <div className="bidding-page__toolbar">
 <div className="bidding-page__search">
 <Search size={16} />
 <input
 type="text"
 placeholder="Cari pilot atau drone..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 />
 </div>

 <div className="bidding-page__filters">
 <button
 type="button"
 className={`bidding-chip ${verifiedOnly ? 'bidding-chip--active' : ''}`}
 onClick={() => setVerifiedOnly(!verifiedOnly)}
 >
 <ShieldCheck size={13} />
 Verified Only
 </button>
 <button
 type="button"
 className={`bidding-chip ${minRating4 ? 'bidding-chip--active' : ''}`}
 onClick={() => setMinRating4(!minRating4)}
 >
 <Star size={13} />
 Rating 4+
 </button>
 </div>

 <div className="bidding-page__sort">
 <ArrowUpDown size={14} />
 <select
 value={sortBy}
 onChange={(e) => setSortBy(e.target.value)}
 className="bidding-sort-select"
 >
 {SORT_OPTIONS.map((opt) => (
 <option key={opt.value} value={opt.value}>{opt.label}</option>
 ))}
 </select>
 <ChevronDown size={14} className="bidding-sort-chevron" />
 </div>
 </div>

 <p className="bidding-page__results">
 {filteredBids.length} penawaran ditemukan
 </p>


 <div className="bidding-page__list">
 {filteredBids.map((bid) => (
 <div
 key={bid.pilot_id}
 className={`bid-card ${expandedBid === bid.pilot_id ? 'bid-card--expanded' : ''}`}
 >
 <div
 className="bid-card__main"
 onClick={() => handleToggleExpand(bid.pilot_id)}
 role="button"
 tabIndex={0}
 onKeyDown={(e) => { if (e.key === 'Enter') handleToggleExpand(bid.pilot_id); }}
 >

 <div className="bid-card__avatar">
 <img src={bid.pilot_avatar} alt={bid.pilot_nama} />
 {bid.siaga_verified && (
 <span className="bid-card__verified-badge" title="SIAGA Verified">
 <ShieldCheck size={12} />
 </span>
 )}
 </div>

 <div className="bid-card__info">
 <div className="bid-card__name-row">
 <span className="bid-card__name">{bid.pilot_nama}</span>
 <span className="bid-card__rating">
 <Star size={12} fill="#F59E0B" stroke="#F59E0B" />
 {bid.rating.toFixed(1)}
 </span>
 </div>
 <span className="bid-card__drone">{bid.drone_type}</span>
 </div>

 <div className="bid-card__price">
 <span className="bid-card__price-value">{formatRupiah(bid.harga)}</span>
 <span className="bid-card__price-label">Penawaran</span>
 </div>


 <div className="bid-card__duration">
 <Clock size={14} />
 <span>{bid.estimasi_hari} hari</span>
 </div>
 </div>


 {expandedBid === bid.pilot_id && (
 <div className="bid-card__detail">
 <div className="bid-card__detail-section">
 <span className="bid-card__detail-label">Portfolio</span>
 <div className="bid-card__portfolio">
 {bid.portfolio_thumbs.map((thumb, i) => (
 <img key={i} src={thumb} alt={`Portfolio ${i + 1}`} />
 ))}
 </div>
 </div>
 <div className="bid-card__detail-grid">
 <div className="bid-card__detail-item">
 <span className="bid-card__detail-item-label">Drone</span>
 <span className="bid-card__detail-item-value">{bid.drone_type}</span>
 </div>
 <div className="bid-card__detail-item">
 <span className="bid-card__detail-item-label">Estimasi</span>
 <span className="bid-card__detail-item-value">{bid.estimasi_hari} hari kerja</span>
 </div>
 <div className="bid-card__detail-item">
 <span className="bid-card__detail-item-label">Status</span>
 <span className="bid-card__detail-item-value">
 {bid.siaga_verified ? '✓ SIAGA Verified' : 'Belum Verified'}
 </span>
 </div>
 </div>
 <button type="button" className="bid-card__select-btn">
 Pilih Pilot Ini
 </button>
 </div>
 )}
 </div>
 ))}
 </div>

 {filteredBids.length === 0 && (
 <div className="bidding-page__empty">
 <Gavel size={48} />
 <h3>Tidak ada penawaran</h3>
 <p>Coba ubah filter atau pilih proyek lain</p>
 </div>
 )}
 </div>
 </DashboardShell>
 );
}
