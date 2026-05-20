/**
 * Property test for deadline urgency.
 * Feature: pilot-dashboard
 */

import { describe, it, expect } from 'vitest';
import { isDeadlineUrgent } from '../utils/deadlineUrgency.js';

describe('isDeadlineUrgent', () => {
  const now = new Date('2026-01-15T12:00:00Z');

  it('returns true for deadline <= 3 days away', () => {
    expect(isDeadlineUrgent('2026-01-15', now)).toBe(true); // same day
    expect(isDeadlineUrgent('2026-01-16', now)).toBe(true); // 1 day
    expect(isDeadlineUrgent('2026-01-17', now)).toBe(true); // 2 days
    expect(isDeadlineUrgent('2026-01-18', now)).toBe(true); // 3 days
  });

  it('returns false for deadline > 3 days away', () => {
    expect(isDeadlineUrgent('2026-01-20', now)).toBe(false); // 5 days
    expect(isDeadlineUrgent('2026-02-01', now)).toBe(false); // 17 days
  });

  it('returns true for past deadlines', () => {
    expect(isDeadlineUrgent('2026-01-10', now)).toBe(true);
  });

  it('returns false for invalid date', () => {
    expect(isDeadlineUrgent('invalid', now)).toBe(false);
  });
});
