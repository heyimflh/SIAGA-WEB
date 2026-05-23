import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import {
 registerReducer,
 initialRegisterState,
 ACTION_TYPES,
} from './registerReducer.js';

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

const sidopiFileArb = fc.record({
 name: fc.string({ minLength: 1, maxLength: 32 }),
 size: fc.integer({ min: 1, max: 10 * 1024 * 1024 }),
 type: fc.constantFrom('application/pdf', 'image/png', 'image/jpeg'),
});

const stepArb = fc.constantFrom(1, 2, 3);
const termsArb = fc.boolean();
const stepErrorsArb = fc.dictionary(
 fc.string({ minLength: 1, maxLength: 8 }),
 fc.string({ maxLength: 16 }),
 { maxKeys: 4 },
);
const globalErrorArb = fc.option(fc.string({ maxLength: 32 }), { nil: null });

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
