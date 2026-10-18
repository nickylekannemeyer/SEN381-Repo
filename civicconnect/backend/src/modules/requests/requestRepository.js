// Persistence for requests (PostgreSQL, parameterised SQL). Concurrency is OPTIMISTIC:
// the status update is guarded by the version (ADR-003), not a row lock.
const pool = require('../../config/db');
const SORT_COLUMNS = { created_at: 'created_at', status: 'status', id: 'id' };

async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM requests WHERE id = $1', [id]);
  return rows[0] || null;
}
// Read inside the service's transaction (no FOR UPDATE: concurrency is handled by the
// version check on UPDATE, so no pessimistic row lock is taken).
async function findByIdTx(client, id) {
  const { rows } = await client.query('SELECT * FROM requests WHERE id = $1', [id]);
  return rows[0] || null;
}
async function create({ requesterId, title, description, category, idempotencyKey }) {
  const { rows } = await pool.query(
    `INSERT INTO requests (requester_id, title, description, category, idempotency_key)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [requesterId, title, description, category, idempotencyKey || null]
  );
  return rows[0];
}
async function findByIdempotencyKey(key) {
  const { rows } = await pool.query('SELECT * FROM requests WHERE idempotency_key = $1', [key]);
  return rows[0] || null;
}
async function list({ requesterId, status, category, sort = 'created_at', order = 'desc', limit, offset } = {}) {
  const where = []; const params = [];
  if (requesterId !== undefined && requesterId !== null) { params.push(requesterId); where.push(`requester_id = $${params.length}`); }
  if (status !== undefined && status !== null && status !== '') { params.push(status); where.push(`status = $${params.length}`); }
  if (category !== undefined && category !== null && category !== '') { params.push(category); where.push(`category = $${params.length}`); }
  const col = SORT_COLUMNS[sort] || 'created_at';
  const dir = order === 'asc' ? 'ASC' : 'DESC';
  // limit/offset are already validated numbers from the service; still passed as
  // parameters (never string-concatenated) to keep the query safe.
  let sql = `SELECT * FROM requests ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY ${col} ${dir}`;
  if (limit !== undefined && limit !== null) { params.push(limit); sql += ` LIMIT $${params.length}`; }
  if (offset) { params.push(offset); sql += ` OFFSET $${params.length}`; }
  const { rows } = await pool.query(sql, params);
  return rows;
}
async function assign(id, staffId) {
  const { rows } = await pool.query(
    'UPDATE requests SET assigned_to = $1, updated_at = now() WHERE id = $2 RETURNING *', [staffId, id]);
  return rows[0] || null;
}
// Version-guarded update: zero rows means a concurrent change moved the version on.
async function updateStatusOptimistic(client, id, toStatus, expectedVersion) {
  const { rows } = await client.query(
    `UPDATE requests SET status = $1, version = version + 1, updated_at = now()
     WHERE id = $2 AND version = $3 RETURNING *`,
    [toStatus, id, expectedVersion]
  );
  return rows[0] || null;
}
module.exports = { findById, findByIdTx, create, findByIdempotencyKey, list, assign, updateStatusOptimistic };
