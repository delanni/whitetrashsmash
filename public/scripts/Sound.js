function Sound(messageHub) {

    var gestures = ["tap", "swipeleft", "swiperight"];
    var areas = ["top", "mid", "bot"];

    var events = {
        hit: ["hit1", "hit2", "hit3"],
        healthLost: ["healthLost"],
        newTurn: ["newTurn"],
        block: ["block"],
        die: ["die"]
    };

    var soundDictionary = {};

    gestures.forEach(function (gesture) {
        areas.forEach(function (area) {
            var key = gesture + "_" + area;
            var sound = new Audio('/sounds/gestures/' + key);
            soundDictionary[key] = sound;
        });
    });

    messageHub.on("gesture", function (data) {
        var type = data.gestureType;
        var area = data.gestureArea;
        var key = type + "_" + area;

        soundDictionary[key] && soundDictionary[key].play();
    });

    Object.keys(events).forEach(function (key) {
        soundDictionary[key] = events[key].map(function (filename) {
            return new Audio('/sounds/' + filename);
        });

        messageHub.on(key, function (data) {
            var sounds = soundDictionary[key];
            var randomSound = sounds[Math.floor(Math.random() * sounds.length)];
            randomSound.play();
        });
    });

};