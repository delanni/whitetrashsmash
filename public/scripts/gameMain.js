(function () {
    window.addEventListener("ready", runInit);

    function runInit() {
        // Load resources, instantiate game modell, subscribe its further init to the connection success

        //var game = new Game();

        Connection.on("authenticated", function () {
            // Init controller
            //game.init();
            // if the page HTML does not derive and update from the game state, update it manually
            // initPage();
        });
    };
})();