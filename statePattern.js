// statePattern.js
class RequestState {
    constructor(request) {
        this.request = request;
    }
    transitionTo(newStatus) {
        throw new Error("Transition method must be implemented");
    }
}

class OpenState extends RequestState {
    transitionTo(newStatus) {
        return newStatus === 'IN_PROGRESS' || newStatus === 'CLOSED';
    }
}

class InProgressState extends RequestState {
    transitionTo(newStatus) {
        return newStatus === 'RESOLVED';
    }
}

class ResolvedState extends RequestState {
    transitionTo(newStatus) {
        return newStatus === 'CLOSED' || newStatus === 'IN_PROGRESS';
    }
}

class ClosedState extends RequestState {
    transitionTo(newStatus) {
        return false; // Terminal state, no further transitions allowed
    }
}

const StateFactory = (status, request) => {
    switch (status) {
        case 'OPEN': return new OpenState(request);
        case 'IN_PROGRESS': return new InProgressState(request);
        case 'RESOLVED': return new ResolvedState(request);
        case 'CLOSED': return new ClosedState(request);
        default: throw new Error("Invalid current state");
    }
};

module.exports = { StateFactory };