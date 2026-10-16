// Subject for the Observer pattern (ADR-002).
class Subject {
  constructor() { this._observers = []; }
  subscribe(observer) { this._observers.push(observer); }
  notify(event) {
    for (const observer of this._observers) {
      try { observer.update(event); }
      catch (err) { console.error('Observer failed:', err.message); } // non-critical (ASR-4)
    }
  }
}
module.exports = Subject;
