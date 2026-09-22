import { useEffect, useState } from 'react';
import api from '../services/api';
import FileUploadField from '../components/FileUploadField.jsx';

export default function AdminSettings() {
  const [s, setS] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/church/settings').then((r) => setS(r.data));
  }, []);

  if (!s) return <p>Loading…</p>;

  const update = (k, v) => setS({ ...s, [k]: v });
  const updateNested = (k, kk, v) => setS({ ...s, [k]: { ...s[k], [kk]: v } });

  const save = async (e) => {
    e.preventDefault();
    await api.put('/church/settings', s);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form className="admin-form wide" onSubmit={save}>
      <h1>Church Information</h1>

      <FileUploadField
        label="Church Logo"
        kind="image"
        accept="image/*"
        value={s.logo || ''}
        onChange={(v) => update('logo', v)}
      />

      {['churchName', 'motto', 'phone', 'email', 'address'].map((f) => (
        <label key={f}>
          <span>{f}</span>
          <input
            className="input"
            value={s[f] || ''}
            onChange={(e) => update(f, e.target.value)}
          />
        </label>
      ))}

      {['about', 'mission', 'vision', 'history', 'beliefs'].map((f) => (
        <label key={f}>
          <span>{f}</span>
          <textarea
            className="input"
            rows="4"
            value={s[f] || ''}
            onChange={(e) => update(f, e.target.value)}
          />
        </label>
      ))}

      <h3>Social Links</h3>
      {['facebook', 'instagram', 'youtube', 'whatsapp'].map((f) => (
        <label key={f}>
          <span>{f}</span>
          <input
            className="input"
            value={s.socialLinks?.[f] || ''}
            onChange={(e) => updateNested('socialLinks', f, e.target.value)}
          />
        </label>
      ))}

      <h3>Map Embed URL</h3>
      <input
        className="input"
        value={s.mapLocation?.embedUrl || ''}
        onChange={(e) => updateNested('mapLocation', 'embedUrl', e.target.value)}
      />

      <button className="btn-primary" type="submit">Save Changes</button>
      {saved && <p className="success">Saved successfully.</p>}
    </form>
  );
}