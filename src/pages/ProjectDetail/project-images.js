/**
 * Project Image Mapping
 * Maps infrastructure types to relevant images from public/images/services-categories.
 * Each project gets a contextual image based on its jenis_infrastruktur.
 *
 * Feature: project-detail-page
 */

const infraImageMap = {
  SUTET: {
    src: '/images/services-categories/Tower_SUTET___Transmisi_300kb.jpg',
    alt: 'Inspeksi tower SUTET dan jalur transmisi listrik',
    caption: 'Inspeksi Jalur Transmisi',
  },
  Jembatan: {
    src: '/images/services-categories/Jembatan___Jalan_Tol_300kb.jpg',
    alt: 'Survey struktural jembatan menggunakan drone',
    caption: 'Survey Struktural Jembatan',
  },
  Kilang: {
    src: '/images/services-categories/Pipa_Migas___Kilang_300kb.jpg',
    alt: 'Monitoring kilang dan fasilitas migas',
    caption: 'Monitoring Fasilitas Migas',
  },
  'Solar Panel': {
    src: '/images/services-categories/Solar_Panel_Farm_300kb.jpg',
    alt: 'Inspeksi termal panel surya dari udara',
    caption: 'Inspeksi Solar Panel Farm',
  },
  Bendungan: {
    src: '/images/services-categories/Bendungan___Irigasi_300kb.jpg',
    alt: 'Survey topografi dan inspeksi bendungan',
    caption: 'Survey Bendungan & Irigasi',
  },
  Tower: {
    src: '/images/services-categories/Tower_SUTET___Transmisi_300kb.jpg',
    alt: 'Inspeksi tower telekomunikasi dan transmisi',
    caption: 'Inspeksi Tower & Transmisi',
  },
};

// Fallback for unknown infrastructure types
const fallbackImage = {
  src: '/images/services-categories/Konstruksi_Tinggi___Crane_300kb.jpg',
  alt: 'Inspeksi infrastruktur menggunakan drone',
  caption: 'Inspeksi Infrastruktur',
};

/**
 * Get the image config for a project based on its infrastructure type.
 * @param {string} jenisInfrastruktur
 * @returns {{ src: string, alt: string, caption: string }}
 */
export function getProjectImage(jenisInfrastruktur) {
  return infraImageMap[jenisInfrastruktur] || fallbackImage;
}

export default infraImageMap;
