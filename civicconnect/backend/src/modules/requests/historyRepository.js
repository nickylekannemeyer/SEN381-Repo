// Persistence for the request history and audit trail (FR-007), written in the same
// transaction as the status update (ASR-3). The transaction client is passed in.
async function record(client, event) {
  await client.query(
    `INSERT INTO request_history (request_id, from_status, to_status, changed_by, note, idempotency_key)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [event.requestId, event.fromStatus, event.toStatus, event.changedBy, event.note, event.idempotencyKey || null]
  );
}
const pool = require('../../config/db');
async function findByIdempotencyKey(key) {
  const { rows } = await pool.query('SELECT * FROM request_history WHERE idempotency_key = $1', [key]);
  return rows[0] || null;
}
module.exports = { record, findByIdempotencyKey };
