# Security and Threat Review

Security is treated as a lifecycle responsibility. The trust boundaries are the client-to-API
boundary (all input is untrusted) and the API-to-database boundary. Residual risks are recorded
rather than claiming the system is secure.

| Threat | Vector | Mitigation (implemented and tested) | Residual |
|---|---|---|---|
| Unauthorised status change | Forged client request | Server-side role check (`authorize`) in `authMiddleware.js` | Header-based auth is a stand-in (TD-02) |
| Sensitive-data exposure | Response serialises the password hash | View DTOs exclude `password_hash` (NFR-002), covered by a test | None at this layer |
| Access to another user's request | Object-reference tampering on the request id | Server-side requester-own checks in `requestController.js` | Audit logging of access is a future item |
| Secret leakage | Secrets committed to the repository | Environment-based configuration; `.env.example` holds placeholders only; `.gitignore` excludes `.env` and `node_modules` | Automated secret scanning in CI to add |
| Injection | Unsanitised input reaching the database | Parameterised queries throughout `requestRepository.js`; input validation | Dependency/vulnerability scanning to add |
| Lost update | Concurrent edits to one request | Optimistic version check, covered by a negative test | None |
