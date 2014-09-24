# WDWS: Working Directory Web Service

WDWS is a thin layer of abstraction over a filesystem directory. It is intended
to allow for a user to perform actions (like reading and writing files) in the
directory in a safe and simple manner.

WDWS uses Web Sockets (via [Socket.io](http://socket.io)) to layer a lightweight
protocol into the service. At the same time, the WDWS server acts as a static
web host, allowing you to simultaneously modify and view your work.

## Install

    npm install wdws

## Usage

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

On the client:

```html
<script src="http://localhost:8080/socket.io/socket.io.js"></script>

<script>
  var wdws = io.connect('http://localhost:8080/');
  wdws.emit('list', function(files) {
    if (!files.error) {
      // files is a list of file paths 
    }
  });
  
  wdws.emit('read', '/index.html', function(data) {
    if (!data.error) {
      // data is a string with file contents
    }
  });
  
  wdws.emit('write', '/index.html', 'Hello World', function(err) {
    if (!err) {
      // it worked!
    }
  }
</script>
```

## Todo

- [ ] Use the provider as a static web host as well as a protocol
- [ ] Add support for "plugins" for things like Bower, Git
- [ ] Write a browser client to cleanly wrap the protocol
- [x] See if we can make a more standard callback pattern
- [x] Paths should be absolute to the root, not fully resolved