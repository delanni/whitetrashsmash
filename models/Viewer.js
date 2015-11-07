var Viewer = function(connection, options){
    this.connection = connection;
    this.id = connection.id;
    this.name = connection.name;
    
};

// Message received, pipe it down to the client
// TODO: probably shouldn't assume its only a ctr -> view message
Viewer.prototype.onMessage = function(messageType, controllerId, payload){
    var message = {
        type: messageType,
        sender: controllerId,
        payload: payload,
        timestamp: new Date()
    };
    this.connection.emit('gameEvent', message);
};

module.exports = Viewer;