var T = require('../utils/tracing'),
    Controller = require("./Controller"),
    ControllerStates = require('./ControllerStates'),
    RoomStates = require('./RoomStates'),
    utils = require('../utils/utils'),
    RoomStateMachine = require('./RoomStateMachine');

Array.prototype.remove = require("../utils/ArrayExtensions").remove;

var Room = function (id) {
    this.id = id;

    this.controllersList = [];
    this.controllers = {};
    this.stateMachine = new RoomStateMachine(this);

    T.tab(id, "ROOM");
};

Room.prototype.addConnection = function (connection, options) {
    var controller = new Controller(connection, this, options);
    this.controllers[controller.id] = controller;
    this.controllersList.push(controller);
    this.messageToControllers("playerJoin", connection.id, {
        name: connection.name,
        id: connection.id
    });
    T.tab(connection.id, connection.name, this.controllersList.length, "CONTROLLER", JSON.stringify(options));

    controller.onMessage('welcome', connection.id, {
        id: connection.id,
        name: connection.name,
        health: controller.health
    });
};

Room.prototype.transition = function (status, key, payload) {
    var id = this._decodePlayerIdForStatus(status);
    var message = {
        type: 'serverStatusChange',
        status: status,
        id: id
    };
    if (key) message[key] = payload;
    this.stateMachine.transition(status);
    this.messageToControllers('gameEvent', this.id, message);
};

Room.prototype.dropConnection = function (connection) {
    var connectionDetecionPredicate = function (e) {
        return e.id == connection.id
    };
    var c = this.controllersList.remove(connectionDetecionPredicate);
    if (c) {
        this.messageToControllers("playerLeave", connection.id, {
            id: connection.id
        });
    }
    this.controllersList.remove(connectionDetecionPredicate);
    this.controllers[connection.id] = null;
};

Room.prototype.messageToControllers = function (messageType, controllerId, payload) {
    var type = payload.type;
    var status = payload.status;
    var self = this;
    if (type === 'statusChange' && status) {
        switch (status) {
        case ControllerStates.READY:
            self._onControllerReady();
            break;
        }
    } else if (type === 'fin') {
        this._decodeNextStatus(self.stateMachine.status, payload);
    }
    this.controllersList.forEach(function (controller) {
        controller.onMessage(messageType, controllerId, payload);
    });
};

Room.prototype._decodePlayerIdForStatus = function (status) {
    var id;
    var p1 = this.player1;
    var p2 = this.player2;
    if (status === RoomStates.P1ATK) id = p1.id;
    else if (status === RoomStates.P2DEF) id = p2.id;
    return id;
}

Room.prototype._decodeNextStatus = function (status, payload) {
    var next;
    var p1 = this.player1;
    var p2 = this.player2;
    if (status === RoomStates.P1ATK) {
        next = RoomStates.P2DEF;
        p1.attack = payload.attackList;
        this.transition(next, 'attackList', payload.attackList);
    } else if (status === RoomStates.P2DEF) {
        next = RoomStates.RESULTS;
        p2.defense = payload.attackList;
        this._getResults();
        var payload = {};
        payload[p1.id] = {
            round: p1.gameRound,
            health: p1.health
        };
        payload[p2.id] = {
            round: p2.gameRound,
            health: p2.health
        };
        this.transition(next, 'players', payload);
        if (p1.health <= 0 || p2.health <= 0) {
            this._finishGame();
        } else {
            this._startRound();
        }
    }
    return next;
}

Room.prototype._onControllerReady = function (status) {
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
}

Room.prototype._getResults = function () {
    var p1 = this.player1;
    var p2 = this.player2;
    var p1attack = p1.attack;
    var p2defense = p2.defense;

    if (p1.attack !== p2.defense) {
        p2.health = p2.health - 1;
    }

    /*
    if(p1attack.length !== p2defense.length) {
        p2.health = p2.health - 1;
        return;
    }

    for (var i = 0; i < p1attack.length; i++) {
        var current = p1attack[i];
        var currentDefense = p2defense[i];
        if (!this._defenseOk(current, currentDefense)) {
            p2.health = p2.health - 1;
            break;
        }
    } */
}

Room.prototype._defenseOk = function (atk, def) {
    return atk.divElement === def.divElement && 
            atk.gestureType === def.gestureType && 
            atk.gestureArea === def.gestureArea;
}

Room.prototype._startRound = function () {
    var self = this;
    setTimeout(function () {
        self._swap();
        self.transition(RoomStates.P1ATK);
    }, 3000);
}

Room.prototype._finishGame = function () {
    var self = this;
    setTimeout(function () {
        self.transition(RoomStates.FINISH);
    }, 3000);
}

Room.prototype._swap = function () {
    var tmp = this.player1;
    this.player1 = this.player2;
    this.player1.newRound();
    this.player2 = tmp;
    this.player2.newRound();
}

module.exports = Room;