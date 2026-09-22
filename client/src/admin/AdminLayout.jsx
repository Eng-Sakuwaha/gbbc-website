import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const items = [
  ['/admin/dashboard', 'Dashboard'],
  ['/admin/settings', 'Church Information'],
  ['/admin/leaders', 'Leadership'],
  ['/admin/ministries', 'Ministries'],
  ['/admin/activities', 'Weekly Activities'],
  ['/admin/sermons', 'Sermons'],
  ['/admin/events', 'Events'],
  ['/admin/announcements', 'Announcements'],
  ['/admin/messages', 'Contact Messages'],
  ['/admin/media', 'Media Library'],
  ['/admin/profile', 'Profile']
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src="/logo.png" alt="logo" />
          <div>
            <strong>GBBC Admin</strong>
            <span>{user?.name || 'Administrator'}</span>
          </div>
        </div>
        <nav>
          {items.map(([to, label]) => (
            <NavLink key={to} to={to}>{label}</NavLink>
          ))}
          <button
            className="logout"
            onClick={() => { logout(); nav('/admin/login'); }}
          >
            Logout
          </button>
        </nav>
      </aside>
      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  );
}