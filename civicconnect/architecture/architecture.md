# CivicConnect Architecture

## Style: Modular Monolith with layered modules
CivicConnect is one deployable application. Inside it, the code is divided into
feature modules (requests, users, auth). Each module is internally layered:

    routes -> controller -> service -> domain / repository

- routes:        HTTP endpoints, wired with role-based authorization.
- controller:    translates HTTP to service calls.
- service:       orchestrates a use case, for example a controlled status change.
- domain:        the entities and their behaviour (states, observers).
- repository:    persistence, one place that owns atomic database operations.

Cross-cutting concerns (database configuration, shared helpers) live outside the
modules in config/ and shared/.

## Why this style
A three-person team on a fixed schedule (CON-001, CON-002) benefits from a single
deployable that is simple to run, back up and recover (ASR-6). Splitting by feature
keeps the modules low-coupled and lets the team work in parallel, and it leaves room
to grow (for example a future notifications module) without a rewrite (ASR-5).

## Request lifecycle (ADR-001, State pattern)
Open -> In Progress -> Resolved -> Closed
- Open: to In Progress or Closed.
- In Progress: to Resolved or back to Open.
- Resolved: to Closed or back to In Progress.
- Closed: terminal.
Each state owns its allowed transitions, so a new state is added as a new class.

## Recording and reacting to changes (ADR-002)
The audit record required by FR-007 is an invariant of a status change, not a reaction to
it, so the status update and the request_history insert are written together in one
database transaction. They either both succeed or both fail (ASR-3), which guarantees
FR-007. The Observer pattern is used only for non-critical reactions that follow a
committed change, namely requester feedback now and deferred notifications later.
Observers are notified after the transaction commits, so a failed reaction never undoes a
committed change and never fires for a rolled-back one.

## Role-based access (ASR-1, NFR-002)
Authorization is enforced server-side in the auth module, not in the user interface.
Roles: requester, staff, management.
