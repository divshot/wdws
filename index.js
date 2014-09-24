var express = require('express');
var http = require('http');
var SocketIO = require('socket.io');

var WDWS = {};

WDWS.Server = function(options) {
  this.app = express();
  this.server = http.Server(this.app);
  this.io = SocketIO(this.server);
  this.clients = [];
  this.provider = options.provider;
  
  var _server = this;
  this.io.on('connection', function(socket) {
    _server.addClient(new WDWS.Socket(_server, socket));
  });
}

WDWS.Server.prototype.listen = function(port) {
  this.server.listen(port);
}

WDWS.Server.prototype.addClient = function(client) {
  this.clients.push(client);
  console.log("[client connected] connections=" + this.clients.length);
}

WDWS.Server.prototype.removeClient = function(client) {
  var i = this.clients.indexOf(client);
  if (i >= 0) {
    this.clients.splice(i, 1);
    console.log("[client disconnected] connections=" + this.clients.length);
  }
}

WDWS.Socket = function(server, socket) {
  this.server = server;
  this.socket = socket;
  
  this.socket.on('put', this.handleWrite.bind(this));
  this.socket.on('get', this.handleRead.bind(this));
  this.socket.on('list', this.handleList.bind(this));
}

WDWS.Socket.prototype.handleWrite = function(command, fn) {
  console.log('< write ' + command.path);
  this.server.provider.writePath(command.path, command.data, fn);
}

WDWS.Socket.prototype.handleRead = function(command, fn) {
  console.log('< read ' + command.path);
  this.server.provider.readPath(command.path, function(err, data) {
    console.log(data);
    err ? fn(err) : fn(null, data);
  });
}

WDWS.Socket.prototype.handleList = function(command, fn) {
  console.log('< list');
  this.server.provider.list(command.path, function(err, data) {
    err ? fn(err) : fn(null, data);
  });
}

module.exports = WDWS;