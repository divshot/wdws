var io = require('socket.io-client');
var Promise = require('promise');

function WDWSClient(url) {
  this.io = io(url);
}

WDWSClient.prototype.list = function(path, callback) {
  var that = this;
  return new Promise(function(resolve, reject) {
    that.io.emit('list', {path: path}, function(err, files) {
      console.log(arguments);
      err ? reject(err) : resolve(files)
    });
  }).nodeify(callback);
}

WDWSClient.prototype.put = function(path, data, callback) {
  var that = this;
  return new Promise(function(resolve, reject) {
    that.io.emit('put', {path: path, data: data}, function(err) {
      err ? reject(err) : resolve()
    });
  }).nodeify(callback);
}

WDWSClient.prototype.get = function(path, callback) {
  var that = this;
  return new Promise(function(resolve, reject) {
    that.io.emit('get', {path: path}, function(err, data) {
      err ? reject(err) : resolve(data)
    });
  }).nodeify(callback);
}

module.exports = WDWSClient;