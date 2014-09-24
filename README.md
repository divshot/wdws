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

On the client:

```html
<script src="wdws-client.js"></script>

<script>
  var wdws = new WDWSClient('http://wdws.example.com');
  
  var handleError = function(err){ throw err; }
  
  wdws.put('/index.html', '<h1>Hello, World!</h1>').then(function() {
    return wd.list('/');
  }).then(function(files) {
    console.log("Files", files);
  }, handleError);
</script>
```

## Client API

All methods return promises (the preferred way to call the API) but are also
wrapped in node-like callbacks (with `err` as the first argument).

* **new WDWSClient(url)** - connect to WDWS server at specified URL
* **client.ls(path)** - calls back with one argument, an array of files
* **client.put(path, data)** - write `data` to `path`
* **client.get(path)** - calls back with one argument, the contents of specified file
* **client.mkdir(path)** - makes a directory at the specified path


## Todo

### For Prototype

- [x] Use the provider as a static web host as well as a protocol
- [ ] Add support for "plugins" for things like Bower, Git
- [x] Write a browser client to cleanly wrap the protocol
- [x] See if we can make a more standard callback pattern
- [x] Paths should be absolute to the root, not fully resolved

### For Public

- [ ] Authentication/Authorization