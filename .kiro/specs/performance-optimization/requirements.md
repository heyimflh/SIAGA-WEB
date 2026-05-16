# Requirements Document

## Introduction

Performance optimization for the SIAGA landing page website — a Vite + React application featuring scroll-based animations, 240-frame drone anatomy sequence, 3D WebGL models, image-heavy sections, and GSAP-powered transitions. The goal is to achieve smoother scrolling, faster initial load, lighter animations, and stable frame rates while maintaining a pixel-perfect visual appearance across all devices. No visual, layout, or design changes are permitted.

## Glossary

- **Optimizer**: The performance optimization system/code changes applied to the SIAGA website
- **Frame_Sequence_Loader**: The module responsible for loading and rendering the 240 drone anatomy frame images on scroll
- **Scene_Renderer**: The Three.js/React Three Fiber 3D canvas rendering the drone and tower models
- **Scroll_Engine**: The Lenis smooth scroll instance combined with GSAP ScrollTrigger for scroll-based animations
- **Animation_Controller**: The GSAP-based animation system controlling entrance animations, parallax effects, and scroll-driven transitions
- **Asset_Loader**: The system responsible for loading images, fonts, 3D models, and other static assets
- **Custom_Cursor**: The custom pointer-following cursor component rendered on non-touch devices
- **Intersection_Manager**: IntersectionObserver-based visibility detection used to activate/deactivate off-screen components
- **Visual_Integrity**: The guarantee that the website looks identical before and after optimization on desktop, tablet, and mobile viewports

## Requirements

### Requirement 1: Drone Anatomy Frame Sequence Optimization

**User Story:** As a visitor, I want the 240-frame drone anatomy scroll animation to play smoothly without dropped frames, so that the experience feels cinematic rather than janky.

#### Acceptance Criteria

1. WHEN the drone anatomy section enters the viewport, THE Frame_Sequence_Loader SHALL preload frames using a priority-based strategy (keyframes first, then fill gaps) with concurrent loading limited to a maximum of 6 simultaneous requests
2. WHILE the drone anatomy section is being scrolled, THE Frame_Sequence_Loader SHALL render frames using requestAnimationFrame and skip redundant draws when the computed frame index has not changed
3. THE Frame_Sequence_Loader SHALL cap the canvas device pixel ratio at 1.5x to reduce GPU memory usage while maintaining visual clarity
4. WHEN the drone anatomy section is not visible in the viewport, THE Frame_Sequence_Loader SHALL pause all frame rendering and release the animation loop to free CPU cycles
5. IF the browser memory is constrained or images fail to load, THEN THE Frame_Sequence_Loader SHALL gracefully degrade by displaying the last successfully loaded frame without throwing errors

### Requirement 2: 3D Scene Rendering Optimization

**User Story:** As a visitor, I want the 3D drone model in the hero section to render smoothly without impacting the rest of the page performance, so that I can enjoy the visual without lag.

#### Acceptance Criteria

1. WHEN the hero section is not visible in the viewport, THE Scene_Renderer SHALL stop the WebGL render loop entirely by setting frameloop to "never"
2. THE Scene_Renderer SHALL disable antialiasing and stencil buffer in the WebGL context to reduce GPU overhead
3. THE Scene_Renderer SHALL limit the device pixel ratio range to [1, 1.5] to prevent excessive GPU memory consumption on high-DPI displays
4. WHEN the 3D model is loaded, THE Scene_Renderer SHALL set frustumCulled to false only on visible meshes and minimize material complexity by capping envMapIntensity
5. THE Scene_Renderer SHALL use a reduced particle count (80 or fewer) with depthWrite disabled to minimize draw calls

### Requirement 3: Scroll and Animation Performance

**User Story:** As a visitor, I want scrolling between sections to feel buttery smooth with no lag or stutter, so that the website feels premium and responsive.

#### Acceptance Criteria

1. THE Scroll_Engine SHALL use Lenis smooth scroll with a duration of 1.0 second and synchronize with GSAP ScrollTrigger via the scroll event callback
2. WHILE the page is being scrolled, THE Animation_Controller SHALL use only GPU-compositable properties (transform, opacity) for all scroll-triggered animations
3. WHEN multiple ScrollTrigger instances are active simultaneously, THE Animation_Controller SHALL use toggleActions "play none none reverse" to prevent animation buildup and memory leaks
4. THE Animation_Controller SHALL use gsap.context() for all scroll-triggered animations and call context.revert() on component unmount to properly clean up ScrollTrigger instances
5. WHEN the hero section parallax effect is active, THE Animation_Controller SHALL use direct style.transform assignment with translate3d instead of gsap.set to reduce per-frame overhead

### Requirement 4: Image Loading Optimization

**User Story:** As a visitor, I want the page to load quickly with images appearing progressively as I scroll, so that I don't wait for all assets before interacting with the page.

#### Acceptance Criteria

1. THE Asset_Loader SHALL apply native lazy loading (loading="lazy") to all images below the fold including service category thumbnails, solution card images, and avatar images
2. WHEN the page initially loads, THE Asset_Loader SHALL prioritize loading only above-the-fold assets (hero background, logo, navigation elements) before any below-fold content
3. THE Asset_Loader SHALL preconnect to external font origins (fonts.googleapis.com, fonts.gstatic.com) in the document head to reduce DNS lookup time
4. WHEN a 3D model file is required, THE Asset_Loader SHALL use useGLTF.preload() to begin loading the GLB file before the component mounts
5. IF an image fails to load, THEN THE Asset_Loader SHALL not cause layout shift by maintaining the image container dimensions via CSS aspect-ratio or explicit width/height attributes

### Requirement 5: Event Listener and DOM Optimization

**User Story:** As a visitor, I want the page to respond instantly to my interactions without any input delay, so that the website feels alive and reactive.

#### Acceptance Criteria

1. THE Custom_Cursor SHALL use passive event listeners for pointermove and pointerover events to prevent blocking the main thread
2. WHEN the hero section parallax mousemove handler is registered, THE Animation_Controller SHALL mark the event listener as passive to avoid scroll-blocking
3. THE Optimizer SHALL cache DOM queries (querySelectorAll results) outside animation loops and reuse cached references across frames
4. WHILE the Custom_Cursor animation loop is running, THE Custom_Cursor SHALL use a single requestAnimationFrame loop with lerp-based interpolation rather than multiple independent animation frames
5. WHEN a component unmounts, THE Optimizer SHALL cancel all pending requestAnimationFrame callbacks and remove all registered event listeners to prevent memory leaks

### Requirement 6: Layout Stability and CLS Prevention

**User Story:** As a visitor, I want the page content to remain stable as it loads without elements jumping around, so that I can start reading and interacting immediately.

#### Acceptance Criteria

1. THE Optimizer SHALL ensure zero Cumulative Layout Shift (CLS) by reserving space for all dynamically loaded content (images, 3D canvas, map embeds) before they render
2. WHEN fonts are loaded from Google Fonts, THE Asset_Loader SHALL use font-display: swap to prevent invisible text during font loading
3. THE Optimizer SHALL not add, remove, or reorder any DOM elements that would alter the visual layout, spacing, colors, typography, or section structure of the page
4. WHEN the drone anatomy loading screen is displayed, THE Frame_Sequence_Loader SHALL occupy the full viewport height to prevent content below from shifting when loading completes
5. IF a component uses IntersectionObserver for visibility detection, THEN THE Intersection_Manager SHALL use a rootMargin of at least 100px to begin loading content before it enters the viewport

### Requirement 7: Component-Level Render Optimization

**User Story:** As a developer, I want each section to only perform work when visible, so that off-screen sections don't waste CPU/GPU resources.

#### Acceptance Criteria

1. WHEN a section with heavy animations is not visible in the viewport, THE Intersection_Manager SHALL pause GSAP timelines and requestAnimationFrame loops associated with that section
2. THE Scene_Renderer SHALL use IntersectionObserver to detect visibility and toggle the React Three Fiber frameloop between "always" and "never" based on viewport intersection
3. WHILE the drone anatomy section is pinned and scrolling, THE Frame_Sequence_Loader SHALL be the only high-frequency update running, with all other section animations paused
4. THE Custom_Cursor SHALL skip initialization entirely on touch devices by checking the "(hover: none), (pointer: coarse)" media query
5. WHEN prefers-reduced-motion media query matches, THE Animation_Controller SHALL set the Custom_Cursor lerp factor to 1 (instant follow) and reduce animation durations across all components

### Requirement 8: Build and Bundle Optimization

**User Story:** As a developer, I want the production bundle to be as small and efficient as possible, so that the initial page load is fast on all network conditions.

#### Acceptance Criteria

1. THE Optimizer SHALL ensure tree-shaking is effective by using named imports for all icon libraries (lucide-react) rather than barrel imports
2. THE Optimizer SHALL not introduce any new dependencies or libraries beyond what is already in the project's package.json
3. WHEN the production build is created, THE Optimizer SHALL ensure that Three.js and React Three Fiber are code-split from the main bundle so they load only when the hero section is needed
4. THE Optimizer SHALL remove any unused CSS rules, dead code paths, or commented-out code blocks that increase bundle size without providing functionality
5. IF the Vite build configuration supports it, THEN THE Optimizer SHALL enable asset compression and appropriate chunk splitting for optimal caching

### Requirement 9: Strict Visual Preservation

**User Story:** As a stakeholder, I want the website to look pixel-perfect identical after optimization, so that no design work is lost or altered during the performance improvement process.

#### Acceptance Criteria

1. THE Optimizer SHALL not modify any CSS properties that affect visual appearance including colors, typography, spacing, padding, margin, border-radius, shadows, gradients, card sizes, image sizes, or responsive breakpoints
2. THE Optimizer SHALL not replace, resize, crop, compress with visible quality loss, or visually alter any image asset used on the website
3. THE Optimizer SHALL not remove, simplify, reorder, or redesign any section, component, or DOM structure that contributes to the visual layout
4. WHEN animations are optimized, THE Animation_Controller SHALL preserve the exact same visual timing, easing curves, distances, and directions — only the underlying rendering technique may change (e.g., switching from top/left to transform)
5. THE Optimizer SHALL preserve full responsiveness on desktop (1920px+), tablet (768px–1024px), and mobile (320px–767px) viewports with no visual differences from the pre-optimization state
6. THE Optimizer SHALL not produce any console errors, warnings, or unhandled promise rejections after optimization is applied
7. THE Optimizer SHALL ensure all existing features, interactions, hover effects, click handlers, sliders, carousels, and navigation continue to function identically

### Requirement 10: Measurable Performance Targets

**User Story:** As a developer, I want clear performance benchmarks to validate that the optimization is effective, so that improvements are measurable and not subjective.

#### Acceptance Criteria

1. AFTER optimization, THE Scroll_Engine SHALL maintain a stable 60 FPS during continuous scrolling through all sections with no frame drops exceeding 3 consecutive frames
2. AFTER optimization, THE Animation_Controller SHALL complete all scroll-triggered entrance animations without visible stutter or jank when scrolling at normal speed (approximately 1000px per second)
3. WHEN the user interacts with sliders or carousels, THE Animation_Controller SHALL respond within 16ms (one frame at 60 FPS) with no perceptible input delay
4. AFTER optimization, THE Asset_Loader SHALL achieve a Largest Contentful Paint (LCP) of under 2.5 seconds on a simulated 4G connection
5. AFTER optimization, THE Optimizer SHALL achieve a Cumulative Layout Shift (CLS) score of 0 across all viewport sizes
6. AFTER optimization, THE Optimizer SHALL achieve a Total Blocking Time (TBT) reduction of at least 30% compared to the pre-optimization baseline
7. WHEN visual comparison is performed between pre-optimization and post-optimization screenshots, THE Optimizer SHALL show zero noticeable UI differences at all breakpoints
