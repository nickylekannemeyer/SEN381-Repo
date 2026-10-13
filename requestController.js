// requestController.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { StateFactory } = require('./statePattern');

const router = express.Router();
const prisma = new PrismaClient();

router.put('/:id/status', async (req, res) => {
    const requestId = parseInt(req.params.id);
    const { newStatus, currentVersion, comment } = req.body;
    const idempotencyKey = req.headers['x-idempotency-key'];
    
    // Mock user for testing until auth module is wired
    const userId = req.user ? req.user.id : 1; 

    try {
        // 1. Check Idempotency (B7 compliance: protect against duplicate retries)
        if (idempotencyKey) {
            const existingAction = await prisma.requestHistory.findUnique({
                where: { idempotencyKey }
            });
            if (existingAction) {
                return res.status(200).json({ message: "Action already processed idempotently." });
            }
        }

        // 2. Fetch current request
        const request = await prisma.request.findUnique({
            where: { id: requestId }
        });

        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }

        // 3. Validate state transition via State Pattern
        const currentState = StateFactory(request.status, request);
        if (!currentState.transitionTo(newStatus)) {
            return res.status(400).json({ 
                error: `Invalid transition from ${request.status} to ${newStatus}` 
            });
        }

        // 4. Atomic Transaction & Optimistic Concurrency Control (FR-007)
        const [updatedRequest, historyRecord] = await prisma.$transaction([
            prisma.request.update({
                where: { 
                    id: requestId,
                    version: currentVersion // Optimistic version check
                },
                data: { 
                    status: newStatus,
                    version: { increment: 1 } 
                },
                include: { user: true }
            }),
            prisma.requestHistory.create({
                data: {
                    requestId: requestId,
                    changedById: userId,
                    oldStatus: request.status,
                    newStatus: newStatus,
                    changeComment: comment,
                    idempotencyKey: idempotencyKey
                }
            })
        ]);

        // 5. Enforce Security DTO (DA-8 compliance: never return password_hash)
        const requestDTO = {
            id: updatedRequest.id,
            title: updatedRequest.title,
            status: updatedRequest.status,
            version: updatedRequest.version,
            requester: {
                id: updatedRequest.user.id,
                email: updatedRequest.user.email,
                role: updatedRequest.user.role
                // Password hash is strictly excluded
            }
        };

        res.status(200).json({ success: true, data: requestDTO });

    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(409).json({ 
                error: "Stale write detected: The request was updated by another user or process. Please refresh." 
            });
        }
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;