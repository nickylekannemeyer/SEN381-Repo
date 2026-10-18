# Release Readiness and Residual Risk

## Final go-live decision (Milestone 4)

**Decision: NO-GO to real production. Deploy as a credible SIMULATED PRODUCTION environment.**

| Field | Detail |
|---|---|
| Deployment state | Simulated production: a production-like single Node/Express process against PostgreSQL 16, built, seeded and tested on every push/PR in CI, released under tag `v4.0.0`. Not deployed to real production. |
| Blocking concern | Authentication is a header-based stand-in (`x-user-id`), not a signed token (TD-02), so identity is not production-grade. |
| Affected requirement | NFR-002 (security and privacy of request data). |
| Consequence | Releasing to real production would let identity be asserted without a verified credential — an unjustified security risk. |
| What must change before go-live | Replace the header stand-in with signed-token authentication; demonstrate a backup-and-restore cycle (TD-03, NFR-004); stand up and record a deployed staging run (TD-01). |

This is an evidence-based no-go, not a failure: the core product is built and verified, and the
team declines a real-production release until the named items are closed. See PED Section 7.2.

---

## Construction-time readiness (Milestone 3)

**Classification at construction: CONDITIONALLY READY.**

The core behaviour is built and verified: login, submit, list, view, assign and a controlled,
audited status change, all tested, with the full API suite passing against PostgreSQL 16 locally
and in CI (see `test-evidence.txt`).

The conditions that remain before a production claim:

| Residual risk | Reason | Response |
|---|---|---|
| Single PostgreSQL database is a single point of failure | No redundancy in the chosen design (TD-03) | Accepted for this stage; recovery via a tested backup |
| Free-tier hosting limits and cold starts | The free tier sleeps and caps resources | Validate against the responsiveness target; keep-alive or paid tier (RISK-018) |
| No deployed staging run yet | Integration is proven in CI, not on a hosted staging database (TD-01) | Stand up staging and record a run before final |
| Frontend wiring | Earlier the UI was a static scaffold (TD-04) | Addressed before final: `App.jsx` now mounts login and the role-based views (requester/staff/management), which call the backend through the API client for the real submit/list/assign/status journeys |

A justified "conditionally ready" is the correct engineering call: the evidence does not yet support
a production-ready claim, and the outstanding items are refinement, not open design questions.
