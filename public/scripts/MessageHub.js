var MessageHub = function () {
    this.socket = Connection.socket;
    Connection.on("message", this._handleMessage);

    this.logStore = [];

    MessageHub.hubs = MessageHub.hubs || {};
    var name = "MessageHub" + Object.keys(MessageHub.hubs).length;
    MessageHub.hubs[name] = this;
};

(function (MessageHub) {
    MessageHub.OUTGOING = 0;
    MessageHub.INCOMING = 1;
    MessageHub.INTERNAL = 2;
    MessageHub.INTERNAL_IMMEDIATE = 3;

    MessageHub.prototype = {
        log: function () {
            var args = [].slice.call(arguments);
            var kind = args[0];
            if (args.length <= 2) {
                var wrapped = arguments[1];
            } else {
                var wrapped = {
                    messageType: arguments[1],
                    payload: arguments[2]
                }
            }
            var logObject = {
                timestamp: Date.now(),
                kind: kind,
                message: wrapped
            };
            this.logStore.push(logObject);
            console.log(logObject);
        },

        _handleMessage: function (messagePayload) {
            // check validity somehow if necessary
            var messageType = messagePayload.messageType;
            var payload = messagePayload.payload;
            this.trigger(messageType, payload);
            this.log(MessageHub.INCOMING, messagePayload);
        },

        sendMessage: function (type, payload) {
            var wrapped = {
                messageType: type,
                payload: payload
            };
            Connection.postMessage(wrapped);
            this.log(MessageHub.OUTGOING, wrapped);
        },

        /**
         * Post message for the internal system for async handling
         * @param {String} type    Message type
         * @param {Object} payload Payload of the message
         */
        postMessage: function (type, payload) {
            // TODO: If we don't bind us to the fact, that the system is a local/internal subsystem,
            // then these messages may be wrapped up and proxied forward to a remote messagehub
            this.triggerAsync(type, payload);
            this.log(MessageHub.INTERNAL, type, payload);
        },

        // Right now this is not functional. Immediate posting should handle return values
        postImmediateMessage: function (type, payload) {
            this.trigger(type, payload);
            this.log(MessageHub.INTERNAL_IMMEDIATE, type, payload);
        }
    };

    __merge(MessageHub.prototype, EventEmitter);
})(MessageHub);