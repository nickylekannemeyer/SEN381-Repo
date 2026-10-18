// Persistence for users.
const pool = require('../../config/db');
async function findById(id) {
  const { rows } = await pool.query('SELECT id, email, role, created_at FROM users WHERE id = $1', [id]);
  return rows[0] || null;
}
async function findByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0] || null;
}
module.exports = { findById, findByEmail };
