import { Link } from 'react-router-dom';
import { roleBenefits } from '../data/timeline-data';
import SupportingSectionHeader from '../../SupportingPages/SupportingSectionHeader';
import './RoleBasedBenefits.css';

export default function RoleBasedBenefits() {
 return (
 <section className="rbb">
 <div className="rbb__container">
 <SupportingSectionHeader
 eyebrow="FOR EVERYONE"
 title="SIAGA Menghubungkan Tiga Kebutuhan Utama"
 subtitle="Platform yang dirancang untuk client, pilot UAV, dan kebutuhan dokumentasi infrastruktur."
 />

 <div className="rbb__grid">
 {roleBenefits.map((role) => (
 <div key={role.id} className={`rbb__card rbb__card--${role.accent}`}>
 <h3 className="rbb__card-title">{role.title}</h3>
 <ul className="rbb__card-features">
 {role.features.map((f) => (
 <li key={f} className="rbb__card-feature">
 <span className="rbb__card-dot"/>
 {f}
 </li>
 ))}
 </ul>
 <Link to={role.cta.href} className="rbb__card-cta">
 {role.cta.text}
 </Link>
 </div>
 ))}
 </div>
 </div>
 </section>
 );
}
