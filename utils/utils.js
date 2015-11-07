var T = require('./tracing');

module.exports = {
    attachHandlers: attachHandlers
};

function attachHandlers(connection, self) {
    Object.keys(self.handlers).forEach(function (handlerName) {
        var handler = self.handlers[handlerName];
        connection.on(handlerName, function (payload) {
            handler.call(self, connection, payload);
        });
    });
};