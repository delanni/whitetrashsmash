var Moniker = require('moniker'),
    Room = require('./Room'),
    T = require('../utils/tracing'),
    utils = require('../utils/utils');
Array.prototype.remove = require("../utils/ArrayExtensions").remove;

var Game = function () {
    this.connections = {};
    this.connectionList = [];

    this.rooms = {};
    this.roomList = [];
};

Game.prototype.createRoom = function (name) {
    var id = name || Moniker.choose();
    var room = new Room(id);
    this.rooms[id] = room;
    this.roomList.push(room);
    return room;
};

Game.prototype.randomRoom = function () {
    var potentialRoom = this.roomList.filter(function (e) {
        return e.isRandom && e.isOpen;
    })[0];
    if (!potentialRoom || !potentialRoom.isOpen) {
        console.log("potentialRoom", potentialRoom);
        potentialRoom = this.createRoom();
    }
    potentialRoom.isRandom = true;
    return potentialRoom.id;
};

Game.prototype.addConnection = function (connection) {
    var self = this;
    this.connections[connection.id] = connection;
    this.connectionList.push(connection);
    T.tab(connection.id, connection.name, "CONN");
    connection.on("disconnect", function () {
        T.tab(connection.id, connection.name, "LEFT");
        self.dropConnection(connection);
    });
    utils.attachHandlers(connection, this);
};

Game.prototype.dropConnection = function (connection) {
    this.connections[connection.id] = null;
    this.connectionList.remove(connection);
};

/**
 * Will be executed in the context of the server 
 **/
Game.prototype.handlers = {
    joinRoom: function (connection, payload) {
        var roomId = payload.roomId;
        var room = this.rooms[roomId];
        if (room) {
            if (room.isOpen) {
                T.tab(connection.id, connection.name, roomId, "ROOMJOIN");
                room.addConnection(connection, payload);
                connection.on("disconnect", function () {
                    room.dropConnection(connection);
                });
            } else {
                connection.emit("error", {
                    message: "The room is full"
                });
            }
        } else {
            connection.emit("error", {
                message: "The requested room does not exist"
            });
        }
    }
};

module.exports = Game;