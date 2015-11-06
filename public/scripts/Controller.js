var Controller = function (options) {
    merge(this, Controller.defaults, options);
};

(function (Controller) {
    Controller.defaults = {
        
    };
    
    Controller.prototype = {
        init: function(){
            this.messageHub = new MessageHub();
        }
    };
    
    __merge(Controller, EventEmitter);
})(Controller);