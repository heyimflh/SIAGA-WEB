/**
 * Browse Pilots — Pure filter/search logic
 * Feature: browse-pilots
 */

export function matchesSearch(pilot, query) {
 if (!query || !query.trim()) return true;
 const q = query.toLowerCase().trim();
 const fields = [
 pilot.name,
 pilot.city,
 pilot.province,
 pilot.drone_type,
 ...(pilot.specializations || []),
 ];
 return fields.some((f) => f && f.toLowerCase().includes(q));
}

export function matchesSpecializations(pilot, activeSpecs) {
 if (!activeSpecs || activeSpecs.length === 0) return true;
 return activeSpecs.some((spec) =>
 (pilot.specializations || []).includes(spec)
 );
}

export function matchesProvince(pilot, province) {
 if (!province) return true;
 return pilot.province === province;
}

export function matchesRating(pilot, minRating) {
 if (!minRating) return true;
 return pilot.rating >= minRating;
}

export function matchesVerified(pilot, verifiedOnly) {
 if (!verifiedOnly) return true;
 return pilot.siaga_verified === true;
}

export function applySearch(pilots, query) {
 if (!query || !query.trim()) return pilots;
 return pilots.filter((p) => matchesSearch(p, query));
}

export function applyFilters(pilots, filters) {
 if (!filters) return pilots;
 return pilots.filter((p) => {
 if (!matchesSpecializations(p, filters.specializations)) return false;
 if (!matchesProvince(p, filters.province)) return false;
 if (!matchesRating(p, filters.minRating)) return false;
 if (!matchesVerified(p, filters.verifiedOnly)) return false;
 return true;
 });
}

export function applySearchAndFilters(pilots, query, filters) {
 let result = pilots;
 result = applySearch(result, query);
 result = applyFilters(result, filters);
 return result;
}

export function getAutocompleteSuggestions(pilots, query, maxResults = 5) {
 if (!query || query.trim().length < 2) return [];
 const q = query.toLowerCase().trim();
 const suggestions = [];
 const seen = new Set();

 // Pilot names
 for (const p of pilots) {
 if (p.name.toLowerCase().includes(q) && !seen.has(p.name)) {
 suggestions.push({ text: p.name, type: 'pilot' });
 seen.add(p.name);
 }
 if (suggestions.length >= maxResults) return suggestions;
 }

 // Locations (city + province)
 for (const p of pilots) {
 if (p.city.toLowerCase().includes(q) && !seen.has(p.city)) {
 suggestions.push({ text: p.city, type: 'location' });
 seen.add(p.city);
 }
 if (suggestions.length >= maxResults) return suggestions;
 if (p.province.toLowerCase().includes(q) && !seen.has(p.province)) {
 suggestions.push({ text: p.province, type: 'location' });
 seen.add(p.province);
 }
 if (suggestions.length >= maxResults) return suggestions;
 }

 // Specializations
 const allSpecs = new Set();
 for (const p of pilots) {
 for (const s of p.specializations || []) {
 if (s.toLowerCase().includes(q) && !seen.has(s)) {
 allSpecs.add(s);
 }
 }
 }
 for (const s of allSpecs) {
 suggestions.push({ text: s, type: 'specialization' });
 seen.add(s);
 if (suggestions.length >= maxResults) return suggestions;
 }

 // Drone types
 for (const p of pilots) {
 if (p.drone_type && p.drone_type.toLowerCase().includes(q) && !seen.has(p.drone_type)) {
 suggestions.push({ text: p.drone_type, type: 'drone' });
 seen.add(p.drone_type);
 if (suggestions.length >= maxResults) return suggestions;
 }
 }

 return suggestions.slice(0, maxResults);
}

export function highlightMatch(text, query) {
 if (!query || !query.trim() || !text) return text;
 const q = query.trim();
 const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
 return text.replace(regex, '<mark>$1</mark>');
}

export function getActiveFilterCount(filters, query) {
 let count = 0;
 if (query && query.trim()) count++;
 if (filters) {
 if (filters.specializations && filters.specializations.length > 0) count += filters.specializations.length;
 if (filters.province) count++;
 if (filters.minRating) count++;
 if (filters.verifiedOnly) count++;
 }
 return count;
}

export function getResultSummary(totalCount, visibleCount) {
 if (totalCount === 0) return { total: '0 pilot ditemukan', visible: '' };
 const totalText = `${totalCount} pilot ditemukan`;
 if (visibleCount >= totalCount) {
 return { total: totalText, visible: 'Semua pilot ditampilkan' };
 }
 return { total: totalText, visible: `Menampilkan ${visibleCount} dari ${totalCount}` };
}
