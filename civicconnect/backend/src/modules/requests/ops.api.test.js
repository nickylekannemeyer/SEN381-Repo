const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../../app');
const hasDb = !!process.env.DATABASE_URL;

// Operational and robustness behaviour added for the final submission: liveness vs
// readiness health checks, a consistent JSON 404, and bounded (paginated) listing.

// These two need no database.
test('liveness /health returns ok', async () => {
  const res = await request(app).get('/health');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.status, 'ok');
});

test('an unknown route returns a JSON 404, not an HTML page', async () => {
  const res = await request(app).get('/api/does-not-exist');
  assert.strictEqual(res.status, 404);
  assert.strictEqual(res.body.error, 'NOT_FOUND');
  assert.match(res.headers['content-type'], /application\/json/);
});

test('a malformed or oversized JSON body is a 4xx client error, not a 500', async () => {
  const bad = await request(app).post('/api/auth/login').set('content-type', 'application/json').send('{"email":');
  assert.strictEqual(bad.status, 400);
  const big = await request(app).post('/api/auth/login').send({ email: 'a@b.c', password: 'x'.repeat(20000) });
  assert.strictEqual(big.status, 413);
});

test('GET /api/users/me without an identity is 401 (DEF-07)', async () => {
  const res = await request(app).get('/api/users/me');
  assert.strictEqual(res.status, 401);
});

// These exercise the database, so they are skipped without DATABASE_URL.
test('operational behaviour against a database', { skip: !hasDb }, async (t) => {
  const pool = require('../../config/db');
  const { hashPassword } = require('../auth/passwords');

  let requester;
  t.before(async () => {
    const fs = require('fs'); const path = require('path');
    await pool.query(fs.readFileSync(path.join(__dirname, '..', '..', '..', '..', 'db', 'schema.sql'), 'utf8'));
    await pool.query('DELETE FROM request_history');
    await pool.query('DELETE FROM requests');
    await pool.query('DELETE FROM users');
    const pw = await hashPassword('changeme');
    requester = (await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1,$2,$3) RETURNING id',
      ['r@ops.test', pw, 'requester'])).rows[0].id;
  });
  t.after(async () => { await pool.end(); });

  await t.test('readiness /health/ready reports ready when the database is reachable', async () => {
    const res = await request(app).get('/health/ready');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'ready');
  });

  await t.test('listing is bounded by the limit parameter (NFR-003)', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).post('/api/requests').set('x-user-id', String(requester))
        .send({ title: `req ${i}`, description: 'd', category: 'Maintenance' });
    }
    const limited = await request(app).get('/api/requests?limit=2').set('x-user-id', String(requester));
    assert.strictEqual(limited.status, 200);
    assert.strictEqual(limited.body.data.length, 2);
    // An over-large limit is capped, not honoured verbatim.
    const capped = await request(app).get('/api/requests?limit=9999').set('x-user-id', String(requester));
    assert.ok(capped.body.data.length <= 100);
    // With no limit the list is not silently truncated: every request is still returned.
    const all = await request(app).get('/api/requests').set('x-user-id', String(requester));
    assert.strictEqual(all.body.data.length, 5);
  });
});
