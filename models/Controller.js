var utils = require('../utils/utils'),
    ControllerStateMachine = require('./ControllerStateMachine'),
    ControllerStates = require("./ControllerStates");

var Controller = function (connection, room, options) {
    this.connection = connection;
    this.id = connection.id;
    this.room = room;
    this.stateMachine = new ControllerStateMachine(this);
    this.gameRound = 0;
    this.health = 3;
    this.attack = {};
    this.defense = {};

    this.isViewer = options.isViewer;
    // other info: eg. webgl enabled / browser vendor / screen size 

    utils.attachHandlers(connection, this);
};

Controller.prototype.sendMessage = function (messageType, controllerId, payload) {
    payload.timestamp = new Date();
    payload.sender = controllerId;
    this.connection.emit(messageType, payload);
};

// Events that the controller sends, handlers executed in the context of the controller
Controller.prototype.handlers = {
    gameEvent: function (connection, payload) {
        var type = payload.type;
        
        if (type === 'statusChange') {
            var statusPayload = payload.payload;
            var status = statusPayload.status;
            this.transition(status);
            switch (status) {
            case ControllerStates.READY:
                this.controllerReady();
                break;
            }
        } else if (type === 'fin') {
            this.controllerFinish(payload);
        }
        
        this.room.broadcastInRoom('gameEvent', connection.id, payload);
    }
};

Controller.prototype.controllerReady = function(){
    this.room._onControllerReady();
};

Controller.prototype.controllerFinish = function(payload){
    this.room._decodeNextStatus(payload.payload);
};

Controller.prototype.transition = function (status) {
    this.stateMachine.transition(status);
};

Controller.prototype.newRound = function () {
    this.gameRound++;
    this.attack = {};
    this.defense = {};
};

module.exports = Controller;