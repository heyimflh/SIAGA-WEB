/**
 * ChartSkeleton — shared loading placeholder with fixed dimensions.
 *
 * Prevents layout shift by reserving exact space for the chart
 * while it loads (lazy chunk + render). Stays visible until the
 * actual chart element renders its visuals.
 *
 * Spec: .kiro/specs/client-dashboard
 * Validates: Requirements 11.5, 11.5a, 11.5b, 15.7, 15.7a
 */

function ChartSkeleton({ width = 140, height = 140 }) {
 return (
 <div
 className="chart-skeleton"
 style={{
 width: `${width}px`,
 height: `${height}px`,
 borderRadius: '50%',
 background: 'rgba(200, 200, 200, 0.2)',
 animation: 'chart-skeleton-pulse 1.5s ease-in-out infinite',
 flexShrink: 0,
 }}
 role="status"
 aria-label="Memuat chart…"
 >
 <span className="sr-only">Memuat chart…</span>
 </div>
 );
}

export default ChartSkeleton;
