import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Leadership() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/leaders')
      .then(r => setLeaders(Array.isArray(r.data) ? r.data : []))
      .catch(() => setLeaders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section container">
      <h1>Our Leadership</h1>
      {loading && <p className="muted">Loading…</p>}
      <div className="grid">
        {leaders.map(l => (
          <div className="card leader-card" key={l._id}>
            {l.photo && <img src={l.photo} alt={l.name} />}
            <h3>{l.name}</h3>
            <p className="role">{l.position}</p>
            <p>{l.biography}</p>
            {l.bibleVerse && <p><em>{l.bibleVerse}</em></p>}
          </div>
        ))}
        {!loading && !leaders.length && (
          <p className="muted">Leadership information coming soon.</p>
        )}
      </div>
    </div>
  );
}