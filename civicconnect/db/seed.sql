-- Minimal seed data for local development.
-- Passwords are placeholders. Replace with properly hashed values (NFR-002).
INSERT INTO users (email, password_hash, role) VALUES
  ('requester@example.com', 'TODO_HASH', 'requester'),
  ('staff@example.com',     'TODO_HASH', 'staff'),
  ('manager@example.com',   'TODO_HASH', 'management')
ON CONFLICT (email) DO NOTHING;
