module.exports = ControlerStates;

function ControlerStates(Controler) {
    this.Controller = Controller;
    this.STATE = {
        IDLE: 0,
        READY: 1,
        WAITING: 2,
        STARTING: 3,
        ATTACKING: 4,
        DEFENDING: 5,
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