var express = require('express'),
    router = express.Router();


function controller(game) {
    router.get('/', function (req, res) {
        createRoom(res);
    });

    router.get('/random', function (req, res) {
        var gameId = game.randomRoom();
        if (!gameId) return res.status(404).end("There are no rooms to join! Go ahead and create one!");
        res.redirect('/controller/' + gameId);
    });

    router.get('/:id', function (req, res) {
        var gameId = req.params.id;
        var room = game.rooms[gameId];
        if (!room) {
            res.status(404).end("No such room");
        } else {
            res.render("controller.html");
        }
    });

    function createRoom(res, gameId) {
        var room = game.createRoom(gameId);
        var gameId = room.id;
        res.redirect('/controller/' + gameId);
    }

    return router;
}

module.exports = controller;