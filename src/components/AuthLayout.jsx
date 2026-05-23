import { Suspense, lazy } from 'react';
import { AuthDroneErrorBoundary } from './AuthDroneErrorBoundary';
import './AuthLayout.css';

const AuthDroneScene = lazy(() => import('./AuthDroneScene'));

function DronePlaceholder() {
 return (
 <div className="auth-drone-placeholder" aria-hidden="true">
 <div className="auth-drone-placeholder__loader">
 <div className="auth-drone-placeholder__pulse" />
 <span>Loading drone...</span>
 </div>
 </div>
 );
}


function FloatingCards() {
 return (
 <div className="auth-floating-cards" aria-hidden="true">
 <div className="auth-floating-card auth-floating-card--top-right">
 <span className="auth-floating-card__value">128+</span>
 <span className="auth-floating-card__label">Proyek Aktif</span>
 </div>
 <div className="auth-floating-card auth-floating-card--bottom-left">
 <span className="auth-floating-card__icon">◉</span>
 <span className="auth-floating-card__label">Real-time Monitoring</span>
 </div>
 <div className="auth-floating-card auth-floating-card--bottom-right">
 <span className="auth-floating-card__value">99.8%</span>
 <span className="auth-floating-card__label">Uptime</span>
 </div>
 <div className="auth-floating-card auth-floating-card--top-left">
 <span className="auth-floating-card__value">42</span>
 <span className="auth-floating-card__label">Pilot Online</span>
 </div>
 </div>
 );
}

export default function AuthLayout({ children }) {
 return (
 <div className="auth-layout-premium">
 <aside className="auth-left-panel">
 <div className="auth-left-panel__bg-effects" aria-hidden="true">
 <div className="auth-left-panel__grid" />
 <div className="auth-left-panel__radial-glow" />
 <div className="auth-left-panel__radar-ring" />
 <div className="auth-left-panel__radar-ring auth-left-panel__radar-ring--2" />
 </div>

 <div className="auth-left-panel__content">
 <img
 src="/images/logo/siaga-full.png"
 alt="SIAGA"
 className="auth-left-panel__logo"
 />

 <div className="auth-left-panel__branding">
 <h1 className="auth-left-panel__headline">
 Masuk ke Sistem<br />
 <span className="auth-left-panel__headline-accent">Inspeksi Aerial</span><br />
 Generasi Baru
 </h1>
 <p className="auth-left-panel__subheadline">
 Pantau, kelola, dan operasikan inspeksi drone
 dalam satu platform geospasial profesional.
 </p>
 </div>

 <div className="auth-left-panel__drone-stage">
 <AuthDroneErrorBoundary>
 <Suspense fallback={<DronePlaceholder />}>
 <AuthDroneScene />
 </Suspense>
 </AuthDroneErrorBoundary>
 <FloatingCards />
 </div>
 </div>
 </aside>


 <section className="auth-right-panel">
 <div className="auth-right-panel__bg-effects" aria-hidden="true">
 <div className="auth-right-panel__orb" />
 <div className="auth-right-panel__grid" />
 </div>
 <div className="auth-right-panel__content">
 {children}
 </div>
 </section>
 </div>
 );
}
