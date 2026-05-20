import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PricingPage from '../PricingPage';
import { COMMISSION } from '../data/commission-data';
import { faqItems } from '../data/faq-data';
import { pricingTiers } from '../data/pricing-data';
import { trustBadges } from '../data/trust-badges-data';
import { getFAQPanelId, getFAQButtonId } from '../../SupportingPages/supporting-page-utils';

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/pricing']}>
      <PricingPage />
    </MemoryRouter>
  );
}

describe('Pricing Page', () => {
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
    ).toHaveTextContent('Harga Transparan untuk Inspeksi Infrastruktur');
  });

  it('renders exactly 3 pricing tiers', () => {
    renderPage();
    expect(pricingTiers).toHaveLength(3);
    // Use getAllByText since some labels appear in multiple places (e.g. FAQ chips)
    expect(screen.getAllByText('Basic').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Professional').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Enterprise').length).toBeGreaterThanOrEqual(1);
  });

  it('Professional tier has Most Popular badge', () => {
    renderPage();
    expect(screen.getByText('Most Popular')).toBeInTheDocument();
  });

  it('renders CTA with correct href for Daftar Sekarang', () => {
    renderPage();
    const registerCTA = screen.getByRole('link', { name: /daftar sekarang/i });
    expect(registerCTA).toHaveAttribute('href', '/register?role=client');
  });

  it('renders link to How It Works', () => {
    renderPage();
    const hiwLink = screen.getByRole('link', { name: /lihat cara kerja/i });
    expect(hiwLink).toHaveAttribute('href', '/how-it-works');
  });

  it('renders trust badges', () => {
    renderPage();
    expect(trustBadges).toHaveLength(5);
    trustBadges.forEach((badge) => {
      // Some badge labels may appear in trust chips too, use getAllByText
      expect(screen.getAllByText(badge.label).length).toBeGreaterThanOrEqual(1);
    });
  });
});

describe('Commission Data Invariant', () => {
  it('platformPercent + pilotPercent === 100', () => {
    expect(COMMISSION.platformPercent + COMMISSION.pilotPercent).toBe(100);
  });

  it('platformPercent is 7', () => {
    expect(COMMISSION.platformPercent).toBe(7);
  });

  it('pilotPercent is 93', () => {
    expect(COMMISSION.pilotPercent).toBe(93);
  });

  it('COMMISSION is frozen (immutable)', () => {
    expect(Object.isFrozen(COMMISSION)).toBe(true);
  });
});

describe('FAQ Knowledge Base', () => {
  it('renders 10 FAQ items', () => {
    renderPage();
    expect(faqItems).toHaveLength(10);
    faqItems.forEach((item) => {
      expect(screen.getByText(item.question)).toBeInTheDocument();
    });
  });

  it('all FAQ items are closed initially', () => {
    renderPage();
    const buttons = screen.getAllByRole('button', { expanded: false });
    const faqButtons = buttons.filter((btn) =>
      faqItems.some((item) => btn.textContent.includes(item.question))
    );
    expect(faqButtons.length).toBe(10);
  });

  it('clicking a FAQ item opens it', () => {
    renderPage();
    const firstButton = screen.getByText(faqItems[0].question).closest('button');
    fireEvent.click(firstButton);
    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('clicking an open FAQ item closes it (toggle self-inverse)', () => {
    renderPage();
    const firstButton = screen.getByText(faqItems[0].question).closest('button');
    fireEvent.click(firstButton);
    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(firstButton);
    expect(firstButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('at most one FAQ item is open at a time', () => {
    renderPage();
    const firstButton = screen.getByText(faqItems[0].question).closest('button');
    const secondButton = screen.getByText(faqItems[1].question).closest('button');

    fireEvent.click(firstButton);
    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    expect(secondButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(secondButton);
    expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    expect(secondButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('FAQ aria-expanded reflects open state correctly', () => {
    renderPage();
    const firstButton = screen.getByText(faqItems[0].question).closest('button');
    expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(firstButton);
    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('FAQ aria-controls references correct content panel', () => {
    renderPage();
    faqItems.forEach((item) => {
      const button = screen.getByText(item.question).closest('button');
      const expectedPanelId = getFAQPanelId(item.id);
      expect(button).toHaveAttribute('aria-controls', expectedPanelId);
      expect(document.getElementById(expectedPanelId)).toBeInTheDocument();
    });
  });

  it('FAQ Enter key toggles item', () => {
    renderPage();
    const firstButton = screen.getByText(faqItems[0].question).closest('button');
    fireEvent.keyDown(firstButton, { key: 'Enter' });
    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(firstButton, { key: 'Enter' });
    expect(firstButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('FAQ Space key toggles item', () => {
    renderPage();
    const firstButton = screen.getByText(faqItems[0].question).closest('button');
    fireEvent.keyDown(firstButton, { key: ' ' });
    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(firstButton, { key: ' ' });
    expect(firstButton).toHaveAttribute('aria-expanded', 'false');
  });
});
