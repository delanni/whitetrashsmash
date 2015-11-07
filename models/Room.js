var T = require('../utils/tracing'),
    Viewer = require("./Viewer"),
    Controller = require("./Controller"),
    utils = require('../utils/utils');
Array.prototype.remove = require("../utils/ArrayExtensions").remove;

var Room = function (id) {
    this.id = id;

    this.viewsList = [];
    this.controllersList = [];
    this.controllers = {};

    T.tab(id, "ROOM");
};

Room.prototype.addConnection = function (connection, options) {
    var type = options.type;
    var newEntity;
    if (type == "viewer") {
        var viewer = new Viewer(connection, this, options);
        newEntity = viewer;
        this.viewsList.push(viewer);
        T.tab(connection.id, connection.name, this.viewsList.length, "VIEWER", JSON.stringify(options));
    } else if (type == "controller") {
        var controller = new Controller(connection, this, options);
        newEntity = controller;
        this.controllers[controller.id] = controller;
        this.controllersList.push(controller);
        this.messageToViews("playerJoin", connection.id, {
            name: connection.name,
            id: connection.id
        });
        T.tab(connection.id, connection.name, this.controllersList.length, "CONTROLLER", JSON.stringify(options));
    }

    if (newEntity) newEntity.onMessage('welcome', connection.id, {
        id: connection.id,
        name: connection.name
    });
};

Room.prototype.dropConnection = function (connection) {
    var connectionDetecionPredicate = function (e) {
        return e.id == connection.id
    };
    var c = this.controllersList.remove(connectionDetecionPredicate);
    if (c) {
        this.messageToViews("playerLeave", connection.id, {
            id: connection.id
        });
    }
    this.viewsList.remove(connectionDetecionPredicate);
    this.controllers[connection.id] = null;
};

Room.prototype.messageToViews = function (messageType, playerId, payload) {
    this.viewsList.forEach(function (view) {
        view.onMessage(messageType, playerId, payload);
    });
};

Room.prototype.messageToPlayers = function (messageType, viewId, payload) {
    this.controllersList.forEach(function (controller) {
        controller.onMessage(messageType, viewId, payload);
    });
};

module.exports = Room;