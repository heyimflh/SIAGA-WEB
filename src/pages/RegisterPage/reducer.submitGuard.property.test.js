// Feature: auth-pages, Submit guard prevents double-trigger
//
// Validates: //
// Property statement:
// For ANY state where `isSubmitting === true`, dispatching another
// `SUBMIT_START` action returns a state that is observationally identical
// to the input state. Specifically:
// - the returned state's `isSubmitting` is still true
// - the returned state is deep-equal to the input state
// The reducer is also expected to return the SAME reference (===) in this
// guard branch, since the design contract for SUBMIT_START says "if already
// submitting, return state unchanged."

import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import {
 registerReducer,
 initialRegisterState,
 ACTION_TYPES,
} from './registerReducer.js';

// ---------------------------------------------------------------------------
// Generators for arbitrary RegisterFormState values where isSubmitting=true.
// We vary every other field so the property is exercised across the space.
// ---------------------------------------------------------------------------

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

// State arbitrary that ALWAYS has isSubmitting=true (the precondition of
// the property). `inFlight` is also varied independently because the
// SUBMIT_START guard is keyed on `isSubmitting`, not `inFlight`.
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
 // Snapshot a deep clone of the input so we can detect any mutation
 // of the returned reference.
 const before = JSON.parse(JSON.stringify(state));

 const next = registerReducer(state, { type: ACTION_TYPES.SUBMIT_START });

 // The guard branch must return the SAME reference.
 expect(next).toBe(state);
 // isSubmitting must remain true.
 expect(next.isSubmitting).toBe(true);
 // Deep equality with the original snapshot — nothing observable changed.
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
