import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Wallet, Users, Clock, ArrowRight } from 'lucide-react';
import { projects } from './projects-data';
import { getRegisterPath } from '../../routes/appRoutes';
import './LiveProjects.css';

gsap.registerPlugin(ScrollTrigger);

function AnimatedCount({ end, duration = 2000 }) {
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const startTime = performance.now();
            function animate(now) {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(2, -10 * progress);
              el.textContent = Math.round(eased * end);
              if (progress < 1) requestAnimationFrame(animate);
            }
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>0</span>;
}

function LiveProjects() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Header animation
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

      // Cards stagger
      const cards = cardsRef.current.filter(Boolean);
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
    <section className="lp-section" ref={sectionRef}>
      <div className="lp-container">
        {/* Header */}
        <div className="lp-header" ref={headerRef}>
          <div className="lp-live-badge">
            <span className="lp-live-dot" />
            <span className="lp-live-label">LIVE MARKETPLACE</span>
          </div>
          <h2 className="lp-headline">
            Live: <AnimatedCount end={47} /> Proyek Aktif Mencari Pilot
          </h2>
          <p className="lp-subheadline">
            Setiap proyek masuk ke marketplace SIAGA dengan budget, lokasi,
            deadline, dan jumlah bidding yang transparan.
          </p>
        </div>

        {/* Project Grid */}
        <div className="lp-grid">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <div
                key={project.id}
                className="lp-card"
                ref={(el) => (cardsRef.current[index] = el)}
              >
                <div className="lp-card-header">
                  <div className="lp-card-icon">
                    <Icon size={20} strokeWidth={1.8} />
                  </div>
                  <h3 className="lp-card-title">{project.title}</h3>
                </div>

                <div className="lp-card-location">
                  <MapPin size={14} strokeWidth={2} />
                  <span>{project.location}</span>
                </div>

                <div className="lp-card-divider" />

                <div className="lp-card-details">
                  <div className="lp-card-row">
                    <Wallet size={14} strokeWidth={2} />
                    <span>
                      {project.budgetMin} – {project.budgetMax}
                    </span>
                  </div>
                  <div className="lp-card-row">
                    <Users size={14} strokeWidth={2} />
                    <span>{project.bids} pilot bidding</span>
                  </div>
                  <div className="lp-card-row lp-card-row--deadline">
                    <Clock size={14} strokeWidth={2} />
                    <span>Tutup {project.deadlineDays} hari lagi</span>
                    <span className="lp-deadline-dot" />
                  </div>
                </div>

                <Link to={getRegisterPath('client')} className="lp-card-cta">
                  Lihat Detail
                  <ArrowRight size={14} strokeWidth={2} />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="lp-bottom-cta">
          <Link to={getRegisterPath('client')} className="lp-cta-btn">
            Lihat Semua Proyek Aktif
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default LiveProjects;
