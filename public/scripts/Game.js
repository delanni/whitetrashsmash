var Game = function (options) {
    __merge(this, Game.defaults, options);
};

(function (Game) {
    Game.defaults = {

    };

    Game.prototype = {
        init: function (phaserProps) {
            this.phaserGame = phaserProps[0];
            var initFn = phaserProps.pop();

            var players = initFn();

            this.p1 = players[0];
            this.p1._anim._parent.filters = [grayFilter];
            this.p2 = players[1];
            this.p2._anim._parent.filters = [grayFilter];

            this.messageHub = new MessageHub();
            this.stateMachine = new StateMachine();

            this.messageHub.on("playerJoin", function (data) {

            });

            Connection.on("playerJoin", function (data) {
                this.messageHub.postMessage("messageBar", {
                    text: data.name + " joined"
                });

                if (data.isViewer) return;

                if (this.p1.name && this.p1.id) {
                    if (this.p2.name && this.p2.name) {
                        // wtf? no more players pls
                    }
                    this.p2.name = data.name;
                    this.p2.id = data.id;
                    this.p2._anim._parent.filters = undefined;
                } else {
                    this.p1.name = data.name;
                    this.p1.id = data.id;
                    this.p1._anim._parent.filters = undefined;
                }
            }, this);

            Connection.on("playerLeave", function (data) {
                this.messageHub.postMessage("messageBar", {
                    text: data.name + " left"
                });
                
                if (data.isViewer) return;

                if (this.p1.id == data.id) {
                    delete this.p1.id;
                    delete this.p1.name;
                    this.p1._anim._parent.filters = [grayFilter];
                } else if (this.p2.id == data.id) {
                    delete this.p2.id;
                    delete this.p2.name;
                    this.p2._anim._parent.filters = [grayFilter];
                }
            }, this);

            attachHandlers.call(this);
            defineEdges.call(this);
        },

        playerAttack: function (payload) {
            var p1 = this.p1;
            var p2 = this.p2;
            var attacker = p1.id == payload.id ? p1 : p2;
            var defender = p1.id != payload.id ? p1 : p2;

        },
        playerDefend: function (payload) {
            var p1 = this.p1;
            var p2 = this.p2;
            var attacker = p1.id == payload.id ? p1 : p2;
            var defender = p1.id != payload.id ? p1 : p2;

        },
        playerWait: function (payload) {
            var p1 = this.p1;
            var p2 = this.p2;
            var p = p1.id != payload.id ? p1 : p2;

            p._anim._parent.filters = [window.grayFilter];
        },
        getReady: function () {
            this.messageHub.postMessage("messageBar", "Get ready!");
        },
        showResults: function (results) {
            var attacker = this.p1.id == results.attacker ? this.p1 : this.p2;
            var defender = this.p1 == attacker ? this.p2 : this.p1;

            attacker.playAnim("attack");
            if (!results.success) {
                defender.playAnim("block");
                this.messageHub.postMessage("block");
            } else {
                this.messageHub.postMessage("hit");
                this.messageHub.postMessage("healthLost", {
                    defender: defender
                });
            }
        }
    };

    function attachHandlers() {
        this.messageHub.on("serverStatusChange", function (payload) {
            switch (payload.status) {
            case "IDLE":
                break;
            case "READY":
                this.getReady();
                break;
            case "P1ATK":
                this.playerAttack(payload);
                this.playerWait(payload);
                break;
            case "P2DEF":
                this.playerDefend(payload);
                this.playerWait(payload);
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
        this.stateMachine.on("stateChanged", function (payload) {
            this.messageHub.postMessage("statusChange", {
                status: payload.newState
            });

            if (payload.newState == StateMachine.STATE.ATTACKING || payload.newState == StateMachine.STATE.DEFENDING) {
                this.messageHub.postMessage("newTurn");
            }
        }, this);
    }

    __merge(Game.prototype, EventEmitter);
})(Game);