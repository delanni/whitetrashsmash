var Controller = function (options) {
    __merge(this, Controller.defaults, options);
};

(function (Controller) {
    Controller.defaults = {

    };

    Controller.prototype = {
        init: function () {
            this.messageHub = new MessageHub();
            this.stateMachine = new StateMachine();

            attachHandlers.call(this);
            defineEdges.call(this);
        }
    };

    function attachHandlers() {
        this.messageHub.on("gesture", function () {

        });
    }

    __merge(Controller.prototype, EventEmitter);
})(Controller);