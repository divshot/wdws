# WDWS: Working Directory Web Service

WDWS is a thin layer of abstraction over a filesystem directory. It is intended
to allow for a user to perform actions (like reading and writing files) in the
directory in a safe and simple manner.

WDWS uses Web Sockets (via [Socket.io](http://socket.io)) to layer a lightweight
protocol into the service. At the same time, the WDWS server acts as a static
web host, allowing you to simultaneously modify and view your work.

## Install

    npm install wdws

## Basic Usage

First, you'll need a WDWS server running.

```js
var wdws = require('wdws');
var FSProvider = require('wdws/providers/fs');

var server = new wdws.Server({
  provider: new FSProvider({
    root: __dirname + '/storage'
  })
});

server.listen(8080);
```

### Client

See [wdws-client] for information about how to connect to and perform commands
on a WDWS server.

## Todo

### For Prototype

- [x] Use the provider as a static web host as well as a protocol
- [ ] Add support for "plugins" for things like Bower, Git
- [x] Write a browser client to cleanly wrap the protocol
- [x] See if we can make a more standard callback pattern
- [x] Paths should be absolute to the root, not fully resolved

### For Public

- [ ] Authentication/Authorization