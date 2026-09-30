// Express application. Mounts each module's routes (modular monolith).
const express = require('express');
const { authenticate } = require('./modules/auth/authMiddleware');
const authRoutes = require('./modules/auth/authRoutes');
const requestRoutes = require('./modules/requests/requestRoutes');
const userRoutes = require('./modules/users/userRoutes');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Auth routes are public (login). Everything under /api requires authentication.
app.use('/api/auth', authRoutes);
app.use('/api', authenticate);
app.use('/api/requests', requestRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
