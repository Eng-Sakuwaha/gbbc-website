import axios from 'axios';

/**
 * API base URL.
 *
 * - Local dev: set VITE_API_URL=http://localhost:5000/api in client/.env
 * - Production (Render): backend serves the frontend, so use '/api'
 *
 * If VITE_API_URL is not set, defaults to same-origin '/api'.
 */
const API_BASE = import.meta.env.VITE_API_URL || '/api';

// For same-origin deployments, API_ORIGIN is empty — media URLs stay relative.
const API_ORIGIN = API_BASE.startsWith('http')
  ? API_BASE.replace(/\/api\/?$/, '')
  : '';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

/**
 * Turn a stored media URL into something a browser can load.
 *
 *  Local dev (VITE_API_URL=http://localhost:5000/api):
 *    '/uploads/x.mp3' -> 'http://localhost:5000/uploads/x.mp3'
 *
 *  Production (same origin):
 *    '/uploads/x.mp3' -> '/uploads/x.mp3'   (browser uses current origin)
 *
 *  External URLs (http/https) are always returned unchanged.
 */
export function resolveMediaUrl(url) {
  if (!url) return '';
  const trimmed = String(url).trim();
  if (!trimmed) return '';

  // Absolute URLs — return as-is
  if (/^(https?:|data:|blob:)/i.test(trimmed)) return trimmed;

  // Relative URL
  if (trimmed.startsWith('/')) {
    // In local dev, prefix with the backend origin.
    // In production (same-origin), return unchanged so the browser uses current domain.
    return API_ORIGIN ? `${API_ORIGIN}${trimmed}` : trimmed;
  }

  return trimmed;
}

/**
 * Upload a file via multipart/form-data to POST /api/media.
 * Used by FileUploadField on AdminCollection and AdminSettings pages.
 */
export async function uploadFile(file, onProgress) {
  const form = new FormData();
  form.append('file', file);

  const { data } = await api.post('/media', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    }
  });

  return data; // { url, filename, mimetype, size }
}

export default api;