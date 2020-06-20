---
title: "Caching for the Win"
pre: "5. "
weight: 50
date: 2018-08-24T10:53:26-05:00
---

In our example web server, we argued that asynchronous file reading was better than synchronous because reading from a file is a potentially blocking operation that can take a long time to perform.  But even when it doesn't block, it can still take a lot of time, making it the most _expensive_ part of our request handling operation in terms of the time it takes to perform.  

If we really want to squeeze all the performance we can out of our server (and therefore handle as many users as possible), we need to consider the strategy of [caching](https://en.wikipedia.org/wiki/Cache_(computing)).  This means storing our file content in a location where access is faster - say in _memory_ rather than on the _disk_.  Variables in our application are stored in RAM, even variables whose contents were initialized from disk files. Thus, assigning the contents of a file to a variable effectively caches it for faster access.  

Moreover, because Node variables are only accessible from the Node process, which from our perspective in the event loop is single-threaded, we don't have to worry about blocking once the file has been loaded.  One strategy we can employ is to pre-load our files using synchronous operations, i.e.:

```js 
const http = require('http');
const fs = require('fs');

const html = fs.readFileSync('index.html');
const css = fs.readFileSync('site.css');
const js = fs.readFileSync('site.js');
``` 

Now we can define our revised event handler, which uses the cached versions:

```js
function handleRequest(req, res) {
    if(req.method === "GET") {
        switch(req.url) {
            case "/index.html":
                // Serve the index page 
                res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': html.length}).end(html);
                break;
            case "/site.css":
                // Serve the css file 
                res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': css.length}).end(css);
                break;
            case "/site.js":
                // Serve the js file
                res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': js.length}).end(js);
                break;
            default:
                // Serve a 404 Not Found response
                res.writeHead(404).end();
        }
    } else {
        // Serve a 501 Not Implemented response
        res.writeHead(501).end();
    }
}
```

Finally, we create and start the server:

```js
var server = http.createServer(handleRequest);
server.listen(80, ()=>{
    console.log("Server listening on port 80");
});
```

Notice in this server implementation we use the _synchronous_ `fs.readFileSync()`, and we don't wrap it in a `try ... catch`.  That means if there is a problem loading one of the files, our Node process will crash.  But as these files are loaded _first_, before the server starts, we should see the error, and realize there is a problem with our site files that needs fixed.  This is one instance where it _does_ make sense to use synchronous file calls.

While caching works well in this instance, like everything in computer science it doesn't work well in all instances.  Consider if we had a server with _thousands_ of files - maybe images that were each 500 Megabytes.  With only a thousand images, we'd have 500 Gigabytes to cache... which would mean our server would need a _lot_ of expensive RAM.  In a case like that, asynchronous file access when the file is requested makes far more sense. 

Also, depending on the use pattern it may make sense to cache _some_ of the most frequently requested images.  With careful design, this caching can be dynamic, changing which images are cached based on how frequently they are requested while the server is running.