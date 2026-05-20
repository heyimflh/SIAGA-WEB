/**
 * selectors.js — Pure selector functions for derived dashboard metrics.
 *
 * All functions are pure, do not mutate input, and maintain cross-section consistency.
 * Feature: pilot-dashboard
 * Validates: Requirements 14, 15
 */

export function selectPendingBidCount(bids) {
  if (!Array.isArray(bids)) return 0;
  return bids.filter((b) => b.status === 'pending').length;
}

export function selectProyekBerjalanCount(proyek) {
  if (!Array.isArray(proyek)) return 0;
  return proyek.length;
}

export function selectTotalEarnings(earnings) {
  if (!earnings || typeof earnings.total_kumulatif !== 'number') return 0;
  return earnings.total_kumulatif;
}

export function selectRatingAvg(profile) {
  if (!profile || typeof profile.rating_avg !== 'number') return 0;
  return profile.rating_avg;
}

export function selectUrgentDeadlineCount(projects, now = new Date()) {
  if (!Array.isArray(projects)) return 0;
  const nowTime = now.getTime();
  const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
  return projects.filter((p) => {
    const deadline = new Date(p.deadline).getTime();
    return deadline - nowTime <= threeDaysMs && deadline >= nowTime;
  }).length;
}

export function selectNextDeadline(projects, now = new Date()) {
  if (!Array.isArray(projects) || projects.length === 0) return null;
  const nowTime = now.getTime();
  const upcoming = projects
    .map((p) => ({ ...p, deadlineTime: new Date(p.deadline).getTime() }))
    .filter((p) => p.deadlineTime >= nowTime)
    .sort((a, b) => a.deadlineTime - b.deadlineTime);
  if (upcoming.length === 0) return null;
  const diffMs = upcoming[0].deadlineTime - nowTime;
  const diffDays = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
  return `${diffDays} hari lagi`;
}
