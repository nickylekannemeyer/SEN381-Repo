# Requirements Traceability Matrix (requirement -> code -> test)

Paths are relative to `civicconnect/backend/src`. Tests are co-located with the code they cover.

| Req | Requirement | Implementation (code) | Test | Status |
|---|---|---|---|---|
| FR-001 | Submit a service request | `modules/requests/requestRoutes.js` (POST `/`), `requestService.js` (`submitRequest`, validates: title required and <=200, description required and <=2000, category required), `requestRepository.js` (`insert`) | `requests.api.test.js` -> "a requester submits a request", "invalid input is rejected (400)", "idempotent submit does not create two requests" | Verified |
| FR-007 | Controlled status change, every change recorded | `requestService.js` (`changeRequestStatus`: one transaction, `applyTransition` via State pattern, `updateStatusOptimistic`, `historyRepository.record`), `domain/states/*`, `historyRepository.js` | `Request.test.js` (state transitions, valid/invalid), `requests.api.test.js` -> "staff changes status; history recorded; version increments" | Verified |
| FR-010 | Role-based access to request data | `modules/auth/authMiddleware.js` (`authenticate`, `authorize`), per-route role declarations in `requestRoutes.js`, requester-own checks in `requestController.js` | `authMiddleware.test.js` (401/403/allow), `requests.api.test.js` -> "a requester may not change status (403)" | Verified |
| NFR-002 | Security and privacy of request data | `shared/views.js` (`toUserView`, `toRequestView`) excludes `password_hash`; server-side role checks; parameterised SQL in `requestRepository.js` | `requests.api.test.js` (login never returns a hash; 403 negative); DTO shape asserted | Verified |
| ASR-3 / ADR-003 | No lost updates under concurrency | `requestRepository.js` (`updateStatusOptimistic`: `UPDATE ... WHERE id=$1 AND version=$2`, 0 rows -> 409) | `requests.api.test.js` -> "a stale version is rejected (409)" | Verified |
| FR-001 (idempotency) | Duplicate submit does not double-create | `requestService.js` + `requests` unique `idempotency_key` | `requests.api.test.js` -> "idempotent submit does not create two requests" | Verified |

Note: input validation enforces required fields and max lengths of 200 (title) and 2000 (description);
the covering test exercises a missing required field (400). A character-boundary test at the 200/2000
limits is a candidate addition, not yet in the suite.
