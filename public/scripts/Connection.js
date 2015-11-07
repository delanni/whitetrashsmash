var Connection;
(function (Connection) {
    var MESSAGE_KEY = "message";

    __merge(Connection, EventEmitter);

    Connection.ONLINE = 1;
    Connection.AUTHENTICATED = 2;
    Connection.OFFLINE = 0;

    var socket = Connection.socket = io.connect();
    Connection.status = Connection.OFFLINE;

    socket.on("connect", function () {
        Connection.status = Connection.ONLINE;
        authenticate();
        sendOutgoing();
    });

    socket.on("disconnect", function () {
        Connection.status = Connection.OFFLINE;
    });

    var authenticate = function () {
        // Do handshake, pass messages around, shit like this
        // Server should know: Kind of client, name
        // Client should know: Id?, room info, ?

        Connection.status = Connection.AUTHENTICATED;
        Connection.trigger("authenticated", {});
    };

    var sendOutgoing = function () {
        while (Connection.outgoing.length) {
            var msg = Connection.outgoing.shift();
            msg.sentT = Date.now();
            Connection.socket.emit(MESSAGE_KEY, msg);
        }
    };

    Connection.outgoing = [];
    Connection.postMessage = function (messagePayload) {
        messagePayload.createdT = Date.now();
        if (Connection.status) {
            messagePayload.sentT = messagePayload.createdT;
            Connection.status.emit(MESSAGE_KEY, messagePayload);
        } else {
            Connection.outgoing.push(messagePayload);
        }
    }

})(Connection || {});