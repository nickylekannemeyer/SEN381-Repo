// Backend API client. After login the user id is sent on every call as x-user-id
// (a documented stand-in for a signed token); the server loads the role and enforces it.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
let authUserId = null;
export function setAuth(user) { authUserId = user ? user.id : null; }

async function req(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (authUserId) headers['x-user-id'] = String(authUserId);
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || body.error || `Request failed (${res.status})`);
  return body;
}

export function login(email, password) {
  return req('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}
export function submitRequest({ title, description, category }) {
  return req('/requests', { method: 'POST', body: JSON.stringify({ title, description, category }) });
}
export function listRequests(params = {}) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
  const q = new URLSearchParams(entries).toString();
  return req('/requests' + (q ? `?${q}` : ''));
}
export function assignRequest(id) { return req(`/requests/${id}/assign`, { method: 'PATCH', body: '{}' }); }
export function changeStatus(id, target, version) {
  return req(`/requests/${id}/status`, { method: 'PATCH', body: JSON.stringify({ target, version }) });
}
