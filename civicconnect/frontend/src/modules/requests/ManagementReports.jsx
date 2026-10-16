import { useEffect, useState } from 'react';
import { listRequests } from '../../shared/api/client.js';

const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];

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
    <section>
      <h2>Management overview</h2>
      <label>Filter by category
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All</option>{categories.map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>
      </label>
      <button onClick={load}>Refresh</button>
      {error && <p className="error">{error}</p>}
      <div className="counts">
        {STATUSES.map((s) => (<span key={s} className="count">{s}: <strong>{counts[s]}</strong></span>))}
        <span className="count">Overdue: <strong>{overdue.length}</strong></span>
      </div>
      <h3>Overdue requests</h3>
      <ul className="cards">
        {overdue.length === 0 && <li>None.</li>}
        {overdue.map((r) => (<li key={r.id}><strong>#{r.id} — {r.title}</strong><div>Status: {r.status} · {r.category}</div></li>))}
      </ul>
    </section>
  );
}
