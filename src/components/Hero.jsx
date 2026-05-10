import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Camera, Radio, BatteryFull, Crosshair } from 'lucide-react';
import Scene from './Scene';

export default function Hero() {
  const containerRef = useRef(null);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let rafId;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const animateParallax = () => {
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      if (containerRef.current) {
        const floaters = containerRef.current.querySelectorAll('.hero-floater');
        floaters.forEach((floater, i) => {
          const speed = (i + 1) * 12;
          gsap.set(floater, { x: targetX * speed, y: targetY * speed });
        });
        const sphere = containerRef.current.querySelector('.hero-gradient-sphere');
        if (sphere) gsap.set(sphere, { x: targetX * -30, y: targetY * -30 });
      }
      rafId = requestAnimationFrame(animateParallax);
    };
    rafId = requestAnimationFrame(animateParallax);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Background layers
      tl.to('.hero-grid-bg', { opacity: 0.5, duration: 1.8 }, 0);
      tl.to('.hero-glow-orb', { opacity: 1, duration: 2.5, stagger: 0.3 }, 0);
      tl.to('.hero-gradient-sphere', { opacity: 1, duration: 2 }, 0.2);

      // Decorative floaters
      tl.fromTo('.hero-floater',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, stagger: 0.15, ease: 'back.out(1.5)' },
        0.3
      );

      // Eyebrow
      tl.fromTo('.hero-eyebrow',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        0.4
      );

      // Title words
      tl.fromTo('.hero-title .word',
        { y: '110%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.9, stagger: 0.07 },
        0.6
      );

      // Underline
      tl.to('.hero-title-underline', { scaleX: 1, duration: 0.7, ease: 'power3.inOut' }, 1.5);

      // Subtitle
      tl.fromTo('.hero-subtitle',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        1.7
      );

      // CTA group
      tl.fromTo('.hero-cta-group',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        2.0
      );

      // Spec badges
      tl.fromTo('.hero-spec-badge',
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.8)' },
        2.3
      );

      // Trust bar
      tl.fromTo('.hero-trust-bar',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        2.6
      );

      // Scroll indicator
      tl.to('.hero-scroll-indicator', { opacity: 1, duration: 0.6 }, 3.0);
    }, containerRef);

    return () => {
      ctx.revert();
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="hero" ref={containerRef}>
      {/* ── Background layers ── */}
      <div className="hero-grid-bg" />

      {/* Gradient sphere — large glowing backdrop behind drone */}
      <div className="hero-gradient-sphere" />

      {/* Ambient glow orbs */}
      <div className="hero-glow-orb hero-glow-1" />
      <div className="hero-glow-orb hero-glow-2" />
      <div className="hero-glow-orb hero-glow-3" />

      {/* ── Decorative floating elements ── */}
      <div className="hero-floater floater-dot-1" />
      <div className="hero-floater floater-dot-2" />
      <div className="hero-floater floater-dot-3" />
      <div className="hero-floater floater-line-1" />
      <div className="hero-floater floater-line-2" />
      <div className="hero-floater floater-cross" />
      <div className="hero-floater floater-diamond" />

      {/* ── Text content ── */}
      <div className="hero-content">
        <p className="hero-eyebrow">
          Platform Inspeksi Drone #1 Indonesia
        </p>

        <h1 className="hero-title">
          <span className="line">
            <span className="word">Infrastruktur</span>
          </span>
          <span className="line">
            <span className="word">Anda&nbsp;</span>
            <span className="word">Selalu</span>
          </span>
          <span className="line">
            <span className="word">dalam&nbsp;</span>
            <span className="hero-title-highlight word">
              Pengawasan.
              <span className="hero-title-underline" />
            </span>
          </span>
        </h1>

        <p className="hero-subtitle">
          Sistem B2B marketplace inspeksi aerial untuk infrastruktur kritis — menara SUTET, jembatan, dan kilang minyak.
        </p>

        <div className="hero-cta-group">
          <a href="#hire" className="btn btn-hero-primary">
            <span>Hire a Pilot</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </a>
          <a href="#join" className="btn btn-hero-secondary">
            Bergabung sebagai Pilot
          </a>
        </div>
      </div>

      {/* ── 3D drone scene ── */}
      <div className="hero-3d-container">
        <Scene />

        {/* Floating spec badges */}
        <div className="hero-spec-badge badge-cam">
          <Camera size={15} strokeWidth={2} />
          <div className="badge-text">
            <span className="badge-value">45MP</span>
            <span className="badge-label">Full-Frame</span>
          </div>
        </div>

        <div className="hero-spec-badge badge-radio">
          <Radio size={15} strokeWidth={2} />
          <div className="badge-text">
            <span className="badge-value">15KM</span>
            <span className="badge-label">Jangkauan</span>
          </div>
        </div>

        <div className="hero-spec-badge badge-battery">
          <BatteryFull size={15} strokeWidth={2} />
          <div className="badge-text">
            <span className="badge-value">55 Min</span>
            <span className="badge-label">Waktu Terbang</span>
          </div>
        </div>

        <div className="hero-spec-badge badge-gps">
          <Crosshair size={15} strokeWidth={2} />
          <div className="badge-text">
            <span className="badge-value">±1cm</span>
            <span className="badge-label">RTK Akurasi</span>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="hero-trust-bar">
        <div className="trust-item">
          <span className="trust-number">500+</span>
          <span className="trust-label">Pilot Tersertifikasi</span>
        </div>
        <div className="trust-sep" />
        <div className="trust-item">
          <span className="trust-number">1.200+</span>
          <span className="trust-label">Menara Terinspeksi</span>
        </div>
        <div className="trust-sep" />
        <div className="trust-item">
          <span className="trust-number">47</span>
          <span className="trust-label">Kota Aktif</span>
        </div>
        <div className="trust-sep" />
        <div className="trust-item">
          <span className="trust-number">99.8%</span>
          <span className="trust-label">Uptime Platform</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator">
        <div className="scroll-line" />
        <span className="scroll-text">Scroll</span>
      </div>
    </section>
  );
}
