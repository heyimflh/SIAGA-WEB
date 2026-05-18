import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Lock,
  BadgeCheck,
  RefreshCcw,
  ShieldCheck,
} from 'lucide-react';
import './TrustSafety.css';

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    id: 1,
    icon: Lock,
    headline: 'Dana Aman di Escrow',
    body: 'Pembayaran ditahan SIAGA sampai laporan inspeksi disetujui. Pilot terjamin dibayar, perusahaan terjamin menerima hasil sesuai.',
    borderColor: 'var(--brand-blue)',
    visualType: 'escrow',
  },
  {
    id: 2,
    icon: BadgeCheck,
    headline: 'Setiap Pilot Tervalidasi',
    body: 'Sertifikat, lisensi drone, dan riwayat pekerjaan diverifikasi sebelum pilot dapat mengikuti bidding proyek.',
    borderColor: 'var(--brand-cyan)',
    visualType: 'verified',
  },
  {
    id: 3,
    icon: RefreshCcw,
    headline: 'Reputasi Dua Arah',
    body: 'Perusahaan menilai pilot, pilot menilai perusahaan. Setiap proyek selesai membentuk track record digital yang transparan.',
    borderColor: 'var(--color-success)',
    visualType: 'rating',
  },
  {
    id: 4,
    icon: ShieldCheck,
    headline: 'Data Inspeksi Terlindungi',
    body: 'Foto, video, koordinat GPS, dan dokumen aset diproses dengan kontrol akses, watermark, dan perlindungan data yang ketat.',
    borderColor: 'var(--brand-navy)',
    visualType: 'encryption',
  },
];

/* ── Mini Visual: Escrow Flow ── */
function EscrowVisual() {
  const nodesRef = useRef([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const nodes = nodesRef.current.filter(Boolean);
    if (!nodes.length) return;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
    nodes.forEach((node, i) => {
      tl.to(node, {
        scale: 1.2,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      }, i * 0.5);
      tl.to(node, {
        scale: 1,
        opacity: 0.6,
        duration: 0.3,
        ease: 'power2.in',
      }, i * 0.5 + 0.4);
    });

    return () => tl.kill();
  }, []);

  const steps = ['Client', 'Hold', 'Work', 'Done'];

  return (
    <div className="ts-visual ts-visual--escrow">
      <div className="ts-escrow-flow">
        {steps.map((step, i) => (
          <div key={step} className="ts-escrow-step">
            <div
              className="ts-escrow-node"
              ref={(el) => (nodesRef.current[i] = el)}
            >
              <span>{step}</span>
            </div>
            {i < steps.length - 1 && <div className="ts-escrow-line" />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Mini Visual: Verified Badge ── */
function VerifiedVisual() {
  const badgeRef = useRef(null);
  const barsRef = useRef([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    if (!badgeRef.current) return;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
    tl.fromTo(
      badgeRef.current,
      { scale: 0, rotation: -20 },
      { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.7)' }
    );

    const bars = barsRef.current.filter(Boolean);
    if (bars.length) {
      tl.fromTo(
        bars,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
        '-=0.3'
      );
    }

    tl.to(badgeRef.current, { scale: 1, duration: 2 });
    tl.to(badgeRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    });

    return () => tl.kill();
  }, []);

  return (
    <div className="ts-visual ts-visual--verified">
      <div className="ts-verified-card">
        {/* Realistic avatar with image */}
        <div className="ts-verified-avatar">
          <img
            src="/images/avatars/Pilot1.jpeg"
            alt=""
            className="ts-verified-avatar-img"
            loading="lazy"
          />
          <div className="ts-verified-badge" ref={badgeRef}>
            <BadgeCheck size={12} strokeWidth={2.5} />
          </div>
        </div>
        {/* Profile info skeleton */}
        <div className="ts-verified-info">
          <div className="ts-verified-name">Pilot Verified</div>
          <div className="ts-verified-credentials">
            <div
              className="ts-verified-bar"
              ref={(el) => (barsRef.current[0] = el)}
            >
              <span className="ts-verified-bar-label">Lisensi</span>
              <span className="ts-verified-bar-fill ts-verified-bar-fill--full" />
            </div>
            <div
              className="ts-verified-bar"
              ref={(el) => (barsRef.current[1] = el)}
            >
              <span className="ts-verified-bar-label">Sertifikat</span>
              <span className="ts-verified-bar-fill ts-verified-bar-fill--full" />
            </div>
            <div
              className="ts-verified-bar"
              ref={(el) => (barsRef.current[2] = el)}
            >
              <span className="ts-verified-bar-label">Riwayat</span>
              <span className="ts-verified-bar-fill ts-verified-bar-fill--partial" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Mini Visual: Two-Way Rating ── */
function RatingVisual() {
  const starsLeftRef = useRef([]);
  const starsRightRef = useRef([]);
  const arrowRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const starsLeft = starsLeftRef.current.filter(Boolean);
    const starsRight = starsRightRef.current.filter(Boolean);
    if (!starsLeft.length || !starsRight.length) return;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });

    // Arrow pulse
    if (arrowRef.current) {
      tl.fromTo(
        arrowRef.current,
        { opacity: 0.3 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' },
        0
      );
    }

    // Left stars fill (company rates pilot)
    starsLeft.forEach((star, i) => {
      tl.fromTo(
        star,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.2, ease: 'back.out(2)' },
        0.2 + i * 0.1
      );
    });

    // Right stars fill (pilot rates company)
    starsRight.forEach((star, i) => {
      tl.fromTo(
        star,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.2, ease: 'back.out(2)' },
        1.0 + i * 0.1
      );
    });

    tl.to({}, { duration: 2 });
    tl.to([...starsLeft, ...starsRight], {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      stagger: 0.03,
    });

    return () => tl.kill();
  }, []);

  return (
    <div className="ts-visual ts-visual--rating">
      <div className="ts-rating-scene">
        {/* Left: Company */}
        <div className="ts-rating-profile">
          <div className="ts-rating-avatar ts-rating-avatar--company">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" />
            </svg>
          </div>
          <span className="ts-rating-label">Perusahaan</span>
          <div className="ts-rating-stars-row">
            {[...Array(5)].map((_, i) => (
              <div
                key={`l-${i}`}
                className="ts-rating-star-item"
                ref={(el) => (starsLeftRef.current[i] = el)}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#F59E0B" stroke="none">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow bidirectional */}
        <div className="ts-rating-arrow" ref={arrowRef}>
          <svg width="32" height="16" viewBox="0 0 32 16" fill="none">
            <path d="M2 5h28M26 1l4 4-4 4" stroke="var(--brand-blue)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M30 11H2M6 15l-4-4 4-4" stroke="var(--brand-cyan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Right: Pilot */}
        <div className="ts-rating-profile">
          <div className="ts-rating-avatar ts-rating-avatar--pilot">
            <img
              src="/images/avatars/Pilot2.jpeg"
              alt=""
              className="ts-rating-avatar-img"
              loading="lazy"
            />
          </div>
          <span className="ts-rating-label">Pilot</span>
          <div className="ts-rating-stars-row">
            {[...Array(5)].map((_, i) => (
              <div
                key={`r-${i}`}
                className="ts-rating-star-item"
                ref={(el) => (starsRightRef.current[i] = el)}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#F59E0B" stroke="none">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Mini Visual: Encryption ── */
function EncryptionVisual() {
  const blocksRef = useRef([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const blocks = blocksRef.current.filter(Boolean);
    if (!blocks.length) return;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
    tl.to(blocks, {
      opacity: 0.3,
      duration: 0.4,
      stagger: { each: 0.08, from: 'start' },
      ease: 'power2.in',
    });
    tl.to(blocks, {
      opacity: 1,
      duration: 0.4,
      stagger: { each: 0.08, from: 'end' },
      ease: 'power2.out',
    });

    return () => tl.kill();
  }, []);

  return (
    <div className="ts-visual ts-visual--encryption">
      <div className="ts-encryption-grid">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="ts-encryption-block"
            ref={(el) => (blocksRef.current[i] = el)}
          />
        ))}
      </div>
    </div>
  );
}

const visualComponents = {
  escrow: EscrowVisual,
  verified: VerifiedVisual,
  rating: RatingVisual,
  encryption: EncryptionVisual,
};

function TrustSafety() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const pillarsRef = useRef([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Header fade-up
      gsap.fromTo(
        headerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Pillar cards stagger
      const cards = pillarsRef.current.filter(Boolean);
      if (cards.length) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="ts-section" ref={sectionRef}>
      {/* Background */}
      <div className="ts-bg" aria-hidden="true">
        <div className="ts-bg-glow" />
        <div className="ts-bg-grid" />
      </div>

      <div className="ts-container">
        {/* Header */}
        <div className="ts-header" ref={headerRef}>
          <span className="ts-eyebrow">TRUST INFRASTRUCTURE</span>
          <h2 className="ts-headline">
            Marketplace Aman, dengan Empat Lapis Jaminan.
          </h2>
          <p className="ts-subheadline">
            Setiap transaksi, data inspeksi, reputasi pilot, dan pembayaran
            dirancang agar transparan, terlindungi, dan bisa
            dipertanggungjawabkan.
          </p>
        </div>

        {/* Pillars */}
        <div className="ts-pillars">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            const Visual = visualComponents[pillar.visualType];
            return (
              <div
                key={pillar.id}
                className="ts-pillar"
                style={{ '--pillar-accent': pillar.borderColor }}
                ref={(el) => (pillarsRef.current[index] = el)}
              >
                <div className="ts-pillar-border-top" />

                {/* Mini Visual */}
                <Visual />

                {/* Icon */}
                <div className="ts-pillar-icon">
                  <Icon size={22} strokeWidth={1.8} />
                </div>

                {/* Text */}
                <h3 className="ts-pillar-headline">{pillar.headline}</h3>
                <p className="ts-pillar-body">{pillar.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TrustSafety;
