var wdws = require('../../index.js');
var FSProvider = require('../../providers/fs');

var server = new wdws.Server({
  provider: new FSProvider({
    root: __dirname + '/storage'
  })
});

server.listen(process.env.PORT || 8080);

var express = require('express');
var app = express();

app.use(express.static(__dirname + "/public"));
app.listen(3000);