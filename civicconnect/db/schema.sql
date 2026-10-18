-- CivicConnect database schema (PostgreSQL)
-- Controlled request lifecycle (ADR-001), role-based access (FR-010),
-- optimistic concurrency (version column, ADR-003) and idempotency keys.

CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,        -- never store plain text (NFR-002)
    role          VARCHAR(20)  NOT NULL CHECK (role IN ('requester','staff','management')),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS requests (
    id              SERIAL PRIMARY KEY,
    requester_id    INTEGER      NOT NULL REFERENCES users(id),
    assigned_to     INTEGER      REFERENCES users(id),
    title           VARCHAR(200) NOT NULL,
    description     TEXT         NOT NULL,
    category        VARCHAR(100) NOT NULL,
    status          VARCHAR(20)  NOT NULL DEFAULT 'Open'
                    CHECK (status IN ('Open','In Progress','Resolved','Closed')),
    version         INTEGER      NOT NULL DEFAULT 1,   -- optimistic concurrency (ADR-003)
    idempotency_key TEXT         UNIQUE,               -- de-duplicates a retried submit
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- History and audit trail, written in the same transaction as the status update (FR-007, ASR-3).
CREATE TABLE IF NOT EXISTS request_history (
    id              SERIAL PRIMARY KEY,
    request_id      INTEGER     NOT NULL REFERENCES requests(id),
    from_status     VARCHAR(20),
    to_status       VARCHAR(20) NOT NULL,
    changed_by      INTEGER     NOT NULL REFERENCES users(id),
    changed_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    note            TEXT,
    idempotency_key TEXT        UNIQUE                 -- de-duplicates a retried status change
);

CREATE INDEX IF NOT EXISTS idx_requests_requester ON requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_requests_status    ON requests(status);
CREATE INDEX IF NOT EXISTS idx_history_request    ON request_history(request_id);
