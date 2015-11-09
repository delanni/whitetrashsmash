(function () {
    window.addEventListener("load", runInit);

    function runInit() {
        // Load resources, instantiate game modell, subscribe its further init to the connection success

        var game = new Game();

        Connection.on("authenticated", function () {
            // Init view
            var phz = createPhaserGame(function (phz) {
                game.init(phz);
                var viewPageModel = new ViewPageModel(game.messageHub);
            });
        });
    };
})();