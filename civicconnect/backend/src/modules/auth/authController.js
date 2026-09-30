// Authentication use cases (stub).
async function login(req, res) {
  // TODO: verify email and password against users.password_hash, then issue a session or token.
  res.status(501).json({ error: 'login not implemented' });
}

module.exports = { login };
