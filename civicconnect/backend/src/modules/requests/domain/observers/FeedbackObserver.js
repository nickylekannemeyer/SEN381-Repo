const Observer = require('./Observer');

// A non-critical reaction to a committed status change (ADR-002).
// It runs only after the transaction commits, and a failure here is logged and does
// not affect the committed change. Future notification channels are added the same way.
class FeedbackObserver extends Observer {
  update(event) {
    // event: { requestId, fromStatus, toStatus, changedBy, note }
    // TODO: send an in-app acknowledgement to the requester.
    console.log(`Request ${event.requestId} moved to ${event.toStatus}`);
  }
}

module.exports = FeedbackObserver;
