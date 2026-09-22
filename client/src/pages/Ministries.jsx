import { useEffect, useState } from 'react';
import api from '../services/api';
import Seo from '../components/Seo.jsx';
import Loading from '../components/Loading.jsx';

export default function Ministries() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/ministries')
      .then((r) => setItems(Array.isArray(r.data) ? r.data : []))
      .catch((err) => {
        setError(err.response?.data?.message || 'Unable to load ministries.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section container">
      <Seo
        title="Ministries | Grace Bible Baptist Church Kitwe"
        description="Explore the ministries of Grace Bible Baptist Church Kitwe."
      />

      <h1>Our Ministries</h1>
      <p className="muted">
        Every ministry at Grace Bible Baptist Church Kitwe exists to glorify God,
        build up believers, and reach our community with the love of Christ.
      </p>

      {loading && <Loading label="Loading ministries…" />}
      {error && <p className="error">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="muted">Ministries will be listed here soon.</p>
      )}

      <div className="ministry-grid">
        {items.map((m) => (
          <article className="ministry-card" key={m._id}>
            <div className="ministry-image">
              {m.image ? (
                <img src={m.image} alt={m.name} loading="lazy" />
              ) : (
                <div className="ministry-image-placeholder">
                  {m.name ? m.name.charAt(0) : '?'}
                </div>
              )}
            </div>

            <div className="ministry-body">
              <h3>{m.name}</h3>

              {m.leader && (
                <p className="ministry-leader">
                  <span>Leader:</span> {m.leader}
                </p>
              )}

              {m.schedule && (
                <p className="ministry-schedule">
                  <span>Meets:</span> {m.schedule}
                </p>
              )}

              {m.contact && (
                <p className="ministry-contact">
                  <span>Contact:</span>{' '}
                  <a
                    href={
                      String(m.contact).includes('@')
                        ? `mailto:${m.contact}`
                        : `tel:${String(m.contact).replace(/\s+/g, '')}`
                    }
                  >
                    {m.contact}
                  </a>
                </p>
              )}

              {m.description && (
                <p className="ministry-description">{m.description}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}