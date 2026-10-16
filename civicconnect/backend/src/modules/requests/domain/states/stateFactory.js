const OpenState = require('./OpenState');
const InProgressState = require('./InProgressState');
const ResolvedState = require('./ResolvedState');
const ClosedState = require('./ClosedState');
const STATES = { 'Open': OpenState, 'In Progress': InProgressState, 'Resolved': ResolvedState, 'Closed': ClosedState };
function stateFor(name) {
  const StateClass = STATES[name];
  if (!StateClass) throw new Error(`Unknown status: ${name}`);
  return new StateClass();
}
module.exports = { stateFor };
