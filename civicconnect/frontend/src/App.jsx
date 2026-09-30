import RequesterRequests from './modules/requests/RequesterRequests.jsx';

// Root component. Once authentication is added, the view is chosen by the user's role.
export default function App() {
  return (
    <main>
      <h1>CivicConnect</h1>
      <p>Controlled service-request platform.</p>
      {/* TODO: select the view (requester / staff / management) from the signed-in role. */}
      <RequesterRequests />
    </main>
  );
}
