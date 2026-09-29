import axios from 'axios';

/**
 * API base URL:
 *   - Local dev: `VITE_API_URL=http://localhost:5000/api`
 *   - Production: unset → `/api` (same-origin)
 */
const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Backend origin for resolving relative media paths.
// If VITE_API_URL is http://localhost:5000/api → origin is http://localhost:5000
// If same-origin → origin is '' (browser resolves relative URLs automatically)
const API_ORIGIN = API_BASE.startsWith('http')
  ? API_BASE.replace(/\/api\/?$/, '')
  : '';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000 // 30s — handles Render cold starts gracefully
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

/**
 * Turn a stored media URL into something a browser can load.
 *  Local dev: '/uploads/x.mp3' → 'http://localhost:5000/uploads/x.mp3'
 *  Production: '/uploads/x.mp3' → '/uploads/x.mp3' (browser uses current origin)
 *  External: 'https://youtube.com/...' → unchanged
 */
export function resolveMediaUrl(url) {
  if (!url) return '';
  const trimmed = String(url).trim();
  if (!trimmed) return '';
  if (/^(https?:|data:|blob:)/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/')) {
    return API_ORIGIN ? `${API_ORIGIN}${trimmed}` : trimmed;
  }
  return trimmed;
}

/**
 * Normalize an API response into an array.
 * Guards against the common causes of "X.map is not a function":
 *  - Backend returned an error object
 *  - Backend returned null/undefined
 *  - Backend returned a single object instead of an array
 */
export function asArray(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.items)) return data.items;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

/** Safe fetch helper — always returns an array, never throws. */
export async function fetchList(path) {
  try {
    const { data } = await api.get(path);
    return asArray(data);
  } catch (err) {
    console.warn(`fetchList(${path}) failed:`, err.message);
    return [];
  }
}

/** Upload a file via multipart/form-data. */
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
  return data;
}

export default api;