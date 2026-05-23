import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { validateStep2, EMAIL_RE, PHONE_RE } from './validators.js';

const FIELDS_BY_ROLE = {
 client: ['companyName', 'corporateEmail', 'phone', 'password', 'confirmPassword'],
 pilot: ['fullName', 'email', 'phone', 'password', 'confirmPassword'],
};

const EMAIL_FIELD_BY_ROLE = {
 client: 'corporateEmail',
 pilot: 'email',
};

const MSG_REQUIRED = 'Field ini wajib diisi';
const MSG_EMAIL_INVALID = 'Format email tidak valid';
const MSG_PASSWORD_SHORT = 'Password minimal 8 karakter';
const MSG_CONFIRM_MISMATCH = 'Konfirmasi password tidak cocok';
const MSG_PHONE_INVALID = 'Nomor telepon tidak valid';

function isEmpty(s) {
 return typeof s !== 'string' || s.trim() === '';
}

function countDigits(s) {
 return (String(s).match(/\d/g) || []).length;
}

const emptyOrWhitespace = fc.constantFrom('', ' ', ' ', '\t', '\n', ' \t ');

const requiredArb = fc.oneof(
 emptyOrWhitespace,
 fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim() !== ''),
);

const validEmailArb = fc
 .tuple(
 fc.stringMatching(/^[a-z0-9]{1,8}$/),
 fc.stringMatching(/^[a-z0-9]{1,8}$/),
 fc.stringMatching(/^[a-z]{2,4}$/),
 )
 .map(([u, d, t]) => `${u}@${d}.${t}`);

const malformedEmailArb = fc.oneof(
 fc.constant('plainstring'),
 fc.constant('no-at-sign.com'),
 fc.constant('@nouser.com'),
 fc.constant('user@nodot'),
 fc.constant('user@dot.x'),
 fc.constant('user @space.com'),
 fc.constant('user@@double.com'),
 fc.string({ minLength: 1, maxLength: 20 }).filter((s) => !EMAIL_RE.test(s)),
);

const emailArb = fc.oneof(emptyOrWhitespace, validEmailArb, malformedEmailArb);

const validPhoneArb = fc
 .tuple(
 fc.constantFrom('', '+', '+ '),
 fc.array(fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'), {
 minLength: 8,
 maxLength: 15,
 }),
 )
 .map(([prefix, digits]) => prefix + digits.join(''));

const tooFewDigitsArb = fc
 .array(fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'), {
 minLength: 0,
 maxLength: 7,
 })
 .map((digits) => digits.join(''));

const badCharsPhoneArb = fc
 .string({ minLength: 1, maxLength: 15 })
 .filter((s) => s.length > 0 && !PHONE_RE.test(s));

const phoneArb = fc.oneof(
 emptyOrWhitespace,
 validPhoneArb,
 tooFewDigitsArb,
 badCharsPhoneArb,
);

const shortPasswordArb = fc.string({ minLength: 1, maxLength: 7 }).filter((s) => s.length < 8);
const validPasswordArb = fc.string({ minLength: 8, maxLength: 30 }).filter((s) => s.length >= 8);
const passwordArb = fc.oneof(emptyOrWhitespace, shortPasswordArb, validPasswordArb);

function recordArbForRole(role) {
 const emailField = EMAIL_FIELD_BY_ROLE[role];
 const otherRequired = FIELDS_BY_ROLE[role].filter(
 (f) => f !== emailField && f !== 'phone' && f !== 'password' && f !== 'confirmPassword',
 );

 const shape = {
 [emailField]: emailArb,
 phone: phoneArb,
 password: passwordArb,
 confirmPassword: passwordArb,
 };
 for (const name of otherRequired) {
 shape[name] = requiredArb;
 }
 return fc.record(shape);
}

function expectedErrors(role, fields) {
 const list = FIELDS_BY_ROLE[role];
 const emailField = EMAIL_FIELD_BY_ROLE[role];
 const errs = {};

 for (const name of list) {
 const value = fields[name];

 if (isEmpty(value)) {
 errs[name] = MSG_REQUIRED;
 continue;
 }

 if (name === emailField) {
 if (!EMAIL_RE.test(value)) errs[name] = MSG_EMAIL_INVALID;
 continue;
 }

 if (name === 'phone') {
 if (!PHONE_RE.test(value) || countDigits(value) < 8) {
 errs[name] = MSG_PHONE_INVALID;
 }
 continue;
 }

 if (name === 'password') {
 if (value.length < 8) errs[name] = MSG_PASSWORD_SHORT;
 continue;
 }

 if (name === 'confirmPassword') {
 if (value !== fields.password) errs[name] = MSG_CONFIRM_MISMATCH;
 continue;
 }
 }

 return errs;
}

describe('Step 2 validation enforces all field rules per role', () => {
 it('client: errors map matches expected per-field rules (both directions)', () => {
 fc.assert(
 fc.property(recordArbForRole('client'), (fields) => {
 const result = validateStep2('client', fields);
 const expected = expectedErrors('client', fields);

 expect(result.errors).toEqual(expected);
 expect(result.ok).toBe(Object.keys(expected).length === 0);
 }),
 { numRuns: 100 },
 );
 });

 it('pilot: errors map matches expected per-field rules (both directions)', () => {
 fc.assert(
 fc.property(recordArbForRole('pilot'), (fields) => {
 const result = validateStep2('pilot', fields);
 const expected = expectedErrors('pilot', fields);

 expect(result.errors).toEqual(expected);
 expect(result.ok).toBe(Object.keys(expected).length === 0);
 }),
 { numRuns: 100 },
 );
 });
});
