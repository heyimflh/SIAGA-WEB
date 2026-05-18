import { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  Briefcase,
  Users,
  Map as MapIcon,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Clock,
  Wallet,
  Activity,
  Wifi,
} from 'lucide-react';
import { pinData, mapConfig, statsData, liveAlerts } from './pinData';
import './JobRadarMobileTablet.css';

gsap.registerPlugin(ScrollTrigger);

const FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: 'urgent', label: 'Urgent' },
  { key: 'active', label: 'Aktif' },
];

const STAT_ICONS = {
  briefcase: Briefcase,
  users: Users,
  map: MapIcon,
  alert: AlertTriangle,
};

export default function JobRadarMobileTablet() {
  const sectionRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const stageRef = useRef(null);
  const [filter, setFilter] = useState('all');
  const [activeAlertIdx, setActiveAlertIdx] = useState(0);
  const [activePinId, setActivePinId] = useState(null);

  // Auto-cycle live activity
  useEffect(() => {
    const id = setInterval(() => {
      setActiveAlertIdx((i) => (i + 1) % liveAlerts.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // Initialize Mapbox
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = mapConfig.accessToken;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapConfig.style,
      center: mapConfig.center,
      zoom: 3.6,
      pitch: 0,
      bearing: 0,
      antialias: true,
      attributionControl: false,
      projection: 'globe',
      interactive: true,
      dragRotate: false,
    });

    // Disable scroll-zoom to avoid hijacking page scroll on mobile
    map.scrollZoom.disable();

    map.on('style.load', () => {
      map.setFog({
        color: 'rgba(220, 235, 255, 0.7)',
        'high-color': 'rgba(180, 210, 255, 0.4)',
        'horizon-blend': 0.08,
        'space-color': 'rgba(240, 246, 255, 1.0)',
        'star-intensity': 0.0,
      });
    });

    map.on('load', () => {
      // Add markers and store with their pin id for later activation
      pinData.forEach((pin) => {
        const el = document.createElement('div');
        el.className = `mrcc-marker ${pin.status === 'urgent' ? 'mrcc-marker--urgent' : 'mrcc-marker--active'}`;
        el.dataset.pinId = pin.id;
        el.innerHTML = `
          <span class="mrcc-marker__pulse"></span>
          <span class="mrcc-marker__dot"></span>
        `;
        // Tap marker → also activate pin
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          handlePinSelect(pin);
        });
        const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat(pin.coordinates)
          .addTo(map);
        markersRef.current.push({ marker, element: el, id: pin.id });
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

  // Pin select handler — fly map to coordinates and mark active
  const handlePinSelect = (pin) => {
    setActivePinId(pin.id);

    if (mapRef.current) {
      mapRef.current.flyTo({
        center: pin.coordinates,
        zoom: 7.5,
        pitch: 35,
        duration: 1600,
        essential: true,
      });
    }

    // Update marker classes for visual feedback
    markersRef.current.forEach(({ element, id }) => {
      if (id === pin.id) {
        element.classList.add('mrcc-marker--selected');
      } else {
        element.classList.remove('mrcc-marker--selected');
      }
    });

    // Smooth scroll the map stage into view so user sees the result
    if (stageRef.current) {
      const rect = stageRef.current.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      if (!isVisible) {
        stageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Reset map view
  const handleResetView = () => {
    setActivePinId(null);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: mapConfig.center,
        zoom: 3.6,
        pitch: 0,
        bearing: 0,
        duration: 1400,
      });
    }
    markersRef.current.forEach(({ element }) => {
      element.classList.remove('mrcc-marker--selected');
    });
  };

  // GSAP entrance
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.mrcc-header > *',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        '.mrcc-stage',
        { y: 30, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.mrcc-stage',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        '.mrcc-stat-chip',
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.mrcc-stats',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        ['.mrcc-radar', '.mrcc-activity'],
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.mrcc-radar',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const filteredPins = useMemo(() => {
    if (filter === 'all') return pinData;
    return pinData.filter((p) => p.status === filter);
  }, [filter]);

  const filterCounts = useMemo(
    () => ({
      all: pinData.length,
      urgent: pinData.filter((p) => p.status === 'urgent').length,
      active: pinData.filter((p) => p.status === 'active').length,
    }),
    []
  );

  const activeAlert = liveAlerts[activeAlertIdx];

  return (
    <section className="mrcc" ref={sectionRef} id="job-radar">
      <div className="mrcc-bg" aria-hidden="true">
        <div className="mrcc-bg-grid" />
        <div className="mrcc-bg-glow" />
      </div>

      <div className="mrcc-container">
        {/* 1. Header */}
        <header className="mrcc-header">
          <div className="mrcc-eyebrow">
            <span className="mrcc-eyebrow-dot" />
            LIVE RADAR
          </div>
          <h2 className="mrcc-title">
            Pantau Proyek Drone
            <br />
            <span className="mrcc-title-accent">Real-Time di Indonesia</span>
          </h2>
          <p className="mrcc-subtitle">
            Pantau ratusan proyek inspeksi drone aktif di seluruh nusantara
            dengan data terbaru setiap detik.
          </p>
        </header>

        {/* 2. Live Status Bar */}
        <div className="mrcc-status">
          <div className="mrcc-status-left">
            <span className="mrcc-status-dot" />
            <span className="mrcc-status-label">LIVE</span>
            <span className="mrcc-status-time">Updated 3s ago</span>
          </div>
          <div className="mrcc-status-right">
            <Wifi size={12} strokeWidth={2.2} />
            <span>12ms</span>
          </div>
        </div>

        {/* 3. Mobile Map Stage */}
        <div className="mrcc-stage" ref={stageRef} aria-label="Indonesia inspection map">
          <div className="mrcc-stage-frame">
            <div className="mrcc-stage-map" ref={mapContainerRef} />
            <div className="mrcc-stage-tag">
              <span className="mrcc-stage-tag-dot" />
              {pinData.length} TITIK AKTIF
            </div>
            {activePinId && (
              <button
                type="button"
                className="mrcc-stage-reset"
                onClick={handleResetView}
                aria-label="Reset map view"
              >
                Reset View
              </button>
            )}
          </div>
        </div>

        {/* 4. Quick Stats — 2x2 grid */}
        <div className="mrcc-stats">
          {statsData.map((s) => {
            const Icon = STAT_ICONS[s.icon];
            return (
              <div className="mrcc-stat-chip" key={s.label} style={{ '--chip-color': s.color }}>
                <div className="mrcc-stat-icon">
                  <Icon size={14} strokeWidth={2.2} />
                </div>
                <div className="mrcc-stat-text">
                  <span className="mrcc-stat-value">
                    {s.value}
                    {s.suffix}
                  </span>
                  <span className="mrcc-stat-label">{s.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 5. Job Radar Card */}
        <div className="mrcc-radar">
          <div className="mrcc-radar-header">
            <div className="mrcc-radar-title-group">
              <div className="mrcc-radar-icon">
                <Activity size={16} strokeWidth={2.2} />
              </div>
              <div>
                <h3 className="mrcc-radar-title">Job Radar</h3>
                <p className="mrcc-radar-meta">{filteredPins.length} proyek terdeteksi</p>
              </div>
            </div>
          </div>

          {/* Filter Chips — horizontal scroll fallback */}
          <div className="mrcc-filters">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`mrcc-filter ${filter === f.key ? 'mrcc-filter--active' : ''} ${
                  f.key === 'urgent' ? 'mrcc-filter--urgent' : ''
                }`}
              >
                <span>{f.label}</span>
                <span className="mrcc-filter-badge">{filterCounts[f.key]}</span>
              </button>
            ))}
          </div>

          {/* Pin list — scrollable, all items */}
          <div className="mrcc-list" role="list">
            {filteredPins.map((pin) => (
              <button
                type="button"
                role="listitem"
                className={`mrcc-pin ${activePinId === pin.id ? 'mrcc-pin--active' : ''}`}
                key={pin.id}
                onClick={() => handlePinSelect(pin)}
                aria-pressed={activePinId === pin.id}
              >
                <div className="mrcc-pin-top">
                  <span
                    className={`mrcc-pin-status mrcc-pin-status--${pin.status}`}
                  >
                    <span className="mrcc-pin-status-dot" />
                    {pin.status === 'urgent' ? 'Urgent' : 'Aktif'}
                  </span>
                  <span className="mrcc-pin-time">{pin.postedAgo}</span>
                </div>

                <h4 className="mrcc-pin-title">{pin.title}</h4>

                <div className="mrcc-pin-meta">
                  <span className="mrcc-pin-loc">
                    <MapPin size={11} strokeWidth={2.2} />
                    {pin.location}
                  </span>
                </div>

                <div className="mrcc-pin-foot">
                  <span className="mrcc-pin-budget">
                    <Wallet size={12} strokeWidth={2.2} />
                    {pin.budget}
                  </span>
                  <span className="mrcc-pin-dl">
                    <Clock size={12} strokeWidth={2.2} />
                    {pin.deadline}
                  </span>
                  <ArrowRight
                    className="mrcc-pin-arrow"
                    size={14}
                    strokeWidth={2.2}
                    aria-hidden="true"
                  />
                </div>
              </button>
            ))}
          </div>

          {/* CTA */}
          <a href="#" className="mrcc-radar-cta">
            <span>Jelajahi Semua Proyek</span>
            <ArrowRight size={16} strokeWidth={2.2} />
          </a>
        </div>

        {/* 6. Live Activity Card */}
        <div className="mrcc-activity">
          <div className="mrcc-activity-header">
            <span className="mrcc-activity-label">
              <Activity size={12} strokeWidth={2.2} />
              LIVE ACTIVITY
            </span>
            <span className="mrcc-activity-counter">
              {activeAlertIdx + 1}/{liveAlerts.length}
            </span>
          </div>
          <div
            className={`mrcc-activity-body ${activeAlert.type === 'urgent' ? 'mrcc-activity-body--urgent' : ''}`}
            key={activeAlert.id}
          >
            {activeAlert.type === 'urgent' && (
              <span className="mrcc-activity-badge">URGENT</span>
            )}
            <p className="mrcc-activity-msg">{activeAlert.message}</p>
            <span className="mrcc-activity-time">{activeAlert.time}</span>
          </div>
          <div className="mrcc-activity-progress" key={`p-${activeAlert.id}`}>
            <div className="mrcc-activity-progress-fill" />
          </div>
        </div>

        {/* 7. Bottom system status */}
        <div className="mrcc-system">
          <div className="mrcc-system-chip">
            <span className="mrcc-system-dot" />
            System Online
          </div>
          <div className="mrcc-system-chip">
            <Wifi size={11} strokeWidth={2.2} />
            12ms
          </div>
          <div className="mrcc-system-chip">
            <span className="mrcc-system-up">99.8%</span>
            Uptime
          </div>
        </div>
      </div>
    </section>
  );
}
