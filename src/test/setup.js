// Vitest global test setup.
// Imports @testing-library/jest-dom matchers (toBeInTheDocument, toHaveAttribute, etc.)
// so they are available in every test file without per-file imports.
import '@testing-library/jest-dom/vitest';

// Mock window.matchMedia for GSAP ScrollTrigger which calls it at module load time.
Object.defineProperty(window, 'matchMedia', {
 writable: true,
 value: (query) => ({
 matches: false,
 media: query,
 onchange: null,
 addListener: () => {},
 removeListener: () => {},
 addEventListener: () => {},
 removeEventListener: () => {},
 dispatchEvent: () => {},
 }),
});

// Mock IntersectionObserver for scroll-reveal components.
class MockIntersectionObserver {
 constructor(callback) {
 this.callback = callback;
 }
 observe() {}
 unobserve() {}
 disconnect() {}
}
Object.defineProperty(window, 'IntersectionObserver', {
 writable: true,
 value: MockIntersectionObserver,
});
