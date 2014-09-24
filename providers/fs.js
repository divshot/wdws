var fs = require('fs-extra');
var pth = require('path');
var dir = require('node-dir');

var _err = function(status, error, error_description) {
  return {
    status: status,
    error: error,
    error_description: error_description
  }
}

var ERRORS = {
  illegal_path: _err(400, 'illegal_path', 'Invalid path syntax.')
}

function FSProvider(options) {
  this.root = pth.resolve(options.root || require('os').tmpdir() + "/fsprovider-" + Math.random().toString().substr(2));
}

// ensure that the absolute resolved path is inside the root
FSProvider.prototype.securePath = function(path) {
  if (path) {
    path = this.root + path;
  }
  var resolvedPath = pth.resolve(path);
  
  if (resolvedPath.indexOf(this.root) === 0) {
    return resolvedPath;
  } else {
    return false;
  }
}

FSProvider.prototype.fullPath = function(path) {
  return '/' + pth.relative(this.root, pth.resolve(path));
}

FSProvider.prototype.list = function(path, callback) {
  path = this.securePath(path);
  if (!path){ callback(ERRORS.illegal_path); return; }
  
  var that = this;
  fs.readdir(path, function(err, files) {
    if (err){ callback(_err(500, 'unknown_error', err)); return;}
    
    callback(files.map(function(file) {
      var resolvedPath = pth.join(path, file);
      
      var stat = fs.lstatSync(resolvedPath);
      return {
        isDirectory: stat.isDirectory(),
        isFile: stat.isFile(),
        name: pth.basename(file),
        fullPath: that.fullPath(resolvedPath)
      }
    }));
  });
}

FSProvider.prototype.writePath = function(path, content, callback) {
  path = this.securePath(path);
  if (!path){ callback(ERRORS.illegal_path); return; }
  fs.outputFile(path, content, callback);
}

FSProvider.prototype.readPath = function(path, callback) {
  path = this.securePath(path);
  if (!path){ callback(ERRORS.illegal_path); return; }
  fs.readFile(path, {encoding: 'utf8'}, callback);
}

module.exports = FSProvider;