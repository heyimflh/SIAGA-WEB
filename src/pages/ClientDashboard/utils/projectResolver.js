export function resolveInitialProjectId(mockData, stored) {
 const list =
 mockData && Array.isArray(mockData.proyek_aktif)
 ? mockData.proyek_aktif
 : [];

 if (list.length === 0) {
 return null;
 }

 if (typeof stored === 'string' && list.some((p) => p && p.id === stored)) {
 return stored;
 }

 return list[0].id;
}
