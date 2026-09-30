const RequestState = require('./RequestState');

class ResolvedState extends RequestState {
  constructor() { super('Resolved'); }
  allowedTransitions() { return ['Closed', 'In Progress']; }
}

module.exports = ResolvedState;
