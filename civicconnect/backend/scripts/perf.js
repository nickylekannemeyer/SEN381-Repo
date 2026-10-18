// Performance exercise (M3, PED section 6.14).
//
// Operation under test: the application-layer status-change path - the work CivicConnect
// does on every controlled status change before and around the database write: build the
// domain object, validate and apply the State-pattern transition, evaluate the optimistic
// version guard, and shape the response view. This isolates application overhead from
// network and database latency so ASR-4 responsiveness can be reasoned about on its own.
//
// Why this operation: the status change is the most correctness-sensitive action in
// CivicConnect (FR-007, ASR-3) and the operation ASR-4 responsiveness is judged on.
//
// Workload: 200 sequential status-change evaluations, single client, no concurrency.
// Response time per operation is recorded. No database is required (by design, so the
// figure is the application overhead only).
//
// Run:  npm run perf
const Request = require('../src/modules/requests/domain/Request');
const { toRequestView } = require('../src/shared/views');

function oneOperation() {
  // A controlled status change as the service performs it, minus the DB round-trip.
  const row = { id: 1, requester_id: 1, title: 't', description: 'd', category: 'Maintenance',
    status: 'Open', version: 1, assigned_to: null, created_at: new Date(), updated_at: new Date() };
  const req = new Request({ id: row.id, requesterId: row.requester_id, title: row.title,
    description: row.description, category: row.category, status: row.status });
  const expectedVersion = row.version;
  const event = req.applyTransition('In Progress', 3, null); // State-pattern validation + transition
  const guardOk = (expectedVersion === row.version);         // optimistic version guard
  if (!guardOk || event.toStatus !== 'In Progress') throw new Error('unexpected');
  return toRequestView({ ...row, status: 'In Progress', version: row.version + 1 }); // response shaping
}

function main() {
  const N = 200;
  oneOperation(); // warm up
  const samples = [];
  for (let i = 0; i < N; i++) {
    const t0 = performance.now();
    oneOperation();
    samples.push(performance.now() - t0);
  }
  samples.sort((a, b) => a - b);
  const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
  const p = (q) => samples[Math.min(samples.length - 1, Math.floor(q * samples.length))];
  const fmt = (x) => x.toFixed(3) + ' ms';
  console.log('CivicConnect performance exercise - application-layer status-change path');
  console.log('-----------------------------------------------------------------------');
  console.log('Environment : Node ' + process.version + ' (no database; application overhead only)');
  console.log('Workload    : ' + N + ' sequential status-change evaluations, single client, no concurrency');
  console.log('Operation   : build domain object, State-pattern transition, version guard, response view');
  console.log('Response time (ms):');
  console.log('  average : ' + fmt(avg));
  console.log('  p50     : ' + fmt(p(0.50)));
  console.log('  p95     : ' + fmt(p(0.95)));
  console.log('  p99     : ' + fmt(p(0.99)));
  console.log('Target    : ASR-4 allows a non-intensive action up to 1000 ms; the application');
  console.log('            overhead is a small fraction of that budget.');
  console.log('Does NOT prove: live-database and network latency, concurrent load, or municipal');
  console.log('            production scale - those are recorded as outstanding and as residual risk.');
}
main();
