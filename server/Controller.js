var express = require('express'),
    router = express.Router();


function controller(game) {
    router.get('/', function (req, res) {
        res.redirect("../");
    });

    router.get('/random', function (req, res) {
        var gameId = game.randomRoom();
        if(!gameId) return res.status(404).end("There are no rooms to join! Go ahead and create one!");
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

    return router;
}

module.exports = controller;