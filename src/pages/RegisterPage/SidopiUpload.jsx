// SidopiUpload — Pilot-only SIDOPI document dropzone.
// See .kiro/specs/auth-pages/design.md "SidopiUpload" + Requirements
// 8.1, 8.3, 8.4, 8.5, 11.2, 11.3, 12.1, 12.2, 12.3.
//
// Behavior contract:
//   - Native <input type="file"> connected to a clickable <label> (label
//     covers the dropzone area for keyboard + click affordance).
//   - Drag/drop handled with HTML5 drag events on the dropzone wrapper.
//   - File chosen via either path is run through validateSidopiFile.
//     * Invalid → set local error banner ABOVE the dropzone, do NOT
//       dispatch SET_FILE; dropzone stays mounted and active so the
//       user can pick another file.
//     * Valid → dispatch SET_FILE with metadata + raw blob, clear local
//       error.
//   - When state.sidopiFile is set, replace the dropzone with a small
//     summary (name + formatted size) and a "Hapus" button that
//     dispatches CLEAR_FILE.
//   - Error banner uses role="alert" + aria-live="polite" so screen
//     readers announce rejection without being interruptive.

import { useRef, useState } from 'react';
import { validateSidopiFile } from '../../auth/validators.js';
import { ACTION_TYPES } from './registerReducer.js';

/**
 * Format byte count as a human-friendly KB / MB string.
 * Stays a small pure helper so it can be inlined; no need for a util file.
 */
function formatFileSize(bytes) {
  if (typeof bytes !== 'number' || !Number.isFinite(bytes) || bytes < 0) {
    return '';
  }
  const KB = 1024;
  const MB = KB * 1024;
  if (bytes >= MB) return `${(bytes / MB).toFixed(2)} MB`;
  if (bytes >= KB) return `${(bytes / KB).toFixed(1)} KB`;
  return `${bytes} B`;
}

export default function SidopiUpload({ state, dispatch }) {
  // Local rejection error — separate from reducer.stepErrors because the
  // file never enters state on rejection (Requirement 8.3 / 8.4).
  const [localError, setLocalError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  const file = state?.sidopiFile ?? null;

  function processFile(rawFile) {
    if (!rawFile) return;

    const result = validateSidopiFile(rawFile);
    if (!result.ok) {
      // Rejection: surface error, leave state.sidopiFile untouched.
      setLocalError(result.error || 'Format file harus PDF, JPG, atau PNG');
      // Reset the native input so picking the same bad file again still
      // fires onChange (browsers de-dup identical selections otherwise).
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    setLocalError(null);
    dispatch({
      type: ACTION_TYPES.SET_FILE,
      payload: {
        file: {
          name: rawFile.name,
          size: rawFile.size,
          type: rawFile.type,
          blob: rawFile,
        },
      },
    });
    if (inputRef.current) inputRef.current.value = '';
  }

  function handleInputChange(e) {
    const picked = e.target.files && e.target.files[0];
    processFile(picked);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver) setIsDragOver(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const dropped = e.dataTransfer?.files && e.dataTransfer.files[0];
    processFile(dropped);
  }

  function handleRemove() {
    setLocalError(null);
    if (inputRef.current) inputRef.current.value = '';
    dispatch({ type: ACTION_TYPES.CLEAR_FILE });
  }

  return (
    <div className="sidopi-upload">
      {localError && (
        <div
          className="sidopi-upload__error"
          role="alert"
          aria-live="polite"
        >
          {localError}
        </div>
      )}

      {file ? (
        <div className="sidopi-upload__file" data-testid="sidopi-file-info">
          <div className="sidopi-upload__file-meta">
            <span className="sidopi-upload__file-name">{file.name}</span>
            <span className="sidopi-upload__file-size">
              {formatFileSize(file.size)}
            </span>
          </div>
          <button
            type="button"
            className="sidopi-upload__remove"
            onClick={handleRemove}
          >
            Hapus
          </button>
        </div>
      ) : (
        <div
          className={
            'sidopi-upload__dropzone' +
            (isDragOver ? ' sidopi-upload__dropzone--active' : '')
          }
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Visually-hidden but still focusable: covered by the label. */}
          <input
            ref={inputRef}
            id="sidopi-file"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="sidopi-upload__input"
            onChange={handleInputChange}
          />
          <label htmlFor="sidopi-file" className="sidopi-upload__label">
            <span className="sidopi-upload__label-title">
              Tarik &amp; lepas dokumen SIDOPI di sini
            </span>
            <span className="sidopi-upload__label-hint">
              atau klik untuk memilih file (PDF, JPG, PNG — maks 5 MB)
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
