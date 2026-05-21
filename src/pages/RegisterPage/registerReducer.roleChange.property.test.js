// Feature: auth-pages, Changing role clears role-specific fields
//
// Validates: //
// Property statement:
// For ANY RegisterFormState s with s.role === r1 (r1 ∈ {'client','pilot'})
// carrying non-empty data in s[r1] and a non-null s.sidopiFile, dispatching
// SET_ROLE with payload.role = r2 where r2 !== r1 produces a state s' where:
// - s'.role === r2
// - s'.client deep-equals the empty client object
// - s'.pilot deep-equals the empty pilot object
// - s'.sidopiFile === null
//
// This guarantees a user who fills client data, then switches to pilot (or
// vice versa), cannot leak stale credentials/files into the new role bucket.

import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import {
 registerReducer,
 initialRegisterState,
 ACTION_TYPES,
} from './registerReducer.js';

// Empty bucket shapes match the reducer's internal factories (kept inline
// here so the test pins the contract rather than re-importing internals).
const EMPTY_CLIENT = {
 companyName: '',
 corporateEmail: '',
 phone: '',
 password: '',
 confirmPassword: '',
};

const EMPTY_PILOT = {
 fullName: '',
 email: '',
 phone: '',
 password: '',
 confirmPassword: '',
};

// Non-empty string arbitrary so every field carries data the reset must wipe.
const nonEmptyStr = fc
 .string({ minLength: 1, maxLength: 24 })
 .filter((s) => s.length > 0);

const filledClientArb = fc.record({
 companyName: nonEmptyStr,
 corporateEmail: nonEmptyStr,
 phone: nonEmptyStr,
 password: nonEmptyStr,
 confirmPassword: nonEmptyStr,
});

const filledPilotArb = fc.record({
 fullName: nonEmptyStr,
 email: nonEmptyStr,
 phone: nonEmptyStr,
 password: nonEmptyStr,
 confirmPassword: nonEmptyStr,
});

// Arbitrary "uploaded file" descriptor matching the design's file shape.
// blob is omitted (the reducer does not clone or inspect it) — name/size/type
// are sufficient to represent a populated sidopiFile.
const sidopiFileArb = fc.record({
 name: fc.string({ minLength: 1, maxLength: 32 }),
 size: fc.integer({ min: 1, max: 10 * 1024 * 1024 }),
 type: fc.constantFrom('application/pdf', 'image/png', 'image/jpeg'),
});

// Arbitrary surrounding state pieces that should not influence the reset.
const stepArb = fc.constantFrom(1, 2, 3);
const termsArb = fc.boolean();
const stepErrorsArb = fc.dictionary(
 fc.string({ minLength: 1, maxLength: 8 }),
 fc.string({ maxLength: 16 }),
 { maxKeys: 4 },
);
const globalErrorArb = fc.option(fc.string({ maxLength: 32 }), { nil: null });

// Build a state with role === r1 and filled-in data for both buckets +
// sidopiFile. We populate BOTH client and pilot to make the reset assertion
// strict: regardless of which bucket was the "active" one, both must end
// empty after a role change.
const stateForRoleArb = (r1) =>
 fc.record({
 step: stepArb,
 role: fc.constant(r1),
 client: filledClientArb,
 pilot: filledPilotArb,
 sidopiFile: sidopiFileArb,
 termsAccepted: termsArb,
 stepErrors: stepErrorsArb,
 globalError: globalErrorArb,
 isSubmitting: fc.constant(false),
 inFlight: fc.constant(false),
 });

// Combined arbitrary: pick an (r1, r2) pair where r1 !== r2 and a fully
// populated state whose role matches r1. Using a single chain keeps fast-check's
// shrinker effective on counterexamples.
const scenarioArb = fc
 .constantFrom(['client', 'pilot'], ['pilot', 'client'])
 .chain(([r1, r2]) =>
 stateForRoleArb(r1).map((state) => ({ r1, r2, state })),
 );

describe('registerReducer — SET_ROLE clears role-specific fields on role change', () => {
 test('changing role from r1 to r2 (r2 !== r1) resets client, pilot, and sidopiFile', () => {
 fc.assert(
 fc.property(scenarioArb, ({ r2, state }) => {
 const next = registerReducer(state, {
 type: ACTION_TYPES.SET_ROLE,
 payload: { role: r2 },
 });

 expect(next.role).toBe(r2);
 expect(next.client).toEqual(EMPTY_CLIENT);
 expect(next.pilot).toEqual(EMPTY_PILOT);
 expect(next.sidopiFile).toBeNull();
 }),
 { numRuns: 100 },
 );
 });

 // Sanity: starting from the canonical initialRegisterState (role = null),
 // setting a role does NOT need to clear anything — but the resulting buckets
 // must still equal the empty shapes the property pins.
 test('initialRegisterState + SET_ROLE yields empty buckets and null sidopiFile', () => {
 for (const role of ['client', 'pilot']) {
 const next = registerReducer(initialRegisterState, {
 type: ACTION_TYPES.SET_ROLE,
 payload: { role },
 });
 expect(next.role).toBe(role);
 expect(next.client).toEqual(EMPTY_CLIENT);
 expect(next.pilot).toEqual(EMPTY_PILOT);
 expect(next.sidopiFile).toBeNull();
 }
 });
});
