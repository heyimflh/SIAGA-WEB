import { Building2, Star, Briefcase, Calendar, ShieldCheck } from 'lucide-react';
import { formatTanggalIndonesia } from '../../project-logic.js';
import './ClientInfoSection.css';

export default function ClientInfoSection({ clientInfo }) {
 if (!clientInfo) return null;

 return (
 <div className="pd-client-info">
 <h2 className="pd-client-info__title">Verified Client</h2>
 <div className="pd-client-info__card">
 <div className="pd-client-info__header">
 <div className="pd-client-info__icon"><Building2 size={24} /></div>
 <div>
 <h3 className="pd-client-info__name">{clientInfo.nama}</h3>
 {clientInfo.verified && (
 <span className="pd-client-info__badge"><ShieldCheck size={14} /> Verified Company</span>
 )}
 </div>
 </div>
 <div className="pd-client-info__stats">
 <div className="pd-client-info__stat">
 <Star size={16} />
 <span>{clientInfo.rating} Rating</span>
 </div>
 <div className="pd-client-info__stat">
 <Briefcase size={16} />
 <span>{clientInfo.proyek_selesai} proyek selesai</span>
 </div>
 <div className="pd-client-info__stat">
 <Calendar size={16} />
 <span>Member sejak {formatTanggalIndonesia(clientInfo.member_since)}</span>
 </div>
 </div>
 </div>
 </div>
 );
}
