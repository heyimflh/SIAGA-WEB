// Feature: auth-pages, Property 3: SIDOPI file validation accepts only allowed MIME and size
//
// Validates: Requirements 8.3, 8.4, 11.2, 11.3
//
// Property statement:
//   For ANY file-like object { type, size }, validateSidopiFile(file) returns
//     { ok: true } iff (type ∈ ALLOWED_MIME) AND (size <= MAX_FILE_SIZE).
//   Otherwise:
//     - type ∉ ALLOWED_MIME            -> { ok: false, error: "Format file harus PDF, JPG, atau PNG" }
//     - type ∈ ALLOWED_MIME, oversized -> { ok: false, error: "Ukuran file maksimal 5 MB" }
//   Plus: null file -> { ok: false } (no error message, gates UI without stale copy).

import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { validateSidopiFile, ALLOWED_MIME, MAX_FILE_SIZE } from './validators.js';

const MSG = {
  fileFormat: 'Format file harus PDF, JPG, atau PNG',
  fileSize: 'Ukuran file maksimal 5 MB',
};

// File-like generator that mixes allowed MIME types with arbitrary strings,
// and sizes that span both sides of MAX_FILE_SIZE so each branch gets
// exercised across runs.
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

describe('validateSidopiFile — Property 3: accepts only allowed MIME and size', () => {
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
