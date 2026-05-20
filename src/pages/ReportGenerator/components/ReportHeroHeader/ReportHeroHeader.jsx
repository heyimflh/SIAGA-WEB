/**
 * ReportHeroHeader — Glassmorphism hero context header.
 * Displays SIAGA Report Intelligence branding and mini stats.
 */

import { Zap, FileText, Clock, Radio } from 'lucide-react';
import './ReportHeroHeader.css';

function ReportHeroHeader({ completedCount = 0 }) {
  const stats = [
    { icon: Zap, label: 'Completed', value: `${completedCount}+` },
    { icon: FileText, label: 'Output', value: 'PDF' },
    { icon: Clock, label: 'Est. Time', value: '8s' },
    { icon: Radio, label: 'Mode', value: 'Demo Ready' },
  ];

  return (
    <header className="report-hero">
      <div className="report-hero__content">
        <div className="report-hero__text">
          <span className="report-hero__badge">SIAGA REPORT INTELLIGENCE</span>
          <h1 className="report-hero__title">AI Inspection Report Generator</h1>
          <p className="report-hero__subtitle">
            Ubah data inspeksi drone, koordinat GPS, dan dokumentasi kerusakan
            menjadi laporan profesional dalam hitungan detik.
          </p>
        </div>
        <div className="report-hero__stats">
          {stats.map((stat) => (
            <div key={stat.label} className="report-hero__stat">
              <stat.icon size={16} className="report-hero__stat-icon" />
              <div className="report-hero__stat-info">
                <span className="report-hero__stat-value">{stat.value}</span>
                <span className="report-hero__stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

export default ReportHeroHeader;
