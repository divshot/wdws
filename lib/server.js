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

  if (typeof options.static === 'function') {
    this.app.use(options.static);
    console.log('--> Loaded custom static web server');
  } else if (options.static === false) {
    console.log('--> Static Web Server Disabled');
  } else {
    var staticServer = this.provider.static();
    if (staticServer) {
      console.log('--> Using default static web server');
      this.app.use(staticServer);
    } else {
      console.log('--> Provider did not offer default static web server');
    }
  }
  
  var that = this;
  this.io.on('connection', function(socket) {
    var client = that.addClient(new Socket(that, socket));
    socket.on('disconnect', function() {
      that.removeClient(client);
      console.log("xxx", "Client disconnected. Total:", that.clients.length);
    });
  });
  
  if (!options.bare) {
    this.use('util', require('../modules/util')());
    this.use('fs', require('../modules/fs')());
  }
};

Server.prototype.use = function(namespace, mod) {
  var count = 0;
  var that = this;
  mod(this, function(name, handler, options) {
    that.registerCommand(namespace, name, handler, options);  
    count++;
  });
  console.log("--> [" + namespace + "] registered " + count + " commands");
}

Server.prototype.registerCommand = function(namespace, name, handler, options) {
  var cmdName = [namespace, name].join('.');
  if (this.commands[cmdName]) {
    throw new Error("CONFLICT: " + cmdName + " is already registered"); 
  };
  this.commands[cmdName] = {
    handler: handler,
    options: options
  };
}

Server.prototype.listen = function(port) {
  this.server.listen(port);
  console.log("*** Listening on port " + port);
};

Server.prototype.addClient = function(client) {
  this.clients.push(client);
  console.log("+++ Client connected. Total:", this.clients.length);
};

Server.prototype.removeClient = function(client) {
  var i = this.clients.indexOf(client);
  if (i >= 0) {
    this.clients.splice(i, 1);
    console.log("[client disconnected] connections=" + this.clients.length);
  }
};

module.exports = Server;