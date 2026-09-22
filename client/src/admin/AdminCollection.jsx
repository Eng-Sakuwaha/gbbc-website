import { useEffect, useState } from 'react';
import api from '../services/api';
import FileUploadField from '../components/FileUploadField.jsx';

const IMAGE_FIELDS = new Set(['photo', 'image', 'thumbnail', 'logo']);
const AUDIO_FIELDS = new Set(['audioUrl', 'audio']);

export default function AdminCollection({ resource, fields }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(null);

  const load = () => api.get(`/${resource}`).then((r) => setItems(r.data));
  useEffect(() => { load(); }, [resource]);

  const save = async (e) => {
    e.preventDefault();
    if (editing) await api.put(`/${resource}/${editing}`, form);
    else await api.post(`/${resource}`, form);
    setForm({});
    setEditing(null);
    load();
  };

  const edit = (item) => { setEditing(item._id); setForm(item); };
  const remove = async (id) => {
    if (!confirm('Delete this item permanently?')) return;
    await api.delete(`/${resource}/${id}`);
    load();
  };

  const titleCase = (s) =>
    s.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());

  const renderField = (f) => {
    const common = {
      value: form[f] || '',
      onChange: (v) => setForm({ ...form, [f]: v })
    };

    if (IMAGE_FIELDS.has(f)) {
      return (
        <FileUploadField
          key={f}
          label={titleCase(f)}
          kind="image"
          accept="image/*"
          {...common}
        />
      );
    }
    if (AUDIO_FIELDS.has(f)) {
      return (
        <FileUploadField
          key={f}
          label={titleCase(f)}
          kind="audio"
          accept="audio/*"
          {...common}
        />
      );
    }

    if (f === 'isActive' || f === 'isFeatured') {
      return (
        <label key={f}>
          <span>{titleCase(f)}</span>
          <input
            type="checkbox"
            checked={!!form[f]}
            onChange={(e) => setForm({ ...form, [f]: e.target.checked })}
          />
        </label>
      );
    }

    if (f === 'description' || f === 'content' || f === 'biography') {
      return (
        <label key={f}>
          <span>{titleCase(f)}</span>
          <textarea
            className="input"
            rows="3"
            value={form[f] || ''}
            onChange={(e) => setForm({ ...form, [f]: e.target.value })}
          />
        </label>
      );
    }

    if (f === 'date' || f === 'sermonDate') {
      return (
        <label key={f}>
          <span>{titleCase(f)}</span>
          <input
            className="input"
            type="date"
            value={form[f] ? form[f].slice(0, 10) : ''}
            onChange={(e) => setForm({ ...form, [f]: e.target.value })}
          />
        </label>
      );
    }

    return (
      <label key={f}>
        <span>{titleCase(f)}</span>
        <input
          className="input"
          value={form[f] || ''}
          onChange={(e) => setForm({ ...form, [f]: e.target.value })}
        />
      </label>
    );
  };

  return (
    <div>
      <h1>{titleCase(resource)}</h1>

      <form className="admin-form" onSubmit={save}>
        {fields.map(renderField)}

        <div className="form-actions">
          <button className="btn-primary" type="submit">
            {editing ? 'Update' : `+ Add New ${titleCase(resource)}`}
          </button>
          {editing && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => { setEditing(null); setForm({}); }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Summary</th>
            <th>Media</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it._id}>
              <td>{it.title || it.name}</td>
              <td>
                {it.photo && <img className="thumb" src={it.photo} alt="" />}
                {it.image && <img className="thumb" src={it.image} alt="" />}
                {it.thumbnail && <img className="thumb" src={it.thumbnail} alt="" />}
                {it.audioUrl && <span className="badge-audio">🎵 audio</span>}
              </td>
              <td>
                <button onClick={() => edit(it)}>Edit</button>
                <button className="danger" onClick={() => remove(it._id)}>Delete</button>
              </td>
            </tr>
          ))}
          {!items.length && (
            <tr><td colSpan="3" className="muted">No records yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}