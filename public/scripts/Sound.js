function Sound(messageHub) {

    var swipeSound = new Audio('/sounds/swipe');
    var gestureSounds = {
        tap: new Audio('/sounds/tap'),
        swipeleft: swipeSound,
        swiperight: swipeSound
    };

    messageHub.on("gesture", function(data) {
        var type = data.gestureType;
        gestureSounds[type].play()
    });

};
