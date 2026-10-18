import { useState } from 'react';
import Login from './modules/auth/Login.jsx';
import RequesterRequests from './modules/requests/RequesterRequests.jsx';
import StaffRequests from './modules/requests/StaffRequests.jsx';
import ManagementReports from './modules/requests/ManagementReports.jsx';
import { ROLES } from './shared/auth/roles.js';
import { setAuth } from './shared/api/client.js';

// Root component. The view is chosen by the signed-in user's role.
export default function App() {
  const [user, setUser] = useState(null);
  const onLogin = (u) => { setAuth(u); setUser(u); };
  const onLogout = () => { setAuth(null); setUser(null); };

  let view = null;
  if (user) {
    if (user.role === ROLES.REQUESTER) view = <RequesterRequests />;
    else if (user.role === ROLES.STAFF) view = <StaffRequests />;
    else if (user.role === ROLES.MANAGEMENT) view = <ManagementReports />;
  }

  return (
    <main>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>CivicConnect</h1>
        {user && (<span>{user.email} ({user.role}) <button onClick={onLogout}>Log out</button></span>)}
      </header>
      {!user ? <Login onLogin={onLogin} /> : view}
    </main>
  );
}
