import { Suspense, lazy } from 'react';
import { AuthDroneErrorBoundary } from './AuthDroneErrorBoundary';
import './RegisterLayout.css';

/* ──────────────────────────────────────────────────────────────
 * RegisterLayout — Green-Cyan Infrastructure Registration Shell
 *
 * Layout (opposite of AuthLayout):
 * - >= 1280px : 55/45 split, form LEFT, tower visual RIGHT
 * - 1024–1279 : 58/42 split compact
 * - 768–1023 : stacked, top tower hero + register card
 * - < 768px : stacked, brand header + mini tower hero + register card
 *
 * Visual:
 * - Left: soft mint/white frosted background + glass register card
 * - Right: green-cyan-teal gradient + 3D Tower SUTET + floating cards
 * ────────────────────────────────────────────────────────────── */

const RegisterTowerScene = lazy(() => import('./RegisterTowerScene'));

function TowerPlaceholder() {
 return (
 <div className="register-tower-placeholder" aria-hidden="true">
 <div className="register-tower-placeholder__loader">
 <div className="register-tower-placeholder__pulse" />
 <span>Loading infrastructure...</span>
 </div>
 </div>
 );
}

/* Floating insight cards */
function FloatingInsightCards() {
 return (
 <div className="register-floating-cards" aria-hidden="true">
 <div className="register-floating-card register-floating-card--top-right">
 <span className="register-floating-card__value">128+</span>
 <span className="register-floating-card__label">Aset Terpantau</span>
 </div>
 <div className="register-floating-card register-floating-card--bottom-left">
 <span className="register-floating-card__value">19</span>
 <span className="register-floating-card__label">Provinsi Tercover</span>
 </div>
 <div className="register-floating-card register-floating-card--bottom-right">
 <span className="register-floating-card__value">42</span>
 <span className="register-floating-card__label">Pilot Terverifikasi</span>
 </div>
 <div className="register-floating-card register-floating-card--top-left">
 <span className="register-floating-card__value">99.8%</span>
 <span className="register-floating-card__label">Data Uptime</span>
 </div>
 </div>
 );
}

export default function RegisterLayout({ children }) {
 return (
 <div className="register-layout">
 {/* ── Left Form Area ── */}
 <section className="register-left-panel">
 <div className="register-left-panel__bg-effects" aria-hidden="true">
 <div className="register-left-panel__orb" />
 <div className="register-left-panel__grid" />
 </div>
 <div className="register-left-panel__content">
 {children}
 </div>
 </section>

 {/* ── Right Tower Visual Panel ── */}
 <aside className="register-right-panel">
 <div className="register-right-panel__bg-effects" aria-hidden="true">
 <div className="register-right-panel__grid" />
 <div className="register-right-panel__radial-glow" />
 <div className="register-right-panel__radar-ring" />
 <div className="register-right-panel__radar-ring register-right-panel__radar-ring--2" />
 </div>

 <div className="register-right-panel__content">
 <div className="register-right-panel__header">
 <div className="register-right-panel__badge">
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <path d="M2 20h20M5 20V8l7-5 7 5v12"/>
 <path d="M9 20v-4h6v4"/>
 </svg>
 <span>Infrastructure Network</span>
 </div>
 <img
 src="/images/logo/siaga-full.png"
 alt="SIAGA"
 className="register-right-panel__logo"
 />
 </div>

 <h2 className="register-right-panel__headline">
 Bangun Jaringan<br />
 <span className="register-right-panel__headline-accent">Inspeksi Infrastruktur</span><br />
 Bersama SIAGA
 </h2>

 <p className="register-right-panel__subheadline">
 Gabungkan aset, pilot, dan data geospasial dalam satu platform
 inspeksi aerial yang aman, cepat, dan terukur.
 </p>

 <div className="register-right-panel__tower-stage">
 <AuthDroneErrorBoundary>
 <Suspense fallback={<TowerPlaceholder />}>
 <RegisterTowerScene />
 </Suspense>
 </AuthDroneErrorBoundary>
 <FloatingInsightCards />
 </div>
 </div>
 </aside>
 </div>
 );
}
