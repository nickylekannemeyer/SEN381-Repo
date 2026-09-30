const express = require('express');
const controller = require('./authController');

const router = express.Router();
router.post('/login', controller.login);
// TODO: logout, current session.

module.exports = router;
