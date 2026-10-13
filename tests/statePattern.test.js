const { StateFactory } = require('../statePattern');

describe('Request State Pattern - State Transitions', () => {
    test('OPEN state can transition to IN_PROGRESS', () => {
        const state = StateFactory('OPEN', {});
        expect(state.transitionTo('IN_PROGRESS')).toBe(true);
    });

    test('OPEN state can transition to CLOSED', () => {
        const state = StateFactory('OPEN', {});
        expect(state.transitionTo('CLOSED')).toBe(true);
    });

    test('OPEN state CANNOT transition directly to RESOLVED', () => {
        const state = StateFactory('OPEN', {});
        expect(state.transitionTo('RESOLVED')).toBe(false);
    });

    test('IN_PROGRESS state can transition to RESOLVED', () => {
        const state = StateFactory('IN_PROGRESS', {});
        expect(state.transitionTo('RESOLVED')).toBe(true);
    });

    test('CLOSED is a terminal state and cannot transition anywhere', () => {
        const state = StateFactory('CLOSED', {});
        expect(state.transitionTo('OPEN')).toBe(false);
        expect(state.transitionTo('IN_PROGRESS')).toBe(false);
    });
});