var StateMachine = function () {
    __merge(this, StateMachine.defaults);
};

(function (StateMachine) {
    StateMachine.STATE = {
        IDLE: "IDLE",
        READY: "READY",
        WAITING: "WAITING",
        STARTING: "STARTING",
        ATTACKING: "ATTACKING",
        DEFENDING: "DEFENDING",
        RESULTS: "RESULTS"
    };

    StateMachine.defaults = {
        state: StateMachine.STATE.IDLE
    };

    StateMachine.prototype = {
        transition: function (state) {
            var currentState = this.state;
            triggerEvents(currentState, state);
            this.trigger("stateChanged", {
                oldState: currentState,
                newState: state
            });
            this.state = state;
        },
        defineEdge: function (fromState, toState, handler) {
            this.on(fromState + "/" + toState, handler);
        },
        triggerEvents: function (fromState, toState) {
            this.trigger(fromState + "/" + toState);
        }
    };

    __merge(StateMachine.prototype, EventEmitter);
})(StateMachine);