var ViewPageModel = function (messageHub) {
    this.messageHub = messageHub;

    this.messageBar = document.querySelector("#messageBar");

    messageHub.on("messageBar", function (payload) {
        var text = payload.text || payload;
        var duration = payload.duration;
        var mb = this.messageBar;
        mb.innerHTML = text;
        if (duration) {
            setTimeout(function () {
                mb.innerHTML = "";
            }, duration);
        }
    }, this);
}