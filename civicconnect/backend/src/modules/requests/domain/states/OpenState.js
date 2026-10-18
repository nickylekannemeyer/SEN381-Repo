const RequestState = require('./RequestState');
class OpenState extends RequestState {
  constructor() { super('Open'); }
  allowedTransitions() { return ['In Progress', 'Closed']; }
}
module.exports = OpenState;
