// Request use cases. The status change and its audit record are written in one
// transaction (FR-007, ASR-3) with an optimistic version check (ADR-003). Non-critical
// observers are notified only after the transaction commits (ADR-002).
const pool = require('../../config/db');
const Request = require('./domain/Request');
const FeedbackObserver = require('./domain/observers/FeedbackObserver');
const requestRepository = require('./requestRepository');
const historyRepository = require('./historyRepository');
const { toRequestView } = require('../../shared/views');
const AppError = require('../../shared/AppError');

const VALID_SORT = ['created_at', 'status', 'id'];

async function submitRequest({ requesterId, title, description, category, idempotencyKey }) {
  if (!title || String(title).trim() === '') throw new AppError('VALIDATION', 'title is required', 400);
  if (String(title).length > 200) throw new AppError('VALIDATION', 'title must be at most 200 characters', 400);
  if (!description || String(description).trim() === '') throw new AppError('VALIDATION', 'description is required', 400);
  if (String(description).length > 2000) throw new AppError('VALIDATION', 'description must be at most 2000 characters', 400);
  if (!category || String(category).trim() === '') throw new AppError('VALIDATION', 'category is required', 400);
  if (idempotencyKey) {
    const existing = await requestRepository.findByIdempotencyKey(idempotencyKey);
    if (existing) return { idempotent: true, request: toRequestView(existing) };
  }
  const row = await requestRepository.create({
    requesterId, title: String(title).trim(), description: String(description).trim(),
    category: String(category).trim(), idempotencyKey
  });
  return { idempotent: false, request: toRequestView(row) };
}

async function getRequest(id) {
  const row = await requestRepository.findById(id);
  if (!row) throw new AppError('NOT_FOUND', 'request not found', 404);
  return toRequestView(row);
}

async function listRequests({ requesterId, status, category, sort, order } = {}) {
  const safeSort = VALID_SORT.includes(sort) ? sort : 'created_at';
  const safeOrder = order === 'asc' ? 'asc' : 'desc';
  const rows = await requestRepository.list({ requesterId, status, category, sort: safeSort, order: safeOrder });
  return rows.map(toRequestView);
}

async function assignRequest(id, staffId) {
  const row = await requestRepository.assign(id, staffId);
  if (!row) throw new AppError('NOT_FOUND', 'request not found', 404);
  return toRequestView(row);
}

async function changeRequestStatus(requestId, target, changedBy, note, expectedVersion, idempotencyKey) {
  if (idempotencyKey) {
    const seen = await historyRepository.findByIdempotencyKey(idempotencyKey);
    if (seen) { const cur = await requestRepository.findById(requestId); return cur ? toRequestView(cur) : null; }
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const row = await requestRepository.findByIdTx(client, requestId);
    if (!row) throw new AppError('NOT_FOUND', 'request not found', 404);

    const request = new Request({
      id: row.id, requesterId: row.requester_id, title: row.title, description: row.description,
      category: row.category, status: row.status, assignedTo: row.assigned_to, version: row.version
    });
    const event = request.applyTransition(target, changedBy, note); // throws on invalid (400 below)
    event.idempotencyKey = idempotencyKey;

    // Optimistic guard: use the version the client last saw, so a change made on stale
    // data is rejected and the client must refetch and retry (ADR-003). No row lock.
    const guardVersion = (expectedVersion === undefined || expectedVersion === null) ? row.version : expectedVersion;
    const updated = await requestRepository.updateStatusOptimistic(client, requestId, event.toStatus, guardVersion);
    if (!updated) throw new AppError('CONCURRENCY', 'stale version, refresh and retry', 409);
    await historyRepository.record(client, event);

    await client.query('COMMIT');

    // Non-critical reactions, only after commit (ADR-002).
    request.subscribe(new FeedbackObserver());
    request.notify(event);

    return toRequestView(updated);
  } catch (err) {
    await client.query('ROLLBACK');
    if (err instanceof AppError) throw err;
    if (/Invalid transition/.test(err.message)) throw new AppError('INVALID_TRANSITION', err.message, 400);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { submitRequest, getRequest, listRequests, assignRequest, changeRequestStatus };
