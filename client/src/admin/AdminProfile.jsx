import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '', password: '' });
  const [saved, setSaved] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/profile').then((r) =>
      setProfile({ name: r.data.name, email: r.data.email, password: '' })
    );
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaved(''); setError('');
    try {
      await api.put('/profile', profile);
      setSaved('Profile updated. Please sign in again if you changed your email.');
      setProfile({ ...profile, password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update profile.');
    }
  };

  return (
    <form className="admin-form" onSubmit={save}>
      <h1>My Profile</h1>
      <p className="muted">Signed in as <strong>{user?.role}</strong></p>
      <label><span>Name</span>
        <input className="input" value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
      </label>
      <label><span>Email</span>
        <input className="input" type="email" value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
      </label>
      <label><span>New Password (leave blank to keep current)</span>
        <input className="input" type="password" value={profile.password}
          onChange={(e) => setProfile({ ...profile, password: e.target.value })} />
      </label>
      <button className="btn-primary" type="submit">Save Changes</button>
      {saved && <p className="success">{saved}</p>}
      {error && <p className="error">{error}</p>}
    </form>
  );
}