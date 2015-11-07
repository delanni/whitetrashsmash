var Game = function (options) {
    merge(this, Game.defaults, options);
};

(function (Game) {
    Game.defaults = {
        
    };
    
    Game.prototype = {
        init: function(){
            this.messageHub = new MessageHub();
        }
    };
    
    __merge(Game, EventEmitter);
})(Game);
