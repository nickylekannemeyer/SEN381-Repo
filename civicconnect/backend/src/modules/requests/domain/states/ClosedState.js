const RequestState = require('./RequestState');

// Closed is terminal.
class ClosedState extends RequestState {
  constructor() { super('Closed'); }
  allowedTransitions() { return []; }
}

module.exports = ClosedState;
