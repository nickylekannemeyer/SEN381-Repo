import { useState } from 'react';
import { setAuth } from './shared/api/client.js';
import Login from './modules/auth/Login.jsx';
import RequesterRequests from './modules/requests/RequesterRequests.jsx';
import StaffRequests from './modules/requests/StaffRequests.jsx';
import ManagementReports from './modules/requests/ManagementReports.jsx';
import './styles/style.css';

// Each role sees the view that matches its capabilities (FR-010). The real journeys
// (submit, list, assign, controlled status change) all call the backend through the
// shared API client, so this is the live product, not a static mockup.
const ROLE_VIEW = {
  requester: RequesterRequests,
  staff: StaffRequests,
  management: ManagementReports,
};

export default function App() {
  const [user, setUser] = useState(null);

  // On login the backend returns { id, email, role }. setAuth() makes every later
  // API call send x-user-id, and the server loads the role and enforces it server-side.
  const handleLogin = (u) => { setAuth(u); setUser(u); };
  const handleLogout = () => { setAuth(null); setUser(null); };

  if (!user) return <Login onLogin={handleLogin} />;

  const View = ROLE_VIEW[user.role] || (() => <p className="error">Unknown role: {user.role}</p>);

  return (
    <div className="app-container">
      <header className="top-header">
        <div className="logo"><h2>CivicConnect</h2></div>
        <div className="header-right">
          <span>{user.email} — <strong>{user.role}</strong></span>
          <button onClick={handleLogout}>Sign out</button>
        </div>
      </header>
      <main className="main-content">
        <View />
      </main>
    </div>
  );
}
