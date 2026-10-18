# Release Readiness and Residual Risk

**Classification: CONDITIONALLY READY.**

The core behaviour is built and verified: login, submit, list, view, assign and a controlled,
audited status change, all tested, with the full API suite passing against PostgreSQL 16 locally
and in CI (see `test-evidence.txt`).

The conditions that remain before a production claim:

| Residual risk | Reason | Response |
|---|---|---|
| Single PostgreSQL database is a single point of failure | No redundancy in the chosen design (TD-03) | Accepted for this stage; recovery via a tested backup |
| Free-tier hosting limits and cold starts | The free tier sleeps and caps resources | Validate against the responsiveness target; keep-alive or paid tier (RISK-018) |
| No deployed staging run yet | Integration is proven in CI, not on a hosted staging database (TD-01) | Stand up staging and record a run before final |
| Frontend is a scaffold | No end-to-end UI journey yet (TD-04) | Complete the requester/staff journey before final |

A justified "conditionally ready" is the correct engineering call: the evidence does not yet support
a production-ready claim, and the outstanding items are refinement, not open design questions.
