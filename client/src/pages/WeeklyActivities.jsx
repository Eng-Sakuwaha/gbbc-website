import { useEffect, useState } from 'react';
import api, { asArray } from '../services/api';

export default function WeeklyActivities() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/activities')
      .then((r) => setItems(asArray(r.data)))
      .catch(() => setError('Unable to load activities right now.'))
      .finally(() => setLoading(false));
  }, []);

  const grouped = items.reduce((acc, i) => {
    const key = i.day || 'Unscheduled';
    (acc[key] ||= []).push(i);
    return acc;
  }, {});

  if (loading) return <div className="section container">Loading activities…</div>;

  return (
    <div className="section container">
      <h1>Weekly Activities</h1>
      {error && <p className="error">{error}</p>}
      {Object.entries(grouped).map(([day, list]) => (
        <div key={day} className="day-block">
          <h2>{day}</h2>
          <div className="grid">
            {list.map((a) => (
              <div className="card" key={a._id}>
                <h3>{a.title}</h3>
                <p>{a.startTime}{a.endTime ? ` – ${a.endTime}` : ''}</p>
                <p className="muted">{a.location}</p>
                {a.description && <p>{a.description}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
      {!items.length && !error && (
        <p className="muted">No weekly activities have been published yet.</p>
      )}
    </div>
  );
}