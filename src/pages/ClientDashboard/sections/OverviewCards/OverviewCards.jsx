/**
 * OverviewCards — Section A container rendering 4 metric cards.
 *
 * Grid responsive:
 *   - 4 kolom ≥1280px
 *   - 2 kolom 768-1279px
 *   - 1 kolom <768px
 *
 * Spec: .kiro/specs/client-dashboard
 * Validates: Requirements 4.1, 4.7, 4.8, 4.9
 */

import OverviewCard from './OverviewCard.jsx';
import './OverviewCards.css';

/**
 * @param {{ metrics: object }} props
 * @param {object} props.metrics - mockData.overview_metrics
 */
function OverviewCards({ metrics }) {
  if (!metrics) return null;

  return (
    <section className="overview-cards" aria-label="Ringkasan metrik">
      <OverviewCard
        variant="proyek-aktif"
        data={metrics.proyek_aktif}
      />
      <OverviewCard
        variant="aset-terinspeksi"
        data={metrics.aset_terinspeksi}
      />
      <OverviewCard
        variant="budget"
        data={metrics.budget}
      />
      <OverviewCard
        variant="proyek-selesai"
        data={metrics.proyek_selesai_bulan_ini}
      />
    </section>
  );
}

export default OverviewCards;
