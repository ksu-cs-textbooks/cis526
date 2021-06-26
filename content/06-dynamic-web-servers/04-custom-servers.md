---
title: "Custom Servers"
pre: "4. "
weight: 40
date: 2018-08-24T10:53:26-05:00
---

While CGI Scripts and Server Pages offered ways to build dynamic websites using off-the shelf web server technologies (Apache, IIS), many programmers found these approaches limiting.  Instead, they sought to build the entire web server as a custom program.  

Node was actually developed for exactly this approach - it provides abstractions around the fundamental aspects of HTTP in its [http](https://nodejs.org/api/http.html) library.  This library handles the listening for HTTP requests, and parses the request and uses it to populate a [http.ClientRequest object](https://nodejs.org/api/http.html#http_class_http_clientrequest) and provides a [http.ServerResponse object](https://nodejs.org/api/http.html#http_class_http_serverresponse) to prepare and send the response.  These are abstractions around the HTTP Request and Response we discussed in chapter 2.

The authors of Node took advantage of the functional nature of JavaScript to make writing servers easy - we just need to provide a function to the server that takes a request/response pair.  This has been our `handleRequest()` method, and we can pack it with custom logic to determine the correct _response_ for the incoming _request_.

We've already written a number of functions that take in a request and response object, and determine the correct response to send.  This includes our `serveFile()`, and our `listDirectory()`.  We can create dynamic pages in much the same way - by writing a custom function to serve the dynamic page.   

For example, a very simple dynamic page could be created with this function:

```js
function serveTime(req, res) {
    var html = `
        <!doctype html>
        <html>
          <head>
            <title>Server Time</title>
          </head>
          <body>
            <h1>Time on the server is ${new Date()}</h1>
          </body>
        </html>
    `;
    req.writeHead(200, {
        "Content-Type": "text/html",
        "Content-Length": html.length
    }).end(html);
}
```

But for a server to be _dynamic_, we typically want more than just the ability to render a page from code.  We _also_ want to interact with the user in some meaningful way - and that means receiving data _from_ them. In the HTTP protocol there are several ways for the user to send data:

1. By the path of the request, i.e. when we request `https://support.cs.ksu.edu/CISDocs/wiki/Main_Page` the path `CISDocs/wiki/Main_Page` indicates the page we are requesting

2. By additional information contained in the URL, specifically the _query string_ (the part of the URL that follows the `?`) and the _hash string_ (the part of hte URL that follows the `#`)

3. By information contained in the _body_ of the request

We've already looked at the path portion of the URL in describing how we can implement a file server to serve files and directories.  But what about the query string and body of the request?  Let's look at how those are handled in Node next.
