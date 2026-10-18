const Observer = require('./Observer');
// Non-critical reaction to a committed status change (ADR-002). Runs after commit.
class FeedbackObserver extends Observer {
  update(event) { console.log(`Request ${event.requestId} moved to ${event.toStatus}`); }
}
module.exports = FeedbackObserver;
