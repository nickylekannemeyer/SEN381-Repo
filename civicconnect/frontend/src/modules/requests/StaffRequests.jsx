import { useEffect, useState } from 'react';
import { listRequests, changeStatus, assignRequest } from '../../shared/api/client.js';

const NEXT = { 'Open': ['In Progress', 'Closed'], 'In Progress': ['Resolved', 'Open'], 'Resolved': ['Closed', 'In Progress'], 'Closed': [] };
const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];
const BADGE = { 'Open': 'badge-open', 'In Progress': 'badge-progress', 'Resolved': 'badge-resolved', 'Closed': 'badge-closed' };

export default function StaffRequests() {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);

  const load = () => listRequests({ status }).then(({ data }) => setRequests(data)).catch((e) => setError(e.message));
  useEffect(() => { load(); }, [status]);

  const move = async (r, target) => { setError(null); try { await changeStatus(r.id, target, r.version); load(); } catch (e) { setError(e.message); } };
  const accept = async (r) => { setError(null); try { await assignRequest(r.id); load(); } catch (e) { setError(e.message); } };

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1>Staff Workspace</h1>
          <p className="subtitle">Accept requests and drive them through the lifecycle.</p>
        </div>
      </div>

      <div className="table-container glass-panel">
        <div className="table-header">
          <h2 style={{ fontSize: 18 }}>Requests</h2>
          <div className="form-group" style={{ margin: 0, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <label style={{ margin: 0 }}>Status</label>
            <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All</option>{STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
            <button className="btn-secondary" onClick={load}>Refresh</button>
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        <table className="requests-table">
          <thead><tr><th>ID</th><th>Title</th><th>Category</th><th>Status</th><th>Assigned</th><th>Actions</th></tr></thead>
          <tbody>
            {requests.length === 0 && <tr><td colSpan={6}>No requests.</td></tr>}
            {requests.map((r) => (
              <tr key={r.id}>
                <td>#{r.id}</td>
                <td>{r.title} {r.isOverdue && <span className="badge badge-progress">OVERDUE</span>}</td>
                <td>{r.category}</td>
                <td>
                  <span className={`badge ${BADGE[r.status] || ''}`}>{r.status}</span>{' '}
                  <small style={{ color: 'var(--text-muted)' }}>v{r.version}</small>
                </td>
                <td>{r.assignedTo ? `staff #${r.assignedTo}` : <em style={{ color: 'var(--text-muted)' }}>unassigned</em>}</td>
                <td>
                  <div className="form-actions" style={{ margin: 0, justifyContent: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
                    {!r.assignedTo && <button className="btn-secondary" onClick={() => accept(r)}>Accept</button>}
                    {NEXT[r.status].length === 0
                      ? <em style={{ color: 'var(--text-muted)' }}>Terminal</em>
                      : NEXT[r.status].map((s) => (
                          <button key={s} className="btn-primary" style={{ padding: '8px 14px' }} onClick={() => move(r, s)}>→ {s}</button>
                        ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
