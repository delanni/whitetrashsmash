module.exports = RoomStates;

function RoomStates(Room) {
    this.Room = Room;
    this.STATE = {
        IDLE: 0,
        READY: 1,
        P1ATK: 2,
        P2ATK: 3,
        P1DEF: 4,
        P2DEF: 5,
        RESULTS: 6
    };
    this.status = this.STATE.IDLE;

}

ControlerStates.prototype.triggerEvent = function (from, to) {

}

ControlerStates.prototype.transition = function (status) {
    var currentState = this.status;
    this.triggerEvent(currentState, status);
    this.status = status;
};