const RequestState = require('./RequestState');

class InProgressState extends RequestState {
  constructor() { super('In Progress'); }
  allowedTransitions() { return ['Resolved', 'Open']; }
}

module.exports = InProgressState;
