var T = require('../utils/tracing'),
    Controller = require("./Controller"),
    ControllerStates = require('./ControllerStates'),
    RoomStates = require('./RoomStates'),
    utils = require('../utils/utils'),
    RoomStateMachine = require('./RoomStateMachine');

Array.prototype.remove = require("../utils/ArrayExtensions").remove;

var Room = function (id) {
    this.id = id;
    this.isRandom = false;
    this.isOpen = true;
    this.controllersList = [];
    this.controllers = {};
    this.stateMachine = new RoomStateMachine(this);

    T.tab(id, "ROOM");
};

Room.prototype.addConnection = function (connection, options) {
    var controller = new Controller(connection, this, options);
    controller.sendMessage('welcome', connection.id, {
        id: connection.id,
        name: connection.name,
        health: controller.health
    });

    this.controllers[controller.id] = controller;
    this.controllersList.push(controller);
    this.broadcastInRoom("playerJoin", connection.id, {
        name: connection.name,
        id: connection.id
    });

    if (this.controllersList.length >= 2) {
        this.isOpen = false;
    }

    T.tab(connection.id, connection.name, this.controllersList.length, "CONTROLLER", JSON.stringify(options));
};

Room.prototype.transition = function (status, key, payload) {
    var targetId = this._decodePlayerIdForStatus(status);
    var message = {
        type: "serverStatusChange",
        payload: {
            status: status
        }
    };
    if (key) {
        message.payload[key] = payload;
    }
    if (targetId) {
        message.payload["id"] = targetId;
    }
    this.stateMachine.transition(status);
    this.broadcastInRoom('gameEvent', this.id, message);
};

Room.prototype.dropConnection = function (connection) {
    var connectionDetecionPredicate = function (e) {
        return e.id == connection.id
    };
    var c = this.controllersList.remove(connectionDetecionPredicate);
    if (c) {
        this.broadcastInRoom("playerLeave", connection.id, {
            id: connection.id,
            name: connection.name
        });
    }
    this.controllersList.remove(connectionDetecionPredicate);
    this.controllers[connection.id] = null;
    if (this.stateMachine.status != RoomStates.IDLE && this.stateMachine.status != RoomStates.FINISH) {
        var survivor = this.controllersList[0];
        if (survivor) {
            this._finishGame({
                winner: survivor.id,
                reason: "Forfeit"
            })
        }
    } else {
        this.isOpen = this.controllersList.length <2;
    }
};

Room.prototype.broadcastInRoom = function (messageType, controllerId, payload) {
    this.controllersList.forEach(function (controller) {
        controller.sendMessage(messageType, controllerId, payload);
    });
};

Room.prototype._decodePlayerIdForStatus = function (status) {
    var id;
    var p1 = this.player1;
    var p2 = this.player2;
    if (status === RoomStates.P1ATK) id = p1.id;
    else if (status === RoomStates.P2DEF) id = p2.id;
    return id;
};

Room.prototype._decodeNextStatus = function (payload) {
    var next;
    var p1 = this.player1;
    var p2 = this.player2;
    if (this.stateMachine.status === RoomStates.P1ATK) {
        next = RoomStates.P2DEF;
        p1.attack = payload.attackList;
        this.transition(next, 'attackList', payload.attackList);
    } else if (this.stateMachine.status === RoomStates.P2DEF) {
        next = RoomStates.RESULTS;
        p2.defense = payload.attackList;
        var isHit = this._getResults();
        var payload = {
            players: {},
            success: isHit,
            attacker: p1.id
        };
        payload.players[p1.id] = {
            round: p1.gameRound,
            health: p1.health
        };
        payload.players[p2.id] = {
            round: p2.gameRound,
            health: p2.health
        };
        this.transition(next, 'result', payload);
        if (p1.health <= 0 || p2.health <= 0) {
            this._finishGame({
                winner: p1.health <= 0 ? p2.id : p1.id,
                reason: "K.O."
            });
        } else {
            this._startRound();
        }
    }
    return next;
};

Room.prototype._onControllerReady = function () {
    var p1 = this.controllersList[0];
    var p2 = this.controllersList[1];
    var self = this;

    self.player1 = p1;
    self.player2 = p2;

    if (p1 && p1.stateMachine.status === ControllerStates.READY &&
        p2 && p2.stateMachine.status === ControllerStates.READY) {
        console.log('All players ready');
        this._startRound();
        return this.transition(RoomStates.READY);
    }
    console.log('Only 1 player ready');
};

Room.prototype._getResults = function () {
    var p1 = this.player1;
    var p2 = this.player2;
    var p1attack = p1.attack;
    var p2defense = p2.defense;

    //    if (p1.attack !== p2.defense) {
    //        p2.health = p2.health - 1;
    //    }

    if (p1attack.length !== p2defense.length) {
        p2.health = p2.health - 1;
        return true;
    }

    for (var i = 0; i < p1attack.length; i++) {
        var currentAtk = p1attack[i];
        var currentDefense = p2defense[i];
        if (!this._defenseOk(currentAtk, currentDefense)) {
            p2.health = p2.health - 1;
            return true;
        }
    }

    return false;
};

Room.prototype._defenseOk = function (atk, def) {
    return atk.gestureType === def.gestureType &&
        atk.gestureArea === def.gestureArea;
};

Room.prototype._startRound = function () {
    var self = this;
    setTimeout(function () {
        self._swap();
        self.transition(RoomStates.P1ATK, "id", self.player1.id);
    }, 3000);
};

Room.prototype._finishGame = function (results) {
    var self = this;
    setTimeout(function () {
        self.transition(RoomStates.FINISH, "result", results);
    }, 3000);
};

Room.prototype._swap = function () {
    var tmp = this.player1;
    this.player1 = this.player2;
    this.player1.newRound();
    this.player2 = tmp;
    this.player2.newRound();
};

module.exports = Room;