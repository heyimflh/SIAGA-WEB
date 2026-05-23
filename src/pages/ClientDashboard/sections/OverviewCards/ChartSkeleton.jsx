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
