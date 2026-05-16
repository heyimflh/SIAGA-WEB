import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { categories } from './categories-data';
import './ServiceCategories.css';

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

function ServiceCategories() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

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

      // Cards stagger fade-up
      const cards = cardsRef.current.filter(Boolean);
      if (cards.length) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
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
    <section className="sc-section" ref={sectionRef}>
      {/* Background pattern */}
      <div className="sc-bg" aria-hidden="true">
        <div className="sc-bg-grid" />
      </div>

      <div className="sc-container">
        {/* Header */}
        <div className="sc-header" ref={headerRef}>
          <span className="sc-eyebrow">SERVICE MARKETPLACE</span>
          <h2 className="sc-headline">
            Inspeksi Apa yang Anda Butuhkan?
          </h2>
          <p className="sc-subheadline">
            Pilih kategori inspeksi, temukan pilot terspesialisasi, dan mulai
            proyek dengan standar laporan yang siap untuk kebutuhan enterprise.
          </p>
        </div>

        {/* Grid */}
        <div className="sc-grid">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="sc-card"
                ref={(el) => (cardsRef.current[index] = el)}
              >
                {/* Visual Header — Real Photo Thumbnail */}
                <div className="sc-card-visual">
                  <img
                    src={cat.thumbnail}
                    alt={cat.name}
                    className="sc-card-thumbnail"
                    loading="lazy"
                  />
                  <div className="sc-card-visual-overlay" />
                  <div className="sc-card-icon-float">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                </div>

                {/* Content */}
                <div className="sc-card-content">
                  <h3 className="sc-card-title">{cat.name}</h3>
                  <p className="sc-card-desc">{cat.description}</p>

                  {/* Liquidity proof */}
                  <div className="sc-card-meta">
                    <span className="sc-card-pilots">
                      <AnimatedCount end={cat.pilots} /> pilot tersedia
                    </span>
                    <span className="sc-card-sep">·</span>
                    <span className="sc-card-price">
                      mulai {cat.startingPrice}
                    </span>
                  </div>

                  {/* CTA */}
                  <a href="#" className="sc-card-cta">
                    Posting Inspeksi
                    <ArrowRight size={14} strokeWidth={2} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="sc-bottom-cta">
          <a href="#" className="sc-cta-btn">
            Mulai Posting Inspeksi
            <ArrowRight size={16} strokeWidth={2} />
          </a>
        </div>
      </div>
    </section>
  );
}

export default ServiceCategories;
