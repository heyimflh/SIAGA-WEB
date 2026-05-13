import { useRef, useEffect, useState, useCallback } from 'react';
import {
  Zap,
  Fuel,
  Route,
  Building2,
  Waves,
  Flame,
  Landmark,
  Globe2,
  FlaskConical,
  Factory,
  Star,
} from 'lucide-react';
import './SektorKredibilitas.css';

/* ════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════ */

const metrics = [
  { end: 500, suffix: '+', prefix: '', label: 'Pilot Bersertifikat' },
  { end: 99.2, suffix: '%', prefix: '', label: 'Akurasi Data Inspeksi', decimals: 1 },
  { end: 47, suffix: '', prefix: '', label: 'Kota Terjangkau' },
  { end: 30, suffix: ' det', prefix: '<', label: 'Waktu Laporan' },
];

const testimonials = [
  {
    monogram: 'BS',
    monogramBg: 'var(--brand-blue)',
    avatar: '/images/avatars/avatar-engineer.png',
    name: 'Ir. Budi Santoso, M.T.',
    role: 'Manajer Pemeliharaan Jaringan',
    company: 'PT Transmisi Nusantara',
    quote:
      'Waktu inspeksi tower kami turun dari 3 hari menjadi 4 jam per site. SIAGA benar-benar mengubah operasional pemeliharaan kami secara menyeluruh.',
  },
  {
    monogram: 'DR',
    monogramBg: '#00897B',
    avatar: '/images/avatars/avatar-hse.png',
    name: 'Dewi Rahayu, S.T.',
    role: 'HSE Supervisor',
    company: 'Energi Lepas Pantai Nasional',
    quote:
      'Zero accident selama 8 bulan berturut-turut sejak menggunakan SIAGA. Platform ini mengubah cara kami melihat dan mengelola risiko inspeksi.',
  },
  {
    monogram: 'RF',
    monogramBg: 'var(--brand-navy)',
    avatar: '/images/avatars/avatar-researcher.png',
    name: 'Dr. Rizky Firmansyah',
    role: 'Kepala Divisi Infrastruktur',
    company: 'Lembaga Riset Teknik Sipil Indonesia',
    quote:
      'Akurasi data konsisten di 99.2% — jauh melampaui metode konvensional. Laporan SIAGA sudah bisa langsung kami jadikan referensi teknis resmi.',
  },
];

const sectorsRow1 = [
  { label: 'Transmisi Listrik', icon: Zap },
  { label: 'Migas & Energi', icon: Fuel },
  { label: 'Jalan Tol & Jembatan', icon: Route },
  { label: 'Konstruksi Tinggi', icon: Building2 },
  { label: 'Bendungan & Irigasi', icon: Waves },
];

const sectorsRow2 = [
  { label: 'Jaringan Gas Bumi', icon: Flame },
  { label: 'Infrastruktur Publik', icon: Landmark },
  { label: 'Penanggulangan Bencana', icon: Globe2 },
  { label: 'Industri Petrokimia', icon: FlaskConical },
  { label: 'Kawasan Industri', icon: Factory },
];

/* ════════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════════ */

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/* ════════════════════════════════════════════════════════
   ANIMATED METRIC NUMBER
   ════════════════════════════════════════════════════════ */

function AnimatedMetric({ end, decimals = 0, suffix = '', prefix = '', duration = 1400 }) {
  // Check reduced motion preference at initial render
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const initialDisplay = prefersReduced
    ? prefix + end.toFixed(decimals) + suffix
    : prefix + '0' + suffix;

  const [display, setDisplay] = useState(initialDisplay);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const startTime = performance.now();

            function animate(now) {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easedProgress = easeOutExpo(progress);
              const current = easedProgress * end;
              const formatted = decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString();
              setDisplay(prefix + formatted + suffix);
              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            }

            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, decimals, suffix, prefix, duration, prefersReduced]);

  return <span ref={ref}>{display}</span>;
}

/* ════════════════════════════════════════════════════════
   TESTIMONIAL ROTATOR
   ════════════════════════════════════════════════════════ */

function TestimonialRotator() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const intervalRef = useRef(null);
  const cardRef = useRef(null);
  const isPaused = useRef(false);

  const goTo = useCallback((index) => {
    setFading(true);
    setTimeout(() => {
      setActiveIndex(index);
      setFading(false);
    }, 400);
  }, []);

  const resetInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    intervalRef.current = setInterval(() => {
      if (!isPaused.current) {
        setFading(true);
        setTimeout(() => {
          setActiveIndex((prev) => (prev + 1) % testimonials.length);
          setFading(false);
        }, 400);
      }
    }, 4000);
  }, []);

  useEffect(() => {
    resetInterval();
    return () => clearInterval(intervalRef.current);
  }, [resetInterval]);

  const handleDotClick = (index) => {
    if (index === activeIndex) return;
    clearInterval(intervalRef.current);
    goTo(index);
    // Restart auto-rotate after manual click
    resetInterval();
  };

  const handleMouseEnter = () => {
    isPaused.current = true;
  };

  const handleMouseLeave = () => {
    isPaused.current = false;
  };

  const current = testimonials[activeIndex];

  return (
    <div className="sektor-testimonial-wrapper">
      <div
        className="sektor-testimonial-card"
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`sektor-testimonial-slide${fading ? ' fade-out' : ''}`}>
          <div className="sektor-testimonial-header">
            <div className="sektor-avatar">
              <img
                src={current.avatar}
                alt={`Avatar ${current.name}`}
                onError={(e) => {
                  // Fallback to monogram if image fails
                  e.target.parentElement.style.display = 'none';
                  e.target.parentElement.nextElementSibling.style.display = 'flex';
                }}
              />
            </div>
            <div
              className="sektor-avatar-monogram"
              style={{ background: current.monogramBg, display: 'none' }}
            >
              {current.monogram}
            </div>
            <div className="sektor-testimonial-info">
              <span className="sektor-testimonial-name">{current.name}</span>
              <span className="sektor-testimonial-role">
                {current.role} — {current.company}
              </span>
            </div>
          </div>

          <div className="sektor-testimonial-stars">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="#E5A100" color="#E5A100" />
            ))}
          </div>

          <p className="sektor-testimonial-quote">&ldquo;{current.quote}&rdquo;</p>
        </div>
      </div>

      <div className="sektor-testimonial-dots" role="tablist" aria-label="Testimonial navigation">
        {testimonials.map((_, i) => (
          <button
            key={i}
            className={`sektor-testimonial-dot${i === activeIndex ? ' active' : ''}`}
            onClick={() => handleDotClick(i)}
            aria-label={`Testimonial ${i + 1}`}
            aria-selected={i === activeIndex}
            role="tab"
          />
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   MARQUEE ROW
   ════════════════════════════════════════════════════════ */

function MarqueeRow({ items, direction = 'left' }) {
  // Duplicate items for seamless loop
  const duplicated = [...items, ...items, ...items, ...items];

  return (
    <div className="sektor-marquee-row">
      <div className="sektor-marquee-wrapper">
        <div
          className={`sektor-marquee-track sektor-marquee-track--${direction}`}
        >
          {duplicated.map((item, i) => {
            const Icon = item.icon;
            return (
              <div className="sektor-pill" key={i}>
                <Icon size={18} strokeWidth={2} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN SECTION COMPONENT
   ════════════════════════════════════════════════════════ */

function SektorKredibilitas() {
  const metricBarRef = useRef(null);

  useEffect(() => {
    const el = metricBarRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('is-visible');
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="sektor-section"
      aria-label="Sektor infrastruktur dan kredibilitas SIAGA"
    >
      {/* Ambient glow orbs for visible depth */}
      <div className="sektor-ambient-orb sektor-ambient-orb--1" aria-hidden="true" />
      <div className="sektor-ambient-orb sektor-ambient-orb--2" aria-hidden="true" />
      <div className="sektor-ambient-orb sektor-ambient-orb--3" aria-hidden="true" />

      {/* Subtle grid texture */}
      <div className="sektor-grid-texture" aria-hidden="true" />

      {/* Glass refraction highlights */}
      <div className="sektor-glass-highlight" aria-hidden="true" />
      <div className="sektor-glass-highlight sektor-glass-highlight-bottom" aria-hidden="true" />

      <div className="sektor-container">
        {/* ── Heading ── */}
        <div className="sektor-heading">
          <h2>
            Dirancang untuk Sektor
            <br />
            Infrastruktur Kritis Indonesia.
          </h2>
          <p>
            Solusi inspeksi aerial yang menjawab kebutuhan nyata
            dari industri-industri paling vital di negeri ini.
          </p>
        </div>

        {/* ── Sub-Section A: Metric Bar ── */}
        <div className="sektor-metric-bar" ref={metricBarRef}>
          {metrics.map((metric, index) => (
            <div className="sektor-metric-item" key={index}>
              <div className="sektor-metric-number">
                <AnimatedMetric
                  end={metric.end}
                  decimals={metric.decimals || 0}
                  suffix={metric.suffix}
                  prefix={metric.prefix}
                  duration={1400}
                />
              </div>
              <span className="sektor-metric-label">{metric.label}</span>
            </div>
          ))}
        </div>

        {/* ── Sub-Section B: Testimonial ── */}
        <TestimonialRotator />

        {/* ── Sub-Section C: Dual Marquee ── */}
        <div className="sektor-marquee-section">
          <p className="sektor-marquee-heading">
            Menjangkau seluruh sektor infrastruktur kritis ↓
          </p>
          <MarqueeRow items={sectorsRow1} direction="left" />
          <MarqueeRow items={sectorsRow2} direction="right" />
        </div>
      </div>
    </section>
  );
}

export default SektorKredibilitas;
