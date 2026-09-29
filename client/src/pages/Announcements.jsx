import { useEffect, useState } from 'react';
import api, { asArray, resolveMediaUrl } from '../services/api';

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/announcements')
      .then((r) => setItems(asArray(r.data)))
      .catch(() => setError('Unable to load announcements right now.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="section container">Loading announcements…</div>;

  return (
    <div className="section container">
      <h1>Announcements</h1>
      {error && <p className="error">{error}</p>}
      <div className="grid">
        {items.map((a) => (
          <div className="card" key={a._id}>
            {a.image && <img src={resolveMediaUrl(a.image)} alt={a.title} loading="lazy" />}
            <h3>{a.title}</h3>
            <p className="muted">
              {a.publishDate && new Date(a.publishDate).toLocaleDateString()}
              {a.author ? ` · ${a.author}` : ''}
            </p>
            {a.summary && <p>{a.summary}</p>}
            {a.content && <p>{a.content}</p>}
          </div>
        ))}
        {!items.length && !error && (
          <p className="muted">No announcements are currently available.</p>
        )}
      </div>
    </div>
  );
}