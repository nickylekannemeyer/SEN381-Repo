const test = require('node:test');
const assert = require('node:assert');
const { authorize } = require('./authMiddleware');
const roles = require('./roles');

function run(mw, user) {
  let status = 200; let body = null; let nexted = false;
  const req = { user };
  const res = { status(s) { status = s; return this; }, json(b) { body = b; return this; } };
  mw(req, res, () => { nexted = true; });
  return { status, body, nexted };
}

test('unauthenticated is 401', () => { assert.strictEqual(run(authorize(), undefined).status, 401); });
test('any authenticated passes authorize()', () => { assert.ok(run(authorize(), { id: 1, role: 'requester' }).nexted); });
test('staff-only rejects a requester with 403', () => {
  assert.strictEqual(run(authorize(roles.STAFF), { id: 1, role: 'requester' }).status, 403);
});
test('staff-only allows staff', () => { assert.ok(run(authorize(roles.STAFF), { id: 3, role: 'staff' }).nexted); });
