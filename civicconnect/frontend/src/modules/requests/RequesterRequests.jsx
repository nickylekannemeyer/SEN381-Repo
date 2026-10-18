import { useEffect, useState } from 'react';
import { submitRequest, listRequests } from '../../shared/api/client.js';

const CATEGORIES = ['Maintenance', 'Security', 'IT Support', 'Other'];

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
    <section>
      <h2>My requests</h2>
      <form onSubmit={submit}>
        <label>Title<input required maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} /></label>
        <label>Description<textarea required maxLength={2000} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} /></label>
        <label>Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
        </label>
        <button type="submit">Submit request</button>
      </form>
      {msg && <p className="ok">{msg}</p>}
      {error && <p className="error">{error}</p>}
      <button onClick={load}>Refresh</button>
      <ul className="cards">
        {requests.map((r) => (
          <li key={r.id}>
            <strong>#{r.id} — {r.title}</strong>{r.isOverdue && <span className="badge">OVERDUE</span>}
            <div>Status: {r.status}</div><div>Category: {r.category}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
