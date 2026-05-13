import { useEffect, useRef } from 'react';

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, .clickable, .nav-link, .nav-cta, .btn-hero-primary, .btn-hero-secondary, label';

export default function CustomCursor() {
  const containerRef = useRef(null);
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    // Skip on touch devices
    const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (isTouchDevice) {
      document.documentElement.style.cursor = '';
      return;
    }

    // Skip if prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const container = containerRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!container || !ring || !dot) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let visible = false;
    let hovering = false;
    let clicking = false;
    let raf;

    // Smoothing factor for ring
    const LERP = prefersReduced ? 1 : 0.14;

    const onPointerMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!visible) {
        visible = true;
        container.classList.add('is-visible');
      }

      // Dot follows instantly
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    };

    const onPointerLeave = () => {
      visible = false;
      container.classList.remove('is-visible');
    };

    const onPointerEnter = () => {
      visible = true;
      container.classList.add('is-visible');
    };

    const onPointerOver = (e) => {
      const target = e.target;
      if (target.closest(INTERACTIVE_SELECTOR)) {
        if (!hovering) {
          hovering = true;
          container.classList.add('is-hovering');
        }
      }
    };

    const onPointerOut = (e) => {
      const target = e.target;
      if (target.closest(INTERACTIVE_SELECTOR)) {
        // Check if we're still inside an interactive element
        const related = e.relatedTarget;
        if (!related || !related.closest(INTERACTIVE_SELECTOR)) {
          hovering = false;
          container.classList.remove('is-hovering');
        }
      }
    };

    const onPointerDown = () => {
      clicking = true;
      container.classList.add('is-clicking');
    };

    const onPointerUp = () => {
      clicking = false;
      container.classList.remove('is-clicking');
    };

    const animate = () => {
      // Ring lerps toward mouse
      ringX += (mouseX - ringX) * LERP;
      ringY += (mouseY - ringY) * LERP;

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

      raf = requestAnimationFrame(animate);
    };

    // Attach listeners
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('pointerenter', onPointerEnter);
    document.addEventListener('pointerover', onPointerOver, { passive: true });
    document.addEventListener('pointerout', onPointerOut, { passive: true });
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('pointerup', onPointerUp);

    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('pointerenter', onPointerEnter);
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerout', onPointerOut);
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('pointerup', onPointerUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={containerRef} className="siaga-cursor" aria-hidden="true">
      <div ref={ringRef} className="siaga-cursor__ring" />
      <div ref={dotRef} className="siaga-cursor__dot" />
    </div>
  );
}
