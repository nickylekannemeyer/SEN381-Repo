const express = require('express');
const { authorize } = require('../auth/authMiddleware');
const roles = require('../auth/roles');
const controller = require('./requestController');

const router = express.Router();

// Only staff may move a request through its status transitions (ASR-1, FR-007).
router.patch('/:id/status', authorize(roles.STAFF), controller.changeStatus);

// TODO: create a request (requester), list requests (all roles, scoped to permission),
// assign a request (staff), management reporting.

module.exports = router;
