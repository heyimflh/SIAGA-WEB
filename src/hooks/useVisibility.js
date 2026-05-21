import { useState, useEffect } from 'react';

/**
 * useVisibility - IntersectionObserver-based visibility detection hook.
 *
 * Detects whether a referenced DOM element is visible in the viewport.
 * Used to pause/resume heavy rendering (animations, WebGL, frame sequences)
 * for off-screen sections.
 *
 * @param {React.RefObject<Element>} ref - React ref attached to the target element
 * @param {Object} [options={}] - Configuration options
 * @param {string} [options.rootMargin="100px"] - Root margin for early detection (minimum "100px")
 * @param {number} [options.threshold=0] - Intersection threshold (0-1)
 * @returns {boolean} isVisible - Whether the element is currently intersecting the viewport
 *
 * Validates: Requirements 6.5, 7.1, 7.2
 */
export function useVisibility(ref, options = {}) {
 const [isVisible, setIsVisible] = useState(false);

 useEffect(() => {
 // Feature detection fallback: if IntersectionObserver is unavailable, default to true
 if (typeof IntersectionObserver === 'undefined') {
 setIsVisible(true);
 return;
 }

 const element = ref.current;
 if (!element) return;

 // Enforce minimum rootMargin of 100px
 const rootMargin = enforceMinRootMargin(options.rootMargin);
 const threshold = options.threshold ?? 0;

 const observer = new IntersectionObserver(
 ([entry]) => {
 setIsVisible(entry.isIntersecting);
 },
 { rootMargin, threshold }
 );

 observer.observe(element);

 // Disconnect observer on unmount
 return () => {
 observer.disconnect();
 };
 }, [ref, options.rootMargin, options.threshold]);

 return isVisible;
}

/**
 * Ensures the rootMargin value is at least "100px".
 * Parses the provided rootMargin and enforces a minimum of 100px on all sides.
 *
 * @param {string} [rootMargin] - The rootMargin value to enforce
 * @returns {string} A rootMargin string with at least 100px
 */
function enforceMinRootMargin(rootMargin) {
 if (!rootMargin) return '100px';

 // Parse the rootMargin values (supports 1-4 values like CSS margin shorthand)
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
