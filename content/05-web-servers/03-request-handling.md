---
title: "Request Handling"
pre: "3. "
weight: 30
date: 2018-08-24T10:53:26-05:00
---

An important aspect to recognize about how Node's http library operates is that _all_ requests to the server are passed to the request handler function. Thus, you need to determine what to do with the incoming request as part of that function. You will most likely use the information contained within the `http.IncomingMessage` object supplied as the first parameter to your request handler.  We often use the name `req` for this parameter, short for _request_, as it represents the incoming HTTP request.

Some of its properties we might use:

* The `req.method` parameter indicates what [HTTP method]({{rel "02-http/04-request-methods"}}) the request is using.  For example, if the method is `"GET"`, we would expect that the client is requesting a resource like an HTML page or image file.  If it were a `"POST"` request, we would think they are submitting something.

* The `req.url` parameter indicates the specific resource path the client is requesting, i.e. `"/about.html"` suggests they are looking for the "about" page.  The url can have more parts than just the path.  It also can contain a query string and a hash string.  We'll talk more about these soon.

* The `req.headers` parameter contains all the headers that were set on this particular request.  Of specific interest are _authentication_ headers (which help say who is behind the request and determine if the server should allow the request), and _cookie_ headers.  We'll talk more about this a bit further into the course, when we introduce the associated concepts.

Generally, we use properties in combination to determine what the correct response is.  As a programmer, you probably already realize that this decsion-making process must involve some sort of [control flow](https://en.wikipedia.org/wiki/Control_flow) structure, like an [if statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) or [switch case statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch).

Let's say we only want to handle `"GET"` requests for the files _index.html_, _site.css_, and _site.js_.  We could write our request handler using both an `if else` statement and a `switch` statement:

```js
function handleRequest(req, res) {
    if(req.method === "GET") {
        switch(req.url) {
            case "/index.html":
                // TODO: Serve the index page 
                break;
            case "/site.css":
                // TODO: Serve the css file 
                break;
            case "/site.js":
                // TODO: Serve teh js file
                break;
            default:
                // TODO: Serve a 404 Not Found response
        }
    } else {
        // TODO: Serve a 501 Not Implemented response
    }
}
```

Notice that at each branching point of our control flow, we serve some kind of response to the requesting web client.  _Every_ request should be sent a response - even unsuccessful ones.  If we do not, then the browser will _timeout_, and report a timeout error to the user.

![handleRequest() flowchart]({{<static "images/5.3.1.png">}})

