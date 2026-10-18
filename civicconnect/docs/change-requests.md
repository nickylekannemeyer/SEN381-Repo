# Change Requests and Impact Analysis

The corrections made after Milestone 2 were handled as controlled changes with impact analysis.

## CR-001 - Transactional history and Observer scope
- Requested by: team, from construction evidence. Raised for lecturer approval.
- Date: October 2026
- Requested change: make the status and history write transactional; restrict the Observer pattern to non-critical reactions after commit.
- Reason / value: guarantee the FR-007 audit record; remove the risk of a status change with no history.
- Requirements affected: FR-007, ASR-3.
- Architecture / design affected: ADR-002, the service transaction boundary, Observer scope.
- UI / API / data: no API contract change; a history row is always written with the status.
- Quality / testing: new integration tests for the atomic write and stale-version rejection.
- Risk impact: reduces RISK-017.
- Recommendation: ACCEPT. Approved by team consensus following the M2 audit-feedback reconciliation.

## CR-002 - Optimistic-only concurrency
- Requested by: team, from construction evidence. Raised for lecturer approval.
- Date: October 2026
- Requested change: use the optimistic version check as the only concurrency mechanism and remove the `SELECT ... FOR UPDATE` row lock from the status-change path.
- Reason / value: resolve the optimistic-versus-pessimistic inconsistency raised at Milestone 2; fit the low-contention usage pattern; keep the design simpler and more responsive.
- Requirements affected: NFR-001 (responsiveness); update correctness.
- Architecture / design affected: Section 5.4.5, ADR-003, Figure 2.
- UI / API / data: no API change; a rejected update returns 409 and the client refetches.
- Quality / testing: stale-version negative test added.
- Risk impact: removes the design contradiction. Low residual risk.
- Recommendation: ACCEPT. Approved by team consensus following the M2 audit-feedback reconciliation.
