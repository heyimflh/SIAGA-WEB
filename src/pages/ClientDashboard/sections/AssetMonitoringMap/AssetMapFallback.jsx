/**
 * AssetMapFallback — Fallback UI untuk Section B (Asset Monitoring Map).
 *
 * Tiga variant:
 * - `loading`: spinner + teks "Memuat peta…" (Suspense fallback)
 * - `error`: pesan error + daftar aset teks (ErrorBoundary fallback)
 * - `bare`: HTML statis minimal (last-resort jika error variant gagal render)
 *
 * Spec: .kiro/specs/client-dashboard
 *
 * Props:
 * variant: 'loading' | 'error' | 'bare'
 * assets?: Array<{ nama: string, status: string }>
 */

import './AssetMapFallback.css';

/**
 * Bare variant — minimal static HTML that cannot crash.
 * Used as last-resort fallback.
 */
function BareFallback() {
 return <div className="asset-map-fallback asset-map-fallback--bare">Peta tidak dapat dimuat</div>;
}

/**
 * Loading variant — spinner + loading text.
 */
function LoadingFallback() {
 return (
 <div className="asset-map-fallback asset-map-fallback--loading">
 <div className="asset-map-fallback__spinner" aria-hidden="true" />
 <p className="asset-map-fallback__text">Memuat peta…</p>
 </div>
 );
}

/**
 * Error variant — error message + text list of assets.
 * Wrapped in internal try/catch: if rendering the asset list fails
 * (e.g. assets is undefined/malformed), falls back to bare variant.
 */
function ErrorFallback({ assets }) {
 try {
 // Attempt to render asset list — may throw if assets is malformed
 const assetList = Array.isArray(assets) && assets.length > 0
 ? assets.map((asset, idx) => (
 <li key={asset?.nama ?? idx} className="asset-map-fallback__asset-item">
 <span className="asset-map-fallback__asset-name">{asset.nama}</span>
 {' — '}
 <span className={`asset-map-fallback__asset-status asset-map-fallback__asset-status--${asset.status}`}>
 {asset.status}
 </span>
 </li>
 ))
 : null;

 return (
 <div className="asset-map-fallback asset-map-fallback--error">
 <p className="asset-map-fallback__message">Peta tidak tersedia saat ini</p>
 {assetList && (
 <ul className="asset-map-fallback__asset-list">
 {assetList}
 </ul>
 )}
 </div>
 );
 } catch {
 // If rendering fails, fall back to bare variant
 return <BareFallback />;
 }
}

/**
 * Main fallback component — dispatches to the correct variant.
 */
function AssetMapFallback({ variant = 'bare', assets }) {
 switch (variant) {
 case 'loading':
 return <LoadingFallback />;
 case 'error':
 return <ErrorFallback assets={assets} />;
 case 'bare':
 default:
 return <BareFallback />;
 }
}

export default AssetMapFallback;
