// Authentication and role-based authorization (ASR-1, NFR-002), enforced server-side.
// Identity is carried by the x-user-id header (a documented stand-in for a signed
// token); the role is read from the database, never trusted from the client.
const userRepository = require('../users/userRepository');

async function authenticate(req, _res, next) {
  const id = Number(req.header('x-user-id'));
  if (id) {
    const user = await userRepository.findById(id);
    if (user) req.user = { id: user.id, role: user.role, email: user.email };
  }
  next();
}

// authorize() with no roles means "any authenticated user"; with roles it also
// checks the user's role.
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Not authorised for this action' });
    }
    next();
  };
}
module.exports = { authenticate, authorize };
