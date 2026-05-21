/**
 * Property test for file validation.
 * Feature: pilot-dashboard
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { isValidExtension, isValidFileSize, validateFile } from '../utils/fileValidation.js';

const VALID_EXTS = ['.dng', '.arw', '.mp4', '.mov', '.tif', '.las'];
const MAX_SIZE = 500 * 1024 * 1024;

describe('isValidExtension', () => {
 it('returns true only for valid extensions', () => {
 fc.assert(
 fc.property(fc.constantFrom(...VALID_EXTS), (ext) => {
 expect(isValidExtension(`file${ext}`)).toBe(true);
 })
 );
 });

 it('returns false for invalid extensions', () => {
 fc.assert(
 fc.property(fc.constantFrom('.exe', '.pdf', '.doc', '.zip', '.jpg', '.png'), (ext) => {
 expect(isValidExtension(`file${ext}`)).toBe(false);
 })
 );
 });

 it('returns false for non-string input', () => {
 expect(isValidExtension(null)).toBe(false);
 expect(isValidExtension('')).toBe(false);
 expect(isValidExtension(123)).toBe(false);
 });
});

describe('isValidFileSize', () => {
 it('returns true for sizes 0 to 500MB', () => {
 fc.assert(
 fc.property(fc.nat(MAX_SIZE), (size) => {
 expect(isValidFileSize(size)).toBe(true);
 })
 );
 });

 it('returns false for sizes > 500MB', () => {
 fc.assert(
 fc.property(fc.integer({ min: MAX_SIZE + 1, max: MAX_SIZE * 2 }), (size) => {
 expect(isValidFileSize(size)).toBe(false);
 })
 );
 });

 it('returns false for negative sizes', () => {
 expect(isValidFileSize(-1)).toBe(false);
 });
});

describe('validateFile', () => {
 it('returns valid for correct file', () => {
 const result = validateFile({ name: 'test.mp4', size: 1000 });
 expect(result.valid).toBe(true);
 expect(result.error).toBeNull();
 });

 it('returns error for invalid extension', () => {
 const result = validateFile({ name: 'test.exe', size: 1000 });
 expect(result.valid).toBe(false);
 expect(result.error).toBe('Format file tidak didukung');
 });

 it('returns error for oversized file', () => {
 const result = validateFile({ name: 'test.mp4', size: MAX_SIZE + 1 });
 expect(result.valid).toBe(false);
 expect(result.error).toBe('Ukuran file melebihi 500MB');
 });
});
