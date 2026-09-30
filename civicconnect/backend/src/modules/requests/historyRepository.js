// Persistence for the request history and audit trail (FR-007).
// The record is written inside the same transaction as the status update, so the two are
// atomic (ASR-3). The transaction client is passed in by the service.

async function record(client, event) {
  await client.query(
    'INSERT INTO request_history (request_id, from_status, to_status, changed_by, note) VALUES ($1, $2, $3, $4, $5)',
    [event.requestId, event.fromStatus, event.toStatus, event.changedBy, event.note]
  );
}

module.exports = { record };
