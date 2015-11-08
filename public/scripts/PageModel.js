var PageModel = function (messageHub) {
    this.statusBar = document.querySelector("#statusBar");
    this.connectionIcon = document.querySelector("#connectionIcon");
    this.messageBar = document.querySelector("#message");
    this.livesContainer = document.querySelector("#lives");

    this.controls = document.querySelector("#controls");

    this.connectionIcon.classList.add(Connection.status ? "good" : "bad");

    this.init = function () {
        [].slice.call(this.livesContainer.children).forEach(function (heart, i) {
            setTimeout(function () {
                heart.classList.add("good");
            }, i * 150);
        });
    }

    Connection.on("authenticated", function () {
        this.connectionIcon.classList.remove("bad");
        this.connectionIcon.classList.add("good");
    }, this);

    Connection.on("offline", function () {
        this.connectionIcon.classList.remove("good");
        this.connectionIcon.classList.add("bad");
    }, this);

    messageHub.on("healthLost", function () {
        var health = [].slice.call(this.livesContainer.children).filter(function(e){return e.classList.contains("good")})[0];
        var container = this.livesContainer;
        health.classList.remove("good");
        health.classList.add("discolored");
    }, this);

    messageHub.on("messageBar", function (payload) {
        var text = payload.text || payload;
        var duration = payload.duration;
        var mb = this.messageBar;
        mb.textContent = text;
        if (duration) {
            setTimeout(function () {
                mb.textContent = "";
            }, duration);
        }
    }, this);

    messageHub.on("toggleCellColor", function (payload) {
        if (typeof payload == "string") {
            var cellId = payload;
        } else {
            var cellId = payload.cellId;
            var set = payload.value;
        }
        var cell = document.querySelector("#" + cellId.replace("#", ""));
        if (!cell) return;
        if (typeof set == 'undefined') {
            cell.classList.toggle("colored");
        } else {
            cell.classList[set ? "add" : "remove"]("colored");
        }
    });

    messageHub.on("statusChange", function (payload) {
        if (payload.status === StateMachine.STATE.ATTACKING || payload.status === StateMachine.STATE.DEFENDING) {
            messageHub.postMessage("toggleCellColor", {
                value: true,
                cellId: "top"
            });
            messageHub.postMessage("toggleCellColor", {
                value: true,
                cellId: "mid"
            });
            messageHub.postMessage("toggleCellColor", {
                value: true,
                cellId: "bot"
            });
        } else if (payload.status === StateMachine.STATE.WAITING) {
            messageHub.postMessage("toggleCellColor", {
                value: false,
                cellId: "top"
            });
            messageHub.postMessage("toggleCellColor", {
                value: false,
                cellId: "mid"
            });
            messageHub.postMessage("toggleCellColor", {
                value: false,
                cellId: "bot"
            });
        }
    }, this);

    messageHub.on("queryReadyState", function () {
        return document.querySelectorAll(".colored").length;
    });

    this.init();
};