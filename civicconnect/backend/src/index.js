// Server entry point.
require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');
const port = process.env.PORT || 4000;

if (require.main === module) {
  const server = app.listen(port, () => console.log(`CivicConnect backend listening on port ${port}`));

  // Graceful shutdown: on deploy or restart a platform (e.g. Render) sends SIGTERM.
  // Stop accepting new connections, let in-flight requests finish, then drain the
  // PostgreSQL pool so no connection is left half-open (NFR-004 availability/recovery,
  // Section 6.13 Operational Readiness). A hard timeout prevents a stuck shutdown.
  let shuttingDown = false;
  async function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`${signal} received, shutting down gracefully`);
    const forced = setTimeout(() => {
      console.error('shutdown timed out, forcing exit');
      process.exit(1);
    }, 10000);
    forced.unref();
    server.close(async () => {
      try {
        await pool.end();
      } catch (err) {
        console.error('error closing the database pool', err);
      }
      clearTimeout(forced);
      process.exit(0);
    });
  }

  ['SIGTERM', 'SIGINT'].forEach((sig) => process.on(sig, () => shutdown(sig)));
}

module.exports = app;
