const test = require('node:test');
const assert = require('node:assert');
const Request = require('./domain/Request');

function newRequest() {
  return new Request({ id: 1, requesterId: 1, title: 't', description: 'd', category: 'c' });
}

test('a new request starts Open', () => {
  assert.strictEqual(newRequest().status, 'Open');
});

test('applyTransition applies a valid transition and returns the event', () => {
  const r = newRequest();
  const event = r.applyTransition('In Progress', 2, 'starting work');
  assert.strictEqual(r.status, 'In Progress');
  assert.strictEqual(event.fromStatus, 'Open');
  assert.strictEqual(event.toStatus, 'In Progress');
});

test('an invalid transition is rejected', () => {
  const r = newRequest();
  assert.throws(() => r.applyTransition('Resolved', 2), /Invalid transition/);
});

test('observers are notified when the service announces a committed change', () => {
  const r = newRequest();
  let seen = null;
  r.subscribe({ update: (e) => { seen = e; } });
  const event = r.applyTransition('In Progress', 2);
  r.notify(event); // the service does this only after the transaction commits
  assert.strictEqual(seen.fromStatus, 'Open');
  assert.strictEqual(seen.toStatus, 'In Progress');
});
