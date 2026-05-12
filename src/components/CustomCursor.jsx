import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isHovering = false;
    let raf;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Dot follows instantly — use translate3d for GPU
      dot.style.transform = `translate3d(${mouseX - 2.5}px, ${mouseY - 2.5}px, 0)`;
    };

    const animate = () => {
      // Ring follows with smooth lag
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = `translate3d(${ringX - 12}px, ${ringY - 12}px, 0) scale(${isHovering ? 1.5 : 1})`;
      raf = requestAnimationFrame(animate);
    };

    const handleMouseOver = (e) => {
      const t = e.target;
      if (t.closest('a') || t.closest('button') || t.tagName === 'A' || t.tagName === 'BUTTON') {
        isHovering = true;
        ring.style.background = 'rgba(10, 37, 64, 0.05)';
        ring.style.borderColor = 'rgba(10, 37, 64, 0.2)';
        ring.style.width = '36px';
        ring.style.height = '36px';
        dot.style.opacity = '0';
      }
      if (t.tagName === 'CANVAS') {
        isHovering = true;
        ring.style.background = 'transparent';
        ring.style.borderColor = 'rgba(10, 37, 64, 0.1)';
        ring.style.width = '48px';
        ring.style.height = '48px';
      }
    };

    const handleMouseOut = (e) => {
      const t = e.target;
      if (t.closest('a') || t.closest('button') || t.tagName === 'A' || t.tagName === 'BUTTON') {
        isHovering = false;
        ring.style.background = 'transparent';
        ring.style.borderColor = 'rgba(10, 37, 64, 0.3)';
        ring.style.width = '24px';
        ring.style.height = '24px';
        dot.style.opacity = '1';
      }
      if (t.tagName === 'CANVAS') {
        isHovering = false;
        ring.style.background = 'transparent';
        ring.style.borderColor = 'rgba(10, 37, 64, 0.3)';
        ring.style.width = '24px';
        ring.style.height = '24px';
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Outer ring — trails behind with smooth lag */}
      <div ref={ringRef} className="cursor-ring" />
      {/* Inner dot — snaps to cursor instantly */}
      <div ref={dotRef} className="cursor-dot" />
    </>
  );
}
