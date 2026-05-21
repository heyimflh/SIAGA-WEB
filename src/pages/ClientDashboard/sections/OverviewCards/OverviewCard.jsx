/**
 * OverviewCard — single metric card component for Section A.
 *
 * Renders one of four variants:
 * - proyek-aktif: label, angka utama, ikon, indikator tren (arrow + persentase)
 * - aset-terinspeksi: angka + progress bar --color-accent proporsional terhadap target_tahunan
 * - budget: angka format Rupiah + BudgetDonut (lazy-loaded, viewport-triggered)
 * - proyek-selesai: angka + badge --color-success "+N vs bulan lalu"
 *
 * Spec: .kiro/specs/client-dashboard
 * Validates: Requirements 4.2, 4.3, 4.4, 4.5, 4.6, 4.10, 4.11, 4.12, 11.2, 11.3, 11.5, 11.5a, 11.5b, 15.7, 15.7a
 */

import { useRef, lazy, Suspense } from 'react';
import {
 FolderKanban,
 Shield,
 Wallet,
 CheckCircle2,
 TrendingUp,
 TrendingDown,
} from 'lucide-react';
import { formatRupiah } from '../../utils/formatRupiah.js';
import useVisibility from '../../../../hooks/useVisibility.js';
import ReactCountUp from 'react-countup';
import ChartSkeleton from './ChartSkeleton.jsx';

// Handle CJS/ESM interop — react-countup may export the component as .default
const CountUp = ReactCountUp.default || ReactCountUp;

const BudgetDonut = lazy(() => import('./BudgetDonut.jsx'));

const VARIANT_CONFIG = {
 'proyek-aktif': {
 label: 'Proyek Aktif',
 Icon: FolderKanban,
 },
 'aset-terinspeksi': {
 label: 'Total Aset Terinspeksi',
 Icon: Shield,
 },
 budget: {
 label: 'Budget Terpakai',
 Icon: Wallet,
 },
 'proyek-selesai': {
 label: 'Proyek Selesai Bulan Ini',
 Icon: CheckCircle2,
 },
};

function OverviewCard({ variant, data }) {
 const ref = useRef(null);
 const visible = useVisibility(ref);
 const config = VARIANT_CONFIG[variant];

 if (!config || !data) return null;

 const { label, Icon } = config;

 return (
 <article
 ref={ref}
 className={`overview-card overview-card--${variant}`}
 aria-label={label}
 >
 <div className="overview-card__header">
 <span className="overview-card__icon">
 <Icon size={24} aria-hidden="true" />
 </span>
 <span className="overview-card__label">{label}</span>
 </div>

 <div className="overview-card__body">
 {variant === 'proyek-aktif' && (
 <ProyekAktifContent data={data} visible={visible} />
 )}
 {variant === 'aset-terinspeksi' && (
 <AsetTerinspeksiContent data={data} visible={visible} />
 )}
 {variant === 'budget' && (
 <BudgetContent data={data} visible={visible} />
 )}
 {variant === 'proyek-selesai' && (
 <ProyekSelesaiContent data={data} visible={visible} />
 )}
 </div>
 </article>
 );
}

/**
 * Variant proyek-aktif: angka utama + indikator tren arrow + persentase
 */
function ProyekAktifContent({ data, visible }) {
 const { value, trend_pct } = data;
 const isUp = trend_pct >= 0;
 const TrendIcon = isUp ? TrendingUp : TrendingDown;

 return (
 <>
 <span className="overview-card__value">
 <CountUp end={visible ? value : 0} duration={1.0} preserveValue start={0} />
 </span>
 <div className={`overview-card__trend overview-card__trend--${isUp ? 'up' : 'down'}`}>
 <TrendIcon size={16} aria-hidden="true" />
 <span>{isUp ? '+' : ''}{trend_pct}% vs bulan lalu</span>
 </div>
 </>
 );
}

/**
 * Variant aset-terinspeksi: angka + progress bar proporsional terhadap target_tahunan
 */
function AsetTerinspeksiContent({ data, visible }) {
 const { value, target_tahunan } = data;
 const progress = target_tahunan > 0 ? Math.min((value / target_tahunan) * 100, 100) : 0;

 return (
 <>
 <span className="overview-card__value">
 <CountUp end={visible ? value : 0} duration={1.0} preserveValue start={0} />
 </span>
 <div className="overview-card__progress">
 <div className="overview-card__progress-bar">
 <div
 className="overview-card__progress-fill"
 style={{ width: `${progress}%` }}
 role="progressbar"
 aria-valuenow={value}
 aria-valuemin={0}
 aria-valuemax={target_tahunan}
 aria-label={`${value} dari ${target_tahunan} target tahunan`}
 />
 </div>
 <span className="overview-card__progress-text">
 {value} / {target_tahunan}
 </span>
 </div>
 </>
 );
}

/**
 * Variant budget: angka format Rupiah + BudgetDonut (lazy, viewport-triggered)
 * BudgetDonut renders only when parent OverviewCard is visible AND data is ready.
 * Suspense fallback shows ChartSkeleton until chart actually renders its visuals.
 * Validates: Requirements 4.5, 11.2, 11.5, 11.5a, 11.5b, 15.7, 15.7a
 */
function BudgetContent({ data, visible }) {
 const { used, total } = data;
 const dataReady = used != null && total != null;
 const shouldRenderDonut = visible && dataReady;
 const percentage = total > 0 ? Math.round((used / total) * 100) : 0;

 // Format compact: "Rp 4,32 M" instead of "Rp 4.320.000.000"
 function formatCompactRupiah(n) {
 if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(2).replace('.', ',')} M`;
 if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1).replace('.', ',')} Jt`;
 return formatRupiah(n);
 }

 return (
 <div className="overview-card__budget-layout">
 <div className="overview-card__budget-info">
 <span className="overview-card__value">
 {visible ? formatCompactRupiah(used) : 'Rp 0'}
 </span>
 <span className="overview-card__budget-subtitle">
 dari {formatCompactRupiah(total)}
 </span>
 <span className="overview-card__budget-pct">{percentage}% terpakai</span>
 </div>
 <div className="overview-card__donut-slot" data-testid="budget-donut-slot">
 <Suspense fallback={<ChartSkeleton width={80} height={80} />}>
 {shouldRenderDonut ? (
 <BudgetDonut used={used} total={total} />
 ) : (
 <ChartSkeleton width={80} height={80} />
 )}
 </Suspense>
 </div>
 </div>
 );
}

/**
 * Variant proyek-selesai: angka + badge --color-success "+N vs bulan lalu"
 */
function ProyekSelesaiContent({ data, visible }) {
 const { value, delta_vs_last_month } = data;
 const deltaText = delta_vs_last_month >= 0
 ? `+${delta_vs_last_month} vs bulan lalu`
 : `${delta_vs_last_month} vs bulan lalu`;

 return (
 <>
 <span className="overview-card__value">
 <CountUp end={visible ? value : 0} duration={1.0} preserveValue start={0} />
 </span>
 <span className="overview-card__badge">
 {deltaText}
 </span>
 </>
 );
}

export default OverviewCard;
