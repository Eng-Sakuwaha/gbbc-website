import { useEffect, useState } from 'react';
import api from '../services/api';

export default function About() {
  const [s, setS] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/church/settings')
      .then((r) => setS(r.data && typeof r.data === 'object' ? r.data : null))
      .catch(() => setError('Unable to load information right now.'));
  }, []);

  if (error) return <div className="section container"><p className="error">{error}</p></div>;
  if (!s) return <div className="section container">Loading…</div>;

  return (
    <div className="section container">
      <h1>About Us</h1>
      <h3>Who We Are</h3><p>{s.about}</p>
      <h3>Our Motto</h3><p><em>{s.motto}</em></p>
      <h3>Our Mission</h3><p>{s.mission}</p>
      <h3>Our Vision</h3><p>{s.vision}</p>
      <h3>What We Believe</h3><p>{s.beliefs}</p>
      <h3>Our History</h3><p>{s.history}</p>
    </div>
  );
}