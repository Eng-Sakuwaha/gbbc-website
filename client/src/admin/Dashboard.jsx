import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get('/admin/dashboard').then(r => setStats(r.data)); }, []);
  if (!stats) return <p>Loading…</p>;
  const cards = [
    ['Total Sermons', stats.sermons],
    ['Upcoming Events', stats.events],
    ['Weekly Activities', stats.activities],
    ['Published Announcements', stats.announcements],
    ['Church Leaders', stats.leaders],
    ['Unread Messages', stats.unread]
  ];
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="stat-grid">
        {cards.map(([label, value]) => (
          <div className="stat-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}