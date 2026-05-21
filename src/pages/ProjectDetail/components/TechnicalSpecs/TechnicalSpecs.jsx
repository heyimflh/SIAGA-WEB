import { Camera, FileOutput, Shield, Wrench, Cloud, Clock } from 'lucide-react';
import './TechnicalSpecs.css';

const specItems = [
 { key: 'resolusi_foto', label: 'Resolusi Foto', icon: Camera },
 { key: 'format_output', label: 'Format Output', icon: FileOutput },
 { key: 'standar', label: 'Standar', icon: Shield },
 { key: 'peralatan_minimum', label: 'Peralatan Minimum', icon: Wrench },
 { key: 'kondisi_cuaca', label: 'Kondisi Cuaca', icon: Cloud },
 { key: 'jam_operasional', label: 'Jam Operasional', icon: Clock },
];

export default function TechnicalSpecs({ specs }) {
 if (!specs) return null;

 return (
 <div className="pd-specs">
 <h2 className="pd-specs__title">Spec Matrix</h2>
 <p className="pd-specs__subtitle">Spesifikasi teknis proyek inspeksi.</p>

 <div className="pd-specs__grid">
 {specItems.map(({ key, label, icon: Icon }) => (
 <div key={key} className="pd-specs__card">
 <div className="pd-specs__card-icon"><Icon size={20} /></div>
 <span className="pd-specs__card-label">{label}</span>
 <span className="pd-specs__card-value">{specs[key] || '-'}</span>
 </div>
 ))}
 </div>
 </div>
 );
}
