import { useEffect, useRef, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { getDisabledFilterOptions } from '../../utils/mapFilter.js';
import MapLegend from './MapLegend.jsx';
import MapFilter from './MapFilter.jsx';
import MapFloatingStats from './MapFloatingStats.jsx';
import './AssetMonitoringMap.css';

function computeCenterOfAssets(assets) {
 if (!assets || assets.length === 0) {
 return [110.0, -7.0];
 }
 const sumLng = assets.reduce((acc, a) => acc + a.lng, 0);
 const sumLat = assets.reduce((acc, a) => acc + a.lat, 0);
 return [sumLng / assets.length, sumLat / assets.length];
}

function AssetMonitoringMap({ assets = [], mapFilter = 'all', onPinClick, onFilterChange, mockData }) {
 const mapContainerRef = useRef(null);
 const mapRef = useRef(null);
 const markersRef = useRef([]);

 const disabledOptions = useMemo(() => getDisabledFilterOptions(assets), [assets]);

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

 assets.forEach((asset) => {
 const el = document.createElement('div');
 el.className = `asset-pin asset-pin--${asset.status}`;

 if (asset.status === 'kritis') {
 el.classList.add('asset-pin--pulse');
 }

 el.setAttribute('role', 'button');
 el.setAttribute('aria-label', `Aset ${asset.nama}, status ${asset.status}`);
 el.setAttribute('tabindex', '0');

 el.addEventListener('click', () => {
 if (onPinClick) onPinClick(asset);
 });

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

 }, []);

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
 </div>


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
