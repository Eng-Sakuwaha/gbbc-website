import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import HeroSlider from '../components/HeroSlider.jsx';
import Countdown from '../components/Countdown.jsx';

export default function Home() {
  const [settings, setSettings] = useState(null);
  const [activities, setActivities] = useState([]);
  const [sermon, setSermon] = useState(null);
  const [events, setEvents] = useState([]);
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    api.get('/church/settings').then((r) => setSettings(r.data)).catch(() => {});
    api.get('/activities').then((r) => setActivities(r.data.slice(0, 4))).catch(() => {});
    api.get('/sermons')
      .then((r) => setSermon(r.data.find((s) => s.isFeatured) || r.data[0]))
      .catch(() => {});
    api.get('/events')
      .then((r) => {
        const now = Date.now();
        const upcoming = r.data
          .filter((e) => new Date(e.date).getTime() >= now)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3);
        setEvents(upcoming);
      })
      .catch(() => {});
    api.get('/announcements').then((r) => setAnnouncement(r.data[0])).catch(() => {});
  }, []);

  return (
    <>
      <section className="hero">
        <HeroSlider />
        <div className="container hero-content">
          <h1>Grace Bible Baptist Church Kitwe</h1>
          <p className="motto">Loving God. Loving Others.</p>
          <p className="lead">
            A Christ-centered Baptist church committed to faithfully proclaiming God&apos;s Word,
            growing believers in Christ, and loving others through Christian fellowship and service.
          </p>
          <div className="cta-row">
            <Link className="btn-primary" to="/contact">Join Us This Sunday</Link>
            <Link className="btn-secondary" to="/about">Explore Our Church</Link>
          </div>
        </div>
      </section>

      <section className="section container">
        <h2>Welcome</h2>
        <p>{settings?.about || 'Information will be available soon.'}</p>
      </section>

      <section className="section container">
        <h2>Service Times</h2>
        <div className="grid">
          {(settings?.serviceTimes || []).map((s, i) => (
            <div className="card" key={i}>
              <h3>{s.title}</h3>
              <p><strong>{s.day}</strong> · {s.time}</p>
              {s.description && <p>{s.description}</p>}
            </div>
          ))}
          {!settings?.serviceTimes?.length && (
            <p className="muted">Service times coming soon.</p>
          )}
        </div>
      </section>

      <section className="section container">
        <h2>Weekly Activities</h2>
        <div className="grid">
          {activities.map((a) => (
            <div className="card" key={a._id}>
              <h3>{a.title}</h3>
              <p><strong>{a.day}</strong> · {a.startTime}</p>
              <p className="muted">{a.location}</p>
            </div>
          ))}
          {!activities.length && (
            <p className="muted">No weekly activities added yet.</p>
          )}
        </div>
      </section>

      {announcement && (
        <section className="section container highlight">
          <h2>Latest Announcement</h2>
          <h3>{announcement.title}</h3>
          <p>{announcement.summary}</p>
          <Link className="btn-secondary" to="/announcements">Read more</Link>
        </section>
      )}

      {!!events.length && (
        <section className="section container">
          <h2>Upcoming Events</h2>
          <div className="event-grid">
            {events.map((e, idx) => (
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
                    {e.startTime && <> · {e.startTime}</>}
                  </p>
                  {e.location && <p className="event-location muted">{e.location}</p>}

                  {idx === 0 && e.showCountdown !== false && (
                    <Countdown date={e.date} startTime={e.startTime} />
                  )}
                </div>
              </article>
            ))}
          </div>
          <p style={{ marginTop: '1rem' }}>
            <Link className="btn-secondary" to="/events">See all events</Link>
          </p>
        </section>
      )}

      {sermon && (
        <section className="section container highlight">
          <h2>Featured Sermon</h2>
          <h3>{sermon.title}</h3>
          <p>{sermon.speaker} · {sermon.scripture}</p>
          <Link className="btn-secondary" to="/sermons">Listen to a Sermon</Link>
        </section>
      )}

      <section className="section container cta-band">
        <h2>Come Worship With Us</h2>
        <p>We would love to welcome you this Sunday.</p>
        <Link className="btn-primary" to="/contact">Plan Your Visit</Link>
      </section>
    </>
  );
}