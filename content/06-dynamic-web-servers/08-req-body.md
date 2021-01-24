---
title: "Request Body"
pre: "8. "
weight: 80
date: 2018-08-24T10:53:26-05:00
---

While many HTTP libraries will process the entire incoming request before passing control to the program, Node's `http` module takes a different approach.  It constructs and passes the `http.IncomingMessage` and `http.ServerResponse` objects as soon as it has received the header portion of the request.  This means the body may still be being transmitted to the server as you start to process the request.

This is fine for GET requests, as they don't have a body.  But for requests that _do_ have a body, it means you have to process the incoming data yourself.

To do so, there are three events made available in the [http.IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) object: `data`, `end`, and `error`.

The `data` event occurs whenever a new chunk of the body is available, and that chunk is passed to the event listener.  The `end` event occurs once all the chunks have been recieved.  And the `error` event occurs when something goes wrong.  The chunks are [Buffer](https://nodejs.org/api/buffer.html) objects, and are always received in order.  

Thus, we need to collect each chunk from each `data` event, and join them together into a single buffer at the `end` event.  Thus, the basic scaffold for doing so is:

```js
function loadBody(req, res) {
    var chunks = [];

    // listen for data events
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });

    // listen for the end event 
    req.on('end', () => {
        // Combine the chunks 
        var data = Buffer.concat(chunks);

        // DO SOMETHING WITH DATA
    });

    // listen for error events 
    req.on('error', (err) => {
        // RESPOND APPROPRIATELY TO ERROR
    });
}
```

Note that these events occur asynchronously, so this scaffold needs to be integrated into an appropriate asynchronous processing strategy.

You might wonder why the developers of Node chose to handle request bodies in this fashion.  Most likely, it was for the degree of control it offers the programmer.  Consider the case where you decide your program needs to be able to stop an upload - you can do so with [http.IncomingMessage.destroy()](https://nodejs.org/api/http.html#http_class_http_incomingmessage), which immediately closes the socket connecting the client to the server, effectively terminating the upload.  

This can prevent the server from doing unneeded work and consuming unnecessary bandwidth.  Of course, the decision to stop an upload is highly situationally dependent - thus they leave it in your hands as the programmer.

In fact, a common Denial of Service attack known as an HTTP flood often takes advantage of POST requests to submit requests with large bodies to consume server resources.  By giving the programmer the ability to stop uploads this way helps counter this kind of attack.
