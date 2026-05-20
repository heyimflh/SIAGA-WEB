/**
 * Earnings — Revenue & Escrow Cockpit section.
 * Feature: pilot-dashboard
 * Validates: Requirements 11
 */

import { lazy, Suspense } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatRupiah } from '../../utils/formatRupiah';
import './Earnings.css';

const EarningsChart = lazy(() => import('./EarningsChart'));

const STATUS_MAP = {
  dibayar: { label: 'Dibayar', className: 'payment-table__status--success' },
  pending: { label: 'Pending', className: 'payment-table__status--warning' },
  escrow: { label: 'Escrow', className: 'payment-table__status--cyan' },
};

function PaymentTable({ payments }) {
  return (
    <div className="payment-table__wrap">
      <table className="payment-table" aria-label="Riwayat pembayaran">
        <thead>
          <tr>
            <th>Proyek</th>
            <th>Client</th>
            <th>Nilai</th>
            <th>Status</th>
            <th>Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => {
            const status = STATUS_MAP[p.status] || STATUS_MAP.pending;
            return (
              <tr key={p.id}>
                <td>{p.proyek}</td>
                <td>{p.client}</td>
                <td className="payment-table__nilai">{formatRupiah(p.nilai)}</td>
                <td><span className={`payment-table__status ${status.className}`}>{status.label}</span></td>
                <td>{p.tanggal}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Earnings({ earnings, payments }) {
  const momChange = earnings.bulan_lalu > 0
    ? Math.round(((earnings.bulan_ini - earnings.bulan_lalu) / earnings.bulan_lalu) * 100)
    : 0;
  const isUp = momChange >= 0;

  return (
    <section className="earnings" id="section-earnings" aria-label="Pendapatan & Escrow">
      <div className="earnings__header">
        <span className="earnings__label">REVENUE COCKPIT</span>
        <h3 className="earnings__title">Pendapatan & Escrow</h3>
        <p className="earnings__subtitle">Pantau pendapatan kumulatif, tren bulanan, dan status pembayaran proyek.</p>
      </div>

      <div className="earnings__summary">
        <div className="earnings__total-card">
          <span className="earnings__total-label">Total Pendapatan</span>
          <span className="earnings__total-value">{formatRupiah(earnings.total_kumulatif)}</span>
          <div className="earnings__mom">
            {isUp ? <TrendingUp size={14} aria-hidden="true" /> : <TrendingDown size={14} aria-hidden="true" />}
            <span className={`earnings__mom-text ${isUp ? 'earnings__mom-text--up' : 'earnings__mom-text--down'}`}>
              {isUp ? '+' : ''}{momChange}% dari bulan lalu
            </span>
          </div>
        </div>

        <div className="earnings__chart-wrap">
          <Suspense fallback={<div className="earnings__chart-loading">Memuat chart...</div>}>
            <EarningsChart data={earnings.chart_data} />
          </Suspense>
        </div>
      </div>

      {payments.length > 0 ? (
        <PaymentTable payments={payments} />
      ) : (
        <div className="earnings__empty"><p>Belum ada riwayat pendapatan</p></div>
      )}
    </section>
  );
}

export default Earnings;
