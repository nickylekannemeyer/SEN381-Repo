// app.js
const express = require('express');
const requestRoutes = require('./requestController');

const app = express();
app.use(express.json());

// Mount the requests route
app.use('/api/requests', requestRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});