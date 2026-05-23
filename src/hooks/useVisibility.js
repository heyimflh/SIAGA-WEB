import { useState, useEffect } from 'react';

export function useVisibility(ref, options = {}) {
 const [isVisible, setIsVisible] = useState(false);

 useEffect(() => {

 if (typeof IntersectionObserver === 'undefined') {
 setIsVisible(true);
 return;
 }

 const element = ref.current;
 if (!element) return;

 const rootMargin = enforceMinRootMargin(options.rootMargin);
 const threshold = options.threshold ?? 0;

 const observer = new IntersectionObserver(
 ([entry]) => {
 setIsVisible(entry.isIntersecting);
 },
 { rootMargin, threshold }
 );

 observer.observe(element);

 return () => {
 observer.disconnect();
 };
 }, [ref, options.rootMargin, options.threshold]);

 return isVisible;
}

function enforceMinRootMargin(rootMargin) {
 if (!rootMargin) return '100px';

 const parts = rootMargin.trim().split(/\s+/);
 const enforced = parts.map((part) => {
 const value = parseInt(part, 10);
 if (isNaN(value) || value < 100) {
 return '100px';
 }
 return part;
 });

 return enforced.join(' ');
}

export default useVisibility;
