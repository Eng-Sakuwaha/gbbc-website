import { useEffect, useState } from 'react';
import api from '../services/api';

const MAX_FILE_SIZE_MB = 200;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function AdminMedia() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const load = () =>
    api
      .get('/media')
      .then((r) => setFiles(Array.isArray(r.data) ? r.data : []))
      .catch(() => setFiles([]));

  useEffect(() => {
    load();
  }, []);

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(
        `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). ` +
          `Maximum allowed is ${MAX_FILE_SIZE_MB} MB.`
      );
      e.target.value = '';
      return;
    }

    const form = new FormData();
    form.append('file', file);
    setUploading(true);
    setError('');

    try {
      await api.post('/media', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const remove = async (filename) => {
    if (!confirm('Delete this file?')) return;
    try {
      await api.delete(`/media/${encodeURIComponent(filename)}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  const copyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('URL copied to clipboard.');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      alert('URL copied to clipboard.');
    }
  };

  return (
    <div>
      <h1>Media Library</h1>

      <div className="admin-form">
        <label>
          <span>Upload File (max {MAX_FILE_SIZE_MB} MB)</span>
          <input type="file" onChange={onUpload} disabled={uploading} />
        </label>
        {uploading && <p className="muted">Uploading…</p>}
        {error && <p className="error">{error}</p>}
      </div>

      <div className="media-grid">
        {files.map((f) => (
          <div className="media-card" key={f.filename}>
            {/\.(png|jpe?g|gif|webp)$/i.test(f.filename) ? (
              <img src={f.url} alt={f.filename} />
            ) : (
              <div className="file-placeholder">
                {f.filename.split('.').pop()}
              </div>
            )}
            <div className="media-meta">
              <span>{f.filename}</span>
              <small>
                {f.size >= 1024 * 1024
                  ? `${(f.size / 1024 / 1024).toFixed(1)} MB`
                  : `${(f.size / 1024).toFixed(1)} KB`}
              </small>
            </div>
            <div className="media-actions">
              <a href={f.url} target="_blank" rel="noreferrer">
                Open
              </a>
              <button type="button" onClick={() => copyUrl(f.url)}>
                Copy URL
              </button>
              <button
                type="button"
                className="danger"
                onClick={() => remove(f.filename)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!files.length && <p className="muted">No files uploaded yet.</p>}
      </div>
    </div>
  );
}