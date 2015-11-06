(function () {
    window.addEventListener("ready", runInit);

    function runInit() {
        // Load resources, instantiate controller modell, subscribe its further init to the connection success

        var controller = new Controller();

        Connection.on("authenticated", function () {
            // Init controller
            controller.init();
            // if the page HTML does not derive and update from the controller state, update it manually
            // initPage();
        });
    };
})();