var T = require('../utils/tracing'),
    Controller = require("./Controller"),
    utils = require('../utils/utils'),
    RoomStates = require('./RoomStates');

Array.prototype.remove = require("../utils/ArrayExtensions").remove;

var Room = function (id) {
    this.id = id;

    this.controllersList = [];
    this.controllers = {};
    this.stateMachine = new RoomStates(this);

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
        name: connection.name
    });
};

Room.prototype.transition = function (status) {
    this.stateMachine.transition(status);
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
    this.controllersList.forEach(function (controller) {
        controller.onMessage(messageType, controllerId, payload);
    });
};

module.exports = Room;
