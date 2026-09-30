// Subject for the Observer pattern (ADR-002).
class Subject {
  constructor() {
    this._observers = [];
  }
  subscribe(observer) {
    this._observers.push(observer);
  }
  notify(event) {
    for (const observer of this._observers) {
      try {
        observer.update(event);
      } catch (err) {
        // A failure in a non-critical reaction must not break the transition (ASR-4).
        console.error('Observer failed:', err.message);
      }
    }
  }
}

module.exports = Subject;
