import { useState, useEffect } from 'react';

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

 setMatches(mql.matches);

 if (mql.addEventListener) {
 mql.addEventListener('change', handler);
 return () => mql.removeEventListener('change', handler);
 } else {

 mql.addListener(handler);
 return () => mql.removeListener(handler);
 }
 }, [query]);

 return matches;
}
