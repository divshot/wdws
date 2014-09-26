var Socket = function(server, socket) {
  this.server = server;
  this.socket = socket;

  var that = this;
  Object.keys(server.commands).forEach(function(commandName) {
    var command = server.commands[commandName];
    that.socket.on(commandName, function(params, fn) {
      console.log("<<<", commandName, JSON.stringify(params));
      
      command.handler.call(that, params, function() {
        var args = Array.prototype.slice.call(arguments, 0);
        
        console.log(">>>", commandName, JSON.stringify(args));
        fn.apply(null, arguments);
      });
    });
  });
};

Socket.prototype.pm = function(pid) {
  var args = Array.prototype.slice.call(arguments, 0)
  args.unshift('pm');
  this.socket.emit.apply(this.socket, args);
}

module.exports = Socket;