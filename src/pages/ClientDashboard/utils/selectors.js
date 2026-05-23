export function selectAssetCount(data) {
 return data.assets.length;
}

export function selectKritisCount(data) {
 return data.assets.filter((a) => a.status === 'kritis').length;
}

export function selectPerluPerhatianCount(data) {
 return data.assets.filter((a) => a.status === 'perlu_perhatian').length;
}

export function selectActiveProjectCount(data) {
 return data.proyek_aktif.filter((p) => p.is_active !== false).length;
}

export function selectBidsForProject(data, projectId) {
 return data.bids.filter((b) => b.project_id === projectId);
}

export function selectCompanyByEmail(data, email) {
 const normalized = typeof email === 'string' ? email.trim().toLowerCase() : '';
 const perusahaan = data.perusahaan;

 if (
 perusahaan &&
 typeof perusahaan.email === 'string' &&
 perusahaan.email.trim().toLowerCase() === normalized &&
 normalized.length > 0
 ) {
 return perusahaan;
 }

 const safeEmail = typeof email === 'string' ? email : '';
 return {
 nama: safeEmail,
 email: safeEmail,
 avatar: null,
 };
}
