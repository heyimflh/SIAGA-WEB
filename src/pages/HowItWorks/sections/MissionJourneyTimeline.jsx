import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { timelineSteps } from '../data/timeline-data';
import SupportingSectionHeader from '../../SupportingPages/SupportingSectionHeader';
import './MissionJourneyTimeline.css';

/* Step Visual Mockups — detailed product simulations */
function StepOneVisual() {
  return (
    <div className="wf-mockup wf-mockup--form">
      <div className="wf-mockup__header">
        <div className="wf-mockup__dots"><span/><span/><span/></div>
        <span className="wf-mockup__title">New Inspection Project</span>
      </div>
      <div className="wf-mockup__body">
        <div className="wf-field wf-field--active">
          <label>Nama Proyek</label>
          <div className="wf-field__input">
            <span>Inspeksi Tower SUTET #47 — Jawa Barat</span>
            <span className="wf-field__cursor"/>
          </div>
        </div>
        <div className="wf-field">
          <label>Tipe Infrastruktur</label>
          <div className="wf-field__select">
            <span>Transmisi Listrik (SUTET)</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
        <div className="wf-field-row">
          <div className="wf-field">
            <label>Tanggal Mulai</label>
            <div className="wf-field__input"><span>15 Jan 2026</span></div>
          </div>
          <div className="wf-field">
            <label>Durasi</label>
            <div className="wf-field__input"><span>2 Hari</span></div>
          </div>
        </div>
        <div className="wf-field">
          <label>Lokasi</label>
          <div className="wf-field__map">
            <div className="wf-field__map-grid"/>
            <div className="wf-field__map-pin"/>
            <span className="wf-field__map-label">Bandung, Jawa Barat</span>
          </div>
        </div>
        <button className="wf-field__submit" type="button">
          <span>Publish Project</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  );
}

function StepTwoVisual() {
  const pilots = [
    { initials: 'RP', name: 'Rizal Pratama', spec: 'SUTET & Tower', rating: 4.95, dist: '12 km', best: true },
    { initials: 'AP', name: 'Andi Prasetyo', spec: 'Transmisi', rating: 4.8, dist: '28 km', best: false },
    { initials: 'FN', name: 'Fajar Nugroho', spec: 'Konstruksi', rating: 4.7, dist: '45 km', best: false },
  ];
  return (
    <div className="wf-mockup wf-mockup--pilots">
      <div className="wf-mockup__header">
        <div className="wf-mockup__dots"><span/><span/><span/></div>
        <span className="wf-mockup__title">Pilot Matching</span>
      </div>
      <div className="wf-mockup__body">
        <div className="wf-pilots">
          {pilots.map((p) => (
            <div key={p.initials} className={`wf-pilot ${p.best ? 'wf-pilot--best' : ''}`}>
              {p.best && <div className="wf-pilot__badge-best">BEST MATCH</div>}
              <div className="wf-pilot__avatar">{p.initials}</div>
              <div className="wf-pilot__info">
                <span className="wf-pilot__name">{p.name}</span>
                <span className="wf-pilot__spec">{p.spec}</span>
                <div className="wf-pilot__meta">
                  <span className="wf-pilot__rating">★ {p.rating}</span>
                  <span className="wf-pilot__dist">{p.dist}</span>
                </div>
              </div>
              <div className="wf-pilot__verified">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Verified
              </div>
            </div>
          ))}
        </div>
        <button className="wf-field__submit" type="button">
          <span>Select Pilot</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  );
}

function StepThreeVisual() {
  return (
    <div className="wf-mockup wf-mockup--monitor">
      <div className="wf-mockup__header">
        <div className="wf-mockup__dots"><span/><span/><span/></div>
        <span className="wf-mockup__title">Live Mission Dashboard</span>
        <span className="wf-mockup__live-badge"><span className="wf-mockup__live-dot"/>LIVE</span>
      </div>
      <div className="wf-mockup__body">
        {/* Map area */}
        <div className="wf-monitor__map">
          <div className="wf-monitor__map-grid"/>
          <svg className="wf-monitor__map-path" viewBox="0 0 240 100" fill="none">
            <path d="M20 80 C50 30, 100 60, 140 25 C180 -10, 220 50, 220 80" stroke="rgba(0,212,255,0.5)" strokeWidth="2" strokeDasharray="5 3"/>
            <circle cx="20" cy="80" r="4" fill="#00D4FF"/>
            <circle cx="140" cy="25" r="5" fill="#0B7CFF" className="wf-monitor__active-node"/>
            <circle cx="220" cy="80" r="4" fill="rgba(0,212,255,0.3)"/>
          </svg>
          <div className="wf-monitor__waypoints">
            <div className="wf-monitor__wp wf-monitor__wp--done">A</div>
            <div className="wf-monitor__wp wf-monitor__wp--active">B</div>
            <div className="wf-monitor__wp">C</div>
          </div>
        </div>
        {/* Metrics */}
        <div className="wf-monitor__metrics">
          <div className="wf-monitor__metric">
            <span className="wf-monitor__metric-val">127m</span>
            <span className="wf-monitor__metric-lbl">Altitude</span>
          </div>
          <div className="wf-monitor__metric">
            <span className="wf-monitor__metric-val">98%</span>
            <span className="wf-monitor__metric-lbl">Battery</span>
          </div>
          <div className="wf-monitor__metric">
            <span className="wf-monitor__metric-val">67%</span>
            <span className="wf-monitor__metric-lbl">Coverage</span>
          </div>
          <div className="wf-monitor__metric wf-monitor__metric--alert">
            <span className="wf-monitor__metric-val">3</span>
            <span className="wf-monitor__metric-lbl">Defects</span>
          </div>
        </div>
        {/* Feed */}
        <div className="wf-monitor__feed">
          <div className="wf-monitor__feed-item wf-monitor__feed-item--done">
            <span className="wf-monitor__feed-icon">✓</span>
            <span>Tower #47-A inspeksi selesai</span>
            <span className="wf-monitor__feed-time">2m</span>
          </div>
          <div className="wf-monitor__feed-item wf-monitor__feed-item--active">
            <span className="wf-monitor__feed-icon wf-monitor__feed-icon--pulse">●</span>
            <span>Tower #47-B sedang diinspeksi</span>
            <span className="wf-monitor__feed-time">now</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepFourVisual() {
  return (
    <div className="wf-mockup wf-mockup--report">
      <div className="wf-mockup__header">
        <div className="wf-mockup__dots"><span/><span/><span/></div>
        <span className="wf-mockup__title">Report Generator</span>
      </div>
      <div className="wf-mockup__body">
        <div className="wf-report__preview">
          <div className="wf-report__cover">
            <div className="wf-report__cover-badge">INSPECTION REPORT</div>
            <div className="wf-report__cover-title">Tower SUTET #47</div>
            <div className="wf-report__cover-subtitle">Bandung, Jawa Barat — Jan 2026</div>
            <div className="wf-report__cover-lines">
              <div className="wf-report__line"/><div className="wf-report__line wf-report__line--short"/>
              <div className="wf-report__line"/><div className="wf-report__line wf-report__line--med"/>
            </div>
          </div>
          <div className="wf-report__meta">
            <span className="wf-report__tag">PDF</span>
            <span className="wf-report__size">12.4 MB</span>
            <span className="wf-report__pages">47 Pages</span>
          </div>
          <div className="wf-report__findings">
            <span className="wf-report__findings-title">Temuan Inspeksi</span>
            <div className="wf-report__finding-item">
              <span className="wf-report__finding-dot wf-report__finding-dot--critical"/>
              <span>Korosi pada joint #12 — Kritis</span>
            </div>
            <div className="wf-report__finding-item">
              <span className="wf-report__finding-dot wf-report__finding-dot--warning"/>
              <span>Kabel kendor section B — Perhatian</span>
            </div>
            <div className="wf-report__finding-item">
              <span className="wf-report__finding-dot wf-report__finding-dot--ok"/>
              <span>Struktur utama — Baik</span>
            </div>
          </div>
        </div>
        <button className="wf-field__submit wf-field__submit--report" type="button">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  );
}

const stepVisuals = [<StepOneVisual key="v1"/>, <StepTwoVisual key="v2"/>, <StepThreeVisual key="v3"/>, <StepFourVisual key="v4"/>];

export default function MissionJourneyTimeline() {
  const stepsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('wf-step--visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    stepsRef.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="wf-simulation">
      <div className="wf-simulation__container">
        <SupportingSectionHeader
          eyebrow="MISSION JOURNEY"
          title="Cara Kerja SIAGA"
          subtitle="Empat tahap sederhana untuk mengubah kebutuhan inspeksi menjadi laporan siap presentasi."
        />

        <div className="wf-simulation__steps">
          {timelineSteps.map((step, i) => (
            <div
              key={step.id}
              id={`workflow-step-${step.id}`}
              data-step-id={step.id}
              className="wf-step"
              ref={(el) => { stepsRef.current[i] = el; }}
            >
              {/* Text side */}
              <div className="wf-step__text">
                <div className="wf-step__number">{step.id}</div>
                <span className="wf-step__label">{step.label}</span>
                <h3 className="wf-step__title">{step.title}</h3>
                <p className="wf-step__desc">{step.description}</p>
                <ul className="wf-step__bullets">
                  {step.bullets.map((b) => (
                    <li key={b} className="wf-step__bullet">
                      <span className="wf-step__bullet-dot"/>
                      {b}
                    </li>
                  ))}
                </ul>
                {step.cta && (
                  <Link to={step.cta.href} className="wf-step__cta">{step.cta.text}</Link>
                )}
              </div>

              {/* Visual side */}
              <div className="wf-step__visual">
                {stepVisuals[i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
