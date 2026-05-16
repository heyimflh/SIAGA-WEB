import {
  Zap,
  Route,
  Factory,
  Sun,
  Building2,
  Waves,
} from 'lucide-react';

export const categories = [
  {
    id: 1,
    name: 'Tower SUTET & Transmisi',
    description:
      'Inspeksi konduktor, isolator, klem, spacer, dan titik rawan gangguan jaringan listrik.',
    pilots: 142,
    startingPrice: 'Rp 5jt',
    icon: Zap,
    gradient: 'linear-gradient(135deg, rgba(0,98,214,0.08) 0%, rgba(232,244,253,0.6) 100%)',
    thumbnail: '/images/services-categories/Tower SUTET & Transmisi.jpg',
  },
  {
    id: 2,
    name: 'Jembatan & Jalan Tol',
    description:
      'Inspeksi struktur, expansion joint, drainase, retakan, dan area sulit dijangkau.',
    pilots: 87,
    startingPrice: 'Rp 7jt',
    icon: Route,
    gradient: 'linear-gradient(135deg, rgba(0,180,216,0.08) 0%, rgba(232,244,253,0.6) 100%)',
    thumbnail: '/images/services-categories/Jembatan & Jalan Tol.jpg',
  },
  {
    id: 3,
    name: 'Pipa Migas & Kilang',
    description:
      'Survey pipeline, monitoring area kilang, thermal check, dan dokumentasi aset migas.',
    pilots: 64,
    startingPrice: 'Rp 12jt',
    icon: Factory,
    gradient: 'linear-gradient(135deg, rgba(229,57,53,0.06) 0%, rgba(232,244,253,0.6) 100%)',
    thumbnail: '/images/services-categories/Pipa Migas & Kilang.jpg',
  },
  {
    id: 4,
    name: 'Solar Panel Farm',
    description:
      'Thermal scan panel, anomali shading, hotspot detection, dan dokumentasi performa.',
    pilots: 51,
    startingPrice: 'Rp 4jt',
    icon: Sun,
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(232,244,253,0.6) 100%)',
    thumbnail: '/images/services-categories/Solar Panel Farm.jpg',
  },
  {
    id: 5,
    name: 'Konstruksi Tinggi & Crane',
    description:
      'Progress monitoring, quality check, inspeksi ketinggian, dan dokumentasi berkala.',
    pilots: 113,
    startingPrice: 'Rp 4,5jt',
    icon: Building2,
    gradient: 'linear-gradient(135deg, rgba(10,37,64,0.06) 0%, rgba(232,244,253,0.6) 100%)',
    thumbnail: '/images/services-categories/Konstruksi Tinggi & Crane.jpg',
  },
  {
    id: 6,
    name: 'Bendungan & Irigasi',
    description:
      'Inspeksi bendung, saluran irigasi, struktur beton, sedimentasi, dan area risiko.',
    pilots: 78,
    startingPrice: 'Rp 6jt',
    icon: Waves,
    gradient: 'linear-gradient(135deg, rgba(0,137,123,0.08) 0%, rgba(232,244,253,0.6) 100%)',
    thumbnail: '/images/services-categories/Bendungan & Irigasi.jpg',
  },
];
