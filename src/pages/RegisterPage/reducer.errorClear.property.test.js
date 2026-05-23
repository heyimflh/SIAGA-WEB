import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { registerReducer, ACTION_TYPES } from './registerReducer.js';

const CLIENT_FIELDS = [
 'companyName',
 'corporateEmail',
 'phone',
 'password',
 'confirmPassword',
];

const PILOT_FIELDS = [
 'fullName',
 'email',
 'phone',
 'password',
 'confirmPassword',
];

const emptyClient = () => ({
 companyName: '',
 corporateEmail: '',
 phone: '',
 password: '',
 confirmPassword: '',
});

const emptyPilot = () => ({
 fullName: '',
 email: '',
 phone: '',
 password: '',
 confirmPassword: '',
});

const valueArb = fc.oneof(
 fc.string({ maxLength: 24 }),
 fc.integer(),
 fc.boolean(),
);

const errorMsgArb = fc.string({ minLength: 1, maxLength: 32 });

const otherErrorsArb = fc.dictionary(
 fc.string({ minLength: 1, maxLength: 8 }).filter(
 (k) => !CLIENT_FIELDS.includes(k) && !PILOT_FIELDS.includes(k),
 ),
 fc.string({ maxLength: 16 }),
 { maxKeys: 4 },
);

const scenarioArb = fc.oneof(
 fc.record({
 role: fc.constant('client'),
 field: fc.constantFrom(...CLIENT_FIELDS),
 value: valueArb,
 errorMsg: errorMsgArb,
 otherErrors: otherErrorsArb,
 }),
 fc.record({
 role: fc.constant('pilot'),
 field: fc.constantFrom(...PILOT_FIELDS),
 value: valueArb,
 errorMsg: errorMsgArb,
 otherErrors: otherErrorsArb,
 }),
);

describe('registerReducer — Error clears on field re-edit', () => {
 test('SET_FIELD clears stepErrors[field] regardless of value validity', () => {
 fc.assert(
 fc.property(scenarioArb, ({ role, field, value, errorMsg, otherErrors }) => {

 const state = {
 step: 2,
 role,
 client: emptyClient(),
 pilot: emptyPilot(),
 sidopiFile: null,
 termsAccepted: false,
 stepErrors: { ...otherErrors, [field]: errorMsg },
 globalError: null,
 isSubmitting: false,
 inFlight: false,
 };

 const next = registerReducer(state, {
 type: ACTION_TYPES.SET_FIELD,
 payload: { role, field, value },
 });

 expect(next.stepErrors[field]).toBeUndefined();
 expect(field in next.stepErrors).toBe(false);

 for (const key of Object.keys(otherErrors)) {
 expect(next.stepErrors[key]).toBe(otherErrors[key]);
 }

 expect(next[role][field]).toBe(value);
 }),
 { numRuns: 100 },
 );
 });
});
