const express = require('express');
const { authorize } = require('../auth/authMiddleware');
const service = require('./userService');
const router = express.Router();
router.get('/me', authorize(), async (req, res) => {
  try { res.json(await service.getProfile(req.user.id)); }
  catch (err) { res.status(400).json({ error: err.message }); }
});
module.exports = router;
