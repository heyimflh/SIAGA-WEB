import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HowItWorksPage from '../HowItWorksPage';

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/how-it-works']}>
      <HowItWorksPage />
    </MemoryRouter>
  );
}

describe('How It Works Page', () => {
  it('renders without crashing', () => {
    renderPage();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('has exactly one H1', () => {
    renderPage();
    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings).toHaveLength(1);
  });

  it('displays the correct H1 text', () => {
    renderPage();
    expect(
      screen.getByRole('heading', { level: 1 })
    ).toHaveTextContent('Dari Proyek Infrastruktur ke Laporan Inspeksi Profesional');
  });

  it('has breadcrumb with aria-label', () => {
    renderPage();
    const breadcrumb = screen.getByLabelText('Breadcrumb');
    expect(breadcrumb).toBeInTheDocument();
  });

  it('has CTA with correct href for client registration', () => {
    renderPage();
    const clientCTAs = screen.getAllByRole('link', { name: /mulai sebagai client/i });
    expect(clientCTAs.length).toBeGreaterThanOrEqual(1);
    expect(clientCTAs[0]).toHaveAttribute('href', '/register?role=client');
  });

  it('has CTA with correct href for pilot registration', () => {
    renderPage();
    const pilotCTAs = screen.getAllByRole('link', { name: /gabung sebagai pilot/i });
    expect(pilotCTAs.length).toBeGreaterThanOrEqual(1);
    expect(pilotCTAs[0]).toHaveAttribute('href', '/register?role=pilot');
  });

  it('renders 4 workflow steps', () => {
    renderPage();
    const stepLabels = ['POST PROJECT', 'SELECT PILOT', 'LIVE INSPECTION', 'AI REPORT'];
    stepLabels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('renders workflow navigator', () => {
    renderPage();
    const nav = screen.getByLabelText('Workflow steps');
    expect(nav).toBeInTheDocument();
  });

  it('renders Demo Theater with tabs', () => {
    renderPage();
    const tablist = screen.getByRole('tablist', { name: 'Demo views' });
    expect(tablist).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Client View' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Pilot View' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Report View' })).toBeInTheDocument();
  });

  it('renders Behind Workflow trust layer', () => {
    renderPage();
    expect(screen.getByText('Verified Pilot Layer')).toBeInTheDocument();
    expect(screen.getByText('Escrow & Payment Safety')).toBeInTheDocument();
    expect(screen.getByText('Inspection Data Pipeline')).toBeInTheDocument();
    expect(screen.getAllByText('Report Generator').length).toBeGreaterThanOrEqual(1);
  });

  it('renders Sample Report Preview section', () => {
    renderPage();
    expect(screen.getByText('Apa yang ada di dalam laporan?')).toBeInTheDocument();
  });

  it('renders Role-Based Benefits section', () => {
    renderPage();
    expect(screen.getAllByText('Untuk Client').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Untuk Pilot UAV').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Untuk Infrastruktur').length).toBeGreaterThanOrEqual(1);
  });
});
