// Feature: auth-pages, Property 1: Login validation rejects invalid inputs and accepts valid ones
//
// Validates: Requirements 5.1, 5.2, 5.3, 5.4
//
// Property statement:
//   For ANY (email, password) pair, validateLogin({ email, password }) returns
//   { ok: true, errors: {} } iff
//     (typeof email === 'string' && email.trim() !== '' && EMAIL_RE.test(email))
//     AND
//     (typeof password === 'string' && password.trim() !== '' && password.length >= 8).
//   Otherwise, errors carry the EXACT messages required by the spec:
//     - empty email                          -> "Email wajib diisi"
//     - non-empty but malformed email        -> "Format email tidak valid"
//     - empty password                       -> "Password wajib diisi"
//     - non-empty password shorter than 8    -> "Password minimal 8 karakter"

import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { validateLogin, EMAIL_RE } from './validators.js';

const MSG = {
  emailRequired: 'Email wajib diisi',
  emailInvalid: 'Format email tidak valid',
  passwordRequired: 'Password wajib diisi',
  passwordTooShort: 'Password minimal 8 karakter',
};

// Mirror of the validators' isEmpty helper. Strings that are not strings
// or whitespace-only count as empty.
const isEmpty = (s) => typeof s !== 'string' || s.trim() === '';

const expectedEmailError = (email) => {
  if (isEmpty(email)) return MSG.emailRequired;
  if (!EMAIL_RE.test(email)) return MSG.emailInvalid;
  return undefined;
};

const expectedPasswordError = (password) => {
  if (isEmpty(password)) return MSG.passwordRequired;
  if (password.length < 8) return MSG.passwordTooShort;
  return undefined;
};

// A generator that biases toward interesting cases:
//   - empty strings, whitespace-only strings (treated as empty)
//   - arbitrary garbage strings (most won't match EMAIL_RE)
//   - near-miss emails that almost match the regex
const emailLikeArb = fc.oneof(
  fc.constant(''),
  fc.constant('   '),
  fc.constant('\t\n'),
  fc.string(), // arbitrary text
  fc.string({ minLength: 1, maxLength: 10 }).map((s) => `${s}@example.com`),
  fc.string({ minLength: 1, maxLength: 10 }).map((s) => `user@${s}`), // missing tld dot
  fc.string({ minLength: 1, maxLength: 10 }).map((s) => `${s}.com`), // missing @
  fc.constant('a@b.c'), // tld too short
  fc.constant('a@b.cd'), // valid
);

const passwordLikeArb = fc.oneof(
  fc.constant(''),
  fc.constant('       '),
  fc.string({ maxLength: 7 }), // mostly too short
  fc.string({ minLength: 8, maxLength: 32 }), // mostly long enough (after trim)
  fc.string(),
);

describe('validateLogin — Property 1: rejects invalid inputs and accepts valid ones', () => {
  test('matches the spec for arbitrary (email, password) pairs', () => {
    fc.assert(
      fc.property(emailLikeArb, passwordLikeArb, (email, password) => {
        const result = validateLogin({ email, password });

        const eErr = expectedEmailError(email);
        const pErr = expectedPasswordError(password);
        const shouldBeOk = eErr === undefined && pErr === undefined;

        expect(result.ok).toBe(shouldBeOk);

        if (eErr === undefined) {
          expect(result.errors.email).toBeUndefined();
        } else {
          expect(result.errors.email).toBe(eErr);
        }

        if (pErr === undefined) {
          expect(result.errors.password).toBeUndefined();
        } else {
          expect(result.errors.password).toBe(pErr);
        }
      }),
      { numRuns: 100 },
    );
  });

  // Dedicated arbitrary that yields strings guaranteed to satisfy EMAIL_RE,
  // so the ok:true branch is exercised at least once per run. We build each
  // segment from a safe alphabet (no whitespace, no '@', no '.') so the
  // assembled `local@domain.tld` always matches the regex.
  const safeChar = fc.constantFrom(
    ...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-+'.split(''),
  );
  const safeSegment = fc.array(safeChar, { minLength: 1, maxLength: 8 }).map((cs) => cs.join(''));
  const tldChar = fc.constantFrom(
    ...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  );
  const tldSegment = fc.array(tldChar, { minLength: 2, maxLength: 4 }).map((cs) => cs.join(''));

  const validEmailArb = fc
    .tuple(safeSegment, safeSegment, tldSegment)
    .map(([local, domain, tld]) => `${local}@${domain}.${tld}`)
    .filter((e) => EMAIL_RE.test(e));

  const validPasswordArb = fc
    .string({ minLength: 8, maxLength: 32 })
    .filter((s) => s.trim() !== '' && s.length >= 8);

  test('returns ok:true with empty errors for valid (email, password) pairs', () => {
    fc.assert(
      fc.property(validEmailArb, validPasswordArb, (email, password) => {
        const result = validateLogin({ email, password });
        expect(result.ok).toBe(true);
        expect(result.errors).toEqual({});
      }),
      { numRuns: 100 },
    );
  });
});
