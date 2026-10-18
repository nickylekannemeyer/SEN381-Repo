import { useEffect, useState } from 'react';
import { submitRequest, listRequests } from '../../shared/api/client.js';

const CATEGORIES = ['Maintenance', 'Security', 'IT Support', 'Other'];
const BADGE = { 'Open': 'badge-open', 'In Progress': 'badge-progress', 'Resolved': 'badge-resolved', 'Closed': 'badge-closed' };

export default function RequesterRequests() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [requests, setRequests] = useState([]);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  const load = () => listRequests().then(({ data }) => setRequests(data)).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault(); setError(null); setMsg(null);
    try {
      const { data } = await submitRequest({ title, description, category });
      setMsg(`Request #${data.id} submitted (${data.status}).`); setTitle(''); setDescription(''); load();
    } catch (err) { setError(err.message); }
  };

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1>My Requests</h1>
          <p className="subtitle">Submit and track your community service requests.</p>
        </div>
      </div>

      <div className="form-card glass-panel">
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Title</label>
            <input className="form-control" required maxLength={200} value={title}
              onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-control" required maxLength={2000} rows={3} value={description}
              onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={load}>Refresh</button>
            <button type="submit" className="btn-primary">Submit request</button>
          </div>
        </form>
        {msg && <p className="ok">{msg}</p>}
        {error && <p className="error">{error}</p>}
      </div>

      <div className="table-container glass-panel">
        <div className="table-header"><h2 style={{ fontSize: 18 }}>Your requests</h2></div>
        <table className="requests-table">
          <thead><tr><th>ID</th><th>Title</th><th>Category</th><th>Status</th></tr></thead>
          <tbody>
            {requests.length === 0 && <tr><td colSpan={4}>No requests yet.</td></tr>}
            {requests.map((r) => (
              <tr key={r.id}>
                <td>#{r.id}</td>
                <td>{r.title} {r.isOverdue && <span className="badge badge-progress">OVERDUE</span>}</td>
                <td>{r.category}</td>
                <td><span className={`badge ${BADGE[r.status] || ''}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
