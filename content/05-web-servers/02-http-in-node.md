---
title: "HTTP in Node"
pre: "2. "
weight: 20
date: 2018-08-24T10:53:26-05:00
---

Node was written primarily to provide tools to develop web servers.  So it should come as no surprise that it supports HTTP through a built-in library, the [http module](https://nodejs.org/api/http.html).  This module provides support for creating _both_ web servers and web clients, as well as working with http requests and responses.  Let's start by examining the latter.

## Node HTTP Request
Remember that a HTTP request is nothing more than a stream of text formatted according to the HTTP standards, as we discussed in [Chapter 2]({{% ref "02-http/03-request-format" %}}).  Node makes this information easier to work with in your server code by parsing it into an object, an instance of [http.IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage).  Its properties expose the data of the request, and include:

* [message.headers](https://nodejs.org/api/http.html#http_message_headers) - the request headers as a JavaScript object, with the keys corresponding to the HTTP header key, and the values corresponding to the HTTP header values.
* [message.method](https://nodejs.org/api/http.html#http_message_method) - request method, i.e. `'GET'`, `'POST'`, `'PUT'`, `'PATCH'`, or `'DELETE'`
* [message.url](https://nodejs.org/api/http.html#http_message_url) - the URL string provided through the request.  Note that this URL does not contain the protocol and host information (those were set during the connection opening process)

You typically won't create an `http.IncomingMessage`, rather it will be provided to you by an instance of `http.Server`, which we'll talk about shortly.

## Node HTTP Response
The HTTP response is also nothing more than a stream of text formatted according to the HTTP standards, as laid out in [Chapter 2]({{% ref "02-http/08-response-format" %}}).  Node also wraps the response with an object, an instance of [http.ServerResponse](https://nodejs.org/api/http.html#http_class_http_serverresponse).  However, this object is used to _build_ the response (which is the primary job of a web server).  This process proceeds in several steps:

1. Setting the status code & message
2. Setting the headers
3. Setting the body 
4. Setting the trailers
5. Sending the response

Not all of these steps are required for all responses, with the exception of the sending of the response.  We'll discuss the process of generating a response in more detail later.  As with the `http.IncomingMessage`, you won't directly create `http.ServerResponse` objects, instead they will be created by an instance of `http.Server`, which we'll look at next.

## Node HTTP Server
The [http.Server](https://nodejs.org/api/http.html#http_class_http_server) class embodies the basic operating core of a webserver, which you can build upon to create your own web server implementations.  Instances of `http.Server` are created with the factory method [http.createServer()](https://nodejs.org/api/http.html#http_http_createserver_options_requestlistener).  This method takes two parameters, the first is an optional JavaScript object with options for the server, and the second (or first, if the `options` parameter is omitted) is a callback function to invoke every time the server receives a request.  As you might expect, the method returns the created `http.Server` instance.

The callback function always takes two parameters.  The first is an instance of `http.IncomingMessage` (often assigned to a variable named `req`) that represents the request the server has received, and the second is an instance of `http.ServerResponse` (often assigned to available named `res`) that represents the response the server will send back to the client, once you have set all its properties.  This callback is often called the _request handler_, for it decides what to do with incoming requests.  Each incoming request is handled _asynchronously_, much like any event.

Once the server has been created, it needs to be told to listen for incoming requests.  It will do so on a specific [port](https://en.wikipedia.org/wiki/Port_(computer_networking)). This port is represented by a number between 0 and 65535.  You can think of your computer as an apartment complex, and each port number corresponding to an apartment number where a specific program "lives".  Thus, to send a message to that particular program, you would address your letter to the apartment address using the apartment number.  In this analogy, the apartment address is the _host address_, i.e. the IP address of your computer, and the specific apartment is the _port_.  Certain port numbers are commonly used by specific applications or families of applications, i.e. web servers typically use port 80 for HTTP and port 443 for HTTPS connections.  However, when you are developing a webserver, you'll typically use a non-standard port, often an address 3000 and up.  

Thus, to start your webserver running on port 3000, you would invoke [server.Listen()] with that port as the first argument.  An optional second argument is a callback function invoked once the server is up and running - it is usually used to log a message saying the server is running.

### An Example Server 
A quick example of a server that only responds with the message "Hello web!" would be:

```js
const http = require('http');
const server = http.createServer((req, res) => {
    req.end("Hello web!");
});
server.listen(3000, () => {
    console.log("Server listening at port 3000");
});
```

Once the server is running, you can visit [http://localhost:3000](http://localhost:3000) on the same computer to see the phrase "Hello web!" printed in your browser.

The `localhost` hostname is a special _loopback_ host, which indicates instead of looking for a computer on the web, you're wanting to access the computer you're currently on.  The `:3000` specifies the browser should make the request to the non-standard port of `3000`.  If we instead used port `80`, we could omit the port in the URL, as by default the browser will use port `80` for http requests.
