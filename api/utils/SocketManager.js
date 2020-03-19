var SocketManager = (function () {

    let instance;

    function init(server) {
        this.io = require('socket.io')(server);
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = this;
            }
            return instance;
        },
        init: init
    };
})();

module.exports = SocketManager.getInstance();