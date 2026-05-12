import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ProblemSolution.css';

gsap.registerPlugin(ScrollTrigger);

/* ─── Data ─── */
const problems = [
  {
    stat: '47%',
    unit: '',
    title: 'Risiko Kecelakaan Kerja',
    desc: 'Inspeksi manual di ketinggian menempatkan nyawa pekerja dalam bahaya setiap hari — satu kesalahan bisa fatal.',
    icon: '⚠',
  },
  {
    stat: '3–6',
    unit: 'bulan',
    title: 'Durasi Tender Konvensional',
    desc: 'Proses birokrasi tender manual yang berlarut-larut, memakan waktu berbulan-bulan sebelum inspeksi dimulai.',
    icon: '⏳',
  },
  {
    stat: '∅',
    unit: '',
    title: 'Laporan Tidak Terstandarisasi',
    desc: 'Output inspeksi berbeda-beda antar vendor — tidak bisa dibandingkan, diaudit, atau diintegrasikan.',
    icon: '✗',
  },
  {
    stat: '∅',
    unit: '',
    title: 'Nol Visibilitas Real-Time',
    desc: 'Setelah inspeksi selesai, tidak ada cara memantau kondisi aset secara live — semuanya berjalan buta.',
    icon: '◌',
  },
];

const solutions = [
  {
    title: 'Zero Risiko Kecelakaan',
    desc: 'Inspeksi 100% dari darat — drone yang bekerja di ketinggian, bukan manusia.',
    icon: '✓',
    badge: 'Safety First',
  },
  {
    title: '48 Jam dari Posting ke Pilot',
    desc: 'Sistem bidding real-time, algoritma matching otomatis — tidak ada birokrasi manual.',
    icon: '✓',
    badge: 'Lightning Fast',
  },
  {
    title: 'One-Click Inspection Report',
    desc: 'PDF profesional otomatis dengan standar internasional — siap presentasi boardroom.',
    icon: '✓',
    badge: 'Enterprise Grade',
  },
  {
    title: 'Live Asset Monitoring Dashboard',
    desc: 'Real-time kondisi aset pasca-inspeksi dengan visualisasi interaktif dan alerting otomatis.',
    icon: '✓',
    badge: 'Always On',
  },
];


/* ─── Mini 3D Canvas (SUTET Tower + Drone) ─── */
function Mini3DScene() {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  const draw = useCallback((ctx, width, height, time) => {
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const baseY = height - 20;

    // ── SUTET Tower (simplified lattice) ──
    const towerH = height * 0.7;
    const towerTop = baseY - towerH;
    const baseW = 36;
    const topW = 10;

    ctx.strokeStyle = 'rgba(10,37,64,0.25)';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';

    // Main legs
    ctx.beginPath();
    ctx.moveTo(cx - baseW / 2, baseY);
    ctx.lineTo(cx - topW / 2, towerTop);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + baseW / 2, baseY);
    ctx.lineTo(cx + topW / 2, towerTop);
    ctx.stroke();

    // Cross braces
    const segments = 6;
    for (let i = 1; i <= segments; i++) {
      const t = i / (segments + 1);
      const y = baseY - towerH * t;
      const w = baseW / 2 - (baseW / 2 - topW / 2) * t;

      // Horizontal
      ctx.strokeStyle = `rgba(10,37,64,${0.15 + t * 0.1})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - w, y);
      ctx.lineTo(cx + w, y);
      ctx.stroke();

      // X braces (alternating)
      if (i < segments) {
        const nextT = (i + 1) / (segments + 1);
        const nextY = baseY - towerH * nextT;
        const nextW = baseW / 2 - (baseW / 2 - topW / 2) * nextT;

        ctx.strokeStyle = 'rgba(10,37,64,0.08)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(cx - w, y);
        ctx.lineTo(cx + nextW, nextY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + w, y);
        ctx.lineTo(cx - nextW, nextY);
        ctx.stroke();
      }
    }

    // Tower arms
    const armY = towerTop + towerH * 0.1;
    const armLen = 28;
    ctx.strokeStyle = 'rgba(10,37,64,0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - armLen, armY - 3);
    ctx.lineTo(cx, armY);
    ctx.lineTo(cx + armLen, armY - 3);
    ctx.stroke();

    // Insulators (small dangles)
    ctx.strokeStyle = 'rgba(0,98,214,0.2)';
    ctx.lineWidth = 1;
    for (const xOff of [-armLen + 4, -armLen / 2, armLen / 2, armLen - 4]) {
      ctx.beginPath();
      ctx.moveTo(cx + xOff, armY - 2);
      ctx.lineTo(cx + xOff, armY + 8);
      ctx.stroke();
      // Small circle at bottom
      ctx.beginPath();
      ctx.arc(cx + xOff, armY + 10, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,98,214,0.15)';
      ctx.fill();
    }

    // Power lines (catenary curves)
    ctx.strokeStyle = 'rgba(10,37,64,0.06)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(0, armY - 5);
    ctx.quadraticCurveTo(cx, armY + 20, width, armY - 5);
    ctx.stroke();

    // ── Drone ──
    const droneX = cx + Math.sin(time * 0.8) * 25;
    const droneY = towerTop + 15 + Math.sin(time * 1.3) * 8;

    // Drone body
    ctx.fillStyle = 'rgba(0,98,214,0.75)';
    ctx.beginPath();
    ctx.ellipse(droneX, droneY, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Drone arms
    ctx.strokeStyle = 'rgba(10,37,64,0.3)';
    ctx.lineWidth = 1.2;
    const propR = 6;
    const armSpread = 11;
    const armPositions = [
      { x: droneX - armSpread, y: droneY - 3 },
      { x: droneX + armSpread, y: droneY - 3 },
      { x: droneX - armSpread + 3, y: droneY + 3 },
      { x: droneX + armSpread - 3, y: droneY + 3 },
    ];

    for (const pos of armPositions) {
      ctx.beginPath();
      ctx.moveTo(droneX, droneY);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();

      // Propeller (spinning)
      ctx.strokeStyle = 'rgba(0,98,214,0.3)';
      ctx.lineWidth = 0.8;
      const propAngle = time * 12 + pos.x;
      ctx.beginPath();
      ctx.moveTo(
        pos.x + Math.cos(propAngle) * propR,
        pos.y + Math.sin(propAngle) * propR * 0.3
      );
      ctx.lineTo(
        pos.x - Math.cos(propAngle) * propR,
        pos.y - Math.sin(propAngle) * propR * 0.3
      );
      ctx.stroke();

      ctx.strokeStyle = 'rgba(10,37,64,0.3)';
      ctx.lineWidth = 1.2;
    }

    // Drone LED
    const ledPulse = (Math.sin(time * 4) + 1) / 2;
    ctx.fillStyle = `rgba(0,98,214,${0.3 + ledPulse * 0.7})`;
    ctx.beginPath();
    ctx.arc(droneX, droneY, 2, 0, Math.PI * 2);
    ctx.fill();

    // Drone shadow on tower
    ctx.fillStyle = 'rgba(0,0,0,0.04)';
    ctx.beginPath();
    ctx.ellipse(droneX, baseY - 10, 12, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Scan beam from drone
    const scanOpacity = (Math.sin(time * 2) + 1) / 2;
    const grad = ctx.createLinearGradient(droneX, droneY + 5, droneX, droneY + 50);
    grad.addColorStop(0, `rgba(0,98,214,${0.1 * scanOpacity})`);
    grad.addColorStop(1, 'rgba(0,98,214,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(droneX - 3, droneY + 5);
    ctx.lineTo(droneX - 16, droneY + 50);
    ctx.lineTo(droneX + 16, droneY + 50);
    ctx.lineTo(droneX + 3, droneY + 5);
    ctx.closePath();
    ctx.fill();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    let startTime = performance.now();

    function animate(now) {
      const time = (now - startTime) / 1000;
      draw(ctx, rect.width, rect.height, time);
      animFrameRef.current = requestAnimationFrame(animate);
    }

    // Only animate when visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startTime = performance.now();
            animFrameRef.current = requestAnimationFrame(animate);
          } else {
            if (animFrameRef.current) {
              cancelAnimationFrame(animFrameRef.current);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(canvas);

    return () => {
      observer.disconnect();
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [draw]);

  return (
    <div className="ps-3d-container">
      <canvas ref={canvasRef} className="ps-3d-canvas" style={{ width: '100%', height: '100%' }} />
      <div className="ps-3d-overlay">
        <div className="ps-3d-dot" />
        <span className="ps-3d-label">Live Inspection</span>
      </div>
    </div>
  );
}


/* ─── Main Component ─── */
function ProblemSolution() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const dividerLineRef = useRef(null);
  const dividerBadgeRef = useRef(null);
  const problemRefs = useRef([]);
  const solutionRefs = useRef([]);
  const colLabelLeftRef = useRef(null);
  const colLabelRightRef = useRef(null);
  const ctaRef = useRef(null);
  const scene3dRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const divLine = dividerLineRef.current;
    const divBadge = dividerBadgeRef.current;
    const pCards = problemRefs.current.filter(Boolean);
    const sCards = solutionRefs.current.filter(Boolean);
    const colLabelL = colLabelLeftRef.current;
    const colLabelR = colLabelRightRef.current;
    const cta = ctaRef.current;
    const scene3d = scene3dRef.current;

    const ctx = gsap.context(() => {
      // ── Header entrance ──
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: header,
          start: 'top 82%',
          end: 'top 50%',
          toggleActions: 'play none none reverse',
        },
      });

      headerTl
        .fromTo(
          header.querySelector('.ps-eyebrow'),
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
        )
        .fromTo(
          header.querySelector('.ps-title'),
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
          '-=0.35'
        )
        .fromTo(
          header.querySelector('.ps-subtitle'),
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          '-=0.35'
        );

      // ── Column labels ──
      if (colLabelL) {
        gsap.fromTo(
          colLabelL,
          { x: -20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: colLabelL,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
      if (colLabelR) {
        gsap.fromTo(
          colLabelR,
          { x: 20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: colLabelR,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // ── Divider line growth (scrub with scroll) ──
      if (divLine) {
        gsap.to(divLine, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section.querySelector('.ps-grid'),
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1.2,
          },
        });
      }

      // ── Divider badge ──
      if (divBadge) {
        gsap.fromTo(
          divBadge,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: section.querySelector('.ps-grid'),
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // ── Problem cards: stagger from left ──
      pCards.forEach((card, i) => {
        gsap.fromTo(
          card,
          {
            x: -40,
            y: 30,
            opacity: 0,
            scale: 0.96,
          },
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            delay: i * 0.08,
          }
        );
      });

      // ── Solution cards: stagger from right, synced ──
      sCards.forEach((card, i) => {
        // sync with matching problem card trigger
        const matchingProblem = pCards[i];
        gsap.fromTo(
          card,
          {
            x: 40,
            y: 30,
            opacity: 0,
            scale: 0.96,
          },
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: matchingProblem || card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            delay: i * 0.08 + 0.15, // slightly after problem
          }
        );
      });

      // ── 3D scene container ──
      if (scene3d) {
        gsap.fromTo(
          scene3d,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: scene3d,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // ── Bottom CTA ──
      if (cta) {
        gsap.fromTo(
          cta,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cta,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // ── Floating particles entrance ──
      const particles = section.querySelectorAll('.ps-particle');
      if (particles.length) {
        gsap.fromTo(
          particles,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // ── Crosses entrance ──
      const crosses = section.querySelectorAll('.ps-cross');
      if (crosses.length) {
        gsap.fromTo(
          crosses,
          { scale: 0, opacity: 0, rotation: -90 },
          {
            scale: 1,
            opacity: 0.5,
            rotation: 0,
            duration: 0.7,
            stagger: 0.2,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="ps-section" ref={sectionRef} id="problem-solution">
      {/* Decorative background */}
      <div className="ps-bg-decor">
        <div className="ps-orb ps-orb-1" />
        <div className="ps-orb ps-orb-2" />
        <div className="ps-orb ps-orb-3" />
        <div className="ps-grid-pattern" />
        <div className="ps-noise" />
      </div>

      {/* Floating particles */}
      <div className="ps-particle ps-particle-1" />
      <div className="ps-particle ps-particle-2" />
      <div className="ps-particle ps-particle-3" />
      <div className="ps-particle ps-particle-4" />
      <div className="ps-particle ps-particle-5" />

      {/* Decorative crosses */}
      <div className="ps-cross ps-cross-1" />
      <div className="ps-cross ps-cross-2" />

      {/* Top accent line */}
      <div className="ps-accent-line" />

      {/* Section Header */}
      <div className="ps-header" ref={headerRef}>
        <div className="ps-eyebrow">
          <span className="ps-eyebrow-line" />
          Mengapa SIAGA?
          <span className="ps-eyebrow-line" />
        </div>
        <h2 className="ps-title">
          Dari Masalah Lama,{' '}
          <span className="ps-title-gradient">Menuju Solusi Cerdas</span>
        </h2>
        <p className="ps-subtitle">
          Industri inspeksi infrastruktur Indonesia masih terjebak metode konvensional.
          SIAGA hadir mengubah paradigma — lebih aman, lebih cepat, lebih terukur.
        </p>
      </div>

      {/* Main Grid */}
      <div className="ps-grid">
        {/* ── Left Column: Problems ── */}
        <div className="ps-column ps-col-left">
          <div className="ps-col-label ps-col-label-problem" ref={colLabelLeftRef}>
            <span className="ps-col-label-dot" />
            Masalah Industri
          </div>

          {problems.map((item, i) => (
            <div
              key={`problem-${i}`}
              className="ps-card problem-card"
              ref={(el) => (problemRefs.current[i] = el)}
            >
              <div className="ps-card-accent" />
              <div className="ps-card-top">
                <div className="ps-card-icon">{item.icon}</div>
                <div>
                  <div className="ps-stat-highlight">
                    <span className="ps-stat-number">{item.stat}</span>
                    {item.unit && <span className="ps-stat-unit">{item.unit}</span>}
                  </div>
                  <div className="ps-card-title">{item.title}</div>
                </div>
              </div>
              <div className="ps-card-desc">{item.desc}</div>
              <div className="ps-connection-dot" />
            </div>
          ))}
        </div>

        {/* ── Center Divider ── */}
        <div className="ps-divider">
          <div className="ps-divider-line" ref={dividerLineRef} />
          <div className="ps-divider-badge" ref={dividerBadgeRef}>VS</div>
        </div>

        {/* ── Right Column: Solutions ── */}
        <div className="ps-column ps-col-right">
          <div className="ps-col-label ps-col-label-solution" ref={colLabelRightRef}>
            <span className="ps-col-label-dot" />
            Solusi SIAGA
          </div>

          {solutions.map((item, i) => (
            <div
              key={`solution-${i}`}
              className="ps-card solution-card"
              ref={(el) => (solutionRefs.current[i] = el)}
            >
              <div className="ps-card-accent" />
              <div className="ps-card-top">
                <div className="ps-card-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="ps-check-icon">
                    <path
                      d="M4 10.5L8 14.5L16 6.5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <div className="ps-card-title">{item.title}</div>
                  {item.badge && (
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '9px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-body)',
                        color: 'var(--brand-blue)',
                        background: 'rgba(0,98,214,0.06)',
                        padding: '3px 8px',
                        borderRadius: '20px',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        marginTop: '4px',
                        border: '1px solid rgba(0,98,214,0.08)',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
              <div className="ps-card-desc">{item.desc}</div>
              <div className="ps-connection-dot" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Tagline */}
      <div className="ps-bottom-cta" ref={ctaRef}>
        <div className="ps-bottom-text">
          Inspeksi yang <span className="ps-bottom-highlight">lebih aman</span>,{' '}
          <span className="ps-bottom-highlight">lebih cepat</span>, dan{' '}
          <span className="ps-bottom-highlight">lebih terukur</span>.
        </div>
        <div className="ps-bottom-sub">
          Satu platform. Semua solusi.
        </div>
      </div>

      {/* Mini 3D Scene */}
      <div ref={scene3dRef}>
        <Mini3DScene />
      </div>

      {/* Bottom accent line */}
      <div className="ps-accent-line ps-accent-line-bottom" />
    </section>
  );
}

export default ProblemSolution;
