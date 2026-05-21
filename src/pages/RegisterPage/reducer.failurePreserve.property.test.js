// Feature: auth-pages, Failed submit preserves Register form state
//
// Validates: //
// Property statement:
// For ANY Register_Form_State `s` at step 3 with a non-null role
// (`client` or `pilot`) and `isSubmitting === false`, applying the
// sequence [SUBMIT_START, SUBMIT_FAILURE] yields a state `s'` where:
// - s'.role === s.role
// - s'.client deep-equals s.client
// - s'.pilot deep-equals s.pilot
// - s'.sidopiFile === s.sidopiFile (same reference)
// - s'.termsAccepted === s.termsAccepted
// - s'.isSubmitting === false
//
// Rationale: mandates that when a mock Register submit fails
// the user's progress on Step 3 is never lost. The reducer is the single
// source of truth for this guarantee, so the property is exercised purely at
// the reducer layer with no rendering involved.
//
// Generator notes:
// - State is pinned to step 3 because the property is scoped to Step 3 submit.
// - role is constrained to {'client','pilot'} (the only roles a step-3 state
// can legally carry).
// - isSubmitting is pinned to false; a true value would make SUBMIT_START a
// no-op , preventing this test from exercising the failure
// path.
// - inFlight is pinned to false for the same reason — SUBMIT_START will set
// it; we want a clean entry into the action sequence.
// - sidopiFile is allowed to be either null (typical for client) or a file
// object (typical for pilot). Reference identity is asserted with toBe,
// which trivially holds for the null case and is meaningful for objects.

import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import {
 registerReducer,
 initialRegisterState,
 ACTION_TYPES,
} from './registerReducer.js';

// --------------------------------------------------------------------------
// Field arbitraries
// --------------------------------------------------------------------------
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

// Mix of null and concrete file references so the reference-equality assertion
// covers both shapes.
const sidopiFileArb = fc.oneof(fc.constant(null), fileObjectArb);

// Step-3, non-submitting RegisterFormState with varied role/field/file/terms.
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

// Optional payload for SUBMIT_FAILURE — sometimes provided, sometimes omitted
// so both default and explicit globalError branches are exercised.
const submitFailureActionArb = fc.oneof(
 fc.record({ type: fc.constant(ACTION_TYPES.SUBMIT_FAILURE) }),
 fc.record({
 type: fc.constant(ACTION_TYPES.SUBMIT_FAILURE),
 payload: fc.record({ globalError: fc.string({ maxLength: 48 }) }),
 }),
);

// --------------------------------------------------------------------------
// Property
// --------------------------------------------------------------------------
describe('registerReducer — failed submit preserves Register form state', () => {
 test('SUBMIT_START then SUBMIT_FAILURE preserves role, client, pilot, sidopiFile, termsAccepted; isSubmitting reset to false', () => {
 fc.assert(
 fc.property(step3StateArb, submitFailureActionArb, (s, failureAction) => {
 const afterStart = registerReducer(s, {
 type: ACTION_TYPES.SUBMIT_START,
 });

 // Sanity: SUBMIT_START must actually engage (precondition guarded by
 // generator: isSubmitting=false).
 expect(afterStart.isSubmitting).toBe(true);

 const sPrime = registerReducer(afterStart, failureAction);

 // invariants
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

 // Concrete sanity scenario for a pilot at step 3 with a real file.
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
