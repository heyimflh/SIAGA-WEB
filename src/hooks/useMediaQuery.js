import { useState, useEffect } from 'react';

/**
 * Hook untuk mendeteksi media query.
 * Default-nya menganggap desktop saat SSR/initial render.
 *
 * @param {string} query - Media query string, contoh: '(min-width: 1024px)'
 * @returns {boolean}
 */
export function useMediaQuery(query) {
  const getMatch = () => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);

    // Sync immediately in case state mismatched at mount
    setMatches(mql.matches);

    if (mql.addEventListener) {
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    } else {
      // Safari < 14 fallback
      mql.addListener(handler);
      return () => mql.removeListener(handler);
    }
  }, [query]);

  return matches;
}
