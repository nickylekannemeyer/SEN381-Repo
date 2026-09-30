// Orchestrates the controlled status change use case.
// The status update and its audit record are written in one transaction (FR-007, ASR-3).
// Non-critical observers are notified only after the transaction commits (ADR-002).
const pool = require('../../config/db');
const Request = require('./domain/Request');
const FeedbackObserver = require('./domain/observers/FeedbackObserver');
const requestRepository = require('./requestRepository');
const historyRepository = require('./historyRepository');

async function changeRequestStatus(requestId, target, changedBy, note) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const row = await requestRepository.findByIdForUpdate(client, requestId);
    if (!row) {
      throw new Error('Request not found');
    }

    const request = new Request({
      id: row.id,
      requesterId: row.requester_id,
      title: row.title,
      description: row.description,
      category: row.category,
      status: row.status,
      assignedTo: row.assigned_to,
    });

    // Validate and apply the transition using the State pattern (ADR-001).
    const event = request.applyTransition(target, changedBy, note);

    // Critical writes, same transaction: the status change and its audit record
    // either both succeed or both fail (FR-007, ASR-3).
    await requestRepository.updateStatus(client, requestId, event.toStatus);
    await historyRepository.record(client, event);

    await client.query('COMMIT');

    // Non-critical reactions run only after the change has committed (ADR-002).
    // A failure here is logged inside notify() and does not undo the committed change.
    request.subscribe(new FeedbackObserver());
    request.notify(event);

    return { id: request.id, status: request.status };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { changeRequestStatus };
