module.exports = function() { return function(server, cmd) {
  
  cmd('write', function(params, fn) {
    console.log('< write ' + params.path);
    server.provider.writePath(params.path, params.params, fn);
  });
  
  cmd('read', function(params, fn) {
    console.log('< read ' + params.path);
    server.provider.readPath(params.path, fn);        
  });
  
  cmd('list', function(params, fn) {
    console.log('< list ' + params.path);
    server.provider.list(params.path, fn);
  });
  
  cmd('mkdir', function(params, fn) {
    console.log('< mkdir ' + params.path);
    server.provider.mkdir(params.path, fn);        
  });
  
  cmd('rm', function(params, fn) {
    console.log('< rm ' + (params.recursive ? '-r ' : '') + params.path);
    server.provider.rm(params.path, {recursive: params.recursive}, fn);        
  });
  
}};