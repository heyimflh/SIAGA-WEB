import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { validateSidopiFile, ALLOWED_MIME, MAX_FILE_SIZE } from './validators.js';

const MSG = {
 fileFormat: 'Format file harus PDF, JPG, atau PNG',
 fileSize: 'Ukuran file maksimal 5 MB',
};

const fileLikeArb = fc.record({
 type: fc.oneof(
 fc.constantFrom(...ALLOWED_MIME),
 fc.string(),
 fc.constant(''),
 fc.constant('application/octet-stream'),
 fc.constant('image/gif'),
 ),
 size: fc.integer({ min: 0, max: 20 * 1024 * 1024 }),
});

describe('validateSidopiFile — accepts only allowed MIME and size', () => {
 test('matches the spec for arbitrary file-like objects', () => {
 fc.assert(
 fc.property(fileLikeArb, (file) => {
 const result = validateSidopiFile(file);

 const mimeOk = ALLOWED_MIME.includes(file.type);
 const sizeOk = file.size <= MAX_FILE_SIZE;

 if (!mimeOk) {
 expect(result).toEqual({ ok: false, error: MSG.fileFormat });
 return;
 }
 if (!sizeOk) {
 expect(result).toEqual({ ok: false, error: MSG.fileSize });
 return;
 }
 expect(result).toEqual({ ok: true });
 }),
 { numRuns: 100 },
 );
 });

 test('returns ok:true for any allowed MIME with size <= MAX_FILE_SIZE', () => {
 fc.assert(
 fc.property(
 fc.constantFrom(...ALLOWED_MIME),
 fc.integer({ min: 0, max: MAX_FILE_SIZE }),
 (type, size) => {
 expect(validateSidopiFile({ type, size })).toEqual({ ok: true });
 },
 ),
 { numRuns: 100 },
 );
 });

 test('null file returns ok:false', () => {
 expect(validateSidopiFile(null)).toEqual({ ok: false });
 expect(validateSidopiFile(undefined)).toEqual({ ok: false });
 });
});
