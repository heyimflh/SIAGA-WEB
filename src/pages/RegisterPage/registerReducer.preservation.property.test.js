import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import {
 registerReducer,
 initialRegisterState,
 ACTION_TYPES,
} from './registerReducer.js';

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

const sidopiFileArb = fc.record({
 name: fc.string({ minLength: 1, maxLength: 32 }),
 size: fc.integer({ min: 1, max: 10 * 1024 * 1024 }),
 type: fc.constantFrom('application/pdf', 'image/png', 'image/jpeg'),
});

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

describe('registerReducer — navigation preserves prior step data', () => {
 test('GO_TO_STEP / BACK (and other non-bucket actions) preserve client, pilot, sidopiFile at every step', () => {
 fc.assert(
 fc.property(startStateArb, actionSequenceArb, (start, actions) => {
 const originalClient = start.client;
 const originalPilot = start.pilot;
 const originalFile = start.sidopiFile;

 let state = start;
 for (const action of actions) {
 state = registerReducer(state, action);

 expect(state.client).toEqual(originalClient);
 expect(state.pilot).toEqual(originalPilot);
 expect(state.sidopiFile).toBe(originalFile);
 }
 }),
 { numRuns: 100 },
 );
 });

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
