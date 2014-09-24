var io = require('socket.io-client');
var Promise = require('promise');

function WDWSClient(url) {
  this.io = io(url);
}

WDWSClient.prototype.command = function(name, command, callback) {
  var that = this;
  return new Promise(function(resolve, reject) {
    that.io.emit(name, command, function(err) {
      var rest = Array.prototype.slice.call(arguments, 1);
      // console.log(err, rest);
      err ? reject(err) : resolve.apply(null, rest);
    });
  }).nodeify(callback);
}

WDWSClient.prototype.list = function(path, callback) {
  return this.command('list', {path: path}, callback);
}

WDWSClient.prototype.put = function(path, data, callback) {
  return this.command('put', {path: path, data: data}, callback);
}

WDWSClient.prototype.get = function(path, callback) {
  return this.command('get', {path: path}, callback);
}

WDWSClient.prototype.mkdir = function(path, callback) {
  return this.command('mkdir', {path: path}, callback);
}

module.exports = WDWSClient;