# ADR-001  Controlled request status transitions

Status: Decided at Milestone 2. May change through controlled change.

## Context
FR-007 and ASR-2 require a request to move only through valid status transitions and
that every change is recorded. Writing the permitted transitions as conditional checks
wherever a status is changed spreads and duplicates that logic.

## Decision
Adopt the State pattern for the request lifecycle. Each status is a state that knows
which transitions are valid from it, and the request delegates a requested transition
to its current state.

## Alternatives
- State pattern (chosen).
- Strategy: configures behaviour but does not model a lifecycle of fixed states as naturally.
- Enumerated transition table with a guard: simpler but data-centred, a reasonable fallback
  if the set of states stays small and stable (noted in Assignment 2).

## Consequences
Transition validation is centralised and unit-testable, and a new status is added as a
new class without editing existing ones. The trade-off is more small classes.

## Applied in
backend/src/modules/requests/domain/states/ and Request.js
Informed by Assignment 2 Task 1, design problem 1.
