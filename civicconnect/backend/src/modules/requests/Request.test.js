const test = require('node:test');
const assert = require('node:assert');
const Request = require('./domain/Request');
const { stateFor } = require('./domain/states/stateFactory');

function newRequest(status) {
  return new Request({ id: 1, requesterId: 1, title: 't', description: 'd', category: 'c', status });
}

test('a new request starts Open', () => { assert.strictEqual(newRequest().status, 'Open'); });

test('applyTransition applies a valid transition and returns the event', () => {
  const r = newRequest();
  const event = r.applyTransition('In Progress', 2, 'starting work');
  assert.strictEqual(r.status, 'In Progress');
  assert.strictEqual(event.fromStatus, 'Open');
  assert.strictEqual(event.toStatus, 'In Progress');
});

test('Open may go to In Progress or Closed only', () => {
  assert.ok(stateFor('Open').canTransitionTo('In Progress'));
  assert.ok(stateFor('Open').canTransitionTo('Closed'));
  assert.ok(!stateFor('Open').canTransitionTo('Resolved'));
});
test('In Progress may go to Resolved or back to Open', () => {
  assert.ok(stateFor('In Progress').canTransitionTo('Resolved'));
  assert.ok(stateFor('In Progress').canTransitionTo('Open'));
});
test('Resolved may go to Closed or reopen to In Progress', () => {
  assert.ok(stateFor('Resolved').canTransitionTo('Closed'));
  assert.ok(stateFor('Resolved').canTransitionTo('In Progress'));
});
test('Closed is terminal', () => { assert.strictEqual(stateFor('Closed').allowedTransitions().length, 0); });

test('an invalid transition is rejected', () => {
  assert.throws(() => newRequest().applyTransition('Resolved', 2), /Invalid transition/);
});

test('observers are notified when the service announces a committed change', () => {
  const r = newRequest();
  let seen = null;
  r.subscribe({ update: (e) => { seen = e; } });
  const event = r.applyTransition('In Progress', 2);
  r.notify(event);
  assert.strictEqual(seen.toStatus, 'In Progress');
});

test('a failing observer does not break notify (non-critical, ASR-4)', () => {
  const r = newRequest();
  r.subscribe({ update: () => { throw new Error('boom'); } });
  let okSeen = false;
  r.subscribe({ update: () => { okSeen = true; } });
  assert.doesNotThrow(() => r.notify(r.applyTransition('In Progress', 2)));
  assert.ok(okSeen);
});
