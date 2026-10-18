# ADR-002  Recording and reacting to request changes

Status: Decided at Milestone 2, refined during Milestone 2. May change through controlled change.

## Context
When a request changes status, two different kinds of thing must happen. First, the change
must be recorded with who changed it and when (FR-007), and the persistence research
(Assignment 2 Task 2) requires the status update and that record to be atomic. Second,
there are reactions that are useful but not required for correctness, such as requester
feedback now and email or SMS notifications later.

An earlier version of this decision made the history and audit recorder an Observer.
That was rejected because an Observer failure is deliberately tolerated, which would let a
status change succeed with no history record and break FR-007.

## Decision
Treat the two kinds of thing differently.
- The status update and the history and audit record are written together in one database
  transaction, so they either both succeed or both fail (FR-007, ASR-3). The audit record
  is an invariant of the change, not a reaction to it.
- The Observer pattern is used for the non-critical reactions that follow a committed
  change: requester feedback now, and deferred notifications later. Observers are notified
  only after the transaction commits.

## Alternatives
- The split above (chosen).
- History as an Observer: rejected, a tolerated Observer failure would break FR-007.
- Mediator: centralises interaction but adds a heavier coordinating component than needed.
- Direct method calls for every reaction: simplest but couples the core operation to each.

## Consequences
History is guaranteed and atomic. Non-critical reactions are decoupled and extensible
(ASR-5), and because they run after commit a failed reaction never undoes a committed
change and never fires for a rolled-back one (ASR-4). The trade-off is that the service
coordinates the transaction and the post-commit notification.

## Applied in
backend/src/modules/requests/requestService.js (transaction and post-commit notify),
backend/src/modules/requests/domain/Request.js (applyTransition returns the event without
notifying), backend/src/modules/requests/domain/observers/ (Subject, Observer,
FeedbackObserver).
Informed by Assignment 2 Task 1 design problem 2 and Assignment 2 Task 2 persistence.
