# CivicConnect

Controlled, web-based service-request platform (SEN381). A request moves through a
controlled lifecycle — Open → In Progress → Resolved → Closed — across three roles:
requester, staff and management.

## Layout (modular monolith)
    backend/   Node.js + Express + PostgreSQL. src/modules/{auth,requests,users}, layered
               api(route/controller) → service → domain → repository, shared pool in config/db.js
    frontend/  React (Vite). src/modules/{auth,requests} + shared/{api,auth}
    db/        schema.sql (DDL) and seed.sql
    architecture/  architecture.md, ADRs (001 State, 002 Observer, 003 Concurrency), diagrams

## Key engineering decisions
- ADR-001 State pattern for the lifecycle (one class per state).
- ADR-002 Status update and audit history commit in one transaction; Observer handles only
  non-critical reactions after commit.
- ADR-003 Optimistic concurrency: a `version` column is checked on update (409 on stale).
  No pessimistic `SELECT ... FOR UPDATE`.
- Role-based access enforced server-side (authorize middleware); DTO shaping never leaks the
  password hash; submit and status change are idempotent via `x-idempotency-key`.

## Run
### Backend
    cd backend
    npm install
    npm test                      # domain + unit tests (no database needed)
    # with a database:
    export DATABASE_URL=postgresql://USER:PASS@localhost:5432/civicconnect
    npm run db:setup              # applies ../db/schema.sql
    npm run seed                  # requester/staff/manager + a sample request; password: changeme
    npm start                     # API on :4000

With DATABASE_URL set, `npm test` also runs the API/integration tests against the database.

### Frontend
    cd frontend
    npm install
    npm run dev                   # http://localhost:5173 (calls the API on :4000)

Seeded logins (password `changeme`): requester@, staff@, manager@civicconnect.local.

## CI
`.github/workflows/ci.yml`: domain/unit tests (no DB), the full suite against a PostgreSQL
service container, and a frontend build.
