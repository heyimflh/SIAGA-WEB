// Pure validation functions for auth-pages feature.
// All functions are total (defined for any input) and side-effect free,
// so they can be exercised by property-based tests without any DOM.
//
// Single source of truth for regex and constants is this module — UI
// components MUST import from here rather than re-declaring patterns.

/**
 * Email regex (Requirement 5.2 / 7.5).
 * - At least one non-whitespace, non-`@` char before `@`
 * - At least one non-whitespace, non-`@` char after `@`
 * - A `.` followed by at least 2 non-whitespace, non-`@` chars
 */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Phone regex (Requirement 7.7).
 * Allowed characters: digits, `+`, whitespace, `-`. Plus a minimum of 8
 * digits after stripping non-digit chars (enforced separately below).
 */
export const PHONE_RE = /^[\d+\s-]+$/;

/**
 * SIDOPI upload constraints (Requirement 11.2, 11.3).
 */
export const ALLOWED_MIME = ['application/pdf', 'image/jpeg', 'image/png'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

// Exact error messages — copy must be byte-for-byte identical with the
// strings referenced by the design and the property tests.
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

/**
 * Treat non-strings and whitespace-only strings as empty.
 */
function isEmpty(s) {
  return typeof s !== 'string' || s.trim() === '';
}

/**
 * @param {string} s
 * @returns {{ ok: boolean, error?: string }}
 */
export function validateEmail(s) {
  if (isEmpty(s)) return { ok: false, error: MSG.emailRequired };
  if (!EMAIL_RE.test(s)) return { ok: false, error: MSG.emailInvalid };
  return { ok: true };
}

/**
 * @param {string} s
 * @returns {{ ok: boolean, error?: string }}
 */
export function validatePassword(s) {
  if (isEmpty(s)) return { ok: false, error: MSG.passwordRequired };
  if (s.length < 8) return { ok: false, error: MSG.passwordTooShort };
  return { ok: true };
}

/**
 * @param {string} s
 * @returns {{ ok: boolean, error?: string }}
 */
export function validatePhone(s) {
  if (isEmpty(s)) return { ok: false, error: MSG.fieldRequired };
  if (!PHONE_RE.test(s)) return { ok: false, error: MSG.phoneInvalid };
  // Reject inputs with fewer than 8 numeric digits.
  const digitCount = (s.match(/\d/g) || []).length;
  if (digitCount < 8) return { ok: false, error: MSG.phoneInvalid };
  return { ok: true };
}

/**
 * Login validator — returns errors keyed by field.
 * @param {{ email: string, password: string }} input
 * @returns {{ ok: boolean, errors: { email?: string, password?: string } }}
 */
export function validateLogin(input) {
  const safe = input || {};
  const errors = {};

  const e = validateEmail(safe.email);
  if (!e.ok) errors.email = e.error;

  const p = validatePassword(safe.password);
  if (!p.ok) errors.password = p.error;

  return { ok: Object.keys(errors).length === 0, errors };
}

// Field shapes per role (kept here, not exported, so consumers stay
// dependent on validateStep2 rather than reaching into internals).
const STEP2_FIELDS = {
  client: ['companyName', 'corporateEmail', 'phone', 'password', 'confirmPassword'],
  pilot: ['fullName', 'email', 'phone', 'password', 'confirmPassword'],
};

const EMAIL_FIELD_BY_ROLE = {
  client: 'corporateEmail',
  pilot: 'email',
};

/**
 * Step 2 validator. Returns the same shape as validateLogin but keyed by
 * the role-specific field names.
 *
 * @param {'client'|'pilot'} role
 * @param {Record<string, string>} fields
 * @returns {{ ok: boolean, errors: Record<string, string> }}
 */
export function validateStep2(role, fields) {
  const errors = {};
  const list = STEP2_FIELDS[role];

  // Unknown role → treat as ok:false with no errors map; reducer guards
  // already prevent this path, but we stay total.
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

/**
 * SIDOPI file validator (Requirement 11.2, 11.3).
 * Total over `File | null`; null → ok:false with no error so callers can
 * gate UI without rendering a stale message.
 *
 * @param {File|{type:string,size:number}|null} file
 * @returns {{ ok: boolean, error?: string }}
 */
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

/**
 * Pure submit-gating predicate for Register Step 3 (Property 4).
 *
 * @param {{
 *   role: 'client'|'pilot'|null,
 *   termsAccepted: boolean,
 *   sidopiFile: object|null,
 * }} state
 * @returns {boolean}
 */
export function isSubmitEnabled(state) {
  if (!state || !state.termsAccepted) return false;
  if (state.role === 'client') return true;
  if (state.role === 'pilot') {
    if (state.sidopiFile == null) return false;
    if (!validateSidopiFile(state.sidopiFile).ok) return false;
    return true;
  }
  // Unknown/null role: gate closed.
  return false;
}
