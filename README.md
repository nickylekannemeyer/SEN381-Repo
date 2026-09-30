# CivicConnect (SEN381)

CivicConnect is a controlled, web-based service-request platform built for the SEN381
integrated project. It replaces scattered email, phone and spreadsheet channels with a
single system where a request moves through a controlled lifecycle across three roles:
requester, staff and management.

## Team
- Nickyle Kannemeyer (601754)
- Juan Cornel Smith (601822)
- Dylan James Spurrier (602299)

## Repository layout
- Documents/     Project documents (assignments and the Project Engineering Document)
- architecture/  Architecture notes, ADRs and diagrams
- backend/       Node.js and Express API (modular monolith)
- frontend/      React (Vite) client
- db/            PostgreSQL schema and seed data

## Architecture: Modular Monolith (with layered modules)
One deployable application, split by feature (requests, users, auth). Each module is
internally layered: routes -> controller -> service -> domain -> repository. See
architecture/architecture.md for the full explanation.

Key design decisions:
- ADR-001 State pattern for the request status lifecycle.
- ADR-002 Observer pattern for non-critical reactions. The status update and its audit
  record are written together in one database transaction, so history is guaranteed and
  atomic, while observers handle the non-critical reactions after the change commits.
Role-based access is enforced server-side in the auth module.

## Stack
- Frontend: React (Vite)
- Backend: Node.js with Express
- Database: PostgreSQL
- Version control: GitHub

## Getting started
### Backend
    cd backend
    npm install
    cp .env.example .env      # fill in your database details
    npm run dev
    npm test                  # runs the request domain tests
### Frontend
    cd frontend
    npm install
    npm run dev
### Database
    psql -d civicconnect -f db/schema.sql
    psql -d civicconnect -f db/seed.sql

## Notes for the team
Files marked TODO are stubs to complete. Keep configuration and secrets in .env, never
committed. Commit in small steps so the history shows real, progressive development.
