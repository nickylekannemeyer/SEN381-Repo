const test = require('node:test');
const assert = require('node:assert');
const hasDb = !!process.env.DATABASE_URL;

// These tests exercise the full HTTP + service + PostgreSQL stack, so they need a
// database. Without DATABASE_URL they are skipped, keeping `npm test` runnable anywhere.
test('request API (requires a database)', { skip: !hasDb }, async (t) => {
  const request = require('supertest');
  const app = require('../../app');
  const pool = require('../../config/db');
  const { hashPassword } = require('../auth/passwords');

  let requester, staff, manager;
  t.before(async () => {
    const fs = require('fs'); const path = require('path');
    await pool.query(fs.readFileSync(path.join(__dirname, '..', '..', '..', '..', 'db', 'schema.sql'), 'utf8'));
    await pool.query('DELETE FROM request_history');
    await pool.query('DELETE FROM requests');
    await pool.query('DELETE FROM users');
    const pw = await hashPassword('changeme');
    const ins = async (e, r) => (await pool.query('INSERT INTO users (email, password_hash, role) VALUES ($1,$2,$3) RETURNING id', [e, pw, r])).rows[0].id;
    requester = await ins('r@x.test', 'requester');
    staff = await ins('s@x.test', 'staff');
    manager = await ins('m@x.test', 'management');
  });
  t.after(async () => { await pool.end(); });

  await t.test('login verifies the password', async () => {
    const ok = await request(app).post('/api/auth/login').send({ email: 'r@x.test', password: 'changeme' });
    assert.strictEqual(ok.status, 200);
    assert.strictEqual(ok.body.role, 'requester');
    const bad = await request(app).post('/api/auth/login').send({ email: 'r@x.test', password: 'wrong' });
    assert.strictEqual(bad.status, 401);
  });

  let reqId, reqVersion;
  await t.test('a requester submits a request (FR-001)', async () => {
    const res = await request(app).post('/api/requests').set('x-user-id', String(requester))
      .send({ title: 'Broken light', description: 'dark corner', category: 'Maintenance' });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.data.status, 'Open');
    reqId = res.body.data.id; reqVersion = res.body.data.version;
  });

  await t.test('an unauthenticated submit is rejected (401)', async () => {
    assert.strictEqual((await request(app).post('/api/requests').send({ title: 'x', description: 'y', category: 'z' })).status, 401);
  });

  await t.test('invalid input is rejected (400)', async () => {
    const res = await request(app).post('/api/requests').set('x-user-id', String(requester)).send({ description: 'd', category: 'c' });
    assert.strictEqual(res.status, 400);
  });

  await t.test('a requester may not change status (403, FR-010)', async () => {
    const res = await request(app).patch(`/api/requests/${reqId}/status`).set('x-user-id', String(requester)).send({ target: 'In Progress' });
    assert.strictEqual(res.status, 403);
  });

  await t.test('staff changes status; history recorded; version increments (FR-007, ASR-3)', async () => {
    const res = await request(app).patch(`/api/requests/${reqId}/status`).set('x-user-id', String(staff)).send({ target: 'In Progress', version: reqVersion });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.status, 'In Progress');
    assert.strictEqual(res.body.data.version, reqVersion + 1);
    const h = await pool.query('SELECT * FROM request_history WHERE request_id = $1', [reqId]);
    assert.strictEqual(h.rows.length, 1);
  });

  await t.test('an invalid transition is rejected (400)', async () => {
    // The request is In Progress (version reqVersion+1). In Progress -> Closed is not
    // allowed; validation runs before the version check, so this is 400, not 409.
    const bad = await request(app).patch(`/api/requests/${reqId}/status`).set('x-user-id', String(staff)).send({ target: 'Closed', version: reqVersion + 1 });
    assert.strictEqual(bad.status, 400);
  });

  await t.test('a stale version is rejected (409, optimistic concurrency, ADR-003)', async () => {
    // In Progress -> Resolved is valid, but version 1 is stale (current is reqVersion+1).
    const res = await request(app).patch(`/api/requests/${reqId}/status`).set('x-user-id', String(staff)).send({ target: 'Resolved', version: 1 });
    assert.strictEqual(res.status, 409);
  });

  await t.test('staff can assign, filter and management can view (brief capabilities)', async () => {
    const asg = await request(app).patch(`/api/requests/${reqId}/assign`).set('x-user-id', String(staff)).send({});
    assert.strictEqual(asg.body.data.assignedTo, staff);
    const filtered = await request(app).get('/api/requests?status=Open').set('x-user-id', String(manager));
    assert.ok(Array.isArray(filtered.body.data));
  });

  await t.test('idempotent submit does not create two requests', async () => {
    const body = { title: 'dup', description: 'd', category: 'Other' };
    const a = await request(app).post('/api/requests').set('x-user-id', String(requester)).set('x-idempotency-key', 'S1').send(body);
    const b = await request(app).post('/api/requests').set('x-user-id', String(requester)).set('x-idempotency-key', 'S1').send(body);
    assert.strictEqual(a.status, 201);
    assert.strictEqual(b.status, 200);
    assert.strictEqual(b.body.idempotent, true);
  });
});
