var express = require('express'),
    socketio = require('socket.io'),
    ejs = require("ejs"),
    Game = require('./models/Game'),
    Connection = require('./models/Connection'),
    game = new Game(),
    app = express(),
    port = process.env.PORT || 8080;

// disable layout
app.set("view options", {
    layout: false
});
app.engine('html', ejs.renderFile);
app.set("views", "./views");
app.use(express.static(__dirname + '/public'));

app.use('/viewer', require('./server/Viewer')(game));
app.use('/controller', require('./server/Controller')(game));

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    var io = socketio.listen(server);

    io.on('connection', function (socket) {
        var connection = new Connection(socket);
        game.addConnection(connection);
    });

    console.log('Listening at http://%s:%s', host, port);
});