import { useNavigate } from 'react-router-dom';
import { Briefcase, Award, Camera, Shield } from 'lucide-react';
import './CTAJoinSection.css';

const BENEFITS = [
 { icon: Briefcase, text: 'Akses proyek inspeksi industri' },
 { icon: Award, text: 'Bangun reputasi pilot profesional' },
 { icon: Camera, text: 'Tampilkan portofolio UAV Anda' },
 { icon: Shield, text: 'Dapatkan badge SIAGA Verified' },
];

export default function CTAJoinSection() {
 const navigate = useNavigate();

 return (
 <section className="pilots-cta-join">
 <div className="pilots-cta-join__bg" aria-hidden="true" />
 <div className="pilots-cta-join__content">
 <h2 className="pilots-cta-join__heading">Bergabung sebagai Pilot SIAGA</h2>
 <p className="pilots-cta-join__subtitle">
 Dapatkan akses ke proyek inspeksi skala industri dan bangun reputasi
 profesional Anda di ekosistem drone inspection SIAGA.
 </p>

 <div className="pilots-cta-join__benefits">
 {BENEFITS.map((b) => (
 <div key={b.text} className="pilots-cta-join__benefit">
 <b.icon size={20} className="pilots-cta-join__benefit-icon" />
 <span>{b.text}</span>
 </div>
 ))}
 </div>

 <button
 className="pilots-cta-join__btn"
 onClick={() => navigate('/register?role=pilot')}
 >
 Daftar Sebagai Pilot
 </button>
 </div>
 </section>
 );
}
