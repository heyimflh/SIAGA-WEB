export function resetFilters() {
 return {
 chips: [],
 valueRange: [0, 2500000000],
 location: null,
 statusFilter: 'open',
 };
}

export function getActiveFilterCount(filters) {
 let count = 0;
 if (filters.chips.length > 0) count++;
 if (filters.valueRange[0] > 0 || filters.valueRange[1] < 2500000000) count++;
 if (filters.location) count++;
 if (filters.statusFilter !== 'open') count++;
 return count;
}

export function matchesInfrastructure(project, activeChips) {
 if (!activeChips || activeChips.length === 0) return true;
 return activeChips.includes(project.jenis_infrastruktur);
}

export function isWithinRange(project, range) {
 if (!range) return true;
 const [min, max] = range;
 return project.nilai_kontrak >= min && project.nilai_kontrak <= max;
}

export function matchesLocation(project, location) {
 if (!location) return true;
 const loc = location.toLowerCase();
 return (
 project.lokasi.kota.toLowerCase().includes(loc) ||
 project.lokasi.provinsi.toLowerCase().includes(loc)
 );
}

export function matchesStatus(project, statusFilter) {
 if (statusFilter === 'all') return true;

 return project.status !== 'closed';
}

export function applyFilters(projects, filters) {
 if (!projects || !filters) return projects || [];
 return projects.filter(project =>
 matchesInfrastructure(project, filters.chips) &&
 isWithinRange(project, filters.valueRange) &&
 matchesLocation(project, filters.location) &&
 matchesStatus(project, filters.statusFilter)
 );
}

export function sortProjects(projects, sortBy) {
 if (!projects) return [];
 const sorted = [...projects];

 switch (sortBy) {
 case 'nilai_tertinggi':
 sorted.sort((a, b) => b.nilai_kontrak - a.nilai_kontrak);
 break;
 case 'deadline_terdekat':
 sorted.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
 break;
 case 'terbaru':
 default:
 sorted.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
 break;
 }

 return sorted;
}

export function computeStats(projects) {
 if (!projects) return { aktif: 0, open: 0, urgent: 0 };
 const aktif = projects.filter(p => p.status !== 'closed').length;
 const open = projects.filter(p => p.status === 'open').length;
 const urgent = projects.filter(p => p.status === 'urgent').length;
 return { aktif, open, urgent };
}

export function getLocationSuggestions(projects) {
 if (!projects) return [];
 const locations = new Set();
 projects.forEach(p => {
 if (p.lokasi?.kota) locations.add(p.lokasi.kota);
 if (p.lokasi?.provinsi) locations.add(p.lokasi.provinsi);
 });
 return [...locations].sort();
}

export function formatRupiah(value) {
 if (typeof value !== 'number' || isNaN(value)) return 'Rp 0';
 if (value < 0) return 'Rp 0';
 return 'Rp ' + value.toLocaleString('id-ID');
}

export function formatCompactRupiah(value) {
 if (typeof value !== 'number' || isNaN(value)) return 'Rp 0';
 if (value < 0) return 'Rp 0';

 if (value >= 1000000000) {
 const m = value / 1000000000;
 if (m === Math.floor(m)) {
 return `Rp ${Math.floor(m)} M`;
 }
 return `Rp ${m.toFixed(1).replace('.', ',')} M`;
 }

 if (value >= 1000000) {
 const jt = value / 1000000;
 if (jt === Math.floor(jt)) {
 return `Rp ${Math.floor(jt)} jt`;
 }
 return `Rp ${jt.toFixed(0)} jt`;
 }

 if (value >= 1000) {
 return `Rp ${Math.floor(value / 1000)} rb`;
 }

 return `Rp ${value}`;
}

export function getStatusVisual(status) {
 switch (status) {
 case 'open':
 return {
 color: '#00D2FF',
 pulse: true,
 opacity: 1,
 pulseSpeed: '2s',
 label: 'Open',
 };
 case 'urgent':
 return {
 color: '#FF4C4C',
 pulse: true,
 opacity: 1,
 pulseSpeed: '1.2s',
 label: 'Urgent',
 };
 case 'deadline_dekat':
 return {
 color: '#F5B740',
 pulse: false,
 opacity: 1,
 pulseSpeed: null,
 label: 'Deadline Dekat',
 };
 case 'closed':
 return {
 color: '#8BA3BE',
 pulse: false,
 opacity: 0.6,
 pulseSpeed: null,
 label: 'Closed',
 };
 default:
 return {
 color: '#8BA3BE',
 pulse: false,
 opacity: 0.6,
 pulseSpeed: null,
 label: 'Unknown',
 };
 }
}
