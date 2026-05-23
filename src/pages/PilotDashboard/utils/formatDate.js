const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const BULAN = [
 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export function formatIndonesianDate(date) {
 if (!(date instanceof Date) || isNaN(date.getTime())) return '';
 const hari = HARI[date.getDay()];
 const tanggal = date.getDate();
 const bulan = BULAN[date.getMonth()];
 const tahun = date.getFullYear();
 return `${hari}, ${tanggal} ${bulan} ${tahun}`;
}

export function getDeadlineCountdown(deadline, now = new Date()) {
 const deadlineDate = new Date(deadline);
 if (isNaN(deadlineDate.getTime())) return '';
 const diffMs = deadlineDate.getTime() - now.getTime();
 if (diffMs < 0) return 'Lewat deadline';
 const diffDays = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
 if (diffDays === 0) return 'Hari ini';
 if (diffDays === 1) return '1 hari lagi';
 return `${diffDays} hari lagi`;
}
