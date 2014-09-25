var Socket = function(server, socket) {
  this.server = server;
  this.socket = socket;
  
  var that = this;
  Object.keys(server.commands).forEach(function(command) {
    that.socket.on(command, function(params, fn) {
      console.log("<< ", command, JSON.stringify(params));
      server.commands[command].call(that, params, function() {
        console.log(">> ", command, JSON.stringify(Array.prototype.slice.call(arguments, 0)));
        fn.apply(null, arguments);
      });
    });
  });
};

module.exports = Socket;