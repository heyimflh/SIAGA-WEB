// Feature: auth-pages, Register submit gating depends on terms + role-specific verification
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { isSubmitEnabled, validateSidopiFile } from './validators.js';

const ALLOWED_MIMES = ['application/pdf', 'image/jpeg', 'image/png'];
const INVALID_MIMES = ['text/plain', 'image/gif', 'application/zip', '', 'video/mp4'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Generator for file-like objects covering valid + invalid MIME and size cases.
const fileLikeArb = fc.oneof(
 // Valid: allowed MIME + size <= 5MB
 fc.record({
 type: fc.constantFrom(...ALLOWED_MIMES),
 size: fc.integer({ min: 0, max: MAX_FILE_SIZE }),
 }),
 // Invalid MIME, any size
 fc.record({
 type: fc.constantFrom(...INVALID_MIMES),
 size: fc.integer({ min: 0, max: MAX_FILE_SIZE * 2 }),
 }),
 // Allowed MIME but oversize
 fc.record({
 type: fc.constantFrom(...ALLOWED_MIMES),
 size: fc.integer({ min: MAX_FILE_SIZE + 1, max: MAX_FILE_SIZE * 4 }),
 }),
);

const sidopiFileArb = fc.oneof(fc.constant(null), fileLikeArb);

const registerStateArb = fc.record({
 role: fc.constantFrom('client', 'pilot', null),
 termsAccepted: fc.boolean(),
 sidopiFile: sidopiFileArb,
});

describe('Register submit gating', () => {
 it('isSubmitEnabled(s) === (termsAccepted AND (role==="client" OR (role==="pilot" AND validateSidopiFile(sidopiFile).ok)))', () => {
 fc.assert(
 fc.property(registerStateArb, (s) => {
 const expected =
 s.termsAccepted === true &&
 (s.role === 'client' ||
 (s.role === 'pilot' && validateSidopiFile(s.sidopiFile).ok === true));

 const actual = isSubmitEnabled(s);
 expect(actual).toBe(expected);
 }),
 { numRuns: 100 },
 );
 });

 it('forward direction: when expected is true, isSubmitEnabled returns true', () => {
 fc.assert(
 fc.property(registerStateArb, (s) => {
 const expected =
 s.termsAccepted === true &&
 (s.role === 'client' ||
 (s.role === 'pilot' && validateSidopiFile(s.sidopiFile).ok === true));
 if (expected) {
 expect(isSubmitEnabled(s)).toBe(true);
 }
 }),
 { numRuns: 100 },
 );
 });

 it('reverse direction: when expected is false, isSubmitEnabled returns false', () => {
 fc.assert(
 fc.property(registerStateArb, (s) => {
 const expected =
 s.termsAccepted === true &&
 (s.role === 'client' ||
 (s.role === 'pilot' && validateSidopiFile(s.sidopiFile).ok === true));
 if (!expected) {
 expect(isSubmitEnabled(s)).toBe(false);
 }
 }),
 { numRuns: 100 },
 );
 });
});
