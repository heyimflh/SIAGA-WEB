/**
 * Accessibility tests for Job Radar Page.
 *
 * Validates: Requirements 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 13.10
 *
 * Tests:
 * 1. axe accessibility scan passes (vitest-axe)
 * 2. Infrastructure chips have role="checkbox" and aria-checked
 * 3. Value range slider has role="slider" with aria-valuemin/max/now
 * 4. Project cards have role="button" with aria-label
 * 5. Sidebar toggle has aria-expanded
 * 6. Sort control has aria-label
 * 7. aria-live region exists for announcements
 * 8. Keyboard tab traversal: filter chips, slider, cards, sort control all focusable
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import 'vitest-axe/extend-expect';

// Mock mapbox-gl — WebGL is not available in jsdom test environment
vi.mock('mapbox-gl', () => {
 const mockMap = {
 on: vi.fn(),
 off: vi.fn(),
 once: vi.fn(),
 remove: vi.fn(),
 resize: vi.fn(),
 getZoom: vi.fn(() => 5),
 getSource: vi.fn(() => null),
 addSource: vi.fn(),
 addLayer: vi.fn(),
 setTerrain: vi.fn(),
 setFog: vi.fn(),
 flyTo: vi.fn(),
 easeTo: vi.fn(),
 getCanvas: vi.fn(() => ({ style: {} })),
 queryRenderedFeatures: vi.fn(() => []),
 };

 return {
 default: {
 accessToken: '',
 Map: vi.fn(() => mockMap),
 Marker: vi.fn(() => ({
 setLngLat: vi.fn().mockReturnThis(),
 addTo: vi.fn().mockReturnThis(),
 remove: vi.fn(),
 getElement: vi.fn(() => document.createElement('div')),
 })),
 NavigationControl: vi.fn(),
 },
 };
});

// Mock mapbox-gl CSS import
vi.mock('mapbox-gl/dist/mapbox-gl.css', () => ({}));

// Mock react-countup to render static values (avoids animation timing issues)
vi.mock('react-countup', () => {
 const React = require('react');
 return {
 default: ({ end }) => React.createElement('span', null, end),
 };
});

// Mock ResizeObserver (not available in jsdom)
global.ResizeObserver = vi.fn(() => ({
 observe: vi.fn(),
 unobserve: vi.fn(),
 disconnect: vi.fn(),
}));

import JobRadarPage from '../JobRadarPage';

beforeEach(() => {
 // Set viewport to desktop so sidebar is open by default
 Object.defineProperty(window, 'innerWidth', { value: 1440, writable: true });
});

afterEach(() => {
 vi.restoreAllMocks();
});

describe('Job Radar Page — Accessibility', () => {
 // ─────────────────────────────────────────────────────────────────────
 // 1. axe accessibility scan — no violations
 // Validates: Requirements 13.1-13.10
 // ─────────────────────────────────────────────────────────────────────
 it('passes axe accessibility scan with no violations', async () => {
 const { container } = render(<JobRadarPage />);

 const results = await axe(container, {
 rules: {
 // Disable color-contrast rule since CSS isn't fully computed in jsdom
 'color-contrast': { enabled: false },
 // Disable region rule — full page layout doesn't need landmark wrapping in test
 region: { enabled: false },
 },
 });

 expect(results).toHaveNoViolations();
 });

 // ─────────────────────────────────────────────────────────────────────
 // 2. Infrastructure chips have role="checkbox" and aria-checked
 // Validates: // ─────────────────────────────────────────────────────────────────────
 it('infrastructure chips have role="checkbox" with aria-checked', () => {
 render(<JobRadarPage />);

 const chips = screen.getAllByRole('checkbox');
 expect(chips.length).toBeGreaterThanOrEqual(6); // 6 infrastructure types

 // All chips should have aria-checked attribute
 chips.forEach((chip) => {
 expect(chip).toHaveAttribute('aria-checked');
 });

 // Initially all chips should be unchecked (no filter active)
 chips.forEach((chip) => {
 expect(chip).toHaveAttribute('aria-checked', 'false');
 });
 });

 // ─────────────────────────────────────────────────────────────────────
 // 3. Value range slider has role="slider" with aria-valuemin/max/now
 // Validates: // ─────────────────────────────────────────────────────────────────────
 it('value range sliders have role="slider" with aria-valuemin, aria-valuemax, aria-valuenow', () => {
 render(<JobRadarPage />);

 const sliders = screen.getAllByRole('slider');
 expect(sliders.length).toBe(2); // min and max thumbs

 sliders.forEach((slider) => {
 expect(slider).toHaveAttribute('aria-valuemin');
 expect(slider).toHaveAttribute('aria-valuemax');
 expect(slider).toHaveAttribute('aria-valuenow');
 expect(slider).toHaveAttribute('aria-label');
 });

 // Check specific values for the min slider
 const minSlider = screen.getByLabelText('Nilai minimum proyek');
 expect(minSlider).toHaveAttribute('aria-valuemin', '0');
 expect(minSlider).toHaveAttribute('aria-valuemax', '2500000000');

 // Check specific values for the max slider
 const maxSlider = screen.getByLabelText('Nilai maksimum proyek');
 expect(maxSlider).toHaveAttribute('aria-valuemin', '0');
 expect(maxSlider).toHaveAttribute('aria-valuemax', '2500000000');
 });

 // ─────────────────────────────────────────────────────────────────────
 // 4. Project cards have role="button" with aria-label
 // Validates: // ─────────────────────────────────────────────────────────────────────
 it('project cards have role="button" with descriptive aria-label', () => {
 render(<JobRadarPage />);

 const buttons = screen.getAllByRole('button');
 // Filter to only project cards (they have aria-label starting with "Proyek")
 const projectCards = buttons.filter(
 (btn) => btn.getAttribute('aria-label')?.startsWith('Proyek ')
 );

 expect(projectCards.length).toBeGreaterThan(0);

 // Each project card aria-label should mention project name and location
 projectCards.forEach((card) => {
 const label = card.getAttribute('aria-label');
 expect(label).toMatch(/Proyek .+ di .+/);
 });
 });

 // ─────────────────────────────────────────────────────────────────────
 // 5. Sidebar toggle has aria-expanded
 // Validates: // ─────────────────────────────────────────────────────────────────────
 it('sidebar toggle button has aria-expanded and descriptive aria-label', () => {
 render(<JobRadarPage />);

 // On desktop, sidebar is open by default
 const toggleBtn = screen.getByLabelText('Tutup sidebar');
 expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
 });

 // ─────────────────────────────────────────────────────────────────────
 // 6. Sort control has aria-label
 // Validates: // ─────────────────────────────────────────────────────────────────────
 it('sort control has descriptive aria-label with active sort option', () => {
 render(<JobRadarPage />);

 const sortGroup = screen.getByRole('group', { name: /urutkan proyek/i });
 expect(sortGroup).toBeInTheDocument();
 expect(sortGroup.getAttribute('aria-label')).toMatch(/aktif:/i);

 // Sort buttons should have aria-pressed and aria-label
 const sortButtons = within(sortGroup).getAllByRole('button');
 expect(sortButtons.length).toBe(3);

 sortButtons.forEach((btn) => {
 expect(btn).toHaveAttribute('aria-pressed');
 expect(btn).toHaveAttribute('aria-label');
 });
 });

 // ─────────────────────────────────────────────────────────────────────
 // 7. aria-live region exists for screen reader announcements
 // Validates: // ─────────────────────────────────────────────────────────────────────
 it('aria-live polite region exists for flyTo announcements', () => {
 const { container } = render(<JobRadarPage />);

 const liveRegion = container.querySelector('[aria-live="polite"]');
 expect(liveRegion).toBeInTheDocument();
 expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
 });

 // ─────────────────────────────────────────────────────────────────────
 // 8. Keyboard tab traversal — all interactive elements are focusable
 // Validates: , 13.10
 // ─────────────────────────────────────────────────────────────────────
 it('filter chips, sliders, cards, and sort control are all focusable via tabIndex', () => {
 render(<JobRadarPage />);

 // Infrastructure chips should be focusable (tabIndex=0)
 const chips = screen.getAllByRole('checkbox');
 chips.forEach((chip) => {
 expect(chip).toHaveAttribute('tabindex', '0');
 });

 // Sliders are native input[type=range] — inherently focusable
 const sliders = screen.getAllByRole('slider');
 sliders.forEach((slider) => {
 expect(slider.tagName.toLowerCase()).toBe('input');
 });

 // Project cards should be focusable (tabIndex=0)
 const allButtons = screen.getAllByRole('button');
 const projectCards = allButtons.filter(
 (btn) => btn.getAttribute('aria-label')?.startsWith('Proyek ')
 );
 projectCards.forEach((card) => {
 expect(card).toHaveAttribute('tabindex', '0');
 });

 // Sort control buttons are native <button> — inherently focusable
 const sortGroup = screen.getByRole('group', { name: /urutkan proyek/i });
 const sortButtons = within(sortGroup).getAllByRole('button');
 sortButtons.forEach((btn) => {
 expect(btn.tagName.toLowerCase()).toBe('button');
 });
 });
});
