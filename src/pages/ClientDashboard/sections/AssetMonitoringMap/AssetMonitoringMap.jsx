/**
 * AssetMonitoringMap — Section B (Mapbox map dengan asset pins).
 *
 * Spec: .kiro/specs/client-dashboard
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 13.7
 *
 * Default-export dipakai oleh `React.lazy()` lewat `./index.js`.
 *
 * Props:
 * assets: Array<Asset> — daftar aset dari mock-data
 * mapFilter: 'all' | 'kritis' | 'perlu_perhatian' — filter aktif
 * onPinClick: (asset) => void — callback saat pin diklik
 * mockData: object — full mock data module (untuk MapFloatingStats)
 */

import { useEffect, useRef, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { getDisabledFilterOptions } from '../../utils/mapFilter.js';
import MapLegend from './MapLegend.jsx';
import MapFilter from './MapFilter.jsx';
import MapFloatingStats from './MapFloatingStats.jsx';
import './AssetMonitoringMap.css';

/**
 * Compute center point from assets array (average lat/lng).
 * Falls back to center of Java if no assets.
 */
function computeCenterOfAssets(assets) {
 if (!assets || assets.length === 0) {
 return [110.0, -7.0]; // Center of Java
 }
 const sumLng = assets.reduce((acc, a) => acc + a.lng, 0);
 const sumLat = assets.reduce((acc, a) => acc + a.lat, 0);
 return [sumLng / assets.length, sumLat / assets.length];
}

function AssetMonitoringMap({ assets = [], mapFilter = 'all', onPinClick, onFilterChange, mockData }) {
 const mapContainerRef = useRef(null);
 const mapRef = useRef(null);
 const markersRef = useRef([]); // Array of { marker, element, asset }

 // Compute disabled filter options
 const disabledOptions = useMemo(() => getDisabledFilterOptions(assets), [assets]);

 // Initialize Mapbox map
 useEffect(() => {
 if (!mapContainerRef.current || mapRef.current) return;

 mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

 const map = new mapboxgl.Map({
 container: mapContainerRef.current,
 style: 'mapbox://styles/mapbox/dark-v11',
 center: computeCenterOfAssets(assets),
 zoom: 6.5,
 attributionControl: false,
 });

 map.addControl(
 new mapboxgl.NavigationControl({ showCompass: false }),
 'bottom-right'
 );

 map.on('load', () => {
 // Add custom markers for each asset
 assets.forEach((asset) => {
 const el = document.createElement('div');
 el.className = `asset-pin asset-pin--${asset.status}`;

 if (asset.status === 'kritis') {
 el.classList.add('asset-pin--pulse');
 }

 el.setAttribute('role', 'button');
 el.setAttribute('aria-label', `Aset ${asset.nama}, status ${asset.status}`);
 el.setAttribute('tabindex', '0');

 // Click handler
 el.addEventListener('click', () => {
 if (onPinClick) onPinClick(asset);
 });

 // Keyboard handler for accessibility
 el.addEventListener('keydown', (e) => {
 if (e.key === 'Enter' || e.key === ' ') {
 e.preventDefault();
 if (onPinClick) onPinClick(asset);
 }
 });

 const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
 .setLngLat([asset.lng, asset.lat])
 .addTo(map);

 markersRef.current.push({ marker, element: el, asset });
 });
 });

 mapRef.current = map;

 return () => {
 markersRef.current.forEach(({ marker }) => marker.remove());
 markersRef.current = [];
 map.remove();
 mapRef.current = null;
 };
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);

 // Filter visibility via el.style.display 
 // Does NOT remove/add markers — only toggles display
 useEffect(() => {
 markersRef.current.forEach(({ element, asset }) => {
 if (mapFilter === 'all') {
 element.style.display = '';
 } else {
 element.style.display = asset.status === mapFilter ? '' : 'none';
 }
 });
 }, [mapFilter]);

 return (
 <section className="asset-monitoring-map" aria-label="Peta monitoring aset">
 <div className="asset-monitoring-map__container" ref={mapContainerRef}>
 {/* Overlay components positioned absolutely within the map container */}
 </div>

 {/* Overlays rendered outside the map container but positioned over it */}
 <MapFloatingStats mockData={mockData} />
 <MapLegend />
 <MapFilter
 activeFilter={mapFilter}
 disabledOptions={disabledOptions}
 onFilterChange={onFilterChange}
 />
 </section>
 );
}

export default AssetMonitoringMap;
