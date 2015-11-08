var MessageHub = function () {
    this.socket = Connection.socket;
    Connection.socket.on(Connection.MESSAGE_KEY, this._handleMessage.bind(this));

    this.logStore = [];

    MessageHub.hubs = MessageHub.hubs || {};
    var name = "MessageHub" + Object.keys(MessageHub.hubs).length;
    MessageHub.hubs[name] = this;
};

(function (MessageHub) {
    MessageHub.OUTGOING = "OUTGOING";
    MessageHub.INCOMING = "INCOMING";
    MessageHub.INTERNAL = "INTERNAL";
    MessageHub.INTERNAL_IMMEDIATE = "IMMEDIATE";

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
            console.log("<MH>",logObject, wrapped);
        },

        _handleMessage: function (messagePayload) {
            // check validity somehow if necessary
            var messageType = messagePayload.type;
            var payload = messagePayload.payload;
            this.trigger(messageType, payload);
            this.log(MessageHub.INCOMING, messagePayload);
        },

        sendMessage: function (type, payload) {
            var wrapped = {
                type: type,
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
            this.log(MessageHub.INTERNAL, type, payload);
            this.triggerAsync(type, payload);
        },

        // Right now this is not functional. Immediate posting should handle return values
        postImmediateMessage: function (type, payload) {
            this.log(MessageHub.INTERNAL_IMMEDIATE, type, payload);
            var retVal = this.trigger(type, payload);
            return retVal;
        }
    };

    __merge(MessageHub.prototype, EventEmitter);
})(MessageHub);