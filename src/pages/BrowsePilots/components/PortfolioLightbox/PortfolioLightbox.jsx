import { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import './PortfolioLightbox.css';

export default function PortfolioLightbox({ isOpen, images, currentIndex, onClose, onNavigate }) {
  const lightboxRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      lightboxRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === 'ArrowRight' && currentIndex < images.length - 1) onNavigate(currentIndex + 1);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen || !images || images.length === 0) return null;

  const current = images[currentIndex];
  const src = typeof current === 'string' ? current : current?.src;
  const alt = typeof current === 'string' ? 'Portfolio image' : current?.alt || 'Portfolio image';
  const caption = typeof current === 'object' ? current : null;

  return (
    <div
      ref={lightboxRef}
      className="portfolio-lightbox"
      role="dialog"
      aria-label="Galeri portofolio"
      tabIndex={-1}
      onClick={onClose}
    >
      <button className="portfolio-lightbox__close" onClick={onClose} aria-label="Tutup galeri">
        <X size={24} />
      </button>

      {currentIndex > 0 && (
        <button className="portfolio-lightbox__nav portfolio-lightbox__nav--prev"
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1); }}
          aria-label="Foto sebelumnya">
          <ChevronLeft size={28} />
        </button>
      )}

      {currentIndex < images.length - 1 && (
        <button className="portfolio-lightbox__nav portfolio-lightbox__nav--next"
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1); }}
          aria-label="Foto berikutnya">
          <ChevronRight size={28} />
        </button>
      )}

      <div className="portfolio-lightbox__content" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} className="portfolio-lightbox__img" />
        {caption && (caption.caption || caption.project_name) && (
          <div className="portfolio-lightbox__caption">
            {caption.caption && <p className="portfolio-lightbox__caption-main">{caption.caption}</p>}
            {caption.inspection_type && caption.drone_used && (
              <p className="portfolio-lightbox__caption-meta">
                {caption.inspection_type} · {caption.drone_used}
              </p>
            )}
            {caption.location && (
              <p className="portfolio-lightbox__caption-location">{caption.location}</p>
            )}
          </div>
        )}
      </div>

      <div className="portfolio-lightbox__counter">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
