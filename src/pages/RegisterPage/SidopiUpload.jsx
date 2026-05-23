import { useRef, useState } from 'react';
import { validateSidopiFile } from '../../auth/validators.js';
import { ACTION_TYPES } from './registerReducer.js';

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

 const [localError, setLocalError] = useState(null);
 const [isDragOver, setIsDragOver] = useState(false);
 const inputRef = useRef(null);

 const file = state?.sidopiFile ?? null;

 function processFile(rawFile) {
 if (!rawFile) return;

 const result = validateSidopiFile(rawFile);
 if (!result.ok) {

 setLocalError(result.error || 'Format file harus PDF, JPG, atau PNG');

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
