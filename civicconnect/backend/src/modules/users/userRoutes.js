const express = require('express');
const service = require('./userService');

const router = express.Router();

// The signed-in user's own profile.
router.get('/me', async (req, res) => {
  try {
    const profile = await service.getProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
