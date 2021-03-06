(function () {
    window.addEventListener("load", runInit);

    function runInit() {
        // Load resources, instantiate controller modell, subscribe its further init to the connection success

        var controller = new Controller();

        Connection.on("authenticated", function (data) {
            // Init controller
            controller.init(data);

            // if the page HTML does not derive and update from the controller state, update it manually
            var controls = document.getElementById("controls");
            var pageModel = new PageModel(controller.messageHub);

            var controlsHost = document.getElementById("controls");
            var controls = new HammerControls(controlsHost, controller.messageHub);
            var sound = new Sound(controller.messageHub);
        });
    };

    function initPage() {

    };
})();