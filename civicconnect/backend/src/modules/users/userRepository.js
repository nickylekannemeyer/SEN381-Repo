// Persistence for users.
const pool = require('../../config/db');

async function findById(id) {
  // const { rows } = await pool.query('SELECT id, email, role FROM users WHERE id = $1', [id]);
  // return rows[0] || null;
  throw new Error('findById not implemented');
}

module.exports = { findById };
