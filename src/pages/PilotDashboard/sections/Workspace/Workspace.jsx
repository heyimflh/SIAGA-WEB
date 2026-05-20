/**
 * Workspace — Inspection Data Upload Bay section.
 * Feature: pilot-dashboard
 * Validates: Requirements 10
 */

import { useState, useRef, useCallback } from 'react';
import { Upload, Trash2, RefreshCw, HardDrive } from 'lucide-react';
import { validateFile } from '../../utils/fileValidation';
import './Workspace.css';

const FILE_CHIPS = ['RAW Photo', 'Video 4K', 'Orthomosaic', 'Point Cloud', 'Thermal Data'];

function FileEntry({ file, onDelete }) {
  const sizeFormatted = (file.ukuran / (1024 * 1024)).toFixed(1) + ' MB';
  return (
    <div className="file-entry">
      <div className="file-entry__icon"><HardDrive size={18} aria-hidden="true" /></div>
      <div className="file-entry__info">
        <span className="file-entry__name">{file.nama_file}</span>
        <span className="file-entry__meta">{sizeFormatted} • {file.tipe}</span>
      </div>
      <button
        type="button"
        className="file-entry__delete"
        onClick={() => onDelete(file.id)}
        aria-label={`Hapus file ${file.nama_file}`}
      >
        <Trash2 size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

function UploadingEntry({ file, onRetry }) {
  return (
    <div className="file-entry file-entry--uploading">
      <div className="file-entry__icon"><Upload size={18} aria-hidden="true" /></div>
      <div className="file-entry__info">
        <span className="file-entry__name">{file.nama_file}</span>
        {file.status === 'uploading' && (
          <div className="file-entry__progress" role="progressbar" aria-valuenow={file.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Upload ${file.nama_file} ${file.progress}%`}>
            <div className="file-entry__progress-fill" style={{ width: `${file.progress}%` }} />
          </div>
        )}
        {file.status === 'error' && (
          <div className="file-entry__error">
            <span>Upload gagal</span>
            <button type="button" className="file-entry__retry" onClick={() => onRetry(file.id)}>
              <RefreshCw size={14} aria-hidden="true" /> Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Workspace({ projects, selectedProjectId, onProjectSelect, uploadedFiles, uploadingFiles, onFilesAdded, onFileDelete, onRetry }) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const totalSize = uploadedFiles.reduce((sum, f) => sum + f.ukuran, 0);
  const storageUsed = (totalSize / (1024 * 1024 * 1024)).toFixed(1);

  const handleFiles = useCallback((files) => {
    setError('');
    const validFiles = [];
    for (const file of files) {
      const result = validateFile(file);
      if (!result.valid) {
        setError(result.error);
        return;
      }
      validFiles.push(file);
    }
    if (validFiles.length > 0) onFilesAdded(validFiles);
  }, [onFilesAdded]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleClick = () => inputRef.current?.click();
  const handleKeyDown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } };
  const handleInputChange = (e) => { handleFiles(Array.from(e.target.files)); e.target.value = ''; };

  const filteredFiles = uploadedFiles.filter((f) => f.project_id === selectedProjectId);

  return (
    <section className="workspace" id="section-workspace" aria-label="Ruang Upload Data Inspeksi">
      <div className="workspace__header">
        <span className="workspace__label">DATA WORKSPACE</span>
        <h3 className="workspace__title">Ruang Upload Data Inspeksi</h3>
        <p className="workspace__subtitle">Upload RAW photos, 4K video, orthomosaic, dan point cloud hasil inspeksi.</p>
      </div>

      {/* Project Dropdown */}
      <div className="workspace__project-select">
        <label htmlFor="workspace-project" className="workspace__select-label">Pilih Proyek:</label>
        <select
          id="workspace-project"
          className="workspace__select"
          value={selectedProjectId || ''}
          onChange={(e) => onProjectSelect(e.target.value || null)}
        >
          <option value="">-- Pilih proyek --</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.nama_proyek}</option>
          ))}
        </select>
      </div>

      {selectedProjectId ? (
        <>
          {/* Upload Area */}
          <div
            className={`workspace__upload-area ${dragOver ? 'workspace__upload-area--drag-over' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label="Area upload file hasil inspeksi"
          >
            <Upload size={32} className="workspace__upload-icon" aria-hidden="true" />
            <p className="workspace__upload-text">Drag & drop file inspeksi atau klik untuk memilih</p>
            <div className="workspace__file-chips">
              {FILE_CHIPS.map((chip) => (
                <span key={chip} className="workspace__chip">{chip}</span>
              ))}
            </div>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".dng,.arw,.mp4,.mov,.tif,.las"
              className="workspace__file-input"
              onChange={handleInputChange}
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>

          {/* Error */}
          {error && <p className="workspace__error" role="alert" aria-live="polite">{error}</p>}

          {/* Uploading Files */}
          {uploadingFiles.length > 0 && (
            <div className="workspace__file-list">
              {uploadingFiles.map((f) => (
                <UploadingEntry key={f.id} file={f} onRetry={onRetry} />
              ))}
            </div>
          )}

          {/* Uploaded Files */}
          {filteredFiles.length > 0 && (
            <div className="workspace__file-list">
              {filteredFiles.map((f) => (
                <FileEntry key={f.id} file={f} onDelete={onFileDelete} />
              ))}
            </div>
          )}

          {/* Storage Indicator */}
          <div className="workspace__storage">
            <HardDrive size={14} aria-hidden="true" />
            <span>{storageUsed} GB / 10 GB</span>
            <div className="workspace__storage-bar">
              <div className="workspace__storage-fill" style={{ width: `${Math.min((totalSize / (10 * 1024 * 1024 * 1024)) * 100, 100)}%` }} />
            </div>
          </div>
        </>
      ) : (
        <div className="workspace__empty">
          <p>Pilih proyek terlebih dahulu untuk mulai upload data inspeksi.</p>
        </div>
      )}
    </section>
  );
}

export default Workspace;
