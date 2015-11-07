var StateMachine = function(){
    __merge(this, StateMachine.defaults, options);
};

(function(StateMachine){
    StateMachine.STATE = {
        IDLE: 0,
        READY: 1,
        WAITING: 2,
        STARTING: 3,
        ATTACKING: 4,
        DEFENDING: 5,
        RESULTS: 6
    };
    
    StateMachine.defaults = {
        state: StateMachine.STATE.IDLE;
    };
    
    StateMachine.prototype = {
        transition: function(state){
            var currentState = this.state;
            triggerEvents(currentState, state);
            this.state = state;
        },
        defineEdge: function(fromState, toState, handler){
            this.on(fromState + "/" + toState, handler);
        },
        triggerEvents: function(fromState, toState){
            this.trigger(fromState + "/" + toState);
        }
    };
    
    __merge(StateMachine.prototype, EventEmitter);
})(StateMachine);