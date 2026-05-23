import { useRef } from 'react';
import ReactCountUp from 'react-countup';
import { formatRupiah } from '../../utils/formatRupiah.js';
import useVisibility from '../../../../hooks/useVisibility.js';

const CountUp = ReactCountUp.default || ReactCountUp;
import './QuickStatsFooter.css';

function QuickStatsFooter({ quickStats }) {
 const containerRef = useRef(null);
 const visible = useVisibility(containerRef);

 const { total_hemat_rp, total_pilot_kerjasama, rata_rata_waktu_bidding_hari } = quickStats;

 return (
 <section className="quick-stats-footer" ref={containerRef} aria-label="Statistik ringkasan">
 <div className="quick-stats-footer__item">
 <span className="quick-stats-footer__label">Total Hemat dari Inspeksi Konvensional:</span>
 <span className="quick-stats-footer__value">
 {total_hemat_rp === 0 ? (
 <span className="qs__num">Rp 0</span>
 ) : (
 visible ? (
 <CountUp
 end={total_hemat_rp}
 duration={1.0}
 preserveValue
 start={0}
 formattingFn={formatRupiah}
 />
 ) : (
 <span className="qs__num">Rp 0</span>
 )
 )}
 </span>
 </div>

 <div className="quick-stats-footer__item">
 <span className="quick-stats-footer__label">Total Pilot Bekerja Sama:</span>
 <span className="quick-stats-footer__value">
 {total_pilot_kerjasama === 0 ? (
 <span className="qs__num">0</span>
 ) : (
 visible ? (
 <CountUp
 end={total_pilot_kerjasama}
 duration={1.0}
 preserveValue
 start={0}
 />
 ) : (
 <span className="qs__num">0</span>
 )
 )}
 </span>
 </div>

 <div className="quick-stats-footer__item">
 <span className="quick-stats-footer__label">Rata-rata Waktu Bidding:</span>
 <span className="quick-stats-footer__value">
 {rata_rata_waktu_bidding_hari === 0 ? (
 <span className="qs__num">0</span>
 ) : (
 visible ? (
 <CountUp
 end={rata_rata_waktu_bidding_hari}
 duration={1.0}
 preserveValue
 start={0}
 suffix=" hari"
 />
 ) : (
 <span className="qs__num">0</span>
 )
 )}
 </span>
 </div>
 </section>
 );
}

export default QuickStatsFooter;
