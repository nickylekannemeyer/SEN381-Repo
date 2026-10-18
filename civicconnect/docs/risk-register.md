# Risk Register (Milestone 3 updates)

Risks carry a response, an owner and a status, phrased cause -> consequence.

| ID | Risk | Response | Owner / status |
|---|---|---|---|
| RISK-017 | Status and history not written atomically leaves a request with no audit record | Mitigated by one transaction (CH-1); covered by an integration test | Nickyle / Mitigated |
| RISK-018 | Free-tier hosting sleeps or expires, breaching responsiveness or losing data | Validate against the responsiveness target; keep-alive or paid tier before go-live | Dylan / Open |
| RISK-019 | API returns persistence rows and leaks the password hash | Mitigated by view DTOs (CH-4); covered by a test | Juan / Mitigated |
