const Subject = require('./observers/Subject');
const { stateFor } = require('./states/stateFactory');

// Request domain entity.
// Uses the State pattern for transitions (ADR-001) and the Observer pattern
// to announce a change (ADR-002).
class Request extends Subject {
  constructor({ id, requesterId, title, description, category, status = 'Open', assignedTo = null }) {
    super();
    this.id = id;
    this.requesterId = requesterId;
    this.title = title;
    this.description = description;
    this.category = category;
    this.assignedTo = assignedTo;
    this.state = stateFor(status);
  }

  get status() {
    return this.state.name;
  }

  // Validate and apply a transition using the State pattern (ADR-001).
  // Returns the transition event. It does NOT notify observers: the service records the
  // change transactionally and only notifies observers after the change commits (ADR-002).
  applyTransition(target, changedBy, note = null) {
    if (!this.state.canTransitionTo(target)) {
      throw new Error(`Invalid transition from ${this.status} to ${target}`);
    }
    const fromStatus = this.status;
    this.state = stateFor(target);
    return { requestId: this.id, fromStatus, toStatus: target, changedBy, note };
  }
}

module.exports = Request;
