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
const ROLE_NAV = {
  requester: { icon: 'list_alt', label: 'My Requests' },
  staff: { icon: 'engineering', label: 'Staff Workspace' },
  management: { icon: 'insights', label: 'Reports' },
};

export default function App() {
  const [user, setUser] = useState(null);

  // On login the backend returns { id, email, role }. setAuth() makes every later
  // API call send x-user-id, and the server loads the role and enforces it server-side.
  const handleLogin = (u) => { setAuth(u); setUser(u); };
  const handleLogout = () => { setAuth(null); setUser(null); };

  if (!user) return <Login onLogin={handleLogin} />;

  const View = ROLE_VIEW[user.role] || (() => <p className="error">Unknown role: {user.role}</p>);
  const nav = ROLE_NAV[user.role] || { icon: 'dashboard', label: 'Dashboard' };

  return (
    <div className="app-container">
      <aside className="sidebar glass-panel">
        <div className="logo">
          <span className="material-symbols-outlined icon-blue">location_city</span>
          <h2>CivicConnect</h2>
        </div>
        <nav className="nav-menu">
          <a className="nav-item active"><span className="material-symbols-outlined">{nav.icon}</span> {nav.label}</a>
        </nav>
      </aside>
      <main className="main-content">
        <header className="top-header glass-panel">
          <div className="header-left"><h3>City of Cape Town Portal</h3></div>
          <div className="header-right">
            <div className="user-profile">
              <div className="user-info">
                <strong>{user.email}</strong>
                <span>{user.role}</span>
              </div>
            </div>
            <button className="btn-secondary" onClick={handleLogout}>Sign out</button>
          </div>
        </header>
        <View />
      </main>
    </div>
  );
}
