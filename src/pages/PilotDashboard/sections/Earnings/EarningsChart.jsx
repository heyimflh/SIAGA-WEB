/**
 * EarningsChart — Lazy-loaded Recharts area chart.
 * Feature: pilot-dashboard
 * Validates: Requirements 11
 */

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function EarningsChart({ data }) {
  return (
    <div aria-label="Chart pendapatan 6 bulan terakhir" role="img">
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00D2FF" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00D2FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#60758D' }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip
            formatter={(value) => [`Rp ${(value / 1000000).toFixed(0)} jt`, 'Pendapatan']}
            contentStyle={{ borderRadius: 12, border: '1px solid rgba(0,210,255,0.15)', fontSize: 12 }}
          />
          <Area type="monotone" dataKey="nilai" stroke="#00D2FF" strokeWidth={2} fill="url(#earningsGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EarningsChart;
