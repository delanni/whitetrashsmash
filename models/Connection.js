var uuid = require('node-uuid'),
    Chance = require('chance'),
    chance = new Chance();

var Connection = function (socket) {
    this.socket = socket;
    this.id = uuid.v4();
    this.name = chance.name();
    this.handlers = {};
};

Connection.prototype.emit = function (messageId, payload) {
    this.socket.emit(messageId, payload);
};

Connection.prototype.on = function (messageId, handler) {
    this.handlers[messageId] = this.handlers[messageId] || [];
    this.handlers[messageId].push(handler);
    this.socket.on(messageId, handler);
};

module.exports = Connection;