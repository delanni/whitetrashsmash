var utils = require('../utils/utils');

var Controller = function (connection, room, options) {
    this.connection = connection;
    this.id = connection.id;
    this.room = room;

    // other info: eg. webgl enabled / browser vendor / screen size 

    utils.attachHandlers(connection, this);
};

Controller.prototype.onMessage = function(messageType, controllerId, payload){
    var message = {
        type: messageType,
        sender: controllerId,
        payload: payload,
        timestamp: new Date()
    };
    this.connection.emit('gameEvent', message);
};

// Events that the controller sends, handlers executed in the context of the controller
Controller.prototype.handlers = {
    // events such as "virtual" keypress - validate and pipe it to the room
    gameEvent: function (connection, payload) {
        this.room.messageToControllers('gameEvent', connection.id, payload);
    }
};

module.exports = Controller;