const Subject = require('./observers/Subject');
const { stateFor } = require('./states/stateFactory');

// Request domain entity. State pattern for transitions (ADR-001), Observer to
// announce a committed change (ADR-002). The version supports optimistic concurrency.
class Request extends Subject {
  constructor({ id, requesterId, title, description, category, status = 'Open', assignedTo = null, version = 1 }) {
    super();
    this.id = id;
    this.requesterId = requesterId;
    this.title = title;
    this.description = description;
    this.category = category;
    this.assignedTo = assignedTo;
    this.version = version;
    this.state = stateFor(status);
  }
  get status() { return this.state.name; }

  // Validate and apply a transition. Does NOT notify: the service records the change
  // transactionally and notifies observers only after commit (ADR-002).
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
