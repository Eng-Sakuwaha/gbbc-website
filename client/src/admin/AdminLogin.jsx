import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLogin() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try { await login(email, password); nav('/admin/dashboard'); }
    catch (err) { setError(err.response?.data?.message || 'Login failed'); }
  };

  return (
    <div className="admin-login">
      <form onSubmit={submit} className="card">
        <img src="/logo.png" alt="Church logo" />
        <h2>Admin Sign In</h2>
        {error && <p className="error">{error}</p>}
        <input className="input" type="email" placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)} required />
        <button className="btn-primary" type="submit">Sign In</button>
      </form>
    </div>
  );
}