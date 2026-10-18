// Authentication use cases. Verifies the bcrypt password hash (NFR-002).
const userRepository = require('../users/userRepository');
const { verifyPassword } = require('./passwords');
const { toUserView } = require('../../shared/views');

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });
  const user = await userRepository.findByEmail(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  // Identity is then carried on later requests via the x-user-id header.
  res.json(toUserView(user));
}
module.exports = { login };
