import { useEffect, useRef, useState } from 'react';
import { Map as MapIcon, Target, Maximize2 } from 'lucide-react';
import { MapErrorFallback } from './MapErrorFallback.jsx';
import './InspectionAreaMap.css';

export default function InspectionAreaMap({ polygonCoords, inspectionPoints, luasArea, pointCount }) {
 const mapContainer = useRef(null);
 const mapRef = useRef(null);
 const [mapError, setMapError] = useState(false);

 useEffect(() => {
 if (mapRef.current || !mapContainer.current) return;

 let map;
 const token = import.meta.env.VITE_MAPBOX_TOKEN;
 if (!token) {
 setMapError(true);
 return;
 }

 import('mapbox-gl').then((mapboxgl) => {
 mapboxgl.default.accessToken = token;

 try {
 map = new mapboxgl.default.Map({
 container: mapContainer.current,
 style: 'mapbox://styles/mapbox/dark-v11',
 center: [110, -5],
 zoom: 8,
 attributionControl: false,
 });

 mapRef.current = map;

 map.on('load', () => {

 if (polygonCoords && polygonCoords.length >= 3) {
 map.addSource('inspection-area', {
 type: 'geojson',
 data: {
 type: 'Feature',
 geometry: { type: 'Polygon', coordinates: [polygonCoords] },
 },
 });

 map.addLayer({
 id: 'inspection-area-fill',
 type: 'fill',
 source: 'inspection-area',
 paint: { 'fill-color': '#00D2FF', 'fill-opacity': 0.18 },
 });
 map.addLayer({
 id: 'inspection-area-stroke',
 type: 'line',
 source: 'inspection-area',
 paint: { 'line-color': '#00D2FF', 'line-width': 2 },
 });

 const lngs = polygonCoords.map((c) => c[0]);
 const lats = polygonCoords.map((c) => c[1]);
 map.fitBounds(
 [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
 { padding: 60, duration: 1000 }
 );
 }

 if (inspectionPoints && inspectionPoints.length > 0) {
 inspectionPoints.forEach((pt) => {
 const el = document.createElement('div');
 el.className = 'pd-map-marker';
 el.title = pt.label;
 new mapboxgl.default.Marker({ element: el })
 .setLngLat([pt.lng, pt.lat])
 .addTo(map);
 });
 }
 });

 map.on('error', () => setMapError(true));
 } catch {
 setMapError(true);
 }
 }).catch(() => setMapError(true));

 return () => {
 if (mapRef.current) {
 mapRef.current.remove();
 mapRef.current = null;
 }
 };
 }, [polygonCoords, inspectionPoints]);

 if (mapError) {
 return <MapErrorFallback inspectionPoints={inspectionPoints} />;
 }

 return (
 <div className="pd-map-stage" aria-label="Peta area inspeksi">
 <div className="pd-map-stage__header">
 <h2 className="pd-map-stage__title">
 <MapIcon size={20} /> Inspection Area
 </h2>
 <p className="pd-map-stage__subtitle">Area inspeksi, titik prioritas, dan cakupan misi UAV.</p>
 </div>

 <div className="pd-map-stage__chips">
 <span className="pd-map-stage__chip"><Maximize2 size={14} /> {luasArea ? `${luasArea} km²` : '-'}</span>
 <span className="pd-map-stage__chip"><Target size={14} /> {pointCount || 0} titik inspeksi</span>
 </div>

 <div className="pd-map-stage__container" ref={mapContainer} />

 <div className="pd-map-stage__legend">
 <span className="pd-map-stage__legend-item">
 <span className="pd-map-stage__legend-poly" /> Polygon Area
 </span>
 <span className="pd-map-stage__legend-item">
 <span className="pd-map-stage__legend-dot" /> Inspection Point
 </span>
 </div>
 </div>
 );
}
