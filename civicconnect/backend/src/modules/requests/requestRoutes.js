const express = require('express');
const { authorize } = require('../auth/authMiddleware');
const roles = require('../auth/roles');
const controller = require('./requestController');

const router = express.Router();

// Create a request (any authenticated user; a requester submits their own) - FR-001.
router.post('/', authorize(), controller.create);
// List requests, scoped by role and optionally filtered/sorted.
router.get('/', authorize(), controller.list);
// View one request (a requester may view only their own) - FR-010.
router.get('/:id', authorize(), controller.getOne);
// Assign / accept responsibility (staff or management).
router.patch('/:id/assign', authorize(roles.STAFF, roles.MANAGEMENT), controller.assign);
// Controlled status change (staff only) - FR-007, ASR-1.
router.patch('/:id/status', authorize(roles.STAFF), controller.changeStatus);

module.exports = router;
