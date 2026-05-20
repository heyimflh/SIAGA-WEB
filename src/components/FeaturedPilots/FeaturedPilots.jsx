import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Star,
  MapPin,
  CheckCircle,
  ArrowRight,
  Navigation,
  Wallet,
} from 'lucide-react';
import { pilots, filterCategories } from './pilots-data';
import { ROUTES } from '../../routes/appRoutes';
import './FeaturedPilots.css';

gsap.registerPlugin(ScrollTrigger);

function FeaturedPilots() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const filtersRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [filteredPilots, setFilteredPilots] = useState(pilots);
  const [isAnimating, setIsAnimating] = useState(false);

  // Filter logic
  useEffect(() => {
    if (activeFilter === 'Semua') {
      setFilteredPilots(pilots);
    } else {
      const filtered = pilots.filter((pilot) =>
        pilot.specializations.some((spec) =>
          spec.toLowerCase().includes(activeFilter.toLowerCase())
        )
      );
      setFilteredPilots(filtered);
    }
  }, [activeFilter]);

  // GSAP entrance animation
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
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

      gsap.fromTo(
        filtersRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animate cards on filter change
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll('.fp-card');
    if (cards.length) {
      setIsAnimating(true);
      gsap.fromTo(
        cards,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.06,
          ease: 'power2.out',
          onComplete: () => setIsAnimating(false),
        }
      );
    }
  }, [filteredPilots]);

  // Drag to scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      container.classList.add('fp-scroll--active');
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      container.classList.remove('fp-scroll--active');
    };

    const handleMouseUp = () => {
      isDown = false;
      container.classList.remove('fp-scroll--active');
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleFilterClick = (category) => {
    if (isAnimating) return;
    setActiveFilter(category);
  };

  return (
    <section className="fp-section" ref={sectionRef}>
      <div className="fp-container">
        {/* Header */}
        <div className="fp-header" ref={headerRef}>
          <div className="fp-header-text">
            <h2 className="fp-headline">
              500+ Pilot Bersertifikat. Inilah Sebagiannya.
            </h2>
            <p className="fp-subheadline">
              Temukan pilot drone inspeksi dengan spesialisasi industri, rating
              misi, dan perangkat profesional yang sudah diverifikasi.
            </p>
          </div>
          <a href="/pilots" className="fp-header-cta">
            Lihat Semua Pilot
            <ArrowRight size={16} strokeWidth={2} />
          </a>
        </div>

        {/* Filter Chips */}
        <div className="fp-filters" ref={filtersRef}>
          {filterCategories.map((category) => (
            <button
              key={category}
              className={`fp-filter-chip ${
                activeFilter === category ? 'fp-filter-chip--active' : ''
              }`}
              onClick={() => handleFilterClick(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Scroll Container */}
        <div className="fp-scroll-wrapper">
          <div className="fp-scroll-mask fp-scroll-mask--left" />
          <div className="fp-scroll-mask fp-scroll-mask--right" />
          <div className="fp-scroll" ref={scrollContainerRef}>
            {filteredPilots.map((pilot) => (
              <div key={pilot.id} className="fp-card">
                {/* Verified Badge */}
                <div className="fp-card-badge">
                  <CheckCircle size={12} strokeWidth={2.5} />
                  <span>Verified</span>
                </div>

                {/* Avatar Monogram */}
                <div
                  className="fp-card-avatar"
                  style={{ background: pilot.gradientBg }}
                >
                  <span>{pilot.initials}</span>
                </div>

                {/* Info */}
                <h4 className="fp-card-name">{pilot.name}</h4>
                <div className="fp-card-location">
                  <MapPin size={12} strokeWidth={2} />
                  <span>{pilot.location}</span>
                </div>

                {/* Specializations */}
                <div className="fp-card-specs">
                  {pilot.specializations.slice(0, 2).map((spec, i) => (
                    <span key={i} className="fp-spec-chip">
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="fp-card-stats">
                  <div className="fp-stat-rating">
                    <Star size={13} strokeWidth={2} fill="#F59E0B" color="#F59E0B" />
                    <span>{pilot.rating}</span>
                  </div>
                  <span className="fp-stat-sep">·</span>
                  <span className="fp-stat-missions">{pilot.missions} misi</span>
                </div>

                {/* Drone */}
                <div className="fp-card-drone">
                  <Navigation size={12} strokeWidth={2} />
                  <span>{pilot.drone}</span>
                </div>

                {/* Price */}
                <div className="fp-card-price">
                  <Wallet size={12} strokeWidth={2} />
                  <span>Mulai {pilot.startingPrice}</span>
                </div>

                {/* CTA */}
                <Link to={ROUTES.pilots} className="fp-card-cta">
                  Lihat Profil
                  <ArrowRight size={13} strokeWidth={2} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA (mobile) */}
        <div className="fp-bottom-cta">
          <a href="/pilots" className="fp-cta-btn">
            Lihat Semua Pilot
            <ArrowRight size={16} strokeWidth={2} />
          </a>
        </div>
      </div>
    </section>
  );
}

export default FeaturedPilots;
