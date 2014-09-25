var express = require('express');
var SocketIO = require('socket.io');
var Socket = require('./socket.js');
var http = require('http');

function Server(options) {
  this.app = express();
  this.server = http.Server(this.app);
  this.io = SocketIO(this.server);
  this.clients = [];
  this.commands = {};
  this.provider = options.provider;

  var staticServer = this.provider.static();
  if (staticServer) {
    this.app.use(staticServer);
  }
  
  var that = this;
  this.io.on('connection', function(socket) {
    that.addClient(new Socket(that, socket));
  });
  
  if (!options.bare) {
    this.use('fs', require('../modules/fs')());
  }
};

Server.prototype.use = function(namespace, mod) {
  var count = 0;
  var that = this;
  mod(this, function(name, handler) {
    that.registerCommand(namespace, name, handler);  
    count++;
  });
  console.log("-> [" + namespace + "] registered " + count + " commands");
}

Server.prototype.registerCommand = function(namespace, name, handler) {
  var cmdName = [namespace, name].join('.');
  if (this.commands[cmdName]) {
    throw new Error("CONFLICT: " + cmdName + " is already registered"); 
  };
  this.commands[cmdName] = handler;
}

Server.prototype.listen = function(port) {
  this.server.listen(port);
  console.log("** Listening on port " + port);
};

Server.prototype.addClient = function(client) {
  this.clients.push(client);
  console.log("[client connected] connections=" + this.clients.length);
};

Server.prototype.removeClient = function(client) {
  var i = this.clients.indexOf(client);
  if (i >= 0) {
    this.clients.splice(i, 1);
    console.log("[client disconnected] connections=" + this.clients.length);
  }
};

module.exports = Server;