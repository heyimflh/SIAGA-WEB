import './AssetMapFallback.css';

function BareFallback() {
 return <div className="asset-map-fallback asset-map-fallback--bare">Peta tidak dapat dimuat</div>;
}


function LoadingFallback() {
 return (
 <div className="asset-map-fallback asset-map-fallback--loading">
 <div className="asset-map-fallback__spinner" aria-hidden="true" />
 <p className="asset-map-fallback__text">Memuat peta…</p>
 </div>
 );
}

function ErrorFallback({ assets }) {
 try {

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

 return <BareFallback />;
 }
}

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
