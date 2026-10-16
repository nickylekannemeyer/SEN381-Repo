const express = require('express');
const service = require('./userService');
const router = express.Router();
router.get('/me', async (req, res) => {
  try { res.json(await service.getProfile(req.user.id)); }
  catch (err) { res.status(400).json({ error: err.message }); }
});
module.exports = router;
