# Defect Register

Defects are faults found during construction and verification, distinct from the technical-debt
register (accepted compromises). Each was found by a specific test and is now covered by it.
Evidence paths are the real, co-located test files.

| ID | Defect found during construction | Severity | Found by | Disposition | Evidence |
|---|---|---|---|---|---|
| DEF-01 | An invalid lifecycle transition (e.g. Open -> Resolved) was accepted | High | State-transition unit test | Fixed: `applyTransition` rejects it; invalid moves throw | `src/modules/requests/Request.test.js` |
| DEF-02 | A response serialised the persistence row, exposing `password_hash` | High | DTO/view behaviour | Fixed: `shared/views.js` returns view objects without the hash | `src/modules/requests/requests.api.test.js` (login) |
| DEF-03 | A stale-version update was applied, allowing a lost update | High | API integration, negative | Fixed: optimistic version check rejects it with 409 | `src/modules/requests/requests.api.test.js` |
| DEF-04 | Status could be written before history, risking a status with no audit record | High | API integration | Fixed: one transaction commits status and history together | `src/modules/requests/requests.api.test.js` |
| DEF-05 | An unauthorised role could change status | High | Decision-table unit test | Fixed: server-side `authorize(...)` in `authMiddleware.js` + per-route roles | `src/modules/auth/authMiddleware.test.js` |
| DEF-06 | A malformed or oversized request body returned 500 instead of a 4xx client error | Medium | API, negative test | Fixed: central error handler maps body-parser errors to 400 (parse) and 413 (too large) | `src/modules/requests/ops.api.test.js` |
| DEF-07 | An unauthenticated `GET /api/users/me` returned 400 instead of 401 | Medium | API, negative test | Fixed: `authorize()` guard on the `/me` route returns 401 without a valid identity | `src/modules/users/userRoutes.js`; `ops.api.test.js` |

No defects are open. Faults reachable only against a deployed staging database or in the frontend
journey are tracked as technical debt (TD-01, TD-04) until that environment exists.
