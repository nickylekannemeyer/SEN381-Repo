import { useEffect, useState } from 'react';
import { listRequests } from '../../shared/api/client.js';

const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];
const META = {
  'Open': { icon: 'schedule', cls: 'blue', card: 'open-card' },
  'In Progress': { icon: 'sync', cls: 'orange', card: '' },
  'Resolved': { icon: 'check_circle', cls: 'green', card: 'resolved-card' },
  'Closed': { icon: 'inventory_2', cls: 'yellow', card: '' },
};
const BADGE = { 'Open': 'badge-open', 'In Progress': 'badge-progress', 'Resolved': 'badge-resolved', 'Closed': 'badge-closed' };

export default function ManagementReports() {
  const [requests, setRequests] = useState([]);
  const [category, setCategory] = useState('');
  const [error, setError] = useState(null);

  const load = () => listRequests({ category }).then(({ data }) => setRequests(data)).catch((e) => setError(e.message));
  useEffect(() => { load(); }, [category]);

  const counts = STATUSES.reduce((m, s) => { m[s] = requests.filter((r) => r.status === s).length; return m; }, {});
  const overdue = requests.filter((r) => r.isOverdue);
  const categories = [...new Set(requests.map((r) => r.category))];

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1>Management Overview</h1>
          <p className="subtitle">Service requests by status and category.</p>
        </div>
        <div className="form-group" style={{ margin: 0, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <label style={{ margin: 0 }}>Category</label>
          <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All</option>{categories.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
          <button className="btn-secondary" onClick={load}>Refresh</button>
        </div>
      </div>
      {error && <p className="error">{error}</p>}

      <div className="metrics-grid">
        {STATUSES.map((s) => (
          <div key={s} className={`metric-card glass-panel ${META[s].card}`}>
            <div className={`metric-icon ${META[s].cls}`}><span className="material-symbols-outlined">{META[s].icon}</span></div>
            <div className="metric-data">
              <span className="metric-label">{s}</span>
              <span className="metric-value">{counts[s]}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="table-container glass-panel">
        <div className="table-header"><h2 style={{ fontSize: 18 }}>Overdue requests ({overdue.length})</h2></div>
        <table className="requests-table">
          <thead><tr><th>ID</th><th>Title</th><th>Category</th><th>Status</th></tr></thead>
          <tbody>
            {overdue.length === 0 && <tr><td colSpan={4}>None.</td></tr>}
            {overdue.map((r) => (
              <tr key={r.id}>
                <td>#{r.id}</td><td>{r.title}</td><td>{r.category}</td>
                <td><span className={`badge ${BADGE[r.status] || ''}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
