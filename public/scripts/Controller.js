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
            },

            getReady: function () {
                window.title = "getready";
            },

            playerWait: function () {
                window.title = "wait";
            },

            playerAttack: function () {
                var controller = this;
                this.attackSession = new AttackSession({
                    numberOfAttacks: this.currentNumberOfAttacks,
                    onFinish: function () {
                        controller.messageHub.sendMessage("fin", {
                            attackList: this.attackList
                        });
                        controller.transition(StateMachine.STATE.WAITING);
                    }
                });
                this.stateMachine.transition(StateMachine.STATE.ATTACKING);
            },

            playerDefend: function (payload) {
                var defendables = payload.attackList;
                var controller = this;
                this.defendSession = new DefendSession({
                    defend: defendables,
                    onFinish: function () {
                        controller.messageHub.sendMessage("fin", {
                            attackList: this.attackList
                        });
                        controller.transition(StateMachine.STATE.WAITING);
                    }
                });
                this.stateMachine.transition(StateMachine.STATE.DEFENDING);
            },

            showResults: function () {
                window.title = "results";
            },

            gameOver: function (payload) {
                var reason = payload.reason;
            }
        };

        function attachHandlers() {
            this.messageHub.on("gesture", function (gesture) {
                if (this.stateMachine.state == StateMachine.STATE.ATTACKING) {
                    this.attackSession.addAttack(gesture);
                } else if (this.stateMachine.state == StateMachine.STATE.DEFENDING) {
                    this.defendSession.tryDefend(gesture);
                }
            }, this);

            this.messageHub.on("serverStatusChange", function (payload) {
                switch (payload.status) {
                case "IDLE":
                    break;
                case "READY":
                    this.getReady(payload);
                    break;
                case "P1ATK":
                    if (this.id == payload.id) {
                        this.playerAttack(payload);
                    } else {
                        this.playerWait(payload);
                    }
                    break;
                case "P2DEF":
                    if (this.id == payload.id) {
                        this.playerDefend(payload);
                    } else {
                        this.playerWait(payload);
                    }
                    break;
                case "RESULTS":
                    this.showResults(payload);
                    break;
                case "END":
                    this.gameOver(payload);
                    break;
                };
            }, this);

            function defineEdges() {
                var controller = this;
                this.stateMachine.defineEdge(StateMachine.STATE.IDLE, StateMachine.STATE.READY, function (payload) {
                    controller.messageHub.sendMessage("statusChange", {
                        status: payload.newState
                    });
                });

                //                this.stateMachine.on("stateChanged", function (payload) {
                //                    this.messageHub.sendMessage("statusChange", {
                //                        status: payload.newState
                //                    });
                //                }, this);
            }

            __merge(Controller.prototype, EventEmitter);
        })(Controller);