import { Link } from 'react-router-dom';
import SupportingSectionHeader from '../../SupportingPages/SupportingSectionHeader';
import { getRegisterPath } from '../../../routes/appRoutes';
import './SampleReportPreview.css';

export default function SampleReportPreview() {
 return (
 <section className="srp" id="sample-report">
 <div className="srp__container">
 <SupportingSectionHeader
 eyebrow="OUTPUT"
 title="Output Akhir: Laporan Inspeksi Siap Pakai"
 subtitle="Setiap inspeksi menghasilkan laporan PDF profesional yang siap digunakan untuk dokumentasi, evaluasi, dan tindak lanjut teknis."
 />

 <div className="srp__content">
 <div className="srp__mockup">
 <div className="srp__page">
 <div className="srp__page-header">
 <div className="srp__page-logo">SIAGA</div>
 <span className="srp__page-badge">INSPECTION REPORT</span>
 </div>
 <div className="srp__page-title">Inspeksi Tower SUTET #47</div>
 <div className="srp__page-meta">
 <span>Bandung, Jawa Barat</span>
 <span>15–16 Januari 2026</span>
 </div>
 <div className="srp__page-section">
 <span className="srp__page-section-title">Ringkasan Kondisi</span>
 <div className="srp__page-bar">
 <div className="srp__page-bar-fill srp__page-bar-fill--good" style={{width:'70%'}}/>
 <div className="srp__page-bar-fill srp__page-bar-fill--warn" style={{width:'20%'}}/>
 <div className="srp__page-bar-fill srp__page-bar-fill--bad" style={{width:'10%'}}/>
 </div>
 <div className="srp__page-legend">
 <span><span className="srp__dot srp__dot--good"/>Baik (70%)</span>
 <span><span className="srp__dot srp__dot--warn"/>Perhatian (20%)</span>
 <span><span className="srp__dot srp__dot--bad"/>Kritis (10%)</span>
 </div>
 </div>
 <div className="srp__page-section">
 <span className="srp__page-section-title">Daftar Temuan</span>
 <div className="srp__page-findings">
 <div className="srp__page-finding">
 <span className="srp__dot srp__dot--bad"/>
 <span>Korosi pada joint #12</span>
 </div>
 <div className="srp__page-finding">
 <span className="srp__dot srp__dot--warn"/>
 <span>Kabel kendor section B</span>
 </div>
 <div className="srp__page-finding">
 <span className="srp__dot srp__dot--warn"/>
 <span>Cat mengelupas panel C</span>
 </div>
 </div>
 </div>
 <div className="srp__page-section">
 <span className="srp__page-section-title">Rekomendasi</span>
 <div className="srp__page-lines">
 <div className="srp__page-line"/><div className="srp__page-line srp__page-line--short"/>
 <div className="srp__page-line"/><div className="srp__page-line srp__page-line--med"/>
 </div>
 </div>
 <div className="srp__page-photos">
 <div className="srp__page-photo"/>
 <div className="srp__page-photo"/>
 <div className="srp__page-photo"/>
 </div>
 </div>
 </div>


 <div className="srp__info">
 <h3 className="srp__info-title">Apa yang ada di dalam laporan?</h3>
 <ul className="srp__info-list">
 <li>Cover proyek dan informasi umum</li>
 <li>Ringkasan kondisi aset</li>
 <li>Daftar temuan dengan severity level</li>
 <li>Dokumentasi foto inspeksi</li>
 <li>Rekomendasi tindak lanjut</li>
 <li>Peta lokasi dan titik inspeksi</li>
 </ul>
 <div className="srp__info-ctas">
 <a href="/reports/sample-report.pdf" className="srp__info-cta srp__info-cta--primary" target="_blank" rel="noopener noreferrer">
 Lihat Contoh Laporan
 </a>
 <Link to={getRegisterPath('client')} className="srp__info-cta srp__info-cta--secondary">
 Buat Inspeksi Pertama
 </Link>
 </div>
 </div>
 </div>
 </div>
 </section>
 );
}
