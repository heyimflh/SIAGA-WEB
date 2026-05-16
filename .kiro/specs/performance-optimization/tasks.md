# Implementation Plan: Performance Optimization

## Overview

This plan implements performance optimizations for the SIAGA landing page — a Vite + React application with scroll-based animations, 240-frame drone anatomy sequence, 3D WebGL models, and GSAP-powered transitions. The approach is non-destructive: only underlying rendering techniques, resource loading strategies, and runtime behavior are modified. No visual, layout, or design changes are permitted.

## Tasks

- [ ] 1. Create shared utility hooks and infrastructure
  - [ ] 1.1 Create the `useVisibility` hook (IntersectionManager)
    - Create `src/hooks/useVisibility.js` implementing IntersectionObserver-based visibility detection
    - Accept a ref and options object with `rootMargin` (minimum "100px") and `threshold`
    - Return a boolean `isVisible` state
    - Include feature detection fallback: if IntersectionObserver is unavailable, default to `true`
    - Disconnect observer on unmount
    - _Requirements: 6.5, 7.1, 7.2_

  - [ ] 1.2 Create the priority-based frame loading utility
    - Create `src/utils/frameLoader.js` implementing the priority queue for 240-frame loading
    - Implement priority ordering: frame 0 first, every 10th frame, last frame, then gap-fill
    - Implement concurrency limiter capping at 6 simultaneous image requests
    - Track `lastSuccessfulFrame` for graceful degradation on load failure
    - Export `createFrameLoader(config)` function returning load state and frame access
    - _Requirements: 1.1, 1.5_

  - [ ]* 1.3 Write property tests for frame loading priority order
    - **Property 1: Frame Loading Priority Order**
    - Generate random frame counts, verify frame 0 is always first, then every 10th frame, then last frame, before any gap-fill frames
    - **Validates: Requirements 1.1**

  - [ ]* 1.4 Write property test for concurrency limit
    - **Property 13: Concurrency Limit on Frame Loading**
    - Simulate concurrent load sequences, verify max 6 in-flight requests at any time
    - **Validates: Requirements 1.1**

  - [ ]* 1.5 Write property test for DPR clamping
    - **Property 3: DPR Clamping**
    - Generate random DPR values (0.5–4.0), verify clamping result equals `Math.min(Math.max(1, R), 1.5)`
    - **Validates: Requirements 1.3, 2.3**

  - [ ]* 1.6 Write property test for IntersectionObserver rootMargin minimum
    - **Property 11: IntersectionObserver RootMargin Minimum**
    - Generate observer configs, verify rootMargin is at least "100px"
    - **Validates: Requirements 6.5**

- [ ] 2. Optimize the Drone Anatomy Frame Sequence component
  - [ ] 2.1 Refactor `src/components/DroneAnatomy.jsx` with optimized frame rendering
    - Integrate the priority-based frame loader from `src/utils/frameLoader.js`
    - Implement requestAnimationFrame-based rendering that skips redundant draws when frame index hasn't changed
    - Cap canvas DPR at 1.5x using `Math.min(window.devicePixelRatio, 1.5)`
    - Use `useVisibility` hook to pause all frame rendering when section is not visible
    - Cancel rAF callbacks on unmount and when section goes off-screen
    - Implement graceful degradation: display last successfully loaded frame on error
    - Ensure loading screen occupies full viewport height to prevent CLS
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.4, 7.3_

  - [ ]* 2.2 Write property test for redundant draw skipping
    - **Property 2: Redundant Draw Skipping (Idempotence)**
    - Generate scroll position sequences mapping to same frame index, verify canvas draw called exactly once per unique frame index
    - **Validates: Requirements 1.2**

  - [ ]* 2.3 Write property test for visibility-based resource pausing
    - **Property 4: Visibility-Based Resource Pausing**
    - Generate visibility state sequences, verify all rAF callbacks cancelled and timelines paused when hidden
    - **Validates: Requirements 1.4, 2.1, 7.1, 7.2**

- [ ] 3. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Optimize the 3D Scene Renderer
  - [ ] 4.1 Refactor `src/components/Scene.jsx` with WebGL optimizations
    - Set Canvas props: `antialias={false}`, `stencil={false}` (via `gl` prop)
    - Set `dpr={[1, 1.5]}` on Canvas to clamp device pixel ratio
    - Integrate `useVisibility` hook to toggle `frameloop` between "always" and "never"
    - Reduce particle count to 80 or fewer with `depthWrite={false}` on particle material
    - Set `frustumCulled={false}` on visible meshes, cap `envMapIntensity`
    - Add `useGLTF.preload('/models/drone.glb')` at module level (outside component)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 4.4_

  - [ ] 4.2 Implement dynamic import for Three.js code-splitting
    - Modify `src/components/Hero.jsx` to use `React.lazy()` for the Scene component
    - Add a Suspense boundary with a lightweight fallback (preserving layout dimensions)
    - Ensure Three.js, @react-three/fiber, and @react-three/drei are split into a separate chunk
    - _Requirements: 8.3_

- [ ] 5. Optimize Scroll Engine and Animation Controller
  - [ ] 5.1 Refactor Lenis + ScrollTrigger integration in `src/App.jsx`
    - Configure Lenis with `duration: 1.0`
    - Synchronize Lenis with GSAP ScrollTrigger via the scroll event callback (`ScrollTrigger.update()`)
    - Ensure proper cleanup: destroy Lenis instance and kill ScrollTrigger on unmount
    - _Requirements: 3.1_

  - [ ] 5.2 Refactor scroll-triggered animations across all section components
    - Wrap all GSAP animations in `gsap.context()` and call `context.revert()` on unmount
    - Set `toggleActions: "play none none reverse"` on all ScrollTrigger instances
    - Replace any `top`, `left`, `width`, `height`, `margin`, `padding` animations with `transform`/`opacity` equivalents
    - Ensure visual timing, easing, distances, and directions remain identical
    - Apply to: `HowItWorks.jsx`, `ProblemSolution.jsx`, `SektorKredibilitas.jsx`, `ClosingSection.jsx`, `FinalCTA.jsx`, `StatsBar.jsx`
    - _Requirements: 3.2, 3.3, 3.4, 9.4_

  - [ ] 5.3 Optimize Hero section parallax effect
    - Replace `gsap.set()` per-frame calls with direct `style.transform = translate3d(...)` assignment
    - Mark the mousemove event listener as `{ passive: true }`
    - Cache DOM element references outside the animation loop
    - _Requirements: 3.5, 5.2, 5.3_

  - [ ]* 5.4 Write property test for GPU-compositable animation properties
    - **Property 6: GPU-Compositable Animation Properties**
    - Parse animation configs from all ScrollTrigger definitions, verify only transform/opacity properties are animated
    - **Validates: Requirements 3.2**

  - [ ]* 5.5 Write property test for animation visual preservation
    - **Property 12: Animation Visual Preservation**
    - Generate animation parameter sets, verify duration, easing, distance, and direction are preserved after optimization
    - **Validates: Requirements 9.4**

- [ ] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Optimize Custom Cursor and Event Listeners
  - [ ] 7.1 Refactor `src/components/CustomCursor.jsx`
    - Add touch device detection: skip initialization entirely when `(hover: none), (pointer: coarse)` matches
    - Use passive event listeners for `pointermove` and `pointerover`: `{ passive: true }`
    - Implement single rAF loop with lerp-based interpolation (factor 0.14)
    - Handle `prefers-reduced-motion`: set lerp factor to 1 (instant follow)
    - Properly cancel rAF and remove all event listeners on unmount
    - _Requirements: 5.1, 5.4, 5.5, 7.4, 7.5_

  - [ ]* 7.2 Write property test for touch device cursor skip
    - **Property 7: Touch Device Cursor Skip**
    - Generate device capability combinations, verify no event listeners or animation loops on touch devices
    - **Validates: Requirements 7.4**

  - [ ]* 7.3 Write property test for reduced motion adaptation
    - **Property 8: Reduced Motion Adaptation**
    - Generate motion preference states, verify lerp=1 on reduced-motion
    - **Validates: Requirements 7.5**

  - [ ]* 7.4 Write property test for component cleanup on unmount
    - **Property 5: Component Cleanup on Unmount**
    - Simulate mount/unmount cycles, verify zero dangling event listeners and cancelled rAF callbacks
    - **Validates: Requirements 3.4, 5.5**

- [ ] 8. Optimize Image Loading and Layout Stability
  - [ ] 8.1 Apply lazy loading and layout stability to all below-fold image components
    - Add `loading="lazy"` to all below-fold images in: `ServiceCategories`, `FeaturedPilots`, `ProblemSolution`, `SektorKredibilitas`, `DualAudience`, `LiveProjects`
    - Add explicit `width`/`height` attributes or CSS `aspect-ratio` to all image containers
    - Ensure hero background, logo, and nav images do NOT have lazy loading (above-fold priority)
    - _Requirements: 4.1, 4.2, 4.5, 6.1_

  - [ ] 8.2 Add preconnect links and font optimization in `index.html`
    - Add `<link rel="preconnect" href="https://fonts.googleapis.com">` to document head
    - Add `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` to document head
    - Verify Google Fonts URL includes `&display=swap` parameter for font-display: swap
    - _Requirements: 4.3, 6.2_

  - [ ]* 8.3 Write property test for below-fold lazy loading
    - **Property 9: Below-Fold Lazy Loading**
    - Generate image element positions, verify all below-fold images have `loading="lazy"` attribute
    - **Validates: Requirements 4.1**

  - [ ]* 8.4 Write property test for layout stability (space reservation)
    - **Property 10: Layout Stability (Space Reservation)**
    - Generate container configurations for dynamically loaded content, verify explicit dimensions exist
    - **Validates: Requirements 4.5, 6.1**

- [ ] 9. Optimize Vite Build Configuration
  - [ ] 9.1 Update `vite.config.js` with chunk splitting and build optimizations
    - Add `build.rollupOptions.output.manualChunks` to split Three.js/R3F into `three-vendor` chunk
    - Add GSAP into `gsap-vendor` chunk
    - Enable `cssCodeSplit: true`
    - Configure terser minification with `compress: { passes: 2 }`
    - Do NOT add any new dependencies to package.json
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ] 9.2 Verify named imports and remove dead code
    - Audit all `lucide-react` imports to ensure named imports (not barrel imports)
    - Remove any unused CSS rules, dead code paths, or commented-out code blocks
    - Verify tree-shaking effectiveness for icon libraries
    - _Requirements: 8.1, 8.4_

- [ ] 10. Integration wiring and final verification
  - [ ] 10.1 Wire visibility-based pausing across all section components
    - Integrate `useVisibility` hook into all heavy sections: `HowItWorks`, `ProblemSolution`, `SektorKredibilitas`, `ClosingSection`, `FinalCTA`
    - Pause GSAP timelines when sections are not visible
    - Ensure only the active pinned section (DroneAnatomy) runs high-frequency updates during scroll
    - _Requirements: 7.1, 7.3_

  - [ ] 10.2 Verify visual preservation and no console errors
    - Run production build and verify no console errors, warnings, or unhandled promise rejections
    - Verify all existing interactions (hover effects, click handlers, sliders, carousels, navigation) function identically
    - Verify responsiveness at 1920px, 768px, and 375px viewports
    - _Requirements: 9.1, 9.2, 9.3, 9.5, 9.6, 9.7_

  - [ ]* 10.3 Write integration tests for performance targets
    - Verify LCP < 2.5s on simulated 4G connection
    - Verify CLS = 0 across all viewport sizes
    - Verify Three.js chunk is separate from main bundle in build output
    - Verify 60 FPS during continuous scroll (no more than 3 consecutive dropped frames)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

- [ ] 11. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties using fast-check library
- Unit tests validate specific examples and edge cases
- No new dependencies may be added — only existing packages in package.json are used
- All optimizations must preserve pixel-perfect visual fidelity across all breakpoints
- The Vite build config changes are additive and non-breaking

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3", "1.4", "1.5", "1.6", "8.2", "9.1"] },
    { "id": 2, "tasks": ["2.1", "4.1", "5.1", "7.1", "8.1", "9.2"] },
    { "id": 3, "tasks": ["2.2", "2.3", "4.2", "5.2", "7.2", "7.3", "7.4", "8.3", "8.4"] },
    { "id": 4, "tasks": ["5.3", "5.4", "5.5"] },
    { "id": 5, "tasks": ["10.1"] },
    { "id": 6, "tasks": ["10.2", "10.3"] }
  ]
}
```
