var EventEmitter = {
    /**
     * Subscribe a callback to an event name
     * @param {String}   eventName Name of the event, that serves as a key
     * @param {Function} callback  The callback to invoke when the event is triggered. The event will be executed in the context of the host object
     */
    on: function (eventName, callback, context) {
        if (!this._eventListeners) {
            this._eventListeners = {};
        }
        if (!this._eventListeners[eventName]) {
            this._eventListeners[eventName] = [];
        }
        if (context) callback.contxt = context;
        this._eventListeners[eventName].push(callback);
    },
    /**
     * Unsubscribe a particular handler, or all the handlers from the given event
     * @param {String}   eventName Name, key of the event
     * @param {Function} callback The event handler to remove from the function, if omitted, all handlers will be removed
     */
    off: function (eventName, callback) {
        if (!this._eventListeners) return;

        var listeners = this._eventListeners[eventName];
        if (listeners && listeners.indexOf(callback) >= 0) {
            listeners.splice(listeners.indexOf(callback), 1);
        } else if (listeners && !callback) {
            listeners = [];
        }
    },

    /**
     * Fires a particular event with the given parameters
     * @param {String} eventName       Event name to fire
     * @param {Object} Var arg list of arguments to pass to the callback
     */
    trigger: function (eventName) {
        var args = [].slice.call(arguments);
        var eventName = args.shift();
        if (this._eventListeners && this._eventListeners.hasOwnProperty(eventName)) {
            var listeners = this._eventListeners[eventName];
            var returnValues = [];
            listeners.forEach(function (listener) {
                returnValues.push(listener.apply(listener.context || this, args));
            }, this);
            return returnValues;
        }
    },

    /**
     * Fires a particular event with the given parameters, in asynchronous manner, so it will not block the main caller
     * @param {String} eventName       Event name to fire
     * @param {Object} Var arg list of arguments to pass to the callback
     */
    triggerAsync: function (eventName) {
        var ctx = this;
        var args = arguments;
        setTimeout(function () {
            ctx.trigger.apply(ctx, args);
        }, 0);
    }
};