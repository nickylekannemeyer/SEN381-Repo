import { useEffect, useState } from 'react';
import { listRequests, changeStatus, assignRequest } from '../../shared/api/client.js';

const NEXT = { 'Open': ['In Progress', 'Closed'], 'In Progress': ['Resolved', 'Open'], 'Resolved': ['Closed', 'In Progress'], 'Closed': [] };
const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];

export default function StaffRequests() {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);

  const load = () => listRequests({ status }).then(({ data }) => setRequests(data)).catch((e) => setError(e.message));
  useEffect(() => { load(); }, [status]);

  const move = async (r, target) => { setError(null); try { await changeStatus(r.id, target, r.version); load(); } catch (e) { setError(e.message); } };
  const accept = async (r) => { setError(null); try { await assignRequest(r.id); load(); } catch (e) { setError(e.message); } };

  return (
    <section>
      <h2>Staff workspace</h2>
      <label>Filter by status
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>{STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
        </select>
      </label>
      <button onClick={load}>Refresh</button>
      {error && <p className="error">{error}</p>}
      <ul className="cards">
        {requests.map((r) => (
          <li key={r.id}>
            <strong>#{r.id} — {r.title}</strong>{r.isOverdue && <span className="badge">OVERDUE</span>}
            <div>Status: {r.status} (v{r.version})</div>
            <div>Category: {r.category}</div>
            <div>Assigned: {r.assignedTo ? `staff #${r.assignedTo}` : 'unassigned'}</div>
            <div className="actions">
              {!r.assignedTo && <button onClick={() => accept(r)}>Accept</button>}
              {NEXT[r.status].length === 0 ? <em>Terminal</em> : NEXT[r.status].map((s) => (<button key={s} onClick={() => move(r, s)}>Move to {s}</button>))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
