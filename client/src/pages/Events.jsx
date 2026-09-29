import { useEffect, useState } from 'react';
import api, { asArray, resolveMediaUrl } from '../services/api';
import Countdown from '../components/Countdown.jsx';

export default function Events() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/events')
      .then((r) => setItems(asArray(r.data)))
      .catch(() => setError('Unable to load events right now.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="section container">Loading events…</div>;

  const now = Date.now();
  const list = asArray(items);
  const upcoming = list
    .filter((e) => e?.date && new Date(e.date).getTime() >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const past = list
    .filter((e) => e?.date && new Date(e.date).getTime() < now)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const renderCard = (e) => (
    <article className="event-card" key={e._id}>
      {e.image && (
        <div className="event-image">
          <img src={resolveMediaUrl(e.image)} alt={e.title} loading="lazy" />
        </div>
      )}
      <div className="event-body">
        <h3>{e.title}</h3>
        <p className="event-when">
          <strong>{new Date(e.date).toLocaleDateString()}</strong>
          {e.startTime && <> · {e.startTime}{e.endTime ? ` – ${e.endTime}` : ''}</>}
        </p>
        {e.location && <p className="event-location muted">{e.location}</p>}
        {e.showCountdown !== false && <Countdown date={e.date} startTime={e.startTime} />}
        {e.description && <p className="event-description">{e.description}</p>}
        {e.registrationUrl && (
          <a className="btn-secondary event-cta" href={e.registrationUrl} target="_blank" rel="noreferrer">
            Register
          </a>
        )}
      </div>
    </article>
  );

  return (
    <div className="section container">
      <h1>Events</h1>
      {error && <p className="error">{error}</p>}

      <h2>Upcoming</h2>
      <div className="event-grid">
        {upcoming.map(renderCard)}
        {!upcoming.length && !error && (
          <p className="muted">There are currently no upcoming events.</p>
        )}
      </div>

      {!!past.length && (
        <>
          <h2>Past Events</h2>
          <div className="event-grid">{past.map(renderCard)}</div>
        </>
      )}
    </div>
  );
}