import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, '');

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

/**
 * Turn a stored media URL into something a browser can actually load.
 *  '/uploads/x.mp3'             -> 'http://localhost:5000/uploads/x.mp3'
 *  'http://.../uploads/x.mp3'   -> unchanged
 *  'https://youtube.com/...'    -> unchanged
 */
export function resolveMediaUrl(url) {
  if (!url) return '';
  const trimmed = String(url).trim();
  if (!trimmed) return '';
  if (/^(https?:|data:|blob:)/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/')) return `${API_ORIGIN}${trimmed}`;
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