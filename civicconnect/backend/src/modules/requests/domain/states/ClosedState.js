const RequestState = require('./RequestState');
class ClosedState extends RequestState {
  constructor() { super('Closed'); }
  allowedTransitions() { return []; }
}
module.exports = ClosedState;
