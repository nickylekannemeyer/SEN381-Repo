import { useState } from 'react';
import { login } from '../../shared/api/client.js';

// The backend verifies the bcrypt password. Seeded accounts use the password: changeme
export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setError(null); setLoading(true);
    try { onLogin(await login(email, password)); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };
  return (
    <div className="auth-wrapper">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <span className="material-symbols-outlined icon-blue" style={{ fontSize: 40 }}>location_city</span>
          <h2>CivicConnect</h2>
          <p className="subtitle">Sign in to the City of Cape Town service portal</p>
        </div>
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Email</label>
            <input className="form-control" type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="requester@civicconnect.local" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="changeme" />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}
            style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        <p className="subtitle" style={{ fontSize: 12, textAlign: 'center' }}>
          Seeded accounts (password <code>changeme</code>): requester@, staff@, manager@civicconnect.local
        </p>
      </div>
    </div>
  );
}
