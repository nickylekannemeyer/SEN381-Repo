// Server entry point.
require('dotenv').config();
const app = require('./app');
const port = process.env.PORT || 4000;
if (require.main === module) {
  app.listen(port, () => console.log(`CivicConnect backend listening on port ${port}`));
}
module.exports = app;
