# CivicConnect - Working Documentation (Markdown)

This folder mirrors the Milestone 3 engineering artefacts in Markdown in the repository,
alongside the architecture decision records in `../architecture/`. The formal submission
copy is the Project Engineering Document (PED v3.0). Where a number or file path differs,
**the code and these files are the source of truth.**

| File | What it holds |
|---|---|
| `test-evidence.txt` | Real `node --test` output: 24/24 against PostgreSQL 16 (and the no-DB run). |
| `requirements-traceability-matrix.md` | Each requirement -> code -> test. |
| `defect-register.md` | Defects found during construction (DEF-01..05), each tied to the test that caught it. |
| `technical-debt-register.md` | Accepted compromises (TD-01..04), distinct from defects. |
| `risk-register.md` | Active risks with response, owner and status (RISK-017..019). |
| `change-requests.md` | Controlled changes with impact analysis (CR-001, CR-002). |
| `security-review.md` | Trust boundaries, threats, mitigations, residual risk. |
| `release-readiness.md` | Release classification and residual risks. |
| `decision-matrices.md` | The eight scored decision matrices (DM-1..DM-8). |

Architecture decision records: `../architecture/decisions/ADR-001`, `ADR-002`, `ADR-003`.
