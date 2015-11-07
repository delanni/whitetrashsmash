var express = require('express'),
    router = express.Router();


function viewer(game) {
    router.get('/', function (req, res) {
        createRoom(res);
    });

    router.get('/:id', function (req, res) {
        var gameId = req.params.id;
        if (!gameId) {
            createRoom(res);
        } else {
            room = game.rooms[gameId];
            if (!room) {
                res.status(400).end("No such room");
                //createRoom(res, gameId);
            } else {
                res.render("viewer.html");
            }
        }
    });

    function createRoom(res, gameId) {
        var room = game.createRoom(gameId);
        var gameId = room.id;
        res.redirect('/viewer/' + gameId);
    }

    return router;
}

module.exports = viewer;