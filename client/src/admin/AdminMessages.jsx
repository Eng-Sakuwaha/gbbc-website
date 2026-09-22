import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminMessages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/contact')
      .then(r => setItems(Array.isArray(r.data) ? r.data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    try { await api.put(`/contact/${id}/read`); load(); }
    catch (err) { alert(err.response?.data?.message || 'Failed.'); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this message?')) return;
    try { await api.delete(`/contact/${id}`); load(); }
    catch (err) { alert(err.response?.data?.message || 'Failed.'); }
  };

  return (
    <div>
      <h1>Contact Messages</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>From</th><th>Subject</th><th>Message</th>
            <th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && <tr><td colSpan="5" className="muted">Loading…</td></tr>}
          {!loading && items.map(m => (
            <tr key={m._id} className={m.isRead ? '' : 'unread'}>
              <td>{m.name}<br /><small>{m.email}</small></td>
              <td>{m.subject}</td>
              <td>{m.message}</td>
              <td>{m.isRead ? 'Read' : 'Unread'}</td>
              <td>
                {!m.isRead && (
                  <button type="button" onClick={() => markRead(m._id)}>Mark Read</button>
                )}
                <button type="button" className="danger"
                  onClick={() => remove(m._id)}>Delete</button>
              </td>
            </tr>
          ))}
          {!loading && !items.length && (
            <tr><td colSpan="5" className="muted">No messages yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}