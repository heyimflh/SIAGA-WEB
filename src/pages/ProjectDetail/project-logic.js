export function getProjectById(projects, projectId) {
 if (!projects || !projectId) return null;
 return projects.find((p) => p.id === projectId) || null;
}

export function getProjectStatus(project, today = new Date()) {
 if (!project) return 'unknown';
 const { status, deadline } = project;
 if (status === 'open' && isDeadlinePassed(deadline, today)) {
 return 'expired';
 }
 return status;
}

export function isDeadlinePassed(deadline, today = new Date()) {
 if (!deadline) return false;
 const d = new Date(deadline);
 d.setHours(23, 59, 59, 999);
 return today > d;
}

export function getStatusBadgeVisual(status) {
 const map = {
 open: { label: 'Open', color: '#00D2FF', cssClass: 'badge-open' },
 urgent: { label: 'Urgent', color: '#FF4C4C', cssClass: 'badge-urgent' },
 deadline_dekat: { label: 'Deadline Dekat', color: '#F5B740', cssClass: 'badge-deadline' },
 in_progress: { label: 'In Progress', color: '#00D2FF', cssClass: 'badge-progress' },
 completed: { label: 'Completed', color: '#00C48C', cssClass: 'badge-completed' },
 closed: { label: 'Closed', color: '#8AA0B8', cssClass: 'badge-closed' },
 expired: { label: 'Expired', color: '#8AA0B8', cssClass: 'badge-expired' },
 };
 if (Object.prototype.hasOwnProperty.call(map, status)) {
 return map[status];
 }
 return { label: status || 'Unknown', color: '#8AA0B8', cssClass: 'badge-unknown' };
}

export function getRoleVisibility(role, projectStatus, hasBid) {
 const isOpen = ['open', 'urgent', 'deadline_dekat'].includes(projectStatus);
 const isClosed = ['closed', 'completed', 'expired'].includes(projectStatus);

 if (role === 'client') {
 return {
 showContractValue: true,
 showBidTable: isOpen || projectStatus === 'in_progress',
 showBidForm: false,
 showClientInfo: false,
 showRelatedProjects: false,
 showBidCommandPanel: false,
 showBidIntelligencePanel: !isClosed,
 biddingClosed: isClosed,
 };
 }

 return {
 showContractValue: false,
 showBidTable: false,
 showBidForm: isOpen && !hasBid,
 showClientInfo: true,
 showRelatedProjects: true,
 showBidCommandPanel: true,
 showBidIntelligencePanel: false,
 biddingClosed: isClosed,
 };
}

export function getHeroCTA(role, projectStatus, hasBid) {
 const isClosed = ['closed', 'completed', 'expired'].includes(projectStatus);

 if (role === 'client') {
 if (projectStatus === 'completed') {
 return { label: 'Generate Report', action: 'report', disabled: false };
 }
 if (isClosed) {
 return { label: 'Bidding Selesai', action: 'none', disabled: true };
 }
 return { label: 'Lihat Bidding', action: 'scroll-bidding', disabled: false };
 }

 if (hasBid) {
 return { label: 'Bid Terkirim ✓', action: 'none', disabled: true };
 }
 if (isClosed) {
 return { label: 'Bidding Ditutup', action: 'none', disabled: true };
 }
 return { label: 'Bid Sekarang', action: 'scroll-bidding', disabled: false };
}

export function getDashboardPath(role) {
 if (role === 'client') return '/dashboard/client';
 if (role === 'pilot') return '/dashboard/pilot';
 return '/';
}

export function validateBidForm(formData) {
 const errors = {};
 if (!formData.harga || Number(formData.harga) <= 0) {
 errors.harga = 'Harga penawaran wajib diisi';
 }
 if (!formData.estimasiHari || Number(formData.estimasiHari) <= 0) {
 errors.estimasiHari = 'Estimasi hari wajib diisi';
 }
 return {
 valid: Object.keys(errors).length === 0,
 errors,
 };
}

export function getRelatedProjects(currentProject, allProjects) {
 if (!currentProject || !allProjects) return [];
 const others = allProjects.filter((p) => p.id !== currentProject.id);

 const sameInfra = others.filter(
 (p) => p.jenis_infrastruktur === currentProject.jenis_infrastruktur
 );
 const sameProvince = others.filter(
 (p) =>
 p.lokasi.provinsi === currentProject.lokasi.provinsi &&
 p.jenis_infrastruktur !== currentProject.jenis_infrastruktur
 );

 const combined = [...sameInfra, ...sameProvince];

 const seen = new Set();
 const unique = combined.filter((p) => {
 if (seen.has(p.id)) return false;
 seen.add(p.id);
 return true;
 });

 return unique.slice(0, 3);
}

export function formatTanggalIndonesia(dateString) {
 if (!dateString) return '-';
 const months = [
 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
 ];
 const d = new Date(dateString);
 if (isNaN(d.getTime())) return '-';
 return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatRupiah(value) {
 if (value == null || isNaN(value)) return '-';
 return `Rp${Number(value).toLocaleString('id-ID')}`;
}

export function formatCompactRupiah(value) {
 if (value == null || isNaN(value)) return '-';
 const num = Number(value);
 if (num >= 1000000000) {
 return `Rp${(num / 1000000000).toFixed(1)}M`;
 }
 if (num >= 1000000) {
 return `Rp${Math.round(num / 1000000)}jt`;
 }
 return formatRupiah(num);
}

export function getBriefingSummary(project, role) {
 if (!project) return [];
 const items = [
 { id: 'deadline', label: 'Deadline', value: formatTanggalIndonesia(project.deadline), icon: 'calendar' },
 { id: 'area', label: 'Luas Area', value: project.luas_area ? `${project.luas_area} km²` : '-', icon: 'map' },
 { id: 'points', label: 'Titik Inspeksi', value: `${project.jumlah_titik_inspeksi || 0} titik`, icon: 'target' },
 { id: 'bidders', label: 'Jumlah Bidder', value: `${project.jumlah_bidder || 0} pilot`, icon: 'users' },
 ];
 if (role === 'client') {
 items.push({
 id: 'contract', label: 'Nilai Kontrak', value: formatCompactRupiah(project.nilai_kontrak), icon: 'banknote',
 });
 }
 return items;
}

export function getBidIntelligenceMetrics(project) {
 if (!project || !project.bids || project.bids.length === 0) {
 return { total: 0, verified: 0, lowestPrice: 0, fastestDays: 0, highestRating: 0 };
 }
 const bids = project.bids;
 const verified = bids.filter((b) => b.pilot_verified).length;
 const lowestPrice = Math.min(...bids.map((b) => b.harga_bid));
 const fastestDays = Math.min(...bids.map((b) => b.estimasi_hari));
 const highestRating = Math.max(...bids.map((b) => b.pilot_rating));

 return {
 total: bids.length,
 verified,
 lowestPrice,
 fastestDays,
 highestRating,
 };
}

export function isMilestoneConsistent(projectStatus, milestones) {
 if (!milestones || milestones.length === 0) return true;
 if (projectStatus === 'in_progress') {
 return milestones.some((m) => m.status === 'in_progress');
 }
 if (projectStatus === 'completed') {
 return milestones.every((m) => m.status === 'completed');
 }
 return true;
}
