/**
 * PilotEarningsPage — Full page view for route `/dashboard/pilot/earnings`.
 *
 * Displays earnings overview, monthly comparison, bar chart, and payment history.
 * Feature: pilot-dashboard
 */

import { useMemo } from 'react';
import { mockData } from './mock-data.js';
import PilotDashboardShell from './shell/PilotDashboardShell.jsx';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowUpRight,
  CircleDollarSign,
  BarChart3,
} from 'lucide-react';
import './PilotEarningsPage.css';

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

function formatShortCurrency(value) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}jt`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}rb`;
  return value.toString();
}

const PAYMENT_STATUS_CONFIG = {
  escrow: { label: 'Escrow', className: 'payment-status--escrow' },
  dibayar: { label: 'Dibayar', className: 'payment-status--paid' },
  pending: { label: 'Pending', className: 'payment-status--pending' },
};

function PilotEarningsPage() {
  const { earnings, payments } = mockData;

  const monthlyChange = useMemo(() => {
    if (earnings.bulan_lalu === 0) return 100;
    return ((earnings.bulan_ini - earnings.bulan_lalu) / earnings.bulan_lalu * 100).toFixed(1);
  }, [earnings]);

  const isPositiveChange = Number(monthlyChange) >= 0;

  const maxChartValue = useMemo(
    () => Math.max(...earnings.chart_data.map((d) => d.nilai)),
    [earnings]
  );

  return (
    <div className="pilot-earnings-page">
      <PilotDashboardShell
        pilotProfile={mockData.pilot_profile}
        notifUnread={mockData.notifications.unread_count}
        activeMissionCount={mockData.proyek_berjalan.length}
      >
        {/* Page Header */}
        <div className="earnings-page__header">
          <div className="earnings-page__title-row">
            <Wallet size={28} className="earnings-page__icon" />
            <div>
              <h1 className="earnings-page__title">Pendapatan</h1>
              <p className="earnings-page__subtitle">Ringkasan pendapatan dan riwayat pembayaran</p>
            </div>
          </div>
        </div>

        {/* Earnings Summary Cards */}
        <div className="earnings-page__summary">
          <div className="earnings-summary-card earnings-summary-card--total">
            <div className="earnings-summary-card__icon">
              <CircleDollarSign size={24} />
            </div>
            <div className="earnings-summary-card__content">
              <span className="earnings-summary-card__label">Total Kumulatif</span>
              <span className="earnings-summary-card__value">{formatCurrency(earnings.total_kumulatif)}</span>
            </div>
          </div>
          <div className="earnings-summary-card">
            <div className="earnings-summary-card__icon">
              <ArrowUpRight size={24} />
            </div>
            <div className="earnings-summary-card__content">
              <span className="earnings-summary-card__label">Bulan Ini</span>
              <span className="earnings-summary-card__value">{formatCurrency(earnings.bulan_ini)}</span>
            </div>
          </div>
          <div className="earnings-summary-card">
            <div className="earnings-summary-card__icon">
              <Calendar size={24} />
            </div>
            <div className="earnings-summary-card__content">
              <span className="earnings-summary-card__label">Bulan Lalu</span>
              <span className="earnings-summary-card__value">{formatCurrency(earnings.bulan_lalu)}</span>
            </div>
          </div>
          <div className={`earnings-summary-card ${isPositiveChange ? 'earnings-summary-card--positive' : 'earnings-summary-card--negative'}`}>
            <div className="earnings-summary-card__icon">
              {isPositiveChange ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
            </div>
            <div className="earnings-summary-card__content">
              <span className="earnings-summary-card__label">Perubahan</span>
              <span className="earnings-summary-card__value">
                {isPositiveChange ? '+' : ''}{monthlyChange}%
              </span>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="earnings-page__chart">
          <div className="earnings-chart__header">
            <BarChart3 size={20} className="earnings-chart__icon" />
            <h3 className="earnings-chart__title">Pendapatan 6 Bulan Terakhir</h3>
          </div>
          <div className="earnings-chart__container">
            {earnings.chart_data.map((item) => (
              <div key={item.bulan} className="earnings-chart__bar-group">
                <div className="earnings-chart__bar-wrapper">
                  <div
                    className="earnings-chart__bar"
                    style={{ height: `${(item.nilai / maxChartValue) * 100}%` }}
                  >
                    <span className="earnings-chart__bar-tooltip">
                      {formatShortCurrency(item.nilai)}
                    </span>
                  </div>
                </div>
                <span className="earnings-chart__bar-label">{item.bulan}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment History */}
        <div className="earnings-page__payments">
          <h3 className="earnings-payments__title">Riwayat Pembayaran</h3>
          <div className="earnings-payments__table-wrap">
            <table className="earnings-payments__table">
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
                {payments.map((payment) => {
                  const statusConf = PAYMENT_STATUS_CONFIG[payment.status];
                  return (
                    <tr key={payment.id}>
                      <td className="earnings-payments__project">{payment.proyek}</td>
                      <td className="earnings-payments__client">{payment.client}</td>
                      <td className="earnings-payments__amount">{formatCurrency(payment.nilai)}</td>
                      <td>
                        <span className={`payment-status ${statusConf.className}`}>
                          {statusConf.label}
                        </span>
                      </td>
                      <td className="earnings-payments__date">{payment.tanggal}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </PilotDashboardShell>
    </div>
  );
}

export default PilotEarningsPage;
