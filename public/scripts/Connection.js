var Connection;
(function (Connection) {
    Connection.MESSAGE_KEY = "gameEvent";

    __merge(Connection, EventEmitter);

    Connection.ONLINE = 1;
    Connection.AUTHENTICATED = 2;
    Connection.OFFLINE = 0;

    var socket = Connection.socket = io.connect();
    Connection.status = Connection.OFFLINE;

    socket.on("connect", function () {
        Connection.status = Connection.ONLINE;
        Connection.trigger("online");
        authenticate();
        sendOutgoing();
    });

    socket.on("disconnect", function () {
        Connection.status = Connection.OFFLINE;
        Connection.trigger("offline");
    });
    
    socket.on("welcome", function(data) {
        console.log("Welcome!");
        Connection.status = Connection.AUTHENTICATED;
        Connection.trigger("authenticated", data);
    });

    socket.on("gameEvent", function(data) {
        console.log("gameEvent: ", data);
    });

    var authenticate = function () {
        // Do handshake, pass messages around, shit like this
        // Server should know: Kind of client, name
        // Client should know: Id?, room info, ?

        console.log("Trying to join");

        var roomId = window.location.pathname.split("/").pop();
        Connection.socket.emit('joinRoom', {roomId: roomId});
    };

    var sendOutgoing = function () {
        while (Connection.outgoing.length) {
            var msg = Connection.outgoing.shift();
            msg.sentT = Date.now();
            Connection.socket.emit(Connection.MESSAGE_KEY, msg);
        }
    };

    Connection.outgoing = [];
    Connection.postMessage = function (messagePayload) {
        messagePayload.createdT = Date.now();
        if (Connection.status) {
            messagePayload.sentT = messagePayload.createdT;
            Connection.socket.emit(Connection.MESSAGE_KEY, messagePayload);
        } else {
            Connection.outgoing.push(messagePayload);
        }
    }

})(Connection || (Connection = {}));
