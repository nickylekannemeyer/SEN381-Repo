// Observer interface (ADR-002). Concrete observers implement update(event).
class Observer {
  update(event) {
    throw new Error('update() not implemented');
  }
}

module.exports = Observer;
