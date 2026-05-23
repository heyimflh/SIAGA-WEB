export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const PHONE_RE = /^[\d+\s-]+$/;

export const ALLOWED_MIME = ['application/pdf', 'image/jpeg', 'image/png'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

const MSG = {
 emailRequired: 'Email wajib diisi',
 emailInvalid: 'Format email tidak valid',
 passwordRequired: 'Password wajib diisi',
 passwordTooShort: 'Password minimal 8 karakter',
 fieldRequired: 'Field ini wajib diisi',
 confirmMismatch: 'Konfirmasi password tidak cocok',
 phoneInvalid: 'Nomor telepon tidak valid',
 fileFormat: 'Format file harus PDF, JPG, atau PNG',
 fileSize: 'Ukuran file maksimal 5 MB',
};

function isEmpty(s) {
 return typeof s !== 'string' || s.trim() === '';
}

export function validateEmail(s) {
 if (isEmpty(s)) return { ok: false, error: MSG.emailRequired };
 if (!EMAIL_RE.test(s)) return { ok: false, error: MSG.emailInvalid };
 return { ok: true };
}

export function validatePassword(s) {
 if (isEmpty(s)) return { ok: false, error: MSG.passwordRequired };
 if (s.length < 8) return { ok: false, error: MSG.passwordTooShort };
 return { ok: true };
}

export function validatePhone(s) {
 if (isEmpty(s)) return { ok: false, error: MSG.fieldRequired };
 if (!PHONE_RE.test(s)) return { ok: false, error: MSG.phoneInvalid };

 const digitCount = (s.match(/\d/g) || []).length;
 if (digitCount < 8) return { ok: false, error: MSG.phoneInvalid };
 return { ok: true };
}

export function validateLogin(input) {
 const safe = input || {};
 const errors = {};

 const e = validateEmail(safe.email);
 if (!e.ok) errors.email = e.error;

 const p = validatePassword(safe.password);
 if (!p.ok) errors.password = p.error;

 return { ok: Object.keys(errors).length === 0, errors };
}

const STEP2_FIELDS = {
 client: ['companyName', 'corporateEmail', 'phone', 'password', 'confirmPassword'],
 pilot: ['fullName', 'email', 'phone', 'password', 'confirmPassword'],
};

const EMAIL_FIELD_BY_ROLE = {
 client: 'corporateEmail',
 pilot: 'email',
};

export function validateStep2(role, fields) {
 const errors = {};
 const list = STEP2_FIELDS[role];

 if (!list) return { ok: false, errors };

 const safe = fields || {};
 const emailField = EMAIL_FIELD_BY_ROLE[role];

 for (const name of list) {
 const value = safe[name];

 if (isEmpty(value)) {
 errors[name] = MSG.fieldRequired;
 continue;
 }

 if (name === emailField) {
 if (!EMAIL_RE.test(value)) errors[name] = MSG.emailInvalid;
 continue;
 }

 if (name === 'phone') {
 const phoneRes = validatePhone(value);
 if (!phoneRes.ok) errors[name] = phoneRes.error;
 continue;
 }

 if (name === 'password') {
 if (value.length < 8) errors[name] = MSG.passwordTooShort;
 continue;
 }

 if (name === 'confirmPassword') {
 if (value !== safe.password) errors[name] = MSG.confirmMismatch;
 continue;
 }
 }

 return { ok: Object.keys(errors).length === 0, errors };
}

export function validateSidopiFile(file) {
 if (file == null) return { ok: false };
 if (!ALLOWED_MIME.includes(file.type)) {
 return { ok: false, error: MSG.fileFormat };
 }
 if (file.size > MAX_FILE_SIZE) {
 return { ok: false, error: MSG.fileSize };
 }
 return { ok: true };
}

export function isSubmitEnabled(state) {
 if (!state || !state.termsAccepted) return false;
 if (state.role === 'client') return true;
 if (state.role === 'pilot') {
 if (state.sidopiFile == null) return false;
 if (!validateSidopiFile(state.sidopiFile).ok) return false;
 return true;
 }

 return false;
}
