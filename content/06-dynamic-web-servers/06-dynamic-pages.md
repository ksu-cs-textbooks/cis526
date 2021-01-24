---
title: "Dynamic Pages"
pre: "6. "
weight: 60
date: 2018-08-24T10:53:26-05:00
---

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

But let's expand our thinking to tackle a more involved website


With a template library, we can start thinking about how to better structure our software to produce the web pages that our dynamic web application consists of.  The template library can be used to produce the HTML we need to serve, now we need to consider exactly which templates to use, in what combination, and what data needs to be provided to them.  