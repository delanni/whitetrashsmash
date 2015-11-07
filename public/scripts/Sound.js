function Sound(messageHub) {

    var gestures = ["tap", "swipeleft", "swiperight"];

    var events = {
        hit: ["hit1", "hit2", "hit3"]
    };

 

    var gestureSounds = {};
    gestures.forEach(function(gesture) {
        var sound = new Audio('/sounds/gestures/' + gesture);
        gestureSounds[gesture] = sound;
    });

    messageHub.on("gesture", function(data) {
        var type = data.gestureType;
        if (type in gestureSounds) {
            gestureSounds[type].play();
        } else {
            console.log("Tried to play sound for " + type + " gesture, but it doesn't exist!");
        }
    });

    for (var key in events) {
        if (events.hasOwnProperty(key)) {
            var sounds = events[key].map(function(filename) {
                return new Audio('/sounds/' + filename);
            });

            console.log("Adding handler to " + key + " event");
            messageHub.on(key, function(data) {
                console.log("Playing sound on " + key + " event");
                var randomSound = sounds[Math.floor(Math.random() * sounds.length)];
                randomSounds.play();
            });
        }
    }

};
