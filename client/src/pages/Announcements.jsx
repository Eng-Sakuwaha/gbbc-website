import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/announcements')
      .then(r => setItems(Array.isArray(r.data) ? r.data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section container">
      <h1>Announcements</h1>
      {loading && <p className="muted">Loading announcements…</p>}
      <div className="grid">
        {items.map(a => (
          <div className="card" key={a._id}>
            {a.image && <img src={a.image} alt={a.title} />}
            <h3>{a.title}</h3>
            <p className="muted">
              {a.publishDate && new Date(a.publishDate).toLocaleDateString()}
              {a.author ? ` · ${a.author}` : ''}
            </p>
            <p>{a.summary}</p>
            <p>{a.content}</p>
          </div>
        ))}
        {!loading && !items.length && (
          <p className="muted">No announcements are currently available.</p>
        )}
      </div>
    </div>
  );
}