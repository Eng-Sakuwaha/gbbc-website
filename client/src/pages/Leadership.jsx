import { useEffect, useState } from 'react';
import api, { asArray, resolveMediaUrl } from '../services/api';

export default function Leadership() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/leaders')
      .then((r) => setLeaders(asArray(r.data)))
      .catch(() => setError('Unable to load leadership right now.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="section container">Loading…</div>;

  return (
    <div className="section container">
      <h1>Our Leadership</h1>
      {error && <p className="error">{error}</p>}
      <div className="grid">
        {leaders.map((l) => (
          <div className="card leader-card" key={l._id}>
            {l.photo && <img src={resolveMediaUrl(l.photo)} alt={l.name} loading="lazy" />}
            <h3>{l.name}</h3>
            <p className="role">{l.position}</p>
            <p>{l.biography}</p>
            {l.bibleVerse && <p><em>{l.bibleVerse}</em></p>}
          </div>
        ))}
        {!leaders.length && !error && (
          <p className="muted">Leadership information coming soon.</p>
        )}
      </div>
    </div>
  );
}