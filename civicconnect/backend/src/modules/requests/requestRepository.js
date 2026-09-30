// Persistence for requests. The status change and its history write share one
// transaction (ASR-3), so these functions take the transaction client from the service.

async function findByIdForUpdate(client, id) {
  // FOR UPDATE locks the row so concurrent status changes serialise.
  const { rows } = await client.query('SELECT * FROM requests WHERE id = $1 FOR UPDATE', [id]);
  return rows[0] || null;
}

async function updateStatus(client, id, toStatus) {
  await client.query(
    'UPDATE requests SET status = $1, updated_at = now() WHERE id = $2',
    [toStatus, id]
  );
}

module.exports = { findByIdForUpdate, updateStatus };
