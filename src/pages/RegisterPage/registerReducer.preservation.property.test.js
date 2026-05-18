// Feature: auth-pages, Property 5: Reducer preserves prior step data on BACK and forward navigation
//
// Validates: Requirements 7.9, 8.9, 9.1, 9.3
//
// Property statement:
//   For ANY Register_Form_State `s` with a non-null role and pre-filled
//   client/pilot/sidopiFile data, applying any sequence of pure navigation
//   actions (GO_TO_STEP, BACK) interleaved with safe, non-mutating actions
//   (TOGGLE_TERMS, SET_ERRORS, CLEAR_ERROR) leaves the three "data buckets"
//   untouched at every intermediate state:
//     - state.client     deep-equals s.client       at every step
//     - state.pilot      deep-equals s.pilot        at every step
//     - state.sidopiFile === s.sidopiFile           at every step (reference)
//
// Rationale: Requirement 9.1 mandates that navigating between steps does not
// drop user input; Requirements 7.9 and 8.9 specify the BACK button on Step 2
// and Step 3 must preserve previously entered Step 2 data; Requirement 9.3
// extends this to re-renders. The reducer is the single source of truth for
// this guarantee, so the property is exercised purely at the reducer layer.
//
// Excluded actions (would legitimately mutate the buckets and so are out of
// scope for this property):
//   - SET_ROLE (different role)  → Property 6 territory
//   - SET_FIELD                  → writes into client/pilot
//   - SET_FILE / CLEAR_FILE      → writes into sidopiFile
//   - SUBMIT_START / SUBMIT_*    → covered by Properties 9 & 10; SUBMIT_START
//                                  also flips inFlight which would block
//                                  navigation actions for the rest of the
//                                  sequence and dilute the property under
//                                  test.

import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import {
  registerReducer,
  initialRegisterState,
  ACTION_TYPES,
} from './registerReducer.js';

// --------------------------------------------------------------------------
// Field arbitraries — non-empty strings so we can clearly detect any
// accidental "reset to empty bucket" regression.
// --------------------------------------------------------------------------
const filledStrArb = fc.string({ minLength: 1, maxLength: 24 });

const filledClientArb = fc.record({
  companyName: filledStrArb,
  corporateEmail: filledStrArb,
  phone: filledStrArb,
  password: filledStrArb,
  confirmPassword: filledStrArb,
});

const filledPilotArb = fc.record({
  fullName: filledStrArb,
  email: filledStrArb,
  phone: filledStrArb,
  password: filledStrArb,
  confirmPassword: filledStrArb,
});

// Non-null SIDOPI file descriptor — we pin to non-null so that reference
// equality (toBe) is a meaningful check; null === null trivially.
const sidopiFileArb = fc.record({
  name: fc.string({ minLength: 1, maxLength: 32 }),
  size: fc.integer({ min: 1, max: 10 * 1024 * 1024 }),
  type: fc.constantFrom('application/pdf', 'image/png', 'image/jpeg'),
});

// Starting state: role is set, all buckets pre-filled, sidopiFile non-null,
// inFlight=false (so navigation actions actually run), isSubmitting=false.
// `step` is allowed to vary across the valid range so BACK from any step is
// exercised. stepErrors / globalError / termsAccepted are free.
const startStateArb = fc.record({
  step: fc.constantFrom(1, 2, 3),
  role: fc.constantFrom('client', 'pilot'),
  client: filledClientArb,
  pilot: filledPilotArb,
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

// --------------------------------------------------------------------------
// Action arbitraries — only navigation + non-bucket-mutating actions.
// --------------------------------------------------------------------------
const goToStepArb = fc.record({
  type: fc.constant(ACTION_TYPES.GO_TO_STEP),
  payload: fc.record({ step: fc.constantFrom(1, 2, 3) }),
});

const backArb = fc.record({ type: fc.constant(ACTION_TYPES.BACK) });

const toggleTermsArb = fc.record({ type: fc.constant(ACTION_TYPES.TOGGLE_TERMS) });

const setErrorsArb = fc.record({
  type: fc.constant(ACTION_TYPES.SET_ERRORS),
  payload: fc.record(
    {
      stepErrors: fc.dictionary(
        fc.string({ minLength: 1, maxLength: 8 }),
        fc.string({ maxLength: 16 }),
        { maxKeys: 3 },
      ),
      globalError: fc.option(fc.string({ maxLength: 32 }), { nil: null }),
    },
    { requiredKeys: [] },
  ),
});

const clearErrorArb = fc.record({
  type: fc.constant(ACTION_TYPES.CLEAR_ERROR),
  payload: fc.option(
    fc.record({ field: fc.string({ minLength: 1, maxLength: 8 }) }),
    { nil: undefined },
  ),
});

const safeActionArb = fc.oneof(
  goToStepArb,
  backArb,
  toggleTermsArb,
  setErrorsArb,
  clearErrorArb,
);

const actionSequenceArb = fc.array(safeActionArb, { maxLength: 20 });

// --------------------------------------------------------------------------
// Property
// --------------------------------------------------------------------------
describe('registerReducer — Property 5: navigation preserves prior step data', () => {
  test('GO_TO_STEP / BACK (and other non-bucket actions) preserve client, pilot, sidopiFile at every step', () => {
    fc.assert(
      fc.property(startStateArb, actionSequenceArb, (start, actions) => {
        const originalClient = start.client;
        const originalPilot = start.pilot;
        const originalFile = start.sidopiFile;

        let state = start;
        for (const action of actions) {
          state = registerReducer(state, action);

          // Property 5 invariants: bucket data is byte-for-byte identical and
          // the file reference is the very same object the caller supplied.
          expect(state.client).toEqual(originalClient);
          expect(state.pilot).toEqual(originalPilot);
          expect(state.sidopiFile).toBe(originalFile);
        }
      }),
      { numRuns: 100 },
    );
  });

  // Concrete sanity scenario: client fills Step 2, advances to Step 3, hits
  // BACK, then advances again. Step 2 data must be intact every time.
  test('client round-trip Step 1 → 2 → 3 → BACK → 3 preserves client bucket', () => {
    const seeded = {
      ...initialRegisterState,
      role: 'client',
      client: {
        companyName: 'Acme Corp',
        corporateEmail: 'ops@acme.co.id',
        phone: '081234567890',
        password: 'P@ssw0rd123',
        confirmPassword: 'P@ssw0rd123',
      },
      sidopiFile: { name: 'sidopi.pdf', size: 12345, type: 'application/pdf' },
    };

    const s2 = registerReducer(seeded, {
      type: ACTION_TYPES.GO_TO_STEP,
      payload: { step: 2 },
    });
    expect(s2.client).toEqual(seeded.client);
    expect(s2.sidopiFile).toBe(seeded.sidopiFile);

    const s3 = registerReducer(s2, {
      type: ACTION_TYPES.GO_TO_STEP,
      payload: { step: 3 },
    });
    expect(s3.client).toEqual(seeded.client);
    expect(s3.sidopiFile).toBe(seeded.sidopiFile);

    const back = registerReducer(s3, { type: ACTION_TYPES.BACK });
    expect(back.step).toBe(2);
    expect(back.client).toEqual(seeded.client);
    expect(back.sidopiFile).toBe(seeded.sidopiFile);

    const forward = registerReducer(back, {
      type: ACTION_TYPES.GO_TO_STEP,
      payload: { step: 3 },
    });
    expect(forward.step).toBe(3);
    expect(forward.client).toEqual(seeded.client);
    expect(forward.sidopiFile).toBe(seeded.sidopiFile);
  });
});
