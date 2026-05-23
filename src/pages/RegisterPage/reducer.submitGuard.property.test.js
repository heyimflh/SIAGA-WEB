import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import {
 registerReducer,
 initialRegisterState,
 ACTION_TYPES,
} from './registerReducer.js';

const roleArb = fc.constantFrom('client', 'pilot', null);

const clientArb = fc.record({
 companyName: fc.string({ maxLength: 32 }),
 corporateEmail: fc.string({ maxLength: 32 }),
 phone: fc.string({ maxLength: 16 }),
 password: fc.string({ maxLength: 32 }),
 confirmPassword: fc.string({ maxLength: 32 }),
});

const pilotArb = fc.record({
 fullName: fc.string({ maxLength: 32 }),
 email: fc.string({ maxLength: 32 }),
 phone: fc.string({ maxLength: 16 }),
 password: fc.string({ maxLength: 32 }),
 confirmPassword: fc.string({ maxLength: 32 }),
});

const sidopiFileArb = fc.oneof(
 fc.constant(null),
 fc.record({
 name: fc.string({ minLength: 1, maxLength: 24 }),
 size: fc.integer({ min: 0, max: 10 * 1024 * 1024 }),
 type: fc.constantFrom('application/pdf', 'image/png', 'image/jpeg'),
 blob: fc.constant(null),
 }),
);

const stepErrorsArb = fc.dictionary(
 fc.string({ minLength: 1, maxLength: 12 }),
 fc.string({ maxLength: 32 }),
 { maxKeys: 4 },
);

const globalErrorArb = fc.oneof(fc.constant(null), fc.string({ maxLength: 48 }));

const stepArb = fc.constantFrom(1, 2, 3);

const submittingStateArb = fc
 .record({
 step: stepArb,
 role: roleArb,
 client: clientArb,
 pilot: pilotArb,
 sidopiFile: sidopiFileArb,
 termsAccepted: fc.boolean(),
 stepErrors: stepErrorsArb,
 globalError: globalErrorArb,
 isSubmitting: fc.constant(true),
 inFlight: fc.boolean(),
 });

describe('registerReducer — SUBMIT_START is idempotent while isSubmitting', () => {
 test('SUBMIT_START on a submitting state returns the same state unchanged', () => {
 fc.assert(
 fc.property(submittingStateArb, (state) => {

 const before = JSON.parse(JSON.stringify(state));

 const next = registerReducer(state, { type: ACTION_TYPES.SUBMIT_START });

 expect(next).toBe(state);

 expect(next.isSubmitting).toBe(true);

 expect(JSON.parse(JSON.stringify(next))).toEqual(before);
 }),
 { numRuns: 100 },
 );
 });

 test('sanity: from initialRegisterState, two consecutive SUBMIT_STARTs yield same state as one', () => {
 const once = registerReducer(initialRegisterState, {
 type: ACTION_TYPES.SUBMIT_START,
 });
 const twice = registerReducer(once, { type: ACTION_TYPES.SUBMIT_START });
 expect(twice).toBe(once);
 expect(twice.isSubmitting).toBe(true);
 });
});
