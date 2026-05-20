import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToHash — handles hash-based scrolling on route changes.
 *
 * Behavior:
 *   - If location has a hash (#section-id), scroll to that element smoothly.
 *   - If no hash, scroll to top.
 *   - Respects prefers-reduced-motion.
 */
export default function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior = prefersReduced ? 'auto' : 'smooth';

    if (hash) {
      // Small delay to allow DOM to render after route change
      const timer = setTimeout(() => {
        const el = document.getElementById(hash.slice(1));
        if (el) {
          el.scrollIntoView({ behavior, block: 'start' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }

    // No hash — scroll to top
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
}
