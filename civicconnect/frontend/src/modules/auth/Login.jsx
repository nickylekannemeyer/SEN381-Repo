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
    <section>
      <h2>Sign in</h2>
      <p>Seeded accounts (password <code>changeme</code>): requester@, staff@, manager@civicconnect.local</p>
      <form onSubmit={submit}>
        <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label>Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        <button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
      {error && <p className="error">{error}</p>}
    </section>
  );
}
