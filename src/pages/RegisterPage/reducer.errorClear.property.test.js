// Feature: auth-pages, Property 11: Error clears on field re-edit
//
// Validates: Requirement 5.6
//
// Property statement:
//   For ANY RegisterFormState s with stepErrors map containing
//   `{ [field]: someError }` for some field that exists in state[role],
//   dispatching SET_FIELD with payload `{ role, field, value }` results in
//   the next state's stepErrors[field] === undefined, regardless of whether
//   the new `value` itself is valid.
//
// Rationale: when a user starts editing a field that previously surfaced
// a validation error, the inline message must disappear immediately so the
// UI feels responsive (Requirement 5.6). Re-validation only happens on the
// next blur/submit — typing alone always clears the stale error.

import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { registerReducer, ACTION_TYPES } from './registerReducer.js';

// --------------------------------------------------------------------------
// Field name arbitraries — restrict to keys that actually exist in the
// corresponding role bucket. SET_FIELD is a no-op for unknown fields, so
// the cleared-error invariant only applies to valid field names.
// --------------------------------------------------------------------------
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

// Empty bucket factories matching the reducer's internal shapes.
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

// Any value type — strings, numbers, booleans — to confirm the clear-on-edit
// invariant holds even when the new value would itself fail validation.
const valueArb = fc.oneof(
  fc.string({ maxLength: 24 }),
  fc.integer(),
  fc.boolean(),
);

// Arbitrary error message string for the targeted field.
const errorMsgArb = fc.string({ minLength: 1, maxLength: 32 });

// Other unrelated stepErrors keys, drawn from a name space that excludes the
// targeted field so we can assert *only* the targeted key is dropped.
const otherErrorsArb = fc.dictionary(
  fc.string({ minLength: 1, maxLength: 8 }).filter(
    (k) => !CLIENT_FIELDS.includes(k) && !PILOT_FIELDS.includes(k),
  ),
  fc.string({ maxLength: 16 }),
  { maxKeys: 4 },
);

// Composite: pick a role + a valid field for that role + arbitrary value +
// arbitrary error message + arbitrary unrelated stepErrors entries.
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

describe('registerReducer — Property 11: Error clears on field re-edit', () => {
  test('SET_FIELD clears stepErrors[field] regardless of value validity', () => {
    fc.assert(
      fc.property(scenarioArb, ({ role, field, value, errorMsg, otherErrors }) => {
        // Build a minimal RegisterFormState with the targeted field's error
        // set, plus optional unrelated error keys to verify selective clearing.
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

        // Core invariant (Property 11): the targeted field's error is gone.
        expect(next.stepErrors[field]).toBeUndefined();
        expect(field in next.stepErrors).toBe(false);

        // Unrelated error keys must be preserved untouched.
        for (const key of Object.keys(otherErrors)) {
          expect(next.stepErrors[key]).toBe(otherErrors[key]);
        }

        // Sanity: the new value landed in the role bucket.
        expect(next[role][field]).toBe(value);
      }),
      { numRuns: 100 },
    );
  });
});
