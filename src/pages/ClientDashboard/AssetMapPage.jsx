/**
 * AssetMapPage — Full-screen Asset Monitoring Map
 *
 * Route: /dashboard/client/asset-map
 * Role: client only
 *
 * Premium full-page map view with:
 * - Full-screen Mapbox map with dark style
 * - Floating HUD stats panel
 * - Asset filter chips
 * - Legend overlay
 * - Asset detail sidebar/drawer on pin click
 * - Responsive layout
 */

import { useState, useCallback, useMemo, useEffect, useRef, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  ArrowLeft,
  MapPin,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  X,
  Calendar,
  User,
  Layers,
  Activity,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { ROUTES } from '../../routes/appRoutes';
import { mockData } from './mock-data.js';
import { selectCompanyByEmail } from './utils/selectors.js';
import './AssetMapPage.css';

const STATUS_CONFIG = {
  kritis: { label: 'Kritis', color: '#EF4444', icon: AlertTriangle },
  perlu_perhatian: { label: 'Perlu Perhatian', color: '#F59E0B', icon: AlertCircle },
  aman: { label: 'Aman', color: '#10B981', icon: CheckCircle2 },
};

const FILTER_OPTIONS = [
  { value: 'all', label: 'Semua Aset' },
  { value: 'kritis', label: 'Kritis' },
  { value: 'perlu_perhatian', label: 'Perlu Perhatian' },
  { value: 'aman', label: 'Aman' },
];

function computeCenter(assets) {
  if (!assets || assets.length === 0) return [110.0, -7.0];
  const sumLng = assets.reduce((acc, a) => acc + a.lng, 0);
  const sumLat = assets.reduce((acc, a) => acc + a.lat, 0);
  return [sumLng / assets.length, sumLat / assets.length];
}

export default function AssetMapPage() {
  const { session } = useAuth();
  const assets = mockData.assets;

  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState(null);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  // Stats
  const stats = useMemo(() => {
    const kritis = assets.filter((a) => a.status === 'kritis').length;
    const perhatian = assets.filter((a) => a.status === 'perlu_perhatian').length;
    const aman = assets.filter((a) => a.status === 'aman').length;
    return { total: assets.length, kritis, perhatian, aman };
  }, [assets]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: computeCenter(assets),
      zoom: 7,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'bottom-right');

    map.on('load', () => {
      assets.forEach((asset) => {
        const el = document.createElement('div');
        el.className = `amap-pin amap-pin--${asset.status}`;
        if (asset.status === 'kritis') el.classList.add('amap-pin--pulse');

        el.setAttribute('role', 'button');
        el.setAttribute('aria-label', `${asset.nama}, status ${asset.status}`);
        el.setAttribute('tabindex', '0');

        el.addEventListener('click', () => setSelectedAsset(asset));
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelectedAsset(asset);
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

  // Filter visibility
  useEffect(() => {
    markersRef.current.forEach(({ element, asset }) => {
      if (activeFilter === 'all') {
        element.style.display = '';
      } else {
        element.style.display = asset.status === activeFilter ? '' : 'none';
      }
    });
  }, [activeFilter]);

  // Fly to asset on select
  useEffect(() => {
    if (selectedAsset && mapRef.current) {
      mapRef.current.flyTo({
        center: [selectedAsset.lng, selectedAsset.lat],
        zoom: 10,
        duration: 1200,
      });
    }
  }, [selectedAsset]);

  const handleCloseDrawer = useCallback(() => setSelectedAsset(null), []);

  return (
    <div className="amap-page">
      {/* Full-screen Map */}
      <div className="amap-page__map" ref={mapContainerRef} />

      {/* Top Bar Overlay */}
      <div className="amap-page__topbar">
        <Link to={ROUTES.clientDashboard} className="amap-page__back">
          <ArrowLeft size={18} />
          <span>Dashboard</span>
        </Link>
        <h1 className="amap-page__title">
          <Layers size={18} />
          Asset Monitoring Map
        </h1>
        <div className="amap-page__live-badge">
          <Activity size={12} />
          <span>Live</span>
        </div>
      </div>

      {/* Stats HUD */}
      <div className="amap-page__hud">
        <div className="amap-hud__item">
          <span className="amap-hud__value">{stats.total}</span>
          <span className="amap-hud__label">Total Aset</span>
        </div>
        <div className="amap-hud__item amap-hud__item--kritis">
          <span className="amap-hud__value">{stats.kritis}</span>
          <span className="amap-hud__label">Kritis</span>
        </div>
        <div className="amap-hud__item amap-hud__item--perhatian">
          <span className="amap-hud__value">{stats.perhatian}</span>
          <span className="amap-hud__label">Perhatian</span>
        </div>
        <div className="amap-hud__item amap-hud__item--aman">
          <span className="amap-hud__value">{stats.aman}</span>
          <span className="amap-hud__label">Aman</span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="amap-page__filters">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`amap-filter ${activeFilter === opt.value ? 'amap-filter--active' : ''}`}
            onClick={() => setActiveFilter(opt.value)}
          >
            {opt.value !== 'all' && (
              <span
                className="amap-filter__dot"
                style={{ background: STATUS_CONFIG[opt.value]?.color }}
              />
            )}
            {opt.label}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="amap-page__legend">
        <span className="amap-legend__title">Status</span>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} className="amap-legend__item">
            <span className="amap-legend__dot" style={{ background: cfg.color }} />
            <span>{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* Asset Detail Drawer */}
      {selectedAsset && (
        <div className="amap-drawer">
          <div className="amap-drawer__header">
            <div className="amap-drawer__header-info">
              <span
                className="amap-drawer__status-badge"
                style={{ background: STATUS_CONFIG[selectedAsset.status]?.color }}
              >
                {STATUS_CONFIG[selectedAsset.status]?.label}
              </span>
              <h2 className="amap-drawer__title">{selectedAsset.nama}</h2>
            </div>
            <button
              type="button"
              className="amap-drawer__close"
              onClick={handleCloseDrawer}
              aria-label="Tutup detail"
            >
              <X size={18} />
            </button>
          </div>

          <div className="amap-drawer__image">
            <img src={selectedAsset.foto_url} alt={selectedAsset.nama} />
          </div>

          <div className="amap-drawer__details">
            <div className="amap-drawer__detail-row">
              <MapPin size={14} />
              <span>Kategori: <strong>{selectedAsset.kategori}</strong></span>
            </div>
            <div className="amap-drawer__detail-row">
              <Calendar size={14} />
              <span>Inspeksi terakhir: <strong>{selectedAsset.inspeksi_terakhir.tanggal}</strong></span>
            </div>
            <div className="amap-drawer__detail-row">
              <User size={14} />
              <span>Pilot: <strong>{selectedAsset.inspeksi_terakhir.pilot_nama}</strong></span>
            </div>
          </div>

          <div className="amap-drawer__coords">
            <span>Lat: {selectedAsset.lat.toFixed(4)}</span>
            <span>Lng: {selectedAsset.lng.toFixed(4)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
