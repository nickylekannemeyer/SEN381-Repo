// Express application. Mounts each module's routes (modular monolith).
const express = require('express');
const pool = require('./config/db');
const { authenticate } = require('./modules/auth/authMiddleware');
const authRoutes = require('./modules/auth/authRoutes');
const requestRoutes = require('./modules/requests/requestRoutes');
const userRoutes = require('./modules/users/userRoutes');

const app = express();
// Explicit body-size limit: the API only accepts small JSON documents, so a tight
// cap rejects oversized payloads early (NFR-002, defence in depth).
app.use(express.json({ limit: '16kb' }));

// Development CORS so the Vite dev server (5173) can call the API (4000).
// In production the frontend is served from the same origin or configured explicitly.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-user-id, x-idempotency-key');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Liveness: the process is up. Cheap, no dependencies.
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Readiness: the process can actually serve traffic, i.e. the database is reachable.
// A platform (or load balancer) uses this to decide whether to route requests here,
// so it must fail (503) when PostgreSQL is down rather than reporting a false "ok"
// (Section 6.13 Operational Readiness, NFR-004).
app.get('/health/ready', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ready' });
  } catch {
    res.status(503).json({ status: 'unavailable', error: 'database_unreachable' });
  }
});

// Auth routes are public (login). Everything under /api requires authentication.
app.use('/api/auth', authRoutes);
app.use('/api', authenticate);
app.use('/api/requests', requestRoutes);
app.use('/api/users', userRoutes);

// Unknown route -> consistent JSON 404 (not Express' default HTML page), so every
// API client gets the same error shape (Section 5.7.4 Validation and Failure Handling).
app.use((req, res) => {
  res.status(404).json({ error: 'NOT_FOUND', message: `no route for ${req.method} ${req.path}` });
});

// Final safety net: any error forwarded with next(err) - including an async failure in
// middleware such as a database outage during authentication - becomes one JSON error
// instead of a hung request or a leaked stack trace. Client errors keep their message;
// 5xx errors are logged and return a generic message.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // httpStatus comes from our AppError. status comes from Express body parsing, so a
  // malformed or oversized JSON body is reported as a 4xx client error, not a 500.
  const status = err.httpStatus || err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: status >= 500 ? 'INTERNAL' : (err.code || 'BAD_REQUEST'),
    message: status >= 500 ? 'internal server error' : err.message
  });
});

module.exports = app;
