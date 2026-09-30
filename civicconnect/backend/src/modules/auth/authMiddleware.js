// Authentication and role-based authorization (ASR-1, NFR-002).
// Authorization is enforced server-side. UI restrictions never replace this.

function authenticate(req, res, next) {
  // TODO: verify a real session or token and set req.user = { id, role }.
  // Dev shortcut so the authorization layer can be exercised before auth is built.
  const role = req.header('x-dev-role');
  const id = req.header('x-dev-user-id');
  if (role && id) {
    req.user = { id: Number(id), role };
  }
  next();
}

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Not authorised for this action' });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
