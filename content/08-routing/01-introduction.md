---
title: "Introduction"
pre: "1. "
weight: 10
date: 2018-08-24T10:53:26-05:00
---

Once again, we'll return to the request-response pattern diagram.

![The Request-Response Pattern]({{<static "images/8.0.1.png">}})

We revisit this diagram because it is so central to how HTTP servers work.  At the heart, a server's primary responsibility is to respond to an incoming request.  Thus, in _writing_ a web server, our primary task is to determine what to respond with.  With static web servers, the answer is pretty simple - we map the virtual path supplied by the URL to a file path on the file server.  But the URL supplied in a request _doesn't_ have to correspond to any real object on the server - we can create any object we want, and send it back.

In our examples, we've built several functions that build specific kinds of responses.  Our `serveFile()` function serves a response representing a static file.  Our `listDirectory()` function generates an index for a directory, or if the directory contained a `index.html` file, served it instead.  And our dynamic `servePost()` from our blog served a dynamically generated HTML page that drew data from a database.

Each of these functions created a _response_.  But how do we know which of them to use?  That is the question that we will be grappling with in this chapter - and the technical term for it is _routing_.

