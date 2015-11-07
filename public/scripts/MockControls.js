function MockControls(el, messageHub) {
    var top = el.children[0];
    var mid = el.children[1];
    var bottom = el.children[2];

    [].slice.call(el.children).forEach(function (parent) {
        [].slice.call(parent.children).forEach(function (i) {
            i.onclick = function () {
                messageHub.postMessage("gesture", {
                    gestureSource: i,
                    gestureType: i.classList[0],
                    gestureArea: parent.id
                });
            };
        });
    });
};