var Controller = function (options) {
    __merge(this, Controller.defaults, options);
};

(function (Controller) {
    Controller.defaults = {

    };

    Controller.prototype = {
        init: function (initialInfo) {
            this.name = initialInfo.name;
            this.health = initialInfo.health;
            this.id = initialInfo.id;

            this.messageHub = new MessageHub();
            this.stateMachine = new StateMachine();

            this._readyCounter = 0;

            attachHandlers.call(this);
            defineEdges.call(this);

            this.messageHub.postMessage("messageBar", {
                text: "Tap fields if ready! (3/0)"
            });
        },

        setReady: function (set) {
            if (this.stateMachine.state == StateMachine.STATE.IDLE && set) {
                this.stateMachine.transition(StateMachine.STATE.READY);
            } else if (this.stateMachine.state == StateMachine.STATE.READY) {
                this.stateMachine.transition(StateMachine.STATE.IDLE);
            }
        },

        getReady: function () {
            this.messageHub.postMessage("messageBar", {
                text: "Get ready!"
            });
        },

        playerWait: function () {
            this.stateMachine.transition(StateMachine.STATE.WAITING);
            this.messageHub.postMessage("messageBar", {
                text: "Opponent turn..."
            });
        },

        playerAttack: function () {
            var controller = this;
            this.attackSession = new AttackSession({
                numberOfAttacks: this.currentNumberOfAttacks,
                onFinish: function (attackList) {
                    controller.messageHub.sendMessage("fin", {
                        attackList: attackList
                    });
                    controller.stateMachine.transition(StateMachine.STATE.WAITING);
                },
                messageHub: this.messageHub
            });
            this.stateMachine.transition(StateMachine.STATE.ATTACKING);
            this.attackSession.start();
        },

        playerDefend: function (payload) {
            var defendables = payload.attackList;
            var controller = this;
            this.defendSession = new DefendSession({
                defend: defendables,
                onFinish: function (attackList) {
                    controller.messageHub.sendMessage("fin", {
                        attackList: attackList
                    });
                    controller.stateMachine.transition(StateMachine.STATE.WAITING);
                },
                messageHub: this.messageHub
            });
            this.stateMachine.transition(StateMachine.STATE.DEFENDING);
            this.defendSession.start();
        },

        showResults: function (results) {
            if (results.success) {
                if (this.id !== results.attacker) {
                    this.messageHub.postMessage("healthLost");
                } else {
                    this.messageHub.postMessage("messageBar", {
                        text: "You smacked him!"
                    });
                }
            } else {
                this.messageHub.postMessage("messageBar", {
                    text: "Dodged..."
                });
            }
        },

        gameOver: function (payload) {
            var reason = payload.reason;
            var winner = payload.winner;
            var message = "You " + (winner == this.id ? "won" : "lose") + "! (" + reason + ")";
            this.messageHub.postMessage("messageBar", message);
        }
    };

    function attachHandlers() {
        this.messageHub.on("gesture", function (gesture) {
            if (this.stateMachine.state == StateMachine.STATE.IDLE || this.stateMachine.state == StateMachine.STATE.READY) {
                this.messageHub.postImmediateMessage("toggleCellColor", gesture.gestureArea);
                var readyState = this.messageHub.postImmediateMessage("queryReadyState");
                var readyCount = readyState.filter(function (e) {
                    return e
                })[0] || 0;
                if (readyCount == 3) {
                    this.messageHub.postMessage("messageBar", {
                        text: "Ready!"
                    });
                    this.setReady(true);
                } else {
                    this.messageHub.postMessage("messageBar", {
                        text: "Tap fields if ready! (3/" + readyCount + ")"
                    });
                    this.setReady(false);
                }
            }

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
                var results = payload.result;
                this.showResults(results);
                break;
            case "FINISH":
                var results = payload.result;
                this.gameOver(results);
                break;
            };
        }, this);
    }

    function defineEdges() {
        var controller = this;
        this.stateMachine.defineEdge(StateMachine.STATE.IDLE, StateMachine.STATE.READY, function (payload) {
            controller.messageHub.sendMessage("statusChange", {
                status: payload.newState
            });
        });

        this.stateMachine.defineEdge(StateMachine.STATE.READY, StateMachine.STATE.IDLE, function (payload) {
            controller.messageHub.sendMessage("statusChange", {
                status: payload.newState
            });
        });

        this.stateMachine.on("stateChanged", function (payload) {
            this.messageHub.postMessage("statusChange", {
                status: payload.newState
            });
        }, this);
    }

    __merge(Controller.prototype, EventEmitter);
})(Controller);