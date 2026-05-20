import { COMMISSION } from '../data/commission-data';
import SupportingSectionHeader from '../../SupportingPages/SupportingSectionHeader';
import './EscrowFlowConsole.css';

const flowSteps = [
  { id: 1, label: 'Client Membayar', icon: '💳', status: 'done' },
  { id: 2, label: 'Dana Masuk Escrow', icon: '🔒', status: 'active' },
  { id: 3, label: 'Inspeksi Selesai', icon: '✓', status: '' },
  { id: 4, label: 'Dana Dilepas ke Pilot', icon: '💰', status: '' },
];

export default function EscrowFlowConsole() {
  return (
    <section className="efc" id="escrow-flow" aria-label="Escrow flow: Client membayar ke escrow SIAGA, lalu dana dibagi 7% untuk platform dan 93% untuk pilot setelah inspeksi selesai.">
      <div className="efc__container">
        <SupportingSectionHeader
          eyebrow="ESCROW SYSTEM"
          title="Pembayaran Aman dengan SIAGA Escrow"
          subtitle="Dana client ditahan sementara di sistem escrow hingga pekerjaan inspeksi selesai dan laporan diterima. Ini membantu menjaga keamanan transaksi bagi client maupun pilot."
          dark
        />

        {/* Flow steps */}
        <div className="efc__flow">
          {flowSteps.map((step, i) => (
            <div key={step.id} className="efc__flow-step-wrapper">
              <div className={`efc__flow-card efc__flow-card--${step.status || 'pending'}`}>
                <span className="efc__flow-icon">{step.icon}</span>
                <span className="efc__flow-label">{step.label}</span>
                {step.status === 'active' && <span className="efc__flow-badge">Protected</span>}
              </div>
              {i < flowSteps.length - 1 && (
                <div className="efc__flow-connector" aria-hidden="true">
                  <div className="efc__flow-line" />
                  <div className="efc__flow-arrow" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Split payment visual */}
        <div className="efc__split">
          <div className="efc__split-header">Payment Breakdown</div>
          <div className="efc__split-bar">
            <div className="efc__split-platform">
              <span className="efc__split-pct">{COMMISSION.platformPercent}%</span>
              <span className="efc__split-lbl">Platform Fee</span>
            </div>
            <div className="efc__split-pilot">
              <span className="efc__split-pct">{COMMISSION.pilotPercent}%</span>
              <span className="efc__split-lbl">Pilot Settlement</span>
            </div>
          </div>
          <div className="efc__split-badges">
            <span className="efc__split-badge">🔒 No Hidden Fees</span>
            <span className="efc__split-badge">🛡️ Escrow Protected</span>
          </div>
        </div>

        {/* Explanation */}
        <p className="efc__explanation">
          SIAGA mengambil {COMMISSION.platformPercent}% platform fee untuk mendukung operasional platform, keamanan transaksi, monitoring proyek, dan infrastruktur laporan. Pilot menerima {COMMISSION.pilotPercent}% setelah pekerjaan selesai sesuai kesepakatan.
        </p>
      </div>
    </section>
  );
}
