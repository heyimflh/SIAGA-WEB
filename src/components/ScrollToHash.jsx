import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToHash() {
 const { pathname, hash } = useLocation();

 useEffect(() => {
 const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const behavior = prefersReduced ? 'auto' : 'smooth';

 if (hash) {

 const timer = setTimeout(() => {
 const el = document.getElementById(hash.slice(1));
 if (el) {
 el.scrollIntoView({ behavior, block: 'start' });
 }
 }, 100);
 return () => clearTimeout(timer);
 }

 window.scrollTo({ top: 0, behavior: 'auto' });
 }, [pathname, hash]);

 return null;
}
