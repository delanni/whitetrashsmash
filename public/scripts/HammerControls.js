function HammerControls(el, messageHub) {
    var top = el.children[0];
    var mid = el.children[1];
    var bottom = el.children[2];

    [].slice.call(el.children).forEach(function (divElement) {
        var hammer = new Hammer(divElement);
        
        ["tap", "swipeleft", "swiperight"].forEach(function(gesture) {
            hammer.on(gesture, function(ev) {
                messageHub.postMessage("gesture", {
                    gestureType: gesture,
                    gestureArea: divElement.id
                }); 
            });

        });
    });
};
