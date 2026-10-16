# ADR-003  Concurrency control for status changes

Status: Decided at Milestone 3. May change through controlled change.

## Context
Two staff members may act on the same request at nearly the same time. A lost update must
be prevented (ASR-3), but the workload is low-contention and must stay responsive (NFR-001).

## Decision
Use **optimistic concurrency only**. Each request row has a `version` column. A status
change is applied with `UPDATE ... WHERE id = $1 AND version = $2`; if zero rows update, the
version moved on since the client read it, so the change is rejected with 409 and the client
refetches and retries. The status and history writes share one transaction (ADR-002), but
**no pessimistic `SELECT ... FOR UPDATE` row lock is taken.**

## Alternatives
- Optimistic version check (chosen).
- Pessimistic `SELECT ... FOR UPDATE`: rejected. It serialises on a lock for a low-contention
  workload, holds a lock across the read-modify-write, and does not catch a stale client that
  loaded the request earlier.
- No concurrency control: rejected, allows lost updates.

## Consequences
Lost updates are prevented without holding a lock. A rejected update must be retried by the
client. This resolves the optimistic-versus-pessimistic inconsistency raised at Milestone 2.

## Applied in
backend/src/modules/requests/requestRepository.js (updateStatusOptimistic),
backend/src/modules/requests/requestService.js (version-guarded transaction).
