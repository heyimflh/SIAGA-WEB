import { Send } from 'lucide-react';
import './BidForm.css';

export default function BidForm({ formData, errors, isSubmitting, onChange, onSubmit }) {
 return (
 <form className="pd-bid-form" onSubmit={onSubmit} noValidate>
 <div className="pd-bid-form__field">
 <label htmlFor="bid-harga" className="pd-bid-form__label">Harga Penawaran (Rp)</label>
 <input
 id="bid-harga"
 type="number"
 className={`pd-bid-form__input ${errors.harga ? 'pd-bid-form__input--error' : ''}`}
 placeholder="Contoh: 285000000"
 value={formData.harga}
 onChange={(e) => onChange('harga', e.target.value)}
 aria-invalid={!!errors.harga}
 aria-describedby={errors.harga ? 'bid-harga-error' : undefined}
 disabled={isSubmitting}
 />
 {errors.harga && <span id="bid-harga-error" className="pd-bid-form__error" role="alert">{errors.harga}</span>}
 </div>

 <div className="pd-bid-form__field">
 <label htmlFor="bid-estimasi" className="pd-bid-form__label">Estimasi Hari Pengerjaan</label>
 <input
 id="bid-estimasi"
 type="number"
 className={`pd-bid-form__input ${errors.estimasiHari ? 'pd-bid-form__input--error' : ''}`}
 placeholder="Contoh: 7"
 value={formData.estimasiHari}
 onChange={(e) => onChange('estimasiHari', e.target.value)}
 aria-invalid={!!errors.estimasiHari}
 aria-describedby={errors.estimasiHari ? 'bid-estimasi-error' : undefined}
 disabled={isSubmitting}
 />
 {errors.estimasiHari && <span id="bid-estimasi-error" className="pd-bid-form__error" role="alert">{errors.estimasiHari}</span>}
 </div>

 <div className="pd-bid-form__field">
 <label htmlFor="bid-drone" className="pd-bid-form__label">Drone yang akan digunakan</label>
 <select
 id="bid-drone"
 className="pd-bid-form__input"
 value={formData.droneType}
 onChange={(e) => onChange('droneType', e.target.value)}
 disabled={isSubmitting}
 >
 <option value="">Pilih drone...</option>
 <option value="DJI Matrice 300 RTK">DJI Matrice 300 RTK</option>
 <option value="DJI Matrice 350 RTK">DJI Matrice 350 RTK</option>
 <option value="DJI Mavic 3 Enterprise">DJI Mavic 3 Enterprise</option>
 <option value="Autel EVO II Pro">Autel EVO II Pro</option>
 <option value="Elios 3 (ATEX)">Elios 3 (ATEX)</option>
 <option value="Lainnya">Lainnya</option>
 </select>
 </div>

 <div className="pd-bid-form__field">
 <label htmlFor="bid-catatan" className="pd-bid-form__label">Catatan Teknis (opsional)</label>
 <textarea
 id="bid-catatan"
 className="pd-bid-form__input pd-bid-form__textarea"
 placeholder="Catatan tambahan..."
 value={formData.catatan}
 onChange={(e) => onChange('catatan', e.target.value)}
 disabled={isSubmitting}
 rows={3}
 />
 </div>

 <button type="submit" className="pd-bid-form__submit" disabled={isSubmitting}>
 {isSubmitting ? (
 <span className="pd-bid-form__spinner" />
 ) : (
 <><Send size={16} /> Kirim Penawaran</>
 )}
 </button>
 </form>
 );
}
