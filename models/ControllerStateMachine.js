var states = require('./ControllerStates');

module.exports = ControlerStates;


function ControlerStates(Controller) {
    this.Controller = Controller;
    this.STATE = states;
    this.status = this.STATE.IDLE;
}

ControlerStates.prototype.transition = function (status) {
    var currentState = this.status;
    console.log("Status changed from %s to %s", currentState, status);
    this.status = status;
};