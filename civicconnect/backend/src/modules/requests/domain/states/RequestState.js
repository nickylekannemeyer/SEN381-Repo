// Base state for the request lifecycle (ADR-001, State pattern).
class RequestState {
  constructor(name) { this.name = name; }
  allowedTransitions() { return []; }
  canTransitionTo(target) { return this.allowedTransitions().includes(target); }
}
module.exports = RequestState;
