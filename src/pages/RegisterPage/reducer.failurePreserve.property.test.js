import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import {
 registerReducer,
 initialRegisterState,
 ACTION_TYPES,
} from './registerReducer.js';

const anyStrArb = fc.string({ maxLength: 24 });

const clientArb = fc.record({
 companyName: anyStrArb,
 corporateEmail: anyStrArb,
 phone: anyStrArb,
 password: anyStrArb,
 confirmPassword: anyStrArb,
});

const pilotArb = fc.record({
 fullName: anyStrArb,
 email: anyStrArb,
 phone: anyStrArb,
 password: anyStrArb,
 confirmPassword: anyStrArb,
});

const fileObjectArb = fc.record({
 name: fc.string({ minLength: 1, maxLength: 32 }),
 size: fc.integer({ min: 1, max: 10 * 1024 * 1024 }),
 type: fc.constantFrom('application/pdf', 'image/png', 'image/jpeg'),
});

const sidopiFileArb = fc.oneof(fc.constant(null), fileObjectArb);

const step3StateArb = fc.record({
 step: fc.constant(3),
 role: fc.constantFrom('client', 'pilot'),
 client: clientArb,
 pilot: pilotArb,
 sidopiFile: sidopiFileArb,
 termsAccepted: fc.boolean(),
 stepErrors: fc.dictionary(
 fc.string({ minLength: 1, maxLength: 8 }),
 fc.string({ maxLength: 16 }),
 { maxKeys: 4 },
 ),
 globalError: fc.option(fc.string({ maxLength: 32 }), { nil: null }),
 isSubmitting: fc.constant(false),
 inFlight: fc.constant(false),
});

const submitFailureActionArb = fc.oneof(
 fc.record({ type: fc.constant(ACTION_TYPES.SUBMIT_FAILURE) }),
 fc.record({
 type: fc.constant(ACTION_TYPES.SUBMIT_FAILURE),
 payload: fc.record({ globalError: fc.string({ maxLength: 48 }) }),
 }),
);

describe('registerReducer — failed submit preserves Register form state', () => {
 test('SUBMIT_START then SUBMIT_FAILURE preserves role, client, pilot, sidopiFile, termsAccepted; isSubmitting reset to false', () => {
 fc.assert(
 fc.property(step3StateArb, submitFailureActionArb, (s, failureAction) => {
 const afterStart = registerReducer(s, {
 type: ACTION_TYPES.SUBMIT_START,
 });

 expect(afterStart.isSubmitting).toBe(true);

 const sPrime = registerReducer(afterStart, failureAction);

 expect(sPrime.role).toBe(s.role);
 expect(sPrime.client).toEqual(s.client);
 expect(sPrime.pilot).toEqual(s.pilot);
 expect(sPrime.sidopiFile).toBe(s.sidopiFile);
 expect(sPrime.termsAccepted).toBe(s.termsAccepted);
 expect(sPrime.isSubmitting).toBe(false);
 }),
 { numRuns: 100 },
 );
 });

 test('pilot at step 3 with file: failed submit retains all data and resets isSubmitting', () => {
 const file = { name: 'sidopi.pdf', size: 50_000, type: 'application/pdf' };
 const seeded = {
 ...initialRegisterState,
 step: 3,
 role: 'pilot',
 pilot: {
 fullName: 'Budi Pilot',
 email: 'budi@pilot.id',
 phone: '081234567890',
 password: 'P@ssw0rd123',
 confirmPassword: 'P@ssw0rd123',
 },
 sidopiFile: file,
 termsAccepted: true,
 };

 const started = registerReducer(seeded, { type: ACTION_TYPES.SUBMIT_START });
 expect(started.isSubmitting).toBe(true);

 const failed = registerReducer(started, {
 type: ACTION_TYPES.SUBMIT_FAILURE,
 });

 expect(failed.role).toBe('pilot');
 expect(failed.pilot).toEqual(seeded.pilot);
 expect(failed.client).toEqual(seeded.client);
 expect(failed.sidopiFile).toBe(file);
 expect(failed.termsAccepted).toBe(true);
 expect(failed.isSubmitting).toBe(false);
 expect(failed.step).toBe(3);
 });
});
