module.exports = function() { return function(server, cmd) {
  
  cmd('write', function(params, fn) {
    server.provider.writePath(params.path, params.data, fn);
  });
  
  cmd('read', function(params, fn) {
    server.provider.readPath(params.path, fn);        
  });
  
  cmd('list', function(params, fn) {
    server.provider.list(params.path, fn);
  });
  
  cmd('mkdir', function(params, fn) {
    server.provider.mkdir(params.path, fn);        
  });
  
  cmd('rm', function(params, fn) {
    server.provider.rm(params.path, {recursive: params.recursive}, fn);        
  });
  
}};