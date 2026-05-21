import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { pinData, connectionLines, mapConfig, statsData, liveAlerts } from './pinData';
import RadarSidebar from './RadarSidebar';
import FloatingStats from './FloatingStats';
import LiveAlertCard from './LiveAlertCard';
import BottomStatusBar from './BottomStatusBar';
import './JobRadar.css';

gsap.registerPlugin(ScrollTrigger);

export default function JobRadarSection() {
 const sectionRef = useRef(null);
 const mapContainerRef = useRef(null);
 const mapRef = useRef(null);
 const markersRef = useRef([]);
 const [activePin, setActivePin] = useState(null);
 const [mapLoaded, setMapLoaded] = useState(false);

 // Initialize Mapbox Globe
 useEffect(() => {
 if (!mapContainerRef.current || mapRef.current) return;

 mapboxgl.accessToken = mapConfig.accessToken;

 const map = new mapboxgl.Map({
 container: mapContainerRef.current,
 style: mapConfig.style,
 center: mapConfig.center,
 zoom: 2.5,
 pitch: 0,
 bearing: mapConfig.bearing,
 antialias: true,
 attributionControl: false,
 projection: 'globe',
 });

 map.addControl(
 new mapboxgl.NavigationControl({ showCompass: true, visualizePitch: true }),
 'bottom-right'
 );

 map.on('style.load', () => {
 // Globe atmosphere
 map.setFog({
 color: 'rgba(220, 235, 255, 0.6)',
 'high-color': 'rgba(180, 210, 255, 0.4)',
 'horizon-blend': 0.08,
 'space-color': 'rgba(240, 246, 255, 1.0)',
 'star-intensity': 0.0,
 });
 });

 map.on('load', () => {
 // 3D terrain
 map.addSource('mapbox-dem', {
 type: 'raster-dem',
 url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
 tileSize: 512,
 maxzoom: 14,
 });
 map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

 // Sky layer
 map.addLayer({
 id: 'sky',
 type: 'sky',
 paint: {
 'sky-type': 'atmosphere',
 'sky-atmosphere-sun': [0.0, 90.0],
 'sky-atmosphere-sun-intensity': 15,
 'sky-atmosphere-color': 'rgba(135, 206, 235, 1.0)',
 },
 });

 // Connection lines between project hubs
 map.addSource('connections', {
 type: 'geojson',
 data: {
 type: 'FeatureCollection',
 features: connectionLines.map((line, i) => ({
 type: 'Feature',
 properties: { id: i },
 geometry: {
 type: 'LineString',
 coordinates: [line.from, line.to],
 },
 })),
 },
 });

 // Glow layer (wider, blurred)
 map.addLayer({
 id: 'connection-glow',
 type: 'line',
 source: 'connections',
 paint: {
 'line-color': '#0062D6',
 'line-width': 5,
 'line-opacity': 0.12,
 'line-blur': 4,
 },
 });

 // Main connection line
 map.addLayer({
 id: 'connection-lines',
 type: 'line',
 source: 'connections',
 paint: {
 'line-color': '#0062D6',
 'line-width': 1.5,
 'line-opacity': 0.35,
 'line-dasharray': [6, 4],
 },
 });

 setMapLoaded(true);

 // Add custom markers
 pinData.forEach((pin, index) => {
 const el = document.createElement('div');
 el.className = `globe-marker ${pin.status === 'urgent' ? 'globe-marker--urgent' : 'globe-marker--active'}`;
 el.dataset.pinId = pin.id;
 el.innerHTML = `
 <div class="globe-marker__pulse"></div>
 <div class="globe-marker__pulse globe-marker__pulse--delayed"></div>
 <div class="globe-marker__core">
 <div class="globe-marker__dot"></div>
 </div>
 `;

 el.addEventListener('click', () => {
 setActivePin(pin);
 map.flyTo({
 center: pin.coordinates,
 zoom: 9,
 pitch: 50,
 duration: 1800,
 essential: true,
 });
 });

 el.addEventListener('mouseenter', () => {
 el.classList.add('globe-marker--hovered');
 });
 el.addEventListener('mouseleave', () => {
 el.classList.remove('globe-marker--hovered');
 });

 const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
 .setLngLat(pin.coordinates)
 .addTo(map);

 el.style.opacity = '0';
 el.style.transform = 'scale(0)';

 markersRef.current.push({ marker, element: el, delay: index * 0.1 });
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

 // GSAP scroll-triggered entrance
 useEffect(() => {
 if (!mapLoaded || !mapRef.current) return;

 const ctx = gsap.context(() => {
 ScrollTrigger.create({
 trigger: sectionRef.current,
 start: 'top 75%',
 once: true,
 onEnter: () => {
 // Globe fly-in to Indonesia
 mapRef.current.flyTo({
 center: mapConfig.center,
 zoom: mapConfig.zoom,
 pitch: mapConfig.pitch,
 duration: 3000,
 essential: true,
 });

 // Section heading
 gsap.to('.job-radar__heading', {
 y: 0, opacity: 1, duration: 0.8, delay: 0.1, ease: 'power3.out',
 });

 // Map container
 gsap.to('.job-radar__map-wrapper', {
 opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out',
 });

 // Sidebar
 gsap.to('.radar-sidebar', {
 x: 0, opacity: 1, duration: 0.9, delay: 0.8, ease: 'power3.out',
 });

 // Floating stats
 gsap.to('.floating-stats', {
 x: 0, opacity: 1, duration: 0.9, delay: 1.0, ease: 'power3.out',
 });

 // Live alert
 gsap.to('.live-alert-card', {
 y: 0, opacity: 1, duration: 0.7, delay: 1.3, ease: 'power3.out',
 });

 // Bottom bar
 gsap.to('.bottom-status-bar', {
 y: 0, opacity: 1, duration: 0.7, delay: 1.5, ease: 'power3.out',
 });

 // Markers stagger
 markersRef.current.forEach(({ element, delay }) => {
 gsap.to(element, {
 opacity: 1, scale: 1, duration: 0.7,
 delay: 1.4 + delay, ease: 'back.out(2)',
 });
 });

 // Live badge
 gsap.to('.job-radar__live-badge', {
 opacity: 1, scale: 1, x: '-50%', duration: 0.5, delay: 1.8, ease: 'back.out(1.7)',
 });
 },
 });
 }, sectionRef);

 return () => ctx.revert();
 }, [mapLoaded]);

 const handleResetView = useCallback(() => {
 setActivePin(null);
 mapRef.current?.flyTo({
 center: mapConfig.center,
 zoom: mapConfig.zoom,
 pitch: mapConfig.pitch,
 bearing: mapConfig.bearing,
 duration: 1500,
 });
 }, []);

 const handlePinSelect = useCallback((pin) => {
 setActivePin(pin);
 mapRef.current?.flyTo({
 center: pin.coordinates,
 zoom: 9,
 pitch: 50,
 duration: 1800,
 });
 }, []);

 return (
 <section className="job-radar" ref={sectionRef} id="job-radar">
 {/* Section heading */}
 <div className="job-radar__heading">
 <div className="job-radar__chip">
 <span className="job-radar__chip-dot"></span>
 <span className="job-radar__chip-dot job-radar__chip-dot--delayed"></span>
 Live Monitoring Dashboard
 </div>
 <h2 className="job-radar__title">
 Radar Proyek Inspeksi<br />
 <span className="job-radar__title-accent">Real-Time Indonesia.</span>
 </h2>
 <p className="job-radar__subtitle">
 Pantau ratusan proyek inspeksi drone aktif di seluruh nusantara. Globe view dengan data terupdate setiap detik.
 </p>
 </div>

 {/* Map dashboard */}
 <div className="job-radar__dashboard">
 <div className="job-radar__map-wrapper">
 <div className="job-radar__map" ref={mapContainerRef}></div>

 {/* Soft overlay edges */}
 <div className="job-radar__overlay"></div>

 {/* Sidebar */}
 <RadarSidebar
 pins={pinData}
 activePin={activePin}
 onPinSelect={handlePinSelect}
 onReset={handleResetView}
 />

 {/* Floating Stats (right side) */}
 <FloatingStats stats={statsData} />

 {/* Live Alert Card */}
 <LiveAlertCard alerts={liveAlerts} />

 {/* Active pin detail popup */}
 {activePin && (
 <div className="job-radar__popup">
 <div className="popup__header">
 <span className={`popup__status popup__status--${activePin.status}`}>
 <span className="popup__status-dot"></span>
 {activePin.status === 'urgent' ? 'Urgent' : 'Active'}
 </span>
 <button className="popup__close" onClick={() => setActivePin(null)} aria-label="Close popup">
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
 <path d="M18 6L6 18M6 6l12 12" />
 </svg>
 </button>
 </div>
 <h4 className="popup__title">{activePin.title}</h4>
 <p className="popup__location">
 <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
 <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
 <circle cx="12" cy="10" r="3"/>
 </svg>
 {activePin.location}
 </p>
 <div className="popup__grid">
 <div className="popup__grid-item">
 <span className="popup__grid-label">Budget</span>
 <span className="popup__grid-value popup__grid-value--blue">{activePin.budget}</span>
 </div>
 <div className="popup__grid-item">
 <span className="popup__grid-label">Deadline</span>
 <span className="popup__grid-value">{activePin.deadline}</span>
 </div>
 <div className="popup__grid-item">
 <span className="popup__grid-label">Tipe</span>
 <span className="popup__grid-value">{activePin.type}</span>
 </div>
 <div className="popup__grid-item">
 <span className="popup__grid-label">Pilot Dibutuhkan</span>
 <span className="popup__grid-value">{activePin.pilotNeeded} orang</span>
 </div>
 </div>
 <div className="popup__footer">
 <span className="popup__time">{activePin.postedAgo}</span>
 <button className="popup__cta">
 Detail Proyek
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
 <path d="M5 12h14M12 5l7 7-7 7"/>
 </svg>
 </button>
 </div>
 </div>
 )}

 {/* Live indicator */}
 <div className="job-radar__live-badge">
 <span className="live-badge__dot"></span>
 <span className="live-badge__text">LIVE</span>
 <span className="live-badge__time">Updated 3s ago</span>
 </div>
 </div>

 {/* Bottom Status Bar */}
 <BottomStatusBar pins={pinData} />
 </div>
 </section>
 );
}
