// Express application. Mounts each module's routes (modular monolith).
const express = require('express');
const { authenticate } = require('./modules/auth/authMiddleware');
const authRoutes = require('./modules/auth/authRoutes');
const requestRoutes = require('./modules/requests/requestRoutes');
const userRoutes = require('./modules/users/userRoutes');

const app = express();
app.use(express.json());

// Development CORS so the Vite dev server (5173) can call the API (4000).
// In production the frontend is served from the same origin or configured explicitly.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-user-id, x-idempotency-key');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Auth routes are public (login). Everything under /api requires authentication.
app.use('/api/auth', authRoutes);
app.use('/api', authenticate);
app.use('/api/requests', requestRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
