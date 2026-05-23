export const MAP_STATUSES = Object.freeze(['aman', 'perlu_perhatian', 'kritis']);

export function filterAssets(assets, filterValue) {
 if (filterValue === 'all') {
 return assets;
 }
 return assets.filter((asset) => asset.status === filterValue);
}

export function getDisabledFilterOptions(assets) {
 const present = new Set();
 for (const asset of assets) {
 present.add(asset.status);
 }
 return MAP_STATUSES.filter((status) => !present.has(status));
}
