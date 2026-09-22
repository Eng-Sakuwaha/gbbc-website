import { useEffect, useState } from 'react';
import api from '../services/api';
import Seo from '../components/Seo.jsx';
import Countdown from '../components/Countdown.jsx';

export default function Events() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/events').then((r) => setItems(r.data));
  }, []);

  const now = Date.now();
  const upcoming = items
    .filter((e) => new Date(e.date).getTime() >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const past = items
    .filter((e) => new Date(e.date).getTime() < now)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const renderCard = (e) => (
    <article className="event-card" key={e._id}>
      {e.image && (
        <div className="event-image">
          <img src={e.image} alt={e.title} loading="lazy" />
        </div>
      )}
      <div className="event-body">
        <h3>{e.title}</h3>
        <p className="event-when">
          <strong>{new Date(e.date).toLocaleDateString()}</strong>
          {e.startTime && <> · {e.startTime}{e.endTime ? ` – ${e.endTime}` : ''}</>}
        </p>
        {e.location && <p className="event-location muted">{e.location}</p>}

        {e.showCountdown !== false && (
          <Countdown date={e.date} startTime={e.startTime} />
        )}

        {e.description && (
          <p className="event-description">{e.description}</p>
        )}
        {e.registrationUrl && (
          <a
            className="btn-secondary event-cta"
            href={e.registrationUrl}
            target="_blank"
            rel="noreferrer"
          >
            Register
          </a>
        )}
      </div>
    </article>
  );

  return (
    <div className="section container">
      <Seo
        title="Events | Grace Bible Baptist Church Kitwe"
        description="Upcoming events at Grace Bible Baptist Church Kitwe."
      />

      <h1>Events</h1>

      <h2>Upcoming</h2>
      <div className="event-grid">
        {upcoming.map(renderCard)}
        {!upcoming.length && (
          <p className="muted">There are currently no upcoming events.</p>
        )}
      </div>

      {!!past.length && (
        <>
          <h2>Past Events</h2>
          <div className="event-grid">
            {past.map(renderCard)}
          </div>
        </>
      )}
    </div>
  );
}