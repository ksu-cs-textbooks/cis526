---
title: "The Importance of Being Async"
pre: "4. "
weight: 40
date: 2018-08-24T10:53:26-05:00
---

You may have noticed that we used the asynchronous version of `fs.readFile()` in our response handler.  This is critical to good performance with a Node-based webserver - any potentially blocking action taken in the request handler should be asynchronous, because _all incoming requests_ must be processed on the same thread.  If our event loop gets bogged down handling a blocked process, then _nobody gets a response_!

Consider if we implemented one of the file serving options using the synchronous `fs.readFileSync()`:

```js
    // TODO: Serve the site js file 
    try {
      var body = fs.readFileSync('site.js');
      res.writeHead(200, {
        "Content-Type": "application/javascript",
        "Content-Length": body.length
      }).end(body, "utf8");
    } catch(err) {
        res.writeHead(500).end();
    }
```

It does not look that different from the asynchronous version, but consider what happens if _site.js_ cannot be opened immediately (perhaps it is locked by a system process that is modifying it).  With the synchronous version, we wait for the file to become available.  While we wait, incoming requests are added to our event queue... and none are processed, as the event loop is paused while we are waiting for `fs.readFileSync('site.js')` to resolve.  If it takes more than three seconds, the clients that are waiting will start seeing timeouts in their browsers, and will probably assume our site is down.

![Async vs Sync operations in the Event Loop](/images/5.4.1.png)

In contrast, if we used the asynchronous version, the reading of the file is handed off to another thread when `fs.readFile()` is invoked.  Any additional processing to do within the event loop for this request is finished, and the next task is pulled from the event queue.  Even if our request for the original file never completes, we still are serving requests as quickly as we get them.

This asynchronous approach is key to making a Node-based website perform and scale well.  But it is vitally important that you, as a web developer, _understand_ both why using asynchronous processes is important, and _how_ to use them correctly.  Because if you don't, your application performance can be much, much worse than with other approaches.