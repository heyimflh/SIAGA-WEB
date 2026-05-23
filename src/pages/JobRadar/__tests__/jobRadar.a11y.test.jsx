import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import 'vitest-axe/extend-expect';

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

vi.mock('mapbox-gl/dist/mapbox-gl.css', () => ({}));

vi.mock('react-countup', () => {
 const React = require('react');
 return {
 default: ({ end }) => React.createElement('span', null, end),
 };
});

global.ResizeObserver = vi.fn(() => ({
 observe: vi.fn(),
 unobserve: vi.fn(),
 disconnect: vi.fn(),
}));

import JobRadarPage from '../JobRadarPage';

beforeEach(() => {

 Object.defineProperty(window, 'innerWidth', { value: 1440, writable: true });
});

afterEach(() => {
 vi.restoreAllMocks();
});

describe('Job Radar Page — Accessibility', () => {

 it('passes axe accessibility scan with no violations', async () => {
 const { container } = render(<JobRadarPage />);

 const results = await axe(container, {
 rules: {

 'color-contrast': { enabled: false },

 region: { enabled: false },
 },
 });

 expect(results).toHaveNoViolations();
 });

 it('infrastructure chips have role="checkbox" with aria-checked', () => {
 render(<JobRadarPage />);

 const chips = screen.getAllByRole('checkbox');
 expect(chips.length).toBeGreaterThanOrEqual(6);

 chips.forEach((chip) => {
 expect(chip).toHaveAttribute('aria-checked');
 });

 chips.forEach((chip) => {
 expect(chip).toHaveAttribute('aria-checked', 'false');
 });
 });

 it('value range sliders have role="slider" with aria-valuemin, aria-valuemax, aria-valuenow', () => {
 render(<JobRadarPage />);

 const sliders = screen.getAllByRole('slider');
 expect(sliders.length).toBe(2);

 sliders.forEach((slider) => {
 expect(slider).toHaveAttribute('aria-valuemin');
 expect(slider).toHaveAttribute('aria-valuemax');
 expect(slider).toHaveAttribute('aria-valuenow');
 expect(slider).toHaveAttribute('aria-label');
 });

 const minSlider = screen.getByLabelText('Nilai minimum proyek');
 expect(minSlider).toHaveAttribute('aria-valuemin', '0');
 expect(minSlider).toHaveAttribute('aria-valuemax', '2500000000');

 const maxSlider = screen.getByLabelText('Nilai maksimum proyek');
 expect(maxSlider).toHaveAttribute('aria-valuemin', '0');
 expect(maxSlider).toHaveAttribute('aria-valuemax', '2500000000');
 });

 it('project cards have role="button" with descriptive aria-label', () => {
 render(<JobRadarPage />);

 const buttons = screen.getAllByRole('button');

 const projectCards = buttons.filter(
 (btn) => btn.getAttribute('aria-label')?.startsWith('Proyek ')
 );

 expect(projectCards.length).toBeGreaterThan(0);

 projectCards.forEach((card) => {
 const label = card.getAttribute('aria-label');
 expect(label).toMatch(/Proyek .+ di .+/);
 });
 });

 it('sidebar toggle button has aria-expanded and descriptive aria-label', () => {
 render(<JobRadarPage />);

 const toggleBtn = screen.getByLabelText('Tutup sidebar');
 expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
 });

 it('sort control has descriptive aria-label with active sort option', () => {
 render(<JobRadarPage />);

 const sortGroup = screen.getByRole('group', { name: /urutkan proyek/i });
 expect(sortGroup).toBeInTheDocument();
 expect(sortGroup.getAttribute('aria-label')).toMatch(/aktif:/i);

 const sortButtons = within(sortGroup).getAllByRole('button');
 expect(sortButtons.length).toBe(3);

 sortButtons.forEach((btn) => {
 expect(btn).toHaveAttribute('aria-pressed');
 expect(btn).toHaveAttribute('aria-label');
 });
 });

 it('aria-live polite region exists for flyTo announcements', () => {
 const { container } = render(<JobRadarPage />);

 const liveRegion = container.querySelector('[aria-live="polite"]');
 expect(liveRegion).toBeInTheDocument();
 expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
 });

 it('filter chips, sliders, cards, and sort control are all focusable via tabIndex', () => {
 render(<JobRadarPage />);

 const chips = screen.getAllByRole('checkbox');
 chips.forEach((chip) => {
 expect(chip).toHaveAttribute('tabindex', '0');
 });

 const sliders = screen.getAllByRole('slider');
 sliders.forEach((slider) => {
 expect(slider.tagName.toLowerCase()).toBe('input');
 });

 const allButtons = screen.getAllByRole('button');
 const projectCards = allButtons.filter(
 (btn) => btn.getAttribute('aria-label')?.startsWith('Proyek ')
 );
 projectCards.forEach((card) => {
 expect(card).toHaveAttribute('tabindex', '0');
 });

 const sortGroup = screen.getByRole('group', { name: /urutkan proyek/i });
 const sortButtons = within(sortGroup).getAllByRole('button');
 sortButtons.forEach((btn) => {
 expect(btn.tagName.toLowerCase()).toBe('button');
 });
 });
});
