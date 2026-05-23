import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getStatusVisual } from '../../filters.js';
import PinPopup from './PinPopup.jsx';
import TerrainToggle from './TerrainToggle.jsx';
import './RadarMap.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function RadarMap({
 projects,
 selectedPinId,
 hoveredPinId,
 flyToTarget,
 popupProject,
 onPinClick,
 onPinHover,
 onMapReady,
 onFlyToComplete,
 onPopupClose,
 onBidClick,
 onDetailClick,
}) {
 const mapContainerRef = useRef(null);
 const mapRef = useRef(null);
 const markersRef = useRef({});
 const [terrainEnabled, setTerrainEnabled] = useState(true);
 const [mapLoaded, setMapLoaded] = useState(false);
 const resizeTimeoutRef = useRef(null);

 useEffect(() => {
 if (!mapContainerRef.current) return;

 const map = new mapboxgl.Map({
 container: mapContainerRef.current,
 style: 'mapbox://styles/mapbox/dark-v11',
 center: [118, -2.5],
 zoom: 5,
 pitch: 30,
 bearing: 0,
 antialias: true,
 });

 map.on('load', () => {

 map.addSource('mapbox-dem', {
 type: 'raster-dem',
 url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
 tileSize: 512,
 maxzoom: 14,
 });

 try {
 map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
 } catch (terrainErr) {
 console.warn('[RadarMap] Terrain failed, using flat map:', terrainErr);
 }

 map.setFog({
 color: 'rgb(10, 20, 40)',
 'high-color': 'rgb(20, 40, 80)',
 'horizon-blend': 0.08,
 'space-color': 'rgb(5, 10, 20)',
 'star-intensity': 0.3,
 });

 setMapLoaded(true);
 onMapReady?.();
 });

 map.on('error', (e) => {
 if (e.error?.message?.includes('terrain') || e.error?.message?.includes('dem')) {
 console.warn('[RadarMap] Terrain DEM error, disabling terrain');
 try {
 map.setTerrain(null);
 setTerrainEnabled(false);
 } catch (_) {

 }
 }
 });

 map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

 mapRef.current = map;

 const resizeObserver = new ResizeObserver(() => {
 if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
 resizeTimeoutRef.current = setTimeout(() => {
 map.resize();
 }, 150);
 });
 resizeObserver.observe(mapContainerRef.current);

 return () => {
 resizeObserver.disconnect();
 if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
 map.remove();
 };

 }, []);

 useEffect(() => {
 const map = mapRef.current;
 if (!map || !mapLoaded) return;

 try {
 if (terrainEnabled) {
 map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
 } else {
 map.setTerrain(null);
 }
 } catch (e) {
 console.warn('[RadarMap] Terrain toggle error:', e);
 }
 }, [terrainEnabled, mapLoaded]);

 useEffect(() => {
 const map = mapRef.current;
 if (!map || !mapLoaded) return;

 Object.values(markersRef.current).forEach(m => m.remove());
 markersRef.current = {};

 projects.forEach(project => {
 const statusVisual = getStatusVisual(project.status);
 const el = createPinElement(project, statusVisual);

 el.addEventListener('mouseenter', () => onPinHover?.(project.id));
 el.addEventListener('mouseleave', () => onPinHover?.(null));
 el.addEventListener('click', (e) => {
 e.stopPropagation();
 onPinClick?.(project);
 });

 const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
 .setLngLat([project.lokasi.lng, project.lokasi.lat])
 .addTo(map);

 markersRef.current[project.id] = marker;
 });
 }, [projects, mapLoaded, onPinClick, onPinHover]);

 useEffect(() => {
 Object.entries(markersRef.current).forEach(([id, marker]) => {
 const el = marker.getElement();
 if (id === hoveredPinId) {
 el.classList.add('radar-pin--hovered');
 } else {
 el.classList.remove('radar-pin--hovered');
 }
 });
 }, [hoveredPinId]);

 useEffect(() => {
 Object.entries(markersRef.current).forEach(([id, marker]) => {
 const el = marker.getElement();
 if (id === selectedPinId) {
 el.classList.add('radar-pin--selected');
 } else {
 el.classList.remove('radar-pin--selected');
 }
 });
 }, [selectedPinId]);

 useEffect(() => {
 const map = mapRef.current;
 if (!map || !flyToTarget) return;

 map.flyTo({
 center: [flyToTarget.lng, flyToTarget.lat],
 zoom: 10,
 pitch: 45,
 duration: 1500,
 essential: true,
 });

 const handleMoveEnd = () => {
 onFlyToComplete?.();
 map.off('moveend', handleMoveEnd);
 };
 map.on('moveend', handleMoveEnd);
 }, [flyToTarget, onFlyToComplete]);

 useEffect(() => {
 const map = mapRef.current;
 if (!map || !mapLoaded) return;

 const handleClick = () => {
 if (popupProject) {
 onPopupClose?.();
 }
 };

 map.on('click', handleClick);
 return () => map.off('click', handleClick);
 }, [popupProject, mapLoaded, onPopupClose]);

 return (
 <div className="radar-map">
 <div ref={mapContainerRef} className="radar-map__container" />

 <TerrainToggle
 enabled={terrainEnabled}
 onToggle={() => setTerrainEnabled(prev => !prev)}
 />

 {popupProject && mapLoaded && (
 <PinPopup
 project={popupProject}
 onClose={onPopupClose}
 onBidClick={onBidClick}
 onDetailClick={onDetailClick}
 />
 )}
 </div>
 );
}


function createPinElement(project, statusVisual) {
 const el = document.createElement('div');
 el.className = 'radar-pin';
 el.setAttribute('aria-label', `${project.nama}, ${statusVisual.label}, ${project.lokasi.kota}`);
 el.setAttribute('role', 'button');
 el.setAttribute('tabindex', '0');

 const color = statusVisual.color;
 const opacity = statusVisual.opacity;

 el.style.opacity = opacity;

 el.innerHTML = `
 <div class="radar-pin__body" style="--pin-color: ${color}">
 ${statusVisual.pulse ? `<div class="radar-pin__pulse" style="--pin-color: ${color}; --pulse-speed: ${statusVisual.pulseSpeed}"></div>` : ''}
 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
 <circle cx="12" cy="12" r="8" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="1.5"/>
 <circle cx="12" cy="12" r="4" fill="${color}"/>
 <path d="M12 2L12 6M12 18L12 22M2 12L6 12M18 12L22 12" stroke="${color}" stroke-width="0.8" stroke-opacity="0.5"/>
 </svg>
 </div>
 `;

 return el;
}
