import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { validateLogin, EMAIL_RE } from './validators.js';

const MSG = {
 emailRequired: 'Email wajib diisi',
 emailInvalid: 'Format email tidak valid',
 passwordRequired: 'Password wajib diisi',
 passwordTooShort: 'Password minimal 8 karakter',
};

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

const emailLikeArb = fc.oneof(
 fc.constant(''),
 fc.constant(' '),
 fc.constant('\t\n'),
 fc.string(),
 fc.string({ minLength: 1, maxLength: 10 }).map((s) => `${s}@example.com`),
 fc.string({ minLength: 1, maxLength: 10 }).map((s) => `user@${s}`),
 fc.string({ minLength: 1, maxLength: 10 }).map((s) => `${s}.com`),
 fc.constant('a@b.c'),
 fc.constant('a@b.cd'),
);

const passwordLikeArb = fc.oneof(
 fc.constant(''),
 fc.constant(' '),
 fc.string({ maxLength: 7 }),
 fc.string({ minLength: 8, maxLength: 32 }),
 fc.string(),
);

describe('validateLogin — rejects invalid inputs and accepts valid ones', () => {
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
