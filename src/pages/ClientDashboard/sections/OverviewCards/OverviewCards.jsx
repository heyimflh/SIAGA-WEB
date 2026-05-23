import OverviewCard from './OverviewCard.jsx';
import './OverviewCards.css';

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
