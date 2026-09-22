import { useRef, useState } from 'react';
import { uploadFile } from '../services/api.js';

const MAX_FILE_SIZE_MB = 200;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function FileUploadField({
  label,
  value,
  onChange,
  accept = 'image/*',
  kind = 'image'
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handlePick = () => {
    setError('');
    inputRef.current?.click();
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(
        `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). ` +
          `Maximum allowed is ${MAX_FILE_SIZE_MB} MB.`
      );
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      const media = await uploadFile(file, setProgress);
      onChange(media.url);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleRemove = () => {
    setError('');
    onChange('');
  };

  return (
    <div className="upload-field">
      <span className="upload-label">{label}</span>

      {value && (
        <div className="upload-preview">
          {kind === 'image' ? (
            <img src={value} alt="Preview" />
          ) : (
            <audio controls src={value} style={{ width: '100%' }} />
          )}
        </div>
      )}

      <div className="upload-row">
        <input
          className="input"
          type="text"
          placeholder="Paste a URL or upload a file"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />

        <button
          type="button"
          className="btn-secondary upload-btn"
          onClick={handlePick}
          disabled={uploading}
        >
          {uploading ? `Uploading… ${progress}%` : 'Choose File'}
        </button>

        {value && (
          <button
            type="button"
            className="upload-btn upload-remove"
            onClick={handleRemove}
            disabled={uploading}
          >
            Remove
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFile}
        style={{ display: 'none' }}
      />

      {uploading && (
        <div className="upload-progress">
          <div
            className="upload-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && <p className="error upload-error">{error}</p>}
    </div>
  );
}