function AttackSession(options) {
    __merge(this, AttackSession.defaults, options);
}

(function (AttackSession) {
    AttackSession.defaults = {
        acceptsMoves: false,
        numberOfAttacks: 3,
        timeout: 20000,

    };

    AttackSession.prototype = {
        start: function () {
            this.acceptsMoves = true;
            this.attackList = [];
            this.attacksRemaining = this.numberOfAttacks;
            var attackSession = this;
            setTimeout(function () {
                attackSession.finish();
            }, this.timeout);
        },
        addAttack: function (attackGesture) {
            this.attackList.push(attackGesture);
            this.attacksRemaining -= 1;
            if (this.attacksRemaining == 0) {
                this.finish();
            }
        },
        finish: function () {
            if (!this.acceptsMoves) return;
            this.acceptsMoves = false;
            this.onFinish(this.attackList);
        }
    };
})(AttackSession);

function DefenseSession(options) {
    __merge(this, DefenseSession.defaults, options);
}

(function (DefenseSession) {
    DefenseSession.defaults = {
        acceptsMoves: false,
        timeout: 25000
    };

    DefenseSession.prototype = {
        start: function () {
            this.acceptsMoves = true;
            this.defend = this.defend || [];
            this.attackList = [];
            this.attacksRemaining = this.defend.length;
            var defendSession = this;
            setTimeout(function () {
                defendSession.finish();
            }, this.timeout);
        },
        tryDefend: function (attackGesture) {
            this.attackList.push(attackGesture);
            var toDefend = this.defend.shift();
            if (toDefend.gestureArea == attackGesture.gestureArea && toDefend.gestureType == attackGesture.gestureType) {
                this.attacksRemaining = this.defend.length;
                if (this.attacksRemaining.length == 0) {
                    // Signal fail somehow
                    this.finish();
                }
            } else {
                // Signal fail somehow
                this.finish();
            }
        },
        finish: function () {
            if (!this.acceptsMoves) return;
            this.acceptsMoves = false;
            this.onFinish(this.attackList);
        }
    };
})(DefenseSession);