# Technical Debt Register

Accepted compromises, distinct from the defect register. Each is recorded honestly with an owner.

| ID | Area | Debt | Consequence | Decision / owner |
|---|---|---|---|---|
| TD-01 | Test / environment | Integration is proven against PostgreSQL in CI and locally, but not yet against a **deployed staging** database | Live hosted persistence not yet exercised end to end | Close before final / Nickyle |
| TD-02 | Code | Header-based authentication (`x-user-id`) is a documented stand-in for a signed token | Not production-grade identity | Deferred / Juan |
| TD-03 | Infrastructure | Single PostgreSQL database, no redundancy | No availability under a database failure | Accept and record / Dylan |
| TD-04 | Design | Frontend is a scaffold | No end-to-end user journey in the UI yet | Close before final / Dylan |

Note on TD-01: there is **no in-memory adapter** in the codebase. The API tests require a real
PostgreSQL connection (they skip cleanly only when `DATABASE_URL` is unset). The outstanding item
is a run against a *deployed/staging* database, not a run against real PostgreSQL, which is done
(see `test-evidence.txt` and the CI `backend-db` job).
