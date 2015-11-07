var states = require('./RoomStates');

module.exports = RoomStates;

function RoomStates(Room) {
    this.Room = Room;
    this.STATE = states;
    this.status = this.STATE.IDLE;

}

RoomStates.prototype.triggerEvent = function (from, to) {

}

RoomStates.prototype.transition = function (status) {
    var currentState = this.status;
    this.triggerEvent(currentState, status);
    console.log("Room status changed from %s to %s", currentState, status);
    this.status = status;
};