import { useEffect, useState } from 'react';
import api, { asArray, resolveMediaUrl } from '../services/api';

export default function Ministries() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/ministries')
      .then((r) => setItems(asArray(r.data)))
      .catch(() => setError('Unable to load ministries right now.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="section container">Loading ministries…</div>;

  return (
    <div className="section container">
      <h1>Our Ministries</h1>
      <p className="muted">
        Every ministry at Grace Bible Baptist Church Kitwe exists to glorify God,
        build up believers, and reach our community with the love of Christ.
      </p>

      {error && <p className="error">{error}</p>}

      <div className="ministry-grid">
        {items.map((m) => (
          <article className="ministry-card" key={m._id}>
            <div className="ministry-image">
              {m.image ? (
                <img src={resolveMediaUrl(m.image)} alt={m.name} loading="lazy" />
              ) : (
                <div className="ministry-image-placeholder">
                  {m.name ? m.name.charAt(0) : '?'}
                </div>
              )}
            </div>
            <div className="ministry-body">
              <h3>{m.name}</h3>
              {m.leader && (
                <p className="ministry-leader"><span>Leader:</span> {m.leader}</p>
              )}
              {m.schedule && (
                <p className="ministry-schedule"><span>Meets:</span> {m.schedule}</p>
              )}
              {m.contact && (
                <p className="ministry-contact">
                  <span>Contact:</span>{' '}
                  <a href={`tel:${String(m.contact).replace(/\s+/g, '')}`}>{m.contact}</a>
                </p>
              )}
              {m.description && <p className="ministry-description">{m.description}</p>}
            </div>
          </article>
        ))}
        {!items.length && !error && (
          <p className="muted">Ministries will be listed here soon.</p>
        )}
      </div>
    </div>
  );
}