import { featureComparison } from '../data/pricing-data';
import SupportingSectionHeader from '../../SupportingPages/SupportingSectionHeader';
import './FeatureComparisonTable.css';

function CellValue({ value }) {
 if (value === true) return <span className="fct__check">✓</span>;
 if (value === false) return <span className="fct__dash">—</span>;
 return <span className="fct__text">{value}</span>;
}

export default function FeatureComparisonTable() {
 return (
 <section className="fct">
 <div className="fct__container">
 <SupportingSectionHeader
 eyebrow="COMPARE"
 title="Bandingkan Fitur Setiap Paket"
 subtitle="Lihat perbedaan fitur antar paket untuk memilih yang paling sesuai dengan kebutuhan operasional Anda."
 />
 <div className="fct__wrapper">
 <table className="fct__table">
 <thead>
 <tr>
 <th className="fct__th fct__th--feature">Fitur</th>
 <th className="fct__th">Basic</th>
 <th className="fct__th fct__th--pro">Professional</th>
 <th className="fct__th fct__th--ent">Enterprise</th>
 </tr>
 </thead>
 <tbody>
 {featureComparison.map((row) => (
 <tr key={row.feature} className="fct__row">
 <td className="fct__td fct__td--feature">{row.feature}</td>
 <td className="fct__td"><CellValue value={row.basic} /></td>
 <td className="fct__td fct__td--pro"><CellValue value={row.professional} /></td>
 <td className="fct__td fct__td--ent"><CellValue value={row.enterprise} /></td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </section>
 );
}
