var wdws = require('../index.js');
var FSProvider = require('../providers/fs');

var server = new wdws.Server({
  provider: new FSProvider({
    root: __dirname + '/storage'
  })
});

server.listen(process.env.PORT || 8080);