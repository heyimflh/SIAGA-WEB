/**
 * deadlineUrgency.js — Deadline urgency check.
 *
 * Pure function, no side effects.
 * Feature: pilot-dashboard
 * Validates: Requirements 9, 15
 */

export function isDeadlineUrgent(deadline, now = new Date()) {
  const deadlineDate = new Date(deadline);
  if (isNaN(deadlineDate.getTime())) return false;
  const diffMs = deadlineDate.getTime() - now.getTime();
  if (diffMs < 0) return true; // past deadline is urgent
  const diffDays = diffMs / (24 * 60 * 60 * 1000);
  return diffDays <= 3;
}
