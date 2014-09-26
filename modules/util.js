// A set of utility commands for inspecting and interacting with
// WDWS. These commands are available by default when initializing
// a WDWS server unless it it initialized with `{bare: true}` as
// an option.
//
// ## Commands

module.exports = function() { return function(server, cmd) {

  // ### util.ping
  // 
  // Just a simple ping to make sure things are working.
  // 
  // #### Response
  //
  // * `"pong"`
  cmd('ping', function(params, fn) {
    fn(null, 'pong');
  });
  
  // ### util.commands
  // 
  // List commands currently registered on the WDWS server.
  // 
  // #### Params
  // 
  // * `namespace`: list commands for the specified namespace only (optional)
  // 
  // #### Response
  // 
  // * `Array` of commands. Will include namespace (e.g. `util.commands`) unless
  //   `namespace` param was passed, in which case namespace will be excluded.
  cmd('commands', function(params, fn) {
    var commands = Object.keys(server.commands);
    
    if (params.namespace) {
      var filtered = [];
      commands.forEach(function(command) {
        if (command.indexOf(params.namespace + '.') === 0) {
          filtered.push(command.split('.')[1]);
        }
      });
      fn(null, filtered);
    } else {
      fn(null, commands);
    }
  });
  
}};